import { StepBasedPathway } from "../../types/cancer-pathways";

export const headNeckCancerPathway: StepBasedPathway = {
  id: "head_neck",
  name: "Head & Neck Cancer Diagnostic Pathway",
  description: "Structured approach to head and neck cancer diagnosis and staging",
  recommendedTimeframe: "2-3 weeks",
  steps: [
    {
      id: "initial",
      title: "Initial Assessment",
      description: "Patient presents with head and neck symptoms or findings",
      expectedDuration: "1-2 days",
      tooltip: "Pay attention to voice changes, dysphagia, and neck masses",
      options: [
        {
          text: "Suspicious neck mass",
          next: "physical_exam",
          triggers: ["mass_present"]
        },
        {
          text: "Voice/swallowing changes",
          next: "ent_exam",
          triggers: ["airway_symptoms"]
        },
        {
          text: "Oral cavity lesion",
          next: "oral_exam"
        }
      ],
      redFlags: [
        {
          id: "mass_present",
          condition: "Suspicious neck mass",
          message: "Mass concerning for malignancy",
          severity: "warning",
          recommendations: [
            "Complete head and neck examination",
            "Early ENT referral",
            "Document size and location"
          ]
        },
        {
          id: "airway_symptoms",
          condition: "Airway symptoms",
          message: "Potential airway compromise",
          severity: "critical",
          recommendations: [
            "Immediate ENT evaluation",
            "Consider emergency imaging",
            "Prepare for possible airway intervention"
          ]
        }
      ]
    },
    {
      id: "ent_exam",
      title: "ENT Examination",
      description: "Comprehensive examination of upper aerodigestive tract",
      expectedDuration: "1 day",
      tooltip: "Include flexible laryngoscopy if indicated",
      options: [
        {
          text: "Visible lesion",
          next: "imaging",
          triggers: ["visible_tumor"]
        },
        {
          text: "Stridor present",
          next: "emergency_management",
          triggers: ["stridor"]
        },
        {
          text: "Indeterminate findings",
          next: "imaging"
        }
      ],
      redFlags: [
        {
          id: "visible_tumor",
          condition: "Visible tumor",
          message: "Direct visualization of suspicious lesion",
          severity: "critical",
          recommendations: [
            "Photo documentation",
            "Urgent imaging studies",
            "Plan for tissue diagnosis"
          ]
        },
        {
          id: "stridor",
          condition: "Stridor",
          message: "Active airway compromise",
          severity: "critical",
          recommendations: [
            "Immediate airway management",
            "Consider emergency tracheostomy",
            "Transfer to higher level of care if needed"
          ]
        }
      ]
    },
    {
      id: "imaging",
      title: "Diagnostic Imaging",
      description: "Contrast-enhanced CT/MRI of head and neck",
      expectedDuration: "3-5 days",
      tooltip: "Include chest imaging to rule out synchronous lesions",
      options: [
        {
          text: "Primary tumor identified",
          next: "biopsy",
          triggers: ["primary_found"]
        },
        {
          text: "Unknown primary",
          next: "panendoscopy"
        },
        {
          text: "Multiple lesions",
          next: "panendoscopy",
          triggers: ["multiple_lesions"]
        }
      ],
      redFlags: [
        {
          id: "primary_found",
          condition: "Defined primary tumor",
          message: "Primary site identified on imaging",
          severity: "warning",
          recommendations: [
            "Plan targeted biopsy",
            "Assess extent of disease",
            "Evaluate nodal status"
          ]
        },
        {
          id: "multiple_lesions",
          condition: "Multiple lesions",
          message: "Possible synchronous tumors",
          severity: "critical",
          recommendations: [
            "Complete panendoscopy",
            "Multiple biopsies needed",
            "Consider field cancerization"
          ]
        }
      ]
    },
    {
      id: "biopsy",
      title: "Tissue Diagnosis",
      description: "FNA or direct biopsy of suspicious lesions",
      expectedDuration: "2-3 days",
      tooltip: "Consider HPV testing for oropharyngeal lesions",
      options: [
        {
          text: "Malignancy confirmed",
          next: "staging",
          triggers: ["confirmed_cancer"]
        },
        {
          text: "Inadequate sample",
          next: "repeat_biopsy"
        },
        {
          text: "Benign pathology",
          next: "monitoring"
        }
      ],
      redFlags: [
        {
          id: "confirmed_cancer",
          condition: "Confirmed malignancy",
          message: "Histologically confirmed cancer",
          severity: "critical",
          recommendations: [
            "Complete staging workup",
            "Evaluate for HPV if indicated",
            "Plan for multidisciplinary discussion",
            "Speech/swallow evaluation"
          ]
        }
      ]
    },
    {
      id: "staging",
      title: "Disease Staging",
      description: "Complete staging workup including PET-CT if indicated",
      expectedDuration: "5-7 days",
      tooltip: "Assess both local extent and distant metastases",
      options: [
        {
          text: "Early stage",
          next: "treatment_planning"
        },
        {
          text: "Locally advanced",
          next: "mdtb"
        },
        {
          text: "Metastatic disease",
          next: "palliative_planning",
          triggers: ["metastatic"]
        }
      ],
      redFlags: [
        {
          id: "metastatic",
          condition: "Metastatic disease",
          message: "Stage IV disease identified",
          severity: "critical",
          recommendations: [
            "Early oncology consultation",
            "Discuss prognosis and goals",
            "Consider supportive care needs",
            "Address airway management plan"
          ]
        }
      ]
    }
  ]
};
