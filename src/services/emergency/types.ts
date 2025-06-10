import type { UrgentLabNotification } from './labEmergency.types';

export interface EmergencyCondition {
  type: 'SYMPTOM' | 'LAB' | 'DRUG' | 'VITAL';
  severity: 'immediate' | 'urgent' | 'routine';
  details: Record<string, unknown>;
  timestamp: string;
  patientId?: string;
  providerId?: string;
  requiresEmergencyCare: boolean;
}

export interface EmergencyTriage {
  id: string;
  condition: EmergencyCondition;
  status: 'pending' | 'inProgress' | 'resolved';
  assignedTo?: string;
  escalationLevel: number;
  responseActions: string[];
  timestamp: string;
}

export interface EmergencyNotification {
  type: 'LAB_NOTIFICATION_ACK' | 'EMERGENCY_TRIAGE';
  notificationId: string;
  acknowledgedBy?: string;
  timestamp: string;
  details?: Record<string, unknown>;
}

export interface EmergencyServiceConfig {
  escalationThresholds: {
    immediate: number;
    urgent: number;
    routine: number;
  };
  notificationDelays: {
    initial: number;
    reminder: number;
    escalation: number;
  };
  contactMethods: ('phone' | 'email' | 'sms' | 'inApp')[];
}

export interface EmergencyCase {
  id: string;
  triage: EmergencyTriage;
  notifications: EmergencyNotification[];
  labResults?: UrgentLabNotification[];
  response: {
    initiated: boolean;
    initiatedAt?: string;
    initiatedBy?: string;
    actions: string[];
    status: 'pending' | 'active' | 'resolved';
  };
}
