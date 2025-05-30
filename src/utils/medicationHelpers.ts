import { Medication as TypesMedication } from '@/types/medications';
import { Medication as CDUMedication } from '@/modules/cdu/types';

/**
 * Converts a CDU medication to the standard types medication format
 * This adapter allows us to work with both medication formats
 * @param cduMedication Medication from CDU module
 * @returns Medication in standard format
 */
export function adaptCDUMedicationToTypesMedication(cduMedication: CDUMedication): TypesMedication {
  const standardMedication: TypesMedication = {
    id: cduMedication.id,
    name: cduMedication.name,
    brand_names: cduMedication.brand_names,
    classification: cduMedication.classification,
    mechanism: cduMedication.mechanism,
    administration: cduMedication.administration,
    indications: {
      cancer_types: cduMedication.indications.cancer_types,
      // Add other properties from indications that aren't explicitly listed
      ...Object.fromEntries(
        Object.entries(cduMedication.indications)
          .filter(([key]) => key !== 'cancer_types')
      )
    },
    dosing: {
      standard: cduMedication.dosing.standard,
      adjustments: cduMedication.dosing.adjustments,
      // Add other properties
      ...Object.fromEntries(
        Object.entries(cduMedication.dosing)
          .filter(([key]) => !['standard', 'adjustments'].includes(key))
      )
    },
    // Convert nested side_effects object to array
    side_effects: [
      ...(cduMedication.side_effects.common || []), 
      ...(cduMedication.side_effects.severe || []),
      ...(cduMedication.side_effects.monitoring || []),
      ...(cduMedication.side_effects.management || [])
    ],
    monitoring: {
      labs: [...cduMedication.monitoring.baseline, ...cduMedication.monitoring.ongoing],
      frequency: cduMedication.monitoring.frequency || '',
      precautions: cduMedication.monitoring.parameters || [],
    },
    // Convert nested interactions to array
    interactions: [
      ...(cduMedication.interactions.drugs || []),
      ...(cduMedication.interactions.contraindications || []),
      ...(cduMedication.interactions.precautions || [])
    ],
    created_at: cduMedication.created_at,
    updated_at: cduMedication.updated_at,
    reference_sources: cduMedication.reference_sources,
    summary: cduMedication.summary,
    black_box_warning: cduMedication.black_box_warning,
    special_considerations: typeof cduMedication.special_considerations === 'string' 
      ? cduMedication.special_considerations 
      : Object.values(cduMedication.special_considerations || {}).join(', '),
    pharmacokinetics: typeof cduMedication.pharmacokinetics === 'string'
      ? cduMedication.pharmacokinetics
      : Object.values(cduMedication.pharmacokinetics || {}).join(', '),
    contraindications: cduMedication.contraindications || [],
    routine_monitoring: cduMedication.routine_monitoring || [],
    pre_treatment_tests: cduMedication.pre_treatment_tests || [],
    is_chemotherapy: cduMedication.is_chemotherapy,
    is_immunotherapy: cduMedication.is_immunotherapy,
    is_targeted_therapy: cduMedication.is_targeted_therapy,
    is_orphan_drug: cduMedication.is_orphan_drug
  };

  return standardMedication;
}

/**
 * Converts a standard medication to the CDU medication format
 * @param typesMedication Medication in standard format
 * @returns Medication in CDU format
 */
export function adaptTypesMedicationToCDUMedication(typesMedication: TypesMedication): CDUMedication {
  // This function would perform the reverse conversion
  // Not fully implemented as it's not needed for the current fix
  const cduMedication: CDUMedication = {
    id: typesMedication.id,
    name: typesMedication.name,
    brand_names: typesMedication.brand_names,
    classification: typesMedication.classification,
    mechanism: typesMedication.mechanism,
    administration: typesMedication.administration,
    indications: {
      cancer_types: typesMedication.indications.cancer_types || [],
      staging: [],
      biomarkers: [],
      line_of_therapy: []
    },
    dosing: {
      standard: typesMedication.dosing.standard,
      adjustments: typesMedication.dosing.adjustments
    },
    side_effects: {
      common: [],
      severe: [],
      monitoring: [],
      management: []
    },
    monitoring: {
      baseline: [],
      ongoing: [],
      parameters: []
    },
    interactions: {
      drugs: [],
      contraindications: [],
      precautions: []
    },
    reference_sources: typesMedication.reference_sources,
    contraindications: typesMedication.contraindications || [],
    routine_monitoring: typesMedication.routine_monitoring || [],
    pre_treatment_tests: typesMedication.pre_treatment_tests || [],
    created_at: typesMedication.created_at,
    updated_at: typesMedication.updated_at
  };

  return cduMedication;
}