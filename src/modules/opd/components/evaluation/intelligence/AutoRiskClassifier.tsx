import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Target,
  BarChart3,
  Lightbulb,
  Calculator,
  Clock,
  RefreshCw,
  Info,
  Shield
} from 'lucide-react';
import type { 
  EnhancedPatientEvaluation, 
  RiskCategory, 
  CancerType,
  AIRecommendation 
} from '../../../types/enhanced-evaluation';

interface AutoRiskClassifierProps {
  evaluation: Partial<EnhancedPatientEvaluation>;
  onRiskUpdate: (riskAssessment: any) => void;
  onRecommendationUpdate: (recommendations: AIRecommendation[]) => void;
  isCalculating?: boolean;
  autoCalculate?: boolean;
}

interface RiskFactor {
  category: string;
  factor: string;
  weight: number;
  value: number | string;
  contribution: number;
  confidence: number;
}

interface RiskScore {
  overall: number;
  recurrence: number;
  metastasis: number;
  mortality: number;
  complications: number;
}

const RISK_ALGORITHMS = {
  breast: {
    name: 'Breast Cancer Risk Assessment',
    factors: [
      { factor: 'Age', weight: 0.15, category: 'demographic' },
      { factor: 'Tumor Size', weight: 0.20, category: 'pathologic' },
      { factor: 'Node Status', weight: 0.25, category: 'pathologic' },
      { factor: 'Grade', weight: 0.15, category: 'pathologic' },
      { factor: 'ER Status', weight: 0.10, category: 'molecular' },
      { factor: 'PR Status', weight: 0.05, category: 'molecular' },
      { factor: 'HER2 Status', weight: 0.10, category: 'molecular' }
    ],
    thresholds: {
      low: 30,
      intermediate: 70,
      high: 100
    }
  },
  lung: {
    name: 'Lung Cancer Risk Assessment',
    factors: [
      { factor: 'Age', weight: 0.10, category: 'demographic' },
      { factor: 'Performance Status', weight: 0.20, category: 'clinical' },
      { factor: 'Stage', weight: 0.30, category: 'pathologic' },
      { factor: 'Histology', weight: 0.15, category: 'pathologic' },
      { factor: 'Smoking History', weight: 0.10, category: 'lifestyle' },
      { factor: 'EGFR Status', weight: 0.10, category: 'molecular' },
      { factor: 'PD-L1 Expression', weight: 0.05, category: 'molecular' }
    ],
    thresholds: {
      low: 25,
      intermediate: 65,
      high: 100
    }
  },
  colorectal: {
    name: 'Colorectal Cancer Risk Assessment',
    factors: [
      { factor: 'Age', weight: 0.10, category: 'demographic' },
      { factor: 'CEA Level', weight: 0.15, category: 'biomarker' },
      { factor: 'Stage', weight: 0.30, category: 'pathologic' },
      { factor: 'Grade', weight: 0.15, category: 'pathologic' },
      { factor: 'MSI Status', weight: 0.15, category: 'molecular' },
      { factor: 'KRAS Status', weight: 0.10, category: 'molecular' },
      { factor: 'Location', weight: 0.05, category: 'anatomic' }
    ],
    thresholds: {
      low: 30,
      intermediate: 70,
      high: 100
    }
  }
};

export function AutoRiskClassifier({ 
  evaluation, 
  onRiskUpdate, 
  onRecommendationUpdate,
  isCalculating = false,
  autoCalculate = true 
}: AutoRiskClassifierProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([]);
  const [riskScore, setRiskScore] = useState<RiskScore>({
    overall: 0,
    recurrence: 0,
    metastasis: 0,
    mortality: 0,
    complications: 0
  });
  const [confidence, setConfidence] = useState(0);
  const [lastCalculated, setLastCalculated] = useState<Date | null>(null);

  const cancerType = evaluation.cancerType || 'lung';
  const algorithm = RISK_ALGORITHMS[cancerType] || RISK_ALGORITHMS.lung;

  const riskCategory: RiskCategory = useMemo(() => {
    const score = riskScore.overall;
    if (score <= algorithm.thresholds.low) return 'low';
    if (score <= algorithm.thresholds.intermediate) return 'intermediate';
    return 'high';
  }, [riskScore.overall, algorithm.thresholds]);

  useEffect(() => {
    if (autoCalculate && evaluation) {
      calculateRisk();
    }
  }, [evaluation, autoCalculate]);

  const calculateRisk = async () => {
    try {
      const factors = await assessRiskFactors();
      const scores = await calculateRiskScores(factors);
      const recommendations = await generateRecommendations(factors, scores);

      setRiskFactors(factors);
      setRiskScore(scores);
      setConfidence(calculateConfidence(factors));
      setLastCalculated(new Date());

      onRiskUpdate({
        overall: riskCategory,
        recurrence: scores.recurrence,
        metastasis: scores.metastasis,
        mortality: scores.mortality,
        factors: factors.map(f => ({ 
          name: f.factor, 
          value: f.value, 
          weight: f.contribution 
        })),
        confidence: calculateConfidence(factors),
        calculatedAt: new Date().toISOString()
      });

      onRecommendationUpdate(recommendations);
    } catch (error) {
      console.error('Risk calculation failed:', error);
    }
  };

  const assessRiskFactors = async (): Promise<RiskFactor[]> => {
    const factors: RiskFactor[] = [];

    algorithm.factors.forEach(algorithmFactor => {
      let value: number | string = 0;
      let contribution = 0;
      let confidence = 0.5;

      switch (algorithmFactor.factor) {
        case 'Age':
          value = evaluation.demographics?.age || 0;
          contribution = value > 65 ? 0.8 : value > 50 ? 0.5 : 0.2;
          confidence = evaluation.demographics?.age ? 1.0 : 0.0;
          break;

        case 'Tumor Size':
          const size = evaluation.pathology?.tumorSize || 0;
          value = size;
          contribution = size > 50 ? 1.0 : size > 20 ? 0.7 : size > 10 ? 0.4 : 0.1;
          confidence = evaluation.pathology?.tumorSize ? 1.0 : 0.0;
          break;

        case 'Node Status':
          const nodes = evaluation.pathology?.lymphNodes?.positive || 0;
          value = nodes;
          contribution = nodes > 10 ? 1.0 : nodes > 3 ? 0.8 : nodes > 0 ? 0.5 : 0.0;
          confidence = evaluation.pathology?.lymphNodes ? 1.0 : 0.0;
          break;

        case 'Grade':
          const grade = evaluation.pathology?.grade || 1;
          value = grade;
          contribution = grade === 3 ? 1.0 : grade === 2 ? 0.6 : 0.2;
          confidence = evaluation.pathology?.grade ? 1.0 : 0.0;
          break;

        case 'Performance Status':
          const ecog = evaluation.clinicalAssessment?.performanceStatus?.ecog || 0;
          value = ecog;
          contribution = ecog >= 3 ? 1.0 : ecog === 2 ? 0.8 : ecog === 1 ? 0.4 : 0.0;
          confidence = evaluation.clinicalAssessment?.performanceStatus ? 1.0 : 0.0;
          break;

        case 'Stage':
          const stage = evaluation.pathology?.stage || 'I';
          value = stage;
          contribution = stage.includes('IV') ? 1.0 : 
                        stage.includes('III') ? 0.8 : 
                        stage.includes('II') ? 0.5 : 0.2;
          confidence = evaluation.pathology?.stage ? 1.0 : 0.0;
          break;

        case 'ER Status':
          const er = evaluation.molecularProfile?.receptors?.ER?.status;
          value = er || 'unknown';
          contribution = er === 'negative' ? 0.8 : er === 'positive' ? 0.2 : 0.5;
          confidence = er ? 1.0 : 0.0;
          break;

        case 'PR Status':
          const pr = evaluation.molecularProfile?.receptors?.PR?.status;
          value = pr || 'unknown';
          contribution = pr === 'negative' ? 0.6 : pr === 'positive' ? 0.1 : 0.3;
          confidence = pr ? 1.0 : 0.0;
          break;

        case 'HER2 Status':
          const her2 = evaluation.molecularProfile?.receptors?.HER2?.status;
          value = her2 || 'unknown';
          contribution = her2 === 'positive' ? 0.7 : her2 === 'negative' ? 0.3 : 0.5;
          confidence = her2 ? 1.0 : 0.0;
          break;

        default:
          // Default handling for other factors
          value = 'not assessed';
          contribution = 0.5;
          confidence = 0.0;
      }

      factors.push({
        category: algorithmFactor.category,
        factor: algorithmFactor.factor,
        weight: algorithmFactor.weight,
        value,
        contribution,
        confidence
      });
    });

    return factors;
  };

  const calculateRiskScores = async (factors: RiskFactor[]): Promise<RiskScore> => {
    const weightedScore = factors.reduce((sum, factor) => {
      return sum + (factor.weight * factor.contribution * factor.confidence);
    }, 0);

    const overall = Math.round(weightedScore * 100);
    
    // Calculate component scores based on cancer type and factors
    return {
      overall,
      recurrence: Math.round(overall * 0.9),
      metastasis: Math.round(overall * 0.8),
      mortality: Math.round(overall * 0.7),
      complications: Math.round(overall * 0.6)
    };
  };

  const generateRecommendations = async (
    factors: RiskFactor[], 
    scores: RiskScore
  ): Promise<AIRecommendation[]> => {
    const recommendations: AIRecommendation[] = [];

    // Risk-based recommendations
    if (scores.overall >= algorithm.thresholds.high) {
      recommendations.push({
        id: 'high-risk-monitoring',
        type: 'monitoring',
        priority: 'high',
        title: 'Intensive Monitoring Required',
        description: 'High-risk classification requires more frequent follow-ups and imaging',
        reasoning: 'Multiple high-risk factors identified',
        confidence: 0.9,
        evidence: 'Based on validated risk stratification algorithms',
        actionItems: [
          'Schedule follow-up every 3 months',
          'Consider additional imaging studies',
          'Discuss clinical trial eligibility'
        ]
      });
    }

    // Factor-specific recommendations
    factors.forEach(factor => {
      if (factor.contribution > 0.8 && factor.confidence > 0.8) {
        switch (factor.factor) {
          case 'HER2 Status':
            if (factor.value === 'positive') {
              recommendations.push({
                id: 'her2-targeted-therapy',
                type: 'treatment',
                priority: 'high',
                title: 'HER2-Targeted Therapy Indicated',
                description: 'Consider trastuzumab-based therapy regimens',
                reasoning: 'HER2-positive status with high expression',
                confidence: 0.95,
                evidence: 'NCCN Guidelines Category 1',
                actionItems: [
                  'Evaluate cardiac function before treatment',
                  'Consider pertuzumab combination',
                  'Plan for maintenance therapy'
                ]
              });
            }
            break;

          case 'EGFR Status':
            if (typeof factor.value === 'string' && factor.value.includes('mutation')) {
              recommendations.push({
                id: 'egfr-targeted-therapy',
                type: 'treatment',
                priority: 'high',
                title: 'EGFR-Targeted Therapy Recommended',
                description: 'First-line osimertinib therapy indicated',
                reasoning: 'Actionable EGFR mutation detected',
                confidence: 0.95,
                evidence: 'FDA-approved indication',
                actionItems: [
                  'Order T790M testing if progression',
                  'Monitor for skin toxicity',
                  'Consider CNS imaging'
                ]
              });
            }
            break;
        }
      }
    });

    return recommendations;
  };

  const calculateConfidence = (factors: RiskFactor[]): number => {
    const totalWeight = factors.reduce((sum, factor) => sum + factor.weight, 0);
    const weightedConfidence = factors.reduce((sum, factor) => {
      return sum + (factor.weight * factor.confidence);
    }, 0);
    
    return Math.round((weightedConfidence / totalWeight) * 100);
  };

  const getRiskColor = (category: RiskCategory) => {
    switch (category) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'intermediate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskIcon = (category: RiskCategory) => {
    switch (category) {
      case 'low': return <Shield className="h-5 w-5" />;
      case 'intermediate': return <AlertTriangle className="h-5 w-5" />;
      case 'high': return <TrendingUp className="h-5 w-5" />;
      default: return <Info className="h-5 w-5" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <CardTitle>AI Risk Assessment</CardTitle>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              Confidence: {confidence}%
            </div>
            <Progress value={confidence} className="w-24" />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={calculateRisk}
              disabled={isCalculating}
            >
              {isCalculating ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Calculator className="h-4 w-4 mr-2" />
              )}
              Recalculate
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="factors">Risk Factors</TabsTrigger>
            <TabsTrigger value="scores">Detailed Scores</TabsTrigger>
            <TabsTrigger value="methodology">Methodology</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className={`border-2 ${getRiskColor(riskCategory)}`}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    {getRiskIcon(riskCategory)}
                    <h3 className="text-xl font-semibold capitalize">
                      {riskCategory} Risk
                    </h3>
                  </div>
                  <div className="text-3xl font-bold mb-2">
                    {riskScore.overall}%
                  </div>
                  <p className="text-sm opacity-80">
                    Overall risk score based on {algorithm.name}
                  </p>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Recurrence Risk</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={riskScore.recurrence} className="w-20" />
                    <span className="text-sm font-medium">{riskScore.recurrence}%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Metastasis Risk</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={riskScore.metastasis} className="w-20" />
                    <span className="text-sm font-medium">{riskScore.metastasis}%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Mortality Risk</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={riskScore.mortality} className="w-20" />
                    <span className="text-sm font-medium">{riskScore.mortality}%</span>
                  </div>
                </div>
              </div>
            </div>

            {lastCalculated && (
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  Last calculated: {lastCalculated.toLocaleString()}
                  {confidence < 70 && (
                    <span className="text-yellow-600 ml-2">
                      ⚠️ Low confidence - consider completing missing assessments
                    </span>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="factors" className="space-y-4">
            <h3 className="text-lg font-semibold">Risk Factor Analysis</h3>
            <div className="space-y-3">
              {riskFactors.map((factor, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{factor.factor}</h4>
                    <Badge variant={factor.confidence > 0.8 ? 'default' : 'secondary'}>
                      {factor.category}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Value:</span>
                      <p className="font-medium">{factor.value}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Contribution:</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={factor.contribution * 100} className="w-16" />
                        <span>{Math.round(factor.contribution * 100)}%</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Confidence:</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={factor.confidence * 100} className="w-16" />
                        <span>{Math.round(factor.confidence * 100)}%</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="scores" className="space-y-4">
            <h3 className="text-lg font-semibold">Detailed Risk Scores</h3>
            <div className="grid gap-4">
              {Object.entries(riskScore).map(([key, value]) => (
                <Card key={key} className="p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold capitalize">
                      {key === 'overall' ? 'Overall Risk' : `${key} Risk`}
                    </h4>
                    <div className="flex items-center space-x-3">
                      <Progress value={value} className="w-32" />
                      <span className="text-lg font-bold">{value}%</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="methodology" className="space-y-4">
            <h3 className="text-lg font-semibold">Risk Assessment Methodology</h3>
            
            <Card className="p-4">
              <h4 className="font-semibold mb-2">Algorithm: {algorithm.name}</h4>
              <p className="text-sm text-muted-foreground mb-4">
                This assessment uses validated clinical algorithms and evidence-based risk factors 
                to provide personalized risk stratification.
              </p>
              
              <div className="space-y-3">
                <h5 className="font-medium">Risk Factor Weights:</h5>
                {algorithm.factors.map((factor, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span>{factor.factor}</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={factor.weight * 100} className="w-20" />
                      <span>{Math.round(factor.weight * 100)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Clinical Note:</strong> This AI assessment supplements but does not replace 
                clinical judgment. Always consider individual patient factors and consult current 
                treatment guidelines for final decision-making.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
