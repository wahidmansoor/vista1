export interface ManagementStep {
  title: string;
  description: string;
}

export interface Medication {
  name: string;
  dosage: string;
}

// Add category type for better organization
export type EmergencyCategory = 'Hematologic' | 'Metabolic' | 'Treatment-Related' | 'Obstructive' | 'Infectious';

export interface EmergencyProtocol {
  id: string;
  title: string;
  timeToAction?: string;
  category: EmergencyCategory | EmergencyCategory[]; // Can belong to multiple categories
  symptoms: string[];
  diagnostics: string[];
  management: ManagementStep[];
  medications?: Medication[];
  additionalNotes?: string;
}

export const emergencyProtocols: EmergencyProtocol[] = [
  {
    id: 'neutropenic-fever',
    title: 'Neutropenic Fever',
    timeToAction: '60 minutes',
    category: ['Hematologic', 'Infectious'],
    symptoms: [
      'Fever (single temperature ≥38.3°C or ≥38.0°C sustained over 1 hour)',
      'Absolute neutrophil count <500 cells/mm³',
      'Chills or rigors',
      'Hypotension',
      'Altered mental status'
    ],
    diagnostics: [
      'Complete blood count with differential',
      'Blood cultures (2 sets, peripheral and central line if present)',
      'Urine culture',
      'Chest X-ray',
      'Additional cultures from suspected sites of infection'
    ],
    management: [
      {
        title: 'Empiric Antibiotic Therapy',
        description: 'Start broad-spectrum antibiotics within 1 hour of presentation'
      },
      {
        title: 'Risk Assessment',
        description: 'Determine high vs low risk based on MASCC score or CISNE index'
      },
      {
        title: 'Source Control',
        description: 'Remove infected catheters/devices if indicated'
      },
      {
        title: 'Monitoring',
        description: 'Close monitoring for clinical deterioration; ICU assessment if unstable'
      }
    ],
    medications: [
      {
        name: 'Piperacillin-Tazobactam',
        dosage: '4.5g IV every 6 hours'
      },
      {
        name: 'Cefepime',
        dosage: '2g IV every 8 hours'
      },
      {
        name: 'Meropenem',
        dosage: '1g IV every 8 hours'
      }
    ],
    additionalNotes: 'Consider antibiotic adjustments after 48-72 hours based on cultures and clinical response.'
  },
  {
    id: 'spinal-cord-compression',
    title: 'Spinal Cord Compression',
    timeToAction: '12 hours',
    category: 'Obstructive',
    symptoms: [
      'Back pain (90% of cases)',
      'Weakness or paralysis in extremities',
      'Sensory loss below level of compression',
      'Urinary or bowel incontinence/retention',
      'Loss of deep tendon reflexes'
    ],
    diagnostics: [
      'MRI of entire spine (preferred)',
      'CT scan if MRI contraindicated',
      'Complete neurological examination',
      'Laboratory tests: CBC, CMP, Calcium levels'
    ],
    management: [
      {
        title: 'High-Dose Corticosteroids',
        description: 'Start dexamethasone immediately upon suspicion'
      },
      {
        title: 'Urgent Neurosurgical/Radiation Oncology Consult',
        description: 'Coordinate multidisciplinary care team'
      },
      {
        title: 'Radiation Therapy',
        description: 'External beam radiation therapy within 24 hours'
      },
      {
        title: 'Surgical Decompression',
        description: 'Consider for spinal instability or radioresistant tumors'
      }
    ],
    medications: [
      {
        name: 'Dexamethasone',
        dosage: 'Loading dose: 10mg IV, then 4mg IV/PO every 6 hours'
      }
    ]
  },
  {
    id: 'tumor-lysis-syndrome',
    title: 'Tumor Lysis Syndrome',
    timeToAction: '6 hours',
    category: 'Metabolic',
    symptoms: [
      'Hyperuricemia',
      'Hyperkalemia',
      'Hyperphosphatemia',
      'Hypocalcemia',
      'Acute kidney injury',
      'Cardiac arrhythmias',
      'Seizures'
    ],
    diagnostics: [
      'Serum electrolytes (K, Ca, P) q6h',
      'Serum creatinine and BUN',
      'Uric acid levels',
      'Urine output monitoring',
      'ECG monitoring for arrhythmias'
    ],
    management: [
      {
        title: 'Aggressive Hydration',
        description: 'IV fluids at 2-3L/m²/day to maintain high urine output (100-200 mL/h)'
      },
      {
        title: 'Electrolyte Management',
        description: 'Correct electrolyte imbalances; avoid calcium supplementation if phosphate is elevated'
      },
      {
        title: 'Xanthine Oxidase Inhibitor',
        description: 'Allopurinol for prevention; rasburicase for established hyperuricemia'
      },
      {
        title: 'Renal Replacement',
        description: 'Consider hemodialysis for severe electrolyte disturbances, oliguria, or azotemia'
      }
    ],
    medications: [
      {
        name: 'Allopurinol',
        dosage: '100-300mg PO every 8 hours'
      },
      {
        name: 'Rasburicase',
        dosage: '0.2mg/kg IV as a single dose (use with caution in G6PD deficiency)'
      },
      {
        name: 'Sodium Bicarbonate',
        dosage: 'Consider for urinary alkalinization if pH <7.0'
      }
    ],
    additionalNotes: 'Avoid calcium correction until hyperphosphatemia is addressed to prevent calcium phosphate precipitation.'
  },
  {
    id: 'superior-vena-cava-syndrome',
    title: 'Superior Vena Cava Syndrome',
    timeToAction: '24 hours',
    category: 'Obstructive',
    symptoms: [
      'Facial swelling (especially in morning)',
      'Neck distention',
      'Difficulty breathing/dyspnea',
      'Upper extremity swelling',
      'Dilated neck or chest wall veins',
      'Cough, hoarseness, dysphagia'
    ],
    diagnostics: [
      'CT of chest with contrast',
      'Venography if diagnosis uncertain',
      'Consider bronchoscopy or mediastinoscopy for tissue diagnosis',
      'Oxygen saturation monitoring'
    ],
    management: [
      {
        title: 'Airway Management',
        description: 'Elevate head of bed; supplemental oxygen if needed'
      },
      {
        title: 'Radiation Therapy',
        description: 'For known malignancies, especially radiosensitive tumors'
      },
      {
        title: 'Stent Placement',
        description: 'Consider urgent stenting for severe symptoms'
      },
      {
        title: 'Tissue Diagnosis',
        description: 'Obtain if not previously established (guides definitive treatment)'
      }
    ],
    medications: [
      {
        name: 'Dexamethasone',
        dosage: '4-10mg IV every 6 hours'
      },
      {
        name: 'Furosemide',
        dosage: '20-40mg IV/PO daily as needed for edema'
      }
    ]
  },
  {
    id: 'hypercalcemia-of-malignancy',
    title: 'Hypercalcemia of Malignancy',
    timeToAction: '24 hours',
    category: 'Metabolic',
    symptoms: [
      'Altered mental status, confusion',
      'Nausea, vomiting, constipation',
      'Polydipsia, polyuria',
      'Weakness, fatigue',
      'Cardiac arrhythmias',
      'Bone pain'
    ],
    diagnostics: [
      'Serum calcium (total and ionized)',
      'Kidney function tests',
      'Serum phosphorus, magnesium',
      'PTH and PTHrP levels',
      '25-OH Vitamin D'
    ],
    management: [
      {
        title: 'Volume Expansion',
        description: 'Normal saline at 200-300 mL/hr initially, then maintenance'
      },
      {
        title: 'Calciuresis',
        description: 'Loop diuretics after adequate hydration'
      },
      {
        title: 'Bisphosphonate Therapy',
        description: 'For moderate to severe hypercalcemia (> 12 mg/dL)'
      },
      {
        title: 'Treat Underlying Malignancy',
        description: 'Definitive treatment based on primary tumor'
      }
    ],
    medications: [
      {
        name: 'Zoledronic Acid',
        dosage: '4mg IV over 15 minutes'
      },
      {
        name: 'Pamidronate',
        dosage: '60-90mg IV over 2-4 hours'
      },
      {
        name: 'Furosemide',
        dosage: '20-40mg IV after hydration'
      },
      {
        name: 'Calcitonin',
        dosage: '4-8 IU/kg SC/IM every 12 hours (short-term use)'
      }
    ],
    additionalNotes: 'Response to bisphosphonates typically occurs in 2-4 days; monitor calcium levels daily.'
  },
  {
    id: 'febrile-neutropenia',
    title: 'Febrile Neutropenia',
    timeToAction: '60 minutes',
    category: ['Hematologic', 'Infectious'],
    symptoms: [
      'Fever (≥38.3°C once or ≥38.0°C for ≥1h)',
      'Absolute neutrophil count <500 cells/mm³',
      'Shaking chills',
      'Hypotension',
      'Mucositis',
      'Localizing symptoms of infection'
    ],
    diagnostics: [
      'Complete blood count with differential',
      'Blood cultures (≥2 sets)',
      'Urinalysis and urine culture',
      'Chest radiograph',
      'Cultures from any suspected sites of infection'
    ],
    management: [
      {
        title: 'Empiric Antibiotics',
        description: 'Start broad-spectrum antibiotics within 1 hour of presentation'
      },
      {
        title: 'Risk Stratification',
        description: 'MASCC or CISNE score to determine inpatient vs. outpatient management'
      },
      {
        title: 'Infection Site Assessment',
        description: 'Comprehensive evaluation for source of infection'
      },
      {
        title: 'G-CSF Consideration',
        description: 'Consider for high-risk patients or expected prolonged neutropenia'
      }
    ],
    medications: [
      {
        name: 'Cefepime',
        dosage: '2g IV every 8 hours'
      },
      {
        name: 'Piperacillin-Tazobactam',
        dosage: '4.5g IV every 6-8 hours'
      },
      {
        name: 'Meropenem',
        dosage: '1g IV every 8 hours'
      },
      {
        name: 'Add Vancomycin',
        dosage: '15-20mg/kg IV every 8-12 hours if MRSA suspected'
      }
    ],
    additionalNotes: 'Reassess antibiotic therapy after 48 hours based on cultures and clinical response.'
  },
  {
    id: 'septic-shock',
    title: 'Septic Shock in Cancer Patients',
    timeToAction: '30 minutes',
    category: 'Infectious',
    symptoms: [
      'Persistent hypotension after fluid resuscitation',
      'Temperature >38.3°C or <36°C',
      'Heart rate >90 beats/minute',
      'Respiratory rate >20 breaths/minute or PaCO2 <32 mmHg',
      'Altered mental status',
      'Decreased urine output (<0.5 mL/kg/hr)',
      'Mottled skin or prolonged capillary refill'
    ],
    diagnostics: [
      'Blood cultures (at least 2 sets)',
      'CBC with differential',
      'Comprehensive metabolic panel',
      'Lactate level',
      'Blood gases',
      'Chest X-ray',
      'Urinalysis and urine culture',
      'Imaging of suspected infection sites'
    ],
    management: [
      {
        title: 'Immediate Fluid Resuscitation',
        description: '30 mL/kg crystalloid for hypotension or lactate ≥4 mmol/L within first 3 hours'
      },
      {
        title: 'Broad-Spectrum Antibiotics',
        description: 'Administer within 1 hour of recognition'
      },
      {
        title: 'Vasopressors',
        description: 'If hypotension persists despite fluid resuscitation'
      },
      {
        title: 'Source Control',
        description: 'Identify and control source of infection (drain abscesses, remove infected devices)'
      },
      {
        title: 'ICU Transfer',
        description: 'Arrange immediate transfer to intensive care'
      }
    ],
    medications: [
      {
        name: 'Norepinephrine',
        dosage: 'First-line vasopressor, 0.1-0.5 mcg/kg/min IV'
      },
      {
        name: 'Broad-spectrum antibiotics',
        dosage: 'Per institutional protocol and suspected source'
      },
      {
        name: 'Vasopressin',
        dosage: 'May be added to norepinephrine (0.03-0.04 units/min)'
      }
    ],
    additionalNotes: 'Cancer patients are at higher risk for multidrug-resistant organisms; consider previous microbiology results and recent antibiotic exposure when selecting empiric therapy.'
  },
  {
    id: 'chemo-anaphylaxis',
    title: 'Anaphylaxis from Chemotherapy',
    timeToAction: '5 minutes',
    category: 'Treatment-Related',
    symptoms: [
      'Hypotension',
      'Wheezing or bronchospasm',
      'Urticaria or flushing',
      'Angioedema',
      'Dyspnea',
      'Gastrointestinal symptoms (nausea, vomiting, diarrhea)',
      'Temporal relationship to chemotherapy infusion'
    ],
    diagnostics: [
      'Clinical diagnosis based on symptoms',
      'Vital signs monitoring',
      'Pulse oximetry',
      'Consider tryptase level (if available, within 3 hours of reaction)'
    ],
    management: [
      {
        title: 'Stop Infusion',
        description: 'Immediately discontinue the offending agent'
      },
      {
        title: 'Maintain Airway',
        description: 'Position patient, prepare for intubation if severe'
      },
      {
        title: 'Epinephrine',
        description: 'Administer IM epinephrine as first-line treatment'
      },
      {
        title: 'Fluid Resuscitation',
        description: 'IV fluids for hypotension'
      },
      {
        title: 'Secondary Medications',
        description: 'H1 and H2 antihistamines, corticosteroids'
      }
    ],
    medications: [
      {
        name: 'Epinephrine',
        dosage: '0.3-0.5 mg IM (1:1000 solution), may repeat every 5-15 minutes as needed'
      },
      {
        name: 'Diphenhydramine',
        dosage: '25-50 mg IV/IM/PO'
      },
      {
        name: 'Ranitidine or famotidine',
        dosage: 'Ranitidine 50 mg IV or Famotidine 20 mg IV'
      },
      {
        name: 'Methylprednisolone',
        dosage: '125 mg IV'
      }
    ],
    additionalNotes: 'Document reaction in detail; consider allergy/immunology consult for desensitization protocols if the chemotherapy agent is essential for treatment.'
  },
  {
    id: 'leukostasis',
    title: 'Leukostasis in Acute Leukemia',
    timeToAction: '6 hours',
    category: 'Hematologic',
    symptoms: [
      'Dyspnea or hypoxemia',
      'Confusion or altered mental status',
      'Visual changes',
      'Headache',
      'Very high WBC count (>100,000/μL, especially in AML)',
      'Pulmonary infiltrates without infection',
      'Priapism (rare)'
    ],
    diagnostics: [
      'Complete blood count with differential',
      'Blood gas analysis',
      'Chest X-ray',
      'Brain imaging (if neurological symptoms)',
      'Coagulation studies',
      'Basic metabolic panel'
    ],
    management: [
      {
        title: 'Urgent Leukapheresis',
        description: 'Particularly for symptomatic patients with WBC >100,000/μL'
      },
      {
        title: 'Hydration',
        description: 'IV fluids to maintain good hydration and urine output'
      },
      {
        title: 'Cytoreduction',
        description: 'Hydroxyurea or other rapidly acting cytoreductive therapy'
      },
      {
        title: 'Avoid Transfusions',
        description: 'If possible, avoid RBC transfusions which may increase viscosity'
      },
      {
        title: 'Allopurinol or Rasburicase',
        description: 'Preemptive treatment for tumor lysis syndrome'
      }
    ],
    medications: [
      {
        name: 'Hydroxyurea',
        dosage: '50-100 mg/kg/day PO divided in 2-3 doses'
      },
      {
        name: 'Rasburicase',
        dosage: '0.2 mg/kg IV once daily (for high risk of TLS)'
      },
      {
        name: 'Allopurinol',
        dosage: '300-600 mg/day PO'
      }
    ],
    additionalNotes: 'Leukostasis is a medical emergency requiring prompt hematology consultation. If leukapheresis is not immediately available, cytoreduction with hydroxyurea should be initiated while arranging transfer to a center with apheresis capability.'
  },
  {
    id: 'bowel-obstruction',
    title: 'Bowel Obstruction due to Tumor',
    timeToAction: '24 hours',
    category: 'Obstructive',
    symptoms: [
      'Abdominal pain',
      'Nausea and vomiting',
      'Absence of bowel movements or flatus',
      'Abdominal distention',
      'High-pitched or absent bowel sounds',
      'History of intra-abdominal malignancy (especially colorectal, ovarian, gastric)'
    ],
    diagnostics: [
      'Abdominal X-ray (supine and upright)',
      'CT abdomen with contrast (if not contraindicated)',
      'Complete blood count',
      'Comprehensive metabolic panel',
      'Blood gas analysis if concern for ischemia'
    ],
    management: [
      {
        title: 'NPO Status',
        description: 'Nothing by mouth'
      },
      {
        title: 'Nasogastric Tube',
        description: 'For decompression and symptom relief'
      },
      {
        title: 'IV Fluids',
        description: 'Correct fluid and electrolyte imbalances'
      },
      {
        title: 'Surgical Consultation',
        description: 'Evaluate for possible surgical intervention'
      },
      {
        title: 'Pharmacological Management',
        description: 'Antiemetics, pain control, consider octreotide for malignant bowel obstruction'
      }
    ],
    medications: [
      {
        name: 'Octreotide',
        dosage: '100-600 mcg/day SC or IV continuous infusion'
      },
      {
        name: 'Dexamethasone',
        dosage: '8-20 mg/day IV'
      },
      {
        name: 'Ondansetron',
        dosage: '4-8 mg IV every 8 hours'
      },
      {
        name: 'Opioid analgesics',
        dosage: 'Titrate to pain control'
      }
    ],
    additionalNotes: 'In patients with advanced cancer, consider goals of care discussions. For inoperable cases, palliative measures may be appropriate, including venting gastrostomy for symptom control.'
  },
  {
    id: 'siadh',
    title: 'SIADH (Syndrome of Inappropriate ADH Secretion)',
    timeToAction: '12 hours',
    category: 'Metabolic',
    symptoms: [
      'Hyponatremia (Na <135 mEq/L)',
      'Decreased serum osmolality (<275 mOsm/kg)',
      'Inappropriate urine concentration (Uosm >100 mOsm/kg)',
      'Euvolemia (no edema or dehydration)',
      'Headache',
      'Nausea and vomiting',
      'Confusion or altered mental status',
      'Seizures (in severe cases)'
    ],
    diagnostics: [
      'Serum sodium and osmolality',
      'Urine sodium and osmolality',
      'Serum cortisol and TSH (to rule out adrenal insufficiency and hypothyroidism)',
      'Chest imaging (to identify SCLC or other pulmonary malignancies)',
      'Brain imaging (for CNS malignancies)',
      'Volume status assessment'
    ],
    management: [
      {
        title: 'Fluid Restriction',
        description: '800-1000 mL/day for mild to moderate hyponatremia'
      },
      {
        title: 'Hypertonic Saline',
        description: 'For severe hyponatremia (Na <120 mEq/L) or neurological symptoms'
      },
      {
        title: 'Monitor Sodium Correction Rate',
        description: 'Not to exceed 8-10 mEq/L in 24 hours to avoid osmotic demyelination syndrome'
      },
      {
        title: 'Treat Underlying Malignancy',
        description: 'Directed therapy for SCLC or other causative tumor'
      },
      {
        title: 'Pharmacologic Therapy',
        description: 'Consider salt tablets, loop diuretics, or vasopressin receptor antagonists'
      }
    ],
    medications: [
      {
        name: '3% Sodium Chloride',
        dosage: 'For severe symptoms: 100-150 mL IV over 10-20 minutes, may repeat; otherwise 0.5-1 mL/kg/hr'
      },
      {
        name: 'Tolvaptan',
        dosage: 'Start 15 mg daily, can increase to 30-60 mg daily'
      },
      {
        name: 'Salt tablets',
        dosage: '1-2 g TID with meals'
      },
      {
        name: 'Furosemide',
        dosage: '20-40 mg daily (with salt tablets)'
      }
    ],
    additionalNotes: 'SIADH is commonly associated with small cell lung cancer, CNS disorders, and certain medications. Monitor sodium levels closely during correction to prevent osmotic demyelination syndrome.'
  },
  {
    id: 'ici-toxicities',
    title: 'Immune Checkpoint Inhibitor Toxicities',
    timeToAction: '24 hours',
    category: 'Treatment-Related',
    symptoms: [
      'Colitis: diarrhea, abdominal pain',
      'Pneumonitis: dyspnea, cough, hypoxia',
      'Hepatitis: elevated liver enzymes, jaundice',
      'Endocrinopathies: fatigue, headache, hypophysitis, thyroid dysfunction',
      'Dermatitis: rash, pruritus',
      'Nephritis: elevated creatinine',
      'Myocarditis: chest pain, arrhythmia, heart failure',
      'Neurological: neuropathy, myasthenia gravis-like syndrome, encephalitis'
    ],
    diagnostics: [
      'System-specific laboratory tests (liver function, thyroid function, etc.)',
      'Inflammatory markers (CRP, ESR)',
      'Imaging appropriate to affected organ system',
      'Consider specialist consultations based on affected organ',
      'Tissue biopsy in selected cases'
    ],
    management: [
      {
        title: 'Grade-Based Management',
        description: 'Severity determines whether to continue, hold, or permanently discontinue ICI'
      },
      {
        title: 'Corticosteroids',
        description: 'Cornerstone of management for grade 2 or higher toxicities'
      },
      {
        title: 'Specialty Consultation',
        description: 'Based on organ system involved (gastroenterology, pulmonology, etc.)'
      },
      {
        title: 'Additional Immunosuppression',
        description: 'For steroid-refractory cases (infliximab, mycophenolate mofetil, etc.)'
      },
      {
        title: 'Hormone Replacement',
        description: 'For endocrinopathies'
      }
    ],
    medications: [
      {
        name: 'Prednisone/Methylprednisolone',
        dosage: 'Grade 2: 0.5-1 mg/kg/day; Grade 3-4: 1-2 mg/kg/day'
      },
      {
        name: 'Infliximab',
        dosage: '5 mg/kg IV for steroid-refractory colitis'
      },
      {
        name: 'Mycophenolate mofetil',
        dosage: '500-1000 mg BID for hepatitis not responding to steroids'
      },
      {
        name: 'Hormone replacement',
        dosage: 'As needed for specific endocrinopathies'
      }
    ],
    additionalNotes: 'Early recognition and prompt intervention are critical. Most irAEs occur within first 12 weeks of treatment but can present months after discontinuation. Multidisciplinary management with oncology and organ specialists is recommended.'
  }
];
