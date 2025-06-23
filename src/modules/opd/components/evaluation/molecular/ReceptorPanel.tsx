import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, TrendingDown, AlertTriangle, Info, Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReceptorStatus, CancerType } from '../../../types/enhanced-evaluation';

interface ReceptorPanelProps {
  cancerType: CancerType;
  value: ReceptorStatus;
  onChange: (status: ReceptorStatus) => void;
  showTreatmentImplications?: boolean;
  showScoring?: boolean;
  disabled?: boolean;
  className?: string;
}

interface ReceptorInfo {
  name: string;
  fullName: string;
  description: string;
  clinicalSignificance: string;
  targetedTherapies: string[];
  prognosticValue: 'positive' | 'negative' | 'mixed' | 'unknown';
  scoringMethod?: string;
  cutoffValues?: {
    positive: string;
    negative: string;
  };
}

const receptorConfigs: Record<CancerType, Record<string, ReceptorInfo>> = {
  breast: {
    er: {
      name: 'ER',
      fullName: 'Estrogen Receptor',
      description: 'Nuclear hormone receptor that binds estrogen',
      clinicalSignificance: 'Predicts response to endocrine therapy',
      targetedTherapies: ['Tamoxifen', 'Aromatase inhibitors', 'Fulvestrant', 'CDK4/6 inhibitors'],
      prognosticValue: 'positive',
      scoringMethod: 'Allred Score or H-score',
      cutoffValues: {
        positive: '≥1% nuclear staining',
        negative: '<1% nuclear staining'
      }
    },
    pr: {
      name: 'PR',
      fullName: 'Progesterone Receptor',
      description: 'Nuclear hormone receptor that binds progesterone',
      clinicalSignificance: 'Refines endocrine therapy prediction, especially when ER positive',
      targetedTherapies: ['Endocrine therapy (synergistic with ER)'],
      prognosticValue: 'positive',
      scoringMethod: 'Allred Score or H-score',
      cutoffValues: {
        positive: '≥1% nuclear staining',
        negative: '<1% nuclear staining'
      }
    },
    her2: {
      name: 'HER2',
      fullName: 'Human Epidermal Growth Factor Receptor 2',
      description: 'Transmembrane tyrosine kinase receptor',
      clinicalSignificance: 'Predicts response to HER2-targeted therapy',
      targetedTherapies: ['Trastuzumab', 'Pertuzumab', 'T-DM1', 'T-DXd', 'Neratinib'],
      prognosticValue: 'mixed',
      scoringMethod: 'IHC (0, 1+, 2+, 3+) and/or ISH',
      cutoffValues: {
        positive: 'IHC 3+ or ISH amplified',
        negative: 'IHC 0/1+ and ISH not amplified'
      }
    }
  },
  prostate: {
    ar: {
      name: 'AR',
      fullName: 'Androgen Receptor',
      description: 'Nuclear hormone receptor that binds androgens',
      clinicalSignificance: 'Key driver in prostate cancer, target for therapy',
      targetedTherapies: ['Enzalutamide', 'Abiraterone', 'Apalutamide', 'Darolutamide'],
      prognosticValue: 'mixed',
      scoringMethod: 'Percentage and intensity',
      cutoffValues: {
        positive: '>90% nuclear staining',
        negative: '<10% nuclear staining'
      }
    }
  },
  // Add more cancer types as needed
} as Record<CancerType, Record<string, ReceptorInfo>>;

const getStatusColor = (status: string) => {
  switch (status) {
    case 'positive':
      return { color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' };
    case 'negative':
      return { color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' };
    case 'equivocal':
      return { color: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200' };
    default:
      return { color: 'text-gray-700', bg: 'bg-gray-50', border: 'border-gray-200' };
  }
};

const getIntensityColor = (intensity: string) => {
  switch (intensity) {
    case 'strong':
      return 'text-green-700';
    case 'moderate':
      return 'text-yellow-700';
    case 'weak':
      return 'text-orange-700';
    default:
      return 'text-gray-700';
  }
};

const calculateHScore = (percentage: number, intensity: string): number => {
  const intensityValues = { weak: 1, moderate: 2, strong: 3 };
  const intensityValue = intensityValues[intensity as keyof typeof intensityValues] || 0;
  return (percentage * intensityValue) / 100 * 300; // H-score ranges 0-300
};

const interpretHScore = (hScore: number): { interpretation: string; status: string } => {
  if (hScore >= 200) return { interpretation: 'Strong positive', status: 'positive' };
  if (hScore >= 100) return { interpretation: 'Moderate positive', status: 'positive' };
  if (hScore >= 1) return { interpretation: 'Weak positive', status: 'positive' };
  return { interpretation: 'Negative', status: 'negative' };
};

const getTripleNegativeStatus = (receptors: ReceptorStatus): boolean => {
  return (
    receptors.er?.status === 'negative' &&
    receptors.pr?.status === 'negative' &&
    receptors.her2?.status === 'negative'
  );
};

const getLuminalSubtype = (receptors: ReceptorStatus): string => {
  const isERPos = receptors.er?.status === 'positive';
  const isPRPos = receptors.pr?.status === 'positive';
  const isHER2Pos = receptors.her2?.status === 'positive';
  
  if (!isERPos && !isPRPos && !isHER2Pos) return 'Triple Negative';
  if (!isERPos && !isPRPos && isHER2Pos) return 'HER2-enriched';
  if (isERPos && isHER2Pos) return 'Luminal B (HER2+)';
  if (isERPos && isPRPos) return 'Luminal A';
  if (isERPos && !isPRPos) return 'Luminal B (HER2-)';
  
  return 'Unknown';
};

export const ReceptorPanel: React.FC<ReceptorPanelProps> = ({
  cancerType,
  value,
  onChange,
  showTreatmentImplications = true,
  showScoring = true,
  disabled = false,
  className
}) => {
  const [activeTab, setActiveTab] = useState('receptors');
  const [calculatedScores, setCalculatedScores] = useState<Record<string, number>>({});
  
  const availableReceptors = receptorConfigs[cancerType] || {};
  const receptorKeys = Object.keys(availableReceptors);
  
  useEffect(() => {
    // Calculate H-scores for receptors with percentage and intensity
    const scores: Record<string, number> = {};
    receptorKeys.forEach(key => {
      const receptor = value[key as keyof ReceptorStatus];
      if (receptor?.percentage && receptor?.intensity) {
        scores[key] = calculateHScore(receptor.percentage, receptor.intensity);
      }
    });
    setCalculatedScores(scores);
  }, [value, receptorKeys]);
  
  const handleReceptorChange = (
    receptorKey: string,
    field: 'status' | 'percentage' | 'intensity',
    newValue: any
  ) => {
    const currentReceptor = value[receptorKey as keyof ReceptorStatus] || {};
    
    onChange({
      ...value,
      [receptorKey]: {
        ...currentReceptor,
        [field]: newValue
      }
    });
  };
  
  const handleNotesChange = (receptorKey: string, notes: string) => {
    const currentReceptor = value[receptorKey as keyof ReceptorStatus] || {};
    
    onChange({
      ...value,
      [receptorKey]: {
        ...currentReceptor,
        notes
      }
    });
  };
  
  const renderReceptorCard = (receptorKey: string, receptorInfo: ReceptorInfo) => {
    const receptor = value[receptorKey as keyof ReceptorStatus] || {};
    const statusConfig = getStatusColor(receptor.status || 'unknown');
    const hScore = calculatedScores[receptorKey];
    const hScoreInterpretation = hScore ? interpretHScore(hScore) : null;
    
    return (
      <Card key={receptorKey} className="w-full">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>{receptorInfo.fullName} ({receptorInfo.name})</span>
            </div>
            
            {receptor.status && (
              <Badge 
                variant="outline" 
                className={cn('text-xs', statusConfig.color, statusConfig.bg)}
              >
                {receptor.status}
              </Badge>
            )}
          </CardTitle>
          <CardDescription className="text-xs">
            {receptorInfo.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Status Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select
              value={receptor.status || ''}
              onValueChange={(val) => handleReceptorChange(receptorKey, 'status', val)}
              disabled={disabled}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="negative">Negative</SelectItem>
                <SelectItem value="equivocal">Equivocal</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Percentage and Intensity for positive cases */}
          {receptor.status === 'positive' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Percentage (%)</label>
                  <div className="space-y-2">
                    <Slider
                      value={[receptor.percentage || 0]}
                      onValueChange={(val) => handleReceptorChange(receptorKey, 'percentage', val[0])}
                      min={0}
                      max={100}
                      step={5}
                      disabled={disabled}
                      className="w-full"
                    />
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={receptor.percentage || ''}
                      onChange={(e) => handleReceptorChange(receptorKey, 'percentage', parseInt(e.target.value))}
                      disabled={disabled}
                      className="h-8"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Intensity</label>
                  <Select
                    value={receptor.intensity || ''}
                    onValueChange={(val) => handleReceptorChange(receptorKey, 'intensity', val)}
                    disabled={disabled}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select intensity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weak">
                        <span className={getIntensityColor('weak')}>Weak (1+)</span>
                      </SelectItem>
                      <SelectItem value="moderate">
                        <span className={getIntensityColor('moderate')}>Moderate (2+)</span>
                      </SelectItem>
                      <SelectItem value="strong">
                        <span className={getIntensityColor('strong')}>Strong (3+)</span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* H-Score Calculation */}
              {hScore && showScoring && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calculator className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">H-Score</span>
                    </div>
                    <Badge variant="outline" className="text-blue-700">
                      {Math.round(hScore)}
                    </Badge>
                  </div>
                  {hScoreInterpretation && (
                    <p className="text-xs text-blue-700 mt-1">
                      {hScoreInterpretation.interpretation}
                    </p>
                  )}
                </div>
              )}
            </>
          )}
          
          {/* Clinical Significance */}
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <h5 className="text-xs font-medium text-gray-900 mb-1">Clinical Significance</h5>
            <p className="text-xs text-gray-700">{receptorInfo.clinicalSignificance}</p>
          </div>
          
          {/* Treatment Implications */}
          {showTreatmentImplications && receptor.status === 'positive' && (
            <div className="space-y-2">
              <h5 className="text-xs font-medium text-gray-900">Targeted Therapies</h5>
              <div className="flex flex-wrap gap-1">
                {receptorInfo.targetedTherapies.map((therapy, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {therapy}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>
            <Textarea
              value={receptor.notes || ''}
              onChange={(e) => handleNotesChange(receptorKey, e.target.value)}
              placeholder={`Additional findings for ${receptorInfo.name}...`}
              disabled={disabled}
              rows={2}
              className="text-xs"
            />
          </div>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="h-5 w-5" />
          <span>Receptor Status</span>
          {cancerType === 'breast' && (
            <Badge variant="outline" className="text-xs">
              {getLuminalSubtype(value)}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Immunohistochemical analysis of hormone and growth factor receptors
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="receptors">Receptors</TabsTrigger>
            <TabsTrigger value="interpretation">Interpretation</TabsTrigger>
            <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
          </TabsList>
          
          <TabsContent value="receptors" className="space-y-4">
            {receptorKeys.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {receptorKeys.map(key => 
                  renderReceptorCard(key, availableReceptors[key])
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No receptor configuration available for {cancerType} cancer</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="interpretation" className="space-y-4">
            {cancerType === 'breast' && (
              <div className="space-y-4">
                {/* Triple Negative Status */}
                {getTripleNegativeStatus(value) && (
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-purple-600" />
                      <h4 className="font-medium text-purple-900">Triple Negative Breast Cancer</h4>
                    </div>
                    <p className="text-sm text-purple-700 mt-2">
                      This tumor is negative for ER, PR, and HER2. Consider immunotherapy options and BRCA testing.
                    </p>
                  </div>
                )}
                
                {/* Luminal Subtype */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Molecular Subtype</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">{getLuminalSubtype(value)}</span>
                    <Badge variant="outline" className="text-blue-700">
                      {getLuminalSubtype(value)}
                    </Badge>
                  </div>
                </div>
                
                {/* Treatment Recommendations */}
                <div className="space-y-3">
                  <h4 className="font-medium">Treatment Implications</h4>
                  
                  {value.er?.status === 'positive' && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-900">Endocrine Therapy Candidate</span>
                      </div>
                      <ul className="text-xs text-green-700 space-y-1">
                        <li>• Consider tamoxifen or aromatase inhibitors</li>
                        <li>• Evaluate for CDK4/6 inhibitor combination</li>
                        <li>• Duration typically 5-10 years</li>
                      </ul>
                    </div>
                  )}
                  
                  {value.her2?.status === 'positive' && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Target className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">HER2-Targeted Therapy</span>
                      </div>
                      <ul className="text-xs text-blue-700 space-y-1">
                        <li>• Trastuzumab-based regimens</li>
                        <li>• Consider dual HER2 blockade</li>
                        <li>• Monitor for cardiotoxicity</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {Object.keys(availableReceptors).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Interpretation guidelines not available for {cancerType} cancer</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="guidelines" className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium">Testing Guidelines</h4>
              
              {cancerType === 'breast' && (
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h5 className="text-sm font-medium">ASCO/CAP Guidelines</h5>
                    <ul className="text-xs text-gray-600 mt-1 space-y-1">
                      <li>• ER/PR: ≥1% nuclear staining = positive</li>
                      <li>• HER2 IHC: 0/1+ = negative, 3+ = positive, 2+ = equivocal (requires ISH)</li>
                      <li>• HER2 ISH: Ratio ≥2.0 or average HER2 signals ≥6.0 = amplified</li>
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <Info className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <div className="text-sm text-yellow-800">
                        <strong>Quality Requirements:</strong> Testing should be performed on adequately fixed specimens 
                        with appropriate controls and validated antibodies.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ReceptorPanel;
