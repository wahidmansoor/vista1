// SymptomTimeline.tsx
// Timeline view of symptom progression
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface TimelineEvent {
  id: string;
  symptom: string;
  date: string;
  severity: number;
  note?: string;
}

const mockTimeline: TimelineEvent[] = [
  { id: "1", symptom: "Pain", date: "2025-06-24T09:00:00Z", severity: 6, note: "Started morphine" },
  { id: "2", symptom: "Pain", date: "2025-06-25T09:00:00Z", severity: 7, note: "Dose increased" },
  { id: "3", symptom: "Pain", date: "2025-06-26T10:00:00Z", severity: 8, note: "Breakthrough pain" },
  { id: "4", symptom: "Nausea", date: "2025-06-25T09:30:00Z", severity: 3 },
  { id: "5", symptom: "Nausea", date: "2025-06-26T09:30:00Z", severity: 4, note: "New antiemetic" },
];

const SymptomTimeline: React.FC = () => (
  <div className="space-y-4">
    {mockTimeline.map((event) => (
      <Card key={event.id} className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            {event.symptom}
            <span className="text-xs text-gray-400">{new Date(event.date).toLocaleString()}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Progress value={event.severity * 10} className="h-2 w-32" />
            <span className="text-xs text-gray-500">Severity: {event.severity}/10</span>
            {event.note && <span className="ml-4 text-xs text-blue-600">{event.note}</span>}
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default SymptomTimeline;
