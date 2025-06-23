import { StepBasedPathway } from "../../types/cancer-pathways";

export const bladderCancerPathway: StepBasedPathway = {
  id: "bladder",
  name: "Bladder Cancer Diagnostic Pathway",
  description: "Systematic approach to bladder cancer diagnosis and staging",
  recommendedTimeframe: "2-3 weeks",
  steps: [
    {
      id: "initial",
      title: "Initial Assessment",
      description: "Patient presents with hematuria or urinary symptoms",
      expectedDuration: "1-2 days",
      tooltip: "Document gross vs microscopic hematuria and associated symptoms",
      options: [
        {
          text: "Gross hematuria",
          next: "urgent_cystoscopy",
          triggers: ["gross_bleeding"]
        },
        {
          text: "Microscopic hematuria",
          next: "initial_workup"
        },
        {
          text: "Irritative symptoms",
          next: "urinalysis"
        }
      ],
      redFlags: [
        {
          id: "gross_bleeding",
          condition: "Gross hematuria with clots",
          message: "Active bleeding requiring evaluation",
          severity: "critical",
          recommendations: [
            "Urgent urologic consultation",
            "CBC and coagulation profile",
            "Consider admission if heavy bleeding"
          ]
        }
      ]
    },
    {
      id: "urinalysis",
      title: "Urinalysis and Cytology",
      description: "Initial laboratory evaluation",
      expectedDuration: "2-3 days",
      tooltip: "Include urine cytology and culture if indicated",
      options: [
        {
          text: "Positive cytology",
          next: "cystoscopy",
          triggers: ["positive_cytology"]
        },
        {
          text: "Persistent hematuria",
          next: "cystoscopy"
        },
        {
          text: "Negative workup",
          next: "risk_assessment"
        }
      ],
      redFlags: [
        {
          id: "positive_cytology",
          condition: "Positive urine cytology",
          message: "Cytology suggesting malignancy",
          severity: "warning",
          recommendations: [
            "Expedite cystoscopy",
            "Consider upper tract imaging",
            "Document smoking history"
          ]
        }
      ]
    },
    {
      id: "cystoscopy",
      title: "Diagnostic Cystoscopy",
      description: "Direct visualization of bladder mucosa",
      expectedDuration: "1 day",
      tooltip: "Document location, size, and number of lesions",
      options: [
        {
          text: "Visible tumor",
          next: "turbt",
          triggers: ["visible_tumor"]
        },
        {
          text: "Suspicious areas",
          next: "biopsy"
        },
        {
          text: "Normal cystoscopy",
          next: "imaging"
        }
      ],
      redFlags: [
        {
          id: "visible_tumor",
          condition: "Visible bladder tumor",
          message: "Tumor identified on cystoscopy",
          severity: "critical",
          recommendations: [
            "Schedule TURBT within 2 weeks",
            "Complete staging workup",
            "Consider enhanced cystoscopy"
          ]
        }
      ]
    },
    {
      id: "imaging",
      title: "Upper Tract Imaging",
      description: "CT urogram or other appropriate imaging",
      expectedDuration: "2-3 days",
      tooltip: "Evaluate upper tracts and look for metastatic disease",
      options: [
        {
          text: "Bladder mass",
          next: "turbt"
        },
        {
          text: "Upper tract lesion",
          next: "specialized_evaluation",
          triggers: ["upper_tract"]
        },
        {
          text: "Metastatic disease",
          next: "staging",
          triggers: ["metastatic"]
        }
      ],
      redFlags: [
        {
          id: "upper_tract",
          condition: "Upper tract lesion",
          message: "Suspicious upper tract finding",
          severity: "warning",
          recommendations: [
            "Urology consultation",
            "Consider ureteroscopy",
            "Plan comprehensive evaluation"
          ]
        },
        {
          id: "metastatic",
          condition: "Metastatic disease",
          message: "Evidence of metastatic spread",
          severity: "critical",
          recommendations: [
            "Tissue confirmation needed",
            "Oncology consultation",
            "Discuss treatment goals"
          ]
        }
      ]
    },
    {
      id: "turbt",
      title: "TURBT",
      description: "Transurethral resection of bladder tumor",
      expectedDuration: "1-2 days",
      tooltip: "Complete resection with muscle if possible",
      options: [
        {
          text: "Non-muscle invasive",
          next: "risk_stratification"
        },
        {
          text: "Muscle invasive",
          next: "staging",
          triggers: ["muscle_invasive"]
        },
        {
          text: "Incomplete resection",
          next: "repeat_turbt"
        }
      ],
      redFlags: [
        {
          id: "muscle_invasive",
          condition: "Muscle invasive disease",
          message: "Muscle invasion confirmed",
          severity: "critical",
          recommendations: [
            "Complete staging workup",
            "Multidisciplinary consultation",
            "Discuss treatment options",
            "Consider clinical trials"
          ]
        }
      ]
    }
  ]
};
