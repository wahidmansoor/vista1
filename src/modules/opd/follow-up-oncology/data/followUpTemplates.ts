export type CancerType = 
  | 'breast' | 'lung' | 'colorectal' | 'prostate' 
  | 'pancreatic' | 'bladder' | 'headneck' 
  | 'ovarian' | 'gastric' | 'lymphoma' | 'melanoma'
  | 'esophageal' | 'thyroid' | 'hepatocellular'
  | 'testicular' | 'brain' | 'sarcoma';

export type Stage = 'early' | 'advanced';
export type Intent = 'curative' | 'palliative';
export type FollowUpInterval = '3mo' | '6mo' | '1yr' | '2yr' | '5yr';

export interface FollowUpTimelineItem {
  interval: FollowUpInterval;
  actions: string[];
}

interface Investigation {
  title: string;
  frequency: string;
  description?: string;
}

interface TemplateMetadata {
  version: string;
  lastUpdated: string;
  source?: string;
}

export interface FollowUpTemplate {
  metadata: TemplateMetadata;
  intervals: {
    curative: Record<FollowUpInterval, Investigation[]>;
    palliative: Record<FollowUpInterval, Investigation[]>;
  };
  stageGuidelines: Record<Stage, {
    surveillance: Investigation[];
    imaging: Investigation[];
    labTests: Investigation[];
  }>;
  surveillance: {
    investigations: Investigation[];
    examinations: Investigation[];
  };
  redFlags: Array<{
    symptom: string;
    severity: 'urgent' | 'warning';
    action: string;
  }>;
  urgentFlags: Array<{
    condition: string;
    action: string;
    timeframe: string;
  }>;
  qolTopics: Array<{
    topic: string;
    description: string;
    recommendations: string[];
    applicableStages: Stage[];
  }>;
  commonSymptoms: Array<{
    symptom: string;
    severity: 'low' | 'medium' | 'high';
    relatedFlags?: string[];
  }>;
}

export const cancerTemplates: Record<CancerType, FollowUpTemplate> = {
  breast: {
    metadata: {
      version: '1.0.0',
      lastUpdated: '2024-01-20'
    },
    intervals: {
      curative: {
        '3mo': [
          { title: 'Clinical breast exam', frequency: 'Every 3-4 months for 3 years' },
          { title: 'Review symptoms', frequency: 'Every visit' }
        ],
        '6mo': [
          { title: 'Mammogram', frequency: 'Every 6-12 months' },
          { title: 'Blood tests', frequency: 'As clinically indicated' }
        ],
        // ...other intervals
      },
      palliative: {
        '3mo': [
          { title: 'Symptom assessment', frequency: 'Every visit' },
          { title: 'Pain evaluation', frequency: 'Every visit' }
        ],
        // ...other intervals
      }
    },
    stageGuidelines: {
      early: {
        surveillance: [
          { title: 'Mammogram', frequency: 'Every 12 months', duration: '5 years' },
          { title: 'Clinical exam', frequency: 'Every 3-4 months', duration: '2 years' }
        ],
        imaging: [
          { title: 'Breast MRI', frequency: 'As indicated' }
        ],
        labTests: [
          { title: 'Blood tests', frequency: 'As clinically indicated' }
        ]
      },
      advanced: {
        surveillance: [
          { title: 'CT scan', frequency: 'Every 6 months', duration: '2 years' },
          { title: 'Bone scan', frequency: 'As clinically indicated' }
        ],
        imaging: [
          { title: 'PET scan', frequency: 'As clinically indicated' }
        ],
        labTests: [
          { title: 'Tumor markers', frequency: 'As clinically indicated' }
        ]
      }
    },
    surveillance: {
      investigations: [],
      examinations: []
    },
    redFlags: [
      { symptom: 'New breast lumps', severity: 'urgent', action: 'Immediate referral' },
      { symptom: 'Bone pain', severity: 'warning', action: 'Further investigation' },
      { symptom: 'Persistent cough', severity: 'warning', action: 'Further investigation' },
      { symptom: 'Unexplained weight loss', severity: 'warning', action: 'Further investigation' }
    ],
    urgentFlags: [],
    qolTopics: [
      {
        topic: 'Lymphedema',
        description: 'Swelling in arm or breast',
        recommendations: ['Exercise', 'Compression garments', 'Specialist referral'],
        applicableStages: ['early', 'advanced']
      },
      // ...other QoL topics
    ],
    commonSymptoms: [
      { symptom: 'Fatigue', severity: 'medium' },
      { symptom: 'Arm swelling', severity: 'medium' },
      { symptom: 'Hot flashes', severity: 'low' }
    ]
  },
  lung: {
    metadata: {
      version: '1.0.0',
      lastUpdated: '2024-01-20'
    },
    intervals: {
      curative: {
        '3mo': [
          { title: 'Chest CT', frequency: 'Every 3-6 months for 2 years' },
          { title: 'Physical exam', frequency: 'Every 3 months' }
        ],
        // ...other intervals
      },
      palliative: {
        // ...palliative intervals
      }
    },
    stageGuidelines: {
      early: {
        surveillance: [
          { title: 'Chest X-ray', frequency: 'Every 6 months', duration: '2 years' }
        ],
        imaging: [
          { title: 'CT scan', frequency: 'As clinically indicated' }
        ],
        labTests: [
          { title: 'Blood tests', frequency: 'As clinically indicated' }
        ]
      },
      advanced: {
        surveillance: [
          { title: 'PET scan', frequency: 'As clinically indicated' }
        ],
        imaging: [
          { title: 'MRI', frequency: 'As clinically indicated' }
        ],
        labTests: [
          { title: 'Tumor markers', frequency: 'As clinically indicated' }
        ]
      }
    },
    surveillance: {
      investigations: [],
      examinations: []
    },
    redFlags: [
      { symptom: 'New cough', severity: 'urgent', action: 'Immediate referral' },
      { symptom: 'Hemoptysis', severity: 'urgent', action: 'Immediate referral' },
      { symptom: 'Shortness of breath', severity: 'warning', action: 'Further investigation' }
    ],
    urgentFlags: [],
    qolTopics: [
      {
        topic: 'Smoking cessation',
        description: 'Support to quit smoking',
        recommendations: ['Counseling', 'Nicotine replacement', 'Medications'],
        applicableStages: ['early', 'advanced']
      },
      // ...other QoL topics
    ],
    commonSymptoms: [
      { symptom: 'Cough', severity: 'medium' },
      { symptom: 'Shortness of breath', severity: 'high' },
      { symptom: 'Chest pain', severity: 'medium' }
    ]
  },
  colorectal: {
    metadata: {
      version: '1.0.0',
      lastUpdated: '2024-01-20'
    },
    intervals: {
      curative: {
        '3mo': [
          { title: 'CEA test', frequency: 'Every 3-6 months for 5 years' },
          { title: 'CT scan', frequency: 'Every 6-12 months for 5 years' }
        ],
        // ...other intervals
      },
      palliative: {
        // ...palliative intervals
      }
    },
    stageGuidelines: {
      early: {
        surveillance: [
          { title: 'Colonoscopy', frequency: 'Every 1 year', duration: '5 years' }
        ],
        imaging: [
          { title: 'CT scan', frequency: 'As clinically indicated' }
        ],
        labTests: [
          { title: 'Blood tests', frequency: 'As clinically indicated' }
        ]
      },
      advanced: {
        surveillance: [
          { title: 'PET scan', frequency: 'As clinically indicated' }
        ],
        imaging: [
          { title: 'MRI', frequency: 'As clinically indicated' }
        ],
        labTests: [
          { title: 'Tumor markers', frequency: 'As clinically indicated' }
        ]
      }
    },
    surveillance: {
      investigations: [],
      examinations: []
    },
    redFlags: [
      { symptom: 'Rectal bleeding', severity: 'urgent', action: 'Immediate referral' },
      { symptom: 'Abdominal pain', severity: 'warning', action: 'Further investigation' },
      { symptom: 'Change in bowel habits', severity: 'warning', action: 'Further investigation' }
    ],
    urgentFlags: [],
    qolTopics: [
      {
        topic: 'Dietary advice',
        description: 'Nutritional support',
        recommendations: ['High fiber diet', 'Hydration', 'Specialist referral'],
        applicableStages: ['early', 'advanced']
      },
      // ...other QoL topics
    ],
    commonSymptoms: [
      { symptom: 'Fatigue', severity: 'medium' },
      { symptom: 'Abdominal pain', severity: 'high' },
      { symptom: 'Weight loss', severity: 'medium' }
    ]
  },
  prostate: {
    metadata: {
      version: '1.0.0',
      lastUpdated: '2024-01-20'
    },
    intervals: {
      curative: {
        '3mo': [{ title: 'PSA test', frequency: 'Every 3 months for 2 years' }],
        '6mo': [{ title: 'Physical exam', frequency: 'Every 6 months' }]
      },
      palliative: {
        // ... palliative intervals
      }
    },
    stageGuidelines: {
      early: {
        surveillance: [
          { title: 'PSA test', frequency: 'Every 6 months', duration: '5 years' }
        ],
        imaging: [
          { title: 'MRI', frequency: 'As clinically indicated' }
        ],
        labTests: [
          { title: 'Blood tests', frequency: 'As clinically indicated' }
        ]
      },
      advanced: {
        surveillance: [
          { title: 'Bone scan', frequency: 'As clinically indicated' }
        ],
        imaging: [
          { title: 'CT scan', frequency: 'As clinically indicated' }
        ],
        labTests: [
          { title: 'Tumor markers', frequency: 'As clinically indicated' }
        ]
      }
    },
    surveillance: {
      investigations: [],
      examinations: []
    },
    redFlags: [
      { symptom: 'Urinary retention', severity: 'urgent', action: 'Immediate referral' },
      { symptom: 'Bone pain', severity: 'warning', action: 'Further investigation' },
      { symptom: 'Weight loss', severity: 'warning', action: 'Further investigation' }
    ],
    urgentFlags: [],
    qolTopics: [
      {
        topic: 'Sexual health',
        description: 'Support for sexual health',
        recommendations: ['Counseling', 'Medications', 'Specialist referral'],
        applicableStages: ['early', 'advanced']
      },
      // ...other QoL topics
    ],
    commonSymptoms: [
      { symptom: 'Fatigue', severity: 'medium' },
      { symptom: 'Urinary issues', severity: 'high' },
      { symptom: 'Erectile dysfunction', severity: 'medium' }
    ]
  },
  pancreatic: {
    metadata: {
      version: '1.0.0',
      lastUpdated: '2024-01-20'
    },
    intervals: {
      curative: {
        '3mo': [
          { title: 'CA 19-9', frequency: 'Every 3 months', duration: '2 years' },
          { title: 'CT abdomen', frequency: 'Every 3-6 months', duration: '2 years' }
        ],
        // ...other intervals
      },
      palliative: {
        // ...palliative intervals
      }
    },
    stageGuidelines: {
      early: {
        surveillance: [
          { title: 'CA 19-9', frequency: 'Every 3 months', duration: '2 years' }
        ],
        imaging: [
          { title: 'CT scan', frequency: 'As clinically indicated' }
        ],
        labTests: [
          { title: 'Blood tests', frequency: 'As clinically indicated' }
        ]
      },
      advanced: {
        surveillance: [
          { title: 'PET scan', frequency: 'As clinically indicated' }
        ],
        imaging: [
          { title: 'MRI', frequency: 'As clinically indicated' }
        ],
        labTests: [
          { title: 'Tumor markers', frequency: 'As clinically indicated' }
        ]
      }
    },
    surveillance: {
      investigations: [],
      examinations: []
    },
    redFlags: [
      { symptom: 'Jaundice', severity: 'urgent', action: 'Immediate referral' },
      { symptom: 'Abdominal pain', severity: 'warning', action: 'Further investigation' },
      { symptom: 'Weight loss', severity: 'warning', action: 'Further investigation' }
    ],
    urgentFlags: [],
    qolTopics: [
      {
        topic: 'Nutritional support',
        description: 'Support for maintaining nutrition',
        recommendations: ['High calorie diet', 'Enzyme supplements', 'Specialist referral'],
        applicableStages: ['early', 'advanced']
      },
      // ...other QoL topics
    ],
    commonSymptoms: [
      { symptom: 'Fatigue', severity: 'medium' },
      { symptom: 'Abdominal pain', severity: 'high' },
      { symptom: 'Weight loss', severity: 'medium' }
    ]
  },
  esophageal: {
    metadata: {
      version: '1.0.0',
      lastUpdated: '2024-01-20'
    },
    intervals: {
      curative: {
        '3mo': [
          { title: 'CT chest/abdomen', frequency: 'Every 3-6 months', duration: '2 years' },
          { title: 'Endoscopy', frequency: 'Every 6 months', duration: '2 years' }
        ],
        '6mo': [
          { title: 'Physical exam', frequency: 'Every 6 months', duration: '3 years' },
          { title: 'Nutritional assessment', frequency: 'Every 6 months' }
        ]
      },
      palliative: {
        '3mo': [
          { title: 'Symptom assessment', frequency: 'Every 3 months' },
          { title: 'Weight monitoring', frequency: 'Every visit' }
        ]
      }
    },
    stageGuidelines: {
      early: {
        surveillance: [],
        imaging: [],
        labTests: []
      },
      advanced: {
        // ...advanced stage guidelines
      }
    },
    surveillance: {
      investigations: [],
      examinations: []
    },
    redFlags: [
      { symptom: 'Progressive dysphagia', severity: 'urgent', action: 'Immediate evaluation' },
      { symptom: 'Weight loss > 5%', severity: 'warning', action: 'Early review' }
    ],
    urgentFlags: [],
    qolTopics: [
      {
        topic: 'Nutrition',
        description: 'Managing eating difficulties and maintaining weight',
        recommendations: ['Small frequent meals', 'Soft diet when needed'],
        applicableStages: ['early', 'advanced']
      }
    ],
    commonSymptoms: [
      { symptom: 'Swallowing difficulty', severity: 'high', relatedFlags: ['Progressive dysphagia'] }
    ]
  },
  // ...additional new cancer templates
};
