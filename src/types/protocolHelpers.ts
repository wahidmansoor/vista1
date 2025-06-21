/**
 * Protocol Helper Types
 * Utility types and interfaces for protocol-related functionality
 */

import type {
  Protocol,
  Drug,
  PreMedication,
  PostMedication,
  SupportiveCareItem,
  ToxicityMonitoring,
  DoseModification,
  Interactions,
  RescueAgent,
  Eligibility,
  Medication,
  Test,
  MonitoringItem,
  SupportiveCare
} from './protocolUpdated'; // Adjusted import path

// Helper interface for dose modification levels
export interface DoseModificationLevels {
  levels: {
    [key: string]: DoseModification;
  };
}

// Protocol with enhanced dose modifications
export interface ProtocolWithDoseModifications extends Omit<Protocol, 'dose_reductions'> {
  dose_reductions?: DoseModificationLevels;
}

// Helper function to get dose modification levels
export function getDoseModificationLevels(protocol: ProtocolWithDoseModifications): any {
  if (!protocol.dose_reductions?.levels || typeof protocol.dose_reductions.levels !== 'object') {
    return {};
  }
  
  return protocol.dose_reductions.levels;
}

// Helper function to check if protocol has dose modifications
export function hasDoseModifications(protocol: ProtocolWithDoseModifications): boolean {
  return !!(protocol.dose_reductions?.levels && typeof protocol.dose_reductions.levels === 'object');
}
