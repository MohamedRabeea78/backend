const prisma = require('../../config/prisma');
const ApiError = require('../../utils/ApiError');

const create = async (userId, data) => {
  const existing = await prisma.review.findUnique({
    where: { productId_userId: { productId: data.productId, userId } },
  });
  if (existing) throw ApiError.conflict('You have already reviewed this product');
  return prisma.review.create({
    data: { ...data, userId },
  });
};

const getProductReviews = async (productId) => {
  return prisma.review.findMany({
    where: { productId },
    include: { user: { select: { firstName: true, lastName: true } } },
    orderBy: { createdAt: 'desc' },
  });
};

const remove = async (userId, id, role) => {
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) throw ApiError.notFound('Review not found');
  if (role !== 'ADMIN' && review.userId !== userId) throw ApiError.forbidden('Access denied');
  return prisma.review.delete({ where: { id } });
};

module.exports = { create, getProductReviews, remove };
