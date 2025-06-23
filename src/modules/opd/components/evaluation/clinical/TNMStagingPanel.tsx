import React, { useState, useEffect } from 'react';
import { Info, AlertTriangle, BookOpen, Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CancerType, TNMStage } from '../../../types/enhanced-evaluation';

interface TNMOption {
  value: string;
  label: string;
  description?: string;
  notes?: string;
}

interface TNMStagingConfig {
  tOptions: TNMOption[];
  nOptions: TNMOption[];
  mOptions: TNMOption[];
  stageGroups: Array<{
    stage: string;
    criteria: string;
    description: string;
    prognosis?: string;
  }>;
  version: string;
  guidelines?: Array<{
    title: string;
    url: string;
  }>;
}

interface TNMStagingPanelProps {
  cancerType: CancerType;
  value: TNMStage;
  onChange: (stage: TNMStage) => void;
  showGuidelines?: boolean;
  showCalculator?: boolean;
  disabled?: boolean;
  className?: string;
}

// TNM configurations for different cancer types
const tnmConfigs: Record<CancerType, TNMStagingConfig> = {
  breast: {
    version: 'AJCC 8th Edition',
    tOptions: [
      { value: 'Tis', label: 'Tis', description: 'Carcinoma in situ' },
      { value: 'T1', label: 'T1', description: '≤ 2 cm', notes: 'T1a: >0.1-0.5cm, T1b: >0.5-1cm, T1c: >1-2cm' },
      { value: 'T2', label: 'T2', description: '> 2-5 cm' },
      { value: 'T3', label: 'T3', description: '> 5 cm' },
      { value: 'T4', label: 'T4', description: 'Any size with extension', notes: 'T4a: chest wall, T4b: skin, T4c: both, T4d: inflammatory' }
    ],
    nOptions: [
      { value: 'N0', label: 'N0', description: 'No regional lymph node metastases' },
      { value: 'N1', label: 'N1', description: '1-3 axillary nodes or internal mammary nodes' },
      { value: 'N2', label: 'N2', description: '4-9 axillary nodes or clinically detected internal mammary nodes' },
      { value: 'N3', label: 'N3', description: '≥10 axillary nodes or infraclavicular/supraclavicular nodes' }
    ],
    mOptions: [
      { value: 'M0', label: 'M0', description: 'No clinical or radiographic distant metastases' },
      { value: 'M1', label: 'M1', description: 'Distant detectable metastases' }
    ],
    stageGroups: [
      { stage: 'Stage 0', criteria: 'Tis N0 M0', description: 'Carcinoma in situ', prognosis: 'Excellent' },
      { stage: 'Stage IA', criteria: 'T1 N0 M0', description: 'Small invasive tumor, no nodes', prognosis: 'Excellent' },
      { stage: 'Stage IB', criteria: 'T0-1 N1mi M0', description: 'Micrometastases in nodes', prognosis: 'Very good' },
      { stage: 'Stage IIA', criteria: 'T0-1 N1 M0 or T2 N0 M0', description: 'Small tumor with nodes or larger tumor without nodes', prognosis: 'Good' },
      { stage: 'Stage IIB', criteria: 'T2 N1 M0 or T3 N0 M0', description: 'Moderate size with involvement', prognosis: 'Good' },
      { stage: 'Stage IIIA', criteria: 'T0-3 N2 M0 or T3 N1 M0', description: 'Locally advanced disease', prognosis: 'Fair' },
      { stage: 'Stage IIIB', criteria: 'T4 N0-2 M0', description: 'Tumor extension to chest wall or skin', prognosis: 'Fair' },
      { stage: 'Stage IIIC', criteria: 'Any T N3 M0', description: 'Extensive nodal involvement', prognosis: 'Fair' },
      { stage: 'Stage IV', criteria: 'Any T Any N M1', description: 'Distant metastases', prognosis: 'Variable' }
    ],
    guidelines: [
      { title: 'NCCN Breast Cancer Guidelines', url: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1419' },
      { title: 'AJCC Cancer Staging Manual', url: 'https://cancerstaging.org/' }
    ]
  },
  lung: {
    version: 'AJCC 8th Edition',
    tOptions: [
      { value: 'Tis', label: 'Tis', description: 'Carcinoma in situ' },
      { value: 'T1', label: 'T1', description: '≤ 3 cm', notes: 'T1a: ≤1cm, T1b: >1-2cm, T1c: >2-3cm' },
      { value: 'T2', label: 'T2', description: '> 3-5 cm or involves main bronchus', notes: 'T2a: >3-4cm, T2b: >4-5cm' },
      { value: 'T3', label: 'T3', description: '> 5-7 cm or separate nodules in same lobe' },
      { value: 'T4', label: 'T4', description: '> 7 cm or invasion of critical structures' }
    ],
    nOptions: [
      { value: 'N0', label: 'N0', description: 'No regional lymph node metastases' },
      { value: 'N1', label: 'N1', description: 'Ipsilateral peribronchial/hilar nodes' },
      { value: 'N2', label: 'N2', description: 'Ipsilateral mediastinal/subcarinal nodes' },
      { value: 'N3', label: 'N3', description: 'Contralateral mediastinal/hilar or scalene/supraclavicular nodes' }
    ],
    mOptions: [
      { value: 'M0', label: 'M0', description: 'No distant metastases' },
      { value: 'M1a', label: 'M1a', description: 'Separate nodules in contralateral lobe or pleural/pericardial nodules' },
      { value: 'M1b', label: 'M1b', description: 'Single extrathoracic metastasis' },
      { value: 'M1c', label: 'M1c', description: 'Multiple extrathoracic metastases' }
    ],
    stageGroups: [
      { stage: 'Stage 0', criteria: 'Tis N0 M0', description: 'Carcinoma in situ', prognosis: 'Excellent' },
      { stage: 'Stage IA1', criteria: 'T1a N0 M0', description: 'Very small tumor', prognosis: 'Excellent' },
      { stage: 'Stage IA2', criteria: 'T1b N0 M0', description: 'Small tumor', prognosis: 'Excellent' },
      { stage: 'Stage IA3', criteria: 'T1c N0 M0', description: 'Small tumor', prognosis: 'Very good' },
      { stage: 'Stage IB', criteria: 'T2a N0 M0', description: 'Moderate size tumor', prognosis: 'Good' },
      { stage: 'Stage IIA', criteria: 'T2b N0 M0', description: 'Larger tumor without nodes', prognosis: 'Good' },
      { stage: 'Stage IIB', criteria: 'T1-2 N1 M0 or T3 N0 M0', description: 'Regional node involvement', prognosis: 'Fair' },
      { stage: 'Stage IIIA', criteria: 'T1-4 N2 M0 or T3-4 N1 M0', description: 'Locally advanced', prognosis: 'Fair' },
      { stage: 'Stage IIIB', criteria: 'T1-4 N3 M0 or T4 N0-2 M0', description: 'Locally advanced', prognosis: 'Poor' },
      { stage: 'Stage IIIC', criteria: 'T3-4 N3 M0', description: 'Locally advanced', prognosis: 'Poor' },
      { stage: 'Stage IVA', criteria: 'Any T Any N M1a-b', description: 'Limited distant metastases', prognosis: 'Poor' },
      { stage: 'Stage IVB', criteria: 'Any T Any N M1c', description: 'Extensive distant metastases', prognosis: 'Poor' }
    ],
    guidelines: [
      { title: 'NCCN Lung Cancer Guidelines', url: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1450' },
      { title: 'IASLC Staging Manual', url: 'https://www.iaslc.org/staging' }
    ]
  },
  // Add more cancer types as needed
  colorectal: {
    version: 'AJCC 8th Edition',
    tOptions: [
      { value: 'Tis', label: 'Tis', description: 'Carcinoma in situ' },
      { value: 'T1', label: 'T1', description: 'Submucosa invasion' },
      { value: 'T2', label: 'T2', description: 'Muscularis propria invasion' },
      { value: 'T3', label: 'T3', description: 'Subserosa or non-peritoneal tissues' },
      { value: 'T4', label: 'T4', description: 'Adjacent organs or visceral peritoneum', notes: 'T4a: visceral peritoneum, T4b: adjacent organs' }
    ],
    nOptions: [
      { value: 'N0', label: 'N0', description: 'No regional lymph node metastases' },
      { value: 'N1', label: 'N1', description: '1-3 regional lymph nodes', notes: 'N1a: 1 node, N1b: 2-3 nodes, N1c: tumor deposits' },
      { value: 'N2', label: 'N2', description: '4 or more regional lymph nodes', notes: 'N2a: 4-6 nodes, N2b: ≥7 nodes' }
    ],
    mOptions: [
      { value: 'M0', label: 'M0', description: 'No distant metastases' },
      { value: 'M1', label: 'M1', description: 'Distant metastases', notes: 'M1a: one organ, M1b: >1 organ, M1c: peritoneal surface' }
    ],
    stageGroups: [
      { stage: 'Stage 0', criteria: 'Tis N0 M0', description: 'Carcinoma in situ', prognosis: 'Excellent' },
      { stage: 'Stage I', criteria: 'T1-2 N0 M0', description: 'Early invasive cancer', prognosis: 'Excellent' },
      { stage: 'Stage IIA', criteria: 'T3 N0 M0', description: 'Locally advanced without nodes', prognosis: 'Good' },
      { stage: 'Stage IIB', criteria: 'T4a N0 M0', description: 'Peritoneal involvement', prognosis: 'Good' },
      { stage: 'Stage IIC', criteria: 'T4b N0 M0', description: 'Adjacent organ involvement', prognosis: 'Fair' },
      { stage: 'Stage IIIA', criteria: 'T1-2 N1-2 M0 or T1 N2a M0', description: 'Node positive disease', prognosis: 'Fair' },
      { stage: 'Stage IIIB', criteria: 'T3-4a N1 M0 or T2-3 N2a M0 or T1-2 N2b M0', description: 'Advanced node positive', prognosis: 'Fair' },
      { stage: 'Stage IIIC', criteria: 'T4a N2 M0 or T3-4a N2b M0 or T4b N1-2 M0', description: 'Extensive local/regional disease', prognosis: 'Poor' },
      { stage: 'Stage IVA', criteria: 'Any T Any N M1a', description: 'Limited distant metastases', prognosis: 'Poor' },
      { stage: 'Stage IVB', criteria: 'Any T Any N M1b', description: 'Multiple distant metastases', prognosis: 'Poor' },
      { stage: 'Stage IVC', criteria: 'Any T Any N M1c', description: 'Peritoneal metastases', prognosis: 'Poor' }
    ],
    guidelines: [
      { title: 'NCCN Colon Cancer Guidelines', url: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1428' },
      { title: 'NCCN Rectal Cancer Guidelines', url: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1461' }
    ]
  }
} as Record<CancerType, TNMStagingConfig>;

// Default config for cancer types not specifically defined
const defaultConfig: TNMStagingConfig = {
  version: 'AJCC 8th Edition',
  tOptions: [
    { value: 'T1', label: 'T1', description: 'Primary tumor stage 1' },
    { value: 'T2', label: 'T2', description: 'Primary tumor stage 2' },
    { value: 'T3', label: 'T3', description: 'Primary tumor stage 3' },
    { value: 'T4', label: 'T4', description: 'Primary tumor stage 4' }
  ],
  nOptions: [
    { value: 'N0', label: 'N0', description: 'No regional lymph node metastases' },
    { value: 'N1', label: 'N1', description: 'Regional lymph node metastases present' }
  ],
  mOptions: [
    { value: 'M0', label: 'M0', description: 'No distant metastases' },
    { value: 'M1', label: 'M1', description: 'Distant metastases present' }
  ],
  stageGroups: [
    { stage: 'Stage I', criteria: 'T1-2 N0 M0', description: 'Early stage disease', prognosis: 'Good' },
    { stage: 'Stage II', criteria: 'T3-4 N0 M0', description: 'Locally advanced', prognosis: 'Fair' },
    { stage: 'Stage III', criteria: 'Any T N1 M0', description: 'Regional node involvement', prognosis: 'Fair' },
    { stage: 'Stage IV', criteria: 'Any T Any N M1', description: 'Distant metastases', prognosis: 'Poor' }
  ]
};

const calculateStage = (t: string, n: string, m: string, config: TNMStagingConfig): string => {
  if (!t || !n || !m) return '';
  
  const tnm = `${t} ${n} ${m}`;
  
  // Find matching stage group
  for (const group of config.stageGroups) {
    // Simple pattern matching - in a real implementation, you'd want more sophisticated logic
    if (group.criteria.includes(t) && group.criteria.includes(n) && group.criteria.includes(m)) {
      return group.stage;
    }
  }
  
  return 'Stage Unknown';
};

export const TNMStagingPanel: React.FC<TNMStagingPanelProps> = ({
  cancerType,
  value,
  onChange,
  showGuidelines = true,
  showCalculator = true,
  disabled = false,
  className
}) => {
  const [notes, setNotes] = useState(value.notes || '');
  const [activeTab, setActiveTab] = useState('staging');
  
  const config = tnmConfigs[cancerType] || defaultConfig;
  
  useEffect(() => {
    // Auto-calculate stage when T, N, M change
    if (value.t && value.n && value.m) {
      const calculatedStage = calculateStage(value.t, value.n, value.m, config);
      if (calculatedStage !== value.stage) {
        onChange({
          ...value,
          stage: calculatedStage,
          ajccVersion: config.version
        });
      }
    }
  }, [value.t, value.n, value.m, config, onChange]);
  
  const handleTNMChange = (field: 't' | 'n' | 'm', newValue: string) => {
    onChange({
      ...value,
      [field]: newValue,
      ajccVersion: config.version
    });
  };
  
  const handleNotesChange = (newNotes: string) => {
    setNotes(newNotes);
    onChange({
      ...value,
      notes: newNotes
    });
  };
  
  const getStageInfo = (stage: string) => {
    return config.stageGroups.find(group => group.stage === stage);
  };
  
  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calculator className="h-5 w-5" />
          <span>TNM Staging</span>
          <Badge variant="outline" className="text-xs">
            {config.version}
          </Badge>
        </CardTitle>
        <CardDescription>
          Tumor-Node-Metastasis staging for {cancerType} cancer
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="staging">TNM Staging</TabsTrigger>
            <TabsTrigger value="calculator" disabled={!showCalculator}>Stage Calculator</TabsTrigger>
            <TabsTrigger value="guidelines" disabled={!showGuidelines}>Guidelines</TabsTrigger>
          </TabsList>
          
          <TabsContent value="staging" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* T - Primary Tumor */}
              <div className="space-y-2">
                <label className="text-sm font-medium">T - Primary Tumor</label>
                <Select
                  value={value.t}
                  onValueChange={(val) => handleTNMChange('t', val)}
                  disabled={disabled}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select T stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {config.tOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex flex-col">
                          <span className="font-medium">{option.label}</span>
                          <span className="text-xs text-gray-500">{option.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {value.t && (
                  <div className="text-xs text-gray-600">
                    {config.tOptions.find(opt => opt.value === value.t)?.description}
                    {config.tOptions.find(opt => opt.value === value.t)?.notes && (
                      <div className="mt-1 text-xs text-blue-600">
                        {config.tOptions.find(opt => opt.value === value.t)?.notes}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* N - Regional Lymph Nodes */}
              <div className="space-y-2">
                <label className="text-sm font-medium">N - Regional Lymph Nodes</label>
                <Select
                  value={value.n}
                  onValueChange={(val) => handleTNMChange('n', val)}
                  disabled={disabled}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select N stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {config.nOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex flex-col">
                          <span className="font-medium">{option.label}</span>
                          <span className="text-xs text-gray-500">{option.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {value.n && (
                  <div className="text-xs text-gray-600">
                    {config.nOptions.find(opt => opt.value === value.n)?.description}
                    {config.nOptions.find(opt => opt.value === value.n)?.notes && (
                      <div className="mt-1 text-xs text-blue-600">
                        {config.nOptions.find(opt => opt.value === value.n)?.notes}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* M - Distant Metastasis */}
              <div className="space-y-2">
                <label className="text-sm font-medium">M - Distant Metastasis</label>
                <Select
                  value={value.m}
                  onValueChange={(val) => handleTNMChange('m', val)}
                  disabled={disabled}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select M stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {config.mOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex flex-col">
                          <span className="font-medium">{option.label}</span>
                          <span className="text-xs text-gray-500">{option.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {value.m && (
                  <div className="text-xs text-gray-600">
                    {config.mOptions.find(opt => opt.value === value.m)?.description}
                    {config.mOptions.find(opt => opt.value === value.m)?.notes && (
                      <div className="mt-1 text-xs text-blue-600">
                        {config.mOptions.find(opt => opt.value === value.m)?.notes}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Calculated Stage */}
            {value.stage && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-blue-900">{value.stage}</h4>
                    <p className="text-sm text-blue-700">
                      {value.t} {value.n} {value.m}
                    </p>
                  </div>
                  {getStageInfo(value.stage) && (
                    <Badge 
                      variant="outline" 
                      className={cn(
                        'text-xs',
                        getStageInfo(value.stage)?.prognosis === 'Excellent' && 'border-green-300 text-green-700',
                        getStageInfo(value.stage)?.prognosis === 'Good' && 'border-blue-300 text-blue-700',
                        getStageInfo(value.stage)?.prognosis === 'Fair' && 'border-yellow-300 text-yellow-700',
                        getStageInfo(value.stage)?.prognosis === 'Poor' && 'border-red-300 text-red-700'
                      )}
                    >
                      {getStageInfo(value.stage)?.prognosis} Prognosis
                    </Badge>
                  )}
                </div>
                {getStageInfo(value.stage) && (
                  <p className="text-sm text-blue-600 mt-2">
                    {getStageInfo(value.stage)?.description}
                  </p>
                )}
              </div>
            )}
            
            {/* Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Staging Notes</label>
              <Textarea
                value={notes}
                onChange={(e) => handleNotesChange(e.target.value)}
                placeholder="Add any additional staging notes, imaging findings, or clinical observations..."
                disabled={disabled}
                rows={3}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="calculator" className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3">Stage Groups Reference</h4>
              <div className="space-y-2">
                {config.stageGroups.map((group) => (
                  <div key={group.stage} className="flex justify-between items-center text-sm">
                    <span className="font-medium">{group.stage}</span>
                    <span className="text-gray-600">{group.criteria}</span>
                    <span className="text-xs text-gray-500">{group.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="guidelines" className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span className="font-medium">Clinical Guidelines</span>
              </div>
              
              {config.guidelines && config.guidelines.length > 0 ? (
                <div className="space-y-2">
                  {config.guidelines.map((guideline, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => window.open(guideline.url, '_blank')}
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      {guideline.title}
                    </Button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No specific guidelines configured for {cancerType} cancer staging.
                </p>
              )}
              
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <strong>Note:</strong> TNM staging should always be verified with current AJCC guidelines 
                    and institutional protocols. This tool is for reference only.
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TNMStagingPanel;
