/**
 * MASCC Risk Index scorer for febrile neutropenia
 * MASCC score ≥21 indicates low risk
 * @param parameters Object containing MASCC scoring parameters
 */
export const calculateMASCCScore = (parameters: {
  burden: 'mild' | 'moderate' | 'severe';
  hypotension: boolean;
  copd: boolean;
  solidTumor: boolean;
  noDehydration: boolean;
  outpatient: boolean;
  age: number;
}): number => {
  let score = 0;
  
  // Burden of illness
  if (parameters.burden === 'mild') score += 5;
  else if (parameters.burden === 'moderate') score += 3;
  
  // No hypotension
  if (!parameters.hypotension) score += 5;
  
  // No COPD
  if (!parameters.copd) score += 4;
  
  // Solid tumor or no previous fungal infection
  if (parameters.solidTumor) score += 4;
  
  // No dehydration
  if (parameters.noDehydration) score += 3;
  
  // Outpatient status
  if (parameters.outpatient) score += 3;
  
  // Age < 60
  if (parameters.age < 60) score += 2;
  
  return score;
};

/**
 * Determines recommended care setting based on emergency type and severity
 * @param emergencyType Type of oncologic emergency
 * @param severityFactors Factors affecting severity
 */
export const recommendCareLevel = (
  emergencyType: string,
  severityFactors: {
    altered_consciousness: boolean;
    systolic_bp_below_90: boolean;
    respiratory_distress: boolean;
    requires_vasopressors: boolean;
    acute_organ_failure: boolean;
  }
): 'Ward' | 'Step-down' | 'ICU' => {
  
  // Count severity factors
  const severityCount = Object.values(severityFactors).filter(Boolean).length;
  
  // Emergency types that typically require higher levels of care
  const highRiskEmergencies = [
    'tumor-lysis-syndrome', 
    'superior-vena-cava-syndrome',
    'neutropenic-sepsis'
  ];
  
  // Decision logic
  if (severityCount >= 2) {
    return 'ICU';
  } else if (severityCount === 1 || highRiskEmergencies.includes(emergencyType)) {
    return 'Step-down';
  } else {
    return 'Ward';
  }
};

/**
 * Formats time to action for display
 * @param timeString Time string (e.g., "60 minutes")
 */
export const formatTimeToAction = (timeString: string): string => {
  const match = timeString.match(/(\d+)\s*(\w+)/);
  if (!match) return timeString;
  
  const [_, value, unit] = match;
  const numValue = parseInt(value, 10);
  
  if (unit.startsWith('minute')) {
    if (numValue < 60) return `${numValue}m`;
    return `${Math.floor(numValue/60)}h ${numValue%60}m`;
  } else if (unit.startsWith('hour')) {
    return `${numValue}h`;
  } else if (unit.startsWith('day')) {
    return `${numValue}d`;
  }
  
  return timeString;
};
