// Enhanced Patient Evaluation Service
// filepath: d:\Mansoor\mwoncovista\vista1\src\modules\opd\services\enhancedEvaluationService.ts

import {
  CancerType,
  EnhancedPatientEvaluation,
  EvaluationTemplate,
  ValidationError,
  AIRecommendation,
  RiskFactor,
  RiskCategory,
  RedFlag
} from '../types/enhanced-evaluation';
import { supabase } from '../../../lib/supabaseClient';

interface RiskAssessmentResult {
  category: RiskCategory;
  score: number;
  factors: RiskFactor[];
}

class EnhancedEvaluationAPIError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'EnhancedEvaluationAPIError';
  }
}

// Risk calculation algorithms
export async function calculateRiskScore(
  cancerType: CancerType,
  formData: Record<string, any>,
  template: EvaluationTemplate
): Promise<RiskAssessmentResult> {
  try {
    const riskFactors: RiskFactor[] = [];
    let baseScore = 0;
    
    // Cancer-specific risk factors
    const cancerRiskFactors = getCancerSpecificRiskFactors(cancerType, formData);
    riskFactors.push(...cancerRiskFactors);
    
    // Performance status impact
    const performanceScore = calculatePerformanceImpact(formData);
    baseScore += performanceScore;
    
    // Age-related risk
    const ageRisk = calculateAgeRisk(formData.age);
    if (ageRisk.impact > 0) {
      riskFactors.push(ageRisk);
      baseScore += ageRisk.impact === 'high' ? 20 : ageRisk.impact === 'medium' ? 10 : 5;
    }
    
    // Comorbidity impact
    const comorbidityRisk = calculateComorbidityRisk(formData);
    riskFactors.push(...comorbidityRisk);
    baseScore += comorbidityRisk.length * 5;
    
    // Staging impact
    const stagingRisk = calculateStagingRisk(formData.tnmStage);
    if (stagingRisk) {
      riskFactors.push(stagingRisk);
      baseScore += stagingRisk.impact === 'high' ? 30 : stagingRisk.impact === 'medium' ? 15 : 5;
    }
    
    // Normalize score to 0-100 range
    const normalizedScore = Math.min(Math.max(baseScore, 0), 100);
    
    // Determine risk category
    const category = determineRiskCategory(normalizedScore);
    
    return {
      category,
      score: normalizedScore,
      factors: riskFactors
    };
  } catch (error) {
    console.error('Risk calculation error:', error);
    throw new EnhancedEvaluationAPIError('Failed to calculate risk score');
  }
}

function getCancerSpecificRiskFactors(cancerType: CancerType, formData: Record<string, any>): RiskFactor[] {
  const factors: RiskFactor[] = [];
  
  switch (cancerType) {
    case 'breast':
      // BRCA mutations
      if (formData.brca1 === 'pathogenic' || formData.brca2 === 'pathogenic') {
        factors.push({
          id: 'brca-mutation',
          factor: 'BRCA1/2 pathogenic mutation',
          category: 'genetic',
          impact: 'high',
          confidence: 95,
          evidence: 'Strong predictor of hereditary breast cancer risk'
        });
      }
      
      // Triple-negative status
      if (formData.er === 'negative' && formData.pr === 'negative' && formData.her2 === 'negative') {
        factors.push({
          id: 'triple-negative',
          factor: 'Triple-negative breast cancer',
          category: 'medical',
          impact: 'high',
          confidence: 90,
          evidence: 'Associated with more aggressive disease course'
        });
      }
      break;
      
    case 'lung':
      // Smoking history
      if (formData.smokingHistory === 'current' || formData.packYears > 20) {
        factors.push({
          id: 'smoking-history',
          factor: 'Significant smoking history',
          category: 'lifestyle',
          impact: 'high',
          confidence: 85,
          evidence: 'Major risk factor for lung cancer progression'
        });
      }
      
      // EGFR/ALK status
      if (formData.egfr === 'mutated' || formData.alk === 'rearranged') {
        factors.push({
          id: 'targetable-mutation',
          factor: 'Targetable genetic alteration',
          category: 'genetic',
          impact: 'medium',
          confidence: 80,
          evidence: 'May respond to targeted therapy'
        });
      }
      break;
      
    case 'colorectal':
      // MSI status
      if (formData.msiStatus === 'MSI-H') {
        factors.push({
          id: 'msi-high',
          factor: 'Microsatellite instability-high',
          category: 'genetic',
          impact: 'medium',
          confidence: 85,
          evidence: 'May respond well to immunotherapy'
        });
      }
      break;
  }
  
  return factors;
}

function calculatePerformanceImpact(formData: Record<string, any>): number {
  const ecog = formData.ecog || 0;
  const kps = formData.kps || 100;
  
  // ECOG impact
  if (ecog >= 3) return 25;
  if (ecog === 2) return 15;
  if (ecog === 1) return 5;
  
  // KPS impact
  if (kps < 70) return 20;
  if (kps < 80) return 10;
  if (kps < 90) return 5;
  
  return 0;
}

function calculateAgeRisk(age: number): RiskFactor | null {
  if (!age) return null;
  
  if (age >= 80) {
    return {
      id: 'advanced-age',
      factor: 'Advanced age (≥80 years)',
      category: 'medical',
      impact: 'high',
      confidence: 85,
      evidence: 'Increased treatment-related toxicity risk'
    };
  } else if (age >= 70) {
    return {
      id: 'elderly',
      factor: 'Elderly patient (70-79 years)',
      category: 'medical',
      impact: 'medium',
      confidence: 75,
      evidence: 'Moderate increase in treatment complexity'
    };
  } else if (age < 40) {
    return {
      id: 'young-age',
      factor: 'Young age (<40 years)',
      category: 'medical',
      impact: 'medium',
      confidence: 70,
      evidence: 'May indicate more aggressive disease'
    };
  }
  
  return null;
}

function calculateComorbidityRisk(formData: Record<string, any>): RiskFactor[] {
  const factors: RiskFactor[] = [];
  
  // Charlson Comorbidity Index
  const charlson = formData.charlsonScore || 0;
  if (charlson >= 3) {
    factors.push({
      id: 'high-comorbidity',
      factor: `High comorbidity burden (Charlson ${charlson})`,
      category: 'medical',
      impact: 'high',
      confidence: 90,
      evidence: 'Significantly impacts treatment tolerance'
    });
  }
  
  // Specific organ dysfunction
  if (formData.creatinine > 2.0 || formData.gfr < 60) {
    factors.push({
      id: 'renal-dysfunction',
      factor: 'Renal dysfunction',
      category: 'medical',
      impact: 'medium',
      confidence: 85,
      evidence: 'May require dose modifications'
    });
  }
  
  if (formData.ejectionFraction < 50) {
    factors.push({
      id: 'cardiac-dysfunction',
      factor: 'Cardiac dysfunction',
      category: 'medical',
      impact: 'high',
      confidence: 90,
      evidence: 'Contraindication to cardiotoxic agents'
    });
  }
  
  return factors;
}

function calculateStagingRisk(tnmStage: any): RiskFactor | null {
  if (!tnmStage || !tnmStage.stage) return null;
  
  const stage = tnmStage.stage.toLowerCase();
  
  if (stage.includes('iv') || stage.includes('4')) {
    return {
      id: 'advanced-stage',
      factor: 'Advanced stage disease (Stage IV)',
      category: 'medical',
      impact: 'high',
      confidence: 95,
      evidence: 'Metastatic disease with poor prognosis'
    };
  } else if (stage.includes('iii') || stage.includes('3')) {
    return {
      id: 'locally-advanced',
      factor: 'Locally advanced disease (Stage III)',
      category: 'medical',
      impact: 'medium',
      confidence: 85,
      evidence: 'Requires multimodal treatment approach'
    };
  }
  
  return null;
}

function determineRiskCategory(score: number): RiskCategory {
  if (score >= 80) return 'very_high';
  if (score >= 60) return 'high';
  if (score >= 40) return 'intermediate';
  if (score >= 20) return 'low';
  return 'minimal';
}

// AI Recommendations Generator
export async function generateAIRecommendations(
  cancerType: CancerType,
  formData: Record<string, any>,
  template: EvaluationTemplate
): Promise<AIRecommendation[]> {
  try {
    const recommendations: AIRecommendation[] = [];
    
    // Diagnostic recommendations
    const diagnosticRecs = generateDiagnosticRecommendations(cancerType, formData);
    recommendations.push(...diagnosticRecs);
    
    // Treatment recommendations
    const treatmentRecs = generateTreatmentRecommendations(cancerType, formData);
    recommendations.push(...treatmentRecs);
    
    // Monitoring recommendations
    const monitoringRecs = generateMonitoringRecommendations(cancerType, formData);
    recommendations.push(...monitoringRecs);
    
    return recommendations;
  } catch (error) {
    console.error('AI recommendations error:', error);
    throw new EnhancedEvaluationAPIError('Failed to generate AI recommendations');
  }
}

function generateDiagnosticRecommendations(cancerType: CancerType, formData: Record<string, any>): AIRecommendation[] {
  const recommendations: AIRecommendation[] = [];
  
  // Missing biomarker testing
  if (cancerType === 'breast' && !formData.her2Status) {
    recommendations.push({
      id: 'her2-testing',
      type: 'diagnostic',
      category: 'biomarker',
      recommendation: 'HER2 testing recommended',
      reasoning: 'HER2 status is essential for treatment planning in breast cancer',
      confidence: 95,
      evidenceLevel: '1A',
      sources: ['NCCN Guidelines', 'ASCO/CAP Guidelines'],
      alternatives: ['IHC with FISH confirmation', 'Next-generation sequencing']
    });
  }
  
  if (cancerType === 'lung' && !formData.pdl1Status) {
    recommendations.push({
      id: 'pdl1-testing',
      type: 'diagnostic',
      category: 'biomarker',
      recommendation: 'PD-L1 testing recommended',
      reasoning: 'PD-L1 expression guides immunotherapy selection',
      confidence: 90,
      evidenceLevel: '1A',
      sources: ['NCCN Guidelines', 'IASLC Guidelines']
    });
  }
  
  return recommendations;
}

function generateTreatmentRecommendations(cancerType: CancerType, formData: Record<string, any>): AIRecommendation[] {
  const recommendations: AIRecommendation[] = [];
  
  // Performance status-based recommendations
  const ecog = formData.ecog || 0;
  if (ecog >= 2) {
    recommendations.push({
      id: 'performance-status-concern',
      type: 'therapeutic',
      category: 'treatment_modification',
      recommendation: 'Consider dose reduction or best supportive care',
      reasoning: 'Poor performance status (ECOG ≥2) associated with increased toxicity risk',
      confidence: 85,
      evidenceLevel: '2A',
      sources: ['NCCN Guidelines'],
      contraindications: ['Full-dose chemotherapy without improvement in PS']
    });
  }
  
  return recommendations;
}

function generateMonitoringRecommendations(cancerType: CancerType, formData: Record<string, any>): AIRecommendation[] {
  const recommendations: AIRecommendation[] = [];
  
  // Cardiac monitoring for HER2+ breast cancer
  if (cancerType === 'breast' && formData.her2Status === 'positive') {
    recommendations.push({
      id: 'cardiac-monitoring',
      type: 'monitoring',
      category: 'toxicity_surveillance',
      recommendation: 'Baseline and serial cardiac function monitoring',
      reasoning: 'HER2-targeted therapy associated with cardiotoxicity risk',
      confidence: 95,
      evidenceLevel: '1A',
      sources: ['NCCN Guidelines', 'ACC/AHA Guidelines']
    });
  }
  
  return recommendations;
}

// Form validation
export function validateEvaluationForm(
  formData: Record<string, any>,
  template: EvaluationTemplate
): ValidationError[] {
  const errors: ValidationError[] = [];
  
  // Check required fields
  template.sections.forEach(section => {
    section.items.forEach(item => {
      if (item.required) {
        const value = formData[item.id];
        if (!value || value === '' || value === null || value === undefined) {
          errors.push({
            field: item.id,
            message: `${item.text} is required`,
            severity: 'error',
            suggestion: 'Please provide a value for this required field'
          });
        }
      }
      
      // Type-specific validation
      if (item.type === 'number' && formData[item.id]) {
        const numValue = Number(formData[item.id]);
        if (isNaN(numValue)) {
          errors.push({
            field: item.id,
            message: `${item.text} must be a valid number`,
            severity: 'error'
          });
        } else if (item.validation?.min !== undefined && numValue < item.validation.min) {
          errors.push({
            field: item.id,
            message: `${item.text} must be at least ${item.validation.min}`,
            severity: 'error'
          });
        } else if (item.validation?.max !== undefined && numValue > item.validation.max) {
          errors.push({
            field: item.id,
            message: `${item.text} must be no more than ${item.validation.max}`,
            severity: 'error'
          });
        }
      }
    });
  });
  
  // Cross-field validation
  validateCrossFieldRules(formData, template, errors);
  
  return errors;
}

function validateCrossFieldRules(
  formData: Record<string, any>,
  template: EvaluationTemplate,
  errors: ValidationError[]
): void {
  // TNM staging consistency
  if (formData.tStage && formData.nStage && formData.mStage) {
    const derivedStage = deriveTNMStage(formData.tStage, formData.nStage, formData.mStage);
    if (formData.overallStage && formData.overallStage !== derivedStage) {
      errors.push({
        field: 'overallStage',
        message: 'Overall stage inconsistent with TNM components',
        severity: 'warning',
        suggestion: `Consider ${derivedStage} based on T${formData.tStage}N${formData.nStage}M${formData.mStage}`
      });
    }
  }
  
  // Performance status consistency
  if (formData.ecog && formData.kps) {
    const expectedKPS = ecogToKPS(formData.ecog);
    const actualKPS = Number(formData.kps);
    if (Math.abs(actualKPS - expectedKPS) > 10) {
      errors.push({
        field: 'kps',
        message: 'KPS and ECOG scores appear inconsistent',
        severity: 'warning',
        suggestion: `ECOG ${formData.ecog} typically corresponds to KPS ~${expectedKPS}`
      });
    }
  }
}

function deriveTNMStage(t: string, n: string, m: string): string {
  // Simplified staging logic - would need cancer-specific rules
  if (m === '1') return 'IV';
  if (t === '4' || n === '3') return 'III';
  if (t === '2' || n === '1') return 'II';
  return 'I';
}

function ecogToKPS(ecog: number): number {
  const mapping: Record<number, number> = {
    0: 100,
    1: 80,
    2: 60,
    3: 40,
    4: 20
  };
  return mapping[ecog] || 100;
}

// Database operations
export async function saveEnhancedEvaluation(evaluation: Partial<EnhancedPatientEvaluation>): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('enhanced_patient_evaluations')
      .insert([{
        cancer_type: evaluation.cancerType,
        cancer_subtype: evaluation.cancerSubtype,
        primary_site: evaluation.primarySite,
        histology: evaluation.histology,
        tumor_grade: evaluation.tumorGrade,
        tnm_stage: evaluation.tnmStage,
        stage_clinical: evaluation.stageClinical,
        stage_pathological: evaluation.stagePathological,
        receptor_status: evaluation.receptorStatus,
        mutation_status: evaluation.mutationStatus,
        performance_status: evaluation.performanceStatus,
        risk_category: evaluation.riskCategory,
        risk_score: evaluation.riskScore,
        risk_factors: evaluation.riskFactors,
        recommended_plan: evaluation.recommendedPlan,
        red_flags: evaluation.redFlags,
        ai_recommendations: evaluation.aiRecommendations,
        form_data: evaluation.formData,
        status: evaluation.status,
        submitted_by: evaluation.submittedBy
      }])
      .select('id')
      .single();
    
    if (error) {
      throw new EnhancedEvaluationAPIError(error.message);
    }
    
    return data.id;
  } catch (error) {
    console.error('Save evaluation error:', error);
    throw error instanceof EnhancedEvaluationAPIError 
      ? error 
      : new EnhancedEvaluationAPIError('Failed to save evaluation');
  }
}

export async function loadEnhancedEvaluation(id: string): Promise<EnhancedPatientEvaluation> {
  try {
    const { data, error } = await supabase
      .from('enhanced_patient_evaluations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      throw new EnhancedEvaluationAPIError(error.message);
    }
    
    return data as EnhancedPatientEvaluation;
  } catch (error) {
    console.error('Load evaluation error:', error);
    throw error instanceof EnhancedEvaluationAPIError 
      ? error 
      : new EnhancedEvaluationAPIError('Failed to load evaluation');
  }
}
