import { ModuleType, PromptIntent, AIResponse } from '@/components/ai-agent/types';
import { promptBuilder } from '@/components/ai-agent/promptBuilder';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';
import { generateGeminiResponse } from '@/lib/gemini';
import { getOfflineResponse } from '../../components/ai-agent/mockResponses';

// Re-export AIResponse type for consumers
export type { AIResponse } from '@/components/ai-agent/types';

// Mock responses for development
const mockResponses: Record<ModuleType, Record<PromptIntent, string[]>> = {
  OPD: {
    screening: [
      "Based on the patient's age and risk factors, recommended screening includes annual mammography and colonoscopy every 10 years.",
      "Given the family history, consider genetic counseling and BRCA testing.",
    ],
    triage: [
      "Patient requires urgent evaluation due to severe symptoms.",
      "Routine follow-up recommended in 3 months.",
    ]
  } as Record<PromptIntent, string[]>,
  CDU: {
    toxicity: [
      "Grade 3 neutropenia detected. Consider G-CSF support and dose reduction.",
      "Mild peripheral neuropathy - continue monitoring, consider vitamin B6.",
    ]
  } as Record<PromptIntent, string[]>,
  Inpatient: {} as Record<PromptIntent, string[]>,
  Palliative: {} as Record<PromptIntent, string[]>,
  RadOnc: {} as Record<PromptIntent, string[]>
};

interface AIAgentParams {
  module: ModuleType;
  intent: PromptIntent;
  prompt: string;
  context?: string;
  mockMode?: boolean;
  history?: string[];
  iterationCount?: number;
  previousResponse?: string;
  feedbackType?: 'refine' | 'elaborate' | 'correct';
}

// Initialize OpenAI client conditionally to avoid errors when API key is not available
let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openai) {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey || apiKey === 'your-openai-api-key-here') {
      throw new APIError('OpenAI API key not configured. Please set VITE_OPENAI_API_KEY or use mock mode.', 'MISSING_API_KEY');
    }
    openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true // Since we're using Vite, enable browser usage
    });
  }
  return openai;
}

class APIError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'APIError';
  }
}

export const aiAgentAPI = {
  /**
   * Gets an AI response for the given prompt, module, and intent
   * @throws {APIError} If the API call fails or returns invalid data
   */
  async getResponse(
    prompt: string, 
    module: ModuleType, 
    intent: PromptIntent
  ): Promise<AIResponse> {
    try {
      // Generate specialized prompt using promptBuilder
      const enhancedPrompt = promptBuilder(module, intent, prompt);      // Call OpenAI API
      const openaiClient = getOpenAIClient();
      const completion = await openaiClient.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are an expert oncology AI assistant. Provide evidence-based recommendations following current clinical guidelines."
          },
          {
            role: "user",
            content: enhancedPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      // Validate response
      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new APIError("Empty response from AI", "EMPTY_RESPONSE");
      }

      // Format response with markdown if it contains structured sections
      const markdown = content.includes('#') || content.includes('-') ? content : null;

      // Return formatted response
      return {
        id: uuidv4(),
        content,
        timestamp: new Date(), // Changed from toISOString()
        metadata: {
          module,
          intent,
          model: 'gpt-4-turbo-preview'
        }
      };

    } catch (error: any) {
      // Handle different types of errors
      if (error.name === 'APIError') {
        throw error;
      }
      
      if (error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED') {
        throw new APIError('Unable to connect to AI service', 'CONNECTION_ERROR');
      }

      if (error.response?.status === 429) {
        throw new APIError('Rate limit exceeded', 'RATE_LIMIT');
      }

      // Generic error with original message
      throw new APIError(
        error.message || 'Failed to get AI response',
        'UNKNOWN_ERROR'
      );
    }
  }
};

function getMockResponse(module: string, intent: string): string {
  const moduleResponses = mockResponses[module as keyof typeof mockResponses];
  if (!moduleResponses) {
    return "Mock response not found for this module.";
  }
  
  const intentResponses = moduleResponses[intent as keyof typeof moduleResponses];
  if (!intentResponses) {
    return "Mock response not found for this intent.";
  }
  
  const randomIndex = Math.floor(Math.random() * intentResponses.length);
  return intentResponses[randomIndex];
}

export async function callAIAgent({
  module,
  intent,
  prompt,
  context,
  mockMode,
  iterationCount = 0,
  previousResponse,
  feedbackType,
  history = []
}: AIAgentParams): Promise<AIResponse> {
  if (mockMode) {
    return {
      id: uuidv4(),
      content: getMockResponse(module, intent),
      timestamp: new Date(),
      metadata: {
        module,
        intent,
        model: 'mock'
      }
    };
  }

  // Handle iteration-based feedback with more natural prompts
  let enhancedPrompt = prompt;
  if (iterationCount > 0 && previousResponse) {
    const base = `Previous response:\n${previousResponse}\n\nUser feedback:\n${prompt}`;
    
    enhancedPrompt = feedbackType === 'refine'
      ? `Please refine and improve the previous response, focusing on accuracy and clarity.\n${base}`
      : feedbackType === 'elaborate'
      ? `Please provide more detailed information and examples to elaborate on the previous response.\n${base}`
      : feedbackType === 'correct'
      ? `Please correct any errors or inaccuracies in the previous response, ensuring medical accuracy.\n${base}`
      : `Please continue with this additional context:\n${base}`;
  }

  // Construct a comprehensive prompt with full context
  const fullPrompt = `
Context:
${context || 'No specific context provided'}

Module: ${module}
Intent: ${intent}

History:
${history.length > 0 ? history.join('\n\n') : 'No previous history'}

Current Task:
${enhancedPrompt}

Please provide a comprehensive response suitable for a medical professional.`;
  try {
    const response = await generateGeminiResponse(fullPrompt);
    
    return {
      id: response.id,
      content: response.content,
      timestamp: new Date(response.timestamp),
      metadata: {
        module,
        intent,
        model: response.metadata.model
      }
    };
  } catch (error) {
    throw new APIError(
      error instanceof Error ? error.message : 'Failed to get AI response',
      'GEMINI_API_ERROR'
    );
  }
}

// Retry wrapper with exponential backoff
export async function callAIAgentWithRetry(
  params: AIAgentParams,
  maxRetries = 3
): Promise<AIResponse> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await callAIAgent(params);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
  throw new Error('Maximum retries exceeded');
}