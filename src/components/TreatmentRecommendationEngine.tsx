/**
 * Treatment Recommendation Engine Component
 * Advanced UI for generating and managing treatment recommendations
 */

import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import {
  Brain,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Filter,
  RefreshCcw,
  Download,
  Share,
  BookOpen,
  Zap
} from 'lucide-react';

import {
  PatientProfile,
  TreatmentRecommendation,
  ProtocolMatch,
  TreatmentMatchRequest
} from '@/types/medical';
import { useProtocolMatcher, useProtocolComparison } from '@/hooks/useProtocolMatcher';

interface TreatmentRecommendationEngineProps {
  patient: PatientProfile | null;
  onRecommendationsGenerated?: (recommendations: TreatmentRecommendation[]) => void;
  onProtocolSelected?: (protocolId: string) => void;
}

/**
 * Confidence level styling
 */
const getConfidenceStyles = (level: string) => {
  switch (level) {
    case 'very_high':
      return { 
        bg: 'bg-green-50 dark:bg-green-900/20', 
        text: 'text-green-700 dark:text-green-300',
        border: 'border-green-200 dark:border-green-800',
        badge: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
      };
    case 'high':
      return { 
        bg: 'bg-blue-50 dark:bg-blue-900/20', 
        text: 'text-blue-700 dark:text-blue-300',
        border: 'border-blue-200 dark:border-blue-800',
        badge: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
      };
    case 'moderate':
      return { 
        bg: 'bg-yellow-50 dark:bg-yellow-900/20', 
        text: 'text-yellow-700 dark:text-yellow-300',
        border: 'border-yellow-200 dark:border-yellow-800',
        badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
      };
    case 'low':
    default:
      return { 
        bg: 'bg-gray-50 dark:bg-gray-900/20', 
        text: 'text-gray-700 dark:text-gray-300',
        border: 'border-gray-200 dark:border-gray-800',
        badge: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
      };
  }
};

/**
 * Eligibility status styling
 */
const getEligibilityStyles = (status: string) => {
  switch (status) {
    case 'eligible':
      return { 
        icon: CheckCircle, 
        color: 'text-green-600 dark:text-green-400',
        bg: 'bg-green-50 dark:bg-green-900/20'
      };
    case 'partially_eligible':
      return { 
        icon: AlertTriangle, 
        color: 'text-yellow-600 dark:text-yellow-400',
        bg: 'bg-yellow-50 dark:bg-yellow-900/20'
      };
    case 'ineligible':
      return { 
        icon: AlertTriangle, 
        color: 'text-red-600 dark:text-red-400',
        bg: 'bg-red-50 dark:bg-red-900/20'
      };
    default:
      return { 
        icon: Clock, 
        color: 'text-gray-600 dark:text-gray-400',
        bg: 'bg-gray-50 dark:bg-gray-900/20'
      };
  }
};

export const TreatmentRecommendationEngine: React.FC<TreatmentRecommendationEngineProps> = ({
  patient,
  onRecommendationsGenerated,
  onProtocolSelected
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('recommendations');
  const [showFilters, setShowFilters] = useState(false);

  const {
    recommendations,
    matches,
    isGenerating,
    error,
    lastUpdated,
    generateRecommendations,
    calculateProtocolMatches,
    clearResults,
    eligibleProtocols,
    partiallyEligibleProtocols,
    highConfidenceRecommendations,
    hasResults,
    canGenerate
  } = useProtocolMatcher({
    autoMatch: false,
    refreshInterval: 10 * 60 * 1000 // 10 minutes
  });

  const {
    selectedProtocols,
    addToComparison,
    removeFromComparison,
    hasComparison
  } = useProtocolComparison();

  // Generate recommendations handler
  const handleGenerateRecommendations = useCallback(async () => {
    if (!patient) {
      toast({
        title: "Patient Data Required",
        description: "Please provide patient information to generate recommendations",
        variant: "destructive"
      });
      return;
    }

    try {
      const request: Partial<TreatmentMatchRequest> = {
        include_experimental: false,
        max_results: 8
      };

      const newRecommendations = await generateRecommendations(patient, request);
      
      if (onRecommendationsGenerated) {
        onRecommendationsGenerated(newRecommendations);
      }

      // Also calculate detailed matches
      await calculateProtocolMatches(patient);

    } catch (error) {
      console.error('Failed to generate recommendations:', error);
    }
  }, [patient, generateRecommendations, calculateProtocolMatches, onRecommendationsGenerated, toast]);

  // Recommendation card component
  const RecommendationCard: React.FC<{ recommendation: TreatmentRecommendation }> = ({ recommendation }) => {
    const confidence = getConfidenceStyles(recommendation.confidence_level);
    const eligibility = getEligibilityStyles(recommendation.eligibility_status);
    const EligibilityIcon = eligibility.icon;

    return (
      <Card className={`transition-all duration-200 hover:shadow-md cursor-pointer ${confidence.border}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold mb-2">
                Protocol #{recommendation.protocol_id.slice(-8)}
              </CardTitle>
              <div className="flex items-center gap-2 mb-2">
                <Badge className={confidence.badge}>
                  {recommendation.confidence_level.replace('_', ' ')}
                </Badge>
                <div className={`flex items-center gap-1 ${eligibility.color}`}>
                  <EligibilityIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {recommendation.eligibility_status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {Math.round(recommendation.match_score * 100)}%
              </div>
              <div className="text-xs text-gray-500">Match Score</div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Match Score Progress */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Compatibility</span>
                <span>{Math.round(recommendation.match_score * 100)}%</span>
              </div>
              <Progress 
                value={recommendation.match_score * 100} 
                className="h-2"
              />
            </div>

            {/* Evidence Summary */}
            {recommendation.evidence_summary && (
              <div className={`p-3 rounded-md ${confidence.bg}`}>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {recommendation.evidence_summary}
                </p>
              </div>
            )}

            {/* Contraindications */}
            {recommendation.contraindications.length > 0 && (
              <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-sm">
                  <strong>Contraindications:</strong>
                  <ul className="mt-1 list-disc list-inside">
                    {recommendation.contraindications.map((contraindication, index) => (
                      <li key={index}>{contraindication}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Warnings */}
            {recommendation.warnings.length > 0 && (
              <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-sm">
                  <strong>Warnings:</strong>
                  <ul className="mt-1 list-disc list-inside">
                    {recommendation.warnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Recommended Modifications */}
            {recommendation.recommended_modifications.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Recommended Modifications:
                </h5>
                <div className="space-y-1">
                  {recommendation.recommended_modifications.map((mod, index) => (
                    <div key={index} className="text-sm">
                      <span className="font-medium">{mod.parameter}:</span> {mod.modification}
                      <span className="text-gray-600 dark:text-gray-400 ml-2">
                        ({mod.reason})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="default"
                size="sm"
                onClick={() => onProtocolSelected?.(recommendation.protocol_id)}
                className="flex-1"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                View Details
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addToComparison(recommendation.protocol_id)}
                disabled={selectedProtocols.includes(recommendation.protocol_id)}
              >
                <Target className="w-4 h-4 mr-2" />
                Compare
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Protocol match card component
  const ProtocolMatchCard: React.FC<{ match: ProtocolMatch }> = ({ match }) => {
    const eligibility = getEligibilityStyles(match.eligibility_assessment.eligible ? 'eligible' : 'ineligible');
    const EligibilityIcon = eligibility.icon;

    return (
      <Card className="transition-all duration-200 hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">{match.protocol.name}</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {match.protocol.protocol_code}
              </p>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {Math.round(match.match_score * 100)}%
              </div>
              <div className="text-xs text-gray-500">Match</div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-3">
            <Progress value={match.match_score * 100} className="h-2" />
            
            <div className={`flex items-center gap-2 p-2 rounded ${eligibility.bg}`}>
              <EligibilityIcon className={`w-4 h-4 ${eligibility.color}`} />
              <span className={`text-sm font-medium ${eligibility.color}`}>
                {match.eligibility_assessment.eligible ? 'Eligible' : 'Not Eligible'}
              </span>
            </div>

            {match.eligibility_assessment.violations.length > 0 && (
              <div className="text-sm">
                <strong>Issues:</strong>
                <ul className="list-disc list-inside mt-1 text-gray-600 dark:text-gray-400">
                  {match.eligibility_assessment.violations.map((violation, index) => (
                    <li key={index}>{violation}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onProtocolSelected?.(match.protocol.id)}
                className="flex-1"
              >
                View Protocol
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addToComparison(match.protocol.id)}
              >
                <Target className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Summary statistics
  const stats = useMemo(() => ({
    total: recommendations.length,
    eligible: eligibleProtocols.length,
    partiallyEligible: partiallyEligibleProtocols.length,
    highConfidence: highConfidenceRecommendations.length
  }), [recommendations.length, eligibleProtocols.length, partiallyEligibleProtocols.length, highConfidenceRecommendations.length]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <Brain className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            Treatment Recommendation Engine
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Evidence-based protocol matching and clinical decision support
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>          <Button
            variant="outline"
            size="sm"
            onClick={clearResults}
            disabled={!hasResults}
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      {/* Patient Status */}
      {patient && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">
                    {patient.demographics.age}y
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold">Patient Profile Ready</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {patient.demographics.sex} • ECOG {patient.performance_metrics.ecog_score} • 
                    Stage {patient.disease_status.stage}
                  </p>
                </div>
              </div>
              
              <Button
                onClick={handleGenerateRecommendations}
                disabled={!canGenerate || isGenerating}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Generate Recommendations
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700 dark:text-red-300">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Results */}
      {hasResults && (
        <>
          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.total}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total Options
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.eligible}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Eligible
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {stats.partiallyEligible}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Partial
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {stats.highConfidence}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  High Confidence
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Tabs */}
          <Card>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="border-b">
                  <TabsList className="w-full justify-start rounded-none bg-transparent p-0">
                    <TabsTrigger 
                      value="recommendations" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500"
                    >
                      Recommendations ({recommendations.length})
                    </TabsTrigger>
                    <TabsTrigger 
                      value="matches" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500"
                    >
                      Protocol Matches ({matches.length})
                    </TabsTrigger>
                    <TabsTrigger 
                      value="comparison" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500"
                    >
                      Comparison ({selectedProtocols.length})
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="recommendations" className="p-6">
                  {recommendations.length > 0 ? (
                    <ScrollArea className="h-[600px]">
                      <div className="grid gap-4">
                        {recommendations.map((recommendation) => (
                          <RecommendationCard
                            key={recommendation.id}
                            recommendation={recommendation}
                          />
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="text-center py-12">
                      <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        No Recommendations Yet
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Click "Generate Recommendations" to analyze treatment options
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="matches" className="p-6">
                  {matches.length > 0 ? (
                    <ScrollArea className="h-[600px]">
                      <div className="grid gap-4">
                        {matches.map((match, index) => (
                          <ProtocolMatchCard
                            key={`${match.protocol.id}-${index}`}
                            match={match}
                          />
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="text-center py-12">
                      <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        No Protocol Matches
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Generate recommendations to see detailed protocol matches
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="comparison" className="p-6">
                  {hasComparison ? (
                    <div className="text-center py-12">
                      <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Protocol Comparison
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Comparing {selectedProtocols.length} protocols
                      </p>
                      <div className="mt-4">
                        <Button variant="outline" onClick={() => removeFromComparison('')}>
                          Clear Comparison
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        No Protocols Selected
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Add protocols to comparison using the "Compare" button
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Last Updated */}
          {lastUpdated && (
            <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Last updated: {lastUpdated.toLocaleString()}
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!hasResults && !isGenerating && !error && (
        <Card>
          <CardContent className="text-center py-12">
            <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
              Advanced Treatment Recommendations
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Provide patient information and generate evidence-based treatment recommendations 
              using our sophisticated protocol matching engine.
            </p>
            {patient && (
              <Button
                onClick={handleGenerateRecommendations}
                disabled={!canGenerate}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Zap className="w-5 h-5 mr-2" />
                Start Analysis
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TreatmentRecommendationEngine;
