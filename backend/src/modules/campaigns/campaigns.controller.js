const asyncHandler = require('../../middlewares/asyncHandler');
const campaignsService = require('./campaigns.service');
const ApiResponse = require('../../utils/ApiResponse');

const getAll = asyncHandler(async (req, res) => {
  const data = await campaignsService.getAll();
  return ApiResponse.success(res, 'Campaigns fetched', data);
});

const getActive = asyncHandler(async (req, res) => {
  const data = await campaignsService.getActive();
  return ApiResponse.success(res, 'Active campaigns fetched', data);
});

const create = asyncHandler(async (req, res) => {
  const data = await campaignsService.create(req.validated.body);
  return ApiResponse.created(res, 'Campaign created', data);
});

const update = asyncHandler(async (req, res) => {
  const data = await campaignsService.update(req.params.id, req.validated.body);
  return ApiResponse.success(res, 'Campaign updated', data);
});

const remove = asyncHandler(async (req, res) => {
  await campaignsService.remove(req.params.id);
  return ApiResponse.success(res, 'Campaign deleted');
});

module.exports = { getAll, getActive, create, update, remove };
