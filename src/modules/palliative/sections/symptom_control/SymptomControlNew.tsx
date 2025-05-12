import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SymptomSearch } from "@/components/ui/symptom-search";
import { type Symptom, type SymptomTemplate } from "@/types/symptoms";
import { useState } from "react";

function SymptomControlNew() {
  const [isAddingSymptom, setIsAddingSymptom] = useState(false);
  const [hasResults, setHasResults] = useState(true);

  return (
    <div>
      <Dialog>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Symptom</DialogTitle>
            <DialogDescription>
              Search and select a symptom to start tracking
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <SymptomSearch
              onSelectSymptom={(template: SymptomTemplate) => {
                const newSymptom: Symptom = {
                  ...template,
                  id: template.id,
                  severity: 'mild',
                  onset: new Date().toISOString(),
                  notes: '',
                  interventions: {
                    pharmacological: [],
                    nonPharmacological: []
                  },
                  suggestedInterventions: {
                    nonPharmacological: template.interventions?.nonPharmacological || [],
                    pharmacological: template.interventions?.pharmacological || []
                  }
                };
                // TODO: Implement updateSymptom via context
                setIsAddingSymptom(false);
              }}
              currentSymptoms={[]} // TODO: Get current symptoms from context
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>
      
      {!hasResults && (
        <div className="text-center py-10">
          <p className="text-slate-500 dark:text-slate-400">
            No symptoms found matching your search.
          </p>
        </div>
      )}
    </div>
  );
}

export default SymptomControlNew;
