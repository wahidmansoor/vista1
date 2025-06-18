/**
 * Treatment Protocol Database
 * Contains standardized treatment protocols for various cancer types
 */

import {
  TreatmentProtocol,
  CancerType,
  TreatmentType,
  TreatmentLine,
  EvidenceLevel,
  DrugRegimen,
  EligibilityCriteria,
  ContraindicationsCriteria,
  MonitoringPlan,
  ExpectedOutcomes,
  OrganFunctionCriteria,
  BiomarkerCriteria,
  MonitoringItem,
  EmergencyContact,
  SideEffect
} from './models';

export const ProtocolDatabase: TreatmentProtocol[] = [
  // Breast Cancer Protocols
  {
    id: 'breast_ac_tc_early',
    name: 'AC-T (Doxorubicin/Cyclophosphamide followed by Taxane)',
    cancerType: CancerType.BREAST,
    stage: ['I', 'II', 'III', 'Early'],
    treatmentType: TreatmentType.CHEMOTHERAPY,
    line: [TreatmentLine.FIRST_LINE],
    regimen: [
      {
        drugName: 'Doxorubicin',
        dosage: '60 mg/m²',
        route: 'IV',
        frequency: 'Every 3 weeks',
        cycleDuration: '21 days',
        totalCycles: 4,
        premedications: ['Ondansetron', 'Dexamethasone']
      },
      {
        drugName: 'Cyclophosphamide',
        dosage: '600 mg/m²',
        route: 'IV',
        frequency: 'Every 3 weeks',
        cycleDuration: '21 days',
        totalCycles: 4
      },
      {
        drugName: 'Paclitaxel',
        dosage: '175 mg/m²',
        route: 'IV',
        frequency: 'Every 3 weeks',
        cycleDuration: '21 days',
        totalCycles: 4,
        premedications: ['Diphenhydramine', 'Dexamethasone', 'H2 blocker']
      }
    ],
    eligibilityCriteria: {
      performanceStatus: {
        ecog: [0, 1],
        karnofsky: [80, 90, 100]
      },
      organFunction: {
        cardiac: {
          ejectionFraction: '≥50%'
        },
        hepatic: {
          bilirubin: '≤1.5x ULN',
          ast: '≤2.5x ULN',
          alt: '≤2.5x ULN'
        },
        hematologic: {
          hemoglobin: '≥9 g/dL',
          neutrophils: '≥1500/μL',
          platelets: '≥100,000/μL'
        }
      },
      ageRange: {
        min: 18,
        max: 75
      }
    },
    contraindicationsCriteria: {
      absolute: ['Severe heart failure', 'Recent myocardial infarction', 'Severe hepatic impairment'],
      relative: ['Previous anthracycline therapy', 'Borderline cardiac function'],
      drugInteractions: ['Trastuzumab (increased cardiotoxicity)'],
      comorbidities: ['Congestive heart failure', 'Cardiomyopathy']
    },
    monitoring: {
      pretreatment: [
        {
          test: 'ECHO or MUGA',
          frequency: 'Baseline',
          parameters: ['Ejection fraction'],
          alertThresholds: [
            {
              parameter: 'LVEF',
              value: '<50%',
              action: 'Consider alternative regimen'
            }
          ]
        },
        {
          test: 'Complete Blood Count',
          frequency: 'Baseline',
          parameters: ['Hemoglobin', 'Neutrophils', 'Platelets']
        }
      ],
      duringTreatment: [
        {
          test: 'ECHO',
          frequency: 'Every 3 months',
          parameters: ['Ejection fraction'],
          alertThresholds: [
            {
              parameter: 'LVEF drop',
              value: '>10% from baseline',
              action: 'Discontinue anthracycline'
            }
          ]
        },
        {
          test: 'CBC with differential',
          frequency: 'Before each cycle',
          parameters: ['ANC', 'Platelets']
        }
      ],
      postTreatment: [
        {
          test: 'ECHO',
          frequency: 'Every 6 months for 2 years',
          parameters: ['Ejection fraction']
        }
      ],
      emergencyContacts: [
        {
          role: 'Oncology Fellow',
          phone: '1-800-ONCOLOGY',
          availability: '24/7'
        }
      ]
    },
    expectedOutcomes: {
      responseRate: '70-80%',
      progressionFreeSesurvival: '24-36 months',
      overallSurvival: '5-year OS: 85-90%',
      commonSideEffects: [
        {
          name: 'Neutropenia',
          frequency: '40-60%',
          severity: 'Grade 3-4',
          management: 'G-CSF support, dose delays'
        },
        {
          name: 'Nausea/Vomiting',
          frequency: '80-90%',
          severity: 'Grade 1-3',
          management: 'Antiemetic prophylaxis'
        },
        {
          name: 'Alopecia',
          frequency: '100%',
          severity: 'Grade 2',
          management: 'Scalp cooling, wigs'
        },
        {
          name: 'Peripheral neuropathy',
          frequency: '30-40%',
          severity: 'Grade 1-2',
          management: 'Dose modifications, neuroprotective agents'
        }
      ],
      qualityOfLifeImpact: 'Moderate impact during treatment, good recovery post-treatment'
    },
    evidenceLevel: EvidenceLevel.LEVEL_1A,
    guidelineSource: 'NCCN Guidelines v.2024',
    lastUpdated: '2024-06-01'
  },

  // Lung Cancer Protocols
  {
    id: 'lung_carboplatin_paclitaxel',
    name: 'Carboplatin/Paclitaxel',
    cancerType: CancerType.LUNG,
    stage: ['IIIB', 'IV', 'Advanced'],
    treatmentType: TreatmentType.CHEMOTHERAPY,
    line: [TreatmentLine.FIRST_LINE],
    regimen: [
      {
        drugName: 'Carboplatin',
        dosage: 'AUC 6',
        route: 'IV',
        frequency: 'Every 3 weeks',
        cycleDuration: '21 days',
        totalCycles: 4,
        premedications: ['Ondansetron', 'Dexamethasone']
      },
      {
        drugName: 'Paclitaxel',
        dosage: '200 mg/m²',
        route: 'IV',
        frequency: 'Every 3 weeks',
        cycleDuration: '21 days',
        totalCycles: 4,
        premedications: ['Diphenhydramine', 'Dexamethasone', 'H2 blocker']
      }
    ],
    eligibilityCriteria: {
      performanceStatus: {
        ecog: [0, 1, 2],
        karnofsky: [60, 70, 80, 90, 100]
      },
      organFunction: {
        renal: {
          creatinine: '≤1.5x ULN',
          gfr: '≥30 mL/min'
        },
        hematologic: {
          hemoglobin: '≥9 g/dL',
          neutrophils: '≥1500/μL',
          platelets: '≥100,000/μL'
        }
      },
      biomarkers: [
        {
          name: 'EGFR',
          status: 'negative',
          required: false
        },
        {
          name: 'ALK',
          status: 'negative',
          required: false
        }
      ]
    },
    contraindicationsCriteria: {
      absolute: ['Severe renal impairment', 'Active infection'],
      relative: ['Age >75 years', 'ECOG 3'],
      drugInteractions: ['Live vaccines'],
      comorbidities: ['Severe COPD', 'Interstitial lung disease']
    },
    monitoring: {
      pretreatment: [
        {
          test: 'Pulmonary function tests',
          frequency: 'Baseline',
          parameters: ['FEV1', 'DLCO']
        }
      ],
      duringTreatment: [
        {
          test: 'CBC with differential',
          frequency: 'Before each cycle',
          parameters: ['ANC', 'Platelets']
        },
        {
          test: 'Comprehensive metabolic panel',
          frequency: 'Before each cycle',
          parameters: ['Creatinine', 'Electrolytes']
        }
      ],
      postTreatment: [
        {
          test: 'CT chest/abdomen/pelvis',
          frequency: 'Every 3 months for 2 years',
          parameters: ['Response assessment']
        }
      ],
      emergencyContacts: [
        {
          role: 'Pulmonary Oncologist',
          phone: '1-800-LUNG-ONC',
          availability: 'Business hours'
        }
      ]
    },
    expectedOutcomes: {
      responseRate: '25-35%',
      progressionFreeSesurvival: '4-6 months',
      overallSurvival: '8-12 months',
      commonSideEffects: [
        {
          name: 'Neutropenia',
          frequency: '30-40%',
          severity: 'Grade 3-4',
          management: 'G-CSF support, dose delays'
        },
        {
          name: 'Thrombocytopenia',
          frequency: '20-30%',
          severity: 'Grade 3-4',
          management: 'Platelet transfusion if needed'
        },
        {
          name: 'Peripheral neuropathy',
          frequency: '40-50%',
          severity: 'Grade 1-2',
          management: 'Dose modifications'
        }
      ],
      qualityOfLifeImpact: 'Moderate to significant impact during treatment'
    },
    evidenceLevel: EvidenceLevel.LEVEL_1A,
    guidelineSource: 'NCCN Guidelines v.2024',
    lastUpdated: '2024-06-01'
  },

  // Colorectal Cancer Protocol
  {
    id: 'colorectal_folfox',
    name: 'FOLFOX (5-FU/Leucovorin/Oxaliplatin)',
    cancerType: CancerType.COLORECTAL,
    stage: ['III', 'IV', 'Advanced'],
    treatmentType: TreatmentType.CHEMOTHERAPY,
    line: [TreatmentLine.FIRST_LINE, TreatmentLine.SECOND_LINE],
    regimen: [
      {
        drugName: 'Oxaliplatin',
        dosage: '85 mg/m²',
        route: 'IV',
        frequency: 'Every 2 weeks',
        cycleDuration: '14 days',
        totalCycles: 12,
        premedications: ['Ondansetron', 'Dexamethasone']
      },
      {
        drugName: 'Leucovorin',
        dosage: '400 mg/m²',
        route: 'IV',
        frequency: 'Every 2 weeks',
        cycleDuration: '14 days',
        totalCycles: 12
      },
      {
        drugName: '5-Fluorouracil',
        dosage: '400 mg/m² bolus + 2400 mg/m² infusion',
        route: 'IV',
        frequency: 'Every 2 weeks',
        cycleDuration: '14 days',
        totalCycles: 12
      }
    ],
    eligibilityCriteria: {
      performanceStatus: {
        ecog: [0, 1, 2],
        karnofsky: [60, 70, 80, 90, 100]
      },
      organFunction: {
        hepatic: {
          bilirubin: '≤1.5x ULN',
          ast: '≤3x ULN',
          alt: '≤3x ULN'
        },
        renal: {
          creatinine: '≤1.5x ULN'
        },
        hematologic: {
          neutrophils: '≥1500/μL',
          platelets: '≥100,000/μL'
        }
      }
    },
    contraindicationsCriteria: {
      absolute: ['DPD deficiency', 'Severe renal impairment'],
      relative: ['Age >75 years', 'Peripheral neuropathy'],
      drugInteractions: ['Warfarin', 'Phenytoin'],
      comorbidities: ['Severe cardiac disease']
    },
    monitoring: {
      pretreatment: [
        {
          test: 'DPD testing',
          frequency: 'Baseline',
          parameters: ['DPD enzyme activity']
        }
      ],
      duringTreatment: [
        {
          test: 'CBC with differential',
          frequency: 'Before each cycle',
          parameters: ['ANC', 'Platelets']
        },
        {
          test: 'Neuropathy assessment',
          frequency: 'Each visit',
          parameters: ['Sensory function', 'Motor function']
        }
      ],
      postTreatment: [
        {
          test: 'CEA',
          frequency: 'Every 3 months',
          parameters: ['Tumor marker trend']
        }
      ],
      emergencyContacts: [
        {
          role: 'GI Oncologist',
          phone: '1-800-GI-ONCO',
          availability: 'Business hours'
        }
      ]
    },
    expectedOutcomes: {
      responseRate: '40-50%',
      progressionFreeSesurvival: '8-10 months',
      overallSurvival: '18-24 months',
      commonSideEffects: [
        {
          name: 'Peripheral neuropathy',
          frequency: '70-80%',
          severity: 'Grade 1-3',
          management: 'Dose modifications, cold avoidance'
        },
        {
          name: 'Diarrhea',
          frequency: '40-50%',
          severity: 'Grade 1-3',
          management: 'Antidiarrheal agents, hydration'
        },
        {
          name: 'Neutropenia',
          frequency: '30-40%',
          severity: 'Grade 3-4',
          management: 'G-CSF support'
        }
      ],
      qualityOfLifeImpact: 'Moderate impact, neuropathy may be persistent'
    },
    evidenceLevel: EvidenceLevel.LEVEL_1A,
    guidelineSource: 'NCCN Guidelines v.2024',
    lastUpdated: '2024-06-01'
  },

  // Prostate Cancer Protocol
  {
    id: 'prostate_docetaxel',
    name: 'Docetaxel/Prednisone',
    cancerType: CancerType.PROSTATE,
    stage: ['Advanced', 'Metastatic'],
    treatmentType: TreatmentType.CHEMOTHERAPY,
    line: [TreatmentLine.FIRST_LINE],
    regimen: [
      {
        drugName: 'Docetaxel',
        dosage: '75 mg/m²',
        route: 'IV',
        frequency: 'Every 3 weeks',
        cycleDuration: '21 days',
        totalCycles: 10,
        premedications: ['Dexamethasone', 'Diphenhydramine', 'H2 blocker']
      },
      {
        drugName: 'Prednisone',
        dosage: '5 mg',
        route: 'PO',
        frequency: 'Twice daily',
        cycleDuration: 'Continuous',
        totalCycles: 10
      }
    ],
    eligibilityCriteria: {
      performanceStatus: {
        ecog: [0, 1, 2],
        karnofsky: [60, 70, 80, 90, 100]
      },
      organFunction: {
        hepatic: {
          bilirubin: '≤ULN',
          ast: '≤1.5x ULN',
          alt: '≤1.5x ULN'
        },
        hematologic: {
          neutrophils: '≥1500/μL',
          platelets: '≥100,000/μL'
        }
      }
    },
    contraindicationsCriteria: {
      absolute: ['Severe hepatic impairment', 'Active infection'],
      relative: ['Previous taxane therapy', 'Severe neuropathy'],
      drugInteractions: ['Strong CYP3A4 inhibitors'],
      comorbidities: ['Severe heart failure']
    },
    monitoring: {
      pretreatment: [
        {
          test: 'PSA',
          frequency: 'Baseline',
          parameters: ['Baseline PSA level']
        }
      ],
      duringTreatment: [
        {
          test: 'PSA',
          frequency: 'Every cycle',
          parameters: ['PSA trend']
        },
        {
          test: 'CBC with differential',
          frequency: 'Before each cycle',
          parameters: ['ANC', 'Platelets']
        }
      ],
      postTreatment: [
        {
          test: 'PSA',
          frequency: 'Every 3 months',
          parameters: ['PSA progression']
        }
      ],
      emergencyContacts: [
        {
          role: 'Genitourinary Oncologist',
          phone: '1-800-GU-ONCO',
          availability: 'Business hours'
        }
      ]
    },
    expectedOutcomes: {
      responseRate: '45-50% (PSA decline >50%)',
      progressionFreeSesurvival: '5-7 months',
      overallSurvival: '18-20 months',
      commonSideEffects: [
        {
          name: 'Neutropenia',
          frequency: '30-40%',
          severity: 'Grade 3-4',
          management: 'G-CSF support'
        },
        {
          name: 'Fatigue',
          frequency: '60-70%',
          severity: 'Grade 1-2',
          management: 'Supportive care'
        },
        {
          name: 'Peripheral neuropathy',
          frequency: '40-50%',
          severity: 'Grade 1-2',
          management: 'Dose modifications'
        }
      ],
      qualityOfLifeImpact: 'Moderate impact during treatment'
    },
    evidenceLevel: EvidenceLevel.LEVEL_1A,
    guidelineSource: 'NCCN Guidelines v.2024',
    lastUpdated: '2024-06-01'
  },

  // Pancreatic Cancer Protocol
  {
    id: 'pancreatic_folfirinox',
    name: 'FOLFIRINOX',
    cancerType: CancerType.PANCREATIC,
    stage: ['Advanced', 'Metastatic'],
    treatmentType: TreatmentType.CHEMOTHERAPY,
    line: [TreatmentLine.FIRST_LINE],
    regimen: [
      {
        drugName: 'Oxaliplatin',
        dosage: '85 mg/m²',
        route: 'IV',
        frequency: 'Every 2 weeks',
        cycleDuration: '14 days',
        totalCycles: 12
      },
      {
        drugName: 'Irinotecan',
        dosage: '180 mg/m²',
        route: 'IV',
        frequency: 'Every 2 weeks',
        cycleDuration: '14 days',
        totalCycles: 12
      },
      {
        drugName: 'Leucovorin',
        dosage: '400 mg/m²',
        route: 'IV',
        frequency: 'Every 2 weeks',
        cycleDuration: '14 days',
        totalCycles: 12
      },
      {
        drugName: '5-Fluorouracil',
        dosage: '400 mg/m² bolus + 2400 mg/m² infusion',
        route: 'IV',
        frequency: 'Every 2 weeks',
        cycleDuration: '14 days',
        totalCycles: 12
      }
    ],
    eligibilityCriteria: {
      performanceStatus: {
        ecog: [0, 1],
        karnofsky: [80, 90, 100]
      },
      organFunction: {
        hepatic: {
          bilirubin: '≤1.5x ULN'
        },
        hematologic: {
          neutrophils: '≥1500/μL',
          platelets: '≥100,000/μL'
        }
      },
      ageRange: {
        min: 18,
        max: 75
      }
    },
    contraindicationsCriteria: {
      absolute: ['UGT1A1*28 homozygous', 'ECOG 2-4'],
      relative: ['Age >75 years', 'Significant comorbidities'],
      drugInteractions: ['Strong CYP3A4 inhibitors'],
      comorbidities: ['Gilbert syndrome']
    },
    monitoring: {
      pretreatment: [
        {
          test: 'UGT1A1 genotyping',
          frequency: 'Baseline',
          parameters: ['UGT1A1*28 status']
        }
      ],
      duringTreatment: [
        {
          test: 'CBC with differential',
          frequency: 'Before each cycle',
          parameters: ['ANC', 'Platelets']
        }
      ],
      postTreatment: [
        {
          test: 'CA 19-9',
          frequency: 'Every 2 months',
          parameters: ['Tumor marker trend']
        }
      ],
      emergencyContacts: [
        {
          role: 'Pancreatic Oncologist',
          phone: '1-800-PANC-ONC',
          availability: 'Business hours'
        }
      ]
    },
    expectedOutcomes: {
      responseRate: '30-35%',
      progressionFreeSesurvival: '6-8 months',
      overallSurvival: '11-13 months',
      commonSideEffects: [
        {
          name: 'Neutropenia',
          frequency: '45-50%',
          severity: 'Grade 3-4',
          management: 'G-CSF support, dose reductions'
        },
        {
          name: 'Diarrhea',
          frequency: '40-45%',
          severity: 'Grade 3-4',
          management: 'Antidiarrheal agents, dose modifications'
        },
        {
          name: 'Peripheral neuropathy',
          frequency: '70-80%',
          severity: 'Grade 1-3',
          management: 'Dose modifications, neuroprotective agents'
        }
      ],
      qualityOfLifeImpact: 'Significant impact during treatment, requires close monitoring'
    },
    evidenceLevel: EvidenceLevel.LEVEL_1B,
    guidelineSource: 'NCCN Guidelines v.2024',
    lastUpdated: '2024-06-01'
  }
];

// Helper function to get protocols by cancer type
export const getProtocolsByCancerType = (cancerType: CancerType): TreatmentProtocol[] => {
  return ProtocolDatabase.filter(protocol => protocol.cancerType === cancerType);
};

// Helper function to get protocols by treatment line
export const getProtocolsByTreatmentLine = (treatmentLine: TreatmentLine): TreatmentProtocol[] => {
  return ProtocolDatabase.filter(protocol => protocol.line.includes(treatmentLine));
};

// Helper function to get protocols by evidence level
export const getProtocolsByEvidenceLevel = (evidenceLevel: EvidenceLevel): TreatmentProtocol[] => {
  return ProtocolDatabase.filter(protocol => protocol.evidenceLevel === evidenceLevel);
};

// Helper function to search protocols by name
export const searchProtocolsByName = (searchTerm: string): TreatmentProtocol[] => {
  return ProtocolDatabase.filter(protocol => 
    protocol.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
};
