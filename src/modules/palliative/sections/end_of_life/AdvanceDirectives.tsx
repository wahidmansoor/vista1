import React from "react";
import { usePalliativeCare } from "../../context/PalliativeContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { FilePlus, Download, CheckCircle, Clock, XCircle } from "lucide-react";
import type { AdvanceDirective } from "../../context/PalliativeContext";

const directiveTypes = ['DNR', 'LivingWill', 'PowerOfAttorney', 'Other'] as const;

const statusColors = {
  completed: "text-green-600",
  pending: "text-amber-600",
  notStarted: "text-gray-600"
};

const statusIcons = {
  completed: CheckCircle,
  pending: Clock,
  notStarted: XCircle
};

const AdvanceDirectives = () => {
  const { state, updateAdvanceDirective } = usePalliativeCare();
  const [newDirective, setNewDirective] = React.useState<Omit<AdvanceDirective, "id">>({
    type: "DNR",
    status: "notStarted",
    details: "",
    documents: []
  });

  const handleDirectiveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const directive: AdvanceDirective = {
      id: crypto.randomUUID(),
      ...newDirective,
      dateCompleted: newDirective.status === "completed" ? new Date().toISOString() : undefined
    };
    updateAdvanceDirective(directive);
    setNewDirective({
      type: "DNR",
      status: "notStarted",
      details: "",
      documents: []
    });
  };

  const exportToPDF = async () => {
    // For now, we'll create a simple JSON export as a placeholder
    // In a production environment, this would use react-pdf to generate a proper PDF
    const exportData = {
      patientDirectives: state.advanceDirectives,
      exportDate: new Date().toISOString(),
      facilityInfo: "OncoVista Medical Center"
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "advance-directives.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: AdvanceDirective["status"]) => {
    const Icon = statusIcons[status];
    return <Icon className={`w-5 h-5 ${statusColors[status]}`} />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Advance Directives</h2>
        <Button onClick={exportToPDF} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Documents
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Directive</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleDirectiveSubmit} className="space-y-6">
            <div>
              <Label>Type of Directive</Label>
              <RadioGroup
                value={newDirective.type}
                onValueChange={(value: AdvanceDirective["type"]) => 
                  setNewDirective(prev => ({ ...prev, type: value }))
                }
                className="grid grid-cols-2 gap-4 mt-2"
              >
                {directiveTypes.map(type => (
                  <div key={type} className="flex items-center space-x-2">
                    <RadioGroupItem value={type} id={type} />
                    <Label htmlFor={type}>{type.replace(/([A-Z])/g, ' $1').trim()}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label>Status</Label>
              <RadioGroup
                value={newDirective.status}
                onValueChange={(value: AdvanceDirective["status"]) =>
                  setNewDirective(prev => ({ ...prev, status: value }))
                }
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="completed" id="completed" />
                  <Label htmlFor="completed">Completed</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pending" id="pending" />
                  <Label htmlFor="pending">Pending</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="notStarted" id="notStarted" />
                  <Label htmlFor="notStarted">Not Started</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Details</Label>
              <Textarea
                value={newDirective.details}
                onChange={(e) => 
                  setNewDirective(prev => ({ ...prev, details: e.target.value }))
                }
                className="mt-2"
                placeholder="Enter any relevant details or notes..."
              />
            </div>

            <Button type="submit">
              <FilePlus className="w-4 h-4 mr-2" />
              Add Directive
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {state.advanceDirectives.map((directive) => (
          <Card key={directive.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{directive.type.replace(/([A-Z])/g, ' $1').trim()}</span>
                {getStatusIcon(directive.status)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium capitalize">{directive.status}</p>
                </div>
                {directive.dateCompleted && (
                  <div>
                    <p className="text-sm text-gray-500">Completed</p>
                    <p className="font-medium">
                      {new Date(directive.dateCompleted).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {directive.details && (
                  <div>
                    <p className="text-sm text-gray-500">Details</p>
                    <p className="text-sm mt-1">{directive.details}</p>
                  </div>
                )}
                {directive.documents.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Documents</p>
                    <ul className="list-disc list-inside text-sm">
                      {directive.documents.map((doc, index) => (
                        <li key={index}>{doc}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdvanceDirectives;
