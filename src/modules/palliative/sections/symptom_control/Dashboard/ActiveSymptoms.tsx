// ActiveSymptoms.tsx
// Real-time symptom severity tracking
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

interface ActiveSymptom {
  id: string;
  name: string;
  severity: number;
  trending: "improving" | "stable" | "worsening";
  lastAssessment: string;
  interventionStatus: "active" | "pending" | "completed";
}

const mockActiveSymptoms: ActiveSymptom[] = [
  {
    id: "1",
    name: "Pain",
    severity: 8,
    trending: "worsening",
    lastAssessment: "2025-06-26T10:00:00Z",
    interventionStatus: "active",
  },
  {
    id: "2",
    name: "Nausea",
    severity: 4,
    trending: "stable",
    lastAssessment: "2025-06-26T09:30:00Z",
    interventionStatus: "pending",
  },
  {
    id: "3",
    name: "Fatigue",
    severity: 2,
    trending: "improving",
    lastAssessment: "2025-06-25T18:00:00Z",
    interventionStatus: "completed",
  },
];

const getTrendIcon = (trend: string) => {
  if (trend === "improving")
    return <ArrowDown className="w-4 h-4 text-green-600" aria-label="Improving" />;
  if (trend === "worsening")
    return <ArrowUp className="w-4 h-4 text-red-600" aria-label="Worsening" />;
  return <Minus className="w-4 h-4 text-gray-400" aria-label="Stable" />;
};

const getStatusBadge = (status: string) => {
  if (status === "active") return <Badge variant="default">Active</Badge>;
  if (status === "pending") return <Badge variant="secondary">Pending</Badge>;
  return <Badge variant="outline">Completed</Badge>;
};

const ActiveSymptoms: React.FC = () => (
  <div className="space-y-4">
    {mockActiveSymptoms.map((symptom) => (
      <div
        key={symptom.id}
        className="flex items-center gap-4 p-4 border rounded shadow-sm bg-white"
      >
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-base">{symptom.name}</span>
            {getStatusBadge(symptom.interventionStatus)}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Progress value={symptom.severity * 10} className="h-2 w-32" />
            <span className="text-xs text-gray-500">
              {symptom.severity}/10
            </span>
            {getTrendIcon(symptom.trending)}
            <span className="text-xs capitalize text-gray-400">
              {symptom.trending}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs text-gray-500">
            Last:{" "}
            {new Date(symptom.lastAssessment).toLocaleTimeString()}
          </span>
          <button className="text-blue-600 text-xs hover:underline">
            Update Severity
          </button>
        </div>
      </div>
    ))}
  </div>
);

export default ActiveSymptoms;
