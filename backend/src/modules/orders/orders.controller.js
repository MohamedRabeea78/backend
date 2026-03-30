const ordersService = require('./orders.service');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../middlewares/asyncHandler');

/**
 * POST /api/v1/orders
 * Customer creates an order
 */
const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { addressId, paymentMethod, couponCode, pointsToRedeem } = req.validated.body;

  const order = await ordersService.createOrder(userId, {
    addressId,
    paymentMethod,
    couponCode,
    pointsToRedeem,
  });

  return ApiResponse.created(res, 'Order created successfully', order);
});

module.exports = {
  createOrder,
};
