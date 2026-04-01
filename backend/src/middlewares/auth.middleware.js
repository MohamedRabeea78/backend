const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('./asyncHandler');
const env = require('../config/env');
const { ROLES } = require('../utils/constants');

/**
 * Verify JWT and attach `req.user = { id, email, role }`.
 * Any route that uses this middleware is protected.
 */
const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw ApiError.unauthorized('No token provided');
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, env.JWT_SECRET);
  } catch (err) {
    throw err; // handled by error middleware (JsonWebTokenError / TokenExpiredError)
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: { id: true, email: true, role: true },
  });

  if (!user) {
    throw ApiError.unauthorized('User account no longer exists');
  }

  req.user = user;
  next();
});

/**
 * Role-based access control — call after `authenticate`.
 *
 * @param {...string} roles - Allowed roles (e.g. ROLES.ADMIN)
 * @returns {import('express').RequestHandler}
 *
 * @example
 * router.delete('/:id', authenticate, authorize(ROLES.ADMIN), controller.delete);
 */
const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    return next(ApiError.unauthorized('Authentication required'));
  }
  if (!roles.includes(req.user.role)) {
    return next(ApiError.forbidden('You do not have permission to perform this action'));
  }
  next();
};

/** Shorthand — Admin only */
const isAdmin = authorize(ROLES.ADMIN);

/** Shorthand — Customer only */
const isCustomer = authorize(ROLES.CUSTOMER);

module.exports = { authenticate, authorize, isAdmin, isCustomer };
