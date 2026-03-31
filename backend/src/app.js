const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * @swagger
 * /health:
 *   get:
 *     summary: API Health Check
 *     description: Returns the health status and current timestamp of the API.
 *     responses:
 *       200:
 *         description: API is running successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/v1/auth', require('./modules/auth/auth.routes'));
app.use('/api/v1/categories', require('./modules/categories/categories.routes'));
app.use('/api/v1/users',      require('./modules/users/users.routes'));
app.use('/api/v1/products', require('./modules/products/products.routes'));
app.use('/api/v1/carts', require('./modules/carts/carts.routes'));
app.use('/api/v1/orders',     require('./modules/orders/orders.routes'));
app.use('/api/v1/shipping',   require('./modules/shipping/shipping.routes'));
app.use('/api/v1/addresses',  require('./modules/addresses/addresses.routes'));
app.use('/api/v1/coupons',    require('./modules/coupons/coupons.routes'));
app.use('/api/v1/reviews',    require('./modules/reviews/reviews.routes'));
app.use('/api/v1/loyalty',    require('./modules/loyalty/loyalty.routes'));
app.use('/api/v1/campaigns',  require('./modules/campaigns/campaigns.routes'));

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

app.use(errorMiddleware);

module.exports = app;