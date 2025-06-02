// Importing Protocol from the correct path
import { Protocol } from '@/types/protocol';

export interface Medication {
  // Core identifiers
  id: string;
  name: string;
  brand_names: string[];
  classification: string;
  
  // Descriptive fields
  mechanism: string;
  administration: string;
  summary?: string;
  black_box_warning?: string;

  // Structured data (JSONB)
  indications: {
    cancer_types: string[];
    staging?: string[];
    biomarkers?: string[];
    line_of_therapy?: string[];
  };
  
  dosing: {
    standard: string;
    adjustments?: string[];
    schedule?: string;
    cycle_length?: string;
    duration?: string;
  };
  
  side_effects: {
    common: string[];
    severe: string[];
    monitoring: string[];
    management?: string[];
  };
  
  monitoring: {
    baseline: string[];
    ongoing: string[];
    frequency?: string;
    parameters?: string[];
  };
  
  interactions: {
    drugs: string[];
    contraindications: string[];
    precautions?: string[];
  };

  special_considerations?: {
    pregnancy?: string;
    elderly?: string;
    renal?: string;
    hepatic?: string;
    other?: string[];
  };

  pharmacokinetics?: {
    half_life?: string;
    metabolism?: string;
    excretion?: string;
    bioavailability?: string;
    protein_binding?: string;
  };

  // Arrays
  reference_sources: string[];
  contraindications: string[];
  routine_monitoring: string[];
  pre_treatment_tests: string[];

  // Flags
  is_premedication?: boolean;
  is_chemotherapy?: boolean;
  is_immunotherapy?: boolean;
  is_targeted_therapy?: boolean;
  is_orphan_drug?: boolean;

  // Timestamps
  created_at: string;
  updated_at: string;
}

export type SortField = 'name' | 'classification' | 'updated_at';
export type SortOrder = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  order: SortOrder;
}

export interface ProtocolViewerProps {
  protocol: Protocol;
  onBack: () => void;
  onExport: () => void;
  onRegenerateAI: () => void;
  className?: string; // Optional className property
}

export interface Props {
  protocol: Protocol;
  className?: string;
}

export interface TagListProps {
  tags: string[];
  variant?: 'default' | 'warning' | 'success' | 'destructive';
  className?: string;
  maxDisplay?: number;
}
