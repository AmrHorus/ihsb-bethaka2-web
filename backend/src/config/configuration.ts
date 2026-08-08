import { registerAs } from '@nestjs/config';

export default registerAs('configuration', () => ({
  database: {
    url: process.env.DATABASE_URL,
  },
  auth: {
    secret: process.env.AUTH_SECRET,
    jwtExpiration: process.env.JWT_EXPIRATION || '7d',
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
  },
  payment: {
    provider: process.env.PAYMENT_PROVIDER || 'stripe',
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    },
  },
  server: {
    port: parseInt(process.env.PORT, 10) || 3001,
    nodeEnv: process.env.NODE_ENV || 'development',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    apiPrefix: process.env.API_PREFIX || '/api',
  },
  rateLimit: {
    ttl: parseInt(process.env.RATE_LIMIT_TTL, 10) || 60,
    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
}));
