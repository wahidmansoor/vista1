// SymptomOverview.tsx
// Dashboard grid of active symptom cards
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle } from "lucide-react";

// Example types (replace with real types from your types/symptoms.ts)
interface SymptomCardProps {
  id: string;
  name: string;
  severity: number; // 0-10
  severityLabel: string;
  isCritical: boolean;
  lastAssessment: string;
  trending: "improving" | "stable" | "worsening";
}

// Mock data for demonstration
const mockSymptoms: SymptomCardProps[] = [
  {
    id: "1",
    name: "Pain",
    severity: 8,
    severityLabel: "Severe",
    isCritical: true,
    lastAssessment: "2025-06-26T10:00:00Z",
    trending: "worsening",
  },
  {
    id: "2",
    name: "Nausea",
    severity: 4,
    severityLabel: "Moderate",
    isCritical: false,
    lastAssessment: "2025-06-26T09:30:00Z",
    trending: "stable",
  },
  {
    id: "3",
    name: "Fatigue",
    severity: 2,
    severityLabel: "Mild",
    isCritical: false,
    lastAssessment: "2025-06-25T18:00:00Z",
    trending: "improving",
  },
];

const getSeverityColor = (severity: number) => {
  if (severity >= 7) return "bg-red-500";
  if (severity >= 4) return "bg-yellow-500";
  return "bg-green-500";
};

const SymptomOverview: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {mockSymptoms.map((symptom) => (
      <Card key={symptom.id} className="relative border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle className="text-lg flex items-center gap-2">
            {symptom.name}
            {symptom.isCritical && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" /> Critical
              </Badge>
            )}
          </CardTitle>
          <span
            className={`px-2 py-1 rounded text-xs font-semibold ${getSeverityColor(
              symptom.severity
            )} text-white`}
          >
            {symptom.severityLabel}
          </span>
        </CardHeader>
        <CardContent>
          <div className="mb-2">
            <Progress value={symptom.severity * 10} className="h-2" />
            <div className="flex justify-between text-xs mt-1">
              <span>Severity: {symptom.severity}/10</span>
              <span className="capitalize">{symptom.trending}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              Last assessed:{" "}
              {new Date(symptom.lastAssessment).toLocaleString()}
            </span>
            <button className="text-blue-600 hover:underline">Update</button>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default SymptomOverview;
