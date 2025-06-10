import type { EmergencyServiceConfig } from './types';

export const DEFAULT_EMERGENCY_CONFIG: EmergencyServiceConfig = {
  escalationThresholds: {
    immediate: 3,
    urgent: 2,
    routine: 1
  },
  notificationDelays: {
    initial: 0,
    reminder: 5 * 60 * 1000, // 5 minutes
    escalation: 15 * 60 * 1000 // 15 minutes
  },
  contactMethods: ['phone', 'email', 'sms', 'inApp']
};

export function createEmergencyConfig(
  overrides: Partial<EmergencyServiceConfig> = {}
): EmergencyServiceConfig {
  return {
    ...DEFAULT_EMERGENCY_CONFIG,
    ...overrides,
    escalationThresholds: {
      ...DEFAULT_EMERGENCY_CONFIG.escalationThresholds,
      ...(overrides.escalationThresholds || {})
    },
    notificationDelays: {
      ...DEFAULT_EMERGENCY_CONFIG.notificationDelays,
      ...(overrides.notificationDelays || {})
    }
  };
}

export function mapNumberToSeverity(level: number): 'immediate' | 'urgent' | 'routine' {
  if (level >= DEFAULT_EMERGENCY_CONFIG.escalationThresholds.immediate) return 'immediate';
  if (level >= DEFAULT_EMERGENCY_CONFIG.escalationThresholds.urgent) return 'urgent';
  return 'routine';
}

export function mapSeverityToNumber(severity: 'immediate' | 'urgent' | 'routine'): number {
  return DEFAULT_EMERGENCY_CONFIG.escalationThresholds[severity];
}
