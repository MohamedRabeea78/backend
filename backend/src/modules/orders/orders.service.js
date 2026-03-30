const Decimal = require('decimal.js');
const prisma = require('../../config/prisma');
const ApiError = require('../../utils/ApiError');
const { PAYMENT_METHOD, CARD_FEE_PERCENTAGE, EGP_PER_POINT, LOYALTY_REASON } = require('../../utils/constants');

/**
 * Creates a new order from the user's cart
 */
const createOrder = async (userId, { addressId, paymentMethod, couponCode, pointsToRedeem }) => {
  // 1. Fetch Cart and its items
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          variant: {
            include: { product: true },
          },
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    throw ApiError.badRequest('Cart is empty');
  }

  // 2. Fetch the delivery address and shipping region
  const address = await prisma.address.findUnique({
    where: { id: addressId },
    include: { shippingRegion: true },
  });

  if (!address || address.userId !== userId) {
    throw ApiError.badRequest('Invalid or unauthorized address');
  }

  // Use a Prisma transaction so that stock deduction, point deduction and order creation
  // happen atomically. If any operation fails, everything rolls back.
  const order = await prisma.$transaction(async (tx) => {
    let totalProductPrice = new Decimal(0);
    const orderItemsData = [];

    // 3. Verify stock availability and compute products total
    for (const item of cart.items) {
      // Re-fetch variant within transaction to get live stock
      const variant = await tx.productVariant.findUnique({
        where: { id: item.variantId },
        include: { product: true },
      });

      if (!variant) {
        throw ApiError.notFound(`Variant ${item.variantId} not found`);
      }

      if (variant.stockQuantity < item.quantity) {
        throw ApiError.badRequest(`Insufficient stock for product variant: ${variant.sku}`);
      }

      const basePrice = new Decimal(variant.product.basePrice);
      const modifier = new Decimal(variant.priceModifier);
      const itemPrice = basePrice.plus(modifier);
      const itemTotal = itemPrice.times(item.quantity);

      totalProductPrice = totalProductPrice.plus(itemTotal);

      // 4. Update Stock
      await tx.productVariant.update({
        where: { id: variant.id },
        data: { stockQuantity: { decrement: item.quantity } },
      });

      orderItemsData.push({
        variantId: variant.id,
        quantity: item.quantity,
        priceAtPurchase: itemPrice,
      });
    }

    // 5. Calculate Shipping Fee
    const shippingFee = new Decimal(address.shippingRegion.shippingFee);

    // 6. Calculate Electronic Payment Fee
    let paymentFee = new Decimal(0);
    if (paymentMethod === PAYMENT_METHOD.CARD) {
      paymentFee = totalProductPrice.times(CARD_FEE_PERCENTAGE).dividedBy(100);
    }

    // 7. Calculate Discounts (Loyalty Points)
    let pointsDiscount = new Decimal(0);
    if (pointsToRedeem > 0) {
      const loyalty = await tx.loyaltyPoints.findUnique({ where: { userId } });
      if (!loyalty || loyalty.currentBalance < pointsToRedeem) {
        throw ApiError.badRequest('Insufficient loyalty points');
      }

      pointsDiscount = new Decimal(pointsToRedeem).times(EGP_PER_POINT);
    }

    // 8. Calculate Discounts (Coupon)
    let couponDiscount = new Decimal(0);
    let validCoupon = null;

    if (couponCode) {
      validCoupon = await tx.coupon.findUnique({ where: { code: couponCode } });
      
      if (!validCoupon || !validCoupon.isActive) {
        throw ApiError.badRequest('Invalid coupon');
      }
      
      if (validCoupon.expiresAt && validCoupon.expiresAt < new Date()) {
        throw ApiError.badRequest('Coupon has expired');
      }

      if (new Decimal(validCoupon.minOrderAmount).greaterThan(totalProductPrice)) {
        throw ApiError.badRequest(`Order amount must be at least ${validCoupon.minOrderAmount} to use this coupon`);
      }

      if (validCoupon.maxUses && validCoupon.usedCount >= validCoupon.maxUses) {
        throw ApiError.badRequest('Coupon usage limit reached');
      }

      if (validCoupon.discountType === 'PERCENTAGE') {
        couponDiscount = totalProductPrice.times(validCoupon.discountValue).dividedBy(100);
      } else {
        // FIXED TYPE
        couponDiscount = new Decimal(validCoupon.discountValue);
      }

      // Max out the coupon discount to the product total
      if (couponDiscount.greaterThan(totalProductPrice)) {
        couponDiscount = totalProductPrice;
      }
    }

    // 9. Final Amount Calculation
    // Equation: (totalProductPrice + shippingFee + paymentFee) - (couponDiscount + pointsDiscount)
    let finalAmount = totalProductPrice
      .plus(shippingFee)
      .plus(paymentFee)
      .minus(couponDiscount)
      .minus(pointsDiscount);

    if (finalAmount.lessThan(0)) {
      finalAmount = new Decimal(0);
    }

    // 10. Create the Order
    const newOrder = await tx.order.create({
      data: {
        userId,
        addressId,
        couponId: validCoupon ? validCoupon.id : null,
        status: 'PENDING',
        paymentMethod,
        paymentStatus: 'PENDING',
        shippingFee: shippingFee,
        paymentMethodFee: paymentFee,
        pointsDiscount: pointsDiscount,
        couponDiscount: couponDiscount,
        finalAmount: finalAmount,
        items: {
          create: orderItemsData,
        },
        statusHistory: {
          create: { status: 'PENDING', comment: 'Order created successfully' },
        },
      },
      include: {
        items: true,
      },
    });

    // 11. Process Loyalty Deduction & History
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
          reason: LOYALTY_REASON.REDEEM,
        },
      });
    }

    // 12. Process Coupon Usage Increment
    if (validCoupon) {
      await tx.coupon.update({
        where: { id: validCoupon.id },
        data: { usedCount: { increment: 1 } },
      });
    }

    // 13. Empty the Cart
    await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return newOrder;
  });

  return order;
};

module.exports = {
  createOrder,
};
