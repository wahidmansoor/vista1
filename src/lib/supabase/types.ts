export type PreMedCategory = 'Antiemetic' | 'Steroid' | 'Antiallergic' | 'Other';

export interface Premedication {
  id: string;
  name: string;
  dose: string;
  route: string;
  timing: string;
  required: boolean;
  indications: string[];
  contraindications: string[];
  warnings: string[];
  alternatives: string[];
  category: PreMedCategory;
  weight_based: boolean;
  interactions_with: string[];
  admin_sequence: number;
  created_at: string;
}
