// Enhanced Evaluation Templates with AI-powered clinical decision support
// filepath: d:\Mansoor\mwoncovista\vista1\src\modules\opd\data\enhancedEvaluationTemplates.ts

import { CancerType, EvaluationTemplate } from '../types/enhanced-evaluation';

export const enhancedEvaluationTemplates: Record<CancerType, EvaluationTemplate> = {
  breast: {
    id: 'breast-cancer-eval-v2',
    cancerType: 'breast',
    title: 'Comprehensive Breast Cancer Evaluation',
    description: 'AI-enhanced evaluation template for breast cancer with molecular profiling and risk stratification',
    version: '2.1.0',
    sections: [
      {
        id: 'demographics',
        title: 'Patient Demographics',
        description: 'Basic patient information and demographics',
        icon: '👤',
        items: [
          {
            id: 'age',
            text: 'Age at diagnosis',
            type: 'number',
            required: true,
            tooltip: 'Age influences treatment decisions and prognosis',
            validation: { min: 18, max: 120 }
          },
          {
            id: 'menopausal_status',
            text: 'Menopausal status',
            type: 'select',
            required: true,
            options: [
              { value: 'premenopausal', label: 'Premenopausal' },
              { value: 'perimenopausal', label: 'Perimenopausal' },
              { value: 'postmenopausal', label: 'Postmenopausal' }
            ]
          },
          {
            id: 'family_history',
            text: 'Family history of breast/ovarian cancer',
            type: 'select',
            required: true,
            options: [
              { value: 'none', label: 'No family history' },
              { value: 'breast_maternal', label: 'Breast cancer - maternal side' },
              { value: 'breast_paternal', label: 'Breast cancer - paternal side' },
              { value: 'ovarian', label: 'Ovarian cancer' },
              { value: 'both', label: 'Both breast and ovarian' }
            ]
          }
        ],
        requiredForCompletion: true
      },
      {
        id: 'clinical_presentation',
        title: 'Clinical Presentation',
        description: 'Presenting symptoms and physical findings',
        icon: '🔍',
        items: [
          {
            id: 'primary_complaint',
            text: 'Chief complaint',
            type: 'text',
            required: true,
            placeholder: 'e.g., palpable mass, screening detected lesion'
          },
          {
            id: 'symptom_duration',
            text: 'Duration of symptoms',
            type: 'text',
            required: false,
            placeholder: 'e.g., 2 months, discovered during screening'
          },
          {
            id: 'breast_examination',
            text: 'Breast examination findings',
            type: 'text',
            required: true,
            placeholder: 'Size, location, consistency, mobility, skin changes'
          },
          {
            id: 'lymph_nodes',
            text: 'Lymph node examination',
            type: 'text',
            required: true,
            placeholder: 'Axillary, supraclavicular, infraclavicular nodes'
          }
        ],
        redFlags: [
          'Inflammatory changes (peau d\'orange, erythema)',
          'Fixed or matted lymph nodes',
          'Supraclavicular lymphadenopathy',
          'Ulceration or skin involvement'
        ]
      },
      {
        id: 'imaging_pathology',
        title: 'Imaging & Pathology',
        description: 'Radiological and histopathological findings',
        icon: '🔬',
        items: [
          {
            id: 'mammography_birads',
            text: 'Mammography BI-RADS category',
            type: 'select',
            required: true,
            options: [
              { value: '1', label: 'BI-RADS 1 - Negative' },
              { value: '2', label: 'BI-RADS 2 - Benign' },
              { value: '3', label: 'BI-RADS 3 - Probably benign' },
              { value: '4a', label: 'BI-RADS 4A - Low suspicion' },
              { value: '4b', label: 'BI-RADS 4B - Moderate suspicion' },
              { value: '4c', label: 'BI-RADS 4C - High suspicion' },
              { value: '5', label: 'BI-RADS 5 - Highly suggestive of malignancy' },
              { value: '6', label: 'BI-RADS 6 - Known malignancy' }
            ]
          },
          {
            id: 'tumor_size',
            text: 'Tumor size (cm)',
            type: 'number',
            required: true,
            tooltip: 'Largest dimension of invasive component',
            validation: { min: 0.1, max: 50 }
          },
          {
            id: 'histologic_type',
            text: 'Histologic type',
            type: 'select',
            required: true,
            options: [
              { value: 'invasive_ductal', label: 'Invasive ductal carcinoma (IDC)' },
              { value: 'invasive_lobular', label: 'Invasive lobular carcinoma (ILC)' },
              { value: 'ductal_in_situ', label: 'Ductal carcinoma in situ (DCIS)' },
              { value: 'mixed', label: 'Mixed ductal and lobular' },
              { value: 'inflammatory', label: 'Inflammatory breast cancer' },
              { value: 'other', label: 'Other (specify in notes)' }
            ]
          },
          {
            id: 'histologic_grade',
            text: 'Histologic grade',
            type: 'select',
            required: true,
            options: [
              { value: 'G1', label: 'Grade 1 (well differentiated)' },
              { value: 'G2', label: 'Grade 2 (moderately differentiated)' },
              { value: 'G3', label: 'Grade 3 (poorly differentiated)' },
              { value: 'GX', label: 'Grade cannot be assessed' }
            ]
          }
        ],
        aiGuidance: [
          'BI-RADS 4C and 5 lesions require immediate biopsy',
          'Tumor size is critical for T-stage determination',
          'Grade 3 tumors may require more aggressive treatment'
        ]
      },
      {
        id: 'biomarkers',
        title: 'Biomarker Profile',
        description: 'Hormone receptors and HER2 status',
        icon: '🧬',
        items: [
          {
            id: 'er_status',
            text: 'Estrogen receptor (ER) status',
            type: 'select',
            required: true,
            options: [
              { value: 'positive', label: 'Positive' },
              { value: 'negative', label: 'Negative' },
              { value: 'unknown', label: 'Unknown/Pending' }
            ],
            aiAssisted: true
          },
          {
            id: 'er_percentage',
            text: 'ER percentage (if positive)',
            type: 'number',
            required: false,
            validation: { min: 0, max: 100 },
            tooltip: 'Percentage of tumor cells staining positive'
          },
          {
            id: 'pr_status',
            text: 'Progesterone receptor (PR) status',
            type: 'select',
            required: true,
            options: [
              { value: 'positive', label: 'Positive' },
              { value: 'negative', label: 'Negative' },
              { value: 'unknown', label: 'Unknown/Pending' }
            ]
          },
          {
            id: 'pr_percentage',
            text: 'PR percentage (if positive)',
            type: 'number',
            required: false,
            validation: { min: 0, max: 100 }
          },
          {
            id: 'her2_status',
            text: 'HER2 status',
            type: 'select',
            required: true,
            options: [
              { value: 'positive', label: 'Positive (3+ or FISH amplified)' },
              { value: 'negative', label: 'Negative (0 or 1+)' },
              { value: 'equivocal', label: 'Equivocal (2+, FISH pending)' },
              { value: 'unknown', label: 'Unknown/Pending' }
            ],
            redFlags: ['Equivocal results require FISH confirmation']
          },
          {
            id: 'ki67',
            text: 'Ki-67 proliferation index (%)',
            type: 'number',
            required: false,
            validation: { min: 0, max: 100 },
            tooltip: 'Percentage of proliferating cells'
          }
        ],
        cancerSpecificNotes: [
          'Triple-negative: ER-, PR-, HER2-',
          'Luminal A-like: ER+, HER2-, Ki-67 low',
          'Luminal B-like: ER+, HER2-, Ki-67 high or PR low',
          'HER2+: Any ER/PR status with HER2 amplification'
        ]
      },
      {
        id: 'staging',
        title: 'TNM Staging',
        description: 'Clinical and pathological staging',
        icon: '📊',
        items: [
          {
            id: 't_stage',
            text: 'T stage (primary tumor)',
            type: 'select',
            required: true,
            options: [
              { value: 'Tis', label: 'Tis - Carcinoma in situ' },
              { value: 'T1', label: 'T1 - ≤2 cm' },
              { value: 'T1a', label: 'T1a - >0.1 to ≤0.5 cm' },
              { value: 'T1b', label: 'T1b - >0.5 to ≤1 cm' },
              { value: 'T1c', label: 'T1c - >1 to ≤2 cm' },
              { value: 'T2', label: 'T2 - >2 to ≤5 cm' },
              { value: 'T3', label: 'T3 - >5 cm' },
              { value: 'T4', label: 'T4 - Any size with extension' }
            ]
          },
          {
            id: 'n_stage',
            text: 'N stage (regional lymph nodes)',
            type: 'select',
            required: true,
            options: [
              { value: 'N0', label: 'N0 - No regional lymph node metastasis' },
              { value: 'N1', label: 'N1 - 1-3 axillary lymph nodes' },
              { value: 'N2', label: 'N2 - 4-9 axillary or internal mammary nodes' },
              { value: 'N3', label: 'N3 - ≥10 axillary or infraclavicular nodes' }
            ]
          },
          {
            id: 'm_stage',
            text: 'M stage (distant metastasis)',
            type: 'select',
            required: true,
            options: [
              { value: 'M0', label: 'M0 - No distant metastasis' },
              { value: 'M1', label: 'M1 - Distant metastasis present' }
            ],
            redFlags: ['M1 disease requires systemic staging workup']
          },
          {
            id: 'overall_stage',
            text: 'Overall stage',
            type: 'select',
            required: true,
            options: [
              { value: '0', label: 'Stage 0 (in situ)' },
              { value: 'I', label: 'Stage I' },
              { value: 'IIA', label: 'Stage IIA' },
              { value: 'IIB', label: 'Stage IIB' },
              { value: 'IIIA', label: 'Stage IIIA' },
              { value: 'IIIB', label: 'Stage IIIB' },
              { value: 'IIIC', label: 'Stage IIIC' },
              { value: 'IV', label: 'Stage IV' }
            ]
          }
        ]
      },
      {
        id: 'molecular_testing',
        title: 'Molecular Testing',
        description: 'Genetic mutations and genomic profiling',
        icon: '🔬',
        items: [
          {
            id: 'brca1_status',
            text: 'BRCA1 mutation status',
            type: 'select',
            required: false,
            options: [
              { value: 'pathogenic', label: 'Pathogenic mutation detected' },
              { value: 'benign', label: 'Benign variant' },
              { value: 'vus', label: 'Variant of uncertain significance' },
              { value: 'negative', label: 'No mutation detected' },
              { value: 'not_tested', label: 'Not tested' }
            ],
            cancerSpecific: ['breast', 'ovarian']
          },
          {
            id: 'brca2_status',
            text: 'BRCA2 mutation status',
            type: 'select',
            required: false,
            options: [
              { value: 'pathogenic', label: 'Pathogenic mutation detected' },
              { value: 'benign', label: 'Benign variant' },
              { value: 'vus', label: 'Variant of uncertain significance' },
              { value: 'negative', label: 'No mutation detected' },
              { value: 'not_tested', label: 'Not tested' }
            ]
          },
          {
            id: 'genetic_counseling',
            text: 'Genetic counseling referral',
            type: 'select',
            required: false,
            options: [
              { value: 'completed', label: 'Completed' },
              { value: 'referred', label: 'Referred' },
              { value: 'not_indicated', label: 'Not indicated' },
              { value: 'declined', label: 'Declined by patient' }
            ]
          }
        ],
        cancerSpecificNotes: [
          'Consider genetic testing for age <50, family history, or triple-negative disease',
          'BRCA mutations may influence surgical and systemic treatment decisions'
        ]
      },
      {
        id: 'performance_comorbidities',
        title: 'Performance Status & Comorbidities',
        description: 'Functional status and medical comorbidities',
        icon: '💪',
        items: [
          {
            id: 'ecog',
            text: 'ECOG Performance Status',
            type: 'select',
            required: true,
            options: [
              { value: '0', label: '0 - Fully active' },
              { value: '1', label: '1 - Restricted strenuous activity' },
              { value: '2', label: '2 - Ambulatory, unable to work' },
              { value: '3', label: '3 - Limited self-care' },
              { value: '4', label: '4 - Completely disabled' }
            ],
            redFlags: ['ECOG ≥2 may require dose modifications or alternative approaches']
          },
          {
            id: 'karnofsky',
            text: 'Karnofsky Performance Scale',
            type: 'number',
            required: false,
            validation: { min: 0, max: 100 },
            tooltip: 'Scale from 0-100, higher is better'
          },
          {
            id: 'cardiac_function',
            text: 'Baseline ejection fraction (%)',
            type: 'number',
            required: false,
            validation: { min: 10, max: 80 },
            tooltip: 'Important for anthracycline and HER2-targeted therapy',
            redFlags: ['EF <50% may contraindicate cardiotoxic agents']
          },
          {
            id: 'renal_function',
            text: 'Creatinine (mg/dL)',
            type: 'number',
            required: false,
            validation: { min: 0.1, max: 10 }
          },
          {
            id: 'liver_function',
            text: 'Total bilirubin (mg/dL)',
            type: 'number',
            required: false,
            validation: { min: 0.1, max: 20 }
          }
        ]
      }
    ],
    staging: {
      system: 'tnm',
      version: 'AJCC 8th Edition',
      specificFields: ['t_stage', 'n_stage', 'm_stage', 'overall_stage']
    },
    biomarkers: {
      required: ['er_status', 'pr_status', 'her2_status'],
      optional: ['ki67', 'brca1_status', 'brca2_status'],
      emerging: ['oncotype_dx', 'mammaprint', 'prosigna']
    },
    notes: [
      'All invasive breast cancers require ER, PR, and HER2 testing',
      'Consider genetic counseling for high-risk patients',
      'Multidisciplinary team discussion recommended for all cases'
    ],
    redFlags: [
      'Inflammatory breast cancer signs',
      'Suspicious lymphadenopathy',
      'Skin involvement or ulceration',
      'Multiple primary tumors'
    ],
    aiEnabled: true,
    lastUpdated: '2025-06-03',
    guidelineReferences: [
      {
        source: 'NCCN Breast Cancer Guidelines',
        version: 'v1.2025',
        url: 'https://nccn.org/guidelines/breast'
      },
      {
        source: 'ASCO Breast Cancer Guidelines',
        version: '2024',
        url: 'https://ascopubs.org/guidelines/breast-cancer'
      }
    ]
  },

  lung: {
    id: 'lung-cancer-eval-v2',
    cancerType: 'lung',
    title: 'Comprehensive Lung Cancer Evaluation',
    description: 'AI-enhanced evaluation for lung cancer with molecular profiling and immunotherapy biomarkers',
    version: '2.1.0',
    sections: [
      {
        id: 'demographics',
        title: 'Patient Demographics & Risk Factors',
        description: 'Patient information and smoking history',
        icon: '👤',
        items: [
          {
            id: 'age',
            text: 'Age at diagnosis',
            type: 'number',
            required: true,
            validation: { min: 18, max: 120 }
          },
          {
            id: 'smoking_status',
            text: 'Smoking status',
            type: 'select',
            required: true,
            options: [
              { value: 'never', label: 'Never smoker (<100 cigarettes lifetime)' },
              { value: 'former', label: 'Former smoker' },
              { value: 'current', label: 'Current smoker' }
            ]
          },
          {
            id: 'pack_years',
            text: 'Pack-years (if applicable)',
            type: 'number',
            required: false,
            validation: { min: 0, max: 200 },
            tooltip: 'Packs per day × years smoked'
          },
          {
            id: 'quit_date',
            text: 'Quit date (if former smoker)',
            type: 'date',
            required: false
          },
          {
            id: 'occupational_exposure',
            text: 'Occupational exposures',
            type: 'multiselect',
            required: false,
            options: [
              { value: 'asbestos', label: 'Asbestos' },
              { value: 'radon', label: 'Radon' },
              { value: 'diesel_exhaust', label: 'Diesel exhaust' },
              { value: 'silica', label: 'Silica' },
              { value: 'arsenic', label: 'Arsenic' },
              { value: 'none', label: 'None known' }
            ]
          }
        ]
      },
      {
        id: 'clinical_presentation',
        title: 'Clinical Presentation',
        description: 'Symptoms and physical findings',
        icon: '🫁',
        items: [
          {
            id: 'presenting_symptoms',
            text: 'Presenting symptoms',
            type: 'multiselect',
            required: true,
            options: [
              { value: 'cough', label: 'Cough' },
              { value: 'dyspnea', label: 'Dyspnea' },
              { value: 'chest_pain', label: 'Chest pain' },
              { value: 'hemoptysis', label: 'Hemoptysis' },
              { value: 'weight_loss', label: 'Weight loss' },
              { value: 'fatigue', label: 'Fatigue' },
              { value: 'screening_detected', label: 'Screening detected' },
              { value: 'incidental', label: 'Incidental finding' }
            ],
            redFlags: ['Hemoptysis', 'Unexplained weight loss >10%', 'Superior vena cava syndrome']
          },
          {
            id: 'symptom_duration',
            text: 'Duration of symptoms',
            type: 'text',
            required: false,
            placeholder: 'e.g., 3 months, 6 weeks'
          }
        ]
      },
      {
        id: 'imaging_pathology',
        title: 'Imaging & Pathology',
        description: 'Radiological findings and tissue diagnosis',
        icon: '🔬',
        items: [
          {
            id: 'primary_site',
            text: 'Primary tumor location',
            type: 'select',
            required: true,
            options: [
              { value: 'right_upper', label: 'Right upper lobe' },
              { value: 'right_middle', label: 'Right middle lobe' },
              { value: 'right_lower', label: 'Right lower lobe' },
              { value: 'left_upper', label: 'Left upper lobe' },
              { value: 'left_lower', label: 'Left lower lobe' },
              { value: 'main_bronchus', label: 'Main bronchus' },
              { value: 'multiple', label: 'Multiple locations' }
            ]
          },
          {
            id: 'tumor_size',
            text: 'Tumor size (cm)',
            type: 'number',
            required: true,
            validation: { min: 0.1, max: 20 }
          },
          {
            id: 'histology',
            text: 'Histological type',
            type: 'select',
            required: true,
            options: [
              { value: 'adenocarcinoma', label: 'Adenocarcinoma' },
              { value: 'squamous_cell', label: 'Squamous cell carcinoma' },
              { value: 'large_cell', label: 'Large cell carcinoma' },
              { value: 'small_cell', label: 'Small cell lung cancer' },
              { value: 'nsclc_nos', label: 'NSCLC not otherwise specified' },
              { value: 'other', label: 'Other (specify in notes)' }
            ]
          }
        ]
      },
      {
        id: 'molecular_biomarkers',
        title: 'Molecular Biomarkers',
        description: 'Genetic alterations and immunotherapy markers',
        icon: '🧬',
        items: [
          {
            id: 'egfr_status',
            text: 'EGFR mutation status',
            type: 'select',
            required: true,
            options: [
              { value: 'mutated', label: 'Mutated' },
              { value: 'wild_type', label: 'Wild type' },
              { value: 'pending', label: 'Pending' },
              { value: 'not_tested', label: 'Not tested' }
            ],
            cancerSpecific: ['lung'],
            aiAssisted: true
          },
          {
            id: 'alk_status',
            text: 'ALK rearrangement',
            type: 'select',
            required: true,
            options: [
              { value: 'positive', label: 'Positive/Rearranged' },
              { value: 'negative', label: 'Negative' },
              { value: 'pending', label: 'Pending' },
              { value: 'not_tested', label: 'Not tested' }
            ]
          },
          {
            id: 'pdl1_status',
            text: 'PD-L1 expression level',
            type: 'select',
            required: true,
            options: [
              { value: 'high', label: 'High (≥50%)' },
              { value: 'intermediate', label: 'Intermediate (1-49%)' },
              { value: 'negative', label: 'Negative (<1%)' },
              { value: 'pending', label: 'Pending' },
              { value: 'not_tested', label: 'Not tested' }
            ],
            tooltip: 'PD-L1 tumor proportion score (TPS)'
          },
          {
            id: 'ros1_status',
            text: 'ROS1 rearrangement',
            type: 'select',
            required: false,
            options: [
              { value: 'positive', label: 'Positive' },
              { value: 'negative', label: 'Negative' },
              { value: 'not_tested', label: 'Not tested' }
            ]
          },
          {
            id: 'braf_status',
            text: 'BRAF mutation',
            type: 'select',
            required: false,
            options: [
              { value: 'v600e', label: 'V600E mutation' },
              { value: 'other', label: 'Other mutation' },
              { value: 'wild_type', label: 'Wild type' },
              { value: 'not_tested', label: 'Not tested' }
            ]
          }
        ],
        cancerSpecificNotes: [
          'EGFR and ALK testing required for all lung adenocarcinomas',
          'PD-L1 testing guides immunotherapy selection',
          'ROS1 testing recommended for ALK-negative adenocarcinomas'
        ]
      }
    ],
    staging: {
      system: 'tnm',
      version: 'AJCC 8th Edition',
      specificFields: ['t_stage', 'n_stage', 'm_stage']
    },
    biomarkers: {
      required: ['egfr_status', 'alk_status', 'pdl1_status'],
      optional: ['ros1_status', 'braf_status'],
      emerging: ['kras_g12c', 'met_exon14', 'ret_fusion', 'ntrk_fusion']
    },
    notes: [
      'Molecular testing mandatory for all lung adenocarcinomas',
      'Consider liquid biopsy if tissue insufficient',
      'Multidisciplinary team discussion for treatment planning'
    ],
    redFlags: [
      'Superior vena cava syndrome',
      'Spinal cord compression',
      'Brain metastases with neurological symptoms',
      'Massive hemoptysis'
    ],
    aiEnabled: true,
    lastUpdated: '2025-06-03',
    guidelineReferences: [
      {
        source: 'NCCN Lung Cancer Guidelines',
        version: 'v1.2025'
      },
      {
        source: 'IASLC Molecular Testing Guidelines',
        version: '2024'
      }
    ]
  },

  // Additional cancer types would follow the same pattern...
  colorectal: {
    id: 'colorectal-cancer-eval-v2',
    cancerType: 'colorectal',
    title: 'Comprehensive Colorectal Cancer Evaluation',
    description: 'Enhanced evaluation with MSI/MMR testing and molecular profiling',
    version: '2.0.0',
    sections: [
      // Condensed version for space - would include full sections similar to above
      {
        id: 'demographics',
        title: 'Patient Demographics',
        icon: '👤',
        items: [
          {
            id: 'age',
            text: 'Age at diagnosis',
            type: 'number',
            required: true,
            validation: { min: 18, max: 120 }
          }
        ]
      }
    ],
    staging: { system: 'tnm', version: 'AJCC 8th Edition' },
    biomarkers: {
      required: ['msi_status', 'kras_status'],
      optional: ['braf_status', 'pik3ca_status'],
      emerging: ['her2_amplification']
    },
    notes: ['MSI/MMR testing required for all cases'],
    redFlags: ['Obstruction', 'Perforation', 'Bleeding'],
    aiEnabled: true,
    lastUpdated: '2025-06-03',
    guidelineReferences: []
  },

  // Placeholder templates for other cancer types
  prostate: {
    id: 'prostate-eval-v2',
    cancerType: 'prostate',
    title: 'Prostate Cancer Evaluation',
    description: 'Risk stratification and treatment planning',
    version: '2.0.0',
    sections: [],
    staging: { system: 'tnm' },
    biomarkers: { required: ['psa'], optional: [], emerging: [] },
    notes: [],
    redFlags: [],
    aiEnabled: true,
    lastUpdated: '2025-06-03',
    guidelineReferences: []
  },

  ovarian: {
    id: 'ovarian-eval-v2',
    cancerType: 'ovarian',
    title: 'Ovarian Cancer Evaluation',
    description: 'Comprehensive evaluation with BRCA testing',
    version: '2.0.0',
    sections: [],
    staging: { system: 'figo' },
    biomarkers: { required: ['ca125'], optional: ['brca1', 'brca2'], emerging: ['hrd_score'] },
    notes: [],
    redFlags: [],
    aiEnabled: true,
    lastUpdated: '2025-06-03',
    guidelineReferences: []
  },

  // Additional cancer types would be implemented similarly
  gastric: { id: 'gastric-eval-v2', cancerType: 'gastric', title: 'Gastric Cancer Evaluation', description: '', version: '2.0.0', sections: [], staging: { system: 'tnm' }, biomarkers: { required: [], optional: [], emerging: [] }, notes: [], redFlags: [], aiEnabled: true, lastUpdated: '2025-06-03', guidelineReferences: [] },
  pancreatic: { id: 'pancreatic-eval-v2', cancerType: 'pancreatic', title: 'Pancreatic Cancer Evaluation', description: '', version: '2.0.0', sections: [], staging: { system: 'tnm' }, biomarkers: { required: [], optional: [], emerging: [] }, notes: [], redFlags: [], aiEnabled: true, lastUpdated: '2025-06-03', guidelineReferences: [] },
  lymphoma: { id: 'lymphoma-eval-v2', cancerType: 'lymphoma', title: 'Lymphoma Evaluation', description: '', version: '2.0.0', sections: [], staging: { system: 'ann_arbor' }, biomarkers: { required: [], optional: [], emerging: [] }, notes: [], redFlags: [], aiEnabled: true, lastUpdated: '2025-06-03', guidelineReferences: [] },
  head_neck: { id: 'head-neck-eval-v2', cancerType: 'head_neck', title: 'Head and Neck Cancer Evaluation', description: '', version: '2.0.0', sections: [], staging: { system: 'tnm' }, biomarkers: { required: [], optional: [], emerging: [] }, notes: [], redFlags: [], aiEnabled: true, lastUpdated: '2025-06-03', guidelineReferences: [] },
  bladder: { id: 'bladder-eval-v2', cancerType: 'bladder', title: 'Bladder Cancer Evaluation', description: '', version: '2.0.0', sections: [], staging: { system: 'tnm' }, biomarkers: { required: [], optional: [], emerging: [] }, notes: [], redFlags: [], aiEnabled: true, lastUpdated: '2025-06-03', guidelineReferences: [] },
  liver: { id: 'liver-eval-v2', cancerType: 'liver', title: 'Liver Cancer Evaluation', description: '', version: '2.0.0', sections: [], staging: { system: 'tnm' }, biomarkers: { required: [], optional: [], emerging: [] }, notes: [], redFlags: [], aiEnabled: true, lastUpdated: '2025-06-03', guidelineReferences: [] },
  kidney: { id: 'kidney-eval-v2', cancerType: 'kidney', title: 'Kidney Cancer Evaluation', description: '', version: '2.0.0', sections: [], staging: { system: 'tnm' }, biomarkers: { required: [], optional: [], emerging: [] }, notes: [], redFlags: [], aiEnabled: true, lastUpdated: '2025-06-03', guidelineReferences: [] },
  cervical: { id: 'cervical-eval-v2', cancerType: 'cervical', title: 'Cervical Cancer Evaluation', description: '', version: '2.0.0', sections: [], staging: { system: 'figo' }, biomarkers: { required: [], optional: [], emerging: [] }, notes: [], redFlags: [], aiEnabled: true, lastUpdated: '2025-06-03', guidelineReferences: [] },
  endometrial: { id: 'endometrial-eval-v2', cancerType: 'endometrial', title: 'Endometrial Cancer Evaluation', description: '', version: '2.0.0', sections: [], staging: { system: 'figo' }, biomarkers: { required: [], optional: [], emerging: [] }, notes: [], redFlags: [], aiEnabled: true, lastUpdated: '2025-06-03', guidelineReferences: [] },
  leukemia: { id: 'leukemia-eval-v2', cancerType: 'leukemia', title: 'Leukemia Evaluation', description: '', version: '2.0.0', sections: [], staging: { system: 'rai' }, biomarkers: { required: [], optional: [], emerging: [] }, notes: [], redFlags: [], aiEnabled: true, lastUpdated: '2025-06-03', guidelineReferences: [] },
  sarcoma: { id: 'sarcoma-eval-v2', cancerType: 'sarcoma', title: 'Sarcoma Evaluation', description: '', version: '2.0.0', sections: [], staging: { system: 'tnm' }, biomarkers: { required: [], optional: [], emerging: [] }, notes: [], redFlags: [], aiEnabled: true, lastUpdated: '2025-06-03', guidelineReferences: [] },
  brain: { id: 'brain-eval-v2', cancerType: 'brain', title: 'Brain Cancer Evaluation', description: '', version: '2.0.0', sections: [], staging: { system: 'tnm' }, biomarkers: { required: [], optional: [], emerging: [] }, notes: [], redFlags: [], aiEnabled: true, lastUpdated: '2025-06-03', guidelineReferences: [] },
  thyroid: { id: 'thyroid-eval-v2', cancerType: 'thyroid', title: 'Thyroid Cancer Evaluation', description: '', version: '2.0.0', sections: [], staging: { system: 'tnm' }, biomarkers: { required: [], optional: [], emerging: [] }, notes: [], redFlags: [], aiEnabled: true, lastUpdated: '2025-06-03', guidelineReferences: [] },
  melanoma: { id: 'melanoma-eval-v2', cancerType: 'melanoma', title: 'Melanoma Evaluation', description: '', version: '2.0.0', sections: [], staging: { system: 'tnm' }, biomarkers: { required: [], optional: [], emerging: [] }, notes: [], redFlags: [], aiEnabled: true, lastUpdated: '2025-06-03', guidelineReferences: [] }
};
