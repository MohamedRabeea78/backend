require('dotenv').config();

const app = require('./app');
const prisma = require('./config/prisma');
const env = require('./config/env');

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('✅  Database connected');

    const server = app.listen(env.PORT, () => {
      console.log(`🚀  Server running on http://localhost:${env.PORT}  [${env.NODE_ENV}]`);
    });

    // ── Graceful Shutdown ──────────────────────
    const shutdown = async (signal) => {
      console.log(`\n⚠️  ${signal} received — shutting down gracefully...`);
      server.close(async () => {
        await prisma.$disconnect();
        console.log('🔌  Database disconnected');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    console.error('❌  Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

startServer();
