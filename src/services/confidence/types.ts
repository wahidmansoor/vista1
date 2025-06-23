import { AIResponse, AIRequest } from '../AIService';

export type ConfidenceLevel = 'very_low' | 'low' | 'moderate' | 'high' | 'very_high';
export type QueryCategory = 'diagnosis' | 'treatment' | 'medication' | 'emergency' | 'general';

export interface EvidenceSource {
  id: string;
  type: 'research_paper' | 'clinical_guideline' | 'medical_database' | 'expert_consensus';
  title: string;
  confidence: number; // 0 to 1
  relevance: number; // 0 to 1
  metadata?: Record<string, any>;
}

export interface ConfidenceMetrics {
  overall: number; // 0 to 1
  evidenceStrength: number; // 0 to 1
  contextRelevance: number; // 0 to 1
  modelCertainty: number; // 0 to 1
  dataQuality: number; // 0 to 1
}

export interface ConfidenceThresholds {
  minimumOverall: number;
  minimumEvidence: number;
  minimumContext: number;
  requiresProfessionalConsult: number;
}

export interface ConfidenceResult {
  score: ConfidenceMetrics;
  level: ConfidenceLevel;
  queryCategory: QueryCategory;
  evidenceSources: EvidenceSource[];
  requiresConsultation: boolean;
  limitations: string[];
  suggestions: string[];
  metadata: {
    timestamp: string;
    modelVersion: string;
    dataVersion: string;
  };
}

export interface ConfidenceConfig {
  thresholds: Record<QueryCategory, ConfidenceThresholds>;
  evidenceWeights: Record<'research' | 'guidelines' | 'consensus', number>;
  contextFactors: string[];
  uncertaintyIndicators: string[];
  minimumEvidenceSources: number;
  dataVersion: string;
  loggerConfig: {
    retentionDays: number;
    logLevel: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';
    enableAnonymization: boolean;
  };
}

export interface ConfidenceCalculationRequest {
  aiRequest: AIRequest;
  aiResponse: AIResponse;
  queryCategory: QueryCategory;
  contextualData?: Record<string, any>;
}
