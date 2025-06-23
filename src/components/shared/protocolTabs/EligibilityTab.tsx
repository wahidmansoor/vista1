// d:\Mansoor\tick-toc\src\modules\cdu\treatmentProtocols\tabs\EligibilityTab.tsx
import React from 'react';
import { Protocol } from '@/types/protocol';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { safeJsonParse, Eligibility } from '../../../types/protocol';

interface EligibilityTabProps {
  protocol: Protocol;
}

const renderCriteria = (criteria: string[] | undefined, title: string) => {
  if (!criteria || criteria.length === 0) {
    return <p className="text-sm text-muted-foreground"><em>No {title.toLowerCase()} listed.</em></p>;
  }
  return (
    <ul className="list-disc list-inside space-y-1 pl-4">
      {criteria.map((item, index) => (
        <li key={index} className="text-sm">{item}</li>
      ))}
    </ul>
  );
};

export const EligibilityTab: React.FC<EligibilityTabProps> = ({ protocol }) => {
  const eligibility = protocol.eligibility;
  let inclusion: string[] | undefined;
  let exclusion: string[] | undefined;
  let parseError = false;
  if (typeof eligibility === 'string') {
    try {
      const parsedEligibility = safeJsonParse<Eligibility>(eligibility, {});
      inclusion = parsedEligibility.inclusion_criteria;
      exclusion = parsedEligibility.exclusion_criteria;
    } catch (e) {
      console.error("Failed to parse eligibility string:", e);
      parseError = true;
    }
  } else if (typeof eligibility === 'object' && eligibility !== null) {
    inclusion = (eligibility as any).inclusion_criteria;
    exclusion = (eligibility as any).exclusion_criteria;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Eligibility Criteria</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {parseError && (
          <p className="text-sm text-red-500"><em>Could not parse eligibility data. Raw data: {String(protocol.eligibility)}</em></p>
        )}
        <div>
          <h4 className="font-semibold text-md mb-1">Inclusion Criteria</h4>
          {renderCriteria(inclusion, "Inclusion Criteria")}
        </div>
        <div>
          <h4 className="font-semibold text-md mb-1">Exclusion Criteria</h4>
          {renderCriteria(exclusion, "Exclusion Criteria")}
        </div>
        {!inclusion && !exclusion && !parseError && (
          <p className="text-sm text-muted-foreground"><em>No eligibility data available.</em></p>
        )}
      </CardContent>
    </Card>
  );
};
