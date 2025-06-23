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
} from '../types/protocol'; // Adjusted import path

// Type guard to check for required/optional properties
function hasRequiredOptional(obj: any): obj is { required?: Medication[], optional?: Medication[] } { // Changed Drug[] to Medication[]
  return obj && typeof obj === 'object' && !Array.isArray(obj) && (obj.hasOwnProperty('required') || obj.hasOwnProperty('optional'));
}

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
  if (typeof protocol.eligibility === 'object' && !Array.isArray(protocol.eligibility) && protocol.eligibility !== null) { // Added !Array.isArray check
    const eligibility = protocol.eligibility as Eligibility; // Type assertion

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
  } else if (Array.isArray(protocol.eligibility)) { // Handle string array case
    return protocol.eligibility as string[];
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

  const medicationsField = protocol[field];

  // Handle structured medication format with type guard
  if (hasRequiredOptional(medicationsField)) {
    const medications = medicationsField as { required?: Medication[], optional?: Medication[] }; // Type assertion after guard, changed Drug to Medication
    if (includeType === 'required') {
      return medications.required?.map((drug: Medication) => formatDrugString(drug)) || []; // Changed Drug to Medication
    }

    if (includeType === 'optional') {
      return medications.optional?.map((drug: Medication) => formatDrugString(drug)) || []; // Changed Drug to Medication
    }

    // Default: return all medications
    return [
      ...(medications.required?.map((drug: Medication) => formatDrugString(drug)) || []),
      ...(medications.optional?.map((drug: Medication) => formatDrugString(drug)) || []) // Changed Drug to Medication
    ];
  } else if (Array.isArray(medicationsField)) {
    // Handle cases where it might be a direct array of Medications
    return medicationsField.map((drug: Medication) => formatDrugString(drug)); // Changed Drug to Medication
  }
  
  // Legacy support for simple string fields (if applicable, though schema suggests object/array)
  if (typeof medicationsField === 'string') {
    return safeSplit(medicationsField);
  }
  
  return [];
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
  type?: keyof Protocol['dose_modifications'] // Corrected type
): DoseModification[] | Protocol['dose_modifications'] => { // Adjusted return type
  if (!protocol?.dose_modifications) {
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
    // Corrected default return to match Interactions type
    return type ? [] : { drugs_to_avoid: [], contraindications: [], precautions_with_other_drugs: [] };
  }

  if (type) {
    // Ensure the property exists on interactions before accessing
    return protocol.interactions[type as keyof Interactions] || [];
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
  if (!protocol?.cycle_info) return null;

  if (typeof protocol.cycle_info === 'string') {
    return protocol.cycle_info;
  }

  if (Array.isArray(protocol.cycle_info)) {
    return protocol.cycle_info.join(', ');
  }

  // Handle CycleInfo object
  if (typeof protocol.cycle_info === 'object' && protocol.cycle_info !== null) {
    const { duration, totalCycles, schedule } = protocol.cycle_info;
    let info = '';
    if (duration) info += `Duration: ${duration}`;
    if (totalCycles) info += `${info ? ', ' : ''}Total Cycles: ${totalCycles}`;
    if (schedule) info += `${info ? ', ' : ''}Schedule: ${schedule}`;
    return info || null;
  }

  return null;
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
  // Safely access dose_reductions as it's not in the Protocol type
  const doseReductions = (protocol as any)?.dose_reductions;
  if (!doseReductions) {
    return {
      levels: {},
      criteria: []
    };
  }
  return doseReductions;
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
      // Handle Eligibility union type
      if (typeof protocol.eligibility === 'object' && protocol.eligibility !== null && !Array.isArray(protocol.eligibility)) {
        const eligibility = protocol.eligibility as Eligibility;
        return (
          !!eligibility.inclusion_criteria &&
          eligibility.inclusion_criteria.length > 0
        );
      } else if (Array.isArray(protocol.eligibility)) {
        return protocol.eligibility.length > 0;
      }
      return false;

    case 'medications':
      // Check PreMedication structure
      if (protocol.pre_medications && typeof protocol.pre_medications === 'object' && !Array.isArray(protocol.pre_medications)) {
        const preMeds = protocol.pre_medications as PreMedication;
        return (
          !!preMeds.required &&
          preMeds.required.length > 0
        );
      } else if (Array.isArray(protocol.pre_medications)) {
         return protocol.pre_medications.length > 0;
      }
      return false;

    case 'monitoring':
      // Check monitoring structure
      if (protocol.monitoring) {
        const baselineComplete = Array.isArray(protocol.monitoring.baseline) && protocol.monitoring.baseline.length > 0;
        const ongoingComplete = Array.isArray(protocol.monitoring.ongoing) && protocol.monitoring.ongoing.length > 0;
        return baselineComplete && ongoingComplete;
      }
      return false;

    case 'toxicity':
      // Check toxicity_monitoring structure
      if (protocol.toxicity_monitoring) {
        // monitoring_parameters is a string, not an array
        const paramsExist = typeof protocol.toxicity_monitoring.monitoring_parameters === 'string' && protocol.toxicity_monitoring.monitoring_parameters.length > 0;
        // frequency_details is a string, not frequency
        const freqExists = typeof protocol.toxicity_monitoring.frequency_details === 'string' && protocol.toxicity_monitoring.frequency_details.length > 0;
        return paramsExist && freqExists;
      }
      return false;

    case 'interactions':
      // Check interactions structure
      if (protocol.interactions) {
        // Use drugs_to_avoid
        return (
          !!protocol.interactions.drugs_to_avoid &&
          protocol.interactions.drugs_to_avoid.length > 0
        );
      }
      return false;

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
    protocol.treatment.drugs.forEach((drug: Drug) => { // Added Drug type
      if (drug.name) drugNames.add(drug.name);
    });
  }

  // Pre medications
  if (protocol.pre_medications) {
    if (Array.isArray(protocol.pre_medications)) {
      protocol.pre_medications.forEach((med: Medication) => { // Added Medication type
        if (med.name) drugNames.add(med.name);
      });
    } else if (typeof protocol.pre_medications === 'object') {
      const preMeds = protocol.pre_medications as PreMedication;
      preMeds.required?.forEach((med: Medication) => { // Added Medication type
        if (med.name) drugNames.add(med.name);
      });
      preMeds.optional?.forEach((med: Medication) => { // Added Medication type
        if (med.name) drugNames.add(med.name);
      });
    }
  }

  // Post medications
  if (protocol.post_medications) {
    if (Array.isArray(protocol.post_medications)) {
      protocol.post_medications.forEach((med: Medication) => { // Added Medication type
        if (med.name) drugNames.add(med.name);
      });
    } else if (typeof protocol.post_medications === 'object') {
      const postMeds = protocol.post_medications as PostMedication;
      postMeds.required?.forEach((med: Medication) => { // Added Medication type
        if (med.name) drugNames.add(med.name);
      });
      postMeds.optional?.forEach((med: Medication) => { // Added Medication type
        if (med.name) drugNames.add(med.name);
      });
    }
  }

  // Supportive medications (supportive_meds is SupportiveCare)
  if (protocol.supportive_meds) {
    const supportiveCare = protocol.supportive_meds as SupportiveCare; // Type assertion
    supportiveCare.required?.forEach((item: SupportiveCareItem) => { // Added SupportiveCareItem type
      if (item.name) drugNames.add(item.name);
    });
    supportiveCare.optional?.forEach((item: SupportiveCareItem) => { // Added SupportiveCareItem type
      if (item.name) drugNames.add(item.name);
    });
     supportiveCare.monitoring?.forEach((item: SupportiveCareItem) => { // Added SupportiveCareItem type
      if (item.name) drugNames.add(item.name);
    });
  }
  
  // Also check supportive_care field which can be SupportiveCareItem[] or SupportiveCare
  if (protocol.supportive_care){
    if(Array.isArray(protocol.supportive_care)){
        protocol.supportive_care.forEach((item: SupportiveCareItem) => {
            if(item.name) drugNames.add(item.name);
        });
    } else if (typeof protocol.supportive_care === 'object'){
        const sc = protocol.supportive_care as SupportiveCare;
        sc.required?.forEach((item: SupportiveCareItem) => { if (item.name) drugNames.add(item.name); });
        sc.optional?.forEach((item: SupportiveCareItem) => { if (item.name) drugNames.add(item.name); });
        sc.monitoring?.forEach((item: SupportiveCareItem) => { if (item.name) drugNames.add(item.name); });
    }
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

  // Check supportive_care section (can be SupportiveCareItem[] or SupportiveCare object)
  if (protocol.supportive_care) {
    if (Array.isArray(protocol.supportive_care)) {
      protocol.supportive_care.forEach((item: SupportiveCareItem) => { // Added type
        items.push({
          name: item.name,
          dose: item.dose,
          timing: item.timing,
          route: item.route,
          category: item.category, // Added category
          description: item.description // Added description
        });
      });
    } else if (typeof protocol.supportive_care === 'object' && protocol.supportive_care !== null) {
      const sc = protocol.supportive_care as SupportiveCare; // Type assertion
      sc.required?.forEach((item: SupportiveCareItem) => items.push(item)); // Added type
      sc.optional?.forEach((item: SupportiveCareItem) => items.push(item)); // Added type
      sc.monitoring?.forEach((item: SupportiveCareItem) => items.push(item)); // Added type
    }
  }

  // Check supportive_meds (type SupportiveCare)
  if (protocol.supportive_meds) {
    const supportiveMeds = protocol.supportive_meds as SupportiveCare; // Type assertion
    supportiveMeds.required?.forEach((item: SupportiveCareItem) => items.push(item)); // Added type
    supportiveMeds.optional?.forEach((item: SupportiveCareItem) => items.push(item)); // Added type
    supportiveMeds.monitoring?.forEach((item: SupportiveCareItem) => items.push(item)); // Added type
  }

  // Removed incorrect iteration over drug.supportiveCare as it's not a property of Drug

  return items;
};

/**
 * Gets all monitoring parameters from various protocol sections
 * @param protocol The protocol to extract from
 * @returns Array of unique monitoring parameters
 */
export const getMonitoringParameters = (protocol: Protocol): string[] => {
  const parameters = new Set<string>(); // Use Set to avoid duplicates

  // Get baseline tests (Test[])
  if (protocol.tests && typeof protocol.tests === 'object' && !Array.isArray(protocol.tests) && protocol.tests.baseline) {
    protocol.tests.baseline.forEach((test: Test) => { // Added type
      if (test.test) parameters.add(test.test);
    });
  } else if (protocol.tests && Array.isArray(protocol.tests)) { // Handle tests being string[]
     (protocol.tests as string[]).forEach(test => parameters.add(test));
  }


  // Get monitoring tests (Test[])
  if (protocol.tests && typeof protocol.tests === 'object' && !Array.isArray(protocol.tests) && protocol.tests.monitoring) {
    protocol.tests.monitoring.forEach((test: Test) => { // Added type
      if (test.test) parameters.add(test.test);
    });
  }
  // Note: No 'else if' here for string[] as protocol.tests cannot be both object and array in the same check block.
  // If protocol.tests was string[], it would have been handled by the baseline check.


  // Get monitoring_parameters from toxicity_monitoring (string)
  if (protocol.toxicity_monitoring?.monitoring_parameters) {
    // monitoring_parameters is a string, split if it contains multiple items
    protocol.toxicity_monitoring.monitoring_parameters.split(/[,;]/).forEach(p => {
        if (p.trim()) parameters.add(p.trim());
    });
  }

  // Get baseline monitoring from monitoring object (MonitoringItem[])
  if (protocol.monitoring?.baseline) {
    protocol.monitoring.baseline.forEach((item: MonitoringItem) => { // Added type
      if (item.parameter) parameters.add(item.parameter);
    });
  }

  // Get ongoing monitoring from monitoring object (MonitoringItem[])
  if (protocol.monitoring?.ongoing) {
    protocol.monitoring.ongoing.forEach((item: MonitoringItem) => { // Added type
      if (item.parameter) parameters.add(item.parameter);
    });
  }

  return Array.from(parameters); // Return unique parameters
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
  // Safely access dose_reductions as it's not in the Protocol type
  const doseReductions = (protocol as any)?.dose_reductions;
  if (!doseReductions?.levels || typeof doseReductions.levels !== 'object') {
    return null;
  }

  return doseReductions.levels;
};

/**
 * Gets all precautions from various sections of the protocol
 * @param protocol The protocol to extract from
 * @returns Array of unique precautions
 */
export const getAllPrecautions = (protocol: Protocol): string[] => {
  const precautions = new Set<string>(); // Use Set to avoid duplicates

  // Get main precautions
  if (Array.isArray(protocol.precautions)) {
    protocol.precautions.forEach(p => precautions.add(p));
  }

  // Get interaction precautions (precautions_with_other_drugs)
  if (protocol.interactions?.precautions_with_other_drugs && Array.isArray(protocol.interactions.precautions_with_other_drugs)) {
    protocol.interactions.precautions_with_other_drugs.forEach(p => precautions.add(p));
  }

  // Get contraindications from interactions
  if (protocol.interactions?.contraindications && Array.isArray(protocol.interactions.contraindications)) {
    protocol.interactions.contraindications.forEach(c => precautions.add(c));
  }
  
  // Get top-level contraindications
  if(Array.isArray(protocol.contraindications)){
    protocol.contraindications.forEach(c => precautions.add(c));
  }

  // Removed drug-specific contraindications iteration as Drug type does not have contraindications property

  return Array.from(precautions);
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
