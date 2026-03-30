const s = require('./cart.service');
const catchAsync = require('../../middlewares/asyncHandler');

const getCart = catchAsync(async (req, res) => {
    const c = await s.get(req.user.id);
    res.json({ success: true, data: c });
});

const addItem = catchAsync(async (req, res) => {
    const { vId, q } = req.body;
    const i = await s.add(req.user.id, vId, q || 1);
    res.json({ success: true, data: i });
});

const updateItem = catchAsync(async (req, res) => {
    const { vId, q } = req.body;
    const i = await s.update(req.user.id, vId, q);
    res.json({ success: true, data: i });
});

const removeItem = catchAsync(async (req, res) => {
    await s.remove(req.user.id, req.params.vId);
    res.json({ success: true, message: 'Item removed' });
});

module.exports = { getCart, addItem, updateItem, removeItem };