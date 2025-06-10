import OpenAI from 'openai';
import {
  AIService,
  AIRequest,
  AIResponse,
  AIModelConfig,
  MedicalAIError
} from '../AIService';

export class OpenAIService extends AIService {
  private client: OpenAI;

  constructor(config: AIModelConfig) {
    super(config);
    if (!config.apiKey) {
      throw new Error('OpenAI API key is required');
    }
    
    this.client = new OpenAI({
      apiKey: config.apiKey
    });
  }

  protected async validateInput<T>(request: AIRequest<T>): Promise<boolean> {
    if (!request.prompt || request.prompt.trim().length === 0) {
      return false;
    }

    // Add medical-specific validation if needed
    // For example, check for required medical context or specific formats
    
    return true;
  }

  protected async formatResponse<T>(
    rawResponse: any,
    request?: AIRequest<T>
  ): Promise<AIResponse<T>> {
    if (!rawResponse.choices || rawResponse.choices.length === 0) {
      throw new MedicalAIError(
        'Invalid response from OpenAI',
        'INVALID_RESPONSE',
        'high'
      );
    }

    return {
      content: rawResponse.choices[0].message.content,
      tokens: {
        prompt: rawResponse.usage.prompt_tokens,
        completion: rawResponse.usage.completion_tokens,
        total: rawResponse.usage.total_tokens
      },
      metadata: request?.context as T | undefined,
      provider: 'openai'
    };
  }

  protected async makeRequest<T>(request: AIRequest<T>): Promise<any> {
    try {
      const response = await this.client.chat.completions.create({
        model: this.config.modelName,
        messages: [{ role: 'user', content: request.prompt }],
        temperature: this.config.temperature ?? 0.7,
        max_tokens: this.config.maxTokens,
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
      const stream = await this.client.chat.completions.create({
        model: this.config.modelName,
        messages: [{ role: 'user', content: request.prompt }],
        temperature: this.config.temperature ?? 0.7,
        max_tokens: this.config.maxTokens,
        stream: true,
      });

      for await (const chunk of stream) {
        if (chunk.choices?.[0]?.delta?.content) {
          yield {
            choices: [{
              message: { content: chunk.choices[0].delta.content }
            }],
            usage: { // Estimated token usage for streaming
              prompt_tokens: Math.ceil(request.prompt.length / 4),
              completion_tokens: chunk.choices[0].delta.content.length,
              total_tokens: Math.ceil(request.prompt.length / 4) + chunk.choices[0].delta.content.length
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
}
