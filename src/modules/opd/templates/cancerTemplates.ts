interface EvaluationItem {
  text: string;
  tooltip: string;
  required?: boolean;
  redFlags?: string[];
}

interface EvaluationSection {
  title: string;
  items: EvaluationItem[];
  notes?: string[];
  redFlags?: string[];
}

interface CancerTemplate {
  cancerType: string;
  displayName: string;
  sections: EvaluationSection[];
  generalNotes: string[];
  redFlags: string[];
}

export const cancerTemplates: CancerTemplate[] = [
  {
    cancerType: "breast",
    displayName: "Breast Cancer",
    sections: [
      {
        title: "Presenting Complaints",
        items: [
          {
            text: "Breast Mass Description",
            tooltip: "Location, size, mobility, texture, duration",
            required: true,
            redFlags: ["Fixed to chest wall", "Rapid growth"]
          },
          {
            text: "Skin Changes",
            tooltip: "Color, texture, dimpling, ulceration",
            required: true,
            redFlags: ["Peau d'orange", "Skin ulceration"]
          },
          {
            text: "Nipple Changes",
            tooltip: "Discharge, retraction, eczema",
            required: true,
            redFlags: ["Bloody discharge", "Recent nipple inversion"]
          }
        ],
        notes: ["Document precise location using clock face", "Compare with opposite breast"]
      },
      {
        title: "Risk Assessment",
        items: [
          {
            text: "Family History",
            tooltip: "First/second degree relatives with breast/ovarian cancer, age at diagnosis",
            required: true
          },
          {
            text: "Personal Risk Factors",
            tooltip: "Age at menarche, parity, HRT use, previous breast biopsies",
            required: true
          },
          {
            text: "Genetic Risk",
            tooltip: "Known BRCA status, previous genetic testing",
            required: false
          }
        ]
      },
      {
        title: "Clinical Examination",
        items: [
          {
            text: "Lymph Node Status",
            tooltip: "Document axillary, supraclavicular, cervical nodes",
            required: true,
            redFlags: ["Fixed axillary nodes", "Supraclavicular nodes"]
          },
          {
            text: "Contralateral Breast",
            tooltip: "Document any abnormalities in opposite breast",
            required: true
          }
        ],
        notes: ["Examine in both sitting and supine positions", "Assess all lymph node basins"]
      }
    ],
    generalNotes: [
      "Consider mammogram ± ultrasound for imaging",
      "Assess BIRADS category if imaging available",
      "Consider genetic counseling if strong family history",
      "Document photography if available"
    ],
    redFlags: [
      "Inflammatory breast cancer signs",
      "Nipple discharge/retraction",
      "Axillary lymphadenopathy",
      "Skin ulceration",
      "Peau d'orange"
    ]
  },
  {
    cancerType: "lung",
    displayName: "Lung Cancer",
    sections: [
      {
        title: "Respiratory Symptoms",
        items: [
          {
            text: "Cough Characteristics",
            tooltip: "Duration, type, progression, hemoptysis",
            required: true,
            redFlags: ["Hemoptysis", "Stridor"]
          },
          {
            text: "Dyspnea Assessment",
            tooltip: "Onset, severity, exertion tolerance",
            required: true,
            redFlags: ["Sudden worsening", "Rest dyspnea"]
          },
          {
            text: "Chest Pain",
            tooltip: "Location, character, radiation, severity",
            required: true,
            redFlags: ["Constant severe pain", "Pleuritic"]
          }
        ]
      },
      {
        title: "Risk Factors",
        items: [
          {
            text: "Smoking History",
            tooltip: "Pack years, current/former, quit date",
            required: true
          },
          {
            text: "Occupational Exposure",
            tooltip: "Asbestos, radiation, chemicals",
            required: true
          }
        ],
        notes: ["Calculate pack-years", "Document occupation history"]
      },
      {
        title: "Systemic Symptoms",
        items: [
          {
            text: "Constitutional Symptoms",
            tooltip: "Weight loss, fatigue, appetite",
            required: true,
            redFlags: ["Significant weight loss", "Severe fatigue"]
          },
          {
            text: "Paraneoplastic Features",
            tooltip: "SIADH, Cushing's, clubbing",
            required: true
          }
        ]
      }
    ],
    generalNotes: [
      "Consider PET-CT for staging",
      "Assess for molecular markers if adenocarcinoma",
      "Evaluate pulmonary function",
      "Consider smoking cessation support"
    ],
    redFlags: [
      "Superior vena cava syndrome",
      "Stridor",
      "Hemoptysis",
      "Horner's syndrome",
      "New neurological symptoms"
    ]
  },
  {
    cancerType: "colorectal",
    displayName: "Colorectal Cancer",
    sections: [
      {
        title: "Bowel Symptoms",
        items: [
          {
            text: "Bowel Habit Changes",
            tooltip: "Frequency, consistency, caliber change",
            required: true,
            redFlags: ["Complete obstruction", "Severe constipation"]
          },
          {
            text: "Bleeding Pattern",
            tooltip: "Color, frequency, amount, duration",
            required: true,
            redFlags: ["Dark blood", "Large volume"]
          }
        ],
        notes: ["Use Bristol Stool Chart", "Document duration of symptoms"]
      },
      {
        title: "Risk Assessment",
        items: [
          {
            text: "Family History",
            tooltip: "History of colorectal cancer/polyps, Lynch syndrome",
            required: true
          },
          {
            text: "Personal History",
            tooltip: "IBD, previous polyps, screening history",
            required: true
          }
        ]
      },
      {
        title: "Physical Findings",
        items: [
          {
            text: "Abdominal Examination",
            tooltip: "Mass, tenderness, distension",
            required: true,
            redFlags: ["Palpable mass", "Peritoneal signs"]
          },
          {
            text: "Digital Rectal Exam",
            tooltip: "Mass, bleeding, tender",
            required: true,
            redFlags: ["Fixed rectal mass", "Obstructing mass"]
          }
        ]
      }
    ],
    generalNotes: [
      "Check hemoglobin and iron studies",
      "Consider Lynch syndrome screening",
      "Plan colonoscopy if not done",
      "Consider CT colonography if appropriate"
    ],
    redFlags: [
      "Bowel obstruction",
      "Significant weight loss",
      "Iron deficiency anemia",
      "Palpable abdominal mass"
    ]
  },
  {
    cancerType: "prostate",
    displayName: "Prostate Cancer",
    sections: [
      {
        title: "Urinary Symptoms",
        items: [
          {
            text: "LUTS Assessment",
            tooltip: "Frequency, urgency, nocturia, stream",
            required: true
          },
          {
            text: "Obstructive Symptoms",
            tooltip: "Hesitancy, poor stream, retention",
            required: true,
            redFlags: ["Acute retention", "Complete obstruction"]
          }
        ]
      },
      {
        title: "Risk Assessment",
        items: [
          {
            text: "Family History",
            tooltip: "First-degree relatives with prostate cancer, age at diagnosis",
            required: true
          },
          {
            text: "PSA History",
            tooltip: "Previous values, trend, date of last test",
            required: true,
            redFlags: ["Rapidly rising PSA", "Very high PSA"]
          }
        ]
      },
      {
        title: "Metastatic Symptoms",
        items: [
          {
            text: "Bone Pain",
            tooltip: "Location, severity, duration",
            required: true,
            redFlags: ["Severe back pain", "Pathological fracture"]
          },
          {
            text: "Neurological Symptoms",
            tooltip: "Weakness, numbness, bladder/bowel control",
            required: true,
            redFlags: ["Cord compression symptoms"]
          }
        ]
      }
    ],
    generalNotes: [
      "Perform DRE in all cases",
      "Check PSA if not done",
      "Consider bone scan if indicated",
      "Document IPSS score"
    ],
    redFlags: [
      "Spinal cord compression",
      "Urinary retention",
      "Pathological fracture",
      "Rapidly rising PSA"
    ]
  },
  {
    cancerType: "lymphoma",
    displayName: "Lymphoma",
    sections: [
      {
        title: "Lymph Node Assessment",
        items: [
          {
            text: "Node Characteristics",
            tooltip: "Size, location, consistency, duration",
            required: true,
            redFlags: ["Rapid enlargement", "Rock-hard nodes"]
          },
          {
            text: "Distribution",
            tooltip: "Document all involved sites",
            required: true
          }
        ],
        notes: ["Examine all lymph node regions", "Document size in centimeters"]
      },
      {
        title: "B Symptoms",
        items: [
          {
            text: "Fever Pattern",
            tooltip: "Document pattern, duration, associated symptoms",
            required: true
          },
          {
            text: "Night Sweats",
            tooltip: "Severity, frequency, duration",
            required: true
          },
          {
            text: "Weight Loss",
            tooltip: "Amount, duration, associated symptoms",
            required: true,
            redFlags: [">10% in 6 months"]
          }
        ]
      },
      {
        title: "Other Systems",
        items: [
          {
            text: "Spleen/Liver",
            tooltip: "Size, tenderness",
            required: true
          },
          {
            text: "Extra-nodal Sites",
            tooltip: "Skin, CNS, bone symptoms",
            required: true,
            redFlags: ["CNS symptoms", "Bone pain"]
          }
        ]
      }
    ],
    generalNotes: [
      "Document performance status",
      "Consider PET-CT for staging",
      "Plan for bone marrow assessment",
      "Check EBV status in young patients"
    ],
    redFlags: [
      "Superior vena cava syndrome",
      "Rapid nodal enlargement",
      "Significant B symptoms",
      "Neurological symptoms",
      "Airway compromise"
    ]
  }
];

export type { CancerTemplate, EvaluationSection, EvaluationItem };
