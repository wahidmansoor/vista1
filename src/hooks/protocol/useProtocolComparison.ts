import { useMemo } from 'react';
import type { Protocol } from './types/protocol';

interface ProtocolDifference {
  field: string;
  type: 'added' | 'removed' | 'modified';
  path: string[];
  oldValue?: any;
  newValue?: any;
}

interface ComparisonResult {
  differences: ProtocolDifference[];
  summary: {
    total: number;
    added: number;
    removed: number;
    modified: number;
    criticalChanges: number;
  };
  criticalChanges: ProtocolDifference[];
}

const useProtocolComparison = (protocolA: Protocol | null, protocolB: Protocol | null): ComparisonResult => {
  return useMemo(() => {
    const differences: ProtocolDifference[] = [];
    
    if (!protocolA || !protocolB) {
      return {
        differences: [],
        summary: {
          total: 0,
          added: 0,
          removed: 0,
          modified: 0,
          criticalChanges: 0
        },
        criticalChanges: []
      };
    }

    // Helper function to deeply compare objects
    const compareObjects = (objA: any, objB: any, path: string[] = []): void => {
      const allKeys = new Set([...Object.keys(objA), ...Object.keys(objB)]);

      for (const key of allKeys) {
        const currentPath = [...path, key];
        const valueA = objA[key];
        const valueB = objB[key];

        // Skip internal fields
        if (['id', 'created_at', 'updated_at'].includes(key)) continue;

        if (!(key in objA)) {
          differences.push({
            field: key,
            type: 'added',
            path: currentPath,
            newValue: valueB
          });
        } else if (!(key in objB)) {
          differences.push({
            field: key,
            type: 'removed',
            path: currentPath,
            oldValue: valueA
          });
        } else if (typeof valueA !== typeof valueB) {
          differences.push({
            field: key,
            type: 'modified',
            path: currentPath,
            oldValue: valueA,
            newValue: valueB
          });
        } else if (typeof valueA === 'object' && valueA !== null) {
          if (Array.isArray(valueA) && Array.isArray(valueB)) {
            if (JSON.stringify(valueA) !== JSON.stringify(valueB)) {
              differences.push({
                field: key,
                type: 'modified',
                path: currentPath,
                oldValue: valueA,
                newValue: valueB
              });
            }
          } else {
            compareObjects(valueA, valueB, currentPath);
          }
        } else if (valueA !== valueB) {
          differences.push({
            field: key,
            type: 'modified',
            path: currentPath,
            oldValue: valueA,
            newValue: valueB
          });
        }
      }
    };

    // Compare the protocols
    compareObjects(protocolA, protocolB);

    // Calculate summary
    const summary = {
      total: differences.length,
      added: differences.filter(d => d.type === 'added').length,
      removed: differences.filter(d => d.type === 'removed').length,
      modified: differences.filter(d => d.type === 'modified').length,
      criticalChanges: 0
    };

    // Identify critical changes
    const criticalChanges = differences.filter(diff => {
      const pathString = diff.path.join('.');
      return (
        pathString.includes('precautions') ||
        pathString.includes('contraindications') ||
        pathString.includes('toxicity_monitoring') ||
        pathString.includes('warnings') ||
        pathString.includes('dose') ||
        (pathString.includes('drugs') && diff.type === 'removed')
      );
    });

    summary.criticalChanges = criticalChanges.length;

    return {
      differences,
      summary,
      criticalChanges
    };
  }, [protocolA, protocolB]);
};

export const getFieldLabel = (path: string[]): string => {
  const fieldMappings: Record<string, string> = {
    'tumour_group': 'Tumor Group',
    'treatment_intent': 'Treatment Intent',
    'precautions': 'Precautions',
    'contraindications': 'Contraindications',
    'toxicity_monitoring': 'Toxicity Monitoring',
    'treatment.drugs': 'Drugs',
    'dose': 'Dosage',
    'administration': 'Administration',
    'timing': 'Timing',
    'special_notes': 'Special Notes',
    'supportiveCare': 'Supportive Care'
  };

  const lastField = path[path.length - 1];
  return fieldMappings[lastField] || lastField;
};

export default useProtocolComparison;