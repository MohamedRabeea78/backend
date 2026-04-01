const prisma = require('../../config/prisma');
const ApiError = require('../../utils/ApiError');

const getOrCreateCart = async (userId) => {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: { variant: { include: { product: true } } },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: {
        items: {
          include: { variant: { include: { product: true } } },
        },
      },
    });
  }

  return cart;
};

const addItem = async (userId, { variantId, quantity }) => {
  const variant = await prisma.productVariant.findUnique({ where: { id: variantId } });
  if (!variant) throw ApiError.notFound('Variant not found');
  
  // Validate requested quantity
  if (variant.stockQuantity < quantity) {
    throw ApiError.badRequest(`Only ${variant.stockQuantity} items available`);
  }

  const cart = await getOrCreateCart(userId);
  const existingItem = cart.items.find(i => i.variantId === variantId);

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    
    // Validate total quantity doesn't exceed stock
    if (newQuantity > variant.stockQuantity) {
      throw ApiError.badRequest(
        `Cannot add that many. Total would be ${newQuantity} but only ${variant.stockQuantity} available`
      );
    }
    
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQuantity },
    });
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, variantId, quantity },
    });
  }

  return getOrCreateCart(userId);
};

const updateItem = async (userId, variantId, quantity) => {
  const cart = await getOrCreateCart(userId);
  const item = cart.items.find(i => i.variantId === variantId);
  if (!item) throw ApiError.notFound('Item not found in cart');

  const variant = await prisma.productVariant.findUnique({ where: { id: variantId } });
  if (!variant) throw ApiError.notFound('Variant not found');
  
  if (variant.stockQuantity < quantity) {
    throw ApiError.badRequest(
      `Cannot update. Only ${variant.stockQuantity} items available`
    );
  }

  await prisma.cartItem.update({
    where: { id: item.id },
    data: { quantity },
  });

  return getOrCreateCart(userId);
};

const removeItem = async (userId, variantId) => {
  const cart = await getOrCreateCart(userId);
  const item = cart.items.find(i => i.variantId === variantId);
  if (!item) throw ApiError.notFound('Item not found in cart');

  await prisma.cartItem.delete({ where: { id: item.id } });

  return getOrCreateCart(userId);
};

const clearCart = async (userId) => {
  const cart = await getOrCreateCart(userId);
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  return getOrCreateCart(userId);
};

const mergeGuestCart = async (userId, guestCartItems = []) => {
  const userCart = await getOrCreateCart(userId);

  return await prisma.$transaction(async (tx) => {
    let currentCart = await tx.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    for (const guestItem of guestCartItems) {
      const variant = await tx.productVariant.findUnique({
        where: { id: guestItem.variantId },
      });
      
      if (!variant) continue;

      const existingItem = currentCart.items.find(i => i.variantId === guestItem.variantId);
      const totalQuantity = (existingItem?.quantity || 0) + guestItem.quantity;

      if (totalQuantity > variant.stockQuantity) {
        throw ApiError.badRequest(
          `Cannot merge cart. Product has only ${variant.stockQuantity} available.`
        );
      }

      if (existingItem) {
        await tx.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: totalQuantity },
        });
      } else {
        await tx.cartItem.create({
          data: { cartId: currentCart.id, variantId: guestItem.variantId, quantity: guestItem.quantity },
        });
      }
    }

    return await tx.cart.findUnique({
      where: { userId },
      include: { items: { include: { variant: { include: { product: true } } } } },
    });
  });
};

module.exports = { getOrCreateCart, addItem, updateItem, removeItem, clearCart, mergeGuestCart };