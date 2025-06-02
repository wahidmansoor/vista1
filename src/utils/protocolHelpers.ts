import type { 
  Protocol, 
  Drug, 
  Eligibility, 
  Medications, 
  SupportiveCare, 
  SupportiveCareItem, // Added
  ToxicityMonitoring, 
  DoseModification,
  RescueAgent,
  Interactions,
  DrugClass
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
 * Handles both inclusion and exclusion criteria from the new Eligibility interface
 * @param protocol The protocol object
 * @param type Optional parameter to specify which criteria to return ('inclusion', 'exclusion', or 'all')
 * @returns Array of eligibility criteria strings
 */
export const getProtocolEligibility = (
  protocol?: Protocol, 
  type: 'inclusion' | 'exclusion' | 'all' = 'all'
): string[] => {
  if (!protocol?.eligibility) return [];
  
  // Handle new structured eligibility format
  if (typeof protocol.eligibility === 'object' && protocol.eligibility !== null) {
    const eligibility = protocol.eligibility;
    
    // Return specific criteria type if requested
    if (type === 'inclusion') {
      return eligibility.inclusion_criteria || [];
    }
    
    if (type === 'exclusion') {
      return eligibility.exclusion_criteria || [];
    }
    
    // Default: return all criteria combined
    return [
      ...(eligibility.inclusion_criteria || []),
      ...(eligibility.exclusion_criteria || [])
    ];
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
  if (Array.isArray((protocol as any).supportive_meds)) {
    (protocol as any).supportive_meds.forEach((drug: any) => {
      items.push({
        name: drug.name,
        dose: drug.dose,
        timing: drug.timing,
        route: drug.route
      });
    });
  }
  
  // Check individual drugs for supportive care items
  if (protocol.treatment?.drugs) {
    protocol.treatment.drugs.forEach(drug => {
      if (Array.isArray(drug.supportiveCare)) {
        drug.supportiveCare.forEach(item => {
          if (typeof item === 'string') {
            items.push({ name: item });
          } else if (typeof item === 'object' && item !== null) {
            items.push(item as SupportiveCareItem);
          }
        });
      }
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
  if (protocol.tests?.baseline && Array.isArray(protocol.tests.baseline)) {
    parameters.push(...protocol.tests.baseline);
  }
  
  // Get monitoring tests
  if (protocol.tests?.monitoring && Array.isArray(protocol.tests.monitoring)) {
    parameters.push(...protocol.tests.monitoring);
  }
  
  // Get monitoring parameters from toxicity_monitoring
  if (protocol.toxicity_monitoring?.parameters && Array.isArray(protocol.toxicity_monitoring.parameters)) {
    parameters.push(...protocol.toxicity_monitoring.parameters);
  }
  
  // Get baseline monitoring from monitoring object
  if (protocol.monitoring?.baseline && Array.isArray(protocol.monitoring.baseline)) {
    parameters.push(...protocol.monitoring.baseline);
  }
  
  // Get ongoing monitoring from monitoring object
  if (protocol.monitoring?.ongoing && Array.isArray(protocol.monitoring.ongoing)) {
    parameters.push(...protocol.monitoring.ongoing);
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
