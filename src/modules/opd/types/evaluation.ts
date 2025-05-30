export type CancerType = 
  | 'breast'
  | 'lung'
  | 'colorectal'
  | 'prostate'
  | 'ovarian'
  | 'gastric'
  | 'pancreatic'
  | 'lymphoma'
  | 'head_neck'
  | 'bladder';

export interface TNMStage {
  t: string;
  n: string;
  m: string;
}

export interface PerformanceStatus {
  ecog: number;
  kps: number;
}

export interface EvaluationField {
  text: string;
  tooltip: string;
  required?: boolean;
  redFlags?: string[];
}

export interface EvaluationSection {
  title: string;
  items: EvaluationField[];
  cancerSpecificNotes?: string[];
}

export interface EvaluationTemplate {
  title?: string;
  sections: EvaluationSection[];
  staging?: {
    tnm: TNMStage;
    performance: PerformanceStatus;
  };
  notes?: string[];
  redFlags?: string[];
  commonFindings?: string[];
}

// Cancer type templates for evaluation
export interface CancerTypeTemplate {
  [key: string]: {
    sections: EvaluationSection[];
    notes?: string[];
    redFlags?: string[];
  };
}
