const asyncHandler = require('../../middlewares/asyncHandler');
const shippingService = require('./shipping.service');
const ApiResponse = require('../../utils/ApiResponse');

const getAll = asyncHandler(async (req, res) => {
  const data = await shippingService.getAll();
  return ApiResponse.success(res, 'Regions fetched', data);
});

const getById = asyncHandler(async (req, res) => {
  const data = await shippingService.getById(req.params.id);
  return ApiResponse.success(res, 'Region fetched', data);
});

const create = asyncHandler(async (req, res) => {
  const data = await shippingService.create(req.validated.body);
  return ApiResponse.created(res, 'Region created', data);
});

const update = asyncHandler(async (req, res) => {
  const data = await shippingService.update(req.params.id, req.validated.body);
  return ApiResponse.success(res, 'Region updated', data);
});

const remove = asyncHandler(async (req, res) => {
  await shippingService.remove(req.params.id);
  return ApiResponse.success(res, 'Region deleted');
});

module.exports = { getAll, getById, create, update, remove };
