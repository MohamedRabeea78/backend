const asyncHandler = require('../../middlewares/asyncHandler');
const categoriesService = require('./categories.service');
const ApiResponse = require('../../utils/ApiResponse');

const createCategory = asyncHandler(async (req, res) => {
  const category = await categoriesService.createCategory(req.validated.body);
  return ApiResponse.created(res, 'Category created successfully', category);
});

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await categoriesService.getAllCategories();
  return ApiResponse.success(res, 'Categories retrieved successfully', categories);
});

const getCategoryById = asyncHandler(async (req, res) => {
  const category = await categoriesService.getCategoryById(req.params.id);
  return ApiResponse.success(res, 'Category retrieved successfully', category);
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoriesService.updateCategory(req.params.id, req.validated.body);
  return ApiResponse.success(res, 'Category updated successfully', category);
});

const deleteCategory = asyncHandler(async (req, res) => {
  await categoriesService.deleteCategory(req.params.id);
  return ApiResponse.success(res, 'Category deleted successfully');
});

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};