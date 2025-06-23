export interface EmergencyAssessmentStartInput {
  type: 'EMERGENCY_TRIAGE' | 'LAB_NOTIFICATION' | 'SYMPTOM_EMERGENCY';
  triageId?: string;
  escalationLevel?: number;
  details?: Record<string, unknown>;
}

export interface EmergencyAssessmentCompleteResult {
  type: 'EMERGENCY_TRIAGE' | 'LAB_NOTIFICATION_ACK';
  notificationId?: string;
  triageId?: string;
  acknowledgedBy?: string;
  timestamp: string;
  details?: Record<string, unknown>;
}

export interface EmergencyLoggerService {
  logAssessmentStart(input: EmergencyAssessmentStartInput): Promise<void>;
  logAssessmentComplete(result: EmergencyAssessmentCompleteResult): Promise<void>;
  logError(message: string, error: Error): Promise<void>;
}

const defaultConfig: EmergencyLoggerService = {
  async logAssessmentStart() {},
  async logAssessmentComplete() {},
  async logError() {}
};

export { defaultConfig as DefaultEmergencyLogger };
