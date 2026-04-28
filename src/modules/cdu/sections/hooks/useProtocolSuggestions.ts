/**
 * Custom hook for treatment protocol suggestions
 * Powered by local oncology protocol database and matching engine
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  TreatmentProtocol,
  UseProtocolSuggestionsReturn,
  DiseaseStatus,
  PerformanceStatus,
  TreatmentLine
} from '../types/diseaseProgress.types';
import { ONCOLOGY_PROTOCOLS } from '../data/oncologyProtocols';
import { ProtocolMatcher } from '../utils/protocolMatcher';

export const useProtocolSuggestions = (
  diseaseStatus: DiseaseStatus,
  performanceStatus: PerformanceStatus,
  treatmentHistory: TreatmentLine[] = []
): UseProtocolSuggestionsReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const matcher = useMemo(() => new ProtocolMatcher(ONCOLOGY_PROTOCOLS), []);

  // Memoized matching results
  const matches = useMemo(() => {
    try {
      if (!diseaseStatus.primaryDiagnosis) return [];
      return matcher.findMatches(diseaseStatus, performanceStatus, treatmentHistory);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get protocols');
      return [];
    }
  }, [diseaseStatus, performanceStatus, treatmentHistory, matcher]);

  const protocols = useMemo(() => matches.map(m => m.protocol), [matches]);

  // Extract all warnings and contraindications from matches
  const contraindications = useMemo(() => {
    return matches.flatMap(m => m.warnings);
  }, [matches]);

  // Refetch function for manual refresh
  const refetch = useCallback(() => {
    setIsLoading(true);
    setError(undefined);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  // Effect to handle loading states
  useEffect(() => {
    if (diseaseStatus.primaryDiagnosis) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [diseaseStatus.primaryDiagnosis]);

  return {
    protocols,
    matches,
    premedications: [], // Premeds can be added to protocol database later
    isLoading,
    error,
    refetch,
    contraindications,
    doseAdjustments: [],
    recommendations: {
      hasContraindications: contraindications.length > 0,
      needsDoseAdjustment: false,
      performanceBasedWarning: parseInt(performanceStatus.performanceScore || '0', 10) >= 2
    }
  };
};

// Legacy compatibility hook remains for UI components that haven't migrated
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
