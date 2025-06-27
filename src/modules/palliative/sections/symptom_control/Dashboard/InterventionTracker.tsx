// InterventionTracker.tsx
// Track interventions and effectiveness
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Intervention {
  id: string;
  symptom: string;
  name: string;
  status: "active" | "completed" | "pending";
  effectiveness: number; // 1-5
  sideEffects?: string;
  adherence: number; // 0-100
  careNote?: string;
}

const mockInterventions: Intervention[] = [
  {
    id: "1",
    symptom: "Pain",
    name: "Morphine",
    status: "active",
    effectiveness: 4,
    adherence: 90,
    careNote: "Patient reports good relief, mild drowsiness",
  },
  {
    id: "2",
    symptom: "Nausea",
    name: "Ondansetron",
    status: "completed",
    effectiveness: 5,
    adherence: 100,
    careNote: "Nausea resolved",
  },
  {
    id: "3",
    symptom: "Fatigue",
    name: "Energy conservation",
    status: "pending",
    effectiveness: 0,
    adherence: 0,
    careNote: "Awaiting OT consult",
  },
];

const getStatusBadge = (status: string) => {
  if (status === "active") return <Badge variant="default">Active</Badge>;
  if (status === "pending") return <Badge variant="secondary">Pending</Badge>;
  return <Badge variant="outline">Completed</Badge>;
};

const InterventionTracker: React.FC = () => (
  <div className="space-y-4">
    {mockInterventions.map((intervention) => (
      <Card key={intervention.id} className="border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle className="text-base flex items-center gap-2">
            {intervention.name}
            {getStatusBadge(intervention.status)}
          </CardTitle>
          <span className="text-xs text-gray-400">Symptom: {intervention.symptom}</span>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-2">
            <span className="text-xs text-gray-500">Effectiveness:</span>
            <Progress value={intervention.effectiveness * 20} className="h-2 w-24" />
            <span className="text-xs text-gray-500">{intervention.effectiveness}/5</span>
          </div>
          <div className="flex items-center gap-4 mb-2">
            <span className="text-xs text-gray-500">Adherence:</span>
            <Progress value={intervention.adherence} className="h-2 w-24" />
            <span className="text-xs text-gray-500">{intervention.adherence}%</span>
          </div>
          {intervention.careNote && (
            <div className="text-xs text-blue-600 mb-1">{intervention.careNote}</div>
          )}
          {intervention.sideEffects && (
            <div className="text-xs text-red-600">Side effects: {intervention.sideEffects}</div>
          )}
        </CardContent>
      </Card>
    ))}
  </div>
);

export default InterventionTracker;
