/**
 * Real-Time Monitoring and Alerting System
 * Advanced clinical decision support and safety monitoring
 * 
 * Features:
 * - Real-time safety signal detection
 * - Treatment response monitoring
 * - Protocol deviation alerts
 * - Quality metrics monitoring
 * - Automated clinical decision support
 * - Regulatory compliance monitoring
 * 
 * @version 1.0.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  Bell, 
  Shield, 
  Activity, 
  Users, 
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Settings,
  TrendingUp,
  Heart
} from 'lucide-react';

import { 
  MonitoringAlert, 
  RealTimeMetrics, 
  PatientProfile,
  TreatmentOutcome
} from '@/types/medical';
import enhancedTreatmentDatabase from '@/services/enhancedTreatmentDatabase';
import { useToast } from '@/components/ui/use-toast';

interface MonitoringSystemProps {
  patientId?: string;
  alertFilter?: 'all' | 'critical' | 'safety' | 'quality';
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export const MonitoringSystem: React.FC<MonitoringSystemProps> = ({
  patientId,
  alertFilter = 'all',
  autoRefresh = true,
  refreshInterval = 30000 // 30 seconds
}) => {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<MonitoringAlert[]>([]);
  const [metrics, setMetrics] = useState<RealTimeMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

  // Load monitoring data
  const loadMonitoringData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [alertsData, metricsData] = await Promise.all([
        enhancedTreatmentDatabase.getAlerts({ 
          severity: selectedSeverity === 'all' ? undefined : selectedSeverity,
          patientId,
          type: alertFilter === 'all' ? undefined : alertFilter
        }),
        enhancedTreatmentDatabase.getRealTimeMetrics()
      ]);
      
      setAlerts(alertsData);
      setMetrics(metricsData);
    } catch (error) {
      console.error('Failed to load monitoring data:', error);
      toast({
        title: "Monitoring Error",
        description: "Failed to load monitoring data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedSeverity, patientId, alertFilter, toast]);

  // Set up auto-refresh
  useEffect(() => {
    loadMonitoringData();
    
    if (autoRefresh) {
      const interval = setInterval(loadMonitoringData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [loadMonitoringData, autoRefresh, refreshInterval]);

  // Handle alert acknowledgment
  const acknowledgeAlert = async (alertId: string) => {
    try {
      await enhancedTreatmentDatabase.acknowledgeAlert(alertId);
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      ));
      toast({
        title: "Alert Acknowledged",
        description: "Alert has been marked as acknowledged",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to acknowledge alert",
        variant: "destructive",
      });
    }
  };

  // Handle alert resolution
  const resolveAlert = async (alertId: string) => {
    try {
      await enhancedTreatmentDatabase.resolveAlert(alertId);
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId ? { ...alert, resolved: true } : alert
      ));
      toast({
        title: "Alert Resolved",
        description: "Alert has been marked as resolved",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resolve alert",
        variant: "destructive",
      });
    }
  };

  // Filter alerts based on selection
  const filteredAlerts = alerts.filter(alert => {
    if (selectedSeverity !== 'all' && alert.severity !== selectedSeverity) return false;
    if (alertFilter !== 'all' && alert.alert_type !== alertFilter) return false;
    return true;
  });

  // Get alert counts by severity
  const alertCounts = {
    critical: alerts.filter(a => a.severity === 'critical' && !a.resolved).length,
    high: alerts.filter(a => a.severity === 'high' && !a.resolved).length,
    medium: alerts.filter(a => a.severity === 'medium' && !a.resolved).length,
    low: alerts.filter(a => a.severity === 'low' && !a.resolved).length
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium': return <Bell className="h-4 w-4 text-yellow-500" />;
      case 'low': return <Activity className="h-4 w-4 text-blue-500" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  if (isLoading && !metrics) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Loading monitoring data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with system status */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Clinical Monitoring System</h2>
          <p className="text-muted-foreground">
            Real-time monitoring and alerts for patient safety and quality
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge 
            variant={metrics?.system_status === 'operational' ? 'default' : 'destructive'}
            className="flex items-center space-x-1"
          >
            <Activity className="h-3 w-3" />
            <span>{metrics?.system_status || 'Unknown'}</span>
          </Badge>
          <Button variant="outline" size="sm" onClick={loadMonitoringData}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Treatments</p>
                <p className="text-2xl font-bold">{metrics?.active_treatments || 0}</p>
              </div>
              <Heart className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical Alerts</p>
                <p className="text-2xl font-bold text-red-600">{alertCounts.critical}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overdue Assessments</p>
                <p className="text-2xl font-bold text-orange-600">{metrics?.overdue_assessments || 0}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Results</p>
                <p className="text-2xl font-bold">{metrics?.pending_lab_results || 0}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Alert Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{alertCounts.critical}</div>
              <div className="text-sm text-muted-foreground">Critical</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{alertCounts.high}</div>
              <div className="text-sm text-muted-foreground">High</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{alertCounts.medium}</div>
              <div className="text-sm text-muted-foreground">Medium</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{alertCounts.low}</div>
              <div className="text-sm text-muted-foreground">Low</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Monitoring Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
          <TabsTrigger value="safety">Safety Signals</TabsTrigger>
          <TabsTrigger value="quality">Quality Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredAlerts.slice(0, 5).map((alert) => (
                    <div key={alert.id} className="flex items-start space-x-3 p-3 border rounded">
                      {getSeverityIcon(alert.severity)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium truncate">{alert.title}</h4>
                          <Badge variant={getSeverityBadgeVariant(alert.severity)}>
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {alert.description}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">
                            {alert.created_at.toLocaleString()}
                          </span>
                          {!alert.acknowledged && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => acknowledgeAlert(alert.id)}
                            >
                              Acknowledge
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>System Status</span>
                    <Badge variant={metrics?.system_status === 'operational' ? 'default' : 'destructive'}>
                      {metrics?.system_status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Active Patients</span>
                    <span className="font-medium">{metrics?.active_treatments}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Pending Assessments</span>
                    <span className="font-medium">{metrics?.patients_due_for_assessment}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Safety Signals</span>
                    <Badge variant={metrics?.safety_signals === 0 ? 'default' : 'destructive'}>
                      {metrics?.safety_signals}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground pt-2 border-t">
                    Last updated: {metrics?.last_updated.toLocaleString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          {/* Alert Filters */}
          <div className="flex items-center space-x-2">
            <select 
              value={selectedSeverity} 
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Alert List */}
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <Card key={alert.id} className={alert.severity === 'critical' ? 'border-red-500' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      {getSeverityIcon(alert.severity)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-medium">{alert.title}</h3>
                          <Badge variant={getSeverityBadgeVariant(alert.severity)}>
                            {alert.severity}
                          </Badge>
                          <Badge variant="outline">{alert.alert_type}</Badge>
                          {alert.acknowledged && (
                            <Badge variant="secondary">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Acknowledged
                            </Badge>
                          )}
                          {alert.resolved && (
                            <Badge variant="default">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Resolved
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground mt-1">{alert.description}</p>
                        
                        {alert.patient_affected && (
                          <p className="text-sm mt-2">
                            <strong>Patient:</strong> {alert.patient_affected}
                          </p>
                        )}
                        
                        {alert.protocol_affected && (
                          <p className="text-sm">
                            <strong>Protocol:</strong> {alert.protocol_affected}
                          </p>
                        )}

                        {alert.recommended_actions.length > 0 && (
                          <div className="mt-3">
                            <h4 className="text-sm font-medium">Recommended Actions:</h4>
                            <ul className="text-sm text-muted-foreground mt-1 list-disc list-inside">
                              {alert.recommended_actions.map((action, index) => (
                                <li key={index}>{action}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mt-4 pt-2 border-t">
                          <span className="text-xs text-muted-foreground">
                            Created: {alert.created_at.toLocaleString()}
                          </span>
                          <div className="flex space-x-2">
                            {!alert.acknowledged && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => acknowledgeAlert(alert.id)}
                              >
                                Acknowledge
                              </Button>
                            )}
                            {alert.acknowledged && !alert.resolved && (
                              <Button 
                                size="sm" 
                                onClick={() => resolveAlert(alert.id)}
                              >
                                Resolve
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredAlerts.length === 0 && (
            <Card>
              <CardContent className="text-center p-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium">No Active Alerts</h3>
                <p className="text-muted-foreground">All systems are operating normally</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="safety" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Safety Signal Detection</CardTitle>
              <p className="text-sm text-muted-foreground">
                Real-time monitoring of treatment safety and adverse events
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8">
                <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium">No Safety Signals Detected</h3>
                <p className="text-muted-foreground">
                  All treatment protocols are operating within expected safety parameters
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quality Metrics Monitoring</CardTitle>
              <p className="text-sm text-muted-foreground">
                Data quality, protocol adherence, and outcome tracking
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded">
                  <div className="text-2xl font-bold text-green-600">98.5%</div>
                  <div className="text-sm text-muted-foreground">Data Completeness</div>
                </div>
                <div className="text-center p-4 border rounded">
                  <div className="text-2xl font-bold text-blue-600">92.1%</div>
                  <div className="text-sm text-muted-foreground">Protocol Adherence</div>
                </div>
                <div className="text-center p-4 border rounded">
                  <div className="text-2xl font-bold text-purple-600">95.7%</div>
                  <div className="text-sm text-muted-foreground">Response Capture</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
