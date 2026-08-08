/**
 * Anthropic Claude AI Provider
 * Implements AIProvider interface for Anthropic Claude API
 */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AIProvider,
  AIProviderRequest,
  AIProviderResponse,
  AIProviderConfig,
} from './ai.provider.interface';
import {
  AnthropicRequest,
  AnthropicResponse,
  AnthropicError,
} from './anthropic/anthropic.types';

@Injectable()
export class AnthropicProvider implements AIProvider {
  private readonly logger = new Logger(AnthropicProvider.name);
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeout: number;
  private readonly maxRetries: number;
  private readonly apiVersion: string = '2023-06-01';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('anthropic.apiKey', '');
    this.baseUrl = this.configService.get<string>('anthropic.baseUrl', 'https://api.anthropic.com');
    this.timeout = this.configService.get<number>('anthropic.timeout', 60000);
    this.maxRetries = this.configService.get<number>('anthropic.maxRetries', 3);
  }

  /**
   * Generate a response from Claude API
   */
  async generateResponse(request: AIProviderRequest): Promise<AIProviderResponse> {
    if (!this.isAvailable()) {
      throw new Error('Anthropic API key not configured');
    }

    const anthropicRequest: AnthropicRequest = {
      model: request.model,
      messages: request.messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      system: request.system,
      max_tokens: request.maxTokens,
      temperature: request.temperature ?? 0.7,
      top_p: request.topP ?? 1,
      stream: false,
    };

    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        const response = await this.makeRequest(anthropicRequest);
        
        // Validate response
        if (!response.content || response.content.length === 0) {
          throw new Error('Empty response from Anthropic API');
        }

        const textContent = response.content[0];
        if (textContent.type !== 'text' || !textContent.text) {
          throw new Error('Invalid response format from Anthropic API');
        }

        return {
          content: textContent.text,
          model: response.model,
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens,
          totalTokens: response.usage.input_tokens + response.usage.output_tokens,
          stopReason: response.stop_reason,
          metadata: {
            cacheReadTokens: response.usage.cache_read_input_tokens ?? 0,
            cacheCreationTokens: response.usage.cache_creation_input_tokens ?? 0,
          },
        };
      } catch (error) {
        lastError = error as Error;
        this.logger.warn(`Attempt ${attempt + 1} failed: ${lastError.message}`);
        
        if (attempt < this.maxRetries - 1) {
          // Exponential backoff
          await this.delay(Math.pow(2, attempt) * 1000);
        }
      }
    }

    throw lastError || new Error('Failed to get response from Anthropic API');
  }

  /**
   * Make HTTP request to Anthropic API
   */
  private async makeRequest(payload: AnthropicRequest): Promise<AnthropicResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}/v1/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': this.apiVersion,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})) as AnthropicError;
        throw new Error(
          `Anthropic API error (${response.status}): ${errorData.error?.message || 'Unknown error'}`,
        );
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if ((error as any).name === 'AbortError') {
        throw new Error(`Request timeout after ${this.timeout}ms`);
      }
      
      throw error;
    }
  }

  /**
   * Check if provider is available
   */
  isAvailable(): boolean {
    return !!this.apiKey && this.apiKey.length > 0;
  }

  /**
   * Delay helper for retries
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
