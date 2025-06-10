interface SymptomRelation {
  relatedSymptom: string;
  relationship: 'causes' | 'causedBy' | 'associatedWith' | 'differentialDiagnosis';
  strength: 'strong' | 'moderate' | 'weak';
  evidence: string;
}

interface SymptomDefinition {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  icd10Code?: string;
  commonCauses: string[];
  relations: SymptomRelation[];
  redFlags: string[];
  assessmentGuidelines: string[];
  differentialDiagnoses: string[];
}

interface EvidenceBasedIntervention {
  intervention: string;
  evidenceLevel: 'high' | 'moderate' | 'low';
  recommendation: string;
  source: string;
  context: string[];
}

export class SymptomOntology {
  private static instance: SymptomOntology;
  private symptoms: Map<string, SymptomDefinition>;
  private interventions: Map<string, EvidenceBasedIntervention[]>;

  private constructor() {
    this.symptoms = new Map();
    this.interventions = new Map();
    this.initializeOntology();
  }

  static getInstance(): SymptomOntology {
    if (!SymptomOntology.instance) {
      SymptomOntology.instance = new SymptomOntology();
    }
    return SymptomOntology.instance;
  }

  private initializeOntology() {
    // Initialize with common oncology symptoms
    this.addSymptom({
      id: "SYM-001",
      name: "fatigue",
      description: "A state of exhaustion and decreased capacity for physical and mental work",
      category: "Constitutional",
      commonCauses: [
        "cancer",
        "chemotherapy",
        "radiation therapy",
        "anemia",
        "depression",
        "medication side effects"
      ],
      relations: [
        {
          relatedSymptom: "insomnia",
          relationship: "associatedWith",
          strength: "moderate",
          evidence: "Multiple clinical studies"
        },
        {
          relatedSymptom: "depression",
          relationship: "associatedWith",
          strength: "strong",
          evidence: "Systematic reviews"
        }
      ],
      redFlags: [
        "Severe sudden onset",
        "Associated with fever",
        "Causing inability to perform daily activities"
      ],
      assessmentGuidelines: [
        "Assess pattern and severity",
        "Screen for contributing factors",
        "Evaluate impact on daily activities",
        "Consider using validated fatigue scales"
      ],
      differentialDiagnoses: [
        "Anemia",
        "Hypothyroidism",
        "Depression",
        "Sleep disorders"
      ]
    });

    // Add evidence-based interventions for fatigue
    this.addInterventions("fatigue", [
      {
        intervention: "Exercise program",
        evidenceLevel: "high",
        recommendation: "Regular moderate exercise improves cancer-related fatigue",
        source: "NCCN Guidelines",
        context: ["During and after cancer treatment", "When medically cleared"]
      },
      {
        intervention: "Sleep hygiene",
        evidenceLevel: "moderate",
        recommendation: "Implement good sleep practices",
        source: "ASCO Guidelines",
        context: ["All patients with fatigue"]
      }
    ]);
  }

  addSymptom(symptom: SymptomDefinition) {
    this.symptoms.set(symptom.name.toLowerCase(), symptom);
  }

  addInterventions(symptomName: string, interventions: EvidenceBasedIntervention[]) {
    this.interventions.set(symptomName.toLowerCase(), interventions);
  }

  getSymptomDefinition(symptomName: string): SymptomDefinition | null {
    return this.symptoms.get(symptomName.toLowerCase()) || null;
  }

  getInterventions(symptomName: string): EvidenceBasedIntervention[] {
    return this.interventions.get(symptomName.toLowerCase()) || [];
  }

  getRelatedSymptoms(symptomName: string): SymptomRelation[] {
    const symptom = this.symptoms.get(symptomName.toLowerCase());
    return symptom?.relations || [];
  }

  hasRedFlags(symptomName: string): string[] {
    const symptom = this.symptoms.get(symptomName.toLowerCase());
    return symptom?.redFlags || [];
  }

  getSymptomsInCategory(category: string): SymptomDefinition[] {
    return Array.from(this.symptoms.values())
      .filter(s => s.category === category);
  }
}
