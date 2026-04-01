const prisma = require('../../config/prisma');
const ApiError = require('../../utils/ApiError');

const getAll = async ({ page = 1, limit = 10, categoryId, isActive } = {}) => {
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));
  const skip = (pageNum - 1) * limitNum;
  
  const where = {};
  if (categoryId) where.categoryId = categoryId;
  if (isActive !== undefined) where.isActive = isActive;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limitNum,
      include: {
        category: true,
        variants: true,
      },
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total, page: pageNum, limit: limitNum };
};

const getById = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      variants: true,
      reviews: true,
    },
  });
  if (!product) throw ApiError.notFound('Product not found');
  return product;
};

const create = async (data) => {
  return prisma.product.create({
    data,
    include: { category: true, variants: true },
  });
};

const update = async (id, data) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw ApiError.notFound('Product not found');
  return prisma.product.update({
    where: { id },
    data,
    include: { category: true, variants: true },
  });
};

const remove = async (id) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw ApiError.notFound('Product not found');
  return prisma.product.delete({ where: { id } });
};

const createVariant = async (productId, data) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw ApiError.notFound('Product not found');

  const existingSku = await prisma.productVariant.findUnique({ where: { sku: data.sku } });
  if (existingSku) throw ApiError.conflict('This SKU already exists');

  return prisma.productVariant.create({
    data: { ...data, productId },
  });
};

module.exports = { getAll, getById, create, update, remove, createVariant };