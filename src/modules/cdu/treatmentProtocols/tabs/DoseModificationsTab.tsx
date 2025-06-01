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
import type { DoseModification, Protocol, DoseReductions } from '@/types/protocol'; // Assuming Protocol is the correct type for protocol
import { AlertCircle } from 'lucide-react';

interface DoseModificationsTabProps {
  protocol: Protocol; // Changed TreatmentProtocol to Protocol
}

const DoseModificationsTab: React.FC<DoseModificationsTabProps> = ({ protocol }) => {
  // Ensure protocol.dose_modifications exists and is an object, then safely access its properties
  const doseModifications: DoseModification = protocol.dose_modifications ?? {
    hematological: [],
    nonHematological: [],
    renal: [],
    hepatic: []
  };
  const hematological = doseModifications.hematological;
  const nonHematological = doseModifications.nonHematological;
  const renal = doseModifications.renal;
  const hepatic = doseModifications.hepatic;
  
  // Ensure protocol.dose_reductions exists and is an object, then safely access its properties
  const doseReductions: DoseReductions = protocol.dose_reductions ?? { levels: {}, criteria: [] };
  const reductionLevels = doseReductions.levels ?? {};
  const reductionCriteria = doseReductions.criteria ?? [];

  const renderModificationSection = (title: string, items: string[] | undefined) => {
    const safeItems = items ?? [];
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

  const hasDoseData = 
    hematological.length > 0 ||
    nonHematological.length > 0 ||
    renal.length > 0 ||
    hepatic.length > 0 ||
    Object.keys(reductionLevels).length > 0 ||
    reductionCriteria.length > 0;

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dose Modifications</h2>
      
      {!hasDoseData ? (
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
                  {Object.entries(reductionLevels as Record<string, string | number>).map(([level, dose], index) => {
                    const safeLevel = String(level);
                    const safeDose = String(dose);
                    return (
                      <TableRow key={index}>
                        <TableCell>{safeLevel}</TableCell>
                        <TableCell>{safeDose}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {reductionCriteria.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-2">Dose Reduction Criteria</h3>
              <ul className="space-y-2 list-disc pl-5">
                {reductionCriteria.map((criterion: string, index: number) => (
                  <li key={index} className="text-gray-700 dark:text-gray-300">{criterion}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export { DoseModificationsTab };
