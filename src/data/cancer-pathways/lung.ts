import { StepBasedPathway } from "../../types/cancer-pathways";

export const lungCancerPathway: StepBasedPathway = {
  id: "lung",
  name: "Lung Cancer Diagnostic Pathway",
  description: "Systematic approach to lung cancer evaluation and staging",
  recommendedTimeframe: "2-3 weeks",
  steps: [
    {
      id: "initial",
      title: "Initial Presentation",
      description: "Patient presents with suspicious symptoms or findings",
      expectedDuration: "1-2 days",
      options: [
        {
          text: "Suspicious chest imaging findings",
          next: "imaging",
          triggers: ["suspicious_imaging"]
        },
        {
          text: "Symptoms suggestive of lung cancer",
          next: "symptoms",
          triggers: ["concerning_symptoms"]
        }
      ],
      redFlags: [
        {
          id: "suspicious_imaging",
          condition: "Suspicious chest imaging",
          message: "Findings concerning for malignancy",
          severity: "critical",
          recommendations: [
            "Expedite CT chest with contrast",
            "Early pulmonology/thoracic surgery consultation",
            "Review smoking history and occupational exposures"
          ]
        },
        {
          id: "concerning_symptoms",
          condition: "High-risk symptoms",
          message: "Symptoms concerning for lung cancer",
          severity: "warning",
          recommendations: [
            "Chest imaging within 1 week",
            "Document duration and progression of symptoms",
            "Assess for red flag symptoms (hemoptysis, weight loss)"
          ]
        }
      ]
    },
    {
      id: "imaging",
      title: "Imaging Studies",
      description: "Confirm findings with appropriate imaging",
      expectedDuration: "3-5 days",
      tooltip: "Consider CT characteristics and nodule features",
      options: [
        {
          text: "CT Chest with contrast",
          next: "characterize",
          triggers: ["significant_findings"]
        },
        {
          text: "PET/CT if metastatic disease suspected",
          next: "staging",
          triggers: ["metastatic_suspicion"]
        }
      ],
      redFlags: [
        {
          id: "significant_findings",
          condition: "Significant CT findings",
          message: "Features highly suspicious for malignancy",
          severity: "critical",
          recommendations: [
            "Expedite tissue diagnosis",
            "Consider PET/CT for staging",
            "Early thoracic MDT discussion"
          ]
        },
        {
          id: "metastatic_suspicion",
          condition: "Suspected metastatic disease",
          message: "Features concerning for advanced disease",
          severity: "critical",
          recommendations: [
            "Complete staging workup",
            "Early oncology consultation",
            "Consider molecular testing planning"
          ]
        }
      ]
    },
    {
      id: "characterize",
      title: "Lesion Characterization",
      description: "Determine lesion features and location",
      expectedDuration: "1-2 days",
      options: [
        {
          text: "Peripheral lesion",
          next: "biopsy"
        },
        {
          text: "Central lesion",
          next: "bronchoscopy"
        }
      ]
    },
    {
      id: "staging",
      title: "Disease Staging",
      description: "Determine extent of disease",
      expectedDuration: "5-7 days",
      options: [
        {
          text: "Localized disease",
          next: "mdtb"
        },
        {
          text: "Metastatic disease",
          next: "palliative",
          triggers: ["metastatic_confirmed"]
        }
      ],
      redFlags: [
        {
          id: "metastatic_confirmed",
          condition: "Confirmed metastatic disease",
          message: "Stage IV disease identified",
          severity: "critical",
          recommendations: [
            "Urgent medical oncology consultation",
            "Expedite molecular testing",
            "Consider early palliative care involvement",
            "Discuss goals of care"
          ]
        }
      ]
    }
  ]
};
