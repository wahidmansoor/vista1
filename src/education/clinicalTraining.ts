/**
 * Clinical Education & Training Module
 * -----------------------------------
 * Interactive, evidence-based medical education for cancer screening and clinical reasoning.
 * Designed for medical students, residents, and practicing physicians.
 */

// Types for case-based learning
export interface ClinicalCase {
  id: string;
  title: string;
  scenario: string;
  patientData: Record<string, any>;
  decisionTree: DecisionNode;
  outcomes: CaseOutcome[];
  learningObjectives: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface DecisionNode {
  id: string;
  prompt: string;
  options: Array<{
    label: string;
    nextNodeId?: string;
    outcomeId?: string;
    rationale?: string;
  }>;
}

export interface CaseOutcome {
  id: string;
  description: string;
  learningPoints: string[];
  competencyAssessment: {
    passed: boolean;
    feedback: string;
  };
}

// Guideline evolution tracking
export interface GuidelineVersion {
  year: number;
  source: string;
  summary: string;
  keyChanges: string[];
  evidenceTimeline: Array<{
    year: number;
    evidence: string;
    impact: string;
  }>;
}

// Clinical reasoning development
export interface ReasoningExercise {
  id: string;
  description: string;
  exerciseType: 'diagnostic' | 'riskAssessment' | 'communication' | 'errorAnalysis';
  scenario: string;
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  }>;
}

// Continuing education integration
export interface CMEActivity {
  id: string;
  title: string;
  objectives: string[];
  creditHours: number;
  assessment: {
    questions: Array<{
      question: string;
      options: string[];
      correctAnswer: string;
    }>;
    passingScore: number;
  };
  certification: {
    awarded: boolean;
    dateAwarded?: Date;
  };
  progress: {
    completed: boolean;
    percent: number;
  };
}

// Example: Exported module API
export const ClinicalEducation = {
  // Case-based learning
  getCases: (): ClinicalCase[] => [
    // Example case (de-identified)
    {
      id: 'case1',
      title: '45-year-old with rectal bleeding',
      scenario: 'A 45-year-old presents with intermittent rectal bleeding. No family history. Smoker. BMI 32.',
      patientData: {
        age: 45,
        symptoms: ['rectal bleeding'],
        riskFactors: ['smoking', 'obesity'],
      },
      decisionTree: {
        id: 'start',
        prompt: 'What is your next step?',
        options: [
          { label: 'Order colonoscopy', outcomeId: 'outcome1', rationale: 'Meets criteria for early screening.' },
          { label: 'Reassure and observe', outcomeId: 'outcome2', rationale: 'Misses early cancer.' },
        ],
      },
      outcomes: [
        {
          id: 'outcome1',
          description: 'Colonoscopy reveals early-stage colorectal cancer. Early intervention possible.',
          learningPoints: ['Early screening saves lives', 'Risk factors increase suspicion'],
          competencyAssessment: { passed: true, feedback: 'Correct decision. Guideline-compliant.' },
        },
        {
          id: 'outcome2',
          description: 'Delayed diagnosis. Cancer progresses.',
          learningPoints: ['Missed opportunity for early detection'],
          competencyAssessment: { passed: false, feedback: 'Incorrect. Missed guideline-based screening.' },
        },
      ],
      learningObjectives: ['Recognize red flag symptoms', 'Apply screening guidelines'],
      difficulty: 'beginner',
    },
  ],

  // Guideline evolution tracking
  getGuidelineHistory: (): GuidelineVersion[] => [
    {
      year: 2025,
      source: 'USPSTF',
      summary: 'Lowered colorectal screening age to 45.',
      keyChanges: ['Earlier screening start', 'Broader risk stratification'],
      evidenceTimeline: [
        { year: 2020, evidence: 'Increased incidence in <50y', impact: 'Guideline change' },
        { year: 2023, evidence: 'RCT: Early detection improves outcomes', impact: 'Practice change' },
      ],
    },
  ],

  // Clinical reasoning development
  getReasoningExercises: (): ReasoningExercise[] => [
    {
      id: 'ex1',
      description: 'Risk assessment for a 55-year-old woman with BRCA1 mutation',
      exerciseType: 'riskAssessment',
      scenario: 'Patient with BRCA1 mutation, no prior cancer, mother had breast cancer at 42.',
      questions: [
        {
          question: 'What is her estimated lifetime breast cancer risk?',
          options: ['10%', '30%', '60%', '85%'],
          correctAnswer: '85%',
          explanation: 'BRCA1 mutation confers up to 85% risk.',
        },
      ],
    },
  ],

  // CME activities
  getCMEActivities: (): CMEActivity[] => [
    {
      id: 'cme1',
      title: 'Colorectal Cancer Screening Update 2025',
      objectives: ['Understand new screening age', 'Apply risk stratification'],
      creditHours: 1,
      assessment: {
        questions: [
          {
            question: 'At what age should average-risk adults begin colorectal cancer screening?',
            options: ['40', '45', '50', '55'],
            correctAnswer: '45',
          },
        ],
        passingScore: 80,
      },
      certification: { awarded: false },
      progress: { completed: false, percent: 0 },
    },
  ],
};
