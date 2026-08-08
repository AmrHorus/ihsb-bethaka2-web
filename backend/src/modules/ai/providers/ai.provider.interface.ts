/**
 * AI Provider Interface
 * Abstracts AI provider implementation for easy swapping
 */

import { AIRequestDTO, AIResponse } from '../../ai.service';

export interface AIProvider {
  /**
   * Generate a response from the AI model
   */
  generateResponse(request: AIProviderRequest): Promise<AIProviderResponse>;

  /**
   * Stream a response from the AI model
   */
  streamResponse?(request: AIProviderRequest): AsyncGenerator<string>;

  /**
   * Check if the provider is available
   */
  isAvailable(): boolean;
}

export interface AIProviderRequest {
  model: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  system?: string;
  maxTokens: number;
  temperature?: number;
  topP?: number;
  stream?: boolean;
}

export interface AIProviderResponse {
  content: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  stopReason?: string;
  metadata?: Record<string, any>;
}

export interface AIProviderConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
  maxRetries?: number;
}
