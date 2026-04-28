import { 
  TreatmentProtocol, 
  DiseaseStatus, 
  PatientBiomarker, 
  TreatmentLine, 
  PerformanceStatus,
  PerformanceScaleType,
  PerformanceScoreType,
  StageType,
  TreatmentResponseType,
  TreatmentLineType
} from '../types/diseaseProgress.types';
import { ONCOLOGY_PROTOCOLS } from '../data/oncologyProtocols';
import { ProtocolMatcher } from './protocolMatcher';

interface TestScenario {
  name: string;
  disease: Partial<DiseaseStatus>;
  history: Partial<TreatmentLine>[];
  ps: Partial<PerformanceStatus>;
  expectedEligibleIds: string[];
  forbiddenEligibleIds: string[];
}

const scenarios: TestScenario[] = [
  {
    name: "HER2+ Breast Cancer (1L) - Should match THP",
    disease: { 
      primaryDiagnosis: 'Breast Cancer', 
      stageAtDiagnosis: 'IV' as StageType,
      biomarkers: [{ name: 'HER2', status: 'Positive' }] 
    },
    history: [],
    ps: { performanceScore: '1' as PerformanceScoreType, performanceScale: 'ECOG' as PerformanceScaleType },
    expectedEligibleIds: ['BR-HER2-001'],
    forbiddenEligibleIds: ['BR-BRCA-001']
  },
  {
    name: "PD-L1 High NSCLC (1L) - Should match Pembrolizumab",
    disease: { 
      primaryDiagnosis: 'Lung Cancer', 
      histology: 'Adenocarcinoma',
      stageAtDiagnosis: 'IV' as StageType,
      biomarkers: [
        { name: 'PD-L1', status: 'High (>=50%)' },
        { name: 'EGFR', status: 'Negative' },
        { name: 'ALK', status: 'Negative' }
      ] 
    },
    history: [],
    ps: { performanceScore: '1' as PerformanceScoreType, performanceScale: 'ECOG' as PerformanceScaleType },
    expectedEligibleIds: ['LU-IO-001'],
    forbiddenEligibleIds: ['LU-EGFR-001']
  },
  {
    name: "Squamous NSCLC - Should match 1L IO Combo (Squamous)",
    disease: { 
      primaryDiagnosis: 'Lung Cancer', 
      histology: 'Squamous Cell Carcinoma',
      stageAtDiagnosis: 'IV' as StageType,
      biomarkers: [{ name: 'PD-L1', status: 'Positive (1-49%)' }] 
    },
    history: [],
    ps: { performanceScore: '1' as PerformanceScoreType, performanceScale: 'ECOG' as PerformanceScaleType },
    expectedEligibleIds: ['LU-IO-003'],
    forbiddenEligibleIds: ['LU-IO-002'] // Nonsquamous specific
  },
  {
    name: "mHSPC Prostate - Should match ADT Combo",
    disease: { 
      primaryDiagnosis: 'Prostate Cancer', 
      stageAtDiagnosis: 'IV' as StageType,
      biomarkers: [{ name: 'Castration Status', status: 'Sensitive' }] 
    },
    history: [],
    ps: { performanceScore: '1' as PerformanceScoreType, performanceScale: 'ECOG' as PerformanceScaleType },
    expectedEligibleIds: ['PR-MHSPC-001'],
    forbiddenEligibleIds: ['PR-MCRPC-001']
  },
  {
    name: "mCRPC Prostate (Post-Enzalutamide) - Should match Docetaxel",
    disease: { 
      primaryDiagnosis: 'Prostate Cancer', 
      stageAtDiagnosis: 'IV' as StageType,
      biomarkers: [{ name: 'Castration Status', status: 'Resistant' }] 
    },
    history: [{ 
      treatmentLine: '1' as TreatmentLineType, 
      agents: ['Enzalutamide', 'Leuprolide'], 
      startDate: '2025-01-01', 
      treatmentResponse: 'Progressed' as TreatmentResponseType 
    }],
    ps: { performanceScore: '1' as PerformanceScoreType, performanceScale: 'ECOG' as PerformanceScoreType },
    expectedEligibleIds: ['PR-MCRPC-001'],
    forbiddenEligibleIds: ['PR-MHSPC-001']
  },
  {
    name: "MSI-H Colorectal (1L) - Should match Pembrolizumab",
    disease: { 
      primaryDiagnosis: 'Colorectal Cancer', 
      stageAtDiagnosis: 'IV' as StageType,
      biomarkers: [{ name: 'MSI', status: 'High' }] 
    },
    history: [],
    ps: { performanceScore: '1' as PerformanceScoreType, performanceScale: 'ECOG' as PerformanceScaleType },
    expectedEligibleIds: ['CO-MSI-001'],
    forbiddenEligibleIds: ['CO-RAS-001']
  },
  {
    name: "RAS-mutant CRC (1L) - Should block Anti-EGFR",
    disease: { 
      primaryDiagnosis: 'Colorectal Cancer', 
      stageAtDiagnosis: 'IV' as StageType,
      biomarkers: [
        { name: 'RAS', status: 'Mutant' },
        { name: 'MSI', status: 'Low' }
      ] 
    },
    history: [],
    ps: { performanceScore: '1' as PerformanceScoreType, performanceScale: 'ECOG' as PerformanceScaleType },
    expectedEligibleIds: ['CO-ADJ-001'], 
    forbiddenEligibleIds: ['CO-RAS-001']
  },
  {
    name: "RCC (2L) - Should match Cabozantinib after immunotherapy",
    disease: { 
      primaryDiagnosis: 'Renal Cell Carcinoma', 
      histology: 'Clear Cell Carcinoma',
      stageAtDiagnosis: 'IV' as StageType,
      biomarkers: [] 
    },
    history: [{ 
      treatmentLine: '1' as TreatmentLineType, 
      agents: ['Axitinib', 'Pembrolizumab'], 
      startDate: '2025-01-01', 
      treatmentResponse: 'Stable' as TreatmentResponseType 
    }],
    ps: { performanceScore: '1' as PerformanceScoreType, performanceScale: 'ECOG' as PerformanceScaleType },
    expectedEligibleIds: ['RC-2L-001'],
    forbiddenEligibleIds: ['RC-1L-001']
  },
  {
    name: "TNBC PD-L1 positive - Should match Pembro + Chemo",
    disease: { 
      primaryDiagnosis: 'Breast Cancer', 
      stageAtDiagnosis: 'IV' as StageType,
      biomarkers: [
        { name: 'ER', status: 'Negative' },
        { name: 'PR', status: 'Negative' },
        { name: 'HER2', status: 'Negative' },
        { name: 'PD-L1', status: 'Positive' }
      ] 
    },
    history: [],
    ps: { performanceScore: '1' as PerformanceScoreType, performanceScale: 'ECOG' as PerformanceScaleType },
    expectedEligibleIds: ['BR-TNBC-001'],
    forbiddenEligibleIds: ['BR-HER2-001']
  },
  {
    name: "EGFR-mutant NSCLC - Should match Osimertinib & block generic IO",
    disease: { 
      primaryDiagnosis: 'Lung Cancer', 
      histology: 'Adenocarcinoma',
      stageAtDiagnosis: 'IV' as StageType,
      biomarkers: [
        { name: 'EGFR (Sensitizing)', status: 'Mutant' },
        { name: 'PD-L1', status: 'High (>=50%)' },
        { name: 'ALK', status: 'Negative' }
      ] 
    },
    history: [],
    ps: { performanceScore: '1' as PerformanceScoreType, performanceScale: 'ECOG' as PerformanceScaleType },
    expectedEligibleIds: ['LU-EGFR-001'],
    forbiddenEligibleIds: ['LU-IO-001', 'LU-IO-002']
  },
  {
    name: "PSMA-positive mCRPC - Should match Radioligand therapy",
    disease: { 
      primaryDiagnosis: 'Prostate Cancer', 
      stageAtDiagnosis: 'IV' as StageType,
      biomarkers: [
        { name: 'Castration Status', status: 'Resistant' },
        { name: 'PSMA PET', status: 'Positive' }
      ] 
    },
    history: [
      { treatmentLine: '1' as TreatmentLineType, agents: ['Enzalutamide', 'Leuprolide'], startDate: '2024-01-01', treatmentResponse: 'Progressed' as TreatmentResponseType },
      { treatmentLine: '2' as TreatmentLineType, agents: ['Docetaxel'], startDate: '2024-07-01', treatmentResponse: 'Progressed' as TreatmentResponseType }
    ],
    ps: { performanceScore: '1' as PerformanceScoreType, performanceScale: 'ECOG' as PerformanceScaleType },
    expectedEligibleIds: ['PR-MCRPC-003'],
    forbiddenEligibleIds: ['PR-MHSPC-001']
  },
  {
    name: "BRCA/HRD Ovarian Maintenance - Should match PARP inhibitor",
    disease: { 
      primaryDiagnosis: 'Ovarian Cancer', 
      stageAtDiagnosis: 'III' as StageType,
      biomarkers: [{ name: 'BRCA1/2', status: 'Mutant' }] 
    },
    history: [], // Maintenance is part of 1L strategy here
    ps: { performanceScore: '1' as PerformanceScoreType, performanceScale: 'ECOG' as PerformanceScaleType },
    expectedEligibleIds: ['OV-MAIN-001'],
    forbiddenEligibleIds: ['OV-REL-002']
  },
  {
    name: "DLBCL 1L - Should match R-CHOP",
    disease: { 
      primaryDiagnosis: 'Lymphoma', 
      histology: 'Diffuse Large B-Cell Lymphoma (DLBCL)',
      stageAtDiagnosis: 'III' as StageType,
      biomarkers: [] 
    },
    history: [],
    ps: { performanceScore: '1' as PerformanceScoreType, performanceScale: 'ECOG' as PerformanceScaleType },
    expectedEligibleIds: ['LY-DLBCL-001'],
    forbiddenEligibleIds: ['LY-HL-001']
  },
  {
    name: "Hodgkin Lymphoma 1L - Should match ABVD",
    disease: { 
      primaryDiagnosis: 'Lymphoma', 
      histology: 'Classical Hodgkin Lymphoma',
      stageAtDiagnosis: 'III' as StageType,
      biomarkers: [] 
    },
    history: [],
    ps: { performanceScore: '1' as PerformanceScoreType, performanceScale: 'ECOG' as PerformanceScaleType },
    expectedEligibleIds: ['LY-HL-001'],
    forbiddenEligibleIds: ['LY-DLBCL-001']
  },
  {
    name: "HER2+ Gastric Cancer (1L) - Should match Trastuzumab combo",
    disease: { 
      primaryDiagnosis: 'Gastric Cancer', 
      stageAtDiagnosis: 'IV' as StageType,
      biomarkers: [{ name: 'HER2', status: 'Positive' }] 
    },
    history: [],
    ps: { performanceScore: '1' as PerformanceScoreType, performanceScale: 'ECOG' as PerformanceScaleType },
    expectedEligibleIds: ['GA-HER2-001'],
    forbiddenEligibleIds: ['PA-META-001']
  },
  {
    name: "BRCA-mutant Pancreatic Maintenance - Should match Olaparib",
    disease: { 
      primaryDiagnosis: 'Pancreatic Cancer', 
      stageAtDiagnosis: 'IV' as StageType,
      biomarkers: [{ name: 'BRCA1/2', status: 'Mutant' }] 
    },
    history: [],
    ps: { performanceScore: '1' as PerformanceScoreType, performanceScale: 'ECOG' as PerformanceScaleType },
    expectedEligibleIds: ['PA-MAIN-001'],
    forbiddenEligibleIds: [] 
  },
  {
    name: "No Local Protocol Match - Should return empty eligible list",
    disease: { 
      primaryDiagnosis: 'Unknown Primary Cancer', 
      stageAtDiagnosis: 'IV' as StageType,
      biomarkers: [] 
    },
    history: [],
    ps: { performanceScore: '1' as PerformanceScoreType, performanceScale: 'ECOG' as PerformanceScaleType },
    expectedEligibleIds: [],
    forbiddenEligibleIds: ['BR-HER2-001', 'LU-IO-001']
  }
];

function runValidation() {
  console.log("=== Treatment Protocol Matcher Validation Report ===");
  let passed = 0;
  let failed = 0;

  scenarios.forEach(scenario => {
    // Fill in missing properties for type safety if needed for matcher
    const disease = {
      primaryDiagnosis: '',
      stageAtDiagnosis: 'IV',
      biomarkers: [],
      dateOfDiagnosis: '2025-01-01',
      ...scenario.disease
    } as DiseaseStatus;

    const history = (scenario.history || []).map((h, index) => ({
      treatmentLine: (index + 1).toString() as TreatmentLineType,
      treatmentRegimen: '',
      agents: [],
      startDate: '2025-01-01',
      treatmentResponse: 'Stable',
      ...h
    })) as TreatmentLine[];

    const ps = {
      assessmentDate: '2025-01-01',
      performanceScale: 'ECOG',
      performanceScore: '1',
      ...scenario.ps
    } as PerformanceStatus;

    const matcher = new ProtocolMatcher(ONCOLOGY_PROTOCOLS);
    const matches = matcher.findMatches(
      disease,
      ps,
      history
    );

    const eligibleIds = matches
      .filter(m => m.isEligible)
      .map(m => m.protocol.id);

    const missingExpected = scenario.expectedEligibleIds.filter(id => !eligibleIds.includes(id));
    const containingForbidden = scenario.forbiddenEligibleIds.filter(id => eligibleIds.includes(id));

    if (missingExpected.length === 0 && containingForbidden.length === 0) {
      console.log(`✅ PASSED: ${scenario.name}`);
      passed++;
    } else {
      console.log(`❌ FAILED: ${scenario.name}`);
      if (missingExpected.length > 0) {
        console.log(`   - Missing expected IDs: ${missingExpected.join(', ')}`);
      }
      if (containingForbidden.length > 0) {
        console.log(`   - Incorrectly included forbidden IDs: ${containingForbidden.join(', ')}`);
      }
      console.log(`   - Found eligible IDs: ${eligibleIds.join(', ')}`);
      failed++;
    }
  });

  console.log("\n=== Summary ===");
  console.log(`Total: ${scenarios.length} | Passed: ${passed} | Failed: ${failed}`);
}

runValidation();
