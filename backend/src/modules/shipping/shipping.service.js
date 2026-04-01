const prisma = require('../../config/prisma');
const ApiError = require('../../utils/ApiError');

const getAll = async () => prisma.shippingRegion.findMany();

const getById = async (id) => {
  const region = await prisma.shippingRegion.findUnique({ where: { id: parseInt(id) } });
  if (!region) throw ApiError.notFound('Shipping region not found');
  return region;
};

const create = async (data) => prisma.shippingRegion.create({ data });

const update = async (id, data) => {
  const region = await prisma.shippingRegion.findUnique({ where: { id: parseInt(id) } });
  if (!region) throw ApiError.notFound('Shipping region not found');
  return prisma.shippingRegion.update({ where: { id: parseInt(id) }, data });
};

const remove = async (id) => {
  const region = await prisma.shippingRegion.findUnique({ where: { id: parseInt(id) } });
  if (!region) throw ApiError.notFound('Shipping region not found');
  return prisma.shippingRegion.delete({ where: { id: parseInt(id) } });
};

module.exports = { getAll, getById, create, update, remove };
