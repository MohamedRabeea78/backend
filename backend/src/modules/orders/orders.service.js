const prisma = require('../../config/prisma');
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

  let subtotal = 0;
  for (const item of cart.items) {
    const price = parseFloat(item.variant.product.basePrice) + parseFloat(item.variant.priceModifier);
    subtotal += price * item.quantity;
  }

  const shippingFee = parseFloat(address.shippingRegion?.shippingFee || 0);

  let couponDiscount = 0;
  let coupon = null;
  if (couponCode) {
    coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
    if (!coupon || !coupon.isActive) throw ApiError.badRequest('Invalid coupon');
    if (coupon.expiresAt && coupon.expiresAt < new Date()) throw ApiError.badRequest('Coupon expired');
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) throw ApiError.badRequest('Coupon usage limit reached');
    if (subtotal < parseFloat(coupon.minOrderAmount)) throw ApiError.badRequest(`Minimum order amount is ${coupon.minOrderAmount}`);

    if (coupon.discountType === 'PERCENTAGE') {
      couponDiscount = (subtotal * parseFloat(coupon.discountValue)) / 100;
    } else {
      couponDiscount = parseFloat(coupon.discountValue);
    }
  }

  let pointsDiscount = 0;
  if (pointsToRedeem > 0) {
    const loyalty = await prisma.loyaltyPoints.findUnique({ where: { userId } });
    if (!loyalty || loyalty.currentBalance < pointsToRedeem) throw ApiError.badRequest('Not enough loyalty points');
    pointsDiscount = pointsToRedeem * EGP_PER_POINT;
  }

  let paymentMethodFee = 0;
  if (paymentMethod === 'CARD') {
    paymentMethodFee = (subtotal * CARD_FEE_PERCENTAGE) / 100;
  }

  const finalAmount = subtotal + shippingFee + paymentMethodFee - couponDiscount - pointsDiscount;

  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId,
        addressId,
        couponId: coupon?.id,
        paymentMethod,
        shippingFee,
        paymentMethodFee,
        couponDiscount,
        pointsDiscount,
        finalAmount,
        items: {
          create: cart.items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
            priceAtPurchase: parseFloat(item.variant.product.basePrice) + parseFloat(item.variant.priceModifier),
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

    const pointsEarned = Math.floor(finalAmount * POINTS_PER_EGP);
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
