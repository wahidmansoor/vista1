/**
 * Advanced Treatment Matching Engine
 * Evidence-based treatment protocol matching with sophisticated algorithms
 */

import {
  CancerType,
  TreatmentProtocol,
  PatientProfile,
  TreatmentRecommendation,
  BiomarkerResult,
  EligibilityStatus,
  TreatmentLine,
  EvidenceLevel
} from '@/types/medical';
import { treatmentDb } from './treatmentDatabase';

// Matching score weights for different criteria
const MATCHING_WEIGHTS = {
  cancer_type: 0.25,
  stage: 0.20,
  biomarkers: 0.20,
  performance_status: 0.15,
  prior_treatments: 0.10,
  comorbidities: 0.05,
  age: 0.05
} as const;

// Scoring thresholds
const SCORING_THRESHOLDS = {
  excellent: 0.9,
  good: 0.75,
  acceptable: 0.6,
  poor: 0.4
} as const;

export interface MatchingCriteria {
  patient: PatientProfile;
  treatmentLine?: TreatmentLine;
  treatmentIntent?: 'curative' | 'palliative';
  maxResults?: number;
  includeExperimental?: boolean;
  minimumEvidenceLevel?: EvidenceLevel;
}

export interface MatchingResult {
  protocol: TreatmentProtocol;
  matchScore: number;
  eligibilityStatus: EligibilityStatus;
  matchReasons: MatchReason[];
  contraindications: Contraindication[];
  recommendations: string[];
  confidence: 'high' | 'medium' | 'low';
}

export interface MatchReason {
  criteria: string;
  score: number;
  weight: number;
  explanation: string;
  supporting_evidence?: string;
}

export interface Contraindication {
  type: 'absolute' | 'relative';
  category: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  override_possible: boolean;
}

export class TreatmentMatchingEngine {
  private static instance: TreatmentMatchingEngine;
  private protocolCache: Map<string, TreatmentProtocol[]> = new Map();
  private cacheExpiry: number = 5 * 60 * 1000; // 5 minutes
  private lastCacheUpdate: number = 0;

  static getInstance(): TreatmentMatchingEngine {
    if (!TreatmentMatchingEngine.instance) {
      TreatmentMatchingEngine.instance = new TreatmentMatchingEngine();
    }
    return TreatmentMatchingEngine.instance;
  }

  /**
   * Main method to find matching treatment protocols
   */
  async findMatchingProtocols(criteria: MatchingCriteria): Promise<MatchingResult[]> {
    try {
      // Get relevant protocols
      const protocols = await this.getRelevantProtocols(criteria);
      
      // Score each protocol
      const scoredProtocols = await Promise.all(
        protocols.map(protocol => this.scoreProtocol(protocol, criteria))
      );

      // Filter by minimum score and evidence level
      const filteredResults = scoredProtocols
        .filter(result => {
          if (criteria.minimumEvidenceLevel) {
            const evidenceLevels = ['A', 'B', 'C', 'D'];
            const minIndex = evidenceLevels.indexOf(criteria.minimumEvidenceLevel);
            const protocolIndex = evidenceLevels.indexOf(result.protocol.evidence_level);
            return protocolIndex <= minIndex;
          }
          return result.matchScore >= SCORING_THRESHOLDS.poor;
        })
        .sort((a, b) => b.matchScore - a.matchScore);

      // Apply result limit
      const maxResults = criteria.maxResults || 10;
      return filteredResults.slice(0, maxResults);

    } catch (error) {
      console.error('Error in treatment matching:', error);
      throw new Error('Failed to find matching protocols');
    }
  }

  /**
   * Get protocols relevant to the patient's cancer type and stage
   */
  private async getRelevantProtocols(criteria: MatchingCriteria): Promise<TreatmentProtocol[]> {
    const { patient } = criteria;
    const cancerTypeId = patient.disease_status.primary_cancer_type;
    
    if (!cancerTypeId) {
      throw new Error('Patient cancer type not specified');
    }

    // Check cache first
    const cacheKey = `${cancerTypeId}_${criteria.treatmentLine || 'all'}`;
    const now = Date.now();
    
    if (this.protocolCache.has(cacheKey) && (now - this.lastCacheUpdate) < this.cacheExpiry) {
      return this.protocolCache.get(cacheKey)!;
    }

    // Fetch from database
    const protocols = await treatmentDb.getProtocolsForCancer(
      cancerTypeId,
      criteria.treatmentLine,
      false // includeInactive = false (is_active: true)
    );

    // Update cache
    this.protocolCache.set(cacheKey, protocols);
    this.lastCacheUpdate = now;

    return protocols;
  }

  /**
   * Score a protocol against patient criteria
   */
  private async scoreProtocol(
    protocol: TreatmentProtocol,
    criteria: MatchingCriteria
  ): Promise<MatchingResult> {
    const { patient } = criteria;
    const matchReasons: MatchReason[] = [];
    const contraindications: Contraindication[] = [];
    const recommendations: string[] = [];

    // Score cancer type match
    const cancerTypeScore = this.scoreCancerTypeMatch(protocol, patient);
    matchReasons.push({
      criteria: 'cancer_type',
      score: cancerTypeScore,
      weight: MATCHING_WEIGHTS.cancer_type,
      explanation: `Protocol compatibility with ${patient.disease_status.primary_cancer_type}`
    });

    // Score stage compatibility
    const stageScore = this.scoreStageMatch(protocol, patient);
    matchReasons.push({
      criteria: 'stage',
      score: stageScore,
      weight: MATCHING_WEIGHTS.stage,
      explanation: `Protocol suitability for stage ${patient.disease_status.stage}`
    });

    // Score biomarker compatibility
    const biomarkerScore = await this.scoreBiomarkerMatch(protocol, patient);
    matchReasons.push({
      criteria: 'biomarkers',
      score: biomarkerScore.score,
      weight: MATCHING_WEIGHTS.biomarkers,
      explanation: biomarkerScore.explanation
    });

    // Score performance status
    const performanceScore = this.scorePerformanceStatus(protocol, patient);
    matchReasons.push({
      criteria: 'performance_status',
      score: performanceScore,
      weight: MATCHING_WEIGHTS.performance_status,
      explanation: `ECOG ${patient.performance_metrics.ecog_score} compatibility`
    });

    // Score prior treatments
    const priorTreatmentScore = this.scorePriorTreatments(protocol, patient);
    matchReasons.push({
      criteria: 'prior_treatments',
      score: priorTreatmentScore,
      weight: MATCHING_WEIGHTS.prior_treatments,
      explanation: 'Previous treatment history compatibility'
    });

    // Score comorbidities
    const comorbidityResult = this.scoreComorbidities(protocol, patient);
    matchReasons.push({
      criteria: 'comorbidities',
      score: comorbidityResult.score,
      weight: MATCHING_WEIGHTS.comorbidities,
      explanation: 'Comorbidity risk assessment'
    });
    contraindications.push(...comorbidityResult.contraindications);

    // Score age appropriateness
    const ageScore = this.scoreAge(protocol, patient);
    matchReasons.push({
      criteria: 'age',
      score: ageScore,
      weight: MATCHING_WEIGHTS.age,
      explanation: 'Age-appropriate treatment selection'
    });

    // Calculate overall match score
    const matchScore = matchReasons.reduce(
      (total, reason) => total + (reason.score * reason.weight),
      0
    );

    // Determine eligibility status
    const eligibilityStatus = this.determineEligibilityStatus(
      matchScore,
      contraindications,
      protocol
    );

    // Generate recommendations
    const protocolRecommendations = this.generateRecommendations(
      protocol,
      patient,
      matchReasons,
      contraindications
    );
    recommendations.push(...protocolRecommendations);

    // Determine confidence level
    const confidence = this.determineConfidence(matchScore, contraindications);

    return {
      protocol,
      matchScore,
      eligibilityStatus,
      matchReasons,
      contraindications,
      recommendations,
      confidence
    };
  }

  private scoreCancerTypeMatch(protocol: TreatmentProtocol, patient: PatientProfile): number {
    const patientCancerType = patient.disease_status.primary_cancer_type;
    
    if (protocol.cancer_types.includes(patientCancerType)) {
      return 1.0; // Perfect match
    }
    
    // Check for related cancer types or broader categories
    // This could be enhanced with a cancer type relationship database
    return 0.0;
  }

  private scoreStageMatch(protocol: TreatmentProtocol, patient: PatientProfile): number {
    const patientStage = patient.disease_status.stage;
    const eligibleStages = protocol.eligibility_criteria.stages || [];
    
    if (eligibleStages.includes(patientStage) || eligibleStages.includes('any')) {
      return 1.0;
    }
    
    // Partial matches for related stages
    if (patientStage && eligibleStages.length > 0) {
      // Simple stage similarity scoring
      const stageNumbers = eligibleStages
        .map((stage: string) => parseInt(stage.replace(/[^0-9]/g, '')))
        .filter((num: number) => !isNaN(num));
      
      const patientStageNum = parseInt(patientStage.replace(/[^0-9]/g, ''));
      
      if (!isNaN(patientStageNum) && stageNumbers.length > 0) {
        const closestStage = stageNumbers.reduce((prev: number, curr: number) => 
          Math.abs(curr - patientStageNum) < Math.abs(prev - patientStageNum) ? curr : prev
        );
        
        const difference = Math.abs(closestStage - patientStageNum);
        return Math.max(0, 1 - (difference * 0.2)); // Decrease score by 20% per stage difference
      }
    }
    
    return 0.2; // Low but not zero for potential off-label use
  }

  private async scoreBiomarkerMatch(
    protocol: TreatmentProtocol, 
    patient: PatientProfile
  ): Promise<{ score: number; explanation: string }> {
    const patientBiomarkers = patient.genetic_profile.biomarker_results || [];
    const requiredBiomarkers = protocol.eligibility_criteria.required_biomarkers || [];
    const excludedBiomarkers = protocol.eligibility_criteria.excluded_biomarkers || [];
    
    let score = 0.8; // Start with good base score
    let explanation = 'Biomarker compatibility assessment';
    
    // Check required biomarkers
    for (const required of requiredBiomarkers) {
      const patientResult = patientBiomarkers.find((b: BiomarkerResult) => b.biomarker_id === required.biomarker_id);
      
      if (!patientResult) {
        score -= 0.3; // Penalize missing required biomarker
        explanation += `, missing required ${required.biomarker_name}`;
      } else if (patientResult.status !== required.expected_status) {
        score -= 0.2; // Penalize wrong biomarker status
        explanation += `, ${required.biomarker_name} status mismatch`;
      } else {
        explanation += `, positive ${required.biomarker_name}`;
      }
    }
    
    // Check excluded biomarkers
    for (const excluded of excludedBiomarkers) {
      const patientResult = patientBiomarkers.find((b: BiomarkerResult) => b.biomarker_id === excluded.biomarker_id);
      
      if (patientResult && patientResult.status === excluded.excluded_status) {
        score -= 0.4; // Major penalty for contraindicated biomarker
        explanation += `, contraindicated ${excluded.biomarker_name}`;
      }
    }
    
    return {
      score: Math.max(0, Math.min(1, score)),
      explanation
    };
  }

  private scorePerformanceStatus(protocol: TreatmentProtocol, patient: PatientProfile): number {
    const ecogScore = patient.performance_metrics.ecog_score;
    const requiredEcog = protocol.eligibility_criteria.max_ecog_score;
    
    if (typeof ecogScore !== 'number' || typeof requiredEcog !== 'number') {
      return 0.5; // Neutral score if data missing
    }
    
    if (ecogScore <= requiredEcog) {
      return 1.0; // Meets requirements
    }
    
    // Gradual decrease for higher ECOG scores
    const difference = ecogScore - requiredEcog;
    return Math.max(0, 1 - (difference * 0.3));
  }

  private scorePriorTreatments(protocol: TreatmentProtocol, patient: PatientProfile): number {
    const treatmentHistory = patient.treatment_history || [];
    const protocolLine = protocol.line_of_therapy;
    
    // Check if patient has had appropriate prior treatments for this line
    const priorLines = treatmentHistory.filter(t => t.treatment_line).length;
    
    const expectedPriorLines: Record<TreatmentLine, number> = {
      'first': 0,
      'second': 1,
      'third': 2,
      'fourth_plus': 3,
      'salvage': 2,
      'maintenance': 1,
      'bridging': 1
    };
    
    const expected = expectedPriorLines[protocolLine] || 0;
    
    if (priorLines === expected) {
      return 1.0;
    } else if (Math.abs(priorLines - expected) === 1) {
      return 0.7;
    } else {
      return 0.4;
    }
  }

  private scoreComorbidities(
    protocol: TreatmentProtocol, 
    patient: PatientProfile
  ): { score: number; contraindications: Contraindication[] } {
    const comorbidities = patient.comorbidities || [];
    const protocolContraindications = protocol.contraindications || [];
    const contraindications: Contraindication[] = [];
    
    let score = 1.0;
    
    for (const comorbidity of comorbidities) {
      const matchingContraindication = protocolContraindications.find(
        c => c.condition?.toLowerCase() === comorbidity.condition?.toLowerCase()
      );
      
      if (matchingContraindication) {
        const severity = matchingContraindication.severity || 'medium';
        const isAbsolute = matchingContraindication.type === 'absolute';
        
        contraindications.push({
          type: isAbsolute ? 'absolute' : 'relative',
          category: 'comorbidity',
          description: `${comorbidity.condition}: ${matchingContraindication.reason}`,
          severity: severity as 'high' | 'medium' | 'low',
          override_possible: !isAbsolute
        });
        
        if (isAbsolute) {
          score -= 0.5;
        } else {
          // Fix type comparison by using severity instead of type
          const severityLevel = matchingContraindication.severity;
          score -= severityLevel === 'absolute' ? 0.3 : severityLevel === 'relative' ? 0.2 : 0.1;
        }
      }
    }
    
    return {
      score: Math.max(0, score),
      contraindications
    };
  }

  private scoreAge(protocol: TreatmentProtocol, patient: PatientProfile): number {
    const age = patient.demographics.age;
    const minAge = protocol.eligibility_criteria.min_age;
    const maxAge = protocol.eligibility_criteria.max_age;
    
    if (typeof age !== 'number') {
      return 0.5; // Neutral if age unknown
    }
    
    if (minAge && age < minAge) {
      return 0.2; // Below minimum age
    }
    
    if (maxAge && age > maxAge) {
      return 0.3; // Above maximum age
    }
    
    return 1.0; // Within age range
  }

  private determineEligibilityStatus(
    matchScore: number,
    contraindications: Contraindication[],
    protocol: TreatmentProtocol
  ): EligibilityStatus {
    const hasAbsoluteContraindication = contraindications.some(c => c.type === 'absolute');
    
    if (hasAbsoluteContraindication) {
      return 'contraindicated';
    }
    
    if (matchScore >= SCORING_THRESHOLDS.good) {
      return 'eligible';
    } else if (matchScore >= SCORING_THRESHOLDS.acceptable) {
      return 'partially_eligible';
    } else {
      return 'ineligible';
    }
  }

  private generateRecommendations(
    protocol: TreatmentProtocol,
    patient: PatientProfile,
    matchReasons: MatchReason[],
    contraindications: Contraindication[]
  ): string[] {
    const recommendations: string[] = [];
    
    // Add evidence-based recommendations
    if (protocol.evidence_level === 'A') {
      recommendations.push('High-quality evidence supports this treatment approach');
    }
    
    // Performance status recommendations
    const ecogScore = patient.performance_metrics.ecog_score;
    if (typeof ecogScore === 'number' && ecogScore >= 2) {
      recommendations.push('Consider supportive care measures to improve performance status');
    }
    
    // Biomarker recommendations
    const biomarkerReason = matchReasons.find(r => r.criteria === 'biomarkers');
    if (biomarkerReason && biomarkerReason.score < 0.7) {
      recommendations.push('Consider additional biomarker testing to optimize treatment selection');
    }
    
    // Contraindication management
    const relativeContraindications = contraindications.filter(c => c.type === 'relative');
    if (relativeContraindications.length > 0) {
      recommendations.push('Monitor closely for treatment-related toxicities due to relative contraindications');
    }
    
    return recommendations;
  }

  private determineConfidence(
    matchScore: number,
    contraindications: Contraindication[]
  ): 'high' | 'medium' | 'low' {
    if (contraindications.some(c => c.type === 'absolute')) {
      return 'low';
    }
    
    if (matchScore >= SCORING_THRESHOLDS.excellent) {
      return 'high';
    } else if (matchScore >= SCORING_THRESHOLDS.good) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  /**
   * Generate treatment recommendation record for database
   */
  async generateTreatmentRecommendation(
    patientId: string,
    criteria: MatchingCriteria
  ): Promise<TreatmentRecommendation[]> {
    const matchingResults = await this.findMatchingProtocols(criteria);
    
    return matchingResults.map(result => ({
      id: '', // Will be generated by database
      patient_id: patientId,
      protocol_id: result.protocol.id,
      match_score: result.matchScore,
      eligibility_status: {
        eligible: result.eligibilityStatus === 'eligible',
        violations: [],
        warnings: [],
        required_assessments: []
      },
      contraindications: result.contraindications.map(c => c.description),
      required_modifications: [], // Will be populated based on contraindications
      alternative_options: [], // Will be populated from alternative matching results
      rationale: `Match score: ${result.matchScore.toFixed(2)} based on ${result.matchReasons.length} criteria`,
      confidence_level: result.confidence,
      clinical_trial_options: [], // Will be populated from clinical trials database
      generated_at: new Date(),
      generated_by: 'system'
    }));
  }

  /**
   * Clear protocol cache (useful for testing or when protocols are updated)
   */
  clearCache(): void {
    this.protocolCache.clear();
    this.lastCacheUpdate = 0;
  }
}

// Export singleton instance
export const treatmentMatcher = TreatmentMatchingEngine.getInstance();
export default TreatmentMatchingEngine;
