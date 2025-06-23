import React from 'react';
import { Info } from 'lucide-react';

interface CultureBlockProps {
  culture: string;
  considerations: string[];
  recommendations: string[];
}

export const CultureBlock: React.FC<CultureBlockProps> = ({
  culture,
  considerations,
  recommendations,
}) => {
  return (
    <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
      <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">{culture}</h4>
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h5 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
            Key Considerations
          </h5>
          <ul className="space-y-2">
            {considerations.map((item, i) => (
              <li key={i} className="text-sm text-blue-700 dark:text-blue-300 flex items-start gap-2">
                <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h5 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
            Recommendations
          </h5>
          <ul className="space-y-2">
            {recommendations.map((item, i) => (
              <li key={i} className="text-sm text-blue-700 dark:text-blue-300 flex items-start gap-2">
                <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};