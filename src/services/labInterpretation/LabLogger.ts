import { MedicalAuditLogger } from '../utils/MedicalAuditLogger';
import type { ILabLogger } from './labLogger.types';

export class LabLogger extends MedicalAuditLogger implements ILabLogger {
  async logAssessmentStart(input: Parameters<ILabLogger['logAssessmentStart']>[0]): Promise<void> {
    await this.log('Lab Assessment Start', {
      type: input.type,
      timestamp: input.timestamp,
      panelId: input.panelId,
      action: 'START'
    });
  }

  async logAssessmentComplete(result: Parameters<ILabLogger['logAssessmentComplete']>[0]): Promise<void> {
    await this.log('Lab Assessment Complete', {
      type: result.type,
      timestamp: result.timestamp,
      panelId: result.panelId,
      hasCriticalValues: result.hasCriticalValues,
      action: 'COMPLETE'
    });
  }

  // Override the base class method to handle lab-specific error logging
  async logError(message: string, error: Error): Promise<void> {
    await this.log('Lab Error', {
      message,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      action: 'ERROR'
    });
  }

  // Lab-specific logging methods
  async logCriticalValue(panelId: string, testName: string, value: number): Promise<void> {
    await this.log('Critical Value Detected', {
      panelId,
      testName,
      value,
      timestamp: new Date().toISOString(),
      action: 'CRITICAL_VALUE'
    });
  }

  async logTrendAlert(panelId: string, testName: string, trend: string): Promise<void> {
    await this.log('Trend Alert', {
      panelId,
      testName,
      trend,
      timestamp: new Date().toISOString(),
      action: 'TREND_ALERT'
    });
  }
}
