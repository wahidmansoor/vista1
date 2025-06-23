import { CancerTypeTemplate } from '../types/evaluation';

export const evaluationTemplates: CancerTypeTemplate = {
  breast: {
    sections: [
      {
        title: "Clinical Presentation",
        items: [
          {
            text: "Breast Mass Characteristics",
            tooltip: "Size, location, mobility, skin changes, nipple changes",
            required: true,
            redFlags: ["Skin ulceration", "Peau d'orange", "Fixed mass"]
          },
          {
            text: "Lymph Node Status",
            tooltip: "Axillary, supraclavicular, cervical nodes",
            required: true
          }
        ],
        cancerSpecificNotes: ["Document distance from nipple", "Check for bilateral findings"]
      },
      {
        title: "Risk Assessment",
        items: [
          {
            text: "Family History",
            tooltip: "First-degree relatives with breast/ovarian cancer, age at diagnosis",
            required: true,
            redFlags: ["Multiple affected relatives", "Young age at diagnosis"]
          },
          {
            text: "Genetic Factors",
            tooltip: "Known BRCA status, other genetic syndromes",
            required: false
          }
        ]
      }
    ],
    notes: [
      "Consider mammogram ± ultrasound for imaging",
      "Assess BIRADS category if imaging available",
      "Consider genetic counseling if strong family history"
    ],
    redFlags: [
      "Inflammatory breast cancer signs",
      "Nipple discharge/retraction",
      "Axillary lymphadenopathy"
    ]
  },
  lung: {
    sections: [
      {
        title: "Respiratory Symptoms",
        items: [
          {
            text: "Cough Characteristics",
            tooltip: "Duration, type, hemoptysis",
            required: true,
            redFlags: ["Hemoptysis", "Stridor"]
          },
          {
            text: "Systemic Symptoms",
            tooltip: "Weight loss, fatigue, chest pain",
            required: true
          }
        ],
        cancerSpecificNotes: ["Quantify pack-years if smoker", "Note occupational exposures"]
      },
      {
        title: "Metastatic Symptoms",
        items: [
          {
            text: "Neurological Symptoms",
            tooltip: "Headache, weakness, confusion",
            required: true,
            redFlags: ["New neurological symptoms", "Severe headache"]
          },
          {
            text: "Bone Pain",
            tooltip: "Location, severity, duration",
            required: true
          }
        ]
      }
    ],
    notes: [
      "Order chest CT if suspicious",
      "Consider PET-CT for staging",
      "Assess smoking cessation support needs"
    ],
    redFlags: [
      "Superior vena cava syndrome",
      "Severe dyspnea",
      "Significant hemoptysis"
    ]
  },
  prostate: {
    sections: [
      {
        title: "Urinary Symptoms",
        items: [
          {
            text: "LUTS Assessment",
            tooltip: "Frequency, urgency, nocturia, stream",
            required: true,
            redFlags: ["Acute retention", "Severe urinary symptoms"]
          },
          {
            text: "Obstructive Symptoms",
            tooltip: "Hesitancy, poor stream, retention",
            required: true,
            redFlags: ["Complete obstruction"]
          }
        ],
        cancerSpecificNotes: ["Document IPSS score", "Record voiding diary findings"]
      },
      {
        title: "Physical Examination",
        items: [
          {
            text: "Digital Rectal Examination",
            tooltip: "Size, consistency, nodules, tenderness",
            required: true,
            redFlags: ["Hard nodular prostate", "Fixed mass"]
          }
        ]
      },
      {
        title: "Metastatic Assessment",
        items: [
          {
            text: "Bone Pain",
            tooltip: "Location, severity, duration",
            required: true,
            redFlags: ["Severe back pain", "Pathological fracture risk"]
          },
          {
            text: "Neurological Symptoms",
            tooltip: "Lower limb weakness, sensory changes",
            required: true,
            redFlags: ["Cord compression symptoms"]
          }
        ]
      }
    ],
    notes: [
      "Check PSA level",
      "Consider bone scan if indicated",
      "Family history documentation essential",
      "Consider hereditary cancer syndromes"
    ],
    redFlags: [
      "Spinal cord compression",
      "Urinary retention",
      "Rapidly rising PSA",
      "Pathological fracture risk"
    ]
  },
  lymphoma: {
    sections: [
      {
        title: "Lymphadenopathy Assessment",
        items: [
          {
            text: "Node Characteristics",
            tooltip: "Size, location, consistency, mobility",
            required: true,
            redFlags: ["Rapid enlargement", "Rock-hard nodes"]
          },
          {
            text: "Distribution Pattern",
            tooltip: "Document all involved sites systematically",
            required: true
          }
        ],
        cancerSpecificNotes: ["Map out all involved nodes", "Compare with previous examinations"]
      },
      {
        title: "B Symptoms",
        items: [
          {
            text: "Fever Pattern",
            tooltip: "Document temperature, duration, pattern",
            required: true
          },
          {
            text: "Night Sweats",
            tooltip: "Severity, frequency, impact on daily life",
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
        title: "Systemic Examination",
        items: [
          {
            text: "Hepatosplenomegaly",
            tooltip: "Size, tenderness, associated symptoms",
            required: true
          },
          {
            text: "Extra-nodal Involvement",
            tooltip: "Skin lesions, bone pain, CNS symptoms",
            required: true,
            redFlags: ["CNS involvement", "Airway compromise"]
          }
        ]
      }
    ],
    notes: [
      "Document performance status",
      "Consider PET-CT staging",
      "Plan for bone marrow assessment",
      "Check EBV status in young patients"
    ],
    redFlags: [
      "Superior vena cava syndrome",
      "Airway compromise",
      "CNS involvement",
      "Significant B symptoms"
    ]
  },
  colon: {
    sections: [
      {
        title: "Gastrointestinal Symptoms",
        items: [
          {
            text: "Bowel Habits",
            tooltip: "Changes in frequency, caliber, blood in stool",
            required: true,
            redFlags: ["Rectal bleeding", "Severe constipation"]
          },
          {
            text: "Abdominal Symptoms",
            tooltip: "Pain, distention, mass",
            required: true
          }
        ],
        cancerSpecificNotes: ["Document Bristol stool scale", "Note any screening history"]
      },
      {
        title: "Risk Assessment",
        items: [
          {
            text: "Family History",
            tooltip: "History of colorectal cancer or polyps",
            required: true
          },
          {
            text: "Lynch Syndrome Screening",
            tooltip: "Family history of associated cancers",
            required: false
          }
        ]
      }
    ],
    notes: [
      "Check hemoglobin level",
      "Consider colonoscopy referral",
      "Assess for Lynch syndrome criteria"
    ],
    redFlags: [
      "Bowel obstruction",
      "Significant weight loss",
      "Iron deficiency anemia"
    ]
  },
  ovarian: {
    sections: [
      {
        title: "Symptoms & History",
        items: [
          {
            text: "Abdominal/Pelvic Symptoms",
            tooltip: "Bloating, early satiety, abdominal pain",
            required: true,
            redFlags: ["Rapidly increasing abdominal girth", "Severe pain"]
          },
          {
            text: "Menstrual History",
            tooltip: "Pattern changes, irregular bleeding",
            required: true,
            redFlags: ["Post-menopausal bleeding"]
          },
          {
            text: "Constitutional Symptoms",
            tooltip: "Weight loss, fatigue, appetite changes",
            required: true
          }
        ],
        cancerSpecificNotes: ["Document family history of ovarian/breast cancer", "Check BRCA status if applicable"]
      },
      {
        title: "Physical Examination",
        items: [
          {
            text: "Abdominal Assessment",
            tooltip: "Ascites, masses, organomegaly",
            required: true,
            redFlags: ["Fixed pelvic mass", "Omental cake"]
          },
          {
            text: "Pelvic Examination",
            tooltip: "Adnexal masses, tenderness",
            required: true
          }
        ]
      }
    ],
    notes: [
      "Check CA-125 if postmenopausal",
      "Consider CT abdomen/pelvis",
      "Consider genetic counseling referral"
    ],
    redFlags: [
      "Fixed pelvic mass",
      "Rapidly growing abdominal distention",
      "Significant ascites"
    ]
  },
  gastric: {
    sections: [
      {
        title: "Upper GI Symptoms",
        items: [
          {
            text: "Epigastric Symptoms",
            tooltip: "Pain pattern, relation to food, duration",
            required: true,
            redFlags: ["Persistent pain", "Progressive dysphagia"]
          },
          {
            text: "Eating Difficulties",
            tooltip: "Loss of appetite, early satiety, weight loss",
            required: true,
            redFlags: ["Significant weight loss", "Complete dysphagia"]
          },
          {
            text: "GI Bleeding Signs",
            tooltip: "Hematemesis, melena, chronic blood loss",
            required: true,
            redFlags: ["Active bleeding", "Severe anemia"]
          }
        ],
        cancerSpecificNotes: ["Note H. pylori status if known", "Document family history"]
      }
    ],
    notes: [
      "Check for Virchow's node",
      "Consider urgent gastroscopy",
      "Check H. pylori status"
    ],
    redFlags: [
      "Persistent vomiting",
      "Gastrointestinal bleeding",
      "Severe weight loss",
      "Iron deficiency anemia"
    ]
  },
  "head-and-neck": {
    sections: [
      {
        title: "ENT Symptoms",
        items: [
          {
            text: "Voice Changes",
            tooltip: "Hoarseness, duration, progression",
            required: true,
            redFlags: ["Progressive hoarseness", "Stridor"]
          },
          {
            text: "Swallowing Issues",
            tooltip: "Dysphagia pattern, odynophagia",
            required: true,
            redFlags: ["Complete dysphagia", "Aspiration"]
          },
          {
            text: "Neck Masses",
            tooltip: "Location, size, duration, mobility",
            required: true,
            redFlags: ["Rapidly growing mass", "Fixed mass"]
          }
        ],
        cancerSpecificNotes: ["Document smoking/alcohol history", "Note occupational exposures"]
      },
      {
        title: "Physical Examination",
        items: [
          {
            text: "Oral Cavity Exam",
            tooltip: "Mucosal lesions, ulcers, masses",
            required: true,
            redFlags: ["Non-healing ulcers", "Bleeding lesions"]
          },
          {
            text: "Neck Examination",
            tooltip: "Systematic lymph node assessment",
            required: true,
            redFlags: ["Fixed nodes", "Multiple levels involved"]
          }
        ]
      }
    ],
    notes: [
      "Complete head and neck exam essential",
      "Consider nasendoscopy if indicated",
      "Document risk factors carefully"
    ],
    redFlags: [
      "Stridor or airway compromise",
      "Unilateral ear pain",
      "Progressive dysphagia",
      "Cranial nerve involvement"
    ]
  }
};
