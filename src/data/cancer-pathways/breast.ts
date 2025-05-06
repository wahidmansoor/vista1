import { StepBasedPathway } from "../../types/cancer-pathways";

export const breastCancerPathway: StepBasedPathway = {
  id: "breast",
  name: "Breast Cancer Diagnostic Pathway",
  description: "Systematic approach to breast cancer diagnosis and staging",
  recommendedTimeframe: "2-3 weeks",
  steps: [
    {
      id: "initial",
      title: "Initial Presentation",
      description: "Patient presents with breast symptoms or screening findings",
      expectedDuration: "1-2 days",
      options: [
        {
          text: "Suspicious imaging findings",
          next: "imaging_review"
        },
        {
          text: "Palpable mass",
          next: "physical_exam",
          triggers: ["mass_alert"]
        },
        {
          text: "Other breast symptoms",
          next: "risk_assessment"
        }
      ],
      redFlags: [
        {
          id: "mass_alert",
          condition: "Palpable mass",
          message: "Palpable mass requires prompt evaluation",
          severity: "warning",
          recommendations: [
            "Schedule diagnostic mammogram within 1 week",
            "Consider immediate ultrasound if high clinical suspicion"
          ]
        }
      ]
    },
    {
      id: "physical_exam",
      title: "Physical Examination",
      description: "Comprehensive breast examination",
      expectedDuration: "1 day",
      tooltip: "Document size, location, mobility, and skin changes",
      options: [
        {
          text: "Suspicious findings",
          next: "imaging",
          triggers: ["suspicious_exam"]
        },
        {
          text: "Indeterminate findings",
          next: "imaging"
        }
      ],
      redFlags: [
        {
          id: "suspicious_exam",
          condition: "Highly suspicious physical exam",
          message: "Findings highly suspicious for malignancy",
          severity: "critical",
          recommendations: [
            "Expedite imaging within 48 hours",
            "Consider same-day surgical consultation"
          ]
        }
      ]
    },
    {
      id: "imaging",
      title: "Diagnostic Imaging",
      description: "Mammogram and/or ultrasound as indicated",
      expectedDuration: "1-3 days",
      options: [
        {
          text: "BIRADS 4-5",
          next: "biopsy",
          triggers: ["high_birads"]
        },
        {
          text: "BIRADS 3",
          next: "monitoring"
        },
        {
          text: "BIRADS 1-2",
          next: "followup"
        }
      ],
      redFlags: [
        {
          id: "high_birads",
          condition: "BIRADS 4-5",
          message: "High suspicion for malignancy",
          severity: "critical",
          recommendations: [
            "Schedule core biopsy within 3-5 days",
            "Arrange surgical consultation"
          ]
        }
      ]
    },
    {
      id: "biopsy",
      title: "Tissue Biopsy",
      description: "Core needle biopsy under imaging guidance",
      expectedDuration: "1-2 days",
      tooltip: "Ensure adequate tissue sampling and specimen handling",
      options: [
        {
          text: "Malignant",
          next: "staging",
          triggers: ["positive_biopsy"]
        },
        {
          text: "Atypical/Indeterminate",
          next: "surgical_consult"
        },
        {
          text: "Benign",
          next: "followup"
        }
      ],
      redFlags: [
        {
          id: "positive_biopsy",
          condition: "Malignant biopsy result",
          message: "Biopsy confirms malignancy",
          severity: "critical",
          recommendations: [
            "Expedite staging studies",
            "Schedule multidisciplinary tumor board review",
            "Arrange oncology consultation within 1 week"
          ]
        }
      ]
    },
    {
      id: "staging",
      title: "Disease Staging",
      description: "Comprehensive staging workup",
      expectedDuration: "3-5 days",
      options: [
        {
          text: "Early stage (I-II)",
          next: "mdtb"
        },
        {
          text: "Locally advanced",
          next: "mdtb"
        },
        {
          text: "Metastatic",
          next: "mdtb",
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
            "Urgent medical oncology consultation",
            "Consider palliative care referral",
            "Discuss treatment goals with patient"
          ]
        }
      ]
    }
  ]
};
