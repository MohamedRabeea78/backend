const prisma = require('../../config/prisma');
const ApiError = require('../../utils/ApiError');

const getAll = async () => {
  return prisma.coupon.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

const getByCode = async (code) => {
  const coupon = await prisma.coupon.findUnique({ where: { code } });
  
  if (!coupon) throw ApiError.notFound('Coupon not found');
  if (!coupon.isActive) throw ApiError.badRequest('Coupon is not active');
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    throw ApiError.badRequest('Coupon has expired');
  }
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    throw ApiError.badRequest('Coupon usage limit reached');
  }

  return coupon;
};

const create = async (data) => {
  const exists = await prisma.coupon.findUnique({ where: { code: data.code } });
  if (exists) throw ApiError.conflict('Coupon code already exists');
  
  return prisma.coupon.create({ data });
};

const update = async (id, data) => {
  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon) throw ApiError.notFound('Coupon not found');
  
  if (data.code && data.code !== coupon.code) {
    const exists = await prisma.coupon.findUnique({ where: { code: data.code } });
    if (exists) throw ApiError.conflict('Coupon code already exists');
  }

  return prisma.coupon.update({ where: { id }, data });
};

const remove = async (id) => {
  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon) throw ApiError.notFound('Coupon not found');
  
  return prisma.coupon.delete({ where: { id } });
};

module.exports = { getAll, getByCode, create, update, remove };
