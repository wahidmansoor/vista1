// AI Agent Types
export interface AIError {
  code: string;
  message: string;
  details?: any;
}

export interface AIRequestBody {
  prompt: string;
  context?: string;
  module?: ModuleType;
  intent?: PromptIntent;
  parameters?: Record<string, any>;
  mockMode?: boolean;
  history?: Array<{
    prompt: string;
    response: string;
    timestamp: number;
  }>;
  iterationCount?: number;
  previousResponse?: string;
  feedbackType?: 'positive' | 'negative' | 'suggestion';
}

export interface AIResponse {
  success: boolean;
  data?: any;
  error?: AIError;
  message?: string;
}

export type ModuleType = 
  | 'protocol-search'
  | 'emergency-cards'
  | 'medication-calculator'
  | 'supportive-care'
  | 'toxicity-management'
  | 'patient-education'
  | 'general'
  | 'OPD'
  | 'CDU'
  | 'Inpatient'
  | 'Palliative'
  | 'RadOnc';

export type PromptIntent = 
  | 'search'
  | 'calculate'
  | 'explain'
  | 'recommend'
  | 'generate'
  | 'analyze'
  | 'summarize'
  | 'dose-check'
  | 'pathway'
  | 'rescue-agent'
  | 'general'
  | 'follow-up'
  | 'toxicity'
  | 'evaluation'
  | 'triage'
  | 'screening';

export interface AIConfiguration {
  model: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

export interface AIAgentContext {
  userId?: string;
  sessionId?: string;
  timestamp: number;
  module: ModuleType;
  previousInteractions?: AIInteraction[];
}

export interface AIInteraction {
  id: string;
  timestamp: number;
  prompt: string;
  response: string;
  intent: PromptIntent;
  success: boolean;
}
