import React from 'react';
import { AlertTriangle, Clock, Check } from 'lucide-react';

interface TriageResultProps {
  aiTriageResult: {
    urgency: 'Urgent' | 'Soon' | 'Routine';
    reasoning: string[];
    timeframe: string;
  } | null;
}

const TriageResult: React.FC<TriageResultProps> = ({ aiTriageResult }) => {
  if (!aiTriageResult) return null;

const urgencyStyles: Record<'Urgent' | 'Soon' | 'Routine', string> = {
  Urgent: 'bg-red-50 text-red-600',
  Soon: 'bg-yellow-50 text-yellow-600',
  Routine: 'bg-green-50 text-green-600',
};

  const Icon = aiTriageResult.urgency === 'Urgent'
    ? AlertTriangle
    : aiTriageResult.urgency === 'Soon'
    ? Clock
    : Check;

  return (
    <div className={`p-4 rounded-md ${urgencyStyles[aiTriageResult.urgency]}`}>
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5" />
        <h4 className="font-medium">{aiTriageResult.urgency} Referral</h4>
      </div>
      <div className="mt-2 text-sm">
        <p>Timeframe: {aiTriageResult.timeframe}</p>
        <ul className="mt-2 pl-5 list-disc">
          {aiTriageResult.reasoning.map((reason, index) => (
            <li key={index}>{reason}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TriageResult;
