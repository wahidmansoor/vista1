import { CancerType, Intent, cancerTemplates, FollowUpTemplate } from '../data/followUpTemplates';
import { validateTemplate, formatFrequency } from '../utils/templateValidation';

export type Stage = {
  t: string;
  n: string;
  m: string;
};

export interface FollowUpPlan {
  timeline: Array<{
    interval: string;
    actions: string[];
    dueDate?: Date;
    guidelines: string[];
  }>;
  surveillance: {
    investigations: Array<{
      title: string;
      frequency: string;
      isDue: boolean;
    }>;
    examinations: Array<{
      title: string;
      frequency: string;
      isDue: boolean;
    }>;
  };
  redFlags: string[];
  urgentFlags: string[];
  qolTopics: Array<{
    topic: string;
    description: string;
    recommendations: string[];
  }>;
  commonSymptoms: Array<{
    symptom: string;
    severity: 'low' | 'medium' | 'high';
  }>;
}

interface GuidelineItem {
  frequency: string;
}

export const generateFollowUpPlan = (
  cancerType: CancerType,
  stage: Stage,
  intent: Intent
): FollowUpPlan => {
  const template = cancerTemplates[cancerType];
  const { isValid, errors } = validateTemplate(template, cancerType);

  if (!isValid) {
    console.error(`Template validation failed for ${cancerType}:`, errors);
    throw new Error('Invalid follow-up template');
  }

  const stageKey = `${stage.t}${stage.n}${stage.m}`;
  const stageGuidelines = template.stageGuidelines[stageKey as keyof typeof template.stageGuidelines];
  
  // Convert the guidelines structure to the expected format
  const guidelines: GuidelineItem[] = [
    ...(stageGuidelines?.surveillance || []).map(item => ({ frequency: item.frequency })),
    ...(stageGuidelines?.imaging || []).map(item => ({ frequency: item.frequency })),
    ...(stageGuidelines?.labTests || []).map(item => ({ frequency: item.frequency }))
  ];

  const intervals = template.intervals[intent] || {};

  return {
    timeline: Object.entries(intervals).map(([interval, actions]) => ({
      interval: formatFrequency(interval),
      actions: actions.map(a => `${a.title} (${formatFrequency(a.frequency)})`),
      guidelines: guidelines.map((g: GuidelineItem) => formatFrequency(g.frequency))
    })),
    surveillance: {
      investigations: template.surveillance.investigations.map(i => ({ ...i, isDue: false })),
      examinations: template.surveillance.examinations.map(i => ({ ...i, isDue: false }))
    },
    redFlags: template.redFlags.map(flag => flag.symptom),
    urgentFlags: template.urgentFlags.map(flag => flag.condition),
    qolTopics: template.qolTopics,
    commonSymptoms: template.commonSymptoms
  };
};

export const evaluateSymptoms = (
  symptoms: string[],
  cancerType: CancerType
): { matches: string[]; riskLevel: 'low' | 'medium' | 'high' } => {
  return { matches: [], riskLevel: 'low' };
};
