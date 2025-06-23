import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Printer, AlertTriangle, Download } from "lucide-react";

interface DischargeDetails {
  diagnosis: string;
  hospitalCourse: string;
  medications: string;
  followUp: string;
  redFlags: string;
  consultantNotes: string;
  contactInfo: string;
  neutrophilCount: number;
  nextAppointmentDate: string;
}

const checklistItems = [
  "Afebrile > 24 hrs",
  "Oral intake adequate",
  "Pain controlled",
  "Labs stable (Hb, WBC, Ca)",
  "Performance status acceptable (ECOG ≤ 2)",
  "Caregiver plan ready",
];

const DischargeGuidelines: React.FC = () => {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [details, setDetails] = useState<DischargeDetails>({
    diagnosis: "",
    hospitalCourse: "",
    medications: "",
    followUp: "",
    redFlags: "",
    consultantNotes: "",
    contactInfo: "",
    neutrophilCount: 0,
    nextAppointmentDate: "",
  });

  const handleCheck = (item: string, value: boolean) =>
    setChecked((prev) => ({ ...prev, [item]: value }));

  const isComplete = checklistItems.every((item) => checked[item]);
  const isNeutropenic = details.neutrophilCount < 1.5;

  const followUpDelayed = () => {
    const date = new Date(details.nextAppointmentDate);
    const now = new Date();
    const diffDays = (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays > 7;
  };

  const generateSummary = () => {
    return [
      `📋 Oncology Discharge Summary`,
      `Date: ${new Date().toLocaleDateString()}`,
      ``,
      `✅ Checklist:`,
      ...checklistItems.map((i) => `- [${checked[i] ? "x" : " "}] ${i}`),
      ``,
      `📝 Clinical Details:`,
      `Diagnosis: ${details.diagnosis}`,
      `Hospital Course: ${details.hospitalCourse}`,
      `Medications: ${details.medications}`,
      `Follow-up: ${details.followUp}`,
      `Red Flags: ${details.redFlags}`,
      `Consultant Notes: ${details.consultantNotes}`,
      `Contact Info: ${details.contactInfo}`,
    ].join("\n");
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-blue-900">Oncology Discharge Assistant</h1>

      {/* Step 1: Checklist */}
      <Card className="shadow border-blue-200">
        <CardHeader className="bg-blue-50 border-b">
          <CardTitle className="text-blue-800 text-lg font-semibold">
            Step 1: Discharge Eligibility
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
          {checklistItems.map((item) => (
            <div key={item} className="flex items-center gap-2">
              <Checkbox
                checked={!!checked[item]}
                onCheckedChange={(v) => handleCheck(item, v as boolean)}
              />
              <span>{item}</span>
            </div>
          ))}
          <div className="col-span-full">
            <Badge variant={isComplete ? "default" : "destructive"}>
              {isComplete ? "✅ Discharge Ready" : "❗ Incomplete Checklist"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Clinical Info */}
      <Card className="shadow border-blue-200">
        <CardHeader className="bg-blue-50 border-b">
          <CardTitle className="text-blue-800 text-lg font-semibold">
            Step 2: Clinical Discharge Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-4">
          {isNeutropenic && (
            <Badge variant="destructive" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Neutropenic Alert
            </Badge>
          )}
          {followUpDelayed() && (
            <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 border border-yellow-300 p-2 rounded">
              <AlertTriangle className="w-4 h-4" />
              <span>Follow-up is more than 7 days</span>
            </div>
          )}

          {Object.entries(details).map(([key, value]) => {
            if (key === "neutrophilCount" || key === "nextAppointmentDate") return null;
            return (
              <div key={key} className="space-y-1">
                <label className="block font-medium capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </label>
                <Textarea
                  rows={3}
                  value={value}
                  onChange={(e) =>
                    setDetails((prev) => ({
                      ...prev,
                      [key]: e.target.value,
                    }))
                  }
                  className="w-full"
                />
              </div>
            );
          })}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium" htmlFor="neutrophil-count">Neutrophil Count</label>
              <input
                id="neutrophil-count"
                type="number"
                value={details.neutrophilCount}
                onChange={(e) =>
                  setDetails((prev) => ({
                    ...prev,
                    neutrophilCount: parseFloat(e.target.value),
                  }))
                }
                className="w-full mt-1 p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-medium" htmlFor="next-appointment">Next Appointment</label>
              <input
                id="next-appointment"
                type="date"
                value={details.nextAppointmentDate}
                onChange={(e) =>
                  setDetails((prev) => ({
                    ...prev,
                    nextAppointmentDate: e.target.value,
                  }))
                }
                className="w-full mt-1 p-2 border rounded"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 3: Summary */}
      <Card className="shadow border-blue-200">
        <CardHeader className="bg-blue-50 border-b">
          <CardTitle className="text-blue-800 text-lg font-semibold">Step 3: Export Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-4">
          <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded border">
            {generateSummary()}
          </pre>
          <div className="flex gap-2">
            <Button className="flex gap-2 items-center" onClick={() => window.print()}>
              <Printer className="w-4 h-4" />
              Print
            </Button>
            <Button variant="outline" className="flex gap-2 items-center">
              <Download className="w-4 h-4" />
              Export PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DischargeGuidelines;
