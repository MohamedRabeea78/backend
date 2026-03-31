const prisma = require('../../config/prisma');
const ApiError = require('../../utils/ApiError');

const getBalance = async (userId) => {
  const loyalty = await prisma.loyaltyPoints.findUnique({ where: { userId } });
  return loyalty || { userId, currentBalance: 0 };
};

const getTransactions = async (userId) => {
  return prisma.loyaltyTransaction.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

const adjustPoints = async ({ userId, amount, reason }) => {
  return prisma.$transaction(async (tx) => {
    const loyalty = await tx.loyaltyPoints.upsert({
      where: { userId },
      update: { currentBalance: { increment: amount } },
      create: { userId, currentBalance: amount },
    });

    if (loyalty.currentBalance < 0) throw ApiError.badRequest('Insufficient balance');

    await tx.loyaltyTransaction.create({
      data: { userId, changeAmount: amount, reason },
    });

    return loyalty;
  });
};

module.exports = { getBalance, getTransactions, adjustPoints };
