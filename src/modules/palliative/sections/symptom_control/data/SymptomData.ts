export interface SymptomTemplate {
  id: string;
  name: string;
  description: string;
  category?: 'physical' | 'neuropsychological' | 'functional' | 'systemic' | 'psychosocial';
  icon?: string;
  commonCauses: string[];
  assessmentPoints: string[];
  interventions: {
    nonPharmacological: string[];
    pharmacological: string[];
  };
  redFlags: string[];
  isFavorite?: boolean;
}

// Define individual symptoms
const dyspnea: SymptomTemplate = {
  id: "dyspnea",
  name: "Breathlessness",
  description: "Subjective sensation of difficult or uncomfortable breathing",
  category: "physical",
  icon: "lungs",
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
};

const nausea: SymptomTemplate = {
  id: "nausea",
  name: "Nausea & Vomiting",
  description: "Unpleasant sensation of needing to vomit, with or without emesis",
  category: "physical",
  icon: "thermometer",
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
};

export const deliriumAssessment: SymptomTemplate = {
  id: "delirium",
  name: "Delirium",
  description: "Acute onset of fluctuating cognitive changes with altered awareness",
  category: "neuropsychological",
  icon: "brain",
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

const fatigue: SymptomTemplate = {
  id: "fatigue",
  name: "Fatigue",
  description: "Persistent physical and mental exhaustion affecting daily activities",
  category: "functional",
  icon: "battery-low",
  commonCauses: [
    "Disease progression",
    "Treatment side effects",
    "Anemia",
    "Depression",
    "Sleep disturbance"
  ],
  assessmentPoints: [
    "Severity and pattern",
    "Impact on daily activities",
    "Contributing factors",
    "Sleep quality",
    "Psychological state"
  ],
  interventions: {
    nonPharmacological: [
      "Activity pacing",
      "Sleep hygiene",
      "Exercise as tolerated",
      "Energy conservation",
      "Stress management"
    ],
    pharmacological: [
      "Treat reversible causes",
      "Methylphenidate if appropriate",
      "Modafinil in selected cases",
      "Steroids for short-term use"
    ]
  },
  redFlags: [
    "Sudden onset severe fatigue",
    "Associated fever",
    "New neurological symptoms",
    "Severe anemia"
  ]
};

const fever: SymptomTemplate = {
  id: "fever",
  name: "Fever",
  description: "Elevated body temperature with potential infectious or inflammatory cause",
  category: "systemic",
  icon: "thermometer",
  commonCauses: [
    "Infection",
    "Malignancy",
    "Drug reaction",
    "Thrombosis",
    "Tumor necrosis"
  ],
  assessmentPoints: [
    "Temperature pattern",
    "Associated symptoms",
    "Recent procedures/changes",
    "Neutrophil count",
    "Clinical signs of sepsis"
  ],
  interventions: {
    nonPharmacological: [
      "External cooling",
      "Hydration",
      "Light clothing",
      "Environmental cooling",
      "Monitor vital signs"
    ],
    pharmacological: [
      "Paracetamol",
      "NSAIDs if appropriate",
      "Empiric antibiotics if indicated",
      "Treat underlying cause"
    ]
  },
  redFlags: [
    "Neutropenic fever",
    "Signs of sepsis",
    "Temperature > 39.5°C",
    "Associated hypotension"
  ]
};

const anxiety: SymptomTemplate = {
  id: "anxiety",
  name: "Anxiety",
  description: "Persistent worry, fear, or unease affecting quality of life",
  category: "neuropsychological",
  icon: "brain",
  commonCauses: [
    "Disease-related concerns",
    "Pain",
    "Breathlessness",
    "Social issues",
    "Treatment uncertainty"
  ],
  assessmentPoints: [
    "Severity and triggers",
    "Impact on daily life",
    "Associated symptoms",
    "Support systems",
    "Previous mental health"
  ],
  interventions: {
    nonPharmacological: [
      "Psychological support",
      "Relaxation techniques",
      "Mindfulness",
      "Regular exercise",
      "Support groups"
    ],
    pharmacological: [
      "SSRIs for persistent symptoms",
      "Short-term benzodiazepines",
      "Beta-blockers for physical symptoms",
      "Address underlying causes"
    ]
  },
  redFlags: [
    "Suicidal ideation",
    "Panic attacks",
    "Severe social isolation",
    "Treatment refusal"
  ]
};

const socialIsolation: SymptomTemplate = {
  id: "social_isolation",
  name: "Social Isolation",
  description: "Reduced social connections and support affecting wellbeing",
  category: "psychosocial",
  icon: "users",
  commonCauses: [
    "Physical limitations",
    "Depression",
    "Financial constraints",
    "Loss of roles",
    "Communication difficulties"
  ],
  assessmentPoints: [
    "Support network",
    "Living situation",
    "Communication needs",
    "Financial resources",
    "Access to services"
  ],
  interventions: {
    nonPharmacological: [
      "Social work referral",
      "Support groups",
      "Community services",
      "Family meetings",
      "Volunteer visitors"
    ],
    pharmacological: [
      "Treat contributing depression",
      "Address symptom barriers",
      "Optimize communication aids",
      "Enable mobility support"
    ]
  },
  redFlags: [
    "Complete social withdrawal",
    "Caregiver burnout",
    "Financial crisis",
    "Safety concerns"
  ]
};

// Export the array of all symptoms
export const symptomTemplates: readonly SymptomTemplate[] = [
  dyspnea,
  nausea,
  deliriumAssessment,
  fatigue,
  fever,
  anxiety,
  socialIsolation
] as const;