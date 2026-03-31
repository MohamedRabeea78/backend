const asyncHandler = require('../../middlewares/asyncHandler');
const addressesService = require('./addresses.service');
const ApiResponse = require('../../utils/ApiResponse');

const getMyAddresses = asyncHandler(async (req, res) => {
  const data = await addressesService.getMyAddresses(req.user.id);
  return ApiResponse.success(res, 'Addresses fetched', data);
});

const create = asyncHandler(async (req, res) => {
  const data = await addressesService.create(req.user.id, req.validated.body);
  return ApiResponse.created(res, 'Address created', data);
});

const update = asyncHandler(async (req, res) => {
  const data = await addressesService.update(req.user.id, req.params.id, req.validated.body);
  return ApiResponse.success(res, 'Address updated', data);
});

const remove = asyncHandler(async (req, res) => {
  await addressesService.remove(req.user.id, req.params.id);
  return ApiResponse.success(res, 'Address deleted');
});

module.exports = { getMyAddresses, create, update, remove };
