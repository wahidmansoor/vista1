import { PatientDataState, BiomarkerStatus } from '../types/diseaseProgress.types';

export interface PilotCase {
  id: string;
  name: string;
  description: string;
  expectedKeywords: string[];
  data: Partial<PatientDataState>;
}

export const pilotCases: PilotCase[] = [
  {
    id: 'pc-nsclc-egfr',
    name: 'NSCLC EGFR+',
    description: 'Metastatic adenocarcinoma, EGFR mutation positive, ECOG 1',
    expectedKeywords: ['EGFR', 'Osimertinib', 'Afatinib'],
    data: {
      diseaseStatus: {
        primaryDiagnosis: 'Non-Small Cell Lung Cancer (NSCLC)',
        histology: 'Adenocarcinoma',
        stageAtDiagnosis: 'IV',
        biomarkers: [
          { name: 'EGFR', status: 'Positive', testDate: '2024-01-15' }
        ],
        dateOfDiagnosis: '2024-01-10',
        diseaseNotes: 'Newly diagnosed metastatic NSCLC'
      },
      performanceStatus: {
        assessmentDate: '2024-01-20',
        performanceScale: 'ecog',
        performanceScore: '1',
        performanceNotes: 'Fully ambulatory'
      },
      treatmentLine: {
        treatmentLine: '1st Line',
        treatmentRegimen: 'Treatment Naive',
        agents: [],
        startDate: '',
        treatmentResponse: '',
        treatmentNotes: ''
      }
    }
  },
  {
    id: 'pc-breast-her2',
    name: 'Breast HER2+',
    description: 'Metastatic HER2-positive, ECOG 1',
    expectedKeywords: ['HER2', 'Trastuzumab', 'Pertuzumab'],
    data: {
      diseaseStatus: {
        primaryDiagnosis: 'Breast Cancer',
        histology: 'Invasive Ductal Carcinoma',
        stageAtDiagnosis: 'IV',
        biomarkers: [
          { name: 'HER2', status: 'Positive', testDate: '2024-02-01' },
          { name: 'ER', status: 'Positive' },
          { name: 'PR', status: 'Positive' }
        ],
        dateOfDiagnosis: '2024-01-20'
      },
      performanceStatus: {
        assessmentDate: '2024-02-05',
        performanceScale: 'ecog',
        performanceScore: '1'
      },
      treatmentLine: {
        treatmentLine: '1st Line',
        treatmentRegimen: 'Treatment Naive',
        agents: [],
        startDate: '',
        treatmentResponse: '',
      }
    }
  },
  {
    id: 'pc-crc-msih',
    name: 'CRC MSI-H',
    description: 'Metastatic MSI-H/dMMR, ECOG 1',
    expectedKeywords: ['MSI-H', 'Pembrolizumab', 'Nivolumab'],
    data: {
      diseaseStatus: {
        primaryDiagnosis: 'Colorectal Cancer',
        stageAtDiagnosis: 'IV',
        biomarkers: [
          { name: 'MSI/dMMR Status', status: 'High' }
        ],
        dateOfDiagnosis: '2024-02-10'
      },
      performanceStatus: {
        assessmentDate: '2024-02-15',
        performanceScale: 'ecog',
        performanceScore: '1'
      },
      treatmentLine: {
        treatmentLine: '1st Line',
        treatmentRegimen: 'Treatment Naive',
        agents: [],
        startDate: '',
        treatmentResponse: '',
      }
    }
  },
  {
    id: 'pc-prostate-psma',
    name: 'Prostate mCRPC',
    description: 'mCRPC, PSMA-positive, prior ARPI and docetaxel',
    expectedKeywords: ['PSMA', 'Lutetium', 'Pluvicto'],
    data: {
      diseaseStatus: {
        primaryDiagnosis: 'Prostate Cancer',
        stageAtDiagnosis: 'IV',
        biomarkers: [
          { name: 'PSMA', status: 'Positive' },
          { name: 'Castration Status', status: 'Resistant' }
        ],
        dateOfDiagnosis: '2022-05-10'
      },
      performanceStatus: {
        assessmentDate: '2024-03-01',
        performanceScale: 'ecog',
        performanceScore: '1'
      },
      treatmentLine: {
        treatmentLine: '3rd Line',
        treatmentRegimen: 'Prior Docetaxel',
        agents: ['Docetaxel', 'Abiraterone'],
        startDate: '2023-01-01',
        treatmentResponse: 'Progression',
      }
    }
  },
  {
    id: 'pc-ovarian-brca',
    name: 'Ovarian BRCA+',
    description: 'Platinum-sensitive relapse, BRCA-positive',
    expectedKeywords: ['BRCA', 'Olaparib', 'Niraparib'],
    data: {
      diseaseStatus: {
        primaryDiagnosis: 'Ovarian Cancer',
        stageAtDiagnosis: 'III',
        biomarkers: [
          { name: 'BRCA1/2', status: 'Mutant' },
          { name: 'Platinum Sensitivity', status: 'Sensitive' }
        ],
        dateOfDiagnosis: '2022-10-10'
      },
      performanceStatus: {
        assessmentDate: '2024-03-05',
        performanceScale: 'ecog',
        performanceScore: '0'
      },
      treatmentLine: {
        treatmentLine: '2nd Line',
        treatmentRegimen: 'Carboplatin/Paclitaxel',
        agents: ['Carboplatin', 'Paclitaxel'],
        startDate: '2022-11-01',
        treatmentResponse: 'Complete Response',
      }
    }
  },
  {
    id: 'pc-rcc-clearcell',
    name: 'RCC Clear-cell',
    description: 'Clear-cell metastatic RCC',
    expectedKeywords: ['Clear-cell', 'Nivolumab', 'Cabozantinib'],
    data: {
      diseaseStatus: {
        primaryDiagnosis: 'Renal Cell Carcinoma (RCC)',
        histology: 'Clear-cell',
        stageAtDiagnosis: 'IV',
        biomarkers: [
          { name: 'IMDC Risk', status: 'Intermediate' }
        ],
        dateOfDiagnosis: '2024-01-05'
      },
      performanceStatus: {
        assessmentDate: '2024-03-10',
        performanceScale: 'ecog',
        performanceScore: '1'
      },
      treatmentLine: {
        treatmentLine: '1st Line',
        treatmentRegimen: 'Treatment Naive',
        agents: [],
        startDate: '',
        treatmentResponse: '',
      }
    }
  },
  {
    id: 'pc-dlbcl-rr',
    name: 'DLBCL R/R',
    description: 'Relapsed/Refractory after prior systemic therapy',
    expectedKeywords: ['DLBCL', 'CAR-T', 'Polatuzumab'],
    data: {
      diseaseStatus: {
        primaryDiagnosis: 'Diffuse Large B-Cell Lymphoma (DLBCL)',
        stageAtDiagnosis: 'IV',
        biomarkers: [],
        dateOfDiagnosis: '2023-06-01'
      },
      performanceStatus: {
        assessmentDate: '2024-03-15',
        performanceScale: 'ecog',
        performanceScore: '1'
      },
      treatmentLine: {
        treatmentLine: '2nd Line',
        treatmentRegimen: 'R-CHOP',
        agents: ['Rituximab', 'Cyclophosphamide', 'Doxorubicin', 'Vincristine', 'Prednisone'],
        startDate: '2023-06-15',
        treatmentResponse: 'Progression',
      }
    }
  },
  {
    id: 'pc-gastric-her2',
    name: 'Gastric HER2+',
    description: 'HER2-positive, PD-L1 CPS positive',
    expectedKeywords: ['HER2', 'PD-L1', 'Trastuzumab', 'Pembrolizumab'],
    data: {
      diseaseStatus: {
        primaryDiagnosis: 'Gastric / GEJ Cancer',
        stageAtDiagnosis: 'IV',
        biomarkers: [
          { name: 'HER2', status: 'Positive' },
          { name: 'PD-L1 CPS', status: 'High' }
        ],
        dateOfDiagnosis: '2023-12-01'
      },
      performanceStatus: {
        assessmentDate: '2024-03-20',
        performanceScale: 'ecog',
        performanceScore: '1'
      },
      treatmentLine: {
        treatmentLine: '1st Line',
        treatmentRegimen: 'Treatment Naive',
        agents: [],
        startDate: '',
        treatmentResponse: '',
      }
    }
  },
  {
    id: 'pc-pancreatic-brca',
    name: 'Pancreatic BRCA+',
    description: 'Metastatic pancreatic adenocarcinoma, BRCA mutation positive',
    expectedKeywords: ['Pancreatic', 'BRCA', 'Olaparib'],
    data: {
      diseaseStatus: {
        primaryDiagnosis: 'Pancreatic Cancer',
        histology: 'Adenocarcinoma',
        stageAtDiagnosis: 'IV',
        biomarkers: [
          { name: 'BRCA1/2', status: 'Mutant' }
        ],
        dateOfDiagnosis: '2024-01-15'
      },
      performanceStatus: {
        assessmentDate: '2024-03-25',
        performanceScale: 'ecog',
        performanceScore: '1'
      },
      treatmentLine: {
        treatmentLine: '1st Line',
        treatmentRegimen: 'Treatment Naive',
        agents: [],
        startDate: '',
        treatmentResponse: '',
      }
    }
  }
];
