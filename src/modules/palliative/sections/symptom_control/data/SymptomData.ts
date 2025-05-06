export interface SymptomTemplate {
  id: string;
  name: string;
  description: string;
  commonCauses: string[];
  assessmentPoints: string[];
  interventions: {
    nonPharmacological: string[];
    pharmacological: string[];
  };
  redFlags: string[];
}

export const deliriumAssessment = {
  id: "delirium",
  name: "Delirium",
  description: "Acute onset of fluctuating cognitive changes with altered awareness",
  commonCauses: [
    "Medications (especially opioids, anticholinergics)",
    "Infection/Sepsis",
    "Organ failure",
    "Metabolic derangements",
    "Brain metastases",
    "Dehydration"
  ],
  assessmentPoints: [
    "Onset and course",
    "Level of consciousness",
    "Attention span",
    "Orientation",
    "Memory",
    "Perceptual disturbances",
    "Psychomotor behavior",
    "Sleep-wake cycle"
  ],
  interventions: {
    nonPharmacological: [
      "Maintain day-night routine",
      "Familiar faces/objects",
      "Clear communication",
      "Regular reorientation",
      "Ensure glasses/hearing aids",
      "Early mobilization if safe"
    ],
    pharmacological: [
      "Haloperidol 0.5-1mg PO/SC/IV",
      "Risperidone 0.5mg PO",
      "Avoid benzodiazepines except in alcohol withdrawal",
      "Consider clonidine for sympathetic storm"
    ]
  },
  redFlags: [
    "Acute onset severe agitation",
    "Risk of harm to self/others",
    "Severe withdrawal symptoms",
    "New focal neurological signs"
  ]
};

export const symptomTemplates: SymptomTemplate[] = [
  {
    id: "dyspnea",
    name: "Breathlessness",
    description: "Subjective sensation of difficult or uncomfortable breathing",
    commonCauses: [
      "Lung cancer/metastases",
      "Pleural effusion",
      "COPD exacerbation",
      "Pneumonia",
      "Anxiety"
    ],
    assessmentPoints: [
      "Onset and pattern",
      "Exacerbating factors",
      "Associated symptoms",
      "Impact on function",
      "Oxygen saturation"
    ],
    interventions: {
      nonPharmacological: [
        "Positioning (upright, leaning forward)",
        "Cool air (fan, open window)",
        "Breathing exercises",
        "Anxiety management",
        "Activity pacing"
      ],
      pharmacological: [
        "Opioids (morphine/oxycodone)",
        "Benzodiazepines if anxiety prominent",
        "Oxygen if hypoxic",
        "Steroids if inflammatory cause"
      ]
    },
    redFlags: [
      "Severe sudden onset",
      "Stridor",
      "Hemoptysis",
      "New chest pain"
    ]
  },
  {
    id: "nausea",
    name: "Nausea & Vomiting",
    description: "Unpleasant sensation of needing to vomit, with or without emesis",
    commonCauses: [
      "Medications (opioids, chemotherapy)",
      "Bowel obstruction",
      "Raised intracranial pressure",
      "Anxiety",
      "Biochemical (hypercalcemia)"
    ],
    assessmentPoints: [
      "Pattern and frequency",
      "Associated symptoms",
      "Dietary intake",
      "Medications review",
      "Hydration status"
    ],
    interventions: {
      nonPharmacological: [
        "Small frequent meals",
        "Avoid strong odors",
        "Ginger products",
        "Acupressure bands",
        "Oral hygiene"
      ],
      pharmacological: [
        "Haloperidol 0.5-1.5mg",
        "Metoclopramide 10mg TDS",
        "Ondansetron 4-8mg BD",
        "Dexamethasone if bowel obstruction"
      ]
    },
    redFlags: [
      "Complete bowel obstruction",
      "Severe dehydration",
      "Coffee ground vomitus",
      "Associated severe headache"
    ]
  },
  deliriumAssessment,
  // Add more symptom templates as needed
];