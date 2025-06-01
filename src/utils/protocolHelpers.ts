import type { 
  Protocol, 
  Drug, 
  Medications, 
  SupportiveCare, 
  ToxicityMonitoring, 
  DoseModification,
  RescueAgent,
  Interactions,
  DrugClass,
  ProtocolNote,
  ProtocolDrug,
  Test,
  ProtocolEligibility,
  SupportiveCareItem,
  Monitoring // Added Monitoring for explicit typing
} from '../types/protocol';

/**
 * Enhanced safeSplit function with better type handling and validation
 * Handles arrays, objects, JSON strings, and nested structures
 */
export const safeSplit = (value: any): string[] => {
  // Handle null/undefined cases
  if (value == null) return [];
  
  // Handle arrays
  if (Array.isArray(value)) {
    return value.map(item => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object') {
        // Extract meaningful data from objects
        return (item.name || item.drug || item.text || 
                JSON.stringify(item).replace(/[{}"\[\]]/g, ''))
                .trim();
      }
      return String(item);
    }).filter(Boolean); // Remove empty strings
  }
  
  // Handle strings - including potential JSON strings
  if (typeof value === 'string') {
    // Empty string check
    if (!value.trim()) return [];
    
    // JSON string detection
    if ((value.startsWith('[') && value.endsWith(']')) || 
        (value.startsWith('{') && value.endsWith('}'))) {
      try {
        const parsed = JSON.parse(value);
        return safeSplit(parsed); // Recursively process parsed JSON
      } catch (e) {
        // Not valid JSON, use standard string splitting
        return value.split(/[;,]/).map(s => s.trim()).filter(Boolean);
      }
    }
    
    return value.split(/[;,]/).map(s => s.trim()).filter(Boolean);
  }
  
  // Handle Medications object with required/optional structure
  if (typeof value === 'object') {
    // Handle nested medication objects (required/optional pattern)
    if ('required' in value || 'optional' in value) {
      const required = safeSplit(value.required || []);
      const optional = safeSplit(value.optional || []);
      return [...required, ...optional];
    }
    
    // Handle generic objects by extracting values
    return Object.values(value)
      .filter(v => v != null)
      .flatMap(v => safeSplit(v));
  }
  
  // Fallback for other types
  return [String(value)];
};

/**
 * Type guard to validate if a protocol has proper structure
 * Updated to match the new Protocol interface requirements
 */
export const isValidProtocol = (protocol: any): protocol is Protocol => {
  return (
    protocol && 
    typeof protocol === 'object' &&
    typeof protocol.id === 'string' &&
    typeof protocol.code === 'string' &&
    typeof protocol.tumour_group === 'string' &&
    protocol.treatment &&
    Array.isArray(protocol.treatment.drugs)
  );
};

/**
 * Type guard to validate if drugs list is properly formatted
 */
export const isValidDrugList = (drugs: any): drugs is Drug[] => {
  return (
    Array.isArray(drugs) && 
    drugs.length > 0 && 
    drugs.every(drug => 
      drug && 
      typeof drug === 'object' && 
      typeof drug.name === 'string'
    )
  );
};

/**
 * Returns drugs from a protocol with validation
 */
export const getProtocolDrugs = (protocol?: Protocol): Drug[] => {
  if (!protocol?.treatment?.drugs) return [];
  
  if (isValidDrugList(protocol.treatment.drugs)) {
    return protocol.treatment.drugs;
  }
  
  return [];
};;

/**
 * Get eligibility criteria as a string array
 */
export const getProtocolEligibility = (
  protocol?: Protocol,
  type: 'inclusion' | 'exclusion' | 'all' = 'all'
): string[] => {
  if (!protocol?.eligibility) return [];
  const eligibility = protocol.eligibility as ProtocolEligibility; // Cast to ProtocolEligibility
  if (typeof eligibility === 'object' && eligibility !== null) {
    const inclusionCriteria = eligibility.inclusion_criteria?.map(item => item.criterion) || [];
    const exclusionCriteria = eligibility.exclusion_criteria?.map(item => item.criterion) || [];
    if (type === 'inclusion') return inclusionCriteria;
    if (type === 'exclusion') return exclusionCriteria;
    return [...inclusionCriteria, ...exclusionCriteria];
  }
  // For legacy support, use safeSplit if eligibility is not properly structured
  return safeSplit(protocol.eligibility);
};

/**
 * Get protocol medications (pre/post) as string arrays
 * Handles the new Medications interface with required/optional structure
 */
export const getProtocolMedications = (
  protocol?: Protocol, 
  type: 'pre' | 'post' = 'pre',
  includeType: 'required' | 'optional' | 'all' = 'all'
): string[] => {
  const field = type === 'pre' ? 'pre_medications' : 'post_medications';
  if (!protocol || !protocol[field]) return [];
  
  const medications = protocol[field];
  
  // Handle structured medication format
  if (typeof medications === 'object' && medications !== null) {
    if (includeType === 'required') {
      return medications.required?.map(drug => formatDrugString(drug)) || [];
    }
    
    if (includeType === 'optional') {
      return medications.optional?.map(drug => formatDrugString(drug)) || [];
    }
    
    // Default: return all medications
    return [
      ...(medications.required?.map(drug => formatDrugString(drug)) || []),
      ...(medications.optional?.map(drug => formatDrugString(drug)) || [])
    ];
  }
  
  // Legacy support
  return safeSplit(protocol[field]);
};

/**
 * Check if a protocol object is missing critical data
 */
export const isMissingCriticalData = (protocol: Protocol): boolean => {
  if (!protocol.treatment) return true;
  if (!isValidDrugList(protocol.treatment.drugs)) return true;
  return false;
};

/**
 * Format a drug object as a readable string
 */
export const formatDrugString = (drug: any): string => {
  if (typeof drug === 'string') return drug;
  
  if (typeof drug === 'object' && drug !== null) {
    let displayText = drug.name || 'Unnamed medication';
    
    if (drug.dose) {
      displayText += ` ${drug.dose}`;
    }
    
    if (drug.timing) {
      displayText += ` (${drug.timing})`;
    }
    
    if (drug.administration && !displayText.includes(drug.administration)) {
      displayText += ` - ${drug.administration}`;
    }
    
    if (drug.route && !displayText.includes(drug.route)) {
      displayText += ` via ${drug.route}`;
    }
    
    return displayText;
  }
  
  return String(drug);
};

/**
 * Test if protocol data exists and is valid
 */
export const hasValidProtocolData = (protocol: any, field: keyof Protocol): boolean => {
  if (!protocol) return false;
  
  const value = protocol[field];
  
  // Check for empty arrays
  if (Array.isArray(value)) return value.length > 0;
  
  // Check for empty objects (but treat other objects as valid)
  if (value && typeof value === 'object') {
    return Object.keys(value).length > 0;
  }
  
  // For primitives, just check truthiness
  return !!value;
};

/**
 * Extract toxicity monitoring parameters from a protocol
 * @param protocol The protocol object
 * @returns Toxicity monitoring data or null if not available
 */
export const getProtocolToxicityMonitoring = (protocol?: Protocol): ToxicityMonitoring | null => {
  if (!protocol?.toxicity_monitoring) return null;
  
  return protocol.toxicity_monitoring;
};

/**
 * Extract dose modifications from a protocol
 * @param protocol The protocol object
 * @param type Optional parameter to specify which modifications to return
 * @returns Dose modification data or array of strings for specific type
 */
export const getProtocolDoseModifications = (
  protocol?: Protocol,
  type?: keyof DoseModification
): DoseModification | string[] => {
  if (!protocol?.dose_modifications) {
    // Return empty array or empty object depending on requested type
    return type ? [] : { 
      hematological: [], 
      nonHematological: [], 
      renal: [], 
      hepatic: [] 
    };
  }
  
  // Return specific modification type if requested
  if (type) {
    return protocol.dose_modifications[type] || [];
  }
  
  // Return entire dose modification object
  return protocol.dose_modifications;
};

/**
 * Extract rescue agents from a protocol
 * @param protocol The protocol object
 * @returns Array of rescue agents or empty array if not available
 */
export const getProtocolRescueAgents = (protocol?: Protocol): RescueAgent[] => {
  if (!protocol?.rescue_agents || !Array.isArray(protocol.rescue_agents)) {
    return [];
  }
  
  return protocol.rescue_agents;
};

/**
 * Extract drug interactions from a protocol
 * @param protocol The protocol object
 * @param type Optional parameter to specify which interactions to return
 * @returns All interactions or specific type
 */
export const getProtocolInteractions = (
  protocol?: Protocol,
  type?: keyof Interactions
): Interactions | string[] => {
  if (!protocol?.interactions) {
    return type ? [] : { drugs: [], contraindications: [], precautions: [] };
  }
  
  if (type) {
    return protocol.interactions[type] || [];
  }
  
  return protocol.interactions;
};

/**
 * Extract protocol references
 * @param protocol The protocol object
 * @returns Array of reference strings
 */
export const getProtocolReferences = (protocol?: Protocol): string[] => {
  if (!protocol?.reference_list || !Array.isArray(protocol.reference_list)) {
    return [];
  }
  
  return protocol.reference_list;
};

/**
 * Format protocol identification information
 * @param protocol The protocol object
 * @returns Formatted protocol identification string
 */
export const formatProtocolIdentification = (protocol?: Protocol): string => {
  if (!protocol) return 'Unknown Protocol';
  
  let result = `Protocol: ${protocol.code}`;
  
  if (protocol.tumour_group) {
    result += ` (${protocol.tumour_group})`;
  }
  
  if (protocol.treatment_intent) {
    result += ` - ${protocol.treatment_intent}`;
  }
  
  return result;
};

/**
 * Get protocol review status and date information
 * @param protocol The protocol object
 * @returns Object with review status and date information
 */
export const getProtocolReviewStatus = (protocol?: Protocol): { 
  lastReviewed: string | null; 
  isOutdated: boolean; 
  daysSinceReview: number | null;
} => {
  if (!protocol?.last_reviewed) {
    return {
      lastReviewed: null,
      isOutdated: true,
      daysSinceReview: null
    };
  }
  
  try {
    const lastReviewDate = new Date(protocol.last_reviewed);
    const currentDate = new Date();
    const daysDiff = Math.floor((currentDate.getTime() - lastReviewDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Consider protocol outdated if last review was more than 180 days ago
    const isOutdated = daysDiff > 180;
    
    return {
      lastReviewed: protocol.last_reviewed,
      isOutdated,
      daysSinceReview: daysDiff
    };
  } catch (e) {
    console.warn('Invalid date format for last_reviewed:', protocol.last_reviewed);
    return {
      lastReviewed: protocol.last_reviewed,
      isOutdated: true,
      daysSinceReview: null
    };
  }
};

/**
 * Extract AI-generated recommendations from a protocol
 * @param protocol The protocol object
 * @returns Object with recommendations and warnings
 */
export const getProtocolAIInsights = (protocol?: Protocol): { 
  recommendations: string[]; 
  warnings: string[];
} => {
  if (!protocol?.ai_notes) {
    return {
      recommendations: [],
      warnings: []
    };
  }
  
  return {
    recommendations: protocol.ai_notes.recommendations || [],
    warnings: protocol.ai_notes.warnings || []
  };
};

/**
 * Get protocol cycle information
 * @param protocol The protocol object
 * @returns Formatted cycle information or null
 */
export const getProtocolCycleInfo = (protocol?: Protocol): string | null => {
  return protocol?.cycle_info || null;
};

/**
 * Extract dose reduction levels and criteria
 * @param protocol The protocol object
 * @returns Object with dose reduction information
 */
export const getProtocolDoseReductions = (protocol?: Protocol): {
  levels: Record<string, any>; 
  criteria: string[];
} => {
  if (!protocol?.dose_reductions) {
    return {
      levels: {},
      criteria: []
    };
  }
  
  return protocol.dose_reductions;
};

/**
 * Check if a protocol has complete information in a specific area
 * @param protocol The protocol object
 * @param area The area to check for completeness
 * @returns Boolean indicating if the area has complete information
 */
export const hasCompleteInformation = (
  protocol: Protocol, 
  area: 'eligibility' | 'medications' | 'monitoring' | 'toxicity' | 'interactions'
): boolean => {
  if (!protocol) return false;
  
  switch (area) {
    case 'eligibility':
      return (
        !!protocol.eligibility &&
        Array.isArray(protocol.eligibility.inclusion_criteria) &&
        protocol.eligibility.inclusion_criteria.length > 0
      );
    
    case 'medications':
      return (
        !!protocol.pre_medications &&
        Array.isArray(protocol.pre_medications.required) &&
        protocol.pre_medications.required.length > 0
      );
    
    case 'monitoring':
      return (
        !!protocol.monitoring &&
        Array.isArray(protocol.monitoring.baseline) &&
        protocol.monitoring.baseline.length > 0 &&
        Array.isArray(protocol.monitoring.ongoing) &&
        protocol.monitoring.ongoing.length > 0
      );
    
    case 'toxicity':
      return (
        !!protocol.toxicity_monitoring &&
        Array.isArray(protocol.toxicity_monitoring.parameters) &&
        protocol.toxicity_monitoring.parameters.length > 0 &&
        !!protocol.toxicity_monitoring.frequency
      );
    
    case 'interactions':
      return (
        !!protocol.interactions &&
        Array.isArray(protocol.interactions.drugs) &&
        protocol.interactions.drugs.length > 0
      );
    
    default:
      return false;
  }
};

/**
 * Extract all drug names from a protocol
 * @param protocol The protocol object
 * @returns Array of drug names
 */
export const getAllProtocolDrugNames = (protocol?: Protocol): string[] => {
  if (!protocol) return [];
  
  const drugNames = new Set<string>();
  
  // Treatment drugs
  if (protocol.treatment?.drugs) {
    protocol.treatment.drugs.forEach(drug => {
      if (drug.name) drugNames.add(drug.name);
    });
  }
  
  // Pre medications
  if (protocol.pre_medications?.required) {
    protocol.pre_medications.required.forEach(drug => {
      if (drug.name) drugNames.add(drug.name);
    });
  }
  
  if (protocol.pre_medications?.optional) {
    protocol.pre_medications.optional.forEach(drug => {
      if (drug.name) drugNames.add(drug.name);
    });
  }
  
  // Post medications
  if (protocol.post_medications?.required) {
    protocol.post_medications.required.forEach(drug => {
      if (drug.name) drugNames.add(drug.name);
    });
  }
  
  if (protocol.post_medications?.optional) {
    protocol.post_medications.optional.forEach(drug => {
      if (drug.name) drugNames.add(drug.name);
    });
  }
  
  // Supportive medications
  if (protocol.supportive_meds) {
    protocol.supportive_meds.forEach(drug => {
      if (drug.name) drugNames.add(drug.name);
    });
  }
  
  return Array.from(drugNames);
};

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
 * This function primarily processes `protocol.supportive_care` and `protocol.supportive_meds`.
 * It does NOT process `supportiveCare` from individual drugs in `protocol.treatment.drugs`
 * as `ProtocolDrug` type does not define `supportiveCare`.
 * @param protocol The protocol to extract from
 * @returns Array of supportive care items
 */
export const getSupportiveCareItems = (protocol: Protocol): SupportiveCareItem[] => {
  const items: SupportiveCareItem[] = [];
  
  // Check supportive_care section
  if (protocol.supportive_care) {
    // Add required supportive care
    if (Array.isArray(protocol.supportive_care.required)) {
      protocol.supportive_care.required.forEach(drug => {
        items.push({
          name: drug.name,
          dose: drug.dose,
          timing: drug.timing,
          route: drug.route
          // purpose is not in Drug, but in SupportiveCareItem. If needed, map carefully.
        });
      });
    }
    
    // Add optional supportive care
    if (Array.isArray(protocol.supportive_care.optional)) {
      protocol.supportive_care.optional.forEach(drug => {
        items.push({
          name: drug.name,
          dose: drug.dose,
          timing: drug.timing,
          route: drug.route
        });
      });
    }
  }
  
  // Check supportive_meds array (legacy or alternative field)
  // Assuming supportive_meds contains items compatible with SupportiveCareItem or Drug
  if (Array.isArray((protocol as any).supportive_meds)) {
    ((protocol as any).supportive_meds).forEach((drug: Drug | SupportiveCareItem) => {
      items.push({
        name: drug.name,
        dose: drug.dose,
        timing: drug.timing,
        route: drug.route,
        purpose: (drug as SupportiveCareItem).purpose // Include purpose if available
      });
    });
  }
  
  // The section trying to access drug.supportiveCare from protocol.treatment.drugs
  // was removed because ProtocolDrug does not have a supportiveCare field.
  
  return items;
};

/**
 * Helper function to extract names from Test objects or use strings directly
 */
const extractTestNames = (tests: (Test | string)[] | undefined): string[] => {
  if (!tests) return [];
  return tests.flatMap(test => {
    if (typeof test === 'string') return [test];
    if ('name' in test && test.name) {
      const results: string[] = [test.name];
      if (Array.isArray(test.parameters)) {
        results.push(...test.parameters);
      }
      return results;
    }
    return [];
  }).filter(Boolean); // Filter out any null/undefined entries if objects are malformed
};

/**
 * Get all monitoring parameters from a protocol, including baseline and ongoing tests.
 */
export const getAllMonitoringParameters = (protocol?: Protocol): string[] => {
  if (!protocol) return [];
  const parametersSet = new Set<string>();

  // Process protocol.tests
  if (protocol.tests) {
    const { baseline, monitoring } = protocol.tests;
    if (baseline) {
      extractTestNames(baseline).forEach(p => parametersSet.add(p));
    }
    if (monitoring) {
      extractTestNames(monitoring).forEach(p => parametersSet.add(p));
    }
  }

  // Process protocol.toxicity_monitoring.parameters
  if (protocol.toxicity_monitoring?.parameters && Array.isArray(protocol.toxicity_monitoring.parameters)) {
    protocol.toxicity_monitoring.parameters.forEach(p => parametersSet.add(p));
  }

  // Process protocol.monitoring (cast to Monitoring type for safety)
  const monitoringData = protocol.monitoring as Monitoring;
  if (monitoringData) {
      if (monitoringData.baseline && Array.isArray(monitoringData.baseline)) {
        monitoringData.baseline.forEach((p: string) => parametersSet.add(p));
      }
      if (monitoringData.ongoing && Array.isArray(monitoringData.ongoing)) {
        monitoringData.ongoing.forEach((p: string) => parametersSet.add(p));
      }
  }
  
  return Array.from(parametersSet);
};

/**
 * Get supportive care information from various parts of a protocol.
 * Returns an array of strings describing the care items.
 */
export const getDrugSupportiveCare = (protocol?: Protocol): string[] => {
  if (!protocol) return [];
  const careInfoSet = new Set<string>();

  // Helper to format Drug or SupportiveCareItem into a string
  const formatCareItem = (item: Drug | SupportiveCareItem, context?: string): string | null => {
    if (typeof item === 'string') return context ? `${context}: ${item}` : item; // Should ideally not happen with typed items
    if (item && item.name) {
      let desc = item.name;
      if ('dose' in item && item.dose) desc += ` ${item.dose}`;
      if ('timing' in item && item.timing) desc += ` (${item.timing})`;
      if ('route' in item && item.route) desc += ` via ${item.route}`;
      if ('purpose' in item && item.purpose) desc += ` for ${item.purpose}`;
      return context ? `${context}: ${desc}` : desc;
    }
    return null;
  };
  
  const addCareItems = (items: Array<Drug | SupportiveCareItem> | undefined, context?: string) => {
    if (items && Array.isArray(items)) {
      items.forEach(item => {
        const formatted = formatCareItem(item, context);
        if (formatted) careInfoSet.add(formatted);
      });
    }
  };

  // From protocol.supportive_care
  if (protocol.supportive_care) {
    addCareItems(protocol.supportive_care.required, "Required Supportive Care");
    addCareItems(protocol.supportive_care.optional, "Optional Supportive Care");
    if (protocol.supportive_care.monitoring && Array.isArray(protocol.supportive_care.monitoring)) {
      protocol.supportive_care.monitoring.forEach(m => careInfoSet.add(`Monitoring for Supportive Care: ${m}`));
    }
  }

  // From protocol.supportive_meds
  if (protocol.supportive_meds && Array.isArray(protocol.supportive_meds)) {
    addCareItems(protocol.supportive_meds, "Supportive Meds");
  }
  
  // From Pre-medications
  if (protocol.pre_medications) {
    addCareItems(protocol.pre_medications.required, "Required Pre-medication");
    addCareItems(protocol.pre_medications.optional, "Optional Pre-medication");
  }

  // From Post-medications
  if (protocol.post_medications) {
    addCareItems(protocol.post_medications.required, "Required Post-medication");
    addCareItems(protocol.post_medications.optional, "Optional Post-medication");
  }
  
  // Individual drugs in protocol.treatment.drugs might have supportiveCare if type Drug is used
  // However, ProtocolDrug interface itself doesn't define it.
  // If drugs in protocol.treatment.drugs are of type Drug (which includes supportiveCare)
  // then this section would be relevant. For now, assuming ProtocolDrug type is strictly followed.
  // if (protocol.treatment?.drugs) {
  //   protocol.treatment.drugs.forEach((drug: ProtocolDrug | Drug) => {
  //     if ('supportiveCare' in drug && drug.supportiveCare) {
  //        // This requires drug to potentially be of type Drug, not just ProtocolDrug
  //        // And SupportiveCareItem to be correctly typed
  //       (drug.supportiveCare as Array<string | SupportiveCareItem>).forEach(scItem => {
  //         if (typeof scItem === 'string') {
  //           careInfoSet.add(`${drug.name} (Support): ${scItem}`);
  //         } else if (scItem.name) {
  //           careInfoSet.add(`${drug.name} (Support): ${formatCareItem(scItem)}`);
  //         }
  //       });
  //     }
  //   });
  // }

  return Array.from(careInfoSet);
};

/**
 * Checks if a protocol has specific dose modifications or any dose modifications.
 */
export const hasDoseModifications = (
  protocol: Protocol,
  modificationType?: keyof DoseModification // Optional: if provided, checks for specific type
): boolean => {
  if (!protocol.dose_modifications) {
    return false;
  }
  if (modificationType) {
    const modifications = protocol.dose_modifications[modificationType];
    return Array.isArray(modifications) && modifications.length > 0;
  }
  // If no specific type, check if any dose modification array has items
  return Object.values(protocol.dose_modifications).some(arr => Array.isArray(arr) && arr.length > 0);
};

/**
 * Extracts dose reduction levels information if available
 */
export const getDoseReductionLevels = (protocol: Protocol): Record<string, any> | null => {
  if (!protocol.dose_reductions?.levels || typeof protocol.dose_reductions.levels !== 'object') {
    return null;
  }
  return protocol.dose_reductions.levels;
};

/**
 * Checks if a protocol contains a specific drug (case-insensitive partial match in name)
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
 * Creates a simplified protocol summary for display or logging
 */
export const createProtocolSummary = (protocol: Protocol): Record<string, any> => {
  return {
    id: protocol.id,
    code: protocol.code,
    tumour_group: protocol.tumour_group,
    treatment_intent: protocol.treatment_intent || protocol.overview?.treatment_intent || '',
    drugs: protocol.treatment?.drugs?.map(d => d.name) || [],
    has_dose_modifications: hasDoseModifications(protocol), // Checks for any dose modifications
    has_supportive_care: getDrugSupportiveCare(protocol).length > 0,
    has_monitoring: getAllMonitoringParameters(protocol).length > 0,
    created_at: protocol.created_at || '',
    last_reviewed: protocol.last_reviewed || protocol.overview?.last_reviewed || '',
    summary: protocol.summary || protocol.overview?.summary || ''
  };
};

/**
 * Compares two protocols for basic equivalence (ID, code, tumour group, and drug names).
 */
export const areProtocolsEquivalent = (protocol1?: Protocol, protocol2?: Protocol): boolean => {
  if (!protocol1 && !protocol2) return true; // Both null/undefined
  if (!protocol1 || !protocol2) return false; // One is null/undefined, the other is not

  if (
    protocol1.id !== protocol2.id ||
    protocol1.code !== protocol2.code ||
    protocol1.tumour_group !== protocol2.tumour_group
  ) {
    return false;
  }

  const drugs1 = (protocol1.treatment?.drugs?.map(d => d.name) || []).sort();
  const drugs2 = (protocol2.treatment?.drugs?.map(d => d.name) || []).sort();

  if (drugs1.length !== drugs2.length || !drugs1.every((val, index) => val === drugs2[index])) {
    return false;
  }
  return true;
};
