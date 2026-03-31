const prisma = require('../../config/prisma');
const ApiError = require('../../utils/ApiError');

const getAll = async () => {
  return prisma.campaign.findMany({
    include: { campaignProducts: { include: { product: true } }, category: true },
    orderBy: { startDate: 'desc' },
  });
};

const getActive = async () => {
  const now = new Date();
  return prisma.campaign.findMany({
    where: { isActive: true, startDate: { lte: now }, endDate: { gte: now } },
    include: { category: true },
  });
};

const create = async (data) => {
  const { productIds, ...campaignData } = data;
  return prisma.campaign.create({
    data: {
      ...campaignData,
      campaignProducts: productIds ? {
        create: productIds.map(id => ({ productId: id }))
      } : undefined
    }
  });
};

const update = async (id, data) => {
  return prisma.campaign.update({
    where: { id },
    data
  });
};

const remove = async (id) => {
  return prisma.campaign.delete({ where: { id } });
};

module.exports = { getAll, getActive, create, update, remove };
