// d:\Mansoor\tick-toc\src\modules\cdu\treatmentProtocols\tabs\AiSummaryTab.tsx
import React from 'react';
import { Protocol } from '@/types/protocol';
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

interface AiSummaryTabProps {
  protocol: Protocol;
}


export const AiSummaryTab: React.FC<AiSummaryTabProps> = ({ protocol }) => {
  // Fields: ai_notes, natural_language_prompt
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Insights & Notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* AI Generated Notes Section */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2">AI Generated Notes</h3>

          <div className="mb-4">
            <h4 className="font-medium text-sm text-muted-foreground">Recommendations</h4>
            {Array.isArray(protocol.ai_notes?.recommendations) && protocol.ai_notes.recommendations.length > 0 ? (
              <ul className="list-disc list-inside text-sm mt-1">
                {protocol.ai_notes.recommendations.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground italic">No recommendations listed.</p>
            )}
          </div>

          <div className="mb-4">
            <h4 className="font-medium text-sm text-muted-foreground">Warnings</h4>
            {Array.isArray(protocol.ai_notes?.warnings) && protocol.ai_notes.warnings.length > 0 ? (
              <ul className="list-disc list-inside text-sm mt-1">
                {protocol.ai_notes.warnings.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground italic">No warnings provided.</p>
            )}
          </div>
        </section>

        {/* Natural Language Prompt Section */}
        <section className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Natural Language Prompt (for AI)</h3>
          <p className="text-sm text-muted-foreground">
            {protocol.natural_language_prompt
              ? protocol.natural_language_prompt
              : <span className="italic text-muted-foreground">No prompt provided.</span>
            }
          </p>
        </section>
      </CardContent>
    </Card>
  );
};
