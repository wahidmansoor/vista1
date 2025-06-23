import React from 'react';
import type { Protocol } from '@/types/protocol';

interface MedicationDebugPanelProps {
  protocol: Protocol;
}

/**
 * A debugging component that shows raw medication data from a protocol
 * Helps diagnose issues with pre_medications and post_medications
 */
const MedicationDebugPanel: React.FC<MedicationDebugPanelProps> = ({ protocol }) => {
  if (process.env.NODE_ENV !== 'development') {
    return null; // Only show in development
  }

  // Helper function to determine data type and structure
  const getDataTypeInfo = (data: any) => {
    if (data === undefined) return 'undefined';
    if (data === null) return 'null';
    
    if (Array.isArray(data)) {
      return `array[${data.length}]`;
    }
    
    if (typeof data === 'object' && data !== null) {
      if ('required' in data || 'optional' in data) {
        const reqCount = Array.isArray(data.required) ? data.required.length : '?';
        const optCount = Array.isArray(data.optional) ? data.optional.length : '?';
        return `medications object (req:${reqCount}, opt:${optCount})`;
      }
      return `object with keys: ${Object.keys(data).join(', ')}`;
    }
    
    return typeof data;
  };

  const renderSection = (title: string, data: any) => {
    if (!data) {
      return (
        <div className="mb-4">
          <h4 className="text-yellow-600 font-medium text-sm">{title}</h4>
          <div className="text-xs text-gray-500">
            <span className="font-bold">Data type:</span> {getDataTypeInfo(data)}
          </div>
        </div>
      );
    }

    const hasRequired = data.required && Array.isArray(data.required) && data.required.length > 0;
    const hasOptional = data.optional && Array.isArray(data.optional) && data.optional.length > 0;
    const isWellFormed = hasRequired || hasOptional;

    // Data exists but isn't in the expected format
    if (!isWellFormed) {
      return (
        <div className="mb-4">
          <h4 className="text-yellow-600 font-medium text-sm">{title}</h4>
          <div className="text-xs">
            <div><span className="font-bold">Data type:</span> {getDataTypeInfo(data)}</div>
            <div className="mt-1 bg-gray-100 dark:bg-gray-700 p-1.5 rounded overflow-auto max-h-32">
              {typeof data === 'string' ? data : JSON.stringify(data, null, 2)}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="mb-4">
        <h4 className="text-green-600 font-medium text-sm">{title}</h4>
        <div className="text-xs">
          <div><span className="font-bold">Data type:</span> {getDataTypeInfo(data)}</div>
        </div>

        {hasRequired && (
          <div className="mb-1 mt-1.5">
            <div className="text-xs text-gray-600 font-medium">Required ({data.required.length}):</div>
            <ul className="list-disc list-inside text-xs pl-2">
              {data.required.map((item: any, idx: number) => (
                <li key={idx} className="text-gray-500">
                  {typeof item === 'string' ? (
                    item
                  ) : typeof item === 'object' && item !== null ? (
                    <span className="text-gray-700 dark:text-gray-300">
                      {item.name || 'unnamed'}
                      {item.dose && <span className="text-gray-500"> — {item.dose}</span>}
                      {item.route && <span className="text-gray-500"> ({item.route})</span>}
                      {item.timing && <span className="text-gray-500"> @ {item.timing}</span>}
                    </span>
                  ) : (
                    String(item)
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {hasOptional && (
          <div className="mt-1.5">
            <div className="text-xs text-gray-600 font-medium">Optional ({data.optional.length}):</div>
            <ul className="list-disc list-inside text-xs pl-2">
              {data.optional.map((item: any, idx: number) => (
                <li key={idx} className="text-gray-500">
                  {typeof item === 'string' ? (
                    item
                  ) : typeof item === 'object' && item !== null ? (
                    <span className="text-gray-700 dark:text-gray-300">
                      {item.name || 'unnamed'}
                      {item.dose && <span className="text-gray-500"> — {item.dose}</span>}
                      {item.route && <span className="text-gray-500"> ({item.route})</span>}
                      {item.timing && <span className="text-gray-500"> @ {item.timing}</span>}
                    </span>
                  ) : (
                    String(item)
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 mt-2 rounded-md text-xs">
      <h3 className="font-bold text-sm text-indigo-600 dark:text-indigo-300 mb-2">
        Medication Data Debug
      </h3>

      {renderSection("Pre-Medications", protocol.pre_medications)}
      {renderSection("Post-Medications", protocol.post_medications)}

      <div className="text-xs text-gray-500 mt-4">
        Protocol ID: {protocol.id}
      </div>
    </div>
  );
};

export default MedicationDebugPanel;
