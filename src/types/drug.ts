export interface Drug {
  name: string;
  dose: string;
  schedule: string;
  administration?: string;
  timing?: string;
  alternative_switches?: string[];
  special_notes?: string;
}

export interface SupportiveCareItem {
  type?: string;
  description?: string;
  timing?: string;
}

export interface RegimenGroup {
  name: string;
  drugs: Drug[];
}
