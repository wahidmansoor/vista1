export interface CTCAEGrade {
  grade: number;  // 1-5
  description: string;
  criteria: string[];
  interventionRequired: boolean;
  recommendedActions: string[];
}

export interface CTCAESymptom {
  id: string;
  name: string;
  category: string;
  grades: CTCAEGrade[];
  commonlyAssociatedWith: string[];
  preventiveMeasures: string[];
  monitoringGuidelines: string[];
}

export class CTCAE {
  private static instance: CTCAE;
  private symptoms: Map<string, CTCAESymptom>;

  private constructor() {
    this.symptoms = new Map();
    this.initializeSymptoms();
  }

  static getInstance(): CTCAE {
    if (!CTCAE.instance) {
      CTCAE.instance = new CTCAE();
    }
    return CTCAE.instance;
  }

  private initializeSymptoms() {
    // Initialize with common oncology symptoms and their CTCAE grading
    this.addSymptom({
      id: "CTCAE-N-001",
      name: "neutropenia",
      category: "Blood and Lymphatic",
      grades: [
        {
          grade: 1,
          description: "ANC < LLN - 1500/mm3",
          criteria: ["ANC 1500 - 1000/mm3"],
          interventionRequired: false,
          recommendedActions: ["Monitor closely"]
        },
        {
          grade: 4,
          description: "Life-threatening consequences",
          criteria: ["ANC < 500/mm3"],
          interventionRequired: true,
          recommendedActions: [
            "Immediate hospitalization",
            "Broad spectrum antibiotics",
            "Growth factor support"
          ]
        }
      ],
      commonlyAssociatedWith: ["chemotherapy", "radiation"],
      preventiveMeasures: ["Growth factor support", "Dose reduction"],
      monitoringGuidelines: ["Weekly CBC during therapy"]
    });
    // Add more symptoms as needed
  }

  addSymptom(symptom: CTCAESymptom) {
    this.symptoms.set(symptom.name.toLowerCase(), symptom);
  }

  getSymptomGrade(symptomName: string, severity: number): CTCAEGrade | null {
    const symptom = this.symptoms.get(symptomName.toLowerCase());
    if (!symptom) return null;

    // Map severity score (0-10) to CTCAE grade (1-5)
    const grade = Math.ceil((severity / 10) * 5);
    return symptom.grades.find(g => g.grade === grade) || null;
  }

  getSymptomInfo(symptomName: string): CTCAESymptom | null {
    return this.symptoms.get(symptomName.toLowerCase()) || null;
  }

  isEmergencySymptom(symptomName: string, severity: number): boolean {
    const grade = this.getSymptomGrade(symptomName, severity);
    return grade?.grade === 4 || grade?.grade === 5;
  }
}
