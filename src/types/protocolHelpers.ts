// src/utils/protocolHelpers.ts
import { Drug, Protocol, SupportiveCareItem, ProtocolNote } from './protocol';
import type { Test } from '../modules/cdu/safe/treatmentProtocols/types/protocol';

interface TestsObject {
  baseline?: Array<Test | string>;
  monitoring?: Array<Test | string>;
  frequency?: string;
}

export const getDrugNames = (protocol: Protocol): string[] => {
  if (!protocol?.treatment?.drugs || !Array.isArray(protocol.treatment.drugs)) {
    return [];
  }
  return [...new Set(protocol.treatment.drugs.map(drug => drug.name))];
};

export const findDrugByName = (protocol: Protocol, drugName: string): Drug | undefined => {
  return protocol?.treatment?.drugs?.find(
    drug => drug.name.toLowerCase() === drugName.toLowerCase()
  );
};

export const getSupportiveCareItems = (protocol: Protocol): SupportiveCareItem[] => {
  const items: SupportiveCareItem[] = [];

  if (protocol.supportive_care) {
    protocol.supportive_care.required?.forEach(drug => items.push(drug));
    protocol.supportive_care.optional?.forEach(drug => items.push(drug));
  }

  protocol.supportive_meds?.forEach(drug => items.push(drug));

  protocol.treatment?.drugs?.forEach(drug => {
    if (Array.isArray(drug.supportiveCare)) {
      drug.supportiveCare.forEach(item => {
        if (typeof item === 'string') {
          items.push({ name: item });
        } else if (typeof item === 'object') {
          items.push(item);
        }
      });
    }
  });

  return items;
};

export const getMonitoringParameters = (protocol: Protocol): string[] => {
  const parameters: string[] = [];

  const extractNames = (tests?: Array<Test | string>) => {
    if (!Array.isArray(tests)) return;
    tests.forEach(test => {
      parameters.push(typeof test === 'string' ? test : test.name);
    });
  };

  if (!Array.isArray(protocol.tests) && typeof protocol.tests === 'object') {
    extractNames(protocol.tests.baseline);
    extractNames(protocol.tests.monitoring);
  }

  if (protocol.monitoring && typeof protocol.monitoring === 'object') {
    extractNames((protocol.monitoring as TestsObject).baseline);
    extractNames((protocol.monitoring as TestsObject).monitoring);
  }

  extractNames(protocol.toxicity_monitoring?.parameters);

  return [...new Set(parameters)].filter(Boolean);
};

export const hasDoseModifications = (
  protocol: Protocol,
  modificationType: 'hematological' | 'nonHematological' | 'renal' | 'hepatic'
): boolean => {
  const mods = protocol.dose_modifications?.[modificationType];
  return Array.isArray(mods) && mods.length > 0;
};

export const getDoseReductionLevels = (
  protocol: Protocol
): { levels: Record<string, any>; criteria: Array<string | { criterion: string }> } | null => {
  if (!protocol.dose_reductions) return null;

  return {
    levels: protocol.dose_reductions?.levels ?? {},
    criteria: protocol.dose_reductions?.criteria ?? []
  };
};

export const getAllPrecautions = (protocol: Protocol): string[] => {
  const precautions: string[] = [];

  const pushNotes = (items?: Array<string | ProtocolNote> | null) => {
    if (!items) return;
    items.forEach(p => {
      if (typeof p === 'string') {
        precautions.push(p);
      } else if (typeof p === 'object' && p.note) {
        precautions.push(p.note);
      }
    });
  };

  pushNotes(protocol.precautions);
  pushNotes(protocol.interactions?.precautions);
  pushNotes(protocol.interactions?.contraindications);

  protocol.treatment?.drugs?.forEach(drug => {
    drug.contraindications?.forEach(note => {
      precautions.push(`${drug.name}: ${note}`);
    });
  });

  return [...new Set(precautions)].filter(Boolean);
};

export const containsDrug = (protocol: Protocol, drugName: string): boolean => {
  const name = drugName.toLowerCase();
  return !!protocol.treatment?.drugs?.some(drug => drug.name.toLowerCase().includes(name));
};

export const getReferences = (protocol: Protocol): string[] => {
  return Array.isArray(protocol.reference_list) ? protocol.reference_list : [];
};

export const getAIWarnings = (protocol: Protocol): string[] => {
  return Array.isArray(protocol.ai_notes?.warnings) ? protocol.ai_notes.warnings : [];
};

export const getAIRecommendations = (protocol: Protocol): string[] => {
  return Array.isArray(protocol.ai_notes?.recommendations)
    ? protocol.ai_notes.recommendations
    : [];
};

export const createProtocolSummary = (protocol: Protocol): Record<string, any> => {
  return {
    id: protocol.id,
    code: protocol.code,
    tumour_group: protocol.tumour_group,
    treatment_intent: protocol.treatment_intent ?? '',
    drugs: getDrugNames(protocol),
    has_dose_modifications: hasDoseModifications(protocol, 'hematological') ||
      hasDoseModifications(protocol, 'nonHematological') ||
      hasDoseModifications(protocol, 'renal') ||
      hasDoseModifications(protocol, 'hepatic'),
    has_supportive_care: getSupportiveCareItems(protocol).length > 0,
    has_monitoring: getMonitoringParameters(protocol).length > 0,
    created_at: protocol.created_at ?? '',
    last_reviewed: protocol.last_reviewed ?? '',
    summary: protocol.summary ?? ''
  };
};

export const areProtocolsEquivalent = (protocol1: Protocol, protocol2: Protocol): boolean => {
  if (
    protocol1.id !== protocol2.id ||
    protocol1.code !== protocol2.code ||
    protocol1.tumour_group !== protocol2.tumour_group
  ) return false;

  const drugs1 = getDrugNames(protocol1).sort();
  const drugs2 = getDrugNames(protocol2).sort();

  return drugs1.length === drugs2.length && drugs1.every((d, i) => d === drugs2[i]);
};

export const getEligibilityCriteria = (
  protocol: Protocol,
  type?: 'inclusion' | 'exclusion'
): string[] => {
  const eligibility = protocol.eligibility;
  if (!eligibility) return [];

  const process = (arr?: Array<string | { criterion: string }>) =>
    Array.isArray(arr) ? arr.map(e => (typeof e === 'string' ? e : e.criterion)) : [];

  if (type === 'inclusion') return process(eligibility.inclusion_criteria);
  if (type === 'exclusion') return process(eligibility.exclusion_criteria);

  return [...process(eligibility.inclusion_criteria), ...process(eligibility.exclusion_criteria)];
};
