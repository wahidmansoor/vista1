import { StepBasedPathway } from "../../types/cancer-pathways";

export const pancreaticCancerPathway: StepBasedPathway = {
  id: "pancreatic",
  name: "Pancreatic Cancer Diagnostic Pathway",
  description: "Evidence-based approach to pancreatic cancer diagnosis and staging",
  recommendedTimeframe: "2-3 weeks",
  steps: [
    {
      id: "initial",
      title: "Initial Assessment",
      description: "Patient presents with suspicious symptoms or findings",
      expectedDuration: "1-2 days",
      tooltip: "Key symptoms include jaundice, weight loss, and epigastric pain",
      options: [
        {
          text: "Obstructive jaundice",
          next: "urgent_imaging",
          triggers: ["jaundice"]
        },
        {
          text: "Pancreatic mass on imaging",
          next: "characterization"
        },
        {
          text: "Nonspecific symptoms",
          next: "initial_workup"
        }
      ],
      redFlags: [
        {
          id: "jaundice",
          condition: "Obstructive jaundice",
          message: "Painless jaundice concerning for pancreatic cancer",
          severity: "critical",
          recommendations: [
            "Urgent CT pancreas protocol",
            "Complete liver function tests",
            "Early surgical consultation"
          ]
        }
      ]
    },
    {
      id: "initial_workup",
      title: "Initial Laboratory Evaluation",
      description: "Basic labs and tumor markers",
      expectedDuration: "2-3 days",
      tooltip: "Include CA 19-9, liver function, and coagulation studies",
      options: [
        {
          text: "Elevated CA 19-9",
          next: "imaging",
          triggers: ["elevated_marker"]
        },
        {
          text: "Abnormal LFTs",
          next: "imaging",
          triggers: ["liver_dysfunction"]
        },
        {
          text: "Normal studies",
          next: "imaging"
        }
      ],
      redFlags: [
        {
          id: "elevated_marker",
          condition: "Elevated CA 19-9",
          message: "Marker elevation suggesting malignancy",
          severity: "warning",
          recommendations: [
            "Expedite imaging",
            "Consider other GI malignancies",
            "Document baseline value"
          ]
        },
        {
          id: "liver_dysfunction",
          condition: "Abnormal liver function",
          message: "Liver dysfunction requiring evaluation",
          severity: "warning",
          recommendations: [
            "Assess for obstruction",
            "Monitor coagulation",
            "Consider biliary decompression"
          ]
        }
      ]
    },
    {
      id: "imaging",
      title: "Diagnostic Imaging",
      description: "Pancreas protocol CT/MRI",
      expectedDuration: "2-3 days",
      tooltip: "Triple-phase CT preferred for initial evaluation",
      options: [
        {
          text: "Resectable mass",
          next: "tissue_diagnosis",
          triggers: ["resectable"]
        },
        {
          text: "Borderline/locally advanced",
          next: "tissue_diagnosis"
        },
        {
          text: "Metastatic disease",
          next: "palliative_planning",
          triggers: ["metastatic"]
        }
      ],
      redFlags: [
        {
          id: "resectable",
          condition: "Resectable tumor",
          message: "Potentially resectable disease",
          severity: "warning",
          recommendations: [
            "Expedite tissue diagnosis",
            "Early surgical consultation",
            "Consider neoadjuvant therapy"
          ]
        },
        {
          id: "metastatic",
          condition: "Metastatic disease",
          message: "Stage IV disease identified",
          severity: "critical",
          recommendations: [
            "Tissue diagnosis for treatment planning",
            "Early palliative care involvement",
            "Discuss prognosis and goals"
          ]
        }
      ]
    },
    {
      id: "tissue_diagnosis",
      title: "Tissue Acquisition",
      description: "EUS-guided FNA or CT-guided biopsy",
      expectedDuration: "2-3 days",
      tooltip: "EUS-FNA preferred for resectable lesions",
      options: [
        {
          text: "Adenocarcinoma confirmed",
          next: "staging",
          triggers: ["confirmed_cancer"]
        },
        {
          text: "Other pathology",
          next: "specialized_planning"
        },
        {
          text: "Non-diagnostic",
          next: "repeat_biopsy"
        }
      ],
      redFlags: [
        {
          id: "confirmed_cancer",
          condition: "Confirmed pancreatic cancer",
          message: "Histologically confirmed malignancy",
          severity: "critical",
          recommendations: [
            "Complete staging workup",
            "Nutritional assessment",
            "Pain management evaluation",
            "Early genetic counseling referral"
          ]
        }
      ]
    },
    {
      id: "staging",
      title: "Disease Staging",
      description: "Complete staging workup and treatment planning",
      expectedDuration: "5-7 days",
      tooltip: "Consider staging laparoscopy for borderline cases",
      options: [
        {
          text: "Proceed to surgery",
          next: "surgical_planning"
        },
        {
          text: "Neoadjuvant therapy",
          next: "medical_oncology"
        },
        {
          text: "Palliative approach",
          next: "supportive_care",
          triggers: ["palliative"]
        }
      ],
      redFlags: [
        {
          id: "palliative",
          condition: "Non-curative disease",
          message: "Disease not amenable to curative treatment",
          severity: "critical",
          recommendations: [
            "Early palliative care consultation",
            "Discuss advance care planning",
            "Address symptom management",
            "Consider clinical trials"
          ]
        }
      ]
    }
  ]
};
