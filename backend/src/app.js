const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/v1/auth', require('./modules/auth/auth.routes'));
app.use('/api/v1/categories', require('./modules/categories/categories.routes'));
// app.use('/api/v1/users',      require('./modules/users/users.routes'));
app.use('/api/v1/products', require('./modules/products/products.routes'));
// app.use('/api/v1/carts',      require('./modules/carts/carts.routes'));
// app.use('/api/v1/orders',     require('./modules/orders/orders.routes'));
// app.use('/api/v1/reviews',    require('./modules/reviews/reviews.routes'));

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

app.use(errorMiddleware);

module.exports = app;