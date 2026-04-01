const prisma = require('../../config/prisma');
const Decimal = require('decimal.js');
const ApiError = require('../../utils/ApiError');
const { POINTS_PER_EGP, EGP_PER_POINT, CARD_FEE_PERCENTAGE } = require('../../utils/constants');

const createOrder = async (userId, { addressId, paymentMethod, couponCode, pointsToRedeem = 0 }) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { variant: { include: { product: true } } } } },
  });

  if (!cart || cart.items.length === 0) throw ApiError.badRequest('Cart is empty');

  const address = await prisma.address.findUnique({
    where: { id: addressId },
    include: { shippingRegion: true },
  });

  if (!address || address.userId !== userId) throw ApiError.notFound('Address not found');

  for (const item of cart.items) {
    const currentVariant = await prisma.productVariant.findUnique({
      where: { id: item.variantId },
    });
    
    if (!currentVariant || currentVariant.stockQuantity < item.quantity) {
      throw ApiError.badRequest(
        `Product "${item.variant.product.nameAr}" is no longer available in the requested quantity. Available: ${currentVariant?.stockQuantity || 0}`
      );
    }
  }

  let subtotal = new Decimal(0);
  for (const item of cart.items) {
    const basePrice = new Decimal(item.variant.product.basePrice);
    const modifier = new Decimal(item.variant.priceModifier);
    const itemPrice = basePrice.plus(modifier);
    subtotal = subtotal.plus(itemPrice.times(item.quantity));
  }

  const shippingFee = new Decimal(address.shippingRegion?.shippingFee || 0);

  let couponDiscount = new Decimal(0);
  let coupon = null;
  if (couponCode) {
    coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
    if (!coupon || !coupon.isActive) throw ApiError.badRequest('Invalid coupon');
    if (coupon.expiresAt && coupon.expiresAt < new Date()) throw ApiError.badRequest('Coupon expired');
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) throw ApiError.badRequest('Coupon usage limit reached');
    
    const minAmount = new Decimal(coupon.minOrderAmount);
    if (subtotal.lt(minAmount)) {
      throw ApiError.badRequest(`Minimum order amount is ${coupon.minOrderAmount}`);
    }

    const discountValue = new Decimal(coupon.discountValue);
    if (coupon.discountType === 'PERCENTAGE') {
      couponDiscount = subtotal.times(discountValue).dividedBy(100);
    } else {
      couponDiscount = discountValue;
    }
  }

  let pointsDiscount = new Decimal(0);
  if (pointsToRedeem > 0) {
    const loyalty = await prisma.loyaltyPoints.findUnique({ where: { userId } });
    if (!loyalty || loyalty.currentBalance < pointsToRedeem) {
      throw ApiError.badRequest('Not enough loyalty points');
    }
    pointsDiscount = new Decimal(pointsToRedeem).times(EGP_PER_POINT);
  }

  let paymentMethodFee = new Decimal(0);
  if (paymentMethod === 'CARD') {
    paymentMethodFee = subtotal.times(CARD_FEE_PERCENTAGE).dividedBy(100);
  }

  const finalAmount = subtotal
    .plus(shippingFee)
    .plus(paymentMethodFee)
    .minus(couponDiscount)
    .minus(pointsDiscount);

  const finalAmountNum = parseFloat(finalAmount.toString());

  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId,
        addressId,
        couponId: coupon?.id,
        paymentMethod,
        shippingFee: parseFloat(shippingFee.toString()),
        paymentMethodFee: parseFloat(paymentMethodFee.toString()),
        couponDiscount: parseFloat(couponDiscount.toString()),
        pointsDiscount: parseFloat(pointsDiscount.toString()),
        finalAmount: finalAmountNum,
        items: {
          create: cart.items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
            priceAtPurchase: parseFloat(
              new Decimal(item.variant.product.basePrice)
                .plus(item.variant.priceModifier)
                .toString()
            ),
          })),
        },
        statusHistory: {
          create: { status: 'PENDING', comment: 'Order placed' },
        },
      },
      include: { items: true, statusHistory: true },
    });

    for (const item of cart.items) {
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: { stockQuantity: { decrement: item.quantity } },
      });
    }

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    if (coupon) {
      await tx.coupon.update({
        where: { id: coupon.id },
        data: { usedCount: { increment: 1 } },
      });
    }

    const pointsEarned = Math.round(finalAmountNum * POINTS_PER_EGP);
    await tx.loyaltyPoints.upsert({
      where: { userId },
      update: { currentBalance: { increment: pointsEarned } },
      create: { userId, currentBalance: pointsEarned },
    });

    await tx.loyaltyTransaction.create({
      data: {
        userId,
        orderId: newOrder.id,
        changeAmount: pointsEarned,
        reason: 'EARN_ORDER',
      },
    });

    if (pointsToRedeem > 0) {
      await tx.loyaltyPoints.update({
        where: { userId },
        data: { currentBalance: { decrement: pointsToRedeem } },
      });
      await tx.loyaltyTransaction.create({
        data: {
          userId,
          orderId: newOrder.id,
          changeAmount: -pointsToRedeem,
          reason: 'REDEEM',
        },
      });
    }

    return newOrder;
  });

  return order;
};

const getMyOrders = async (userId) => {
  return prisma.order.findMany({
    where: { userId },
    include: { items: true, statusHistory: true, address: true },
    orderBy: { createdAt: 'desc' },
  });
};

const getOrderById = async (id, userId, role) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { variant: { include: { product: true } } } }, statusHistory: true, address: true },
  });
  if (!order) throw ApiError.notFound('Order not found');
  if (role !== 'ADMIN' && order.userId !== userId) throw ApiError.forbidden('Access denied');
  return order;
};

const updateStatus = async (id, { status, comment }) => {
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) throw ApiError.notFound('Order not found');

  const validTransitions = {
    PENDING: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['PROCESSING', 'CANCELLED'],
    PROCESSING: ['SHIPPED', 'CANCELLED'],
    SHIPPED: ['DELIVERED'],
    DELIVERED: [],
    CANCELLED: [],
    REFUNDED: [],
  };

  if (!validTransitions[order.status]) {
    throw ApiError.badRequest(
      `Order status "${order.status}" does not exist or is invalid`
    );
  }

  if (!validTransitions[order.status].includes(status)) {
    throw ApiError.badRequest(
      `Cannot transition from "${order.status}" to "${status}". Valid transitions: ${validTransitions[order.status].join(', ')}`
    );
  }

  if (['DELIVERED', 'REFUNDED'].includes(order.status)) {
    throw ApiError.forbidden(
      `Cannot modify ${order.status} order. Order is finalized.`
    );
  }

  const willBeCancelled = status === 'CANCELLED' && order.status !== 'CANCELLED';
  
  if (willBeCancelled) {
    const orderItems = await prisma.orderItem.findMany({
      where: { orderId: id },
    });

    return await prisma.$transaction(async (tx) => {
      for (const item of orderItems) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stockQuantity: { increment: item.quantity } },
        });
      }
      return await tx.order.update({
        where: { id },
        data: {
          status,
          statusHistory: {
            create: { status, comment },
          },
        },
        include: { statusHistory: true },
      });
    });
  }

  return prisma.order.update({
    where: { id },
    data: {
      status,
      statusHistory: {
        create: { status, comment },
      },
    },
    include: { statusHistory: true },
  });
};

module.exports = { createOrder, getMyOrders, getOrderById, updateStatus };
