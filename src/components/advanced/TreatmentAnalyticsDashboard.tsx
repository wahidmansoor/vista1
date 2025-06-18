/**
 * Advanced Treatment Analytics Dashboard
 * Real-time analytics and monitoring for cancer treatment management
 * 
 * Features:
 * - Treatment outcome analytics
 * - Population health metrics
 * - Survival analysis
 * - Biomarker correlation analysis
 * - Quality metrics and performance indicators
 * - Predictive modeling insights
 * 
 * @version 1.0.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  Activity, 
  Target,
  AlertTriangle,
  Download,
  RefreshCw,
  Filter
} from 'lucide-react';

import { 
  AnalyticsData, 
  PopulationMetrics, 
  SurvivalData, 
  QualityMetrics,
  BiomarkerAnalysis,
  TreatmentOutcome,
  PredictiveInsight,
  TreatmentProtocol
} from '@/types/medical';
import enhancedTreatmentDatabase from '@/services/enhancedTreatmentDatabase';
import { useToast } from '@/components/ui/use-toast';

interface TreatmentAnalyticsDashboardProps {
  selectedTimeframe?: 'week' | 'month' | 'quarter' | 'year';
  onExportData?: (data: AnalyticsData) => void;
}

export const TreatmentAnalyticsDashboard: React.FC<TreatmentAnalyticsDashboardProps> = ({
  selectedTimeframe = 'month',
  onExportData
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeframe, setTimeframe] = useState(selectedTimeframe);
  const [refreshing, setRefreshing] = useState(false);

  // Load analytics data
  useEffect(() => {
    loadAnalyticsData();
  }, [timeframe]);

  const loadAnalyticsData = async () => {
    try {
      setIsLoading(true);
      const data = await enhancedTreatmentDatabase.getAnalytics(timeframe);
      setAnalyticsData(data);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
      toast({
        title: "Analytics Error",
        description: "Failed to load treatment analytics data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadAnalyticsData();
    setRefreshing(false);
    toast({
      title: "Data Refreshed",
      description: "Analytics data has been updated",
    });
  };

  const exportData = () => {
    if (analyticsData && onExportData) {
      onExportData(analyticsData);
      toast({
        title: "Data Exported",
        description: "Analytics data has been exported successfully",
      });
    }
  };
  // Calculate derived metrics
  const derivedMetrics = useMemo(() => {
    if (!analyticsData) return null;

    const { population_metrics, quality_metrics, treatment_outcomes } = analyticsData;
    
    return {
      treatmentSuccessRate: population_metrics.treatment_outcomes.complete_response + 
                           population_metrics.treatment_outcomes.partial_response,
      adverseEventRate: treatment_outcomes.reduce((acc: number, outcome: TreatmentOutcome) => 
        acc + outcome.toxicities.length, 0) / treatment_outcomes.length,
      averageTimeToResponse: treatment_outcomes
        .filter((outcome: TreatmentOutcome) => outcome.response_evaluation_dates.length > 0)
        .reduce((acc: number, outcome: TreatmentOutcome, _: number, arr: TreatmentOutcome[]) => {
          const responseTime = outcome.response_evaluation_dates[0] ? 
            Math.floor((outcome.response_evaluation_dates[0].getTime() - outcome.treatment_start_date.getTime()) / (1000 * 60 * 60 * 24)) : 0;
          return acc + responseTime / arr.length;
        }, 0),
      protocolComplianceRate: quality_metrics.protocol_adherence.mean_compliance_rate
    };
  }, [analyticsData]);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Loading analytics data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analyticsData) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Unable to load analytics data. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Treatment Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Real-time insights and performance metrics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <select 
            value={timeframe} 
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshData}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={exportData}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Patients</p>
                <p className="text-2xl font-bold">{analyticsData.population_metrics.total_patients}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-2">
              <Badge variant="secondary">
                +{analyticsData.population_metrics.new_patients_this_period} new
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">
                  {derivedMetrics?.treatmentSuccessRate.toFixed(1)}%
                </p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-2">
              <Badge variant="default">
                CR + PR combined
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Time to Response</p>
                <p className="text-2xl font-bold">
                  {derivedMetrics?.averageTimeToResponse.toFixed(0)} days
                </p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Protocol Compliance</p>
                <p className="text-2xl font-bold">
                  {derivedMetrics?.protocolComplianceRate.toFixed(1)}%
                </p>
              </div>
              <Activity className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
          <TabsTrigger value="population">Population</TabsTrigger>
          <TabsTrigger value="biomarkers">Biomarkers</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Treatment Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Treatment Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">                  {Object.entries(analyticsData.population_metrics.treatment_distribution).map(([treatment, count]) => (
                    <div key={treatment} className="flex items-center justify-between">
                      <span className="text-sm">{treatment}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ 
                              width: `${(Number(count) / analyticsData.population_metrics.total_patients) * 100}%` 
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium">{String(count)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Response Rates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Response Rates</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Complete Response (CR)</span>
                    <Badge variant="default">
                      {analyticsData.population_metrics.treatment_outcomes.complete_response}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Partial Response (PR)</span>
                    <Badge variant="secondary">
                      {analyticsData.population_metrics.treatment_outcomes.partial_response}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Stable Disease (SD)</span>
                    <Badge variant="outline">
                      {analyticsData.population_metrics.treatment_outcomes.stable_disease}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Progressive Disease (PD)</span>
                    <Badge variant="destructive">
                      {analyticsData.population_metrics.treatment_outcomes.progressive_disease}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="outcomes" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Survival Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Survival Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Median OS</p>
                      <p className="text-xl font-bold">
                        {analyticsData.survival_data.overall_survival.median_months} months
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Median PFS</p>
                      <p className="text-xl font-bold">
                        {analyticsData.survival_data.progression_free_survival.median_months} months
                      </p>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <p className="text-sm text-muted-foreground">Confidence Intervals</p>
                    <p className="text-sm">
                      OS: {analyticsData.survival_data.overall_survival.confidence_interval.lower}-
                      {analyticsData.survival_data.overall_survival.confidence_interval.upper} months (95% CI)
                    </p>
                    <p className="text-sm">
                      PFS: {analyticsData.survival_data.progression_free_survival.confidence_interval.lower}-
                      {analyticsData.survival_data.progression_free_survival.confidence_interval.upper} months (95% CI)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Toxicity Profile */}
            <Card>
              <CardHeader>
                <CardTitle>Toxicity Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.quality_metrics.toxicity_monitoring.common_toxicities.map((toxicity: any, index: number) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{toxicity.name}</span>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={toxicity.grade >= 3 ? "destructive" : "secondary"}
                        >
                          Grade {toxicity.grade}
                        </Badge>
                        <span className="text-sm">{toxicity.frequency}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="population" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Demographics */}
            <Card>
              <CardHeader>
                <CardTitle>Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Median Age</span>
                    <span>{analyticsData.population_metrics.demographics.median_age} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Male</span>
                    <span>{analyticsData.population_metrics.demographics.gender_distribution.male}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Female</span>
                    <span>{analyticsData.population_metrics.demographics.gender_distribution.female}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cancer Types */}
            <Card>
              <CardHeader>
                <CardTitle>Cancer Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">                  {Object.entries(analyticsData.population_metrics.cancer_type_distribution).map(([type, percentage]) => (
                    <div key={type} className="flex justify-between">
                      <span className="text-sm">{type}</span>
                      <span className="font-medium">{String(percentage)}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Stage Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Stage Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">                  {Object.entries(analyticsData.population_metrics.stage_distribution).map(([stage, percentage]) => (
                    <div key={stage} className="flex justify-between">
                      <span className="text-sm">Stage {stage}</span>
                      <span className="font-medium">{String(percentage)}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="biomarkers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Biomarker Analysis</CardTitle>
              <p className="text-sm text-muted-foreground">
                Correlation between biomarkers and treatment outcomes
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {analyticsData.biomarker_analysis.correlations.map((correlation, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{correlation.biomarker_name}</h4>
                      <Badge variant={correlation.statistical_significance < 0.05 ? "default" : "secondary"}>
                        p = {correlation.statistical_significance.toFixed(3)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {correlation.clinical_interpretation}
                    </p>
                    <div className="flex justify-between text-sm">
                      <span>Correlation: {correlation.correlation_coefficient.toFixed(3)}</span>
                      <span>Sample Size: {correlation.sample_size}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Protocol Adherence */}
            <Card>
              <CardHeader>
                <CardTitle>Protocol Adherence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Mean Compliance Rate</span>
                    <Badge variant="default">
                      {analyticsData.quality_metrics.protocol_adherence.mean_compliance_rate.toFixed(1)}%
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Common Deviations</p>
                    {analyticsData.quality_metrics.protocol_adherence.common_deviations.map((deviation, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{deviation.reason}</span>
                        <span>{deviation.frequency}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Quality */}
            <Card>
              <CardHeader>
                <CardTitle>Data Quality Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Data Completeness</span>
                    <span className="font-medium">
                      {analyticsData.quality_metrics.data_quality.completeness_rate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Data Accuracy</span>
                    <span className="font-medium">
                      {analyticsData.quality_metrics.data_quality.accuracy_rate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Timeliness Score</span>
                    <span className="font-medium">
                      {analyticsData.quality_metrics.data_quality.timeliness_score.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
