import { useState } from "react";
import { Input } from "./input";
import { Card, CardContent } from "./card";
import { SymptomTemplate } from "@/types/symptoms";

const SYMPTOM_TEMPLATES: SymptomTemplate[] = [
  {
    id: "pain",
    name: "Pain",
    description: "General pain symptoms",
    interventions: {
      nonPharmacological: [
        { id: "positioning", name: "Positioning", type: "nonPharmacological" },
        { id: "heat", name: "Heat application", type: "nonPharmacological" },
      ],
      pharmacological: [
        { 
          id: "paracetamol", 
          name: "Paracetamol", 
          type: "pharmacological",
          dosing: "1g PO Q6H PRN" 
        },
      ]
    }
  },
  // Add more symptom templates as needed
];

interface SymptomSearchProps {
  onSelectSymptom: (template: SymptomTemplate) => void;
  currentSymptoms: string[];
}

export function SymptomSearch({ onSelectSymptom, currentSymptoms }: SymptomSearchProps) {
  const [search, setSearch] = useState("");

  const filteredSymptoms = SYMPTOM_TEMPLATES.filter(
    (template) =>
      !currentSymptoms.includes(template.id) &&
      template.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Input
        type="search"
        placeholder="Search symptoms..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="grid gap-4">
        {filteredSymptoms.map((template) => (
          <Card
            key={template.id}
            className="cursor-pointer hover:bg-accent"
            onClick={() => onSelectSymptom(template)}
          >
            <CardContent className="p-4">
              <h3 className="font-semibold">{template.name}</h3>
              {template.description && (
                <p className="text-sm text-muted-foreground">{template.description}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}