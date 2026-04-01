const asyncHandler = require('../../middlewares/asyncHandler');
const authService = require('./auth.service');
const ApiResponse = require('../../utils/ApiResponse');

const register = asyncHandler(async (req, res) => {
  const data = await authService.register(req.validated.body);
  return ApiResponse.created(res, 'Registered successfully', data);
});

const login = asyncHandler(async (req, res) => {
  const data = await authService.login(req.validated.body);
  return ApiResponse.success(res, 'Logged in successfully', data);
});

const getMe = asyncHandler(async (req, res) => {
  return ApiResponse.success(res, 'User fetched', req.user);
});

module.exports = { register, login, getMe };