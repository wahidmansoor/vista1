// d:\Mansoor\tick-toc\src\modules\cdu\treatmentProtocols\tabs\SupportiveCareTab.tsx
import React from 'react';
import { Protocol } from '@/types/protocol';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { safeJsonParse } from '../../../types/protocol';

interface SupportiveCareTabProps {
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

function safeParse(data: any) {
  if (typeof data === 'string') {
    try { return safeJsonParse(data, data); } catch { return data; }
  }
  return data;
}

export const SupportiveCareTab: React.FC<SupportiveCareTabProps> = ({ protocol }) => {
  // Fields: supportive_care, supportive_meds, pre_medications, post_medications, precautions
  return (
    <Card>
      <CardHeader>
        <CardTitle>Supportive Care & Medications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-md mb-1">General Supportive Care</h4>
          <DataRenderer data={safeParse(protocol.supportive_care)} title="Supportive Care" />
        </div>
        <div>
          <h4 className="font-semibold text-md mb-1">Supportive Medications</h4>
          <DataRenderer data={safeParse(protocol.supportive_meds)} title="Supportive Meds" />
        </div>
        <div>
          <h4 className="font-semibold text-md mb-1">Pre-Medications</h4>
          <DataRenderer data={safeParse(protocol.pre_medications)} title="Pre-Medications" />
        </div>
        <div>
          <h4 className="font-semibold text-md mb-1">Post-Medications</h4>
          <DataRenderer data={safeParse(protocol.post_medications)} title="Post-Medications" />
        </div>
        <div>
          <h4 className="font-semibold text-md mb-1">Precautions</h4>
          <DataRenderer data={safeParse(protocol.precautions)} title="Precautions" />
        </div>
      </CardContent>
    </Card>
  );
};
