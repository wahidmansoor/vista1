export type ModuleType = 'OPD' | 'CDU' | 'INPATIENT' | 'MEDONC' | 'RADIATION' | 'PALLIATIVE' | 'HANDBOOK' | 'TOOLS';

export type PromptIntent = 
  | 'screening'
  | 'diagnosis'
  | 'treatment'
  | 'medication'
  | 'protocol'
  | 'emergency'
  | 'general'
  | 'triage'
  | 'follow-up'
  | 'dose-check'
  | 'toxicity'
  | 'evaluation'
  | 'pathway'
  | 'rescue-agent';

export interface AIRequestBody {
  module: ModuleType;
  intent: PromptIntent;
  prompt: string;
  context?: string;
  history?: string[];
  mockMode?: boolean;
  iterationCount?: number;
  previousResponse?: string;
  feedbackType?: 'positive' | 'negative' | 'neutral';
}

export interface AIError {
  name: string;
  message: string;
  code: string;
  statusCode?: number;
  details?: any;
}

export interface AIResponse {
  id: string;
  content: string;
  timestamp: string;
  type?: 'assistant' | 'user' | 'system' | 'error' | 'function'; // Added type property
  metadata: {
    module: ModuleType;
    intent: PromptIntent;
    model: string;
    iterationCount?: number;
    feedbackType?: string;
  };
}
