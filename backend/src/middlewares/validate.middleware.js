const ApiError = require('../utils/ApiError');

/**
 * Zod validation middleware — validates req.body, req.query, and req.params.
 *
 * @param {import('zod').ZodObject<any>} schema - A Zod object schema with optional `body`, `query`, `params` keys
 * @returns {import('express').RequestHandler}
 *
 * @example
 * const schema = z.object({
 *   body: z.object({ email: z.string().email() }),
 * });
 * router.post('/register', validate(schema), authController.register);
 */
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params,
  });

  if (!result.success) {
    const errors = result.error.errors.map((e) => ({
      field: e.path.slice(1).join('.'), // strip leading "body" / "query" / "params"
      message: e.message,
    }));

    return next(ApiError.badRequest('Validation failed', errors));
  }

  // Attach parsed & type-safe data to req
  req.validated = result.data;
  next();
};

module.exports = validate;
