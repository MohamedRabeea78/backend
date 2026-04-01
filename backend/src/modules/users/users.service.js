const bcrypt = require('bcryptjs');
const prisma = require('../../config/prisma');
const ApiError = require('../../utils/ApiError');
const env = require('../../config/env');

const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true, firstName: true, lastName: true, phoneNumber: true, birthday: true, createdAt: true },
  });
  if (!user) throw ApiError.notFound('User not found');
  return user;
};

const updateProfile = async (userId, data) => {
  return prisma.user.update({
    where: { id: userId },
    data,
    select: { id: true, email: true, role: true, firstName: true, lastName: true, phoneNumber: true, birthday: true },
  });
};

const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw ApiError.notFound('User not found');

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) throw ApiError.badRequest('Current password is incorrect');

  const isSamePassword = await bcrypt.compare(newPassword, user.passwordHash);
  if (isSamePassword) throw ApiError.badRequest('New password must be different from current password');

  const passwordHash = await bcrypt.hash(newPassword, env.BCRYPT_SALT_ROUNDS);
  return prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
    select: { id: true, email: true },
  });
};

const getAllUsers = async () => {
  return prisma.user.findMany({
    select: { id: true, email: true, role: true, firstName: true, lastName: true, createdAt: true },
  });
};

const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, role: true, firstName: true, lastName: true, createdAt: true },
  });
  if (!user) throw ApiError.notFound('User not found');
  return user;
};

module.exports = { getProfile, updateProfile, changePassword, getAllUsers, getUserById };
