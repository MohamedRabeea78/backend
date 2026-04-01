const prisma = require('../../config/prisma');
const ApiError = require('../../utils/ApiError');

const createCategory = async (data) => {
  if (data.parentId) {
    const parent = await prisma.category.findUnique({ where: { id: data.parentId } });
    if (!parent) throw ApiError.notFound('Parent category not found');
  }

  return await prisma.category.create({
    data,
    include: {
      parent: true,
      children: true,
    },
  });
};

const getAllCategories = async () => {
  return await prisma.category.findMany({
    where: { parentId: null },
    include: {
      children: true,
    },
  });
};

const getCategoryById = async (id) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      parent: true,
      children: true,
      products: true,
    },
  });
  if (!category) {
    throw ApiError.notFound('Category not found');
  }
  return category;
};

const updateCategory = async (id, data) => {
  await getCategoryById(id);
  
  if (data.parentId && data.parentId !== null) {
    const parent = await prisma.category.findUnique({ where: { id: data.parentId } });
    if (!parent) throw ApiError.notFound('Parent category not found');
  }
  
  return await prisma.category.update({
    where: { id },
    data,
    include: {
      parent: true,
      children: true,
    },
  });
};

const deleteCategory = async (id) => {
  const category = await getCategoryById(id);
  if (category.children && category.children.length > 0) {
    throw ApiError.badRequest('Cannot delete category with subcategories');
  }
  return await prisma.category.delete({
    where: { id },
  });
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};