import type { EmergencyCondition } from '../emergency/types';
import type { SymptomSeverity } from './types';
import { mapNumberToSeverity } from '../emergency/config';

export function mapScoreToTriageLevel(score: number): EmergencyCondition['severity'] {
  return mapNumberToSeverity(score);
}

export function calculateSeverityScore(
  baseScore: number,
  factors: {
    duration?: string;
    frequency?: string;
    interference?: number;
  }
): number {
  let score = baseScore;

  // Adjust score based on duration
  if (factors.duration) {
    if (factors.duration.includes('week')) score += 1;
    if (factors.duration.includes('month')) score += 2;
  }

  // Adjust score based on frequency
  if (factors.frequency) {
    if (factors.frequency.includes('daily')) score += 1;
    if (factors.frequency.includes('constant')) score += 2;
  }

  // Adjust score based on interference with daily activities
  if (factors.interference) {
    score += Math.min(factors.interference / 2, 2);
  }

  return Math.min(score, 10); // Cap at 10
}

export function getSeverityDetails(score: number): SymptomSeverity {
  return {
    level: getSymptomSeverityLevel(score),
    score,
    requiresImmediate: score >= 8
  };
}

function getSymptomSeverityLevel(score: number): SymptomSeverity['level'] {
  if (score >= 8) return 'life-threatening';
  if (score >= 6) return 'severe';
  if (score >= 4) return 'moderate';
  return 'mild';
}
