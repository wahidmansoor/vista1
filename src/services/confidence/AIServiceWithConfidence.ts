import { AIService, AIRequest, AIResponse, MedicalAIError, AIModelConfig } from '../AIService';
import { ConfidenceService } from './ConfidenceService';
import { QueryCategory, ConfidenceResult } from './types';
import { ConfidenceConfigFactory } from './ConfidenceConfigFactory';

export class AIServiceWithConfidence extends AIService {
  private baseService: AIService;
  private confidenceService: ConfidenceService;

  constructor(baseService: AIService) {
    // Create a default config since we can't access the base service config
    super({
      apiKey: 'confidence-wrapper',
      endpoint: 'internal',
      modelVersion: '1.0',
      modelName: 'confidence-enhanced',
      maxTokens: 4000,
      temperature: 0.7
    });
    this.baseService = baseService;
    this.confidenceService = new ConfidenceService(
      ConfidenceConfigFactory.createDefaultConfig()
    );
  }

  public async processRequest<T>(request: AIRequest<T>): Promise<AIResponse<T> & { confidence: ConfidenceResult }> {
    try {
      // Process the request using the base service
      const response = await this.baseService.processRequest(request);

      // Determine query category based on request context or metadata
      const queryCategory = this.determineQueryCategory(request);

      // Calculate confidence metrics
      const confidence = await this.confidenceService.calculateConfidence({
        aiRequest: request,
        aiResponse: response,
        queryCategory,
        contextualData: request.context as Record<string, any>
      });

      // If confidence is too low, enhance the response with warnings
      if (confidence.requiresConsultation) {
        const warningMessage = this.generateWarningMessage(confidence);
        return {
          ...response,
          content: `${warningMessage}\n\n${response.content}`,
          confidence
        };
      }

      // Return enhanced response with confidence data
      return {
        ...response,
        confidence
      };
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  public async *streamResponse<T>(request: AIRequest<T>): AsyncGenerator<AIResponse<T> & { confidence?: ConfidenceResult }> {
    const queryCategory = this.determineQueryCategory(request);
    let fullContent = '';
    let isFirstChunk = true;

    try {
      for await (const chunk of this.baseService.streamResponse(request)) {
        fullContent += chunk.content;

        if (isFirstChunk) {
          // For first chunk, do initial confidence check
          const initialConfidence = await this.confidenceService.calculateConfidence({
            aiRequest: request,
            aiResponse: { ...chunk, content: fullContent },
            queryCategory,
            contextualData: request.context as Record<string, any>
          });

          // If confidence is too low, prepend warning
          if (initialConfidence.requiresConsultation) {
            const warningMessage = this.generateWarningMessage(initialConfidence);
            yield {
              ...chunk,
              content: `${warningMessage}\n\n${chunk.content}`,
              confidence: initialConfidence
            };
          } else {
            yield { ...chunk, confidence: initialConfidence };
          }
          isFirstChunk = false;
        } else {
          // For subsequent chunks, just pass through
          yield chunk;
        }
      }

      // Calculate final confidence score on complete response
      const finalConfidence = await this.confidenceService.calculateConfidence({
          aiRequest: request,
          aiResponse: {
            ...this.createBaseResponse(),
            content: fullContent
          },
          queryCategory,
          contextualData: request.context as Record<string, any>
      });

      // Yield final chunk with complete confidence assessment
      yield {
        ...this.createBaseResponse(),
        content: '',
        confidence: finalConfidence
      };

    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  private determineQueryCategory(request: AIRequest<any>): QueryCategory {
    // Try to determine from context first
    if ((request.context as any)?.queryCategory) {
      return (request.context as any).queryCategory as QueryCategory;
    }

    // Analyze request content to determine category
    const content = request.prompt.toLowerCase();
    
    if (content.includes('diagnos') || content.includes('symptoms') || content.includes('assessment')) {
      return 'diagnosis';
    }
    if (content.includes('treat') || content.includes('therapy') || content.includes('intervention')) {
      return 'treatment';
    }
    if (content.includes('medic') || content.includes('drug') || content.includes('dosage')) {
      return 'medication';
    }
    if (content.includes('emergency') || content.includes('urgent') || content.includes('immediate')) {
      return 'emergency';
    }
    
    return 'general';
  }

  private generateWarningMessage(confidence: ConfidenceResult): string {
    const warningLines = [
      '⚠️ CONFIDENCE WARNING ⚠️',
      `Confidence Level: ${confidence.level.toUpperCase()}`,
      'Professional consultation is strongly recommended.',
      '',
      'Limitations:',
      ...confidence.limitations.map(l => `- ${l}`),
      '',
      'Recommendations:',
      ...confidence.suggestions.map(s => `- ${s}`)
    ];

    return warningLines.join('\n');
  }

  private createBaseResponse(): AIResponse<any> {
    return {
      content: '',
      tokens: { prompt: 0, completion: 0, total: 0 },
      provider: 'confidence-enhanced'
    };
  }

  // Implement abstract methods from AIService
  protected async validateInput<T>(request: AIRequest<T>): Promise<boolean> {
    // Delegate to base service by calling processRequest and catching validation errors
    try {
      // Since we can't access private methods, we'll do basic validation
      return !!(request.prompt && request.prompt.length > 0);
    } catch (error) {
      return false;
    }
  }

  protected async formatResponse<T>(rawResponse: any, request?: AIRequest<T>): Promise<AIResponse<T>> {
    // Basic response formatting - in practice this would delegate to base service
    return rawResponse;
  }

  protected async makeRequest<T>(request: AIRequest<T>): Promise<any> {
    // Delegate to base service
    return this.baseService.processRequest(request);
  }

  protected async *makeStreamingRequest<T>(request: AIRequest<T>): AsyncGenerator<any> {
    // Delegate to base service
    yield* this.baseService.streamResponse(request);
  }
}
