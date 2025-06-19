export interface AssessmentStartInput {
  type: string;
  [key: string]: unknown;
}

export interface AssessmentCompleteResult {
  type: string;
  [key: string]: unknown;
}

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL'
}

export enum LogCategory {
  SECURITY = 'SECURITY',
  PERFORMANCE = 'PERFORMANCE',
  AI_INTERACTION = 'AI_INTERACTION',
  CLINICAL_DECISION = 'CLINICAL_DECISION',
  SYSTEM = 'SYSTEM',
  COMPLIANCE = 'COMPLIANCE'
}

export interface MedicalAuditLoggerConfig {
  retentionDays: number;
  logLevel: LogLevel;
  enableAnonymization: boolean;
}

export class MedicalAuditLogger<
  TInput extends AssessmentStartInput = AssessmentStartInput,
  TResult extends AssessmentCompleteResult = AssessmentCompleteResult
> {
  private static instance: MedicalAuditLogger;
  private config?: MedicalAuditLoggerConfig;

  constructor(config?: MedicalAuditLoggerConfig) {
    this.config = config;
  }

  static getInstance(config?: MedicalAuditLoggerConfig): MedicalAuditLogger {
    if (!MedicalAuditLogger.instance) {
      MedicalAuditLogger.instance = new MedicalAuditLogger(config);
    }
    return MedicalAuditLogger.instance;
  }

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

  async logAiInteraction(
    model: string,
    prompt: string,
    tokens: { prompt: number; completion: number; total: number },
    responseTime: number,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    await this.log('AI Interaction', {
      timestamp: new Date().toISOString(),
      type: 'AI_INTERACTION',
      model,
      prompt: prompt.substring(0, 200) + (prompt.length > 200 ? '...' : ''),
      tokens,
      responseTime,
      metadata
    });
  }

  async logPerformance(
    operation: string,
    responseTime: number,
    tokenUsage?: { prompt: number; completion: number; total: number },
    metadata?: Record<string, unknown>
  ): Promise<void> {
    await this.log('Performance', {
      timestamp: new Date().toISOString(),
      type: 'PERFORMANCE',
      operation,
      responseTime,
      tokenUsage,
      metadata
    });
  }

  protected async log(action: string, data: Record<string, unknown>): Promise<void> {
    // Implement actual logging logic here (e.g., to a secure medical audit trail)
    console.log(`[Medical Audit] ${action}:`, JSON.stringify(data, null, 2));
  }
}

// Specialized performance logger for confidence service
export class PerformanceAuditLogger extends MedicalAuditLogger {
  async logPerformance(
    operation: string,
    responseTime: number,
    tokenUsage?: { prompt: number; completion: number; total: number },
    metadata?: Record<string, unknown>
  ): Promise<void> {
    await this.log('Performance', {
      timestamp: new Date().toISOString(),
      type: 'PERFORMANCE',
      operation,
      responseTime,
      tokenUsage,
      metadata
    });
  }
}

// Default medical audit logger for backward compatibility
export class DefaultMedicalAuditLogger extends MedicalAuditLogger {}
