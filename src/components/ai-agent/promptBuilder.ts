import { ModuleType, PromptIntent } from '../../types/ai-agent';

type PromptTemplate = {
  instruction: string;
  contextPrefix?: string;
};

type AIContext = string;  // Simple string context for now

/**
 * Module-specific prompt templates mapped by intent
 */
const PROMPT_TEMPLATES: Record<ModuleType, Partial<Record<PromptIntent, PromptTemplate>>> = {
  // API-based modules
  'protocol-search': {
    search: {
      instruction: 'Search for oncology protocols based on clinical criteria.',
      contextPrefix: 'Search parameters:\n'
    },
    analyze: {
      instruction: 'Analyze protocol effectiveness and evidence.',
      contextPrefix: 'Protocol data:\n'
    }
  },
  'emergency-cards': {
    search: {
      instruction: 'Find emergency management cards for oncologic situations.',
      contextPrefix: 'Emergency scenario:\n'
    },
    recommend: {
      instruction: 'Recommend emergency interventions.',
      contextPrefix: 'Clinical emergency:\n'
    }
  },
  'medication-calculator': {
    calculate: {
      instruction: 'Calculate medication dosages based on patient parameters.',
      contextPrefix: 'Calculation parameters:\n'
    },
    'dose-check': {
      instruction: 'Verify medication dosing accuracy and safety.',
      contextPrefix: 'Dosing information:\n'
    }
  },
  'supportive-care': {
    recommend: {
      instruction: 'Provide supportive care recommendations.',
      contextPrefix: 'Patient needs:\n'
    },
    explain: {
      instruction: 'Explain supportive care interventions.',
      contextPrefix: 'Care context:\n'
    }
  },
  'toxicity-management': {
    toxicity: {
      instruction: 'Manage treatment-related toxicity.',
      contextPrefix: 'Toxicity assessment:\n'
    },
    recommend: {
      instruction: 'Recommend toxicity management strategies.',
      contextPrefix: 'Clinical presentation:\n'
    }
  },
  'patient-education': {
    explain: {
      instruction: 'Provide patient-friendly medical explanations.',
      contextPrefix: 'Education topic:\n'
    },
    generate: {
      instruction: 'Generate patient education materials.',
      contextPrefix: 'Content requirements:\n'
    }
  },
  general: {
    general: {
      instruction: 'Provide general oncology guidance.',
      contextPrefix: 'Clinical query:\n'
    },
    analyze: {
      instruction: 'Analyze clinical information.',
      contextPrefix: 'Clinical data:\n'
    }
  },
  // Clinical area modules
  CDU: {
    'dose-check': {
      instruction: 'Evaluate chemotherapy dose adjustments considering patient factors and toxicity guidelines.',
      contextPrefix: 'Parameters for dose evaluation:\n'
    },
    toxicity: {
      instruction: 'Analyze chemotherapy toxicity profile and suggest management strategies.',
      contextPrefix: 'Clinical presentation:\n'
    },
    'rescue-agent': {
      instruction: 'Provide emergency management guidance for chemotherapy complications.',
      contextPrefix: 'Emergency scenario:\n'
    }
  },
  OPD: {
    'triage': {
      instruction: 'Evaluate oncology outpatient for urgency and appropriate disposition.',
      contextPrefix: 'Patient presentation:\n'
    },
    'screening': {
      instruction: 'Analyze cancer screening eligibility and recommend appropriate tests.',
      contextPrefix: 'Patient risk factors:\n'
    },
    'pathway': {
      instruction: 'Guide diagnostic workup based on presenting symptoms and suspected malignancy.',
      contextPrefix: 'Clinical scenario:\n'
    },
    'follow-up': {
      instruction: 'Recommend appropriate cancer surveillance and follow-up plan.',
      contextPrefix: 'Treatment history:\n'
    }
  },
  Inpatient: {
    'rescue-agent': {
      instruction: 'Provide acute management for oncologic emergency.',
      contextPrefix: 'Current emergency:\n'
    },
    'toxicity': {
      instruction: 'Evaluate and manage inpatient chemotherapy complications.',
      contextPrefix: 'Toxicity presentation:\n'
    }
  },
  Palliative: {
    'triage': {
      instruction: 'Assess palliative care needs and recommend appropriate interventions.',
      contextPrefix: 'Patient condition:\n'
    },
    'pathway': {
      instruction: 'Guide symptom management and end-of-life care planning.',
      contextPrefix: 'Current symptoms:\n'
    }
  },  RadOnc: {
    'dose-check': {
      instruction: 'Evaluate radiation therapy parameters and potential adjustments.',
      contextPrefix: 'Treatment parameters:\n'
    },
    'toxicity': {
      instruction: 'Assess and manage radiation-related adverse effects.',
      contextPrefix: 'Side effects:\n'
    }
  }
};

/**
 * Default fallback templates when specific module+intent combination isn't found
 */
const DEFAULT_TEMPLATES: Record<PromptIntent, PromptTemplate> = {
  search: {
    instruction: 'Search for relevant clinical information.',
    contextPrefix: 'Search criteria:\n'
  },
  calculate: {
    instruction: 'Perform clinical calculations.',
    contextPrefix: 'Calculation parameters:\n'
  },
  explain: {
    instruction: 'Provide clear clinical explanations.',
    contextPrefix: 'Topic to explain:\n'
  },
  recommend: {
    instruction: 'Provide clinical recommendations.',
    contextPrefix: 'Clinical scenario:\n'
  },
  generate: {
    instruction: 'Generate clinical content.',
    contextPrefix: 'Content requirements:\n'
  },
  analyze: {
    instruction: 'Analyze clinical data.',
    contextPrefix: 'Data to analyze:\n'
  },
  summarize: {
    instruction: 'Summarize clinical information.',
    contextPrefix: 'Information to summarize:\n'
  },
  'general': {
    instruction: 'Provide clinical guidance based on oncology best practices.',
    contextPrefix: 'Clinical context:\n'
  },
  'triage': {
    instruction: 'Evaluate clinical urgency and recommend appropriate actions.',
    contextPrefix: 'Patient status:\n'
  },
  'dose-check': {
    instruction: 'Review treatment dosing parameters for safety and appropriateness.',
    contextPrefix: 'Dosing context:\n'
  },
  'rescue-agent': {
    instruction: 'Provide emergency management recommendations.',
    contextPrefix: 'Emergency details:\n'
  },
  'screening': {
    instruction: 'Evaluate cancer screening needs and recommendations.',
    contextPrefix: 'Patient factors:\n'
  },
  'follow-up': {
    instruction: 'Recommend appropriate follow-up and monitoring plan.',
    contextPrefix: 'Clinical history:\n'
  },
  'toxicity': {
    instruction: 'Assess treatment-related toxicity and provide management guidance.',
    contextPrefix: 'Toxicity details:\n'
  },
  'pathway': {
    instruction: 'Guide clinical decision-making based on established pathways.',
    contextPrefix: 'Clinical scenario:\n'
  },
  'evaluation': {
    instruction: 'Evaluate clinical condition or treatment response.',
    contextPrefix: 'Evaluation parameters:\n'
  }
};

/**
 * Builds a specialized prompt based on module, intent, and context
 */
export function promptBuilder(
  module: ModuleType,
  intent: PromptIntent,
  context: AIContext,
  userPrompt?: string
): string {
  // Get module-specific template, fallback to default if not found
  const template = PROMPT_TEMPLATES[module]?.[intent] ?? DEFAULT_TEMPLATES[intent];
  
  // Build the complete prompt
  const parts = [
    // Core instruction
    `[Instruction] ${template.instruction}`,
    
    // Context with optional prefix
    template.contextPrefix ? `${template.contextPrefix}${context}` : context,
    
    // User's specific prompt if provided
    userPrompt ? `\nSpecific query: ${userPrompt}` : ''
  ];

  // Join all parts and trim any extra whitespace
  return parts.filter(Boolean).join('\n\n').trim();
}