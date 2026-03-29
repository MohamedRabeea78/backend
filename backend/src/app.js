const express = require('express');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

// ── Body Parsing ──────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health Check ──────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ── API Routes ────────────────────────────────
// Each module registers its own router here. Uncomment as you build each module.

app.use('/api/v1/auth',       require('./modules/auth/auth.routes'));
// app.use('/api/v1/users',      require('./modules/users/users.routes'));
// app.use('/api/v1/products',   require('./modules/products/products.routes'));
// app.use('/api/v1/categories', require('./modules/categories/categories.routes'));
// app.use('/api/v1/cart',       require('./modules/carts/carts.routes'));
// app.use('/api/v1/orders',     require('./modules/orders/orders.routes'));
// app.use('/api/v1/reviews',    require('./modules/reviews/reviews.routes'));
// app.use('/api/v1/coupons',    require('./modules/coupons/coupons.routes'));
// app.use('/api/v1/campaigns',  require('./modules/campaigns/campaigns.routes'));
// app.use('/api/v1/addresses',  require('./modules/addresses/addresses.routes'));
// app.use('/api/v1/shipping',   require('./modules/shipping/shipping.routes'));
// app.use('/api/v1/loyalty',    require('./modules/loyalty/loyalty.routes'));

// ── 404 Handler ───────────────────────────────
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ── Global Error Handler (MUST be last) ───────
app.use(errorMiddleware);

module.exports = app;
