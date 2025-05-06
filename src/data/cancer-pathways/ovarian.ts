import { StepBasedPathway } from "../../types/cancer-pathways";

export const ovarianCancerPathway: StepBasedPathway = {
  id: "ovarian",
  name: "Ovarian Cancer Diagnostic Pathway",
  description: "Evidence-based approach to ovarian cancer diagnosis and staging",
  recommendedTimeframe: "2-3 weeks",
  steps: [
    {
      id: "initial",
      title: "Initial Assessment",
      description: "Patient presents with suspicious symptoms or findings",
      expectedDuration: "1-2 days",
      tooltip: "Common symptoms include bloating, pelvic pain, early satiety, and urinary symptoms",
      options: [
        {
          text: "Suspicious pelvic findings",
          next: "pelvic_exam",
          triggers: ["suspicious_mass"]
        },
        {
          text: "Nonspecific symptoms",
          next: "initial_workup"
        },
        {
          text: "Incidental imaging finding",
          next: "imaging_review"
        }
      ],
      redFlags: [
        {
          id: "suspicious_mass",
          condition: "Suspicious pelvic mass",
          message: "Findings concerning for malignancy",
          severity: "warning",
          recommendations: [
            "Expedite pelvic examination and imaging",
            "Early gynecologic oncology consultation",
            "Assess for ascites and other concerning features"
          ]
        }
      ]
    },
    {
      id: "pelvic_exam",
      title: "Pelvic Examination",
      description: "Comprehensive pelvic examination with documentation of findings",
      expectedDuration: "1 day",
      tooltip: "Document mass size, mobility, bilateral involvement, and presence of ascites",
      options: [
        {
          text: "Fixed pelvic mass identified",
          next: "imaging",
          triggers: ["fixed_mass"]
        },
        {
          text: "Mobile mass or complex finding",
          next: "imaging"
        }
      ],
      redFlags: [
        {
          id: "fixed_mass",
          condition: "Fixed pelvic mass",
          message: "Fixed mass suggests local invasion",
          severity: "critical",
          recommendations: [
            "Urgent imaging within 48-72 hours",
            "Expedited gynecologic oncology referral",
            "Consider direct referral to cancer center"
          ]
        }
      ]
    },
    {
      id: "imaging",
      title: "Diagnostic Imaging",
      description: "Transvaginal ultrasound and additional imaging as indicated",
      expectedDuration: "3-5 days",
      tooltip: "Evaluate for complex masses, septations, solid components, and ascites",
      options: [
        {
          text: "Highly suspicious findings",
          next: "ca125",
          triggers: ["suspicious_imaging"]
        },
        {
          text: "Indeterminate findings",
          next: "ca125"
        },
        {
          text: "Simple cyst",
          next: "monitoring"
        }
      ],
      redFlags: [
        {
          id: "suspicious_imaging",
          condition: "Highly suspicious imaging",
          message: "Features highly concerning for malignancy",
          severity: "critical",
          recommendations: [
            "Expedite CA-125 testing",
            "Schedule CT chest/abdomen/pelvis",
            "Early gynecologic oncology consultation"
          ]
        }
      ]
    },
    {
      id: "ca125",
      title: "Serum CA-125",
      description: "Tumor marker evaluation with CA-125",
      expectedDuration: "1-2 days",
      tooltip: "Consider age-specific normal ranges and other causes of elevation",
      options: [
        {
          text: "Elevated CA-125",
          next: "staging",
          triggers: ["elevated_marker"]
        },
        {
          text: "Normal CA-125",
          next: "additional_imaging"
        }
      ],
      redFlags: [
        {
          id: "elevated_marker",
          condition: "Significantly elevated CA-125",
          message: "Marker elevation concerning for malignancy",
          severity: "warning",
          recommendations: [
            "Complete staging workup",
            "Consider risk of malignancy index (RMI)",
            "Plan for surgical evaluation"
          ]
        }
      ]
    },
    {
      id: "staging",
      title: "Disease Staging",
      description: "Comprehensive staging with CT chest/abdomen/pelvis",
      expectedDuration: "3-5 days",
      tooltip: "Evaluate for metastatic disease, lymphadenopathy, and surgical resectability",
      options: [
        {
          text: "Localized disease",
          next: "surgical_planning"
        },
        {
          text: "Advanced disease",
          next: "surgical_planning",
          triggers: ["metastatic"]
        },
        {
          text: "Ascites present",
          next: "paracentesis",
          triggers: ["ascites"]
        }
      ],
      redFlags: [
        {
          id: "metastatic",
          condition: "Metastatic disease",
          message: "Evidence of advanced stage disease",
          severity: "critical",
          recommendations: [
            "Urgent gynecologic oncology consultation",
            "Consider neoadjuvant chemotherapy",
            "Discuss prognosis and treatment goals"
          ]
        },
        {
          id: "ascites",
          condition: "Malignant ascites",
          message: "Presence of ascites suggests advanced disease",
          severity: "critical",
          recommendations: [
            "Consider therapeutic paracentesis",
            "Plan for cytologic evaluation",
            "Assess for pleural effusions"
          ]
        }
      ]
    }
  ]
};
