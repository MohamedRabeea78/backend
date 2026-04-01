require('dotenv').config();

const app = require('./app');
const env = require('./config/env');
const prisma = require('./config/prisma');

const start = async () => {
  try {
    await prisma.$connect();
    console.log('Database connected');

    const server = app.listen(env.PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${env.PORT}`);
    });

    server.on('error', (err) => {
      console.error('Server error:', err);
    });

    process.on('uncaughtException', (err) => {
      console.error('Uncaught exception:', err);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();