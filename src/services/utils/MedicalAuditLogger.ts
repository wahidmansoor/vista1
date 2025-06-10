export interface AssessmentStartInput {
  type: string;
  [key: string]: unknown;
}

export interface AssessmentCompleteResult {
  type: string;
  [key: string]: unknown;
}

export class MedicalAuditLogger<
  TInput extends AssessmentStartInput = AssessmentStartInput,
  TResult extends AssessmentCompleteResult = AssessmentCompleteResult
> {
  async logAssessmentStart(input: TInput): Promise<void> {
    const timestamp = new Date().toISOString();
    await this.log('Assessment Start', {
      timestamp,
      type: input.type,
      data: {
        ...input,
        timestamp
      }
    });
  }

  async logAssessmentComplete(result: TResult): Promise<void> {
    const timestamp = new Date().toISOString();
    await this.log('Assessment Complete', {
      timestamp,
      type: result.type,
      data: {
        ...result,
        timestamp
      }
    });
  }

  async logError(message: string, error: unknown): Promise<void> {
    await this.log('Error', {
      timestamp: new Date().toISOString(),
      type: 'ERROR',
      message,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
  }

  protected async log(action: string, data: Record<string, unknown>): Promise<void> {
    // Implement actual logging logic here (e.g., to a secure medical audit trail)
    console.log(`[Medical Audit] ${action}:`, JSON.stringify(data, null, 2));
  }
}

// Specialized performance logger for confidence service
export class PerformanceAuditLogger extends MedicalAuditLogger {
  async logPerformance(metric: {
    operation: string;
    duration: number;
    success: boolean;
    details?: Record<string, unknown>;
  }): Promise<void> {
    await this.log('Performance', {
      timestamp: new Date().toISOString(),
      type: 'PERFORMANCE',
      ...metric
    });
  }
}

// Default medical audit logger for backward compatibility
export class DefaultMedicalAuditLogger extends MedicalAuditLogger {}
