// d:\Mansoor\tick-toc\src\modules\cdu\treatmentProtocols\tabs\DoseModificationsTab.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Shield } from 'lucide-react';

export interface DoseAdjustmentType {
  renal?: string[];
  hepatic?: string[];
  hematological?: string[];
  other?: string[];
}

export interface DoseModificationsTabProps {
  dose_modifications?: DoseAdjustmentType;
}

// DoseModificationsTab.tsx - refactored for structured UI

const DoseModificationsTab: React.FC<DoseModificationsTabProps> = ({ dose_modifications }) => {
  // Ensure dose_modifications itself is an object, then safely access its properties
  const modifications = dose_modifications ?? {};
  const renal: string[] = Array.isArray(modifications.renal) ? modifications.renal : [];
  const hepatic: string[] = Array.isArray(modifications.hepatic) ? modifications.hepatic : [];
  const hematological: string[] = Array.isArray(modifications.hematological) ? modifications.hematological : [];
  const other: string[] = Array.isArray(modifications.other) ? modifications.other : [];

  const hasAnyData = renal.length > 0 || hepatic.length > 0 || hematological.length > 0 || other.length > 0;

  const renderSection = (title: string, data: string[]) => {
    if (!Array.isArray(data) || data.length === 0) return null;
    return (
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <Card>
          <CardContent className="p-4">
            <ul className="list-disc pl-5 space-y-1">
              {data.map((item: string, index: number) => (
                <li key={index} className="text-gray-700 dark:text-gray-300">{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center space-x-3 mb-6">
        <Shield className="h-6 w-6 text-red-500" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dose Modifications</h2>
      </div>

      {!hasAnyData ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-2 text-amber-500">
              <AlertTriangle className="h-5 w-5" />
              <p>No dose adjustment information available for this protocol.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {renderSection('Renal Impairment', renal)}
          {renderSection('Hepatic Impairment', hepatic)}
          {renderSection('Hematological Toxicity', hematological)}
          {renderSection('Other Considerations', other)}
        </>
      )}
    </div>
  );
};

export default DoseModificationsTab;
