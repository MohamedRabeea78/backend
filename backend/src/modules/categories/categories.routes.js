const { Router } = require('express');
const categoriesController = require('./categories.controller');
const validate = require('../../middlewares/validate.middleware');
const { authenticate, isAdmin } = require('../../middlewares/auth.middleware');
const { createCategorySchema, updateCategorySchema, idParamSchema } = require('./categories.validation');

const router = Router();

router.get('/', categoriesController.getAllCategories);
router.get('/:id', validate(idParamSchema), categoriesController.getCategoryById);

// Admin only routes
router.post('/', authenticate, isAdmin, validate(createCategorySchema), categoriesController.createCategory);
router.patch('/:id', authenticate, isAdmin, validate(updateCategorySchema), categoriesController.updateCategory);
router.delete('/:id', authenticate, isAdmin, validate(idParamSchema), categoriesController.deleteCategory);

module.exports = router;