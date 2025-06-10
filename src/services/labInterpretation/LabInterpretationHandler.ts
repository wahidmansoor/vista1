import { EmergencyService } from '../emergency/EmergencyService';
import { MedicalAuditLogger } from '../utils/MedicalAuditLogger';
import type {
  LabPanel,
  LabResult,
  LabInterpretation,
  PatientContext,
  LabInterpretationOptions,
  CriticalValue,
  TrendAnalysis,
  CancerMarkerAnalysis,
  TherapeuticDrugLevel
} from './types';

export class LabInterpretationHandler {
  private auditLogger: MedicalAuditLogger;
  private emergencyService: EmergencyService;

  constructor(
    auditLogger: MedicalAuditLogger,
    emergencyService: EmergencyService
  ) {
    this.auditLogger = auditLogger;
    this.emergencyService = emergencyService;
  }

  async interpretLabResults(
    panel: LabPanel,
    patientContext: PatientContext,
    options: Partial<LabInterpretationOptions> = {}
  ): Promise<LabInterpretation> {
    try {
      await this.auditLogger.logAssessmentStart({
        type: 'LAB_INTERPRETATION',
        panelId: panel.id,
        patientAge: patientContext.age,
        patientGender: patientContext.gender
      });

      // Apply default options
      const fullOptions: LabInterpretationOptions = {
        includeTrends: true,
        includeCancerMarkers: true,
        includeTherapeuticLevels: true,
        includePatientEducation: true,
        urgentNotificationThreshold: 'critical',
        languageLevel: 'detailed',
        ...options
      };

      // Analyze abnormal and critical values
      const abnormalResults = this.identifyAbnormalResults(panel.results, patientContext);
      const criticalValues = this.identifyCriticalValues(abnormalResults);

      // Handle emergency notifications if needed
      await this.handleCriticalValues(criticalValues);

      // Perform trend analysis if historical data available
      const trends = fullOptions.includeTrends && patientContext.previousLabs ? 
        await this.analyzeTrends(panel, patientContext.previousLabs) : [];

      // Analyze cancer markers if present and enabled
      const cancerMarkers = fullOptions.includeCancerMarkers ?
        await this.analyzeCancerMarkers(panel, trends) : undefined;

      // Check therapeutic drug levels if enabled
      const therapeuticLevels = fullOptions.includeTherapeuticLevels ?
        await this.analyzeTherapeuticLevels(panel, patientContext) : undefined;

      // Generate recommendations and patient education
      const recommendations = this.generateRecommendations(
        abnormalResults,
        criticalValues,
        trends,
        patientContext
      );

      const patientEducation = fullOptions.includePatientEducation ?
        await this.generatePatientEducation(
          abnormalResults,
          recommendations,
          fullOptions.languageLevel
        ) : [];

      const interpretation: LabInterpretation = {
        panel,
        abnormalResults,
        criticalValues,
        trends,
        cancerMarkers,
        therapeuticLevels,
        recommendations,
        patientEducation,
        limitations: this.generateLimitations(panel, patientContext)
      };

      await this.auditLogger.logAssessmentComplete({
        type: 'LAB_INTERPRETATION',
        panelId: panel.id,
        abnormalCount: abnormalResults.length,
        criticalCount: criticalValues.length,
        requiresUrgentCare: criticalValues.some(v => v.requiresEmergencyCare)
      });

      return interpretation;

    } catch (error) {
      await this.auditLogger.logError(
        'Lab interpretation error',
        error instanceof Error ? error : new Error(String(error))
      );
      throw error;
    }
  }

  private identifyAbnormalResults(
    results: LabResult[],
    context: PatientContext
  ): LabResult[] {
    return results.filter(result => {
      const range = this.getAdjustedReferenceRange(result.referenceRange, context);
      return result.value < range.low || result.value > range.high;
    });
  }

  private getAdjustedReferenceRange(
    baseRange: LabResult['referenceRange'],
    context: PatientContext
  ): LabResult['referenceRange'] {
    // Apply age/gender/condition specific adjustments
    // This would contain logic to modify ranges based on patient context
    return baseRange;
  }

  private identifyCriticalValues(results: LabResult[]): CriticalValue[] {
    return results
      .filter(r => r.isCritical)
      .map(r => ({
        testName: r.testName,
        value: r.value,
        unit: r.unit,
        timestamp: r.timestamp,
        urgencyLevel: this.determineUrgencyLevel(r),
        recommendations: this.getCriticalValueRecommendations(r),
        requiresEmergencyCare: this.requiresEmergencyCare(r)
      }));
  }

  private async handleCriticalValues(criticalValues: CriticalValue[]): Promise<void> {
    const emergencyCases = criticalValues.filter(v => v.requiresEmergencyCare);
    
    if (emergencyCases.length > 0) {
      await this.emergencyService.notifyUrgentLabResults(emergencyCases);
    }
  }

  private async analyzeTrends(
    currentPanel: LabPanel,
    previousPanels: LabPanel[]
  ): Promise<TrendAnalysis[]> {
    // Implementation for trend analysis
    return [];
  }

  private async analyzeCancerMarkers(
    panel: LabPanel,
    trends: TrendAnalysis[]
  ): Promise<CancerMarkerAnalysis[]> {
    // Implementation for cancer marker analysis
    return [];
  }

  private async analyzeTherapeuticLevels(
    panel: LabPanel,
    context: PatientContext
  ): Promise<TherapeuticDrugLevel[]> {
    // Implementation for therapeutic drug level analysis
    return [];
  }

  private generateRecommendations(
    abnormalResults: LabResult[],
    criticalValues: CriticalValue[],
    trends: TrendAnalysis[],
    context: PatientContext
  ) {
    return [];
  }

  private async generatePatientEducation(
    abnormalResults: LabResult[],
    recommendations: LabInterpretation['recommendations'],
    languageLevel: LabInterpretationOptions['languageLevel']
  ) {
    return [];
  }

  private generateLimitations(panel: LabPanel, context: PatientContext) {
    return [
      {
        type: 'clinical' as const,
        description: 'Remote interpretation limitations',
        impact: 'May require in-person evaluation for complete assessment'
      },
      {
        type: 'technical' as const,
        description: 'Limited historical data',
        impact: 'Trend analysis may be incomplete'
      }
    ];
  }

  private determineUrgencyLevel(result: LabResult): CriticalValue['urgencyLevel'] {
    // Implementation for determining urgency level
    return 'routine';
  }

  private getCriticalValueRecommendations(result: LabResult): string[] {
    // Implementation for getting critical value recommendations
    return [];
  }

  private requiresEmergencyCare(result: LabResult): boolean {
    // Implementation for determining if emergency care is needed
    return false;
  }
}
