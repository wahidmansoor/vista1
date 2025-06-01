import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import type { DoseModification, Protocol, DoseReductions } from '@/types/protocol';
import { AlertCircle } from 'lucide-react';

// Types
interface ReductionLevel {
  level: string;
  dose: string | number;
}

interface DoseModificationsTabProps {
  protocol: Protocol;
}

// Utility functions
const formatDoseValue = (dose: unknown): string => {
  if (typeof dose === 'number') return dose.toString();
  if (typeof dose === 'string') return dose;
  return String(dose || '-');
};

const formatReductionLevel = (level: string, dose: unknown): ReductionLevel => ({
  level,
  dose: formatDoseValue(dose)
});

// Extract protocol data
const useProtocolModifications = (protocol: Protocol) => {
  const modifications = protocol.dose_modifications || {
    hematological: [],
    nonHematological: [],
    renal: [],
    hepatic: []
  };

  const reductions = protocol.dose_reductions || { 
    levels: {}, 
    criteria: [] 
  };

  return {
    hematological: modifications.hematological,
    nonHematological: modifications.nonHematological,
    renal: modifications.renal,
    hepatic: modifications.hepatic,
    reductionLevels: reductions.levels,
    reductionCriteria: reductions.criteria,
    hasData: !!(
      modifications.hematological?.length ||
      modifications.nonHematological?.length ||
      modifications.renal?.length ||
      modifications.hepatic?.length ||
      Object.keys(reductions.levels || {}).length ||
      reductions.criteria?.length
    )
  };
};

interface ReductionLevelsSectionProps {
  levels: Record<string, string | number>;
}

const ReductionLevelsSection: React.FC<ReductionLevelsSectionProps> = ({ levels }) => (
  <div className="mt-8">
    <h3 className="text-lg font-medium mb-4">Dose Reduction Levels</h3>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Level</TableHead>
          <TableHead>Dose</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(levels).map(([level, dose], index) => {
          const { level: formattedLevel, dose: formattedDose } = formatReductionLevel(level, dose);
          return (
            <TableRow key={index}>
              <TableCell>{formattedLevel}</TableCell>
              <TableCell>{formattedDose}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  </div>
);

interface ReductionCriteriaSectionProps {
  criteria: string[];
}

const ReductionCriteriaSection: React.FC<ReductionCriteriaSectionProps> = ({ criteria }) => (
  <div className="mt-8">
    <h3 className="text-lg font-medium mb-2">Dose Reduction Criteria</h3>
    <ul className="space-y-2 list-disc pl-5">
      {criteria.map((criterion: string, index: number) => (
        <li key={index} className="text-gray-700 dark:text-gray-300">{criterion}</li>
      ))}
    </ul>
  </div>
);

const DoseModificationsTab: React.FC<DoseModificationsTabProps> = ({ protocol }) => {
  const {
    hematological,
    nonHematological,
    renal,
    hepatic,
    reductionLevels,
    reductionCriteria,
    hasData
  } = useProtocolModifications(protocol);

  const renderModificationSection = (title: string, items: string[] | undefined) => {
    const safeItems = Array.isArray(items) ? items.filter(Boolean) : [];
    if (safeItems.length === 0) return null;
    
    return (
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <ul className="space-y-2 list-disc pl-5">
          {safeItems.map((item: string, index: number) => (
            <li key={index} className="text-gray-700 dark:text-gray-300">
              {item}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dose Modifications</h2>
      
      {!hasData ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-2 text-amber-500">
              <AlertCircle className="h-5 w-5" />
              <p>No dose modification data available for this protocol.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {renderModificationSection('Hematological Modifications', hematological)}
          {renderModificationSection('Non-Hematological Modifications', nonHematological)}
          {renderModificationSection('Renal Modifications', renal)}
          {renderModificationSection('Hepatic Modifications', hepatic)}
          
          {Object.keys(reductionLevels).length > 0 && (
            <ReductionLevelsSection levels={reductionLevels} />
          )}

          {reductionCriteria.length > 0 && (
            <ReductionCriteriaSection criteria={reductionCriteria} />
          )}
        </>
      )}
    </div>
  );
};

export { DoseModificationsTab };
