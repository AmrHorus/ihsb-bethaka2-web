/**
 * AI Module Types
 */

import { PlanType } from '../ai.router';
import { PromptType } from '../prompts';

export interface AIUsageRecord {
  id: string;
  userId: string;
  planId: string;
  model: string;
  requestType: PromptType;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCost: number;
  duration?: number;
  status: 'success' | 'error';
  errorMessage?: string;
  createdAt: Date;
}

export interface DailyUsageStats {
  date: string;
  requests: number;
  tokens: number;
  cost: number;
}

export interface MonthlyUsageStats {
  month: string;
  requests: number;
  tokens: number;
  cost: number;
  averageTokensPerRequest: number;
}

export interface UsageSummary {
  daily: DailyUsageStats[];
  monthly: MonthlyUsageStats[];
  totalRequests: number;
  totalTokens: number;
  totalCost: number;
  remainingDailyLimit: number;
  remainingMonthlyLimit: number;
}

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  cacheReadTokens?: number;
  cacheCreationTokens?: number;
}

export interface ModelInfo {
  id: string;
  name: string;
  displayName: string;
  provider: string;
  maxInputTokens: number;
  maxOutputTokens: number;
  contextWindow: number;
  inputPricePerMillion: number;
  outputPricePerMillion: number;
  allowedPlans: PlanType[];
}
