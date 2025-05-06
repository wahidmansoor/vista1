import { StepBasedPathway } from "../../types/cancer-pathways";

export const gastricCancerPathway: StepBasedPathway = {
  id: "gastric",
  name: "Gastric Cancer Diagnostic Pathway",
  description: "Systematic approach to gastric cancer diagnosis and staging",
  recommendedTimeframe: "2-3 weeks",
  steps: [
    {
      id: "initial",
      title: "Initial Assessment",
      description: "Patient presents with gastric symptoms or findings",
      expectedDuration: "1-2 days",
      tooltip: "Key symptoms include early satiety, weight loss, epigastric pain, and GI bleeding",
      options: [
        {
          text: "Alarm symptoms present",
          next: "urgent_endoscopy",
          triggers: ["alarm_symptoms"]
        },
        {
          text: "H. pylori symptoms",
          next: "hp_testing"
        },
        {
          text: "Nonspecific symptoms",
          next: "risk_assessment"
        }
      ],
      redFlags: [
        {
          id: "alarm_symptoms",
          condition: "Alarm symptoms",
          message: "Presence of high-risk symptoms",
          severity: "critical",
          recommendations: [
            "Urgent endoscopy within 2 weeks",
            "Complete blood count and iron studies",
            "Early surgical consultation if bleeding"
          ]
        }
      ]
    },
    {
      id: "hp_testing",
      title: "H. pylori Evaluation",
      description: "Testing for H. pylori infection",
      expectedDuration: "2-3 days",
      tooltip: "Consider test and treat strategy in younger patients without alarm features",
      options: [
        {
          text: "H. pylori positive",
          next: "treatment_trial"
        },
        {
          text: "H. pylori negative with persistent symptoms",
          next: "endoscopy"
        },
        {
          text: "Alarm symptoms develop",
          next: "urgent_endoscopy",
          triggers: ["new_alarms"]
        }
      ],
      redFlags: [
        {
          id: "new_alarms",
          condition: "New alarm symptoms",
          message: "Development of concerning symptoms",
          severity: "critical",
          recommendations: [
            "Expedite endoscopy",
            "Document weight loss and other changes",
            "Consider direct referral to GI specialist"
          ]
        }
      ]
    },
    {
      id: "endoscopy",
      title: "Upper GI Endoscopy",
      description: "Diagnostic endoscopy with targeted biopsies",
      expectedDuration: "1-2 days",
      tooltip: "Multiple biopsies from suspicious areas and mapping biopsies if diffuse disease",
      options: [
        {
          text: "Suspicious lesion identified",
          next: "biopsy",
          triggers: ["suspicious_lesion"]
        },
        {
          text: "Active bleeding found",
          next: "emergency_management",
          triggers: ["active_bleeding"]
        },
        {
          text: "Normal or benign findings",
          next: "monitoring"
        }
      ],
      redFlags: [
        {
          id: "suspicious_lesion",
          condition: "Suspicious gastric lesion",
          message: "Endoscopic features concerning for malignancy",
          severity: "warning",
          recommendations: [
            "Multiple targeted biopsies",
            "Photo documentation",
            "Consider endoscopic ultrasound"
          ]
        },
        {
          id: "active_bleeding",
          condition: "Active GI bleeding",
          message: "Active bleeding requiring urgent intervention",
          severity: "critical",
          recommendations: [
            "Immediate hemostasis attempt",
            "Blood product support",
            "Surgical backup"
          ]
        }
      ]
    },
    {
      id: "biopsy",
      title: "Pathology Assessment",
      description: "Histological evaluation of gastric biopsies",
      expectedDuration: "3-5 days",
      tooltip: "Request Lauren classification and HER2 testing if adenocarcinoma",
      options: [
        {
          text: "Adenocarcinoma confirmed",
          next: "staging",
          triggers: ["confirmed_cancer"]
        },
        {
          text: "Other malignancy",
          next: "specialized_planning"
        },
        {
          text: "Dysplasia",
          next: "surveillance"
        }
      ],
      redFlags: [
        {
          id: "confirmed_cancer",
          condition: "Confirmed gastric cancer",
          message: "Histologically confirmed malignancy",
          severity: "critical",
          recommendations: [
            "Expedite staging workup",
            "Schedule multidisciplinary discussion",
            "Assess nutritional status"
          ]
        }
      ]
    },
    {
      id: "staging",
      title: "Disease Staging",
      description: "Complete staging workup",
      expectedDuration: "5-7 days",
      tooltip: "CT chest/abdomen/pelvis, consider PET-CT for suspected metastatic disease",
      options: [
        {
          text: "Early stage",
          next: "surgical_planning"
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
            "Urgent oncology consultation",
            "Consider palliative care involvement",
            "Assess for nutritional support needs",
            "Discuss prognosis and goals of care"
          ]
        }
      ]
    }
  ]
};
