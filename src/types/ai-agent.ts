export type ModuleType = 'OPD' | 'CDU' | 'INPATIENT' | 'MEDONC' | 'RADIATION' | 'PALLIATIVE' | 'HANDBOOK' | 'TOOLS';

export type PromptIntent = 
  | 'screening'
  | 'diagnosis'
  | 'treatment'
  | 'medication'
  | 'protocol'
  | 'emergency'
  | 'general'
  | 'evaluation'
  | 'dose-check'
  | 'toxicity'
  | 'supportive-care';

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
  metadata: {
    module: ModuleType;
    intent: PromptIntent;
    model: string;
    iterationCount?: number;
    feedbackType?: string;
  };
}
