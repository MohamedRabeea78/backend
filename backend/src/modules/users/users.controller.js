const asyncHandler = require('../../middlewares/asyncHandler');
const usersService = require('./users.service');
const ApiResponse = require('../../utils/ApiResponse');

const getProfile = asyncHandler(async (req, res) => {
  const data = await usersService.getProfile(req.user.id);
  return ApiResponse.success(res, 'Profile fetched', data);
});

const updateProfile = asyncHandler(async (req, res) => {
  const data = await usersService.updateProfile(req.user.id, req.validated.body);
  return ApiResponse.success(res, 'Profile updated', data);
});

const changePassword = asyncHandler(async (req, res) => {
  const data = await usersService.changePassword(req.user.id, req.validated.body);
  return ApiResponse.success(res, 'Password changed', data);
});

const getAllUsers = asyncHandler(async (req, res) => {
  const data = await usersService.getAllUsers();
  return ApiResponse.success(res, 'Users fetched', data);
});

const getUserById = asyncHandler(async (req, res) => {
  const data = await usersService.getUserById(req.params.id);
  return ApiResponse.success(res, 'User fetched', data);
});

module.exports = { getProfile, updateProfile, changePassword, getAllUsers, getUserById };
