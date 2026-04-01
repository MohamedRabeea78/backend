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
  const validReasons = ['EARN_ORDER', 'REDEEM', 'MANUAL_ADJUST'];
  if (!validReasons.includes(reason)) {
    throw ApiError.badRequest('Invalid reason for points adjustment');
  }

  return prisma.$transaction(async (tx) => {
    let loyalty = await tx.loyaltyPoints.findUnique({ where: { userId } });
    const newBalance = (loyalty?.currentBalance || 0) + amount;

    if (newBalance < 0) {
      throw ApiError.badRequest(`Insufficient balance. You have ${loyalty?.currentBalance || 0} points`);
    }

    loyalty = await tx.loyaltyPoints.upsert({
      where: { userId },
      update: { currentBalance: { increment: amount } },
      create: { userId, currentBalance: Math.max(0, amount) },
    });

    await tx.loyaltyTransaction.create({
      data: { userId, changeAmount: amount, reason },
    });

    return loyalty;
  });
};

module.exports = { getBalance, getTransactions, adjustPoints };
