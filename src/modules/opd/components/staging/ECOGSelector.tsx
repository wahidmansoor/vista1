import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ECOGSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

const ecogScores = [
  {
    score: 0,
    description: 'Fully active, able to carry on all pre-disease performance without restriction'
  },
  {
    score: 1,
    description: 'Restricted in physically strenuous activity but ambulatory and able to carry out work of a light or sedentary nature'
  },
  {
    score: 2,
    description: 'Ambulatory and capable of all self-care but unable to carry out any work activities; up and about more than 50% of waking hours'
  },
  {
    score: 3,
    description: 'Capable of only limited self-care; confined to bed or chair more than 50% of waking hours'
  },
  {
    score: 4,
    description: 'Completely disabled; cannot carry on any self-care; totally confined to bed or chair'
  },
  {
    score: 5,
    description: 'Dead'
  }
];

const ECOGSelector: React.FC<ECOGSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold text-gray-800">ECOG Performance Status</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <AlertCircle className="w-4 h-4 text-blue-500" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-sm">
                Eastern Cooperative Oncology Group (ECOG) performance status.
                Used to assess disease progress and how it affects daily living abilities.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="grid gap-4">
        {ecogScores.map(({ score, description }) => (
          <div
            key={score}
            className={`p-4 rounded-lg border cursor-pointer transition-colors ${
              value === score
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-indigo-200'
            }`}
            onClick={() => onChange(score)}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                value === score ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-700'
              }`}>
                {score}
              </div>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ECOGSelector;