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
  if (variant.stockQuantity < quantity) throw ApiError.badRequest('Not enough stock');

  const cart = await getOrCreateCart(userId);

  const existingItem = cart.items.find(i => i.variantId === variantId);

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
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

module.exports = { getOrCreateCart, addItem, updateItem, removeItem, clearCart };