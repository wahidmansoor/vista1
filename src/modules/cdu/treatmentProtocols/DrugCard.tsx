import React from 'react';
import type { Drug } from '@/types/protocol';
import { Card } from '@/components/ui/card';

interface DrugCardProps {
  drug: Drug;
}

const DrugCard: React.FC<DrugCardProps> = ({ drug }) => {
  const renderValue = (value: any): React.ReactNode => {
    if (!value) return null;
    
    if (Array.isArray(value)) {
      return (
        <ul className="list-disc list-inside space-y-1">
          {value.map((item, index) => (
            <li key={index}>
              {typeof item === 'string' ? (
                item
              ) : (
                <div>
                  {item.name && (
                    <div>
                      <strong>{item.name}</strong>
                      {item.dose && <span> — {item.dose}</span>}
                      {item.timing && <span> at {item.timing}</span>}
                      {item.route && <span> via {item.route}</span>}
                      {item.notes && <div className="ml-4 text-sm">{item.notes}</div>}
                    </div>
                  )}
                  {!item.name && <span>{JSON.stringify(item)}</span>}
                </div>
              )}
            </li>
          ))}
        </ul>
      );
    }

    return <span>{String(value)}</span>;
  };

  return (
    <Card className="p-4 mb-4 bg-gray-50 dark:bg-gray-800 hover:shadow-md transition-shadow">
      <div className="space-y-2">
        <h4 className="font-medium text-indigo-700 dark:text-indigo-300">
          {drug.name}
        </h4>
        
        {drug.dose && (
          <div className="text-sm">
            <span className="font-medium text-gray-600 dark:text-gray-400">Dose: </span>
            {renderValue(drug.dose)}
          </div>
        )}
        
        {drug.administration && (
          <div className="text-sm">
            <span className="font-medium text-gray-600 dark:text-gray-400">Route: </span>
            {renderValue(drug.administration)}
          </div>
        )}
        
        {drug.details?.schedule && (
          <div className="text-sm">
            <span className="font-medium text-gray-600 dark:text-gray-400">Schedule: </span>
            {renderValue(drug.details.schedule)}
          </div>
        )}
      </div>
    </Card>
  );
};

export default DrugCard;
