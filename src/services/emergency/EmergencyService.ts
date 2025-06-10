import type { EmergencyCondition, EmergencyTriage, EmergencyCase, EmergencyServiceConfig } from './types';
import type { 
  UrgentLabNotification, 
  LabEmergencyResponse, 
  LabEmergencyHandler 
} from './labEmergency.types';
import { MedicalAuditLogger, AssessmentStartInput, AssessmentCompleteResult } from '../utils/MedicalAuditLogger';

export interface IEmergencyService extends LabEmergencyHandler {
  notifyEmergencyCondition(condition: EmergencyCondition): Promise<void>;
  triageEmergency(condition: EmergencyCondition): Promise<EmergencyTriage>;
  getEmergencyCase(id: string): Promise<EmergencyCase>;
  updateEmergencyStatus(id: string, status: EmergencyCase['response']['status']): Promise<void>;
  assignEmergencyCase(id: string, userId: string): Promise<void>;
}

export class EmergencyService implements IEmergencyService {
  private auditLogger: MedicalAuditLogger;
  private config: EmergencyServiceConfig;

  constructor(
    auditLogger: MedicalAuditLogger,
    config: EmergencyServiceConfig
  ) {
    this.auditLogger = auditLogger;
    this.config = config;
  }

  async notifyEmergencyCondition(condition: EmergencyCondition): Promise<void> {
    await this.auditLogger.logError('Emergency condition detected', new Error(JSON.stringify(condition)));
    const triage = await this.triageEmergency(condition);
    
    if (triage.escalationLevel >= this.config.escalationThresholds.immediate) {
      await this.initiateEmergencyResponse(triage);
    }
  }

  async triageEmergency(condition: EmergencyCondition): Promise<EmergencyTriage> {
    const triage: EmergencyTriage = {
      id: crypto.randomUUID(),
      condition,
      status: 'pending',
      escalationLevel: this.calculateEscalationLevel(condition),
      responseActions: this.determineResponseActions(condition),
      timestamp: new Date().toISOString()
    };

    await this.auditLogger.logAssessmentStart({
      type: 'EMERGENCY_TRIAGE',
      triageId: triage.id,
      escalationLevel: triage.escalationLevel,
      timestamp: new Date().toISOString()
    });

    return triage;
  }

  async notifyUrgentLabResults(results: UrgentLabNotification[]): Promise<LabEmergencyResponse> {
    await this.auditLogger.logError(
      'Urgent lab results detected',
      new Error(`Critical values found in ${results.length} tests`)
    );

    const notification: LabEmergencyResponse = {
      notificationId: crypto.randomUUID(),
      acknowledged: false,
      escalationLevel: this.determineEscalationLevel(results),
      responseActions: this.generateResponseActions(results)
    };

    if (this.requiresImmediateAction(results)) {
      await this.triggerEmergencyProtocols(notification, results);
    }

    return notification;
  }

  async acknowledgeLabNotification(notificationId: string, userId: string): Promise<void> {
      await this.auditLogger.logAssessmentComplete({
        type: 'LAB_NOTIFICATION_ACK',
        notificationId,
        acknowledgedBy: userId,
        timestamp: new Date().toISOString()
      });
  }

  async getLabNotificationStatus(notificationId: string): Promise<LabEmergencyResponse> {
    return {
      notificationId,
      acknowledged: false,
      escalationLevel: 0,
      responseActions: []
    };
  }

  async getEmergencyCase(id: string): Promise<EmergencyCase> {
    throw new Error('Not implemented');
  }

  async updateEmergencyStatus(id: string, status: EmergencyCase['response']['status']): Promise<void> {
    throw new Error('Not implemented');
  }

  async assignEmergencyCase(id: string, userId: string): Promise<void> {
    throw new Error('Not implemented');
  }

  private calculateEscalationLevel(condition: EmergencyCondition): number {
    switch (condition.severity) {
      case 'immediate':
        return this.config.escalationThresholds.immediate;
      case 'urgent':
        return this.config.escalationThresholds.urgent;
      default:
        return this.config.escalationThresholds.routine;
    }
  }

  private determineResponseActions(condition: EmergencyCondition): string[] {
    const actions: string[] = [];

    if (condition.requiresEmergencyCare) {
      actions.push('Immediate medical evaluation required');
      actions.push('Contact emergency services if patient unreachable');
    }

    switch (condition.type) {
      case 'LAB':
        actions.push('Review lab results with attending physician');
        break;
      case 'VITAL':
        actions.push('Monitor vital signs every 15 minutes');
        break;
      case 'DRUG':
        actions.push('Pharmacy consultation required');
        break;
      case 'SYMPTOM':
        actions.push('Assess symptoms for deterioration');
        break;
    }

    return actions;
  }

  private determineEscalationLevel(results: UrgentLabNotification[]): number {
    const hasImmediate = results.some(r => r.urgencyLevel === 'immediate');
    const hasUrgent = results.some(r => r.urgencyLevel === 'urgent');
    
    if (hasImmediate) return this.config.escalationThresholds.immediate;
    if (hasUrgent) return this.config.escalationThresholds.urgent;
    return this.config.escalationThresholds.routine;
  }

  private generateResponseActions(results: UrgentLabNotification[]): string[] {
    const actions = new Set<string>();

    if (results.some(r => r.requiresEmergencyCare)) {
      actions.add('Immediate medical evaluation required');
      actions.add('Contact emergency services if patient unreachable');
    }

    results.forEach(result => {
      result.recommendations.forEach(rec => actions.add(rec));
    });

    return Array.from(actions);
  }

  private async triggerEmergencyProtocols(
    notification: LabEmergencyResponse,
    results: UrgentLabNotification[]
  ): Promise<void> {
    await this.auditLogger.logError(
      'Emergency protocols triggered',
      new Error(`Emergency response initiated for notification ${notification.notificationId}`)
    );
  }

  private requiresImmediateAction(results: UrgentLabNotification[]): boolean {
    return results.some(
      r => r.urgencyLevel === 'immediate' || r.requiresEmergencyCare
    );
  }

  private async initiateEmergencyResponse(triage: EmergencyTriage): Promise<void> {
    await this.auditLogger.logError(
      'Emergency response initiated',
      new Error(`Emergency response initiated for triage ${triage.id}`)
    );
  }
}
