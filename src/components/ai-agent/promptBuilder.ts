import { ModuleType, PromptIntent, AIContext } from './types';

type PromptTemplate = {
  instruction: string;
  contextPrefix?: string;
};

/**
 * Module-specific prompt templates mapped by intent
 */
const PROMPT_TEMPLATES: Record<ModuleType, Partial<Record<PromptIntent, PromptTemplate>>> = {
  CDU: {
    'dose-check': {
      instruction: 'Evaluate chemotherapy dose adjustments considering patient factors and toxicity guidelines.',
      contextPrefix: 'Parameters for dose evaluation:\n'
    },
    'toxicity': {
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
  },
  RadOnc: {
    'dose-check': {
      instruction: 'Evaluate radiation therapy parameters and potential adjustments.',
      contextPrefix: 'Treatment parameters:\n'
    },
    'toxicity': {
      instruction: 'Assess and manage radiation-related adverse effects.',
      contextPrefix: 'Side effects:\n'
    }
  },
  Tools: {
    'general': {
      instruction: 'Provide guidance on clinical calculations and tool usage.',
      contextPrefix: 'Tool context:\n'
    }
  }
};

/**
 * Ensure all PromptIntent keys are present in DEFAULT_TEMPLATES
 */
const ALL_PROMPT_INTENTS: PromptIntent[] = [
  'screening',
  'general',
  'triage',
  'follow-up',
  'dose-check',
  'toxicity',
  'evaluation',
  'pathway',
  'rescue-agent'
];

const DEFAULT_TEMPLATES: Record<PromptIntent, PromptTemplate> = {
  'screening': {
    instruction: 'Evaluate cancer screening needs and recommendations.',
    contextPrefix: 'Patient factors:\n'
  },
  'general': {
    instruction: 'Provide clinical guidance based on oncology best practices.',
    contextPrefix: 'Clinical context:\n'
  },
  'triage': {
    instruction: 'Evaluate clinical urgency and recommend appropriate actions.',
    contextPrefix: 'Patient status:\n'
  },
  'follow-up': {
    instruction: 'Recommend appropriate follow-up and monitoring plan.',
    contextPrefix: 'Clinical history:\n'
  },
  'dose-check': {
    instruction: 'Review treatment dosing parameters for safety and appropriateness.',
    contextPrefix: 'Dosing context:\n'
  },
  'toxicity': {
    instruction: 'Assess treatment-related toxicity and provide management guidance.',
    contextPrefix: 'Toxicity details:\n'
  },
  'evaluation': {
    instruction: 'Evaluate patient status and summarize key findings.',
    contextPrefix: 'Evaluation context:\n'
  },
  'pathway': {
    instruction: 'Guide clinical decision-making based on established pathways.',
    contextPrefix: 'Clinical scenario:\n'
  },
  'rescue-agent': {
    instruction: 'Provide emergency management recommendations.',
    contextPrefix: 'Emergency details:\n'
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