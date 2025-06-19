import { 
  ManagementRecommendation,
  SymptomAssessmentResult,
  SymptomTrend 
} from './symptomAssessment/types';
import { TreatmentProtocol } from '@/types/medical';
import { AIEnhancementInput } from './types/AIEnhancementInput';

export abstract class AIService {
  protected apiKey: string;
  protected endpoint: string;
  protected modelVersion: string;

  constructor(
    apiKey: string,
    endpoint: string,
    modelVersion: string
  );
  constructor(config: AIModelConfig);
  constructor(
    apiKeyOrConfig: string | AIModelConfig,
    endpoint?: string,
    modelVersion?: string
  ) {
    if (typeof apiKeyOrConfig === 'string') {
      this.apiKey = apiKeyOrConfig;
      this.endpoint = endpoint!;
      this.modelVersion = modelVersion!;
    } else {
      this.apiKey = apiKeyOrConfig.apiKey;
      this.endpoint = apiKeyOrConfig.endpoint;
      this.modelVersion = apiKeyOrConfig.modelVersion;
    }
  }

  protected abstract validateInput<T>(request: AIRequest<T>): Promise<boolean>;
  protected abstract formatResponse<T>(rawResponse: any, request?: AIRequest<T>): Promise<AIResponse<T>>;
  protected abstract makeRequest<T>(request: AIRequest<T>): Promise<any>;
  protected abstract makeStreamingRequest<T>(request: AIRequest<T>): AsyncGenerator<any>;

  async processRequest<T>(request: AIRequest<T>): Promise<AIResponse<T>> {
    if (!(await this.validateInput(request))) {
      throw new MedicalAIError('Invalid request', 'INVALID_INPUT', 'medium');
    }

    const rawResponse = await this.makeRequest(request);
    return this.formatResponse(rawResponse, request);
  }

  async *streamResponse<T>(request: AIRequest<T>): AsyncGenerator<AIResponse<T>> {
    if (!(await this.validateInput(request))) {
      throw new MedicalAIError('Invalid request', 'INVALID_INPUT', 'medium');
    }

    for await (const chunk of this.makeStreamingRequest(request)) {
      yield await this.formatResponse(chunk, request);
    }
  }

  protected handleError(error: any): void {
    console.error('AI Service Error:', error);
  }

  async enhanceRecommendations(input: AIEnhancementInput): Promise<ManagementRecommendation[]> {
    try {
      const enhancedRecommendations = [...input.recommendations];

      // Here you would integrate with your AI model to:
      // 1. Analyze symptom patterns and trends
      // 2. Consider treatment context
      // 3. Apply medical knowledge base
      // 4. Generate personalized recommendations
      
      // For each symptom, ensure recommendations are appropriate
      for (const symptom of input.symptoms) {
        // Find related recommendations
        const symptomRecs = enhancedRecommendations.filter(rec => 
          rec.action.toLowerCase().includes(symptom.name.toLowerCase()));

        // If worsening trend exists, add monitoring recommendation
        const trend = input.trends.find(t => t.symptom === symptom.name);
        if (trend?.trend === 'worsening') {
          enhancedRecommendations.push({
            action: `Increase monitoring frequency for ${symptom.name}`,
            priority: 'urgent',
            rationale: 'Symptom showing worsening trend',
            evidenceLevel: 'moderate',
            reference: 'Clinical Best Practice Guidelines'
          });
        }

        // If severe, add specialist consultation recommendation
        if (symptom.severity.level === 'severe') {
          enhancedRecommendations.push({
            action: `Arrange urgent specialist consultation for ${symptom.name}`,
            priority: 'immediate',
            rationale: 'Severe symptom requiring specialist evaluation',
            evidenceLevel: 'high',
            reference: 'Standard of Care Guidelines'
          });
        }
      }

      // Sort recommendations by priority
      return enhancedRecommendations.sort((a, b) => {
        const priorityOrder = { immediate: 0, urgent: 1, routine: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });

    } catch (error) {
      console.error('AI Enhancement Error:', error);
      return input.recommendations; // Return original recommendations if enhancement fails
    }
  }
}

export interface AIRequest<T = any> {
  prompt: string;
  context?: T;
}

export interface AIResponse<T = any> {
  content: string;
  tokens: {
    prompt: number;
    completion: number;
    total: number;
  };
  metadata?: T;
  provider: string;
}

export interface AIModelConfig {
  apiKey: string;
  endpoint: string;
  modelVersion: string;
  modelName: string;
  maxTokens: number;
  temperature: number;
}

export class MedicalAIError extends Error {
  constructor(
    message: string,
    public code: string,
    public severity: 'low' | 'medium' | 'high',
    public details?: any
  ) {
    super(message);
    this.name = 'MedicalAIError';
  }
}
