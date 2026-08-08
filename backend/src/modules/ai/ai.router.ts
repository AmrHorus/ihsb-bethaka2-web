import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PLAN_LIMITS } from '../../config';

export enum PlanType {
  FREE = 'free',
  PRO = 'pro',
  PREMIUM = 'premium',
}

export interface UserSubscriptionInfo {
  plan: PlanType;
  status: string;
  dailyUsage: number;
  monthlyUsage: number;
}

@Injectable()
export class AIRouter {
  constructor(
    private configService: ConfigService,
  ) {}

  /**
   * Route user request to appropriate AI model based on subscription plan
   * This is server-side routing - users cannot bypass this from frontend
   */
  selectModel(subscriptionInfo: UserSubscriptionInfo, requestedModel?: string): string {
    const { plan, status } = subscriptionInfo;

    // Check if subscription is active
    if (status !== 'active' && plan !== PlanType.FREE) {
      // Fall back to free tier limits
      return this.selectModelForFree();
    }

    switch (plan) {
      case PlanType.PREMIUM:
        return this.selectModelForPremium(requestedModel);
      
      case PlanType.PRO:
        return this.selectModelForPro();
      
      case PlanType.FREE:
      default:
        return this.selectModelForFree();
    }
  }

  /**
   * Premium users get Opus by default, can use Haiku if requested
   */
  private selectModelForPremium(requestedModel?: string): string {
    if (requestedModel === 'claude-haiku-4-5') {
      return 'claude-haiku-4-5';
    }
    // Default to most powerful model for Premium
    return 'claude-opus-4-8';
  }

  /**
   * Pro users get Haiku only
   */
  private selectModelForPro(): string {
    return 'claude-haiku-4-5';
  }

  /**
   * Free users get limited Haiku access
   */
  private selectModelForFree(): string {
    return 'claude-haiku-4-5';
  }

  /**
   * Check if user has reached their usage limits
   */
  checkLimits(subscriptionInfo: UserSubscriptionInfo): { allowed: boolean; reason?: string } {
    const { plan, dailyUsage, monthlyUsage } = subscriptionInfo;
    const limits = PLAN_LIMITS[plan];

    if (!limits) {
      return { allowed: false, reason: 'Invalid plan' };
    }

    if (dailyUsage >= limits.dailyRequests) {
      return { 
        allowed: false, 
        reason: 'Daily limit reached',
        upgradeSuggestion: plan === PlanType.FREE ? 'pro' : 'premium'
      };
    }

    if (monthlyUsage >= limits.monthlyRequests) {
      return { 
        allowed: false, 
        reason: 'Monthly limit reached',
        upgradeSuggestion: plan === PlanType.FREE ? 'pro' : 'premium'
      };
    }

    return { allowed: true };
  }

  /**
   * Get max tokens allowed for a request based on plan
   */
  getMaxTokens(plan: PlanType): { input: number; output: number } {
    const limits = PLAN_LIMITS[plan];
    return {
      input: limits.maxTokensPerRequest,
      output: limits.maxOutputTokens,
    };
  }

  /**
   * Get available models for a plan
   */
  getAvailableModels(plan: PlanType): string[] {
    return PLAN_LIMITS[plan].allowedModels;
  }

  /**
   * Validate that requested model is allowed for user's plan
   */
  validateModelAccess(plan: PlanType, requestedModel: string): boolean {
    const allowedModels = this.getAvailableModels(plan);
    return allowedModels.includes(requestedModel);
  }
}
