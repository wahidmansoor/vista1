/**
 * Advanced Protocol Matcher Hook
 * Real-time treatment protocol matching and recommendation generation
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  PatientProfile,
  TreatmentProtocol,
  TreatmentRecommendation,
  ProtocolMatch,
  TreatmentMatchRequest,
  FilterCriteria,
  SortOrder
} from '@/types/medical';
import { treatmentDatabase } from '@/services/treatmentDatabase';
import TreatmentMatcher, { DEFAULT_MATCHING_CONFIG, MatchingConfig } from '@/services/treatmentMatcher';
import { useToast } from '@/components/ui/use-toast';

export interface UseProtocolMatcherOptions {
  autoMatch?: boolean;
  refreshInterval?: number;
  config?: Partial<MatchingConfig>;
}

export interface ProtocolMatcherState {
  recommendations: TreatmentRecommendation[];
  protocols: TreatmentProtocol[];
  matches: ProtocolMatch[];
  isLoading: boolean;
  isGenerating: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

/**
 * Advanced hook for protocol matching and recommendation generation
 */
export function useProtocolMatcher(options: UseProtocolMatcherOptions = {}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [state, setState] = useState<ProtocolMatcherState>({
    recommendations: [],
    protocols: [],
    matches: [],
    isLoading: false,
    isGenerating: false,
    error: null,
    lastUpdated: null
  });

  const [filters, setFilters] = useState<Partial<FilterCriteria>>({});
  const [sort, setSort] = useState<SortOrder>({ field: 'match_score', direction: 'desc' });
  const [matchingConfig] = useState<MatchingConfig>({
    ...DEFAULT_MATCHING_CONFIG,
    ...options.config
  });

  // Query for available protocols
  const {
    data: availableProtocols = [],
    isLoading: protocolsLoading,
    error: protocolsError
  } = useQuery({
    queryKey: ['protocols', filters, sort],
    queryFn: () => treatmentDatabase.getProtocols(filters, sort),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: options.refreshInterval
  });

  // Update state when protocols change
  useEffect(() => {
    setState(prev => ({
      ...prev,
      protocols: availableProtocols,
      isLoading: protocolsLoading,
      error: protocolsError?.message || null
    }));
  }, [availableProtocols, protocolsLoading, protocolsError]);

  /**
   * Generate treatment recommendations for a patient
   */
  const generateRecommendations = useCallback(async (
    patient: PatientProfile,
    request?: Partial<TreatmentMatchRequest>
  ): Promise<TreatmentRecommendation[]> => {
    setState(prev => ({ ...prev, isGenerating: true, error: null }));

    try {
      const matchRequest: TreatmentMatchRequest = {
        patient_id: patient.id,
        cancer_type_id: patient.disease_status.cancer_type_id,
        treatment_line: request?.treatment_line,
        include_experimental: request?.include_experimental || false,
        max_results: request?.max_results || 5
      };

      const response = await treatmentDatabase.generateTreatmentRecommendations(matchRequest);
      
      setState(prev => ({
        ...prev,
        recommendations: response.recommendations,
        isGenerating: false,
        lastUpdated: new Date()
      }));

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['recommendations', patient.id] });

      toast({
        title: "Recommendations Generated",
        description: `Found ${response.recommendations.length} suitable treatment options`,
        variant: "default"
      });

      return response.recommendations;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate recommendations';
      
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: errorMessage
      }));

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });

      throw error;
    }
  }, [queryClient, toast]);

  /**
   * Calculate detailed protocol matches
   */
  const calculateProtocolMatches = useCallback(async (
    patient: PatientProfile,
    protocolsToMatch?: TreatmentProtocol[]
  ): Promise<ProtocolMatch[]> => {
    const protocols = protocolsToMatch || availableProtocols;
    
    if (!protocols.length) {
      return [];
    }

    try {
      const matches: ProtocolMatch[] = [];

      for (const protocol of protocols) {
        const matchScore = TreatmentMatcher.calculateMatchScore(patient, protocol, matchingConfig);
        
        if (matchScore >= matchingConfig.thresholds.minimum_match_score) {
          const eligibilityAssessment = TreatmentMatcher.assessEligibility(patient, protocol);
            const match: ProtocolMatch = {
            protocol,
            match_score: matchScore,
            eligibility_assessment: eligibilityAssessment,
            safety_concerns: [], // Would be populated by safety assessment
            implementation_notes: []
          };

          matches.push(match);
        }
      }

      // Sort by match score
      matches.sort((a, b) => b.match_score - a.match_score);

      setState(prev => ({
        ...prev,
        matches,
        lastUpdated: new Date()
      }));

      return matches;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to calculate matches';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, [availableProtocols, matchingConfig]);

  /**
   * Update filter criteria
   */
  const updateFilters = useCallback((newFilters: Partial<FilterCriteria>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  /**
   * Update sort order
   */
  const updateSort = useCallback((newSort: Partial<SortOrder>) => {
    setSort(prev => ({ ...prev, ...newSort }));
  }, []);

  /**
   * Clear all recommendations and matches
   */
  const clearResults = useCallback(() => {
    setState(prev => ({
      ...prev,
      recommendations: [],
      matches: [],
      error: null,
      lastUpdated: null
    }));
  }, []);

  /**
   * Refresh protocols and recalculate if patient data exists
   */
  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['protocols'] });
    setState(prev => ({ ...prev, error: null }));
  }, [queryClient]);

  // Computed values
  const eligibleProtocols = useMemo(() => {
    return state.matches.filter(match => match.eligibility_assessment.eligible);
  }, [state.matches]);

  const partiallyEligibleProtocols = useMemo(() => {
    return state.matches.filter(match => 
      !match.eligibility_assessment.eligible && 
      match.eligibility_assessment.violations.length > 0
    );
  }, [state.matches]);

  const highConfidenceRecommendations = useMemo(() => {
    return state.recommendations.filter(rec => 
      rec.confidence_level === 'high' || rec.confidence_level === 'very_high'
    );
  }, [state.recommendations]);

  return {
    // State
    ...state,
    filters,
    sort,
    config: matchingConfig,

    // Actions
    generateRecommendations,
    calculateProtocolMatches,
    updateFilters,
    updateSort,
    clearResults,
    refresh,

    // Computed values
    eligibleProtocols,
    partiallyEligibleProtocols,
    highConfidenceRecommendations,

    // Status flags
    hasResults: state.recommendations.length > 0 || state.matches.length > 0,
    canGenerate: availableProtocols.length > 0 && !state.isGenerating,
    needsRefresh: !state.lastUpdated || 
                  (new Date().getTime() - state.lastUpdated.getTime()) > 30 * 60 * 1000 // 30 minutes
  };
}

/**
 * Hook for managing individual protocol details and comparisons
 */
export function useProtocolDetails(protocolId: string | null) {
  const { toast } = useToast();
  
  const {
    data: protocol,
    isLoading,
    error
  } = useQuery({
    queryKey: ['protocol', protocolId],
    queryFn: () => protocolId ? treatmentDatabase.getProtocol(protocolId) : null,
    enabled: !!protocolId,
    staleTime: 10 * 60 * 1000 // 10 minutes
  });

  const {
    data: effectiveness,
    isLoading: effectivenessLoading
  } = useQuery({
    queryKey: ['protocol-effectiveness', protocolId],
    queryFn: () => protocolId ? treatmentDatabase.getProtocolEffectiveness(protocolId) : null,
    enabled: !!protocolId,
    staleTime: 30 * 60 * 1000 // 30 minutes
  });

  return {
    protocol,
    effectiveness,
    isLoading: isLoading || effectivenessLoading,
    error: error?.message || null,
    hasData: !!protocol
  };
}

/**
 * Hook for protocol comparison functionality
 */
export function useProtocolComparison() {
  const [selectedProtocols, setSelectedProtocols] = useState<string[]>([]);
  const [comparisonData, setComparisonData] = useState<TreatmentProtocol[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addToComparison = useCallback((protocolId: string) => {
    setSelectedProtocols(prev => {
      if (prev.includes(protocolId)) {
        return prev;
      }
      if (prev.length >= 4) {
        return [...prev.slice(1), protocolId]; // Keep last 4
      }
      return [...prev, protocolId];
    });
  }, []);

  const removeFromComparison = useCallback((protocolId: string) => {
    setSelectedProtocols(prev => prev.filter(id => id !== protocolId));
  }, []);

  const clearComparison = useCallback(() => {
    setSelectedProtocols([]);
    setComparisonData([]);
  }, []);

  // Load protocol details for comparison
  useEffect(() => {
    if (selectedProtocols.length === 0) {
      setComparisonData([]);
      return;
    }

    const loadProtocols = async () => {
      setIsLoading(true);
      try {
        const protocols = await Promise.all(
          selectedProtocols.map(id => treatmentDatabase.getProtocol(id))
        );
        setComparisonData(protocols.filter(Boolean) as TreatmentProtocol[]);
      } catch (error) {
        console.error('Failed to load protocols for comparison:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProtocols();
  }, [selectedProtocols]);

  const comparisonMetrics = useMemo(() => {
    return comparisonData.map(protocol => ({
      protocol,
      efficacy_score: 0.8, // Would be calculated from effectiveness data
      safety_score: 0.7,   // Would be calculated from toxicity profile
      evidence_level: protocol.evidence_level,
      implementation_complexity: 'moderate' as const
    }));
  }, [comparisonData]);

  return {
    selectedProtocols,
    comparisonData,
    comparisonMetrics,
    isLoading,
    addToComparison,
    removeFromComparison,
    clearComparison,
    canAddMore: selectedProtocols.length < 4,
    hasComparison: selectedProtocols.length > 1
  };
}

export default useProtocolMatcher;
