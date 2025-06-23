import React from 'react';
import type { Protocol } from '../../../types/protocol';

interface EligibilityTabProps {
  protocol: Protocol;
}

export default function EligibilityTab({ protocol }: any) {
  const criteria = protocol?.eligibility?.inclusion_criteria || [];

  return (
    <div className="space-y-2 text-sm">
      <h3 className="font-semibold text-base mb-2">Inclusion Criteria</h3>
      <ul className="list-disc list-inside">
        {criteria.length > 0 ? (
          criteria.map((val: string, idx: number) => (
            <li key={idx}>{val}</li>
          ))
        ) : (
          <li>No inclusion criteria specified.</li>
        )}
      </ul>
    </div>
  );
}
