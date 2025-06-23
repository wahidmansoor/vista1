export interface ILabLogger {
  logAssessmentStart(input: {
    type: 'LAB_INTERPRETATION';
    panelId: string;
    timestamp: string;
  }): Promise<void>;
  
  logAssessmentComplete(result: {
    type: 'LAB_INTERPRETATION';
    panelId: string;
    timestamp: string;
    hasCriticalValues: boolean;
  }): Promise<void>;

  logError(message: string, error: Error): Promise<void>;
}
