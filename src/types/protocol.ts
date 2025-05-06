// src/types/protocol.ts
import type { Medication } from './medications';

export interface Drug {
  name: string;
  dose: string;
  timing?: string;
  administration: string;
  alternative_switches?: string[];
  supportiveCare?: string[];
  contraindications?: string[];
  details?: {
    dosing?: string;
    schedule?: string;
    supportiveCare?: string[];
    contraindications?: string[];
  };
}

export interface Protocol {
  id: string;
  code: string;
  title?: string; // For display purposes
  tumour_group: string;
  treatment_intent?: string;
  eligibility: string[];
  tests?: {
    baseline: string[];
    monitoring: string[];
  };
  treatment: {
    drugs: Drug[];
    protocol?: string;
  };
  dose_modifications?: {
    hematological?: string[];
    nonHematological?: string[];
    renal?: string[];
    hepatic?: string[];
  };
  precautions?: string[];
  reference_list?: string[];
  count?: number; // For UI display of drug count
  drugs?: Drug[]; // Flattened array for UI convenience
}
