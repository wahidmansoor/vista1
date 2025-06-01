/**
 * Core types for the AI Agent system
 */

/**
 * Represents the structure of an AI response
 */
export interface AIResponse {
  /** The main content of the response */
  content: string;
  /** Timestamp of the response */
  timestamp: Date;
  /** Additional metadata about the response */
  metadata?: {
    module: ModuleType;
    intent: PromptIntent;
    model?: string;
  };
  /** Unique identifier for the response */
  id: string;
  /** Error message if the response failed */
  error?: string;
  /** Loading state of the response */
  loading?: boolean;
  /** The type or role of the message (e.g., assistant, user, system, error) */
  type?: 'assistant' | 'user' | 'system' | 'error' | 'function';
}

/**
 * Represents different modules in the application
 */
export type ModuleType = 'OPD' | 'CDU' | 'Inpatient' | 'Palliative' | 'RadOnc';

/**
 * Represents different types of AI agent prompts
 */
export type PromptIntent = 
  | 'screening' 
  | 'triage' 
  | 'follow-up' 
  | 'evaluation' 
  | 'toxicity'
  | 'general'
  | 'dose-check'
  | 'pathway'
  | 'rescue-agent';

/**
 * Represents the context provided to the AI agent
 * Currently a simple string, but can be extended to a more complex type if needed
 */
export type AIContext = string;

/**
 * Response status for AI operations
 */
export type AIResponseStatus = 
  | 'loading'
  | 'success'
  | 'error'
  | 'idle';