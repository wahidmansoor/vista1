import React from 'react';
import type { Protocol } from '@/types/protocol';

interface Props {
  protocols: Protocol[];
}

const CRITICAL_FIELDS = [
  'eligibility',
  'treatment',
  'tests',
  'dose_modifications',
  'precautions',
  'supportive_care'
] as const;

const CompletenessMatrix: React.FC<Props> = ({ protocols }) => {
  const calculateCompleteness = (protocol: Protocol) => {
    return CRITICAL_FIELDS.map(field => {
      const value = protocol[field as keyof Protocol];
      const isComplete = value && (
        Array.isArray(value) ? value.length > 0 :
        typeof value === 'object' ? Object.keys(value).length > 0 :
        Boolean(value)
      );
      return {
        field,
        isComplete,
        protocol: protocol.code
      };
    });
  };

  const matrix = protocols.flatMap(calculateCompleteness);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Protocol
            </th>
            {CRITICAL_FIELDS.map(field => (
              <th
                key={field}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {field.replace('_', ' ')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {protocols.map(protocol => (
            <tr key={protocol.code} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                {protocol.code}
              </td>
              {CRITICAL_FIELDS.map(field => {
                const value = protocol[field as keyof Protocol];
                const isComplete = value && (
                  Array.isArray(value) ? value.length > 0 :
                  typeof value === 'object' ? Object.keys(value).length > 0 :
                  Boolean(value)
                );
                return (
                  <td
                    key={field}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                  >
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${isComplete
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                    >
                      {isComplete ? 'Complete' : 'Missing'}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompletenessMatrix;
