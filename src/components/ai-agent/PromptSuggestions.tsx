import React from 'react';
import { ModuleType, PromptIntent } from './types';

interface PromptSuggestionsProps {
  module: ModuleType;
  intent: PromptIntent;
  onSelect: (prompt: string) => void;
}

const allPromptIntents: PromptIntent[] = [
  'screening',
  'general',
  'triage',
  'follow-up',
  'dose-check',
  'toxicity',
  'evaluation',
  'pathway',
  'rescue-agent'
];

function fillPromptIntents(obj: Partial<Record<PromptIntent, string[]>>): Record<PromptIntent, string[]> {
  const filled: Record<PromptIntent, string[]> = {} as Record<PromptIntent, string[]>;
  for (const key of allPromptIntents) {
    filled[key] = obj[key] || [];
  }
  return filled;
}

const modulePrompts: Record<ModuleType, Record<PromptIntent, string[]>> = {
  OPD: fillPromptIntents({
    screening: [
      'Analyze cancer screening recommendations for this patient',
      'Suggest additional screening tests based on risk factors',
      'Review current screening schedule compliance'
    ],
    'follow-up': [
      'Review follow-up plan and suggest optimizations',
      'Analyze surveillance frequency based on guidelines',
      'Recommend quality of life monitoring points'
    ],
    evaluation: [
      'Analyze treatment response patterns',
      'Review toxicity management approach',
      'Suggest supportive care interventions'
    ]
  }),
  CDU: fillPromptIntents({
    toxicity: [
      'Review chemotherapy toxicity patterns',
      'Suggest prophylactic interventions',
      'Analyze grade 3-4 adverse events'
    ],
    evaluation: [
      'Review chemotherapy response metrics',
      'Analyze dose modification patterns',
      'Suggest supportive care optimization'
    ]
  }),
  Inpatient: fillPromptIntents({
    triage: [
      'Analyze admission criteria compliance',
      'Review emergency response protocols',
      'Suggest care escalation thresholds'
    ],
    evaluation: [
      'Review inpatient care metrics',
      'Analyze complications and interventions',
      'Suggest discharge planning optimization'
    ]
  }),
  Palliative: fillPromptIntents({}),
  RadOnc: fillPromptIntents({})
};

export const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({
  module,
  intent,
  onSelect
}) => {
  const suggestions = modulePrompts[module]?.[intent] || [];

  if (suggestions.length === 0) return null;

  return (
    <div className="space-y-2 mt-2">
      <p className="text-sm font-medium text-gray-500">Suggested prompts:</p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onSelect(prompt)}
            className="text-sm px-3 py-1 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};