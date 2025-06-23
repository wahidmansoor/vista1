import { ConfidenceConfig, QueryCategory } from './types';
import { LogLevel } from '../utils/MedicalAuditLogger';

export class ConfidenceConfigFactory {
  static createDefaultConfig(): ConfidenceConfig {
    return {
      thresholds: {
        diagnosis: {
          minimumOverall: 0.8,
          minimumEvidence: 0.75,
          minimumContext: 0.7,
          requiresProfessionalConsult: 0.85
        },
        treatment: {
          minimumOverall: 0.85,
          minimumEvidence: 0.8,
          minimumContext: 0.75,
          requiresProfessionalConsult: 0.9
        },
        medication: {
          minimumOverall: 0.9,
          minimumEvidence: 0.85,
          minimumContext: 0.8,
          requiresProfessionalConsult: 0.95
        },
        emergency: {
          minimumOverall: 0.95,
          minimumEvidence: 0.9,
          minimumContext: 0.85,
          requiresProfessionalConsult: 0.98
        },
        general: {
          minimumOverall: 0.7,
          minimumEvidence: 0.6,
          minimumContext: 0.6,
          requiresProfessionalConsult: 0.8
        }
      },
      evidenceWeights: {
        research: 0.4,
        guidelines: 0.4,
        consensus: 0.2
      },
      contextFactors: [
        'patientHistory',
        'currentMedications',
        'labResults',
        'imaging',
        'symptoms',
        'riskFactors',
        'comorbidities'
      ],
      uncertaintyIndicators: [
        'uncertain',
        'unclear',
        'possible',
        'might',
        'may',
        'could',
        'potentially',
        'limited data',
        'insufficient evidence',
        'more research needed'
      ],
      minimumEvidenceSources: 3,
      dataVersion: '1.0.0',
      loggerConfig: {
        retentionDays: 90,
        logLevel: 'INFO',
        enableAnonymization: true
      }
    };
  }

  static createConfig(overrides: Partial<ConfidenceConfig> = {}): ConfidenceConfig {
    return {
      ...this.createDefaultConfig(),
      ...overrides,
      thresholds: {
        ...this.createDefaultConfig().thresholds,
        ...(overrides.thresholds || {})
      }
    };
  }

  static createEmergencyConfig(): ConfidenceConfig {
    return this.createConfig({
      thresholds: {
        ...this.createDefaultConfig().thresholds,
        emergency: {
          minimumOverall: 0.98,
          minimumEvidence: 0.95,
          minimumContext: 0.9,
          requiresProfessionalConsult: 0.99
        }
      },
      loggerConfig: {
        retentionDays: 180,
        logLevel: 'DEBUG',
        enableAnonymization: true
      }
    });
  }

  static createStrictConfig(): ConfidenceConfig {
    const baseConfig = this.createDefaultConfig();
    const stricterThresholds = Object.entries(baseConfig.thresholds).reduce(
      (acc, [category, threshold]) => ({
        ...acc,
        [category]: {
          minimumOverall: Math.min(threshold.minimumOverall + 0.1, 0.99),
          minimumEvidence: Math.min(threshold.minimumEvidence + 0.1, 0.99),
          minimumContext: Math.min(threshold.minimumContext + 0.1, 0.99),
          requiresProfessionalConsult: Math.min(threshold.requiresProfessionalConsult + 0.05, 0.99)
        }
      }),
      {} as Record<QueryCategory, typeof baseConfig.thresholds[QueryCategory]>
    );

    return this.createConfig({
      thresholds: stricterThresholds,
      minimumEvidenceSources: 5,
      loggerConfig: {
        retentionDays: 180,
        logLevel: 'DEBUG',
        enableAnonymization: true
      }
    });
  }
}
