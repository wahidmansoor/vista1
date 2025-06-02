import type { 
  Protocol, 
  Drug, 
  SupportiveCare, 
  DoseModification,
  RescueAgent,
  ProtocolDrug,
  Test,
  ProtocolEligibility,
  SupportiveCareItem,
  TreatmentInfo
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
  
  // Handle objects with required/optional structure
  if (typeof value === 'object') {
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
 */
export const isValidProtocol = (protocol: any): protocol is Protocol => {
  return (
    protocol && 
    typeof protocol === 'object' &&
    typeof protocol.id === 'string' &&
    typeof protocol.code === 'string' &&
    typeof protocol.tumour_group === 'string' &&
    typeof protocol.name === 'string' &&
    isValidTreatment(protocol.treatment)
  );
};

/**
 * Type guard to validate if a treatment object is properly formatted
 */
export const isValidTreatment = (treatment: any): treatment is TreatmentInfo => {
  return (
    treatment &&
    typeof treatment === 'object' &&
    Array.isArray(treatment.drugs) &&
    treatment.drugs.every((drug: unknown) => 
      typeof drug === 'string' || isValidDrug(drug)
    )
  );
};

/**
 * Type guard to validate if a drug object is properly formatted
 */
export const isValidDrug = (drug: any): drug is Drug => {
  return (
    drug &&
    typeof drug === 'object' &&
    typeof drug.name === 'string'
  );
};

/**
 * Extract and normalize monitoring information from a protocol
 */
export const getProtocolMonitoring = (protocol?: Protocol): Test[] => {
  const results: Test[] = [];
  
  if (!protocol?.tests) return results;
  
  if (Array.isArray(protocol.tests)) {
    return protocol.tests.map(test => 
      typeof test === 'string' ? { name: test } : test
    );
  }
  
  // Handle structured tests object
  const baselineTests = protocol.tests.baseline || [];
  const monitoringTests = protocol.tests.monitoring || [];
  
  return [
    ...baselineTests.map(test => 
      typeof test === 'string' ? { name: test } : test
    ),
    ...monitoringTests.map(test =>
      typeof test === 'string' ? { name: test } : test
    )
  ];
};

/**
 * Extract and normalize dose modifications
 */
export const getProtocolDoseModifications = (
  protocol?: Protocol,
  type?: keyof Required<NonNullable<Protocol['dose_modifications']>>
): DoseModification[] => {
  if (!protocol?.dose_modifications) return [];
  
  if (type && protocol.dose_modifications[type]) {
    return protocol.dose_modifications[type] || [];
  }
  
  return [
    ...(protocol.dose_modifications.hematological || []),
    ...(protocol.dose_modifications.nonHematological || []),
    ...(protocol.dose_modifications.renal || []),
    ...(protocol.dose_modifications.hepatic || [])
  ];
};

/**
 * Extract all supportive care items from protocol with proper type handling
 */
export const getProtocolSupportiveCare = (protocol?: Protocol): SupportiveCareItem[] => {
  if (!protocol?.supportive_care) return [];
  
  const items: SupportiveCareItem[] = [];
  
  const addCareItems = (careItems: Array<SupportiveCareItem | string>, context: string) => {
    if (!Array.isArray(careItems)) return;
    
    careItems.forEach(item => {
      if (typeof item === 'string') {
        items.push({ name: item });
      } else {
        items.push({ ...item });
      }
    });
  };
  
  const supportiveCare = protocol.supportive_care;
  
  if (supportiveCare.required) {
    addCareItems(supportiveCare.required as Array<SupportiveCareItem | string>, 'Required Supportive Care');
  }
  
  if (supportiveCare.optional) {
    addCareItems(supportiveCare.optional as Array<SupportiveCareItem | string>, 'Optional Supportive Care');
  }
  
  // Include legacy support
  if (protocol.supportive_meds) {
    protocol.supportive_meds.forEach(med => {
      if (typeof med === 'string') {
        items.push({ name: med });
      } else {
        items.push({ ...med, name: med.name });
      }
    });
  }
  
  return items;
};

/**
 * Check if a protocol has complete information in a specific area
 */
export const hasCompleteInformation = (
  protocol: Protocol,
  area: 'eligibility' | 'medications' | 'monitoring' | 'toxicity' | 'interactions'
): boolean => {
  if (!protocol) return false;
  
  switch (area) {
    case 'eligibility':
      const eligibility = protocol.eligibility;
      return !!(
        eligibility &&
        (
          (Array.isArray(eligibility.inclusion_criteria) && eligibility.inclusion_criteria.length > 0)
        )
      );
    
    case 'medications':
      return !!(
        protocol.pre_medications?.required?.length ||
        protocol.pre_medications?.optional?.length
      );
    
    case 'monitoring':
      const tests = protocol.tests;
      if (Array.isArray(tests)) {
        return tests.length > 0;
      }
      return !!(
        tests?.baseline?.length ||
        tests?.monitoring?.length
      );
    
    case 'toxicity':
      return !!(
        protocol.toxicity_monitoring?.expected_toxicities?.length
      );
    
    case 'interactions':
      return !!(
        protocol.interactions?.drugs?.length ||
        protocol.interactions?.contraindications?.length
      );
      
    default:
      return false;
  }
};
