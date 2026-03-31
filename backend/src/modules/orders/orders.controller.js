const asyncHandler = require('../../middlewares/asyncHandler');
const ordersService = require('./orders.service');
const ApiResponse = require('../../utils/ApiResponse');

const createOrder = asyncHandler(async (req, res) => {
  const data = await ordersService.createOrder(req.user.id, req.validated.body);
  return ApiResponse.created(res, 'Order created successfully', data);
});

const getMyOrders = asyncHandler(async (req, res) => {
  const data = await ordersService.getMyOrders(req.user.id);
  return ApiResponse.success(res, 'Orders fetched', data);
});

const getOrderById = asyncHandler(async (req, res) => {
  const data = await ordersService.getOrderById(req.params.id, req.user.id, req.user.role);
  return ApiResponse.success(res, 'Order fetched', data);
});

const updateStatus = asyncHandler(async (req, res) => {
  const data = await ordersService.updateStatus(req.params.id, req.validated.body);
  return ApiResponse.success(res, 'Order status updated', data);
});

module.exports = { createOrder, getMyOrders, getOrderById, updateStatus };
