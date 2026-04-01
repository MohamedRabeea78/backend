const asyncHandler = require('../../middlewares/asyncHandler');
const cartsService = require('./carts.service');
const ApiResponse = require('../../utils/ApiResponse');

const getCart = asyncHandler(async (req, res) => {
  const data = await cartsService.getOrCreateCart(req.user.id);
  return ApiResponse.success(res, 'Cart fetched', data);
});

const addItem = asyncHandler(async (req, res) => {
  const data = await cartsService.addItem(req.user.id, req.validated.body);
  return ApiResponse.success(res, 'Item added to cart', data);
});

const updateItem = asyncHandler(async (req, res) => {
  const data = await cartsService.updateItem(req.user.id, req.params.variantId, req.validated.body.quantity);
  return ApiResponse.success(res, 'Cart item updated', data);
});

const removeItem = asyncHandler(async (req, res) => {
  const data = await cartsService.removeItem(req.user.id, req.params.variantId);
  return ApiResponse.success(res, 'Item removed from cart', data);
});

const clearCart = asyncHandler(async (req, res) => {
  const data = await cartsService.clearCart(req.user.id);
  return ApiResponse.success(res, 'Cart cleared', data);
});

const mergeCart = asyncHandler(async (req, res) => {
  const guestCartItems = req.validated.body.items || [];
  const data = await cartsService.mergeGuestCart(req.user.id, guestCartItems);
  return ApiResponse.success(res, 'Guest cart merged successfully', data);
});

module.exports = { getCart, addItem, updateItem, removeItem, clearCart, mergeCart };