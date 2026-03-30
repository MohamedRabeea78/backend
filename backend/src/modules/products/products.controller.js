const asyncHandler = require('../../middlewares/asyncHandler');
const productsService = require('./products.service');
const ApiResponse = require('../../utils/ApiResponse');

const getAll = asyncHandler(async (req, res) => {
  const { page, limit, categoryId, isActive } = req.query;
  const data = await productsService.getAll({
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
    categoryId,
    isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
  });
  return ApiResponse.success(res, 'Products fetched', data);
});

const getById = asyncHandler(async (req, res) => {
  const data = await productsService.getById(req.params.id);
  return ApiResponse.success(res, 'Product fetched', data);
});

const create = asyncHandler(async (req, res) => {
  const data = await productsService.create(req.validated.body);
  return ApiResponse.created(res, 'Product created', data);
});

const update = asyncHandler(async (req, res) => {
  const data = await productsService.update(req.params.id, req.validated.body);
  return ApiResponse.success(res, 'Product updated', data);
});

const remove = asyncHandler(async (req, res) => {
  await productsService.remove(req.params.id);
  return ApiResponse.success(res, 'Product deleted');
});

const createVariant = asyncHandler(async (req, res) => {
  const data = await productsService.createVariant(req.params.id, req.validated.body);
  return ApiResponse.created(res, 'Variant created', data);
});

module.exports = { getAll, getById, create, update, remove, createVariant };