import React, { useState, useEffect } from 'react';
import { Activity, Info, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { PerformanceStatus } from '../../../types/enhanced-evaluation';

interface ECOGOption {
  score: number;
  description: string;
  details: string;
  functionalStatus: string;
  examples: string[];
}

interface PerformanceStatusPanelProps {
  value: PerformanceStatus;
  onChange: (status: PerformanceStatus) => void;
  showComparison?: boolean;
  showTrend?: boolean;
  previousAssessments?: PerformanceStatus[];
  disabled?: boolean;
  className?: string;
}

const ecogScale: ECOGOption[] = [
  {
    score: 0,
    description: 'Fully active',
    details: 'Able to carry on all pre-disease performance without restriction',
    functionalStatus: 'Excellent',
    examples: ['Full-time work', 'Normal physical activity', 'Independent activities']
  },
  {
    score: 1,
    description: 'Restricted in physically strenuous activity',
    details: 'Ambulatory and able to carry out work of a light or sedentary nature',
    functionalStatus: 'Good',
    examples: ['Light housework', 'Office work', 'Shopping with assistance']
  },
  {
    score: 2,
    description: 'Ambulatory and capable of self-care',
    details: 'Unable to carry out any work activities. Up and about >50% of waking hours',
    functionalStatus: 'Fair',
    examples: ['Personal care independent', 'Short walks', 'Needs frequent rest']
  },
  {
    score: 3,
    description: 'Capable of only limited self-care',
    details: 'Confined to bed or chair >50% of waking hours',
    functionalStatus: 'Poor',
    examples: ['Limited mobility', 'Assistance with ADLs', 'Frequent bed rest']
  },
  {
    score: 4,
    description: 'Completely disabled',
    details: 'Cannot carry on any self-care. Totally confined to bed or chair',
    functionalStatus: 'Very Poor',
    examples: ['Bedbound', 'Total care needed', 'Cannot perform self-care']
  }
];

const getECOGConfig = (score: number) => {
  const configs = {
    0: { color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200', icon: TrendingUp },
    1: { color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', icon: TrendingUp },
    2: { color: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200', icon: Activity },
    3: { color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', icon: TrendingDown },
    4: { color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', icon: TrendingDown }
  };
  
  return configs[score as keyof typeof configs] || configs[2];
};

const kpsToEcog = (kps: number): number => {
  if (kps >= 90) return 0;
  if (kps >= 70) return 1;
  if (kps >= 50) return 2;
  if (kps >= 30) return 3;
  return 4;
};

const ecogToKps = (ecog: number): number => {
  const mapping = { 0: 100, 1: 80, 2: 60, 3: 40, 4: 20 };
  return mapping[ecog as keyof typeof mapping] || 60;
};

const getKPSDescription = (kps: number): string => {
  if (kps >= 90) return 'Normal activity, minor symptoms';
  if (kps >= 80) return 'Normal activity with effort, some symptoms';
  if (kps >= 70) return 'Unable to work, cares for self';
  if (kps >= 60) return 'Requires occasional assistance';
  if (kps >= 50) return 'Requires considerable assistance';
  if (kps >= 40) return 'Disabled, requires special care';
  if (kps >= 30) return 'Severely disabled, hospitalization indicated';
  if (kps >= 20) return 'Very sick, active supportive treatment necessary';
  return 'Moribund, fatal processes progressing rapidly';
};

const calculateTrend = (current: PerformanceStatus, previous?: PerformanceStatus): 'improving' | 'stable' | 'declining' | 'unknown' => {
  if (!previous) return 'unknown';
  
  if (current.ecog < previous.ecog) return 'improving';
  if (current.ecog > previous.ecog) return 'declining';
  
  // If ECOG is same, check KPS for more granular assessment
  if (current.kps > previous.kps + 5) return 'improving';
  if (current.kps < previous.kps - 5) return 'declining';
  
  return 'stable';
};

export const PerformanceStatusPanel: React.FC<PerformanceStatusPanelProps> = ({
  value,
  onChange,
  showComparison = true,
  showTrend = true,
  previousAssessments = [],
  disabled = false,
  className
}) => {
  const [notes, setNotes] = useState(value.notes || '');
  const [activeTab, setActiveTab] = useState('ecog');
  const [autoSync, setAutoSync] = useState(true);
  
  const currentECOG = ecogScale.find(scale => scale.score === value.ecog);
  const config = getECOGConfig(value.ecog);
  const IconComponent = config.icon;
  
  const previousAssessment = previousAssessments[previousAssessments.length - 1];
  const trend = showTrend && previousAssessment ? calculateTrend(value, previousAssessment) : 'unknown';
  
  useEffect(() => {
    // Auto-sync KPS when ECOG changes
    if (autoSync) {
      const syncedKps = ecogToKps(value.ecog);
      if (Math.abs(syncedKps - value.kps) > 10) {
        onChange({
          ...value,
          kps: syncedKps
        });
      }
    }
  }, [value.ecog, autoSync, onChange]);
  
  const handleECOGChange = (newEcog: number) => {
    const updates: Partial<PerformanceStatus> = {
      ecog: newEcog,
      assessmentDate: new Date().toISOString()
    };
    
    if (autoSync) {
      updates.kps = ecogToKps(newEcog);
    }
    
    onChange({
      ...value,
      ...updates
    });
  };
  
  const handleKPSChange = (newKps: number) => {
    const updates: Partial<PerformanceStatus> = {
      kps: newKps,
      assessmentDate: new Date().toISOString()
    };
    
    if (autoSync) {
      updates.ecog = kpsToEcog(newKps);
    }
    
    onChange({
      ...value,
      ...updates
    });
  };
  
  const handleNotesChange = (newNotes: string) => {
    setNotes(newNotes);
    onChange({
      ...value,
      notes: newNotes
    });
  };
  
  const getTrendConfig = (trendType: string) => {
    switch (trendType) {
      case 'improving':
        return { color: 'text-green-600', bg: 'bg-green-50', label: 'Improving', icon: TrendingUp };
      case 'declining':
        return { color: 'text-red-600', bg: 'bg-red-50', label: 'Declining', icon: TrendingDown };
      case 'stable':
        return { color: 'text-blue-600', bg: 'bg-blue-50', label: 'Stable', icon: Activity };
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-50', label: 'Unknown', icon: Activity };
    }
  };
  
  const trendConfig = getTrendConfig(trend);
  const TrendIcon = trendConfig.icon;
  
  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Performance Status</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {showTrend && trend !== 'unknown' && (
              <Badge variant="outline" className={cn('text-xs', trendConfig.color, trendConfig.bg)}>
                <TrendIcon className="h-3 w-3 mr-1" />
                {trendConfig.label}
              </Badge>
            )}
            
            <Badge variant="outline" className={cn('text-xs', config.color)}>
              ECOG {value.ecog}
            </Badge>
          </div>
        </CardTitle>
        <CardDescription>
          Assessment of patient's functional status and activity level
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ecog">ECOG Scale</TabsTrigger>
            <TabsTrigger value="kps">Karnofsky Scale</TabsTrigger>
            <TabsTrigger value="comparison" disabled={!showComparison}>Comparison</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ecog" className="space-y-4">
            {/* ECOG Score Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">ECOG Performance Status</label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAutoSync(!autoSync)}
                  className={cn(
                    'text-xs',
                    autoSync ? 'text-blue-600' : 'text-gray-500'
                  )}
                >
                  Auto-sync: {autoSync ? 'ON' : 'OFF'}
                </Button>
              </div>
              
              <Select
                value={value.ecog.toString()}
                onValueChange={(val) => handleECOGChange(parseInt(val))}
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ecogScale.map((option) => (
                    <SelectItem key={option.score} value={option.score.toString()}>
                      <div className="flex flex-col py-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">ECOG {option.score}</span>
                          <Badge variant="outline" className="text-xs">
                            {option.functionalStatus}
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-600">{option.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Current ECOG Details */}
            {currentECOG && (
              <div className={cn(
                'p-4 rounded-lg border',
                config.bg,
                config.border
              )}>
                <div className="flex items-center space-x-2 mb-2">
                  <IconComponent className={cn('h-4 w-4', config.color)} />
                  <span className={cn('font-medium text-sm', config.color)}>
                    ECOG {currentECOG.score} - {currentECOG.functionalStatus}
                  </span>
                </div>
                
                <p className={cn('text-sm mb-3', config.color)}>
                  {currentECOG.details}
                </p>
                
                <div className="space-y-1">
                  <span className={cn('text-xs font-medium', config.color)}>
                    Typical Activities:
                  </span>
                  <ul className={cn('text-xs space-y-1', config.color)}>
                    {currentECOG.examples.map((example, index) => (
                      <li key={index} className="flex items-center space-x-1">
                        <span className="w-1 h-1 bg-current rounded-full"></span>
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            {/* Assessment Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Assessment Notes</label>
              <Textarea
                value={notes}
                onChange={(e) => handleNotesChange(e.target.value)}
                placeholder="Document specific functional limitations, symptoms affecting performance, or relevant clinical observations..."
                disabled={disabled}
                rows={3}
              />
            </div>
            
            {/* Assessment Date */}
            {value.assessmentDate && (
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>
                  Last assessed: {new Date(value.assessmentDate).toLocaleString()}
                </span>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="kps" className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Karnofsky Performance Scale</label>
                <span className="text-sm text-gray-500">
                  {value.kps}% - {getKPSDescription(value.kps)}
                </span>
              </div>
              
              <div className="space-y-4">
                <Slider
                  value={[value.kps]}
                  onValueChange={(val) => handleKPSChange(val[0])}
                  min={0}
                  max={100}
                  step={10}
                  disabled={disabled}
                  className="w-full"
                />
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0% (Death)</span>
                  <span>50% (Requires assistance)</span>
                  <span>100% (Normal activity)</span>
                </div>
              </div>
              
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Current Status:</strong> {getKPSDescription(value.kps)}
                </p>
                {autoSync && (
                  <p className="text-xs text-blue-600 mt-1">
                    Equivalent ECOG Score: {kpsToEcog(value.kps)}
                  </p>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="comparison" className="space-y-4">
            {previousAssessments.length > 0 ? (
              <div className="space-y-4">
                <h4 className="font-medium">Performance Status History</h4>
                
                <div className="space-y-3">
                  {[value, ...previousAssessments.slice().reverse()].map((assessment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-center">
                          <div className="text-sm font-medium">ECOG {assessment.ecog}</div>
                          <div className="text-xs text-gray-500">KPS {assessment.kps}%</div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="text-sm">
                            {ecogScale.find(s => s.score === assessment.ecog)?.description}
                          </div>
                          {assessment.assessmentDate && (
                            <div className="text-xs text-gray-500">
                              {new Date(assessment.assessmentDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {index === 0 && (
                        <Badge variant="outline" className="text-xs">
                          Current
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
                
                {trend !== 'unknown' && (
                  <div className={cn(
                    'p-3 rounded-lg border',
                    trendConfig.bg
                  )}>
                    <div className="flex items-center space-x-2">
                      <TrendIcon className={cn('h-4 w-4', trendConfig.color)} />
                      <span className={cn('text-sm font-medium', trendConfig.color)}>
                        Performance Status Trend: {trendConfig.label}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No previous assessments available for comparison</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PerformanceStatusPanel;
