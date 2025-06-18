/**
 * Advanced Treatment Matching Engine
 * Intelligent protocol matching based on clinical criteria
 */

import {
  PatientProfile,
  TreatmentProtocol,
  ProtocolMatch,
  EligibilityAssessment,
  SafetyConcern,
  TreatmentRecommendation,
  TreatmentHistory,
  BiomarkerCriteria,
  OrganFunction
} from '@/types/medical';

/**
 * Configuration for treatment matching algorithms
 */
export interface MatchingConfig {
  weights: {
    performance_status: number;
    biomarkers: number;
    stage_match: number;
    organ_function: number;
    treatment_history: number;
    contraindications: number;
  };
  thresholds: {
    minimum_match_score: number;
    safety_exclusion_threshold: number;
    organ_function_minimum: number;
  };
  preferences: {
    evidence_level_boost: Record<string, number>;
    guideline_preference: string[];
    include_experimental: boolean;
  };
}

/**
 * Default matching configuration based on clinical best practices
 */
export const DEFAULT_MATCHING_CONFIG: MatchingConfig = {
  weights: {
    performance_status: 0.25,
    biomarkers: 0.30,
    stage_match: 0.20,
    organ_function: 0.15,
    treatment_history: 0.08,
    contraindications: 0.02
  },
  thresholds: {
    minimum_match_score: 0.3,
    safety_exclusion_threshold: 0.2,
    organ_function_minimum: 0.5
  },
  preferences: {
    evidence_level_boost: {
      'A': 0.15,
      'B': 0.10,
      'C': 0.05,
      'D': 0.0
    },
    guideline_preference: ['NCCN', 'ESMO', 'FDA', 'Health Canada'],
    include_experimental: false
  }
};

/**
 * Advanced treatment matching engine with sophisticated clinical algorithms
 */
export class TreatmentMatcher {
  private config: MatchingConfig;

  constructor(config: MatchingConfig = DEFAULT_MATCHING_CONFIG) {
    this.config = config;
  }

  /**
   * Calculate comprehensive match score between patient and protocol
   */
  static calculateMatchScore(
    patient: PatientProfile,
    protocol: TreatmentProtocol,
    config: MatchingConfig = DEFAULT_MATCHING_CONFIG
  ): number {
    let score = 0;
    const weights = config.weights;

    // Performance status matching
    const performanceScore = this.scorePerformanceStatus(patient, protocol);
    score += performanceScore * weights.performance_status;

    // Biomarker compatibility
    const biomarkerScore = this.scoreBiomarkers(patient, protocol);
    score += biomarkerScore * weights.biomarkers;

    // Stage appropriateness
    const stageScore = this.scoreStageMatch(patient, protocol);
    score += stageScore * weights.stage_match;

    // Organ function adequacy
    const organScore = this.scoreOrganFunction(patient, protocol);
    score += organScore * weights.organ_function;

    // Treatment history compatibility
    const historyScore = this.scoreTreatmentHistory(patient, protocol);
    score += historyScore * weights.treatment_history;

    // Contraindication check (negative scoring)
    const contraindicationPenalty = this.scoreContraindications(patient, protocol);
    score -= contraindicationPenalty * weights.contraindications;

    // Evidence level boost
    const evidenceBoost = config.preferences.evidence_level_boost[protocol.evidence_level] || 0;
    score += evidenceBoost;

    // Ensure score doesn't exceed 1.0
    return Math.min(Math.max(score, 0), 1.0);
  }

  /**
   * Comprehensive eligibility assessment
   */
  static assessEligibility(
    patient: PatientProfile,
    protocol: TreatmentProtocol
  ): EligibilityAssessment {
    const violations: string[] = [];
    const modificationsNeeded: string[] = [];
    const riskFactors: string[] = [];
    const alternativeApproaches: string[] = [];

    const criteria = protocol.eligibility_criteria;

    // Performance status check
    const performanceCheck = this.checkPerformanceRequirements(patient, criteria);
    if (!performanceCheck.passes) {
      violations.push('Performance status below protocol requirements');
      if (performanceCheck.modification) {
        modificationsNeeded.push(performanceCheck.modification);
      }
    }

    // Organ function check
    const organCheck = this.checkOrganFunction(patient, criteria);
    if (!organCheck.passes) {
      violations.push('Inadequate organ function for protocol');
      if (organCheck.modifications) {
        modificationsNeeded.push(...organCheck.modifications);
      }
    }

    // Biomarker requirements
    const biomarkerCheck = this.checkBiomarkerCriteria(patient, criteria);
    if (!biomarkerCheck.passes) {
      violations.push('Biomarker requirements not met');
      if (biomarkerCheck.alternatives) {
        alternativeApproaches.push(...biomarkerCheck.alternatives);
      }
    }

    // Age restrictions
    if (criteria.age_range) {
      const [minAge, maxAge] = criteria.age_range;
      const patientAge = patient.demographics.age;
      if (patientAge < minAge || patientAge > maxAge) {
        violations.push(`Age outside protocol range (${minAge}-${maxAge})`);
      }
    }

    // Comorbidity assessment
    const comorbidityRisks = this.assessComorbidityRisks(patient, protocol);
    riskFactors.push(...comorbidityRisks);

    // Current medication interactions
    const drugInteractions = this.checkDrugInteractions(patient, protocol);
    if (drugInteractions.length > 0) {
      riskFactors.push(`Potential drug interactions: ${drugInteractions.join(', ')}`);
      modificationsNeeded.push('Review current medications for interactions');
    }

    return {
      eligible: violations.length === 0,
      violations,
      modifications_needed: modificationsNeeded,
      risk_factors: riskFactors,
      alternative_approaches: alternativeApproaches
    };
  }

  /**
   * Score performance status compatibility
   */
  private static scorePerformanceStatus(
    patient: PatientProfile,
    protocol: TreatmentProtocol
  ): number {
    const patientEcog = patient.performance_metrics.ecog_score;
    const requiredEcog = protocol.eligibility_criteria.performance_status.ecog;
    const patientKarnofsky = patient.performance_metrics.karnofsky_score;
    const requiredKarnofsky = protocol.eligibility_criteria.performance_status.karnofsky;

    // ECOG scoring (primary)
    let ecogScore = 0;
    if (requiredEcog.includes(patientEcog)) {
      ecogScore = 1.0;
    } else if (patientEcog <= Math.max(...requiredEcog) + 1) {
      ecogScore = 0.7; // One grade worse than required
    } else if (patientEcog <= Math.max(...requiredEcog) + 2) {
      ecogScore = 0.4; // Two grades worse
    } else {
      ecogScore = 0.1; // Significantly worse
    }

    // Karnofsky scoring (secondary validation)
    let karnofskyScore = 1.0;
    if (patientKarnofsky && requiredKarnofsky.length > 0) {
      const minRequiredKarnofsky = Math.min(...requiredKarnofsky);
      if (patientKarnofsky >= minRequiredKarnofsky) {
        karnofskyScore = 1.0;
      } else if (patientKarnofsky >= minRequiredKarnofsky - 10) {
        karnofskyScore = 0.8;
      } else if (patientKarnofsky >= minRequiredKarnofsky - 20) {
        karnofskyScore = 0.5;
      } else {
        karnofskyScore = 0.2;
      }
    }

    // Weight ECOG more heavily (70%) than Karnofsky (30%)
    return ecogScore * 0.7 + karnofskyScore * 0.3;
  }

  /**
   * Score biomarker compatibility
   */
  private static scoreBiomarkers(
    patient: PatientProfile,
    protocol: TreatmentProtocol
  ): number {
    const requiredBiomarkers = protocol.eligibility_criteria.biomarkers;
    
    if (requiredBiomarkers.length === 0) {
      return 1.0; // No biomarker requirements
    }

    const patientMutations = patient.genetic_profile?.mutations || [];
    let matchedBiomarkers = 0;
    let requiredMatches = 0;

    for (const biomarkerCriteria of requiredBiomarkers) {
      if (biomarkerCriteria.is_required) {
        requiredMatches++;
      }

      // Find matching mutation in patient profile
      const patientMutation = patientMutations.find(
        m => m.gene.toLowerCase() === biomarkerCriteria.biomarker_id.toLowerCase()
      );

      if (patientMutation) {
        const isMatch = this.evaluateBiomarkerMatch(patientMutation, biomarkerCriteria);
        if (isMatch) {
          matchedBiomarkers++;
        }
      }
    }

    // If there are required biomarkers and none match, score is 0
    if (requiredMatches > 0 && matchedBiomarkers === 0) {
      return 0;
    }

    // Calculate score based on matched vs total biomarkers
    if (requiredBiomarkers.length > 0) {
      return matchedBiomarkers / requiredBiomarkers.length;
    }

    return 1.0;
  }

  /**
   * Evaluate if patient biomarker matches protocol criteria
   */
  private static evaluateBiomarkerMatch(
    patientMutation: any,
    criteria: BiomarkerCriteria
  ): boolean {
    switch (criteria.required_status) {
      case 'positive':
      case 'mutated':
        return patientMutation.variant_classification === 'pathogenic' || 
               patientMutation.variant_classification === 'likely_pathogenic';
      
      case 'negative':
      case 'wild_type':
        return patientMutation.variant_classification === 'benign' || 
               patientMutation.variant_classification === 'likely_benign';
      
      case 'amplified':
        return patientMutation.mutation_type === 'amplification';
      
      default:
        return false;
    }
  }

  /**
   * Score stage appropriateness
   */
  private static scoreStageMatch(
    patient: PatientProfile,
    protocol: TreatmentProtocol
  ): number {
    const patientStage = patient.disease_status.stage;
    const requiredStages = protocol.eligibility_criteria.stage_requirements;

    if (requiredStages.includes('Any') || requiredStages.includes('All')) {
      return 1.0;
    }

    // Exact stage match
    if (requiredStages.includes(patientStage)) {
      return 1.0;
    }

    // Partial stage match based on disease extent
    const diseaseExtent = patient.disease_status.disease_extent;
    const hasMetastatic = requiredStages.some(stage => 
      stage.toLowerCase().includes('metastatic') || 
      stage.toLowerCase().includes('stage iv') ||
      stage.toLowerCase().includes('advanced')
    );

    if (diseaseExtent === 'distant' && hasMetastatic) {
      return 0.9;
    }

    // Check for early stage protocols
    const hasEarlyStage = requiredStages.some(stage => 
      stage.toLowerCase().includes('stage i') ||
      stage.toLowerCase().includes('stage ii') ||
      stage.toLowerCase().includes('early')
    );

    if (diseaseExtent === 'localized' && hasEarlyStage) {
      return 0.8;
    }

    // Broad category match
    return 0.5;
  }

  /**
   * Score organ function adequacy
   */
  private static scoreOrganFunction(
    patient: PatientProfile,
    protocol: TreatmentProtocol
  ): number {
    const organFunction = protocol.eligibility_criteria.organ_function;
    const patientLabs = patient.laboratory_values;

    if (!patientLabs || !organFunction) {
      return 0.8; // Assume adequate if no specific requirements
    }

    let functionScores: number[] = [];

    // Hepatic function
    if (organFunction.hepatic) {
      const hepaticScore = this.scoreHepaticFunction(patientLabs, organFunction.hepatic);
      functionScores.push(hepaticScore);
    }

    // Renal function
    if (organFunction.renal) {
      const renalScore = this.scoreRenalFunction(patientLabs, organFunction.renal);
      functionScores.push(renalScore);
    }

    // Cardiac function
    if (organFunction.cardiac) {
      // This would require cardiac assessment data
      functionScores.push(0.8); // Placeholder
    }

    // Hematologic function
    if (organFunction.hematologic) {
      const hematologicScore = this.scoreHematologicFunction(patientLabs, organFunction.hematologic);
      functionScores.push(hematologicScore);
    }

    // Return minimum score (weakest link)
    return functionScores.length > 0 ? Math.min(...functionScores) : 1.0;
  }

  /**
   * Score hepatic function
   */
  private static scoreHepaticFunction(patientLabs: any, hepaticCriteria: any): number {
    const liver = patientLabs.liver_function;
    if (!liver) return 0.5;

    let score = 1.0;

    if (hepaticCriteria.alt_max && liver.alt > hepaticCriteria.alt_max) {
      score *= 0.7;
    }

    if (hepaticCriteria.ast_max && liver.ast > hepaticCriteria.ast_max) {
      score *= 0.7;
    }

    if (hepaticCriteria.bilirubin_max && liver.total_bilirubin > hepaticCriteria.bilirubin_max) {
      score *= 0.5;
    }

    if (hepaticCriteria.albumin_min && patientLabs.chemistry.albumin < hepaticCriteria.albumin_min) {
      score *= 0.6;
    }

    return score;
  }

  /**
   * Score renal function
   */
  private static scoreRenalFunction(patientLabs: any, renalCriteria: any): number {
    const renal = patientLabs.renal_function;
    if (!renal) return 0.5;

    let score = 1.0;

    if (renalCriteria.creatinine_max && renal.creatinine > renalCriteria.creatinine_max) {
      score *= 0.6;
    }

    if (renalCriteria.gfr_min && renal.gfr < renalCriteria.gfr_min) {
      score *= 0.5;
    }

    if (renalCriteria.clearance_min && renal.creatinine_clearance < renalCriteria.clearance_min) {
      score *= 0.7;
    }

    return score;
  }

  /**
   * Score hematologic function
   */
  private static scoreHematologicFunction(patientLabs: any, hematoCriteria: any): number {
    const hemato = patientLabs.hematology;
    if (!hemato) return 0.5;

    let score = 1.0;

    if (hematoCriteria.hemoglobin_min && hemato.hemoglobin < hematoCriteria.hemoglobin_min) {
      score *= 0.7;
    }

    if (hematoCriteria.platelets_min && hemato.platelets < hematoCriteria.platelets_min) {
      score *= 0.6;
    }

    if (hematoCriteria.neutrophils_min && hemato.neutrophils < hematoCriteria.neutrophils_min) {
      score *= 0.5;
    }

    return score;
  }

  /**
   * Score treatment history compatibility
   */
  private static scoreTreatmentHistory(
    patient: PatientProfile,
    protocol: TreatmentProtocol
  ): number {
    const treatmentHistory = patient.treatment_history || [];
    
    if (treatmentHistory.length === 0) {
      return 1.0; // No prior treatments, no concerns
    }

    let historyScore = 1.0;

    for (const priorTreatment of treatmentHistory) {
      // Check for same protocol (avoid repeating)
      if (priorTreatment.protocol_id === protocol.id) {
        // Consider response to prior treatment
        if (priorTreatment.response === 'progressive_disease') {
          historyScore *= 0.2; // Very poor outcome with same protocol
        } else if (priorTreatment.response === 'stable_disease') {
          historyScore *= 0.6; // Modest response
        }
      }

      // Check for cross-resistance patterns
      const crossResistance = this.checkCrossResistance(priorTreatment, protocol);
      if (crossResistance) {
        historyScore *= 0.7;
      }

      // Check for overlapping toxicities
      const toxicityOverlap = this.checkToxicityOverlap(priorTreatment, protocol);
      if (toxicityOverlap) {
        historyScore *= 0.8;
      }
    }

    return Math.max(historyScore, 0.1); // Minimum score of 0.1
  }

  /**
   * Check for cross-resistance between treatments
   */
  private static checkCrossResistance(priorTreatment: TreatmentHistory, protocol: TreatmentProtocol): boolean {
    // Simplified cross-resistance logic
    // In production, this would be much more sophisticated
    
    // If prior treatment failed (PD) and was same drug class, high risk of cross-resistance
    if (priorTreatment.response === 'progressive_disease') {
      // This would require drug classification data
      return false; // Placeholder
    }
    
    return false;
  }

  /**
   * Check for overlapping toxicities
   */
  private static checkToxicityOverlap(priorTreatment: TreatmentHistory, protocol: TreatmentProtocol): boolean {
    // Check if patient had Grade 3+ toxicities that could be cumulative
    const priorToxicities = priorTreatment.toxicities || [];
    const grade3Plus = priorToxicities.filter(t => t.grade >= 3);
    
    // This would require matching against protocol's expected toxicities
    return grade3Plus.length > 0;
  }

  /**
   * Score contraindications (returns penalty score)
   */
  private static scoreContraindications(
    patient: PatientProfile,
    protocol: TreatmentProtocol
  ): number {
    const contraindications = protocol.contraindications || [];
    let penalty = 0;

    for (const contraindication of contraindications) {
      if (this.hasContraindication(patient, contraindication)) {
        penalty += 0.3; // Heavy penalty for each contraindication
      }
    }

    return Math.min(penalty, 1.0); // Cap at 1.0
  }

  /**
   * Check if patient has specific contraindication
   */
  private static hasContraindication(patient: PatientProfile, contraindication: string): boolean {
    const lowerContra = contraindication.toLowerCase();
    
    // Check comorbidities
    const comorbidities = patient.comorbidities || [];
    for (const comorbidity of comorbidities) {
      if (comorbidity.condition.toLowerCase().includes(lowerContra) ||
          lowerContra.includes(comorbidity.condition.toLowerCase())) {
        return true;
      }
    }

    // Check allergies
    const allergies = patient.allergies || [];
    for (const allergy of allergies) {
      if (allergy.allergen.toLowerCase().includes(lowerContra) ||
          lowerContra.includes(allergy.allergen.toLowerCase())) {
        return true;
      }
    }

    return false;
  }

  // Helper methods for eligibility checks

  private static checkPerformanceRequirements(patient: PatientProfile, criteria: any): { passes: boolean; modification?: string } {
    const ecogScore = patient.performance_metrics.ecog_score;
    const requiredEcog = criteria.performance_status?.ecog || [];

    if (requiredEcog.length === 0) {
      return { passes: true };
    }

    if (requiredEcog.includes(ecogScore)) {
      return { passes: true };
    }

    if (ecogScore <= Math.max(...requiredEcog) + 1) {
      return { 
        passes: false, 
        modification: 'Consider dose reduction due to performance status' 
      };
    }

    return { passes: false };
  }

  private static checkOrganFunction(patient: PatientProfile, criteria: any): { passes: boolean; modifications?: string[] } {
    const organFunction = criteria.organ_function;
    if (!organFunction) return { passes: true };

    const modifications: string[] = [];
    let passes = true;

    // This would be expanded with actual lab value checking
    // For now, simplified logic
    if (organFunction.hepatic || organFunction.renal) {
      const organScore = this.scoreOrganFunction(patient, { eligibility_criteria: criteria } as TreatmentProtocol);
      if (organScore < 0.5) {
        passes = false;
        modifications.push('Consider dose modification for organ function');
      }
    }

    return { passes, modifications: modifications.length > 0 ? modifications : undefined };
  }

  private static checkBiomarkerCriteria(patient: PatientProfile, criteria: any): { passes: boolean; alternatives?: string[] } {
    const biomarkerScore = this.scoreBiomarkers(patient, { eligibility_criteria: criteria } as TreatmentProtocol);
    
    if (biomarkerScore >= 0.8) {
      return { passes: true };
    } else if (biomarkerScore >= 0.3) {
      return { 
        passes: false, 
        alternatives: ['Consider biomarker retesting', 'Evaluate alternative protocols'] 
      };
    } else {
      return { passes: false };
    }
  }

  private static assessComorbidityRisks(patient: PatientProfile, protocol: TreatmentProtocol): string[] {
    const risks: string[] = [];
    const comorbidities = patient.comorbidities || [];

    for (const comorbidity of comorbidities) {
      if (comorbidity.impact_on_treatment === 'significant') {
        risks.push(`Significant comorbidity: ${comorbidity.condition}`);
      } else if (comorbidity.impact_on_treatment === 'moderate') {
        risks.push(`Moderate comorbidity risk: ${comorbidity.condition}`);
      }
    }

    return risks;
  }

  private static checkDrugInteractions(patient: PatientProfile, protocol: TreatmentProtocol): string[] {
    const interactions: string[] = [];
    const currentMeds = patient.current_medications || [];
    const protocolDrugs = protocol.drugs || [];

    // Simplified interaction checking
    for (const med of currentMeds) {
      const medInteractions = med.interactions || [];
      for (const interaction of medInteractions) {
        if (interaction.interaction_type === 'major') {
          interactions.push(`${med.name} - ${interaction.interacting_drug}`);
        }
      }
    }

    return interactions;
  }
}

export default TreatmentMatcher;
