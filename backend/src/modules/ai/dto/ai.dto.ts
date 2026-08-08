/**
 * AI Request/Response DTOs
 */

import { IsString, IsOptional, IsEnum, IsObject, MinLength, MaxLength } from 'class-validator';
import { PromptType } from '../prompts';

export class CreateAIRequestDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50000)
  message: string;

  @IsOptional()
  @IsEnum(PromptType)
  type?: PromptType = PromptType.CHAT;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsObject()
  context?: Record<string, any>;

  @IsOptional()
  @IsString()
  language?: 'ar' | 'en' = 'ar';
}

export class AIResponseDto {
  id: string;
  content: string;
  model: string;
  requestType: PromptType;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCost: number;
  duration: number;
  usageRemaining: {
    daily: number;
    monthly: number;
    percentage: number;
  };
  createdAt: Date;
}

export class AIUsageDto {
  totalRequests: number;
  dailyRequests: number;
  monthlyRequests: number;
  dailyLimit: number;
  monthlyLimit: number;
  dailyRemaining: number;
  monthlyRemaining: number;
  dailyPercentage: number;
  monthlyPercentage: number;
  currentPlan: string;
  resetDate: Date;
}

export class ModelInfoDto {
  id: string;
  name: string;
  displayName: string;
  maxInputTokens: number;
  maxOutputTokens: number;
  inputPricePerMillion: number;
  outputPricePerMillion: number;
  isAvailable: boolean;
}

export class PlanLimitsDto {
  plan: string;
  dailyLimit: number;
  monthlyLimit: number;
  maxTokensPerRequest: number;
  maxOutputTokens: number;
  allowedModels: string[];
  features: string[];
}
