const prisma = require('../../config/prisma');

const get = async (uId) => {
    return await prisma.cart.upsert({
        where: { userId: uId },
        update: {},
        create: { userId: uId },
        include: {
            items: {
                include: {
                    variant: { include: { product: true } }
                }
            }
        }
    });
};

const add = async (uId, vId, q) => {
    const c = await get(uId);
    return await prisma.cartItem.upsert({
        where: {
            cartId_variantId: { cartId: c.id, variantId: vId }
        },
        update: { quantity: { increment: q } },
        create: { cartId: c.id, variantId: vId, quantity: q }
    });
};

const update = async (uId, vId, q) => {
    const c = await get(uId);
    return await prisma.cartItem.update({
        where: {
            cartId_variantId: { cartId: c.id, variantId: vId }
        },
        data: { quantity: q }
    });
};

const remove = async (uId, vId) => {
    const c = await get(uId);
    return await prisma.cartItem.delete({
        where: {
            cartId_variantId: { cartId: c.id, variantId: vId }
        }
    });
};

const clear = async (uId) => {
    const c = await get(uId);
    return await prisma.cartItem.deleteMany({
        where: { cartId: c.id }
    });
};

module.exports = { get, add, update, remove, clear };