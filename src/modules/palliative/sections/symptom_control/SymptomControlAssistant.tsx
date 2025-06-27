// SymptomControlAssistant.tsx
// Stateless, on-demand symptom guidance assistant for palliative care
import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import SymptomSearch from "./components/SymptomSearch"; // Updated import path

// Modular SymptomCard for reuse and clarity
const SymptomCard = ({ symptom, onSelect }) => (
  <div
    className="cursor-pointer rounded-md border bg-muted shadow-md p-6 mb-4 focus-visible:outline focus-visible:ring-2 focus-visible:ring-indigo-500"
    tabIndex={0}
    role="button"
    aria-label={`Select symptom: ${symptom.name}`}
    onClick={() => onSelect(symptom)}
    onKeyDown={e => (e.key === "Enter" || e.key === " ") && onSelect(symptom)}
  >
    <div className="flex items-center gap-2">
      <span className="text-xl font-bold text-slate-900 dark:text-zinc-100">{symptom.name}</span>
      {symptom.category && (
        <Badge className="ml-2 text-xs px-2 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200">
          {symptom.category}
        </Badge>
      )}
    </div>
    <div className="text-muted-foreground mt-1">{symptom.description}</div>
  </div>
);

const SymptomControlAssistant: React.FC = () => {
  const [selected, setSelected] = useState<import("./data/SymptomData").SymptomTemplate | null>(null);

  const handleCopy = () => {
    if (!selected) return;
    // Helper to render intervention lines for copy
    const renderInterventionLines = (arr: any[] | undefined, type: 'pharmacological' | 'nonPharmacological') => {
      if (!arr || arr.length === 0) return '-';
      return arr.map(i => {
        if (typeof i === 'string') return `- ${i}`;
        if (type === 'pharmacological') {
          return `- ${i.name || ''}: ${i.dosing || ''} ${i.description ? `(${i.description})` : ''}`.trim();
        }
        return `- ${i.name || ''}: ${i.description || ''}`.trim();
      }).join('\n');
    };
    const text = `Symptom: ${selected.name}\n\nDescription: ${selected.description || "-"}\n\nPharmacological Interventions:\n${renderInterventionLines(selected.interventions?.pharmacological, 'pharmacological')}\n\nNon-Pharmacological Interventions:\n${renderInterventionLines(selected.interventions?.nonPharmacological, 'nonPharmacological')}`;
    navigator.clipboard.writeText(text);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!selected) {
    return (
      <section className="max-w-2xl mx-auto p-6" role="region" aria-labelledby="symptom-assistant-title">
        <Card className="bg-muted text-muted-foreground dark:bg-zinc-900 dark:text-zinc-100 shadow-md p-6">
          <CardHeader className="p-0 mb-4">
            <CardTitle id="symptom-assistant-title" className="text-2xl font-bold">Symptom Guidance Assistant</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Directly use SymptomSearch component */}
            <SymptomSearch 
              onSelectSymptom={setSelected} 
              currentSymptoms={[]} 
              aria-label="Search for symptoms" 
            />
          </CardContent>
        </Card>
      </section>
    );
  }

  // Helper for rendering interventions in a responsive grid
  const renderInterventions = (arr: any[], type: 'pharmacological' | 'nonPharmacological') => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2" role="region" aria-live="polite">
      <div className="font-semibold text-muted-foreground">Name</div>
      <div className="font-semibold text-muted-foreground">Dosing</div>
      <div className="font-semibold text-muted-foreground">Notes</div>
      {arr.map((i, idx) => (
        <React.Fragment key={i.name + idx}>
          <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100" tabIndex={0}>{i.name}</div>
          <div className="text-xs text-muted-foreground" tabIndex={0}>{i.dosing || '-'}</div>
          <div className="text-xs text-muted-foreground" tabIndex={0}>{i.notes || i.description || '-'}</div>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <section className="max-w-2xl mx-auto p-6" role="region" aria-labelledby="selected-symptom-title">
      <Card className="bg-muted text-muted-foreground dark:bg-zinc-900 dark:text-zinc-100 shadow-md p-6">
        <CardHeader className="p-0 mb-4">
          <CardTitle id="selected-symptom-title" className="text-2xl font-bold flex items-center gap-2">
            {selected.name}
            {selected.category && (
              <Badge className="ml-2 text-xs px-2 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200">
                {selected.category}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-6">
            <div className="text-xl font-bold mb-1">Description</div>
            <div className="mb-2 text-base text-muted-foreground" tabIndex={0}>{selected.description}</div>
            <Separator className="my-4" />
            <section role="region" aria-labelledby="pharm-int-title">
              <div className="flex items-center gap-2 mb-2">
                <span id="pharm-int-title" className="text-lg font-semibold">Pharmacological Interventions</span>
                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">Drug</Badge>
              </div>
              {selected.interventions?.pharmacological?.length ? (
                renderInterventions(selected.interventions.pharmacological, 'pharmacological')
              ) : (
                <div className="text-sm text-muted-foreground">None listed</div>
              )}
            </section>
            <Separator className="my-4" />
            <section role="region" aria-labelledby="nonpharm-int-title">
              <div className="flex items-center gap-2 mb-2">
                <span id="nonpharm-int-title" className="text-lg font-semibold">Non-Pharmacological Interventions</span>
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200">Non-Drug</Badge>
              </div>
              {selected.interventions?.nonPharmacological?.length ? (
                renderInterventions(selected.interventions.nonPharmacological, 'nonPharmacological')
              ) : (
                <div className="text-sm text-muted-foreground">None listed</div>
              )}
            </section>
            <Separator className="my-4" />
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 rounded-md bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-100 hover:bg-gray-200 dark:hover:bg-zinc-700 focus-visible:outline focus-visible:ring-2 focus-visible:ring-indigo-500"
                aria-label="Back to Search"
                tabIndex={0}
              >
                Back to Search
              </button>
              <button
                onClick={handleCopy}
                className="px-4 py-2 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-label="Copy All Recommendations"
                tabIndex={0}
              >
                Copy All Recommendations
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-md bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800 focus-visible:outline focus-visible:ring-2 focus-visible:ring-green-500"
                aria-label="Print Recommendations"
                tabIndex={0}
              >
                Print Recommendations
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default SymptomControlAssistant;
