// src/config/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Furniture E-Commerce API',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  // هنرجع المسار تانى عشان يقرأ من الموديولات
  apis: ['./src/app.js', './src/modules/**/*.routes.js'],
};

let swaggerSpec;
try {
  swaggerSpec = swaggerJsdoc(options);
} catch (error) {
  console.error('Swagger Warning: Error parsing JSDoc, check your route comments.');
  swaggerSpec = { openapi: '3.0.0', info: { title: 'Error', version: '1.0.0' }, paths: {} };
}

module.exports = swaggerSpec;