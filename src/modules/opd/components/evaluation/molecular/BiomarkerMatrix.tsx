import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  BarChart3,
  Calendar,
  Target,
  FileBarChart,
  Download,
  RefreshCw,
  Info
} from 'lucide-react';
import type { BiomarkerProfile, CancerType } from '../../../types/enhanced-evaluation';

interface BiomarkerMatrixProps {
  cancerType: CancerType;
  biomarkers: BiomarkerProfile;
  onBiomarkerChange: (biomarkers: BiomarkerProfile) => void;
  isReadOnly?: boolean;
  showTrends?: boolean;
}

const BIOMARKER_DEFINITIONS = {
  // General Biomarkers
  'CEA': {
    name: 'Carcinoembryonic Antigen',
    normalRange: '<3.0 ng/mL',
    cancers: ['colorectal', 'lung', 'breast', 'gastric'],
    significance: 'Monitor treatment response and recurrence'
  },
  'CA 19-9': {
    name: 'Cancer Antigen 19-9',
    normalRange: '<37 U/mL',
    cancers: ['pancreatic', 'biliary', 'gastric'],
    significance: 'Pancreatic cancer monitoring'
  },
  'CA 125': {
    name: 'Cancer Antigen 125',
    normalRange: '<35 U/mL',
    cancers: ['ovarian', 'endometrial', 'fallopian'],
    significance: 'Ovarian cancer screening and monitoring'
  },
  'CA 15-3': {
    name: 'Cancer Antigen 15-3',
    normalRange: '<30 U/mL',
    cancers: ['breast'],
    significance: 'Breast cancer monitoring'
  },
  'CA 27.29': {
    name: 'Cancer Antigen 27.29',
    normalRange: '<38 U/mL',
    cancers: ['breast'],
    significance: 'Breast cancer monitoring (alternative to CA 15-3)'
  },
  'AFP': {
    name: 'Alpha-fetoprotein',
    normalRange: '<10 ng/mL',
    cancers: ['liver', 'testicular', 'ovarian'],
    significance: 'Hepatocellular carcinoma and germ cell tumors'
  },
  'PSA': {
    name: 'Prostate-Specific Antigen',
    normalRange: '<4.0 ng/mL',
    cancers: ['prostate'],
    significance: 'Prostate cancer screening and monitoring'
  },
  'β-hCG': {
    name: 'Beta Human Chorionic Gonadotropin',
    normalRange: '<2 mIU/mL',
    cancers: ['testicular', 'ovarian', 'gestational'],
    significance: 'Germ cell and gestational trophoblastic tumors'
  },
  'LDH': {
    name: 'Lactate Dehydrogenase',
    normalRange: '140-280 U/L',
    cancers: ['lymphoma', 'testicular', 'melanoma'],
    significance: 'Tumor burden indicator'
  },
  // Breast Cancer Specific
  'Estrogen Receptor': {
    name: 'Estrogen Receptor',
    normalRange: 'Positive >1%',
    cancers: ['breast'],
    significance: 'Endocrine therapy target'
  },
  'Progesterone Receptor': {
    name: 'Progesterone Receptor',
    normalRange: 'Positive >1%',
    cancers: ['breast'],
    significance: 'Endocrine therapy predictor'
  },
  'HER2': {
    name: 'Human Epidermal Growth Factor Receptor 2',
    normalRange: 'Negative (0-1+)',
    cancers: ['breast', 'gastric'],
    significance: 'Targeted therapy target'
  },
  'Ki-67': {
    name: 'Ki-67 Proliferation Index',
    normalRange: '<20% (low)',
    cancers: ['breast', 'lymphoma'],
    significance: 'Proliferation marker'
  },
  // Lung Cancer Specific
  'CYFRA 21-1': {
    name: 'Cytokeratin Fragment 21-1',
    normalRange: '<3.3 ng/mL',
    cancers: ['lung'],
    significance: 'NSCLC monitoring'
  },
  'SCC': {
    name: 'Squamous Cell Carcinoma Antigen',
    normalRange: '<1.5 ng/mL',
    cancers: ['lung', 'cervical'],
    significance: 'Squamous cell carcinoma monitoring'
  },
  'NSE': {
    name: 'Neuron-Specific Enolase',
    normalRange: '<16.3 ng/mL',
    cancers: ['lung', 'neuroendocrine'],
    significance: 'Small cell lung cancer monitoring'
  },
  'ProGRP': {
    name: 'Pro-gastrin-releasing Peptide',
    normalRange: '<81 pg/mL',
    cancers: ['lung'],
    significance: 'Small cell lung cancer specific'
  }
};

const CANCER_BIOMARKER_PANELS = {
  breast: [
    'CEA', 'CA 15-3', 'CA 27.29', 'Estrogen Receptor', 'Progesterone Receptor', 
    'HER2', 'Ki-67', 'LDH'
  ],
  lung: [
    'CEA', 'CYFRA 21-1', 'SCC', 'NSE', 'ProGRP', 'LDH'
  ],
  colorectal: [
    'CEA', 'CA 19-9', 'LDH'
  ],
  prostate: [
    'PSA', 'LDH'
  ],
  ovarian: [
    'CA 125', 'β-hCG', 'AFP', 'LDH'
  ],
  pancreatic: [
    'CA 19-9', 'CEA', 'LDH'
  ],
  liver: [
    'AFP', 'CEA', 'LDH'
  ],
  testicular: [
    'AFP', 'β-hCG', 'LDH'
  ]
};

export function BiomarkerMatrix({ 
  cancerType, 
  biomarkers, 
  onBiomarkerChange, 
  isReadOnly = false,
  showTrends = true 
}: BiomarkerMatrixProps) {
  const [activeTab, setActiveTab] = useState('current');
  const [selectedBiomarker, setSelectedBiomarker] = useState<string | null>(null);

  const relevantBiomarkers = useMemo(() => {
    return CANCER_BIOMARKER_PANELS[cancerType] || CANCER_BIOMARKER_PANELS.lung;
  }, [cancerType]);

  const completionRate = useMemo(() => {
    const totalBiomarkers = relevantBiomarkers.length;
    const completedBiomarkers = Object.keys(biomarkers.current || {}).length;
    return Math.round((completedBiomarkers / totalBiomarkers) * 100);
  }, [relevantBiomarkers, biomarkers.current]);

  const updateBiomarker = (biomarker: string, field: string, value: any) => {
    if (isReadOnly) return;

    const updatedBiomarkers = {
      ...biomarkers,
      current: {
        ...biomarkers.current,
        [biomarker]: {
          ...biomarkers.current?.[biomarker],
          [field]: value
        }
      }
    };

    onBiomarkerChange(updatedBiomarkers);
  };

  const getBiomarkerStatus = (biomarker: string) => {
    const data = biomarkers.current?.[biomarker];
    if (!data || data.value === undefined || data.value === null) return 'pending';
    
    const definition = BIOMARKER_DEFINITIONS[biomarker];
    if (!definition) return 'unknown';

    // Simple range checking (would need more sophisticated logic for real implementation)
    const normalRange = definition.normalRange;
    if (normalRange.includes('<')) {
      const threshold = parseFloat(normalRange.replace(/[^\d.]/g, ''));
      return data.value <= threshold ? 'normal' : 'elevated';
    } else if (normalRange.includes('>')) {
      const threshold = parseFloat(normalRange.replace(/[^\d.]/g, ''));
      return data.value >= threshold ? 'positive' : 'negative';
    }
    
    return 'unknown';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'elevated': return 'bg-red-500';
      case 'normal': return 'bg-green-500';
      case 'positive': return 'bg-blue-500';
      case 'negative': return 'bg-gray-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'elevated': return <TrendingUp className="h-4 w-4" />;
      case 'normal': return <CheckCircle className="h-4 w-4" />;
      case 'positive': return <Target className="h-4 w-4" />;
      case 'negative': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <AlertTriangle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const calculateTrend = (biomarker: string) => {
    const history = biomarkers.history?.[biomarker];
    if (!history || history.length < 2) return null;

    const latest = history[history.length - 1];
    const previous = history[history.length - 2];
    
    if (latest.value > previous.value) return 'increasing';
    if (latest.value < previous.value) return 'decreasing';
    return 'stable';
  };

  const renderBiomarkerCard = (biomarkerKey: string) => {
    const definition = BIOMARKER_DEFINITIONS[biomarkerKey];
    const data = biomarkers.current?.[biomarkerKey];
    const status = getBiomarkerStatus(biomarkerKey);
    const trend = calculateTrend(biomarkerKey);

    if (!definition) return null;

    return (
      <Card 
        key={biomarkerKey}
        className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
          selectedBiomarker === biomarkerKey ? 'ring-2 ring-blue-500' : ''
        } ${status === 'elevated' ? 'border-red-200 bg-red-50' : ''}`}
        onClick={() => setSelectedBiomarker(selectedBiomarker === biomarkerKey ? null : biomarkerKey)}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">{biomarkerKey}</h3>
            <div className="flex items-center space-x-2">
              {trend && showTrends && (
                <div className={`flex items-center space-x-1 text-xs ${
                  trend === 'increasing' ? 'text-red-600' : 
                  trend === 'decreasing' ? 'text-green-600' : 'text-gray-600'
                }`}>
                  <TrendingUp className={`h-3 w-3 ${trend === 'decreasing' ? 'rotate-180' : ''}`} />
                  <span className="capitalize">{trend}</span>
                </div>
              )}
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs text-white ${getStatusColor(status)}`}>
                {getStatusIcon(status)}
                <span className="capitalize">{status}</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
            {definition.name}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Normal: {definition.normalRange}
            </span>
            {data?.value && (
              <span className="text-sm font-medium">
                {data.value} {data.unit || ''}
              </span>
            )}
          </div>

          {selectedBiomarker === biomarkerKey && (
            <div className="mt-4 space-y-3 border-t pt-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor={`${biomarkerKey}-value`}>Value</Label>
                  <Input
                    id={`${biomarkerKey}-value`}
                    type="number"
                    step="0.01"
                    value={data?.value || ''}
                    onChange={(e) => updateBiomarker(biomarkerKey, 'value', parseFloat(e.target.value))}
                    disabled={isReadOnly}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <Label htmlFor={`${biomarkerKey}-unit`}>Unit</Label>
                  <Input
                    id={`${biomarkerKey}-unit`}
                    value={data?.unit || ''}
                    onChange={(e) => updateBiomarker(biomarkerKey, 'unit', e.target.value)}
                    disabled={isReadOnly}
                    placeholder="ng/mL"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor={`${biomarkerKey}-date`}>Test Date</Label>
                <Input
                  id={`${biomarkerKey}-date`}
                  type="date"
                  value={data?.date || ''}
                  onChange={(e) => updateBiomarker(biomarkerKey, 'date', e.target.value)}
                  disabled={isReadOnly}
                />
              </div>

              <div>
                <Label htmlFor={`${biomarkerKey}-method`}>Method</Label>
                <select
                  id={`${biomarkerKey}-method`}
                  value={data?.method || ''}
                  onChange={(e) => updateBiomarker(biomarkerKey, 'method', e.target.value)}
                  disabled={isReadOnly}
                  className="w-full mt-1 p-2 border rounded-md"
                >
                  <option value="">Select method</option>
                  <option value="ELISA">ELISA</option>
                  <option value="CLIA">CLIA</option>
                  <option value="ECLIA">ECLIA</option>
                  <option value="RIA">RIA</option>
                  <option value="IHC">IHC</option>
                  <option value="FISH">FISH</option>
                  <option value="PCR">PCR</option>
                </select>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>Clinical Significance:</strong> {definition.significance}
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderTrendChart = (biomarkerKey: string) => {
    const history = biomarkers.history?.[biomarkerKey];
    if (!history || history.length === 0) return null;

    return (
      <Card key={biomarkerKey} className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{biomarkerKey} Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-24 flex items-end space-x-2">
            {history.slice(-6).map((point, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-blue-500 rounded-t"
                  style={{ 
                    height: `${Math.max(10, (point.value / Math.max(...history.map(h => h.value))) * 80)}px` 
                  }}
                />
                <div className="text-xs text-muted-foreground mt-1 transform -rotate-45">
                  {new Date(point.date).toLocaleDateString()}
                </div>
                <div className="text-xs font-medium">
                  {point.value}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-green-600" />
            <CardTitle>Biomarker Profile</CardTitle>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              Completion: {completionRate}%
            </div>
            <Progress value={completionRate} className="w-24" />
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="current">Current Values</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {cancerType.charAt(0).toUpperCase() + cancerType.slice(1)} Cancer Biomarkers
              </h3>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Results
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {relevantBiomarkers.map(renderBiomarkerCard)}
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            {showTrends ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Biomarker Trends</h3>
                {relevantBiomarkers
                  .filter(biomarker => biomarkers.history?.[biomarker]?.length > 0)
                  .map(renderTrendChart)}
                {Object.keys(biomarkers.history || {}).length === 0 && (
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Trend Data</h3>
                    <p className="text-muted-foreground">
                      Historical biomarker data will appear here as you add more test results.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Trends Disabled</h3>
                <p className="text-muted-foreground">
                  Enable trend analysis to view biomarker progression over time.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="summary" className="space-y-4">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Elevated Biomarkers</CardTitle>
                </CardHeader>
                <CardContent>
                  {relevantBiomarkers
                    .filter(biomarker => getBiomarkerStatus(biomarker) === 'elevated')
                    .map(biomarker => {
                      const data = biomarkers.current?.[biomarker];
                      return (
                        <div key={biomarker} className="flex items-center justify-between p-3 border rounded-lg mb-2">
                          <div>
                            <h4 className="font-semibold">{biomarker}</h4>
                            <p className="text-sm text-muted-foreground">
                              {BIOMARKER_DEFINITIONS[biomarker]?.name}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {data?.value} {data?.unit}
                            </p>
                            <Badge variant="destructive">Elevated</Badge>
                          </div>
                        </div>
                      );
                    })}
                  {relevantBiomarkers.filter(biomarker => getBiomarkerStatus(biomarker) === 'elevated').length === 0 && (
                    <p className="text-muted-foreground text-center py-4">No elevated biomarkers detected</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recent Changes</CardTitle>
                </CardHeader>
                <CardContent>
                  {relevantBiomarkers
                    .filter(biomarker => calculateTrend(biomarker) === 'increasing')
                    .map(biomarker => {
                      const data = biomarkers.current?.[biomarker];
                      const trend = calculateTrend(biomarker);
                      return (
                        <div key={biomarker} className="flex items-center justify-between p-3 border rounded-lg mb-2">
                          <div>
                            <h4 className="font-semibold">{biomarker}</h4>
                            <p className="text-sm text-muted-foreground">
                              Current: {data?.value} {data?.unit}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="h-4 w-4 text-red-500" />
                            <Badge variant="outline">Increasing</Badge>
                          </div>
                        </div>
                      );
                    })}
                  {relevantBiomarkers.filter(biomarker => calculateTrend(biomarker) === 'increasing').length === 0 && (
                    <p className="text-muted-foreground text-center py-4">No significant changes detected</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
