import { StepBasedPathway } from "../../types/cancer-pathways";

export const prostateCancerPathway: StepBasedPathway = {
  id: "prostate",
  name: "Prostate Cancer Diagnostic Pathway",
  description: "Evidence-based approach to prostate cancer diagnosis and risk stratification",
  recommendedTimeframe: "2-4 weeks",
  steps: [
    {
      id: "initial",
      title: "Initial Assessment",
      description: "Patient presents with elevated PSA or abnormal DRE",
      expectedDuration: "1-2 days",
      options: [
        {
          text: "Elevated PSA",
          next: "psa_confirmation",
          triggers: ["high_psa"]
        },
        {
          text: "Abnormal DRE",
          next: "imaging",
          triggers: ["abnormal_dre"]
        },
        {
          text: "Both PSA and DRE abnormal",
          next: "imaging",
          triggers: ["high_risk"]
        }
      ],
      redFlags: [
        {
          id: "high_psa",
          condition: "Elevated PSA",
          message: "PSA elevation requires confirmation",
          severity: "warning",
          recommendations: [
            "Repeat PSA test within 1-2 weeks",
            "Review medications and recent procedures",
            "Assess for urinary infection"
          ]
        },
        {
          id: "abnormal_dre",
          condition: "Abnormal DRE",
          message: "Suspicious nodule on examination",
          severity: "warning",
          recommendations: [
            "Schedule prostate MRI within 2 weeks",
            "Urology consultation recommended"
          ]
        },
        {
          id: "high_risk",
          condition: "Both PSA and DRE abnormal",
          message: "High-risk presentation",
          severity: "critical",
          recommendations: [
            "Expedited urology referral within 1 week",
            "Early imaging warranted",
            "Consider direct pathway to biopsy"
          ]
        }
      ]
    },
    {
      id: "psa_confirmation",
      title: "PSA Confirmation",
      description: "Confirm PSA elevation and assess PSA kinetics",
      expectedDuration: "1-2 weeks",
      tooltip: "Consider PSA density, velocity, and age-specific ranges",
      options: [
        {
          text: "Confirmed elevation",
          next: "imaging"
        },
        {
          text: "Normalized PSA",
          next: "monitoring"
        },
        {
          text: "Rapidly rising PSA",
          next: "imaging",
          triggers: ["rapid_rise"]
        }
      ],
      redFlags: [
        {
          id: "rapid_rise",
          condition: "Rapidly rising PSA",
          message: "PSA velocity concerning for aggressive disease",
          severity: "critical",
          recommendations: [
            "Expedite prostate MRI",
            "Early urology consultation",
            "Consider bone scan if PSA >20"
          ]
        }
      ]
    },
    {
      id: "imaging",
      title: "Prostate MRI",
      description: "Multiparametric MRI for lesion characterization",
      expectedDuration: "1-2 weeks",
      options: [
        {
          text: "PI-RADS 4-5",
          next: "biopsy",
          triggers: ["high_pirads"]
        },
        {
          text: "PI-RADS 3",
          next: "risk_assessment"
        },
        {
          text: "PI-RADS 1-2",
          next: "monitoring"
        }
      ],
      redFlags: [
        {
          id: "high_pirads",
          condition: "PI-RADS 4-5 lesion",
          message: "High suspicion for clinically significant cancer",
          severity: "critical",
          recommendations: [
            "Schedule targeted biopsy within 2 weeks",
            "Consider bone scan if PSA >20 or symptoms",
            "Discuss findings in urology MDT"
          ]
        }
      ]
    },
    {
      id: "biopsy",
      title: "Prostate Biopsy",
      description: "Systematic and/or targeted biopsy as indicated",
      expectedDuration: "1-3 days",
      tooltip: "Ensure prophylactic antibiotics and bleeding precautions",
      options: [
        {
          text: "Positive for cancer",
          next: "risk_stratification",
          triggers: ["positive_biopsy"]
        },
        {
          text: "Negative biopsy",
          next: "monitoring"
        },
        {
          text: "High-grade cancer",
          next: "staging",
          triggers: ["high_grade"]
        }
      ],
      redFlags: [
        {
          id: "positive_biopsy",
          condition: "Cancer detected",
          message: "Prostate cancer confirmed on biopsy",
          severity: "warning",
          recommendations: [
            "Complete risk stratification",
            "Schedule multidisciplinary discussion",
            "Arrange patient counseling"
          ]
        },
        {
          id: "high_grade",
          condition: "High-grade cancer",
          message: "Gleason grade group 4-5 identified",
          severity: "critical",
          recommendations: [
            "Expedite staging investigations",
            "Early oncology consultation",
            "Consider genetic counseling"
          ]
        }
      ]
    },
    {
      id: "staging",
      title: "Disease Staging",
      description: "Complete staging workup based on risk group",
      expectedDuration: "1-2 weeks",
      options: [
        {
          text: "Localized disease",
          next: "mdtb"
        },
        {
          text: "Regional disease",
          next: "mdtb"
        },
        {
          text: "Metastatic disease",
          next: "mdtb",
          triggers: ["metastatic"]
        }
      ],
      redFlags: [
        {
          id: "metastatic",
          condition: "Metastatic disease",
          message: "Stage IV disease confirmed",
          severity: "critical",
          recommendations: [
            "Urgent medical oncology review",
            "Consider early ADT initiation",
            "Discuss prognosis and goals of care"
          ]
        }
      ]
    }
  ]
};
