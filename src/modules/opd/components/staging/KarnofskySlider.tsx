import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface KarnofskySliderProps {
  value: number;
  onChange: (value: number) => void;
}

const getScoreDescription = (score: number): string => {
  if (score >= 90) return 'Able to carry on normal activities; minor signs or symptoms of disease';
  if (score >= 70) return 'Able to care for self but unable to carry on normal activities or work';
  if (score >= 50) return 'Requires considerable assistance and frequent medical care';
  if (score >= 30) return 'Severely disabled; hospitalization indicated though death not imminent';
  return 'Very sick; hospital admission necessary; active supportive treatment necessary';
};

const getScoreColor = (score: number): string => {
  if (score >= 90) return 'bg-green-500';
  if (score >= 70) return 'bg-blue-500';
  if (score >= 50) return 'bg-yellow-500';
  if (score >= 30) return 'bg-orange-500';
  return 'bg-red-500';
};

const KarnofskySlider: React.FC<KarnofskySliderProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold text-gray-800">Karnofsky Performance Status</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <AlertCircle className="w-4 h-4 text-blue-500" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-sm">
                Karnofsky Performance Status (KPS) scale quantifies cancer patients' general well-being
                and activities of daily life. Scores range from 0-100.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-gray-700">{value}%</span>
          <span className="text-sm text-gray-500">{getScoreDescription(value)}</span>
        </div>

        <div className="relative">
          <input
            type="range"
            min={0}
            max={100}
            step={10}
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${getScoreColor(value)} 0%, ${getScoreColor(value)} ${value}%, #e5e7eb ${value}%, #e5e7eb 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-gray-500 px-1 mt-2">
            <span>0</span>
            <span>20</span>
            <span>40</span>
            <span>60</span>
            <span>80</span>
            <span>100</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="h-2 w-full bg-red-500 rounded mb-1"></div>
            <span className="text-gray-600">Critical</span>
          </div>
          <div className="text-center">
            <div className="h-2 w-full bg-yellow-500 rounded mb-1"></div>
            <span className="text-gray-600">Moderate</span>
          </div>
          <div className="text-center">
            <div className="h-2 w-full bg-green-500 rounded mb-1"></div>
            <span className="text-gray-600">Good</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KarnofskySlider;