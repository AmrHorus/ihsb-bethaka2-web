export { default as configuration } from './configuration';

export const AI_MODEL_CONFIG = {
  'claude-haiku-4-5': {
    inputPricePerMillion: 1.0,
    outputPricePerMillion: 5.0,
    maxInputTokens: 200000,
    maxOutputTokens: 4096,
    contextWindow: 200000,
  },
  'claude-opus-4-8': {
    inputPricePerMillion: 15.0,
    outputPricePerMillion: 75.0,
    maxInputTokens: 200000,
    maxOutputTokens: 4096,
    contextWindow: 200000,
  },
};

export const PLAN_LIMITS = {
  free: {
    dailyRequests: 10,
    monthlyRequests: 100,
    maxTokensPerRequest: 2000,
    maxOutputTokens: 500,
    allowedModels: ['claude-haiku-4-5'],
  },
  pro: {
    dailyRequests: 50,
    monthlyRequests: 500,
    maxTokensPerRequest: 10000,
    maxOutputTokens: 2000,
    allowedModels: ['claude-haiku-4-5'],
  },
  premium: {
    dailyRequests: 100,
    monthlyRequests: 2000,
    maxTokensPerRequest: 50000,
    maxOutputTokens: 4096,
    allowedModels: ['claude-haiku-4-5', 'claude-opus-4-8'],
  },
};

export const SUBSCRIPTION_STATUS = {
  INACTIVE: 'inactive',
  TRIALING: 'trialing',
  ACTIVE: 'active',
  PAST_DUE: 'past_due',
  CANCELED: 'canceled',
  EXPIRED: 'expired',
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  PARTIALLY_REFUNDED: 'partially_refunded',
};
