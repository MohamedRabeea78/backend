const asyncHandler = require('../../middlewares/asyncHandler');
const reviewsService = require('./reviews.service');
const ApiResponse = require('../../utils/ApiResponse');

const create = asyncHandler(async (req, res) => {
  const data = await reviewsService.create(req.user.id, req.validated.body);
  return ApiResponse.created(res, 'Review posted successfully', data);
});

const getProductReviews = asyncHandler(async (req, res) => {
  const data = await reviewsService.getProductReviews(req.params.productId);
  return ApiResponse.success(res, 'Reviews fetched successfully', data);
});

const remove = asyncHandler(async (req, res) => {
  await reviewsService.remove(req.user.id, req.params.id, req.user.role);
  return ApiResponse.success(res, 'Review deleted successfully');
});

module.exports = { create, getProductReviews, remove };
