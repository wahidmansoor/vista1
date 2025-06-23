import React from 'react';

interface ReferralGuideline {
  condition: string;
  urgency: string;
  criteria: string[];
  workup: string[];
}

interface Props {
  guideline: ReferralGuideline;
}

export default function ReferralCard({ guideline }: Props) {
  console.log("ReferralCard guideline prop:", guideline); // ADDED
  return (
    <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-medium text-gray-900">{guideline.condition}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${
          guideline.urgency.includes('Urgent') 
            ? 'bg-red-100 text-red-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {guideline.urgency}
        </span>
      </div>
      
      <div className="space-y-3 text-sm">
        <div>
          <span className="text-gray-500">Referral Criteria:</span>
          <ul className="mt-1 space-y-1">
            {guideline.criteria.map((criterion, index) => (
              <li key={index} className="text-gray-900 flex items-start">
                <span className="mr-2">•</span>
                {criterion}
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <span className="text-gray-500">Required Workup:</span>
          <ul className="mt-1 space-y-1">
            {guideline.workup.map((item, index) => (
              <li key={index} className="text-gray-900 flex items-start">
                <span className="mr-2">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
