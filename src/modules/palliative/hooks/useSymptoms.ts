import { symptomTemplates, SymptomTemplate } from '../sections/symptom_control/data/SymptomData';
// Import all Lucide icons that might be used, or use import * as LucideReact
import { Activity, Wind, Droplets, Brain, PiggyBank, HelpCircle, Moon, Smile, Sparkles, AlertCircle, Thermometer, BookOpen, GripHorizontal, Pill } from 'lucide-react';

export interface Symptom extends SymptomTemplate {
  iconName: string; // Lucide icon name string
}

// Mapping from symptom ID to Lucide icon name string.
// Ideally, this information would come from the data source itself.
const iconNameMap: Record<string, string> = {
  pain: 'Pill',
  dyspnea: 'Wind',
  nausea: 'Droplets',
  delirium: 'Brain',
  fatigue: 'Activity',
  secretions: 'Layers', // Using 'Layers' as 'Droplets' is used for Nausea
  constipation: 'GripHorizontal',
};

// Define the primary list of symptoms based on what SymptomControlNew currently supports,
// and enrich them with data from SymptomData.ts if available.
// This ensures all tabs in SymptomControlNew can be generated.
const mainSymptomDefinitions: Array<{ id: string; name: string; defaultIcon: string }> = [
  { id: "pain", name: "Pain", defaultIcon: "Pill" },
  { id: "dyspnea", name: "Dyspnea", defaultIcon: "Wind" },
  { id: "nausea", name: "Nausea", defaultIcon: "Droplets" },
  { id: "delirium", name: "Delirium", defaultIcon: "Brain" },
  { id: "fatigue", name: "Fatigue", defaultIcon: "Activity" },
  { id: "secretions", name: "Secretions", defaultIcon: "Layers" },
  { id: "constipation", name: "Constipation", defaultIcon: "GripHorizontal" }
];

const processedSymptoms: Symptom[] = mainSymptomDefinitions.map(def => {
  const template = symptomTemplates.find(t => t.id === def.id) as SymptomTemplate | undefined;
  
  // Base structure from SymptomTemplate, or a minimal placeholder if not found in symptomTemplates
  const baseData: SymptomTemplate = {
    id: def.id,
    name: def.name, // Use definition name if not in template
    description: template ? template.description : `${def.name} symptom overview.`,
    commonCauses: template ? template.commonCauses : [],
    assessmentPoints: template ? template.assessmentPoints : [],
    interventions: template ? template.interventions : { nonPharmacological: [], pharmacological: [] },
    redFlags: template ? template.redFlags : []
  };

  return {
    ...baseData,
    name: template?.name || def.name, // Prefer name from SymptomData.ts if available
    iconName: iconNameMap[def.id] || def.defaultIcon,
  };
});

export function useSymptoms() {
  const getAllSymptoms = (): Symptom[] => {
    return processedSymptoms;
  };

  const getSymptomById = (id: string): Symptom | undefined => {
    return processedSymptoms.find(symptom => symptom.id === id);
  };

  // Filters symptoms where the symptom name starts with the category string.
  const filterSymptomsByCategory = (category: string): Symptom[] => {
    if (!category || category.toLowerCase() === 'all') {
      return processedSymptoms;
    }
    return processedSymptoms.filter(symptom =>
      symptom.name.toLowerCase().startsWith(category.toLowerCase())
    );
  };

  return { getAllSymptoms, getSymptomById, filterSymptomsByCategory };
}
