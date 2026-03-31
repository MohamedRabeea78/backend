const prisma = require('../../config/prisma');
const ApiError = require('../../utils/ApiError');

const getMyAddresses = async (userId) => {
  return prisma.address.findMany({
    where: { userId },
    include: { shippingRegion: true },
  });
};

const create = async (userId, { regionId, addressDetails, isPrimary = false }) => {
  if (isPrimary) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isPrimary: false },
    });
  }
  return prisma.address.create({
    data: { userId, regionId, addressDetails, isPrimary },
    include: { shippingRegion: true },
  });
};

const update = async (userId, id, data) => {
  const address = await prisma.address.findUnique({ where: { id } });
  if (!address || address.userId !== userId) throw ApiError.notFound('Address not found');

  if (data.isPrimary) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isPrimary: false },
    });
  }

  return prisma.address.update({
    where: { id },
    data,
    include: { shippingRegion: true },
  });
};

const remove = async (userId, id) => {
  const address = await prisma.address.findUnique({ where: { id } });
  if (!address || address.userId !== userId) throw ApiError.notFound('Address not found');
  return prisma.address.delete({ where: { id } });
};

module.exports = { getMyAddresses, create, update, remove };
