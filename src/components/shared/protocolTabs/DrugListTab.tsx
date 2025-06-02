// d:/Mansoor/tick-toc/src/modules/cdu/treatmentProtocols/tabs/DrugListTab.tsx
import React from 'react';
import { Protocol, Drug } from '@/types/protocol'; // Import Drug type
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from 'lucide-react';

interface DrugListTabProps {
  protocol: Protocol;
}

// Helper to render potentially complex data
const DataRenderer: React.FC<{ data: any; title: string }> = ({ data, title }) => {
  if (data === undefined || data === null || (Array.isArray(data) && data.length === 0) || (typeof data === 'object' && Object.keys(data).length === 0 && !Array.isArray(data)) || data === '') {
    return <p className="text-sm text-muted-foreground"><em>No {title.toLowerCase()} data listed.</em></p>;
  }
  if (Array.isArray(data)) {
    return data.length > 0 ? (
      <ul className="list-disc pl-5 space-y-1">
        {data.map((item, idx) => (
          <li key={idx} className="text-sm">{typeof item === 'string' ? item : JSON.stringify(item)}</li>
        ))}
      </ul>
    ) : (
      <div className="text-muted-foreground italic">No {title.toLowerCase()} data provided.</div>
    );
  }
  if (typeof data === 'object') {
    return (
      <div className="space-y-1">
        {Object.entries(data).length > 0 ? (
          Object.entries(data).map(([key, value]) => (
            <div key={key} className="mb-2">
              <span className="font-semibold text-sm">{key}:</span>{" "}
              {Array.isArray(value) ? (
                value.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {value.map((v, i) => (
                      <li key={i} className="text-sm">{typeof v === 'string' ? v : JSON.stringify(v)}</li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-muted-foreground italic">No data provided.</span>
                )
              ) : typeof value === 'object' && value !== null ? (
                <span className="text-muted-foreground italic">See details</span>
              ) : value ? (
                <span className="text-sm">{String(value)}</span>
              ) : (
                <span className="text-muted-foreground italic">No data provided.</span>
              )}
            </div>
          ))
        ) : (
          <div className="text-muted-foreground italic">No {title.toLowerCase()} data provided.</div>
        )}
      </div>
    );
  }
  return <p className="text-sm">{String(data)}</p>;
};

export const DrugListTab: React.FC<DrugListTabProps> = ({ protocol }) => {
  // Fields: treatment (especially treatment.drugs), drug_class, administration_notes, pharmacokinetics
  
  let drugs: Drug[] = [];
  if (protocol.treatment && typeof protocol.treatment === 'object' && 'drugs' in protocol.treatment && Array.isArray(protocol.treatment.drugs)) {
    drugs = protocol.treatment.drugs;
  } else if (Array.isArray(protocol.treatment)) { // Fallback if treatment itself is an array of drugs (older format?)
    drugs = protocol.treatment;
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Drug Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-md mb-1">Treatment Drugs</h4>
          {drugs.length > 0 ? (
            <ul className="list-disc list-inside space-y-1 pl-4">
              {drugs.map((drug: Drug, index: number) => (
                <li key={index} className="text-sm">
                  <strong>{drug.name || 'Unnamed Drug'}</strong>
                  {drug.dose && `: ${drug.dose}`}
                  {drug.route && ` (${drug.route})`}
                  {drug.timing && ` - Timing: ${drug.timing}`}
                  {drug.administration && ` - Admin: ${drug.administration}`}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground"><em>No drugs listed in treatment.</em></p>
          )}
        </div>
        <div>
          <h4 className="font-semibold text-md mb-1">Drug Class</h4>
          <DataRenderer data={protocol.drug_class} title="Drug Class" />
        </div>
        <div>
          <h4 className="font-semibold text-md mb-1">Administration Notes</h4>
          <DataRenderer data={protocol.administration_notes} title="Administration Notes" />
        </div>
        <div>
          <h4 className="font-semibold text-md mb-1">Pharmacokinetics</h4>
          <DataRenderer data={protocol.pharmacokinetics} title="Pharmacokinetics" />
        </div>
        {(!protocol.treatment || !protocol.drug_class || !protocol.administration_notes || !protocol.pharmacokinetics) && (
           <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 rounded-md flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-500 dark:text-yellow-400 mr-2 flex-shrink-0" />
            <p className="text-xs text-yellow-700 dark:text-yellow-300">Some drug information fields might be missing. Ensure the protocol data is complete.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
