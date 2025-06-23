/**
 * Custom hook for treatment protocol suggestions
 * Provides intelligent protocol recommendations based on patient data
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  TreatmentProtocol,
  UseProtocolSuggestionsReturn,
  DiseaseStatus,
  PerformanceStatus,
  StageType
} from '../types/diseaseProgress.types';

// Enhanced protocol data with more comprehensive information
const ENHANCED_PROTOCOLS: TreatmentProtocol[] = [
  // Breast Cancer Protocols
  {
    diagnosis: "Breast Cancer",
    stage: "I",
    name: "AC→T (Doxorubicin/Cyclophosphamide → Paclitaxel)",
    premedications: ["Dexamethasone", "Diphenhydramine", "H2 antagonist"],
    indications: ["Early-stage breast cancer", "Adjuvant therapy"],
    contraindications: ["LVEF <50%", "Previous anthracycline exposure"],
    dosing: {
      standard: "AC: Doxorubicin 60mg/m² + Cyclophosphamide 600mg/m² q21d x4 → Paclitaxel 175mg/m² q21d x4",
      adjustments: [
        { condition: "ECOG 2", modification: "Consider dose reduction 20%" },
        { condition: "Age >70", modification: "Consider weekly paclitaxel" }
      ],
      schedule: "21-day cycles",
      cycleLenth: "16 weeks total"
    }
  },
  {
    diagnosis: "Breast Cancer",
    stage: "Any",
    name: "T-DM1 (Trastuzumab emtansine)",
    premedications: ["Diphenhydramine", "Acetaminophen"],
    indications: ["HER2+ metastatic breast cancer", "Previous trastuzumab"],
    contraindications: ["ILD history", "Severe hepatic impairment"],
    dosing: {
      standard: "3.6 mg/kg IV q21d",
      adjustments: [
        { condition: "Grade 3 thrombocytopenia", modification: "Hold until recovery, reduce dose" },
        { condition: "AST/ALT >3x ULN", modification: "Hold treatment" }
      ],
      schedule: "21-day cycles",
      cycleLenth: "Until progression"
    }
  },

  // Colorectal Cancer Protocols
  {
    diagnosis: "Colorectal Cancer",
    stage: "III",
    name: "FOLFOX (5-FU/Leucovorin/Oxaliplatin)",
    premedications: ["Ondansetron", "Dexamethasone"],
    indications: ["Adjuvant colon cancer", "Metastatic colorectal cancer"],
    contraindications: ["Severe neuropathy", "DPD deficiency"],
    dosing: {
      standard: "Oxaliplatin 85mg/m² + Leucovorin 400mg/m² + 5-FU 400mg/m² bolus + 2400mg/m² CI over 46h q14d",
      adjustments: [
        { condition: "Grade 2 neuropathy", modification: "Reduce oxaliplatin 20%" },
        { condition: "ECOG 2", modification: "Consider dose reduction", performanceScoreThreshold: 2 }
      ],
      schedule: "14-day cycles",
      cycleLenth: "12 cycles (6 months)"
    }
  },

  // Lung Cancer Protocols
  {
    diagnosis: "Lung Cancer",
    stage: "IV",
    name: "Carboplatin + Pemetrexed",
    premedications: ["Folic acid", "Vitamin B12", "Dexamethasone"],
    indications: ["Non-squamous NSCLC", "First-line metastatic"],
    contraindications: ["Creatinine clearance <45 mL/min", "Squamous histology"],
    dosing: {
      standard: "Carboplatin AUC 6 + Pemetrexed 500mg/m² q21d x4-6 cycles → Pemetrexed maintenance",
      adjustments: [
        { condition: "ECOG 2", modification: "Consider single agent", performanceScoreThreshold: 2 },
        { condition: "Age >75", modification: "Consider carboplatin AUC 5" }
      ],
      schedule: "21-day cycles",
      cycleLenth: "4-6 induction cycles"
    }
  },

  // Lymphoma Protocols
  {
    diagnosis: "Lymphoma",
    stage: "Any",
    name: "R-CHOP (Rituximab + CHOP)",
    premedications: ["Diphenhydramine", "Acetaminophen", "Corticosteroids"],
    indications: ["DLBCL", "Follicular lymphoma"],
    contraindications: ["Active hepatitis B", "LVEF <50%"],
    dosing: {
      standard: "Rituximab 375mg/m² + Cyclophosphamide 750mg/m² + Doxorubicin 50mg/m² + Vincristine 1.4mg/m² + Prednisone 100mg PO x5d q21d",
      adjustments: [
        { condition: "Age >70", modification: "Consider R-mini-CHOP" },
        { condition: "ECOG 3-4", modification: "Palliative approach", performanceScoreThreshold: 3 }
      ],
      schedule: "21-day cycles",
      cycleLenth: "6-8 cycles"
    }
  }
];

// Protocol matching logic
const getMatchingProtocols = (
  diagnosis: string,
  stage: StageType | '',
  histology?: string
): TreatmentProtocol[] => {
  if (!diagnosis) return [];

  const effectiveDiagnosis = diagnosis === "Other" ? "Other" : diagnosis;
  
  return ENHANCED_PROTOCOLS.filter(protocol => {
    // Match diagnosis
    if (protocol.diagnosis !== effectiveDiagnosis) return false;
    
    // Match stage (Any stage protocols always match)
    if (protocol.stage !== 'Any' && stage && protocol.stage !== stage) return false;
    
    // Additional filtering based on histology for specific cases
    if (histology && diagnosis === "Lung Cancer") {
      if (protocol.name.includes("Pemetrexed") && histology.includes("Squamous")) {
        return false; // Pemetrexed contraindicated in squamous NSCLC
      }
    }
    
    return true;
  });
};

// Get contraindications based on patient data
const getContraindications = (
  protocols: TreatmentProtocol[],
  performanceScore: string,
  histology?: string
): string[] => {
  const contraindications: string[] = [];
  
  protocols.forEach(protocol => {
    if (protocol.contraindications) {
      protocol.contraindications.forEach(contraindication => {
        // Check performance score contraindications
        if (performanceScore === '4' && contraindication.includes("ECOG")) {
          contraindications.push(`${protocol.name}: ${contraindication}`);
        }
        
        // Check histology contraindications
        if (histology && contraindication.toLowerCase().includes(histology.toLowerCase())) {
          contraindications.push(`${protocol.name}: ${contraindication}`);
        }
      });
    }
  });
  
  return [...new Set(contraindications)];
};

// Get dose adjustments based on performance status
const getDoseAdjustments = (
  protocols: TreatmentProtocol[],
  performanceScore: string
): string[] => {
  const adjustments: string[] = [];
  const score = parseInt(performanceScore, 10);
  
  if (isNaN(score)) return adjustments;
  
  protocols.forEach(protocol => {
    if (protocol.dosing?.adjustments) {
      protocol.dosing.adjustments.forEach(adjustment => {
        if (adjustment.performanceScoreThreshold && score >= adjustment.performanceScoreThreshold) {
          adjustments.push(`${protocol.name}: ${adjustment.modification}`);
        }
      });
    }
  });
  
  return adjustments;
};

export const useProtocolSuggestions = (
  diseaseStatus: DiseaseStatus,
  performanceStatus: PerformanceStatus
): UseProtocolSuggestionsReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  // Memoized protocol calculations
  const protocols = useMemo(() => {
    try {
      return getMatchingProtocols(
        diseaseStatus.primaryDiagnosis,
        diseaseStatus.stageAtDiagnosis,
        diseaseStatus.histologyMutation
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get protocols');
      return [];
    }
  }, [
    diseaseStatus.primaryDiagnosis,
    diseaseStatus.stageAtDiagnosis,
    diseaseStatus.histologyMutation
  ]);
  // Memoized premedications
  const premedications = useMemo(() => {
    if (protocols.length === 0) return [];
    
    const allPremeds = protocols.reduce((acc, protocol) => {
      return [...acc, ...protocol.premedications];
    }, [] as string[]);
    
    return [...new Set(allPremeds)];
  }, [protocols]);

  // Additional computed suggestions
  const contraindications = useMemo(() => {
    return getContraindications(
      protocols,
      performanceStatus.performanceScore,
      diseaseStatus.histologyMutation
    );
  }, [protocols, performanceStatus.performanceScore, diseaseStatus.histologyMutation]);

  const doseAdjustments = useMemo(() => {
    return getDoseAdjustments(protocols, performanceStatus.performanceScore);
  }, [protocols, performanceStatus.performanceScore]);

  // Refetch function for manual refresh
  const refetch = useCallback(() => {
    setIsLoading(true);
    setError(undefined);
    
    // Simulate async operation (could be API call in future)
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  // Effect to handle loading states
  useEffect(() => {
    if (diseaseStatus.primaryDiagnosis && diseaseStatus.stageAtDiagnosis) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [diseaseStatus.primaryDiagnosis, diseaseStatus.stageAtDiagnosis]);
  return {
    protocols,
    premedications,
    isLoading,
    error,
    refetch,
    // Additional helpful data
    contraindications,
    doseAdjustments,
    recommendations: {
      hasContraindications: contraindications.length > 0,
      needsDoseAdjustment: doseAdjustments.length > 0,
      performanceBasedWarning: parseInt(performanceStatus.performanceScore, 10) >= 2
    }
  };
};

// Legacy compatibility hook for existing DIAGNOSIS_PROTOCOL_MAP
export const useLegacyProtocolSuggestions = (
  primaryDiagnosis: string
): string[] => {
  const DIAGNOSIS_PROTOCOL_MAP: { [key: string]: string[] } = {
    "Breast Cancer": ["AC→T", "FEC→D", "T-DM1", "Kadcyla"],
    "Colorectal Cancer": ["FOLFOX", "FOLFIRI", "FOLFOXIRI", "CAPOX"],
    "Lung Cancer": ["Carbo + Pemetrexed", "Osimertinib", "Durvalumab"],
    "Prostate Cancer": ["Docetaxel", "Abiraterone", "Enzalutamide"],
    "Lymphoma": ["R-CHOP", "ABVD", "Bendamustine + Rituximab"],
    "Leukemia": ["7+3 Regimen", "FLAG-IDA", "Blinatumomab"],
    "Melanoma": ["Nivolumab + Ipilimumab", "Pembrolizumab"],
    "Ovarian Cancer": ["Carboplatin + Paclitaxel", "Bevacizumab"],
    "Other": []
  };

  return useMemo(() => {
    return DIAGNOSIS_PROTOCOL_MAP[primaryDiagnosis] || [];
  }, [primaryDiagnosis]);
};