const r = require('express').Router();
const c = require('./cart.controller');
const v = require('./cart.validation');
const validate = require('../../middlewares/validate.middleware');
const auth = require('../../middlewares/auth.middleware');

r.use(auth);

r.get('/', c.getCart);
r.post('/add', validate(v.addItem), c.addItem);
r.patch('/update', validate(v.updateItem), c.updateItem);
r.delete('/:vId', validate(v.removeItem), c.removeItem);

module.exports = r;