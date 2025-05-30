import { ChatCompletionMessage } from 'openai/resources';

export type MessageRole = 'system' | 'user' | 'assistant' | 'function';

export interface Message {
  role: MessageRole;
  content: string;
  name?: string;
}

export interface OpenAIStreamPayload {
  model: string;
  messages: Array<{
    role: Exclude<MessageRole, 'function'>;
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stream?: boolean;
}

export interface AIResponse {
  message: Message;
  done: boolean;
}
