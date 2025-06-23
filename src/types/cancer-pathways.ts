export interface RedFlag {
  id: string;
  condition: string;
  message: string;
  severity: 'warning' | 'critical';
  recommendations: string[];
  urgency?: "Immediate" | "Same-day" | "Routine";
  actionType?: string;
}

export interface PathwayStep {
  id: string;
  title: string;
  description: string;
  expectedDuration?: string;
  tooltip?: string;
  redFlags?: RedFlag[];
  options: {
    text: string;
    next: string;
    triggers?: string[]; // IDs of any red flags this option triggers
  }[];
  evidenceLevel?: "I" | "II" | "III";
  guidelineSource?: string;
  calculatorId?: string;
  patientInfo?: string;
  requiresMDT?: boolean;
  pitfalls?: string[];
}

export interface StepBasedPathway {
  id: string;
  name: string;
  description: string;
  steps: PathwayStep[];
  recommendedTimeframe?: string;
}

export interface PathwayProgress {
  completedSteps: string[];
  currentStep: string;
  redFlagsTriggered: string[];
  timeStarted: number;
}

export type CancerType = 
  | 'breast' 
  | 'prostate' 
  | 'lung' 
  | 'ovarian'
  | 'gastric'
  | 'head_neck'
  | 'pancreatic'
  | 'bladder'
  | 'colorectal'
  | 'lymphoma';

export interface PathwaySummaryCard {
  totalSteps: number;
  completedSteps: number;
  activeRedFlags: RedFlag[];
  estimatedTimeRemaining?: string;
  nextRequiredActions: string[];
}

export interface ViewMode {
  type: 'wizard' | 'expanded';
  showTimeline: boolean;
  showChecklist: boolean;
}
