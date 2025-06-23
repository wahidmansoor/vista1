import Anthropic from '@anthropic-ai/sdk';
import {
  AIService,
  AIRequest,
  AIResponse,
  AIModelConfig,
  MedicalAIError
} from '../AIService';

export class ClaudeService extends AIService {
  private client: Anthropic;

  constructor(config: AIModelConfig) {
    super(config);
    if (!config.apiKey) {
      throw new Error('Anthropic API key is required');
    }

    this.client = new Anthropic({
      apiKey: config.apiKey
    });
  }

  protected async validateInput<T>(request: AIRequest<T>): Promise<boolean> {
    if (!request.prompt || request.prompt.trim().length === 0) {
      return false;
    }

    // Add medical-specific validation if needed
    // For example, validate medical terminology or required fields
    
    return true;
  }

  protected async formatResponse<T>(
    rawResponse: any,
    request?: AIRequest<T>
  ): Promise<AIResponse<T>> {
    if (!rawResponse.content) {
      throw new MedicalAIError(
        'Invalid response from Claude',
        'INVALID_RESPONSE',
        'high'
      );
    }

    return {
      content: rawResponse.content[0].text,
      tokens: {
        prompt: rawResponse.usage?.input_tokens || 0,
        completion: rawResponse.usage?.output_tokens || 0,
        total: (rawResponse.usage?.input_tokens || 0) + (rawResponse.usage?.output_tokens || 0)
      },
      metadata: request?.context as T | undefined,
      provider: 'anthropic'
    };
  }

  protected async makeRequest<T>(request: AIRequest<T>): Promise<any> {
    try {
      const response = await this.client.messages.create({
        model: this.config.modelName,
        max_tokens: this.config.maxTokens,
        messages: [
          {
            role: 'user',
            content: request.prompt
          }
        ],
        temperature: this.config.temperature ?? 0.7
      });

      return response;
    } catch (error: any) {
      throw new MedicalAIError(
        error.message,
        error.status === 429 ? 'RATE_LIMIT_EXCEEDED' : 'API_ERROR',
        'high',
        error.response?.data
      );
    }
  }

  protected async *makeStreamingRequest<T>(request: AIRequest<T>): AsyncGenerator<any> {
    try {
      const stream = await this.client.messages.create({
        model: this.config.modelName,
        max_tokens: this.config.maxTokens,
        messages: [
          {
            role: 'user',
            content: request.prompt
          }
        ],
        temperature: this.config.temperature ?? 0.7,
        stream: true
      });

      let accumulatedContent = '';
      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta?.text) {
          accumulatedContent += chunk.delta.text;
          
          yield {
            content: [{ text: chunk.delta.text }],
            usage: {
              input_tokens: Math.ceil(request.prompt.length / 4), // Estimate
              output_tokens: Math.ceil(accumulatedContent.length / 4), // Estimate
            }
          };
        }
      }
    } catch (error: any) {
      throw new MedicalAIError(
        error.message,
        error.status === 429 ? 'RATE_LIMIT_EXCEEDED' : 'API_ERROR',
        'high',
        error.response?.data
      );
    }
  }

  // Helper method to count tokens (simplified estimation)
  private estimateTokenCount(text: string): number {
    // Rough estimation: ~4 characters per token on average
    return Math.ceil(text.length / 4);
  }
}
