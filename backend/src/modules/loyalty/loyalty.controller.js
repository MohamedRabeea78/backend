const asyncHandler = require('../../middlewares/asyncHandler');
const loyaltyService = require('./loyalty.service');
const ApiResponse = require('../../utils/ApiResponse');

const getBalance = asyncHandler(async (req, res) => {
  const data = await loyaltyService.getBalance(req.user.id);
  return ApiResponse.success(res, 'Balance fetched', data);
});

const getTransactions = asyncHandler(async (req, res) => {
  const data = await loyaltyService.getTransactions(req.user.id);
  return ApiResponse.success(res, 'Transactions fetched', data);
});

const adjustPoints = asyncHandler(async (req, res) => {
  const data = await loyaltyService.adjustPoints(req.validated.body);
  return ApiResponse.success(res, 'Points adjusted', data);
});

module.exports = { getBalance, getTransactions, adjustPoints };
