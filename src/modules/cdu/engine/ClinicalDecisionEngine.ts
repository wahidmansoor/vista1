/**
 * Enhanced Clinical Decision Engine
 * Provides intelligent treatment recommendations with improved performance and memoization
 */

import {
  ClinicalDecisionInput,
  ClinicalDecisionOutput,
  TreatmentProtocol,
  TreatmentRecommendation,
  RiskAssessment,
  RiskLevel,
  TreatmentLine,
  CancerType,
  PerformanceScale,
  PerformanceStatus,
  EvidenceLevel,
  MonitoringPlan,
  SupportiveCareRecommendation,
  FollowUpPlan,
  EmergencyGuideline,
  SpecificRisk,
  RiskFactor,
  ProtocolModification,
  TreatmentLineData,
  DiseaseStatus
} from './models';

import { ProtocolDatabase } from './protocols';

export class ClinicalDecisionEngine {
  private protocols: TreatmentProtocol[];
  private riskFactors: Map<string, number>;
  private memoCache = new Map<string, ClinicalDecisionOutput>();
  private cacheExpiry = new Map<string, number>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.protocols = ProtocolDatabase;
    this.riskFactors = new Map();
    this.initializeRiskFactors();
  }
  /**
   * Generate cache key for memoization
   */
  private getCacheKey(input: ClinicalDecisionInput): string {
    return JSON.stringify({
      disease: {
        primaryDiagnosis: input.diseaseStatus.primaryDiagnosis,
        stageAtDiagnosis: input.diseaseStatus.stageAtDiagnosis,
        histologyMutation: input.diseaseStatus.histologyMutation
      },
      performance: input.performanceStatus,
      progression: input.progression,
      treatmentLines: input.treatmentHistory?.length || 0
    });
  }

  /**
   * Check if cached result is valid
   */
  private isCacheValid(key: string): boolean {
    const expiry = this.cacheExpiry.get(key);
    return expiry ? Date.now() < expiry : false;
  }

  /**
   * Clear expired cache entries
   */
  private clearExpiredCache(): void {
    const now = Date.now();
    for (const [key, expiry] of this.cacheExpiry.entries()) {
      if (now >= expiry) {
        this.memoCache.delete(key);
        this.cacheExpiry.delete(key);
      }
    }
  }
  /**
   * Main method to generate treatment recommendations
   */
  public async generateTreatmentRecommendation(input: ClinicalDecisionInput): Promise<ClinicalDecisionOutput> {
    try {
      // Check cache first
      const cacheKey = this.getCacheKey(input);
      if (this.isCacheValid(cacheKey)) {
        const cachedResult = this.memoCache.get(cacheKey);
        if (cachedResult) {
          return cachedResult;
        }
      }

      // Clear expired cache entries periodically
      this.clearExpiredCache();

      // Validate input
      this.validateInput(input);

      // Calculate risk profile
      const riskAssessment = this.calculateRiskProfile(input);

      // Filter eligible protocols
      const eligibleProtocols = this.filterEligibleProtocols(input);

      // Rank protocols by evidence and suitability
      const rankedProtocols = this.rankProtocolsByEvidence(eligibleProtocols, input);

      // Apply safety filters
      const safeProtocols = this.applySafetyFilters(rankedProtocols, input);

      // Apply precision medicine logic
      const precisionProtocols = this.applyPrecisionMedicineLogic(safeProtocols, input);

      // Optimize for performance status
      const optimizedProtocols = this.optimizeForPerformanceStatus(precisionProtocols, input);      // Generate final recommendation
      const finalRecommendation = this.generateFinalRecommendation(optimizedProtocols, input, riskAssessment);

      // Cache the result
      this.memoCache.set(cacheKey, finalRecommendation);
      this.cacheExpiry.set(cacheKey, Date.now() + this.CACHE_TTL);

      return finalRecommendation;} catch (error) {
      console.error('Error generating treatment recommendation:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to generate treatment recommendation: ${errorMessage}`);
    }
  }

  /**
   * Calculate comprehensive risk profile
   */
  public calculateRiskProfile(input: ClinicalDecisionInput): RiskAssessment {
    const riskFactors: RiskFactor[] = [];
    const specificRisks: SpecificRisk[] = [];

    // Assess disease-related risks
    this.assessDiseaseRisks(input, riskFactors, specificRisks);

    // Assess performance status risks
    this.assessPerformanceRisks(input, riskFactors, specificRisks);

    // Assess treatment history risks
    this.assessTreatmentHistoryRisks(input, riskFactors, specificRisks);

    // Assess comorbidity risks
    this.assessComorbidityRisks(input, riskFactors, specificRisks);

    // Calculate overall risk
    const overallRisk = this.calculateOverallRisk(riskFactors);

    // Generate mitigation strategies
    const mitigationStrategies = this.generateMitigationStrategies(riskFactors, specificRisks);

    return {
      overallRisk,
      specificRisks,
      mitigationStrategies,
      riskFactors
    };
  }

  /**
   * Filter protocols based on eligibility criteria
   */
  public filterEligibleProtocols(input: ClinicalDecisionInput): TreatmentProtocol[] {
    return this.protocols.filter(protocol => {
      // Check cancer type match
      if (!this.matchesCancerType(protocol, input.diseaseStatus.primaryDiagnosis)) {
        return false;
      }

      // Check stage compatibility
      if (!this.matchesStage(protocol, input.diseaseStatus.stageAtDiagnosis)) {
        return false;
      }

      // Check treatment line appropriateness
      if (!this.matchesTreatmentLine(protocol, input.treatmentHistory)) {
        return false;
      }

      // Check performance status requirements
      if (!this.meetsPerformanceRequirements(protocol, input.performanceStatus)) {
        return false;
      }

      // Check biomarker requirements
      if (!this.meetsBiomarkerRequirements(protocol, input.diseaseStatus)) {
        return false;
      }

      return true;
    });
  }

  /**
   * Rank protocols by evidence level and clinical suitability
   */
  public rankProtocolsByEvidence(protocols: TreatmentProtocol[], input: ClinicalDecisionInput): TreatmentProtocol[] {
    return protocols.sort((a, b) => {
      // Primary sort by evidence level
      const evidenceScore = this.getEvidenceScore(a.evidenceLevel) - this.getEvidenceScore(b.evidenceLevel);
      if (evidenceScore !== 0) return evidenceScore;

      // Secondary sort by clinical suitability
      const suitabilityScoreA = this.calculateClinicalSuitability(a, input);
      const suitabilityScoreB = this.calculateClinicalSuitability(b, input);
      return suitabilityScoreB - suitabilityScoreA;
    });
  }

  /**
   * Apply safety filters based on patient condition
   */
  public applySafetyFilters(protocols: TreatmentProtocol[], input: ClinicalDecisionInput): TreatmentProtocol[] {
    return protocols.filter(protocol => {
      // Check absolute contraindications
      if (this.hasAbsoluteContraindications(protocol, input)) {
        return false;
      }

      // Check organ function requirements
      if (!this.meetsOrganFunctionRequirements(protocol, input)) {
        return false;
      }

      // Check drug interactions
      if (this.hasCriticalDrugInteractions(protocol, input)) {
        return false;
      }

      return true;
    });
  }

  /**
   * Apply precision medicine logic based on biomarkers and mutations
   */
  public applyPrecisionMedicineLogic(protocols: TreatmentProtocol[], input: ClinicalDecisionInput): TreatmentProtocol[] {
    return protocols.map(protocol => {
      // Check for targeted therapy opportunities
      if (this.hasTargetedTherapyOpportunity(protocol, input)) {
        // Boost protocol ranking for targeted therapies
        protocol.evidenceLevel = EvidenceLevel.LEVEL_1A;
      }

      // Check for immunotherapy biomarkers
      if (this.hasImmunotherapyBiomarkers(protocol, input)) {
        // Boost protocol ranking for immunotherapy
        protocol.evidenceLevel = EvidenceLevel.LEVEL_1B;
      }

      return protocol;
    });
  }

  /**
   * Optimize protocol selection based on performance status
   */
  public optimizeForPerformanceStatus(protocols: TreatmentProtocol[], input: ClinicalDecisionInput): TreatmentProtocol[] {
    const performanceScore = parseInt(input.performanceStatus.performanceScore) || 0;

    return protocols.filter(protocol => {
      // Aggressive protocols only for good performance status
      if (this.isAggressiveProtocol(protocol) && performanceScore > 1) {
        return false;
      }

      // Conservative protocols for poor performance status
      if (performanceScore >= 3 && !this.isConservativeProtocol(protocol)) {
        return false;
      }

      return true;
    });
  }

  /**
   * Generate final structured recommendation
   */
  public generateFinalRecommendation(
    protocols: TreatmentProtocol[],
    input: ClinicalDecisionInput,
    riskAssessment: RiskAssessment
  ): ClinicalDecisionOutput {
    if (protocols.length === 0) {
      throw new Error('No suitable treatment protocols found for this patient');
    }

    // Primary recommendation
    const primaryProtocol = protocols[0];
    const primaryRecommendation: TreatmentRecommendation = {
      protocol: primaryProtocol,
      priority: 1,
      rationale: this.generateRationale(primaryProtocol, input, riskAssessment),
      modifications: this.suggestProtocolModifications(primaryProtocol, input, riskAssessment),
      expectedBenefit: this.calculateExpectedBenefit(primaryProtocol, input),
      riskBenefitRatio: this.calculateRiskBenefitRatio(primaryProtocol, input, riskAssessment),
      evidenceStrength: primaryProtocol.evidenceLevel
    };

    // Alternative recommendations
    const alternativeRecommendations: TreatmentRecommendation[] = protocols.slice(1, 4).map((protocol, index) => ({
      protocol,
      priority: index + 2,
      rationale: this.generateRationale(protocol, input, riskAssessment),
      modifications: this.suggestProtocolModifications(protocol, input, riskAssessment),
      expectedBenefit: this.calculateExpectedBenefit(protocol, input),
      riskBenefitRatio: this.calculateRiskBenefitRatio(protocol, input, riskAssessment),
      evidenceStrength: protocol.evidenceLevel
    }));

    // Generate supporting recommendations
    const monitoringPlan = this.generateMonitoringPlan(primaryProtocol, input, riskAssessment);
    const supportiveCare = this.generateSupportiveCareRecommendations(input, riskAssessment);
    const followUpPlan = this.generateFollowUpPlan(primaryProtocol, input);
    const emergencyGuidelines = this.generateEmergencyGuidelines(primaryProtocol, input);

    // Calculate confidence score
    const confidenceScore = this.calculateConfidenceScore(primaryProtocol, input, riskAssessment);

    // Generate rationale explanation
    const rationaleExplanation = this.generateRationaleExplanation(primaryRecommendation, riskAssessment, input);

    return {
      primaryRecommendation,
      alternativeRecommendations,
      riskAssessment,
      monitoringPlan,
      supportiveCare,
      followUpPlan,
      emergencyGuidelines,
      confidenceScore,
      rationaleExplanation
    };
  }

  // Private helper methods

  private initializeRiskFactors(): void {
    // Initialize risk factor weights
    this.riskFactors.set('age_over_70', 1.2);
    this.riskFactors.set('poor_performance_status', 1.5);
    this.riskFactors.set('advanced_stage', 1.3);
    this.riskFactors.set('multiple_comorbidities', 1.4);
    this.riskFactors.set('prior_treatment_failure', 1.2);
    this.riskFactors.set('organ_dysfunction', 1.6);
  }

  private validateInput(input: ClinicalDecisionInput): void {
    if (!input.diseaseStatus || !input.performanceStatus) {
      throw new Error('Disease status and performance status are required');
    }

    if (!input.diseaseStatus.primaryDiagnosis) {
      throw new Error('Primary diagnosis is required');
    }

    if (!input.diseaseStatus.stageAtDiagnosis) {
      throw new Error('Disease stage is required');
    }

    if (!input.performanceStatus.performanceScore) {
      throw new Error('Performance score is required');
    }
  }

  private assessDiseaseRisks(input: ClinicalDecisionInput, riskFactors: RiskFactor[], specificRisks: SpecificRisk[]): void {
    // Assess stage-related risks
    if (input.diseaseStatus.stageAtDiagnosis.includes('IV') || input.diseaseStatus.stageAtDiagnosis.includes('Advanced')) {
      riskFactors.push({
        factor: 'Advanced disease stage',
        impact: RiskLevel.HIGH,
        modifiable: false
      });

      specificRisks.push({
        category: 'progression',
        risk: RiskLevel.HIGH,
        probability: '60-80%',
        timeframe: '6-12 months',
        prevention: ['Regular monitoring', 'Aggressive treatment', 'Clinical trials']
      });
    }

    // Assess histology-related risks
    if (input.diseaseStatus.histologyMutation?.includes('aggressive')) {
      riskFactors.push({
        factor: 'Aggressive histology',
        impact: RiskLevel.HIGH,
        modifiable: false
      });
    }
  }

  private assessPerformanceRisks(input: ClinicalDecisionInput, riskFactors: RiskFactor[], specificRisks: SpecificRisk[]): void {
    const performanceScore = parseInt(input.performanceStatus.performanceScore) || 0;

    if (performanceScore >= 2) {
      riskFactors.push({
        factor: 'Poor performance status',
        impact: performanceScore >= 3 ? RiskLevel.VERY_HIGH : RiskLevel.HIGH,
        modifiable: true,
        interventions: ['Supportive care', 'Rehabilitation', 'Nutritional support']
      });

      specificRisks.push({
        category: 'toxicity',
        risk: RiskLevel.HIGH,
        probability: '40-60%',
        timeframe: 'During treatment',
        prevention: ['Dose modifications', 'Supportive medications', 'Close monitoring']
      });
    }
  }

  private assessTreatmentHistoryRisks(input: ClinicalDecisionInput, riskFactors: RiskFactor[], specificRisks: SpecificRisk[]): void {
    if (input.treatmentHistory && input.treatmentHistory.length >= 2) {
      riskFactors.push({
        factor: 'Multiple prior treatment lines',
        impact: RiskLevel.HIGH,
        modifiable: false
      });

      specificRisks.push({
        category: 'progression',
        risk: RiskLevel.HIGH,
        probability: '70-90%',
        timeframe: '3-6 months',
        prevention: ['Clinical trials', 'Novel agents', 'Palliative care consultation']
      });
    }
  }

  private assessComorbidityRisks(input: ClinicalDecisionInput, riskFactors: RiskFactor[], specificRisks: SpecificRisk[]): void {
    if (input.comorbidities && input.comorbidities.length > 0) {
      const severeComorbidities = input.comorbidities.filter(c => c.severity === 'severe');
      
      if (severeComorbidities.length > 0) {
        riskFactors.push({
          factor: 'Severe comorbidities',
          impact: RiskLevel.VERY_HIGH,
          modifiable: true,
          interventions: ['Specialist consultation', 'Comorbidity management', 'Dose adjustments']
        });
      }
    }
  }

  private calculateOverallRisk(riskFactors: RiskFactor[]): RiskLevel {
    const highRiskFactors = riskFactors.filter(rf => rf.impact === RiskLevel.HIGH || rf.impact === RiskLevel.VERY_HIGH);
    
    if (highRiskFactors.length >= 3) return RiskLevel.VERY_HIGH;
    if (highRiskFactors.length >= 2) return RiskLevel.HIGH;
    if (highRiskFactors.length >= 1) return RiskLevel.INTERMEDIATE;
    return RiskLevel.LOW;
  }

  private generateMitigationStrategies(riskFactors: RiskFactor[], specificRisks: SpecificRisk[]): string[] {
    const strategies: string[] = [];

    // Add strategies based on risk factors
    riskFactors.forEach(rf => {
      if (rf.interventions) {
        strategies.push(...rf.interventions);
      }
    });

    // Add strategies based on specific risks
    specificRisks.forEach(sr => {
      strategies.push(...sr.prevention);
    });

    // Remove duplicates and return
    return [...new Set(strategies)];
  }

  private matchesCancerType(protocol: TreatmentProtocol, diagnosis: string): boolean {
    // Simple matching logic - can be enhanced with fuzzy matching
    return protocol.cancerType.toString().toLowerCase().includes(diagnosis.toLowerCase()) ||
           diagnosis.toLowerCase().includes(protocol.cancerType.toString().toLowerCase());
  }

  private matchesStage(protocol: TreatmentProtocol, stage: string): boolean {
    return protocol.stage.includes(stage) || protocol.stage.includes('Any');
  }

  private matchesTreatmentLine(protocol: TreatmentProtocol, treatmentHistory: TreatmentLineData[]): boolean {
    const currentLine = this.getCurrentTreatmentLine(treatmentHistory);
    return protocol.line.includes(currentLine);
  }

  private getCurrentTreatmentLine(treatmentHistory: TreatmentLineData[]): TreatmentLine {
    if (!treatmentHistory || treatmentHistory.length === 0) {
      return TreatmentLine.FIRST_LINE;
    }
    
    const lastTreatment = treatmentHistory[treatmentHistory.length - 1];
    switch (lastTreatment.treatmentLine) {
      case TreatmentLine.FIRST_LINE: return TreatmentLine.SECOND_LINE;
      case TreatmentLine.SECOND_LINE: return TreatmentLine.THIRD_LINE;
      case TreatmentLine.THIRD_LINE: return TreatmentLine.FOURTH_LINE;
      default: return TreatmentLine.FOURTH_LINE;
    }
  }

  private meetsPerformanceRequirements(protocol: TreatmentProtocol, performanceStatus: PerformanceStatus): boolean {
    const score = parseInt(performanceStatus.performanceScore) || 4;
    
    if (performanceStatus.performanceScale === PerformanceScale.ECOG) {
      return protocol.eligibilityCriteria.performanceStatus.ecog?.includes(score) ?? true;
    }
    
    // For Karnofsky, convert ECOG to approximate Karnofsky
    const karnofskyScore = this.convertECOGToKarnofsky(score);
    return protocol.eligibilityCriteria.performanceStatus.karnofsky?.includes(karnofskyScore) ?? true;
  }
  private convertECOGToKarnofsky(ecogScore: number): number {
    const conversion: Record<number, number> = { 0: 100, 1: 80, 2: 60, 3: 40, 4: 20 };
    return conversion[ecogScore] || 20;
  }

  private meetsBiomarkerRequirements(protocol: TreatmentProtocol, diseaseStatus: DiseaseStatus): boolean {
    if (!protocol.eligibilityCriteria.biomarkers) return true;
    
    const requiredBiomarkers = protocol.eligibilityCriteria.biomarkers.filter(b => b.required);
    if (requiredBiomarkers.length === 0) return true;
    
    // Check if patient has required biomarkers
    return requiredBiomarkers.every(required => {
      return diseaseStatus.biomarkers?.some(patientBiomarker => 
        patientBiomarker.name === required.name
      ) ?? false;
    });
  }

  private getEvidenceScore(evidenceLevel: EvidenceLevel): number {
    const scores = {
      [EvidenceLevel.LEVEL_1A]: 1,
      [EvidenceLevel.LEVEL_1B]: 2,
      [EvidenceLevel.LEVEL_2A]: 3,
      [EvidenceLevel.LEVEL_2B]: 4,
      [EvidenceLevel.LEVEL_3]: 5,
      [EvidenceLevel.LEVEL_4]: 6,
      [EvidenceLevel.LEVEL_5]: 7
    };
    return scores[evidenceLevel] || 7;
  }

  private calculateClinicalSuitability(protocol: TreatmentProtocol, input: ClinicalDecisionInput): number {
    let score = 0;
    
    // Bonus for exact stage match
    if (protocol.stage.includes(input.diseaseStatus.stageAtDiagnosis)) score += 10;
    
    // Bonus for appropriate treatment line
    const currentLine = this.getCurrentTreatmentLine(input.treatmentHistory);
    if (protocol.line.includes(currentLine)) score += 8;
    
    // Bonus for biomarker compatibility
    if (this.hasBiomarkerCompatibility(protocol, input.diseaseStatus)) score += 5;
    
    return score;
  }
  private hasBiomarkerCompatibility(protocol: TreatmentProtocol, diseaseStatus: DiseaseStatus): boolean {
    // Simplified biomarker compatibility check
    return Boolean(diseaseStatus.biomarkers && diseaseStatus.biomarkers.length > 0);
  }

  private hasAbsoluteContraindications(protocol: TreatmentProtocol, input: ClinicalDecisionInput): boolean {
    // Check absolute contraindications
    return protocol.contraindicationsCriteria.absolute.some(contraindication => {
      return input.comorbidities?.some(comorbidity => 
        comorbidity.condition.toLowerCase().includes(contraindication.toLowerCase())
      ) ?? false;
    });
  }

  private meetsOrganFunctionRequirements(protocol: TreatmentProtocol, input: ClinicalDecisionInput): boolean {
    // Simplified organ function check - in real implementation, would check actual lab values
    return true;
  }

  private hasCriticalDrugInteractions(protocol: TreatmentProtocol, input: ClinicalDecisionInput): boolean {
    // Simplified drug interaction check
    return false;
  }
  private hasTargetedTherapyOpportunity(protocol: TreatmentProtocol, input: ClinicalDecisionInput): boolean {
    return protocol.treatmentType.toString().includes('targeted') && 
           Boolean(input.diseaseStatus.geneticMutations && 
           input.diseaseStatus.geneticMutations.length > 0);
  }

  private hasImmunotherapyBiomarkers(protocol: TreatmentProtocol, input: ClinicalDecisionInput): boolean {
    return protocol.treatmentType.toString().includes('immunotherapy') &&
           Boolean(input.diseaseStatus.biomarkers?.some(b => 
             b.name.toLowerCase().includes('pd-l1') || 
             b.name.toLowerCase().includes('msi')
           ));
  }

  private isAggressiveProtocol(protocol: TreatmentProtocol): boolean {
    return protocol.regimen.length > 2 || 
           protocol.regimen.some(drug => drug.route === 'IV');
  }

  private isConservativeProtocol(protocol: TreatmentProtocol): boolean {
    return protocol.regimen.length <= 2 && 
           protocol.regimen.every(drug => drug.route === 'PO');
  }

  // Additional helper methods for generating recommendations...
  private generateRationale(protocol: TreatmentProtocol, input: ClinicalDecisionInput, riskAssessment: RiskAssessment): string {
    return `This protocol is recommended based on ${protocol.evidenceLevel} evidence for ${input.diseaseStatus.primaryDiagnosis} stage ${input.diseaseStatus.stageAtDiagnosis}. The patient's performance status and risk profile support this approach.`;
  }

  private suggestProtocolModifications(protocol: TreatmentProtocol, input: ClinicalDecisionInput, riskAssessment: RiskAssessment): ProtocolModification[] {
    const modifications: ProtocolModification[] = [];
    
    if (riskAssessment.overallRisk === RiskLevel.HIGH) {
      modifications.push({
        type: 'dose_reduction',
        description: '20% dose reduction for initial cycle',
        reason: 'High risk patient profile',
        impact: 'Improved tolerability with minimal efficacy impact'
      });
    }
    
    return modifications;
  }

  private calculateExpectedBenefit(protocol: TreatmentProtocol, input: ClinicalDecisionInput): string {
    return protocol.expectedOutcomes.responseRate;
  }

  private calculateRiskBenefitRatio(protocol: TreatmentProtocol, input: ClinicalDecisionInput, riskAssessment: RiskAssessment): string {
    return riskAssessment.overallRisk === RiskLevel.LOW ? 'Favorable' : 'Acceptable';
  }

  private generateMonitoringPlan(protocol: TreatmentProtocol, input: ClinicalDecisionInput, riskAssessment: RiskAssessment): MonitoringPlan {
    return protocol.monitoring;
  }

  private generateSupportiveCareRecommendations(input: ClinicalDecisionInput, riskAssessment: RiskAssessment): SupportiveCareRecommendation[] {
    const recommendations: SupportiveCareRecommendation[] = [];
    
    recommendations.push({
      category: 'symptom_management',
      intervention: 'Antiemetic prophylaxis',
      priority: 'high',
      provider: 'Oncology nurse',
      timing: 'Pre-treatment'
    });
    
    return recommendations;
  }

  private generateFollowUpPlan(protocol: TreatmentProtocol, input: ClinicalDecisionInput): FollowUpPlan {
    return protocol.monitoring.postTreatment.length > 0 ? {
      schedule: [{
        timepoint: 'Week 3',
        assessments: ['Performance status', 'Toxicity assessment'],
        provider: 'Oncologist',
        duration: '30 minutes'
      }],
      imagingPlan: [],
      laboratoryPlan: [],
      emergencyInstructions: []
    } : {
      schedule: [],
      imagingPlan: [],
      laboratoryPlan: [],
      emergencyInstructions: []
    };
  }

  private generateEmergencyGuidelines(protocol: TreatmentProtocol, input: ClinicalDecisionInput): EmergencyGuideline[] {
    return protocol.monitoring.emergencyContacts.map(contact => ({
      scenario: 'Treatment-related emergency',
      signs: ['Severe nausea/vomiting', 'Fever >38.5°C', 'Severe fatigue'],
      immediateActions: ['Contact oncology team', 'Supportive care', 'Consider hospitalization'],
      contactInformation: [contact],
      timeframe: 'Immediate'
    }));
  }

  private calculateConfidenceScore(protocol: TreatmentProtocol, input: ClinicalDecisionInput, riskAssessment: RiskAssessment): number {
    let score = 70; // Base confidence
    
    // Adjust based on evidence level
    if (protocol.evidenceLevel === EvidenceLevel.LEVEL_1A) score += 20;
    else if (protocol.evidenceLevel === EvidenceLevel.LEVEL_1B) score += 15;
    
    // Adjust based on risk
    if (riskAssessment.overallRisk === RiskLevel.LOW) score += 10;
    else if (riskAssessment.overallRisk === RiskLevel.VERY_HIGH) score -= 15;
    
    return Math.min(95, Math.max(30, score));
  }

  private generateRationaleExplanation(recommendation: TreatmentRecommendation, riskAssessment: RiskAssessment, input: ClinicalDecisionInput): string {
    return `The recommended treatment protocol ${recommendation.protocol.name} is supported by ${recommendation.evidenceStrength} level evidence. 
    The patient's overall risk is assessed as ${riskAssessment.overallRisk}. 
    Key considerations include the disease stage (${input.diseaseStatus.stageAtDiagnosis}) and performance status (ECOG ${input.performanceStatus.performanceScore}).
    Expected benefit: ${recommendation.expectedBenefit}.
    Risk-benefit ratio: ${recommendation.riskBenefitRatio}.`;
  }
}
