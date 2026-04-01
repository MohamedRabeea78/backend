const ApiError = require('../utils/ApiError');
const env = require('../config/env');

/**
 * Global Express error handler.
 * Must be registered LAST with app.use().
 *
 * @type {import('express').ErrorRequestHandler}
 */
const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || [];

  // ── Prisma Known Errors ──────────────────────
  if (err.code === 'P2002') {
    // Unique constraint failed
    statusCode = 409;
    const field = err.meta?.target?.[0] ?? 'field';
    message = `A record with this ${field} already exists`;
  } else if (err.code === 'P2025') {
    // Record not found
    statusCode = 404;
    message = err.meta?.cause || 'Record not found';
  } else if (err.code === 'P2003') {
    // Foreign key constraint
    statusCode = 400;
    message = 'Invalid reference: related record does not exist';
  } else if (err.code === 'P2014') {
    statusCode = 400;
    message = 'The change you are trying to make would violate a required relation';
  }

  // ── JWT Errors ────────────────────────────────
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token has expired';
  } else if (err.name === 'NotBeforeError') {
    statusCode = 401;
    message = 'Token not yet active';
  }

  // ── SyntaxError (bad JSON body) ───────────────
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    message = 'Invalid JSON in request body';
  }

  const response = {
    success: false,
    message,
    ...(errors.length > 0 && { errors }),
    ...(env.isDev && { stack: err.stack }),
  };

  return res.status(statusCode).json(response);
};

module.exports = errorMiddleware;
