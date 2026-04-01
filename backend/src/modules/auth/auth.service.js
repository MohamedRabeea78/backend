const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../../config/prisma');
const ApiError = require('../../utils/ApiError');
const env = require('../../config/env');

const register = async ({ email, password, firstName, lastName }) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw ApiError.conflict('Email already in use');

  const passwordHash = await bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);

  const user = await prisma.user.create({
    data: { email, passwordHash, firstName, lastName },
    select: { id: true, email: true, role: true, createdAt: true },
  });

  const token = jwt.sign({ id: user.id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });

  return { user, token };
};

const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw ApiError.unauthorized('Invalid credentials');

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw ApiError.unauthorized('Invalid credentials');

  const token = jwt.sign({ id: user.id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });

  return {
    user: { id: user.id, email: user.email, role: user.role },
    token,
  };
};

module.exports = { register, login };