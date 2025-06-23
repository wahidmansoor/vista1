import { FollowUpTemplate, CancerType } from '../data/followUpTemplates';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export const validateTemplate = (
  template: FollowUpTemplate,
  cancerType: CancerType
): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required sections check
  const requiredSections = [
    'intervals',
    'surveillance',
    'redFlags',
    'urgentFlags',
    'qolTopics',
    'commonSymptoms'
  ];

  requiredSections.forEach(section => {
    if (!template[section]) {
      errors.push(`Missing required section: ${section}`);
    }
  });

  // Validate template structure
  if (!template.metadata?.version) {
    errors.push('Missing template version');
  }

  // Validate intervals
  Object.entries(template.intervals).forEach(([intent, intervals]) => {
    if (Object.keys(intervals).length === 0) {
      errors.push(`No follow-up intervals defined for ${intent} intent`);
    }
  });

  // Validate symptom mappings
  template.commonSymptoms.forEach(symptom => {
    if (!['low', 'medium', 'high'].includes(symptom.severity)) {
      errors.push(`Invalid severity for symptom: ${symptom.symptom}`);
    }
  });

  // Validate red flags
  template.redFlags.forEach(flag => {
    if (!template.commonSymptoms.some(s => 
      s.relatedFlags?.includes(flag.symptom)
    )) {
      warnings.push(`Red flag "${flag.symptom}" not linked to any common symptoms`);
    }
  });

  // Validate QoL topics
  if (template.qolTopics.length === 0) {
    errors.push('No quality of life topics defined');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

export const formatFrequency = (frequency: string): string => {
  // Convert standardized frequency to human-readable format
  const patterns = {
    '3m': '3 months',
    '6m': '6 months',
    '1y': '1 year'
  };
  return patterns[frequency] || frequency;
};
