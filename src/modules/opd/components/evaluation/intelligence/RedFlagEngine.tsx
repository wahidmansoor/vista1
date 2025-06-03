import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  Clock, 
  RefreshCcw
} from 'lucide-react';
import type { 
  EnhancedPatientEvaluation, 
  RedFlag, 
  CancerType 
} from '../../../types/enhanced-evaluation';

interface RedFlagEngineProps {
  evaluation: Partial<EnhancedPatientEvaluation>;
  onRedFlagUpdate: (redFlags: RedFlag[]) => void;
  autoMonitor?: boolean;
  isMonitoring?: boolean;
}

interface RedFlagRule {
  id: string;
  category: 'critical' | 'urgent' | 'concerning' | 'monitoring';
  title: string;
  description: string;
  condition: (evaluation: Partial<EnhancedPatientEvaluation>) => boolean;
  severity: 1 | 2 | 3 | 4 | 5;
  actionRequired: string[];
  timeframe: string;
  specialties?: string[];
}

const RED_FLAG_RULES: RedFlagRule[] = [
  // Critical Flags
  {
    id: 'severe-performance-decline',
    category: 'critical',
    title: 'Severe Performance Status Decline',
    description: 'ECOG performance status ≥3 indicating significant functional impairment',
    condition: (evaluation) => (evaluation.performance_status?.ecog || 0) >= 3,
    severity: 5,
    actionRequired: [
      'Immediate clinical assessment',
      'Review treatment tolerance',
      'Consider supportive care measures',
      'Reassess treatment goals'
    ],
    timeframe: 'Immediate (within 24 hours)',
    specialties: ['Oncology', 'Palliative Care']
  },
  {
    id: 'rapid-disease-progression',
    category: 'critical',
    title: 'Rapid Disease Progression',
    description: 'Significant increase in tumor markers or imaging findings',
    condition: (evaluation) => {
      const formData = evaluation.form_data || {};
      // Check for rapid biomarker elevation in form data
      const tumorMarkers = formData.tumor_markers || {};
      
      return Object.values(tumorMarkers).some((marker: any) => 
        marker?.value && marker.value > 100 // Simplified threshold for demonstration
      );
    },
    severity: 5,
    actionRequired: [
      'Urgent imaging studies',
      'Biomarker trend analysis',
      'Treatment modification',
      'MDT discussion'
    ],
    timeframe: 'Urgent (within 48 hours)',
    specialties: ['Oncology', 'Radiology']
  },
  {
    id: 'treatment-toxicity',
    category: 'critical',
    title: 'Severe Treatment Toxicity',
    description: 'Grade 4 toxicity or multiple Grade 3 toxicities',
    condition: (evaluation) => {
      const formData = evaluation.form_data || {};
      const toxicities = formData.toxicities || [];
      return toxicities.some((tox: any) => tox?.grade >= 4);
    },
    severity: 5,
    actionRequired: [
      'Immediate treatment hold',
      'Supportive care measures',
      'Toxicity management',
      'Dose modification planning'
    ],
    timeframe: 'Immediate (same day)',
    specialties: ['Oncology', 'Emergency Medicine']
  },

  // Urgent Flags
  {
    id: 'uncontrolled-symptoms',
    category: 'urgent',
    title: 'Uncontrolled Symptoms',
    description: 'High symptom burden requiring urgent intervention',
    condition: (evaluation) => {
      const formData = evaluation.form_data || {};
      const symptoms = formData.symptoms || [];
      return symptoms.some((symptom: any) => (symptom?.severity || 0) >= 8);
    },
    severity: 4,
    actionRequired: [
      'Symptom assessment',
      'Pain management review',
      'Supportive care consultation',
      'Medication adjustment'
    ],
    timeframe: 'Within 24-48 hours',
    specialties: ['Oncology', 'Palliative Care', 'Pain Management']
  },
  {
    id: 'infection-risk',
    category: 'urgent',
    title: 'High Infection Risk',
    description: 'Severe neutropenia or immunosuppression',
    condition: (evaluation) => {
      const formData = evaluation.form_data || {};
      const labResults = formData.laboratory || {};
      const neutrophils = labResults.neutrophils || labResults.absolute_neutrophil_count;
      return neutrophils ? neutrophils < 500 : false;
    },
    severity: 4,
    actionRequired: [
      'Infection precautions',
      'Monitor for fever',
      'Consider prophylactic antibiotics',
      'G-CSF if indicated'
    ],
    timeframe: 'Within 24 hours',
    specialties: ['Oncology', 'Infectious Disease']
  },
  {
    id: 'thrombosis-risk',
    category: 'urgent',
    title: 'High Thrombosis Risk',
    description: 'Multiple risk factors for venous thromboembolism',
    condition: (evaluation) => {
      const formData = evaluation.form_data || {};
      const comorbidities = formData.comorbidities || [];
      const hasRiskFactors = comorbidities.some((condition: string) => 
        ['previous VTE', 'thrombophilia', 'recent surgery'].includes(condition)
      );
      const activeChemo = formData.current_treatment?.status === 'active';
      return hasRiskFactors && activeChemo;
    },
    severity: 3,
    actionRequired: [
      'VTE risk assessment',
      'Consider anticoagulation',
      'Patient education',
      'Regular monitoring'
    ],
    timeframe: 'Within 48 hours',
    specialties: ['Oncology', 'Hematology']
  },

  // Concerning Flags
  {
    id: 'treatment-delay',
    category: 'concerning',
    title: 'Treatment Delays',
    description: 'Significant delays in planned treatment schedule',
    condition: (evaluation) => {
      const formData = evaluation.form_data || {};
      const treatment = formData.current_treatment;
      if (!treatment?.planned_start_date) return false;
      
      const startDate = new Date(treatment.planned_start_date);
      const daysSinceStart = (Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24);
      
      return daysSinceStart > 30 && treatment.status === 'planned';
    },
    severity: 2,
    actionRequired: [
      'Review treatment plan',
      'Address barriers to treatment',
      'Patient communication',
      'Schedule optimization'
    ],
    timeframe: 'Within 1 week',
    specialties: ['Oncology', 'Care Coordination']
  },
  {
    id: 'psychosocial-distress',
    category: 'concerning',
    title: 'Psychosocial Distress',
    description: 'High levels of anxiety, depression, or distress',
    condition: (evaluation) => {
      const formData = evaluation.form_data || {};
      const psychosocial = formData.psychosocial || {};
      return (psychosocial.distress_score || 0) >= 7;
    },
    severity: 2,
    actionRequired: [
      'Psychosocial assessment',
      'Counseling referral',
      'Support resources',
      'Family involvement'
    ],
    timeframe: 'Within 1 week',
    specialties: ['Psychology', 'Social Work', 'Psychiatry']
  },

  // Monitoring Flags
  {
    id: 'lab-abnormalities',
    category: 'monitoring',
    title: 'Laboratory Abnormalities',
    description: 'Trending laboratory values requiring monitoring',
    condition: (evaluation) => {
      const formData = evaluation.form_data || {};
      const labs = formData.laboratory || {};
      
      return (
        (labs.hemoglobin && labs.hemoglobin < 10) ||
        (labs.platelets && labs.platelets < 100000) ||
        (labs.creatinine && labs.creatinine > 1.5)
      );
    },
    severity: 1,
    actionRequired: [
      'Trend monitoring',
      'Repeat testing',
      'Dose modifications if needed',
      'Supportive measures'
    ],
    timeframe: 'Routine monitoring',
    specialties: ['Oncology', 'Laboratory Medicine']
  },
  {
    id: 'medication-compliance',
    category: 'monitoring',
    title: 'Medication Compliance Concerns',
    description: 'Potential issues with treatment adherence',
    condition: (evaluation) => {
      const formData = evaluation.form_data || {};
      const medications = formData.current_medications || [];
      return medications.some((med: any) => med?.adherence === 'poor');
    },
    severity: 1,
    actionRequired: [
      'Adherence counseling',
      'Side effect assessment',
      'Pharmacy consultation',
      'Pill counting'
    ],
    timeframe: 'Next visit',
    specialties: ['Oncology', 'Pharmacy']
  },

  // Additional cancer-specific red flags
  {
    id: 'weight-loss',
    category: 'concerning',
    title: 'Significant Weight Loss',
    description: 'Unintentional weight loss >10% in 6 months',
    condition: (evaluation) => {
      const formData = evaluation.form_data || {};
      const weightLoss = formData.weight_loss_percentage;
      return weightLoss && weightLoss > 10;
    },
    severity: 3,
    actionRequired: [
      'Nutritional assessment',
      'Dietitian referral',
      'Investigate underlying causes',
      'Consider nutritional support'
    ],
    timeframe: 'Within 1 week',
    specialties: ['Oncology', 'Nutrition']
  },
  {
    id: 'organ-dysfunction',
    category: 'urgent',
    title: 'Organ Dysfunction',
    description: 'Significant impairment in organ function',
    condition: (evaluation) => {
      const organFunction = evaluation.organ_function || {};
      
      return (
        (organFunction.hepatic?.bilirubin && organFunction.hepatic.bilirubin > 3) ||
        (organFunction.renal?.creatinine && organFunction.renal.creatinine > 2) ||
        (organFunction.cardiac?.ejectionFraction && organFunction.cardiac.ejectionFraction < 40)
      );
    },
    severity: 4,
    actionRequired: [
      'Organ function assessment',
      'Specialist consultation',
      'Treatment modification',
      'Supportive care'
    ],
    timeframe: 'Within 24-48 hours',
    specialties: ['Oncology', 'Cardiology', 'Nephrology', 'Hepatology']
  }
];

export function RedFlagEngine({ 
  evaluation, 
  onRedFlagUpdate, 
  autoMonitor = true,
  isMonitoring = false 
}: RedFlagEngineProps) {
  const [activeTab, setActiveTab] = useState('active');
  const [activeFlags, setActiveFlags] = useState<RedFlag[]>([]);
  const [flagHistory, setFlagHistory] = useState<RedFlag[]>([]);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const flagStats = useMemo(() => {
    const critical = activeFlags.filter(flag => (flag.severity || 1) >= 4).length;
    const urgent = activeFlags.filter(flag => (flag.severity || 1) === 3).length;
    const concerning = activeFlags.filter(flag => (flag.severity || 1) === 2).length;
    const monitoring = activeFlags.filter(flag => (flag.severity || 1) === 1).length;
    
    return { critical, urgent, concerning, monitoring, total: activeFlags.length };
  }, [activeFlags]);

  useEffect(() => {
    if (autoMonitor) {
      checkRedFlags();
    }
  }, [evaluation, autoMonitor]);

  const checkRedFlags = () => {
    const detectedFlags: RedFlag[] = [];
    
    RED_FLAG_RULES.forEach(rule => {
      try {
        if (rule.condition(evaluation)) {
          const flag: RedFlag = {
            id: rule.id,
            type: rule.category === 'critical' ? 'critical' : rule.category === 'urgent' ? 'warning' : 'info',
            category: 'clinical',
            message: rule.title,
            recommendation: rule.description,
            urgency: rule.category === 'critical' ? 'immediate' : rule.category === 'urgent' ? 'urgent' : 'routine',
            triggered: true,
            timestamp: new Date().toISOString(),
            severity: rule.severity,
            actionRequired: rule.actionRequired,
            timeframe: rule.timeframe,
            specialties: rule.specialties || []
          };
          
          detectedFlags.push(flag);
        }
      } catch (error) {
        console.error(`Error evaluating red flag rule ${rule.id}:`, error);
      }
    });

    setActiveFlags(detectedFlags);
    setLastChecked(new Date());
    onRedFlagUpdate(detectedFlags);
  };

  const acknowledgeFlag = (flagId: string) => {
    setActiveFlags(flags => 
      flags.map(flag => 
        flag.id === flagId 
          ? { ...flag, acknowledged: true, acknowledgedAt: new Date().toISOString() }
          : flag
      )
    );
  };

  const resolveFlag = (flagId: string, resolution: string) => {
    const flagToResolve = activeFlags.find(flag => flag.id === flagId);
    if (flagToResolve) {
      const resolvedFlag = {
        ...flagToResolve,
        resolved: true,
        resolvedAt: new Date().toISOString(),
        resolution
      };
      
      setFlagHistory(history => [...history, resolvedFlag]);
      setActiveFlags(flags => flags.filter(flag => flag.id !== flagId));
    }
  };

  const getSeverityColor = (severity: number) => {
    switch (severity) {
      case 5:
      case 4: return 'text-red-600 bg-red-50 border-red-200';
      case 3: return 'text-orange-600 bg-orange-50 border-orange-200';
      case 2: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 1: return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };  const getSeverityIcon = (severity: number) => {
    switch (severity) {
      case 5:
      case 4: return <AlertTriangle className="h-5 w-5" />;
      case 3: return <AlertTriangle className="h-5 w-5" />;
      case 2: return <AlertTriangle className="h-5 w-5" />;
      case 1: return <Clock className="h-5 w-5" />;
      default: return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const renderFlag = (flag: RedFlag, showActions = true) => (
    <Card key={flag.id} className={`border-2 ${getSeverityColor(flag.severity || 1)}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            {getSeverityIcon(flag.severity || 1)}
            <h3 className="font-semibold">{flag.message}</h3>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={(flag.severity || 1) >= 4 ? 'destructive' : 
                           (flag.severity || 1) === 3 ? 'default' : 'secondary'}>
              Severity {flag.severity || 1}
            </Badge>
            {flag.acknowledged && (
              <Badge variant="outline">Acknowledged</Badge>
            )}
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-3">
          {flag.recommendation}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="font-medium text-sm mb-2">Required Actions:</h4>
            <ul className="text-sm space-y-1">
              {(flag.actionRequired || []).map((action, index) => (                <li key={index} className="flex items-center space-x-2">
                  <AlertTriangle className="h-3 w-3" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-sm mb-2">Timeline:</h4>
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="h-4 w-4" />
              <span>{flag.timeframe || flag.urgency}</span>
            </div>
            
            {flag.specialties && flag.specialties.length > 0 && (
              <div className="mt-2">
                <h4 className="font-medium text-sm mb-1">Specialties:</h4>
                <div className="flex flex-wrap gap-1">
                  {flag.specialties.map((specialty, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {showActions && !flag.acknowledged && (
          <div className="flex items-center space-x-2">            <Button 
              size="sm" 
              variant="outline"
              onClick={() => acknowledgeFlag(flag.id)}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Acknowledge
            </Button>
            <Button 
              size="sm" 
              variant="default"
              onClick={() => {
                const resolution = prompt('Enter resolution details:');
                if (resolution) resolveFlag(flag.id, resolution);
              }}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Resolve
            </Button>
          </div>
        )}

        <div className="text-xs text-muted-foreground mt-2">
          Triggered: {new Date(flag.timestamp || '').toLocaleString()}
          {flag.acknowledgedAt && (
            <span className="ml-2">
              • Acknowledged: {new Date(flag.acknowledgedAt).toLocaleString()}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card className="w-full">
      <CardHeader>        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <CardTitle>Red Flag Monitor</CardTitle>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              {flagStats.total} active alerts
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={checkRedFlags}
              disabled={isMonitoring}
            >              {isMonitoring ? (
                <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4 mr-2" />
              )}
              Check Now
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{flagStats.critical}</div>
            <div className="text-sm text-red-600">Critical</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{flagStats.urgent}</div>
            <div className="text-sm text-orange-600">Urgent</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{flagStats.concerning}</div>
            <div className="text-sm text-yellow-600">Concerning</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{flagStats.monitoring}</div>
            <div className="text-sm text-blue-600">Monitoring</div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Active Alerts ({flagStats.total})</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">            {activeFlags.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Alerts</h3>
                <p className="text-muted-foreground">
                  All critical parameters are within acceptable ranges.
                </p>
                {lastChecked && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Last checked: {lastChecked.toLocaleString()}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {activeFlags
                  .sort((a, b) => (b.severity || 1) - (a.severity || 1))
                  .map(flag => renderFlag(flag, true))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {flagHistory.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No History</h3>
                <p className="text-muted-foreground">
                  Resolved alerts will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {flagHistory
                  .sort((a, b) => new Date(b.resolvedAt!).getTime() - new Date(a.resolvedAt!).getTime())
                  .map(flag => (
                    <Card key={flag.id} className="opacity-75">
                      <CardContent className="p-4">
                        {renderFlag(flag, false)}                        {flag.resolution && (
                          <Alert className="mt-3">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                              <strong>Resolution:</strong> {flag.resolution}
                            </AlertDescription>
                          </Alert>
                        )}
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <h3 className="text-lg font-semibold">Alert Configuration</h3>
            
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Monitoring Settings</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Auto-monitor</span>
                  <span className="text-sm text-muted-foreground">
                    {autoMonitor ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Alert Rules</span>
                  <span className="text-sm text-muted-foreground">
                    {RED_FLAG_RULES.length} active rules
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Last Check</span>
                  <span className="text-sm text-muted-foreground">
                    {lastChecked ? lastChecked.toLocaleString() : 'Never'}
                  </span>
                </div>
              </div>
            </Card>            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Red flag monitoring helps identify critical clinical situations requiring 
                immediate attention. Configure notifications and escalation policies as needed.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
