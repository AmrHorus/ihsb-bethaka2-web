import { Injectable } from '@nestjs/common';
import { AI_MODEL_CONFIG } from '../../config';

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  model: string;
}

@Injectable()
export class AICostCalculator {
  /**
   * Calculate the cost of an AI request based on token usage and model
   */
  calculateCost(usage: TokenUsage): number {
    const modelConfig = AI_MODEL_CONFIG[usage.model];
    
    if (!modelConfig) {
      throw new Error(`Unknown model: ${usage.model}`);
    }

    const inputCost = (usage.inputTokens / 1_000_000) * modelConfig.inputPricePerMillion;
    const outputCost = (usage.outputTokens / 1_000_000) * modelConfig.outputPricePerMillion;

    return inputCost + outputCost;
  }

  /**
   * Get model configuration
   */
  getModelConfig(modelName: string) {
    return AI_MODEL_CONFIG[modelName];
  }

  /**
   * Estimate cost before making a request
   */
  estimateCost(inputTokens: number, estimatedOutputTokens: number, model: string): number {
    return this.calculateCost({
      inputTokens,
      outputTokens: estimatedOutputTokens,
      model,
    });
  }

  /**
   * Convert tokens to usage units for credit system
   */
  tokensToCredits(tokens: number, model: string): number {
    const modelConfig = AI_MODEL_CONFIG[model];
    if (!modelConfig) return tokens;
    
    // Base conversion: 1 credit = 1000 tokens for Haiku
    // Opus costs more, so multiply by price ratio
    const haikuInputPrice = AI_MODEL_CONFIG['claude-haiku-4-5'].inputPricePerMillion;
    const modelInputPrice = modelConfig.inputPricePerMillion;
    const multiplier = modelInputPrice / haikuInputPrice;
    
    return Math.ceil((tokens / 1000) * multiplier);
  }
}
