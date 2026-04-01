/**
 * Wraps an async route handler and forwards any errors to Express's next().
 *
 * @param {import('express').RequestHandler} fn
 * @returns {import('express').RequestHandler}
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
