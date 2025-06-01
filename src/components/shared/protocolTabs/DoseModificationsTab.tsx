// d:\Mansoor\tick-toc\src\modules\cdu\treatmentProtocols\tabs\DoseModificationsTab.tsx
import React from 'react';
import { Protocol } from '@/types/protocol';
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

interface DoseModificationsTabProps {
  protocol: Protocol;
}

// DoseModificationsTab.tsx - refactored for structured UI

export const DoseModificationsTab: React.FC<DoseModificationsTabProps> = ({ protocol }) => {
  const dm = (protocol.dose_modifications ?? {}) as Record<string, any>;
  const dr = (protocol.dose_reductions ?? {}) as Record<string, any>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dose Modifications & Reductions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* Dose Modifications */}
        <section className="mb-4">
          <h3 className="font-semibold mb-2">Hematological</h3>
          {Array.isArray(dm?.hematological) && dm.hematological.length > 0 ? (
            <ul className="list-disc list-inside text-sm">
              {dm.hematological.map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground italic">No hematological modifications listed.</p>
          )}
        </section>
        <section className="mb-4">
          <h3 className="font-semibold mb-2">Non-Hematological</h3>
          {Array.isArray(dm?.nonhematological) && dm.nonhematological.length > 0 ? (
            <ul className="list-disc list-inside text-sm">
              {dm.nonhematological.map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground italic">No non-hematological modifications listed.</p>
          )}
        </section>
        <section className="mb-4">
          <h3 className="font-semibold mb-2">Renal</h3>
          {Array.isArray(dm?.renal) && dm.renal.length > 0 ? (
            <ul className="list-disc list-inside text-sm">
              {dm.renal.map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground italic">No renal modifications listed.</p>
          )}
        </section>
        <section className="mb-4">
          <h3 className="font-semibold mb-2">Hepatic</h3>
          {Array.isArray(dm?.hepatic) && dm.hepatic.length > 0 ? (
            <ul className="list-disc list-inside text-sm">
              {dm.hepatic.map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground italic">No hepatic modifications listed.</p>
          )}
        </section>

        {/* Dose Reductions */}
        <section className="mb-4">
          <h3 className="font-semibold mb-2">Dose Reductions - Criteria</h3>
          {Array.isArray(dr?.criteria) && dr.criteria.length > 0 ? (
            <ul className="list-disc list-inside text-sm">
              {dr.criteria.map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground italic">No criteria listed.</p>
          )}
        </section>
        <section className="mb-4">
          <h3 className="font-semibold mb-2">Dose Reductions - Levels</h3>
          {dr?.levels && typeof dr.levels === 'object' && Object.keys(dr.levels).length > 0 ? (
            <div className="space-y-2 text-sm">
              {Object.entries(dr.levels).map(([key, value], idx) => (
                <div key={idx}>
                  <strong>{key}:</strong> {String(value)}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground italic">No level-based dose reductions listed.</p>
          )}
        </section>
      </CardContent>
    </Card>
  );
};
