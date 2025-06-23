import type { Medication } from '../../types';

export const createMockMedication = (overrides?: Partial<Medication>): Medication => ({
  id: 'test-med-1',
  name: 'Abiraterone Acetate',
  brand_names: ['Zytiga'],
  classification: 'CYP17 Inhibitor',
  mechanism: 'Selectively inhibits 17α-hydroxylase/C17,20-lyase (CYP17)',
  administration: 'Oral tablet taken once daily',
  is_premedication: false,
  indications: {
    cancer_types: ['Prostate Cancer'],
    staging: ['Metastatic'],
    biomarkers: ['Hormone-Sensitive'],
    line_of_therapy: ['First-line', 'Second-line']
  },
  dosing: {
    standard: '1000mg once daily',
    adjustments: ['Reduce to 750mg for hepatic impairment'],
    schedule: 'Continuous',
    cycle_length: '28 days',
    duration: 'Until disease progression or unacceptable toxicity'
  },
  side_effects: {
    common: ['Fatigue', 'Joint pain', 'Hypertension'],
    severe: ['Liver toxicity', 'Adrenal insufficiency'],
    monitoring: ['Liver function', 'Blood pressure']
  },
  monitoring: {
    baseline: ['ALT/AST', 'Blood pressure'],
    ongoing: ['Monthly liver function', 'Blood pressure every visit'],
    frequency: 'Monthly',
  },
  interactions: {
    drugs: ['CYP3A4 inducers', 'CYP2D6 substrates'],
    contraindications: ['Severe hepatic impairment']
  },
  reference_sources: ['NCCN Guidelines', 'FDA prescribing information'],
  ...overrides
});

export const createMockMedications = (count: number): Medication[] => 
  Array.from({ length: count }, (_, index) => createMockMedication({
    id: `test-med-${index + 1}`,
    name: `Test Medication ${index + 1}`,
    brand_names: [`Brand ${index + 1}`],
  }));
