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
  const campaign = await prisma.campaign.findUnique({ where: { id } });
  if (!campaign) throw ApiError.notFound('Campaign not found');
  
  const { productIds, ...campaignData } = data;
  const updateData = { ...campaignData };
  
  if (Array.isArray(productIds) && productIds.length > 0) {
    await prisma.campaignProduct.deleteMany({ where: { campaignId: id } });
    updateData.campaignProducts = {
      create: productIds.map(productId => ({ productId }))
    };
  }
  
  return prisma.campaign.update({
    where: { id },
    data: updateData,
    include: { campaignProducts: { include: { product: true } }, category: true },
  });
};

const remove = async (id) => {
  return prisma.campaign.delete({ where: { id } });
};

module.exports = { getAll, getActive, create, update, remove };
