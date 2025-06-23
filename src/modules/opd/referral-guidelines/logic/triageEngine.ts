export interface TriageInput {
  age: number;
  symptoms: string;
  duration: string;
  clinicalFindings: string;
  highRiskFactors: string[];
  moderateRiskFactors: string[];
}

export interface TriageResult {
  urgency: 'Urgent' | 'Soon' | 'Routine';
  reasoning: string[];
  timeframe: string;
}

export const calculateRiskScore = (input: TriageInput): number => {
  let score = 0;

  // Check high-risk factors
  input.highRiskFactors.forEach((factor) => {
    if (
      input.clinicalFindings.toLowerCase().includes(factor.toLowerCase()) ||
      input.symptoms.toLowerCase().includes(factor.toLowerCase())
    ) {
      score += 3;
    }
  });

  // Check moderate-risk factors
  input.moderateRiskFactors.forEach((factor) => {
    if (
      input.clinicalFindings.toLowerCase().includes(factor.toLowerCase()) ||
      input.symptoms.toLowerCase().includes(factor.toLowerCase())
    ) {
      score += 2;
    }
  });

  // Age consideration
  if (input.age > 60) score += 1;
  if (input.age > 75) score += 1;

  // Duration consideration
  if (
    input.duration.includes('month') ||
    (input.duration.includes('week') && parseInt(input.duration) > 6)
  ) {
    score += 1;
  }

  return score;
};

export const determineTriageResult = (
  input: TriageInput,
  slaTimeframes: { urgent: string; routine: string }
): TriageResult => {
  const riskScore = calculateRiskScore(input);

  const urgency =
    riskScore >= 7 ? 'Urgent' : riskScore >= 4 ? 'Soon' : 'Routine';

  const reasoning: string[] = [];
  if (riskScore >= 7) {
    reasoning.push('Multiple high-risk factors identified');
    reasoning.push('Requires urgent assessment');
  } else if (riskScore >= 4) {
    reasoning.push('Moderate risk factors present');
    reasoning.push('Early assessment recommended');
  } else {
    reasoning.push('Routine assessment appropriate');
    reasoning.push('Low-risk presentation');
  }

  const timeframe =
    urgency === 'Urgent'
      ? slaTimeframes.urgent
      : slaTimeframes.routine || 'Not specified';

  return {
    urgency,
    reasoning,
    timeframe,
  };
};
