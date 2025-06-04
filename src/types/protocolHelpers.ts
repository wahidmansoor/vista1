// src/types/protocolHelpers.ts
import { Drug, Protocol, SupportiveCareItem } from './protocol';

/**
 * Protocol Helper Utilities
 * 
 * This file contains utility functions for working with Protocol data structures
 * including validation, extraction, and data manipulation helpers.
 */

// Type guard functions
function isSupportiveCareObject(item: any): item is { required: any[]; optional: any[] } {
  return item && typeof item === 'object' && ('required' in item || 'optional' in item);
}

function isTestObject(item: any): item is { baseline: any[]; monitoring: any[] } {
  return item && typeof item === 'object' && ('baseline' in item || 'monitoring' in item);
}

function hasToxicityParameters(item: any): item is { parameters: any[] } {
  return item && typeof item === 'object' && 'parameters' in item && Array.isArray(item.parameters);
}

/**
 * Gets a list of all drug names from a protocol
 * @param protocol The protocol to extract drug names from
 * @returns Array of unique drug names
 */
export const getDrugNames = (protocol: Protocol): string[] => {
  if (!protocol?.treatment?.drugs || !Array.isArray(protocol.treatment.drugs)) {
    return [];
  }
  
  return [...new Set(protocol.treatment.drugs.map(drug => drug.name))];
};

/**
 * Find a specific drug in the protocol by name (case-insensitive)
 * @param protocol The protocol to search in
 * @param drugName The drug name to search for
 * @returns The found drug object or undefined if not found
 */
export const findDrugByName = (protocol: Protocol, drugName: string): Drug | undefined => {
  if (!protocol?.treatment?.drugs || !Array.isArray(protocol.treatment.drugs)) {
    return undefined;
  }
  
  return protocol.treatment.drugs.find(
    drug => drug.name.toLowerCase() === drugName.toLowerCase()
  );
};

/**
 * Extracts all supportive care items from the protocol
 * @param protocol The protocol to extract from
 * @returns Array of supportive care items
 */
export const getSupportiveCareItems = (protocol: Protocol): SupportiveCareItem[] => {
  const items: SupportiveCareItem[] = [];
  
  // Check supportive_care section
  if (protocol.supportive_care) {
    if (isSupportiveCareObject(protocol.supportive_care)) {
      // Add required supportive care
      if (Array.isArray(protocol.supportive_care.required)) {
        protocol.supportive_care.required.forEach((drug: any) => {
          items.push({
            name: drug.name,
            dose: drug.dose,
            timing: drug.timing,
            route: drug.route
          });
        });
      }
      
      // Add optional supportive care
      if (Array.isArray(protocol.supportive_care.optional)) {
        protocol.supportive_care.optional.forEach((drug: any) => {
          items.push({
            name: drug.name,
            dose: drug.dose,
            timing: drug.timing,
            route: drug.route
          });
        });
      }
    } else if (Array.isArray(protocol.supportive_care)) {
      items.push(...protocol.supportive_care.map((item: any) => item.name || String(item)));
    }
  }
  
  // Check supportive_meds array
  if (Array.isArray(protocol.supportive_meds)) {
    protocol.supportive_meds.forEach((drug: any) => {
      items.push({
        name: drug.name,
        dose: drug.dose,
        timing: drug.timing,
        route: drug.route
      });
    });
  }
  
  return items;
};

/**
 * Gets all monitoring parameters from various protocol sections
 * @param protocol The protocol to extract from
 * @returns Array of unique monitoring parameters
 */
export const getMonitoringParameters = (protocol: Protocol): string[] => {
  const parameters: string[] = [];
  
  // Get baseline tests
  if (protocol.tests) {
    if (isTestObject(protocol.tests)) {
      if (Array.isArray(protocol.tests.baseline)) {
        parameters.push(...protocol.tests.baseline.map((test: any) => test.name || String(test)));
      }
      
      // Get monitoring tests
      if (Array.isArray(protocol.tests.monitoring)) {
        parameters.push(...protocol.tests.monitoring.map((test: any) => test.name || String(test)));
      }
    } else if (Array.isArray(protocol.tests)) {
      parameters.push(...protocol.tests.map((item: any) => item.name || String(item)));
    }
  }
  
  // Get monitoring parameters
  if (protocol.toxicity_monitoring && hasToxicityParameters(protocol.toxicity_monitoring)) {
    parameters.push(...protocol.toxicity_monitoring.parameters.map((param: any) => param.name || String(param)));
  }
  
  // Get baseline monitoring
  if (protocol.monitoring?.baseline && Array.isArray(protocol.monitoring.baseline)) {
    parameters.push(...protocol.monitoring.baseline.map((monitor: any) => monitor.parameter || monitor.name || String(monitor)));
  }
  
  // Get ongoing monitoring
  if (protocol.monitoring?.ongoing && Array.isArray(protocol.monitoring.ongoing)) {
    parameters.push(...protocol.monitoring.ongoing.map((monitor: any) => monitor.parameter || monitor.name || String(monitor)));
  }
  
  // Return unique parameters
  return [...new Set(parameters)];
};

/**
 * Checks if a protocol has specific dose modifications
 * @param protocol The protocol to check
 * @param modificationType The type of modification to check for
 * @returns boolean indicating if modifications exist
 */
export const hasDoseModifications = (
  protocol: Protocol, 
  modificationType: 'hematological' | 'nonHematological' | 'renal' | 'hepatic'
): boolean => {
  if (!protocol.dose_modifications) {
    return false;
  }
  
  const modifications = protocol.dose_modifications[modificationType];
  return Array.isArray(modifications) && modifications.length > 0;
};

/**
 * Extracts dose reduction information if available
 * @param protocol The protocol to extract from
 * @returns Dose reduction levels or null if not available
 */
export const getDoseReductionLevels = (protocol: Protocol): Record<string, any> | null => {
  if (!protocol.dose_reductions?.levels || typeof protocol.dose_reductions.levels !== 'object') {
    return null;
  }
  
  return protocol.dose_reductions.levels;
};

/**
 * Gets all precautions from various sections of the protocol
 * @param protocol The protocol to extract from
 * @returns Array of unique precautions
 */
export const getAllPrecautions = (protocol: Protocol): string[] => {
  const precautions: string[] = [];
  
  // Get main precautions
  if (Array.isArray(protocol.precautions)) {
    precautions.push(...protocol.precautions);
  }
  
  // Get interaction precautions
  if (protocol.interactions?.precautions && Array.isArray(protocol.interactions.precautions)) {
    precautions.push(...protocol.interactions.precautions);
  }
  
  // Get contraindications from interactions
  if (protocol.interactions?.contraindications && Array.isArray(protocol.interactions.contraindications)) {
    precautions.push(...protocol.interactions.contraindications);
  }
  
  // Get drug-specific contraindications
  if (protocol.treatment?.drugs && Array.isArray(protocol.treatment.drugs)) {
    protocol.treatment.drugs.forEach(drug => {
      if (Array.isArray(drug.contraindications)) {
        precautions.push(...drug.contraindications.map(item => `${drug.name}: ${item}`));
      }
    });
  }
  
  // Return unique precautions
  return [...new Set(precautions)];
};

/**
 * Checks if a protocol contains a specific drug (case-insensitive partial match)
 * @param protocol The protocol to check
 * @param drugName The drug name to search for
 * @returns boolean indicating if the drug is found
 */
export const containsDrug = (protocol: Protocol, drugName: string): boolean => {
  if (!protocol?.treatment?.drugs || !Array.isArray(protocol.treatment.drugs)) {
    return false;
  }
  
  const normalizedDrugName = drugName.toLowerCase();
  return protocol.treatment.drugs.some(drug => 
    drug.name.toLowerCase().includes(normalizedDrugName)
  );
};

/**
 * Extracts all reference information from a protocol
 * @param protocol The protocol to extract from
 * @returns Array of references
 */
export const getReferences = (protocol: Protocol): string[] => {
  if (!Array.isArray(protocol.reference_list)) {
    return [];
  }
  
  return protocol.reference_list;
};

/**
 * Gets AI-generated warnings if available
 * @param protocol The protocol to extract from
 * @returns Array of AI warnings or empty array if none
 */
export const getAIWarnings = (protocol: Protocol): string[] => {
  if (!protocol.ai_notes?.warnings || !Array.isArray(protocol.ai_notes.warnings)) {
    return [];
  }
  
  return protocol.ai_notes.warnings;
};

/**
 * Gets AI-generated recommendations if available
 * @param protocol The protocol to extract from
 * @returns Array of AI recommendations or empty array if none
 */
export const getAIRecommendations = (protocol: Protocol): string[] => {
  if (!protocol.ai_notes?.recommendations || !Array.isArray(protocol.ai_notes.recommendations)) {
    return [];
  }
  
  return protocol.ai_notes.recommendations;
};

/**
 * Creates a simplified protocol summary for display
 * @param protocol The protocol to summarize
 * @returns Object with key summary information
 */
export const createProtocolSummary = (protocol: Protocol): Record<string, any> => {
  return {
    id: protocol.id,
    code: protocol.code,
    tumour_group: protocol.tumour_group,
    treatment_intent: protocol.treatment_intent || '',
    drugs: getDrugNames(protocol),
    has_dose_modifications: !!(
      protocol.dose_modifications && 
      Object.values(protocol.dose_modifications).some(mods => 
        Array.isArray(mods) && mods.length > 0
      )
    ),
    has_supportive_care: !!(
      getSupportiveCareItems(protocol).length > 0
    ),
    has_monitoring: !!(
      getMonitoringParameters(protocol).length > 0
    ),
    created_at: protocol.created_at || '',
    last_reviewed: protocol.last_reviewed || '',
    summary: protocol.summary || ''
  };
};

/**
 * Compares two protocols for equivalence
 * @param protocol1 First protocol to compare
 * @param protocol2 Second protocol to compare
 * @returns boolean indicating if protocols are functionally equivalent
 */
export const areProtocolsEquivalent = (protocol1: Protocol, protocol2: Protocol): boolean => {
  // Check required fields
  if (
    protocol1.id !== protocol2.id ||
    protocol1.code !== protocol2.code ||
    protocol1.tumour_group !== protocol2.tumour_group
  ) {
    return false;
  }
  
  // Compare drug lists
  const drugs1 = getDrugNames(protocol1).sort();
  const drugs2 = getDrugNames(protocol2).sort();
  
  if (drugs1.length !== drugs2.length) {
    return false;
  }
  
  for (let i = 0; i < drugs1.length; i++) {
    if (drugs1[i] !== drugs2[i]) {
      return false;
    }
  }
  
  return true;
};
