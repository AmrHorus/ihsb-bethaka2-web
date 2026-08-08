/**
 * Anthropic AI Provider Types
 */

export interface AnthropicMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AnthropicRequest {
  model: string;
  messages: AnthropicMessage[];
  system?: string;
  max_tokens: number;
  temperature?: number;
  top_p?: number;
  stream?: boolean;
}

export interface AnthropicUsage {
  input_tokens: number;
  output_tokens: number;
  cache_read_input_tokens?: number;
  cache_creation_input_tokens?: number;
}

export interface AnthropicResponse {
  id: string;
  type: 'message';
  role: 'assistant';
  content: Array<{
    type: 'text' | 'tool_use';
    text?: string;
    id?: string;
    name?: string;
    input?: any;
  }>;
  model: string;
  stop_reason: 'end_turn' | 'max_tokens' | 'stop_sequence' | 'tool_use';
  stop_sequence: string | null;
  usage: AnthropicUsage;
}

export interface AnthropicError {
  type: 'error';
  error: {
    type: string;
    message: string;
  };
}

export interface AnthropicStreamChunk {
  type: 'message_start' | 'content_block_start' | 'content_block_delta' | 'content_block_stop' | 'message_delta' | 'message_stop';
  message?: {
    id: string;
    type: string;
    role: string;
    content: any[];
    model: string;
    stop_reason: string | null;
    stop_sequence: string | null;
    usage: AnthropicUsage;
  };
  index?: number;
  delta?: {
    type: 'text_delta';
    text: string;
  };
  usage_metadata?: {
    input_tokens: number;
    output_tokens: number;
  };
}
