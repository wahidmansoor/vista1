import { SafetySystem } from './SafetySystem';
import type { SafetySystemConfig } from './types';

export class SafetySystemFactory {
  static createForDrugInteractions(): SafetySystem {
    const config: SafetySystemConfig = {
      enabledChecks: [], // We'll add drug-specific checks after instantiation
      autoRemediate: false,
      strictMode: true,
      maxRetries: 3
    };
    return new SafetySystem(config);
  }

  static createForSymptomAssessment(): SafetySystem {
    const config: SafetySystemConfig = {
      enabledChecks: ['SYMPT-001', 'SYMPT-002'],
      autoRemediate: false,
      strictMode: true,
      maxRetries: 3
    };
    return new SafetySystem(config);
  }
}
