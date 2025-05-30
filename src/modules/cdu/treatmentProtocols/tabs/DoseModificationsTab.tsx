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
import type { DoseModification, Protocol } from '@/types/protocol';
import { AlertCircle } from 'lucide-react';

interface DoseModificationsTabProps {
  protocol: Protocol;
}

const DoseModificationsTab: React.FC<DoseModificationsTabProps> = ({ protocol }) => {
  const doseModifications = protocol.dose_modifications || {};
  const hasDoseData = Object.keys(doseModifications).length > 0;

  // Helper function to render modification sections
  const renderModificationSection = (title: string, items: string[] | undefined) => {
    if (!items || items.length === 0) return null;
    
    return (
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <ul className="space-y-2 list-disc pl-5">
          {items.map((item, index) => (
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
          {renderModificationSection('Hematological Modifications', doseModifications.hematological)}
          {renderModificationSection('Non-Hematological Modifications', doseModifications.nonHematological)}
          {renderModificationSection('Renal Modifications', doseModifications.renal)}
          {renderModificationSection('Hepatic Modifications', doseModifications.hepatic)}
          
          {/* Render dose reduction levels if available */}
          {protocol.dose_reductions?.levels && (
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
                  {Object.entries(protocol.dose_reductions.levels).map(([level, dose]) => (
                    <TableRow key={level}>
                      <TableCell className="font-medium">{level}</TableCell>
                      <TableCell>{dose}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Render dose reduction criteria if available */}
          {protocol.dose_reductions?.criteria && (
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-2">Dose Reduction Criteria</h3>
              <ul className="space-y-2 list-disc pl-5">
                {protocol.dose_reductions.criteria.map((criterion, index) => (
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
