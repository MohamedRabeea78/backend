const asyncHandler = require('../../middlewares/asyncHandler');
const couponsService = require('./coupons.service');
const ApiResponse = require('../../utils/ApiResponse');

const getAll = asyncHandler(async (req, res) => {
  const data = await couponsService.getAll();
  return ApiResponse.success(res, 'Coupons fetched successfully', data);
});

const getByCode = asyncHandler(async (req, res) => {
  const data = await couponsService.getByCode(req.params.code);
  return ApiResponse.success(res, 'Coupon verified', data);
});

const create = asyncHandler(async (req, res) => {
  const data = await couponsService.create(req.validated.body);
  return ApiResponse.created(res, 'Coupon created successfully', data);
});

const update = asyncHandler(async (req, res) => {
  const data = await couponsService.update(req.params.id, req.validated.body);
  return ApiResponse.success(res, 'Coupon updated successfully', data);
});

const remove = asyncHandler(async (req, res) => {
  await couponsService.remove(req.params.id);
  return ApiResponse.success(res, 'Coupon deleted successfully');
});

module.exports = { getAll, getByCode, create, update, remove };
