import type { 
  Protocol, 
  Drug, 
  Eligibility, 
  Medications, 
  SupportiveCare, 
  SupportiveCareItem,
  ToxicityMonitoring, 
  DoseModification,
  RescueAgent,
  Interactions,
  DrugClass,
  ProtocolNote
} from '../types/protocol';

export type { Protocol, Drug, Eligibility, Medications };

export const getProtocolDoseReductions = (protocol?: Protocol): {
  levels: Record<string, any>; 
  criteria: Array<string | { criterion: string }>;
} => {
  if (!protocol?.dose_reductions) {
    return {
      levels: {},
      criteria: []
    };
  }
  
  return {
    levels: protocol.dose_reductions.levels || {},
    criteria: protocol.dose_reductions.criteria?.map(item => 
      typeof item === 'string' ? item : (item?.criterion || '')
    ).filter(Boolean) || []
  };
};

export const getProtocolEligibility = (
  protocol?: Protocol, 
  type: 'inclusion' | 'exclusion' | 'all' = 'all'
): string[] => {
  if (!protocol?.eligibility) return [];
  
  const eligibility = protocol.eligibility;
  
  if (type === 'inclusion') {
    return eligibility.inclusion_criteria?.map(item => 
      typeof item === 'string' ? item : (item?.criterion || '')
    ).filter(Boolean) || [];
  }
  
  if (type === 'exclusion') {
    return eligibility.exclusion_criteria?.map(item => 
      typeof item === 'string' ? item : (item?.criterion || '')
    ).filter(Boolean) || [];
  }
  
  // Default: return all criteria combined
  return [
    ...(eligibility.inclusion_criteria?.map(item => 
      typeof item === 'string' ? item : (item?.criterion || '')
    ).filter(Boolean) || []),
    ...(eligibility.exclusion_criteria?.map(item => 
      typeof item === 'string' ? item : (item?.criterion || '')
    ).filter(Boolean) || [])
  ];
};

export const getAllPrecautions = (protocol: Protocol): string[] => {
  const precautions: string[] = [];
  
  // Get main precautions
  if (Array.isArray(protocol.precautions)) {
    const notes = protocol.precautions.map(item => {
      if (typeof item === 'string') return item;
      return item?.note || item?.criterion || '';
    }).filter(Boolean);
    precautions.push(...notes);
  }
  
  // Get interaction precautions
  if (protocol.interactions?.precautions) {
    precautions.push(...protocol.interactions.precautions);
  }
  
  // Get contraindications from interactions
  if (protocol.interactions?.contraindications) {
    precautions.push(...protocol.interactions.contraindications);
  }
  
  // Get drug-specific contraindications
  if (protocol.treatment?.drugs) {
    protocol.treatment.drugs.forEach(drug => {
      if (Array.isArray(drug.contraindications)) {
        precautions.push(...drug.contraindications.map(String));
      }
    });
  }
  
  // Return unique precautions
  return [...new Set(precautions.filter(Boolean))];
};

export const getMonitoringParameters = (protocol: Protocol): string[] => {
  const parameters: string[] = [];
  
  // Get baseline tests
  if (protocol.tests && 'baseline' in protocol.tests && Array.isArray(protocol.tests.baseline)) {
    parameters.push(...protocol.tests.baseline.map(item => 
      typeof item === 'string' ? item : (item?.criterion || '')
    ).filter(Boolean));
  }
  
  // Get monitoring tests
  if (protocol.tests && 'monitoring' in protocol.tests && Array.isArray(protocol.tests.monitoring)) {
    parameters.push(...protocol.tests.monitoring.map(item => 
      typeof item === 'string' ? item : (item?.criterion || '')
    ).filter(Boolean));
  }
  
  if (protocol.toxicity_monitoring?.parameters) {
    parameters.push(...protocol.toxicity_monitoring.parameters);
  }
  
  if (protocol.monitoring?.baseline) {
    parameters.push(...protocol.monitoring.baseline);
  }
  
  if (protocol.monitoring?.ongoing) {
    parameters.push(...protocol.monitoring.ongoing);
  }
  
  return [...new Set(parameters.filter(Boolean))];
};

export const getProtocolReferences = (protocol?: Protocol): string[] => {
  if (!protocol?.reference_list || !Array.isArray(protocol.reference_list)) {
    return [];
  }
  return protocol.reference_list;
};

export const getProtocolMedications = (
  protocol?: Protocol, 
  type: 'pre' | 'post' = 'pre'
): string[] => {
  const field = type === 'pre' ? 'pre_medications' : 'post_medications';
  if (!protocol || !protocol[field]) return [];
  return safeSplit(protocol[field]);
};

export const safeSplit = (value: any): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map(item => String(item)).filter(Boolean);
  }
  return String(value).split(/[;,]/).map(s => s.trim()).filter(Boolean);
};

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

export const isValidDrugList = (drugs: any): drugs is Drug[] => {
  return (
    Array.isArray(drugs) && 
    drugs.every(drug => 
      drug && 
      typeof drug === 'object' && 
      typeof drug.name === 'string'
    )
  );
};

export const getProtocolDrugs = (protocol?: Protocol): Drug[] => {
  if (!protocol?.treatment?.drugs) return [];
  return isValidDrugList(protocol.treatment.drugs) ? protocol.treatment.drugs : [];
};
