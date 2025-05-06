export interface Medication {
  id: string;
  name: string;
  category: 'antiemetic' | 'steroid' | 'antihistamine' | 'other';
  standard_dose: string;
  administration: string;
  timing?: string;
  indications: string[];
  contraindications?: string[];
  notes?: string;
  is_premedication: boolean;
  required_for?: string[]; // List of drug names or regimen types that require this medication
  cancer_types?: string[]; // Specific cancer types where this medication is commonly used
}

// Type alias for backward compatibility
export type Premedication = Medication;
export type PredicatedPremedication = Medication;