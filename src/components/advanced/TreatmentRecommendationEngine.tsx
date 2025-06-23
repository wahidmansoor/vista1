/**
 * Advanced Treatment Recommendation Engine Component
 * Production-ready clinical decision support interface
 * 
 * Features:
 * - Real-time protocol matching with sophisticated algorithms
 * - Interactive eligibility assessment
 * - Contraindication detection and management
 * - Protocol comparison and ranking
 * - Clinical trial integration
 * - Comprehensive safety assessment
 * 
 * @version 2.0.0
 * @author Advanced Cancer Treatment Management System
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Brain,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Star,
  TrendingUp,
  Shield,
  Clock,
  Users,
  FileText,
  Zap,
  Activity,
  Target
} from 'lucide-react';

import { PatientProfile, MatchingResult, MatchConfidence, EvidenceLevel } from '@/types/medical';
import { treatmentMatcher } from '@/services/advancedTreatmentMatcher';
import { useToast } from '@/components/ui/use-toast';

interface TreatmentRecommendationEngineProps {
  patient: PatientProfile | null;
  onRecommendationsGenerated: (recommendations: MatchingResult[]) => void;
  onProtocolSelected: (result: MatchingResult) => void;
  className?: string;
}

/**
 * Advanced Treatment Recommendation Engine Component
 */
export const TreatmentRecommendationEngine: React.FC<TreatmentRecommendationEngineProps> = ({
  patient,
  onRecommendationsGenerated,
  onProtocolSelected,
  className = ''
}) => {
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<MatchingResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState<MatchingResult | null>(null);
  const [filterCriteria, setFilterCriteria] = useState({
    minimumScore: 0.3,
    evidenceLevel: 'C' as EvidenceLevel,
    includeExperimental: false,
    excludeContraindicated: true
  });

  /**
   * Generate treatment recommendations with advanced matching
   */
  const generateRecommendations = useCallback(async () => {
    if (!patient) {
      toast({
        title: "Patient Required",
        description: "Please ensure patient data is complete before generating recommendations.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const matchingCriteria = {
        patient,
        max_results: 10,
        include_experimental: filterCriteria.includeExperimental,
        minimum_evidence_level: filterCriteria.evidenceLevel,
        exclude_contraindicated: filterCriteria.excludeContraindicated,
        require_biomarker_match: true
      };

      const results = await treatmentMatcher.findMatchingProtocols(matchingCriteria);
      
      // Filter by minimum score
      const filteredResults = results.filter(r => r.match_score >= filterCriteria.minimumScore);
      
      setRecommendations(filteredResults);
      onRecommendationsGenerated(filteredResults);

      toast({
        title: "Recommendations Generated",
        description: `Found ${filteredResults.length} matching treatment protocols.`,
        variant: "default"
      });

    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to generate treatment recommendations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [patient, filterCriteria, onRecommendationsGenerated, toast]);

  /**
   * Auto-generate recommendations when patient data changes
   */
  useEffect(() => {
    if (patient?.disease_status?.primary_cancer_type && patient?.disease_status?.stage) {
      generateRecommendations();
    }
  }, [patient?.disease_status?.primary_cancer_type, patient?.disease_status?.stage, generateRecommendations]);

  /**
   * Get confidence badge styling
   */
  const getConfidenceBadge = (confidence: MatchConfidence) => {
    const configs = {
      very_high: { variant: 'default', color: 'bg-emerald-500', icon: CheckCircle2 },
      high: { variant: 'secondary', color: 'bg-blue-500', icon: TrendingUp },
      medium: { variant: 'outline', color: 'bg-yellow-500', icon: Clock },
      low: { variant: 'destructive', color: 'bg-orange-500', icon: AlertTriangle },
      very_low: { variant: 'destructive', color: 'bg-red-500', icon: XCircle }
    };
    
    const config = configs[confidence];
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant as any} className="gap-1">
        <Icon className="h-3 w-3" />
        {confidence.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  /**
   * Get evidence level styling
   */
  const getEvidenceBadge = (level: EvidenceLevel) => {
    const colors = {
      A: 'bg-emerald-600',
      B: 'bg-blue-600',
      C: 'bg-yellow-600',
      D: 'bg-orange-600',
      E: 'bg-red-600'
    };
    
    return (
      <Badge className={`${colors[level]} text-white`}>
        Level {level}
      </Badge>
    );
  };

  /**
   * Render protocol card with comprehensive information
   */
  const renderProtocolCard = (result: MatchingResult, index: number) => {
    const { protocol, match_score, confidence, eligibility_status, safety_assessment } = result;
    
    return (
      <motion.div
        key={protocol.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="mb-4"
      >
        <Card 
          className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
            selectedProtocol?.protocol.id === protocol.id 
              ? 'ring-2 ring-blue-500 shadow-lg' 
              : 'hover:shadow-md'
          }`}
          onClick={() => {
            setSelectedProtocol(result);
            onProtocolSelected(result);
          }}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  {protocol.name}
                </CardTitle>
                <CardDescription className="mt-1">
                  {protocol.short_name} • {protocol.protocol_code}
                </CardDescription>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <Progress 
                    value={match_score * 100} 
                    className="w-16 h-2"
                  />
                  <span className="text-sm font-medium">
                    {Math.round(match_score * 100)}%
                  </span>
                </div>
                {getConfidenceBadge(confidence)}
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Evidence and Eligibility */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium">Evidence</span>
                  {getEvidenceBadge(protocol.evidence_level)}
                </div>
                
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium">Eligibility</span>
                  <Badge variant={eligibility_status.eligible ? 'default' : 'destructive'}>
                    {eligibility_status.eligible ? 'Eligible' : 'Not Eligible'}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium">Safety</span>
                  <Badge variant={
                    safety_assessment.risk_level === 'low' ? 'default' :
                    safety_assessment.risk_level === 'moderate' ? 'secondary' :
                    'destructive'
                  }>
                    {safety_assessment.risk_level} risk
                  </Badge>
                </div>
              </div>

              {/* Treatment Details */}
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Line:</span> {protocol.line_of_therapy}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Intent:</span> {protocol.treatment_intent}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Cycles:</span> {protocol.treatment_schedule.total_cycles || 'Continuous'}
                </div>
              </div>

              {/* Key Metrics */}
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Response Rate:</span> {
                    protocol.expected_outcomes?.response_rates?.overall_response
                      ? `${Math.round(protocol.expected_outcomes.response_rates.overall_response * 100)}%`
                      : 'Not available'
                  }
                </div>
                <div className="text-sm">
                  <span className="font-medium">Median PFS:</span> {
                    protocol.expected_outcomes?.survival_metrics?.median_pfs_months
                      ? `${protocol.expected_outcomes.survival_metrics.median_pfs_months} months`
                      : 'Not available'
                  }
                </div>
              </div>
            </div>

            {/* Contraindications Alert */}
            {result.contraindications.length > 0 && (
              <Alert className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <span className="font-medium">Contraindications detected:</span>{' '}
                  {result.contraindications.slice(0, 2).map((c: any, idx: number) => c.description).join(', ')}
                  {result.contraindications.length > 2 && ` and ${result.contraindications.length - 2} more`}
                </AlertDescription>
              </Alert>
            )}

            {/* Rationale */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-2">
                <Brain className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Clinical Rationale</p>
                  <p className="text-sm text-blue-800 mt-1">{result.recommendation_rationale}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  /**
   * Render detailed protocol information
   */
  const renderProtocolDetails = () => {
    if (!selectedProtocol) return null;

    const { protocol, match_breakdown, eligibility_status, safety_assessment } = selectedProtocol;

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Match Score Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(match_breakdown).map(([key, value]) => {
                if (key === 'total_weighted_score') return null;
                
                const label = key.replace(/_/g, ' ').replace(/score/g, '').trim();
                const percentage = typeof value === 'number' ? Math.round(value * 100) : 0;
                
                return (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium capitalize">{label}</span>
                      <span>{percentage}%</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Safety Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-2">Risk Level</p>
                <Badge variant={
                  safety_assessment.risk_level === 'low' ? 'default' :
                  safety_assessment.risk_level === 'moderate' ? 'secondary' :
                  'destructive'
                }>
                  {safety_assessment.risk_level.toUpperCase()} RISK
                </Badge>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Monitoring Intensity</p>
                <Badge variant="outline">
                  {safety_assessment.monitoring_intensity.toUpperCase()}
                </Badge>
              </div>

              <div className="md:col-span-2">
                <p className="text-sm font-medium mb-2">Estimated Toxicity Risk</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Grade 3-4 Toxicity:</span>
                    <span>{Math.round(safety_assessment.estimated_toxicity_risk.grade_3_4_risk * 100)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Treatment Discontinuation:</span>
                    <span>{Math.round(safety_assessment.estimated_toxicity_risk.treatment_discontinuation_risk * 100)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {eligibility_status.violations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600" />
                Eligibility Violations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {eligibility_status.violations.map((violation: any, index: number) => (
                  <div key={index} className="p-3 bg-red-50 rounded-lg">
                    <p className="text-sm font-medium text-red-900">
                      {violation.criterion.replace(/_/g, ' ').toUpperCase()}
                    </p>
                    <p className="text-sm text-red-800">
                      Patient: {violation.patient_value} | Required: {violation.required_value}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const hasValidPatientData = patient?.disease_status?.primary_cancer_type && patient?.disease_status?.stage;

  return (
    <TooltipProvider>
      <div className={`space-y-6 ${className}`}>
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-6 w-6 text-blue-600" />
                  Treatment Recommendation Engine
                </CardTitle>
                <CardDescription>
                  AI-powered clinical decision support with evidence-based protocol matching
                </CardDescription>
              </div>
              
              <div className="flex items-center gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={generateRecommendations}
                      disabled={!hasValidPatientData || isLoading}
                      size="sm"
                      className="gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Brain className="h-4 w-4" />
                          Generate Recommendations
                        </>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Generate treatment recommendations based on patient profile
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </CardHeader>

          {/* Filter Controls */}
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium">Minimum Score</label>
                <select 
                  value={filterCriteria.minimumScore}
                  onChange={(e) => setFilterCriteria({...filterCriteria, minimumScore: parseFloat(e.target.value)})}
                  className="w-full mt-1 text-sm border rounded px-2 py-1"
                >
                  <option value={0.3}>30% - Any consideration</option>
                  <option value={0.6}>60% - Acceptable</option>
                  <option value={0.75}>75% - Good match</option>
                  <option value={0.9}>90% - Excellent match</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Evidence Level</label>
                <select 
                  value={filterCriteria.evidenceLevel}
                  onChange={(e) => setFilterCriteria({...filterCriteria, evidenceLevel: e.target.value as EvidenceLevel})}
                  className="w-full mt-1 text-sm border rounded px-2 py-1"
                >
                  <option value="A">Level A - High quality</option>
                  <option value="B">Level B - Moderate quality</option>
                  <option value="C">Level C - Lower quality</option>
                  <option value="D">Level D - Very low quality</option>
                  <option value="E">Level E - Expert opinion</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filterCriteria.includeExperimental}
                  onChange={(e) => setFilterCriteria({...filterCriteria, includeExperimental: e.target.checked})}
                  className="rounded"
                />
                <label className="text-sm font-medium">Include Experimental</label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filterCriteria.excludeContraindicated}
                  onChange={(e) => setFilterCriteria({...filterCriteria, excludeContraindicated: e.target.checked})}
                  className="rounded"
                />
                <label className="text-sm font-medium">Exclude Contraindicated</label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patient Status */}
        {!hasValidPatientData && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Please complete patient cancer type and stage information to generate treatment recommendations.
            </AlertDescription>
          </Alert>
        )}

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Protocol List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Recommended Protocols ({recommendations.length})
              </h3>
              {recommendations.length > 0 && (
                <Badge variant="secondary">
                  Top match: {Math.round((recommendations[0]?.match_score || 0) * 100)}%
                </Badge>
              )}
            </div>

            <AnimatePresence>
              {recommendations.length === 0 && !isLoading && hasValidPatientData ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 text-gray-500"
                >
                  <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No matching protocols found with current criteria.</p>
                  <p className="text-sm mt-2">Try adjusting the filter settings.</p>
                </motion.div>
              ) : (
                recommendations.map((result, index) => renderProtocolCard(result, index))
              )}
            </AnimatePresence>
          </div>

          {/* Protocol Details */}
          <div className="lg:col-span-1">
            {selectedProtocol ? (
              <div className="sticky top-4">
                <h3 className="text-lg font-semibold mb-4">Protocol Details</h3>
                {renderProtocolDetails()}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-gray-500">
                    <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a protocol to view detailed information</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default TreatmentRecommendationEngine;
