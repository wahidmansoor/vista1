import React, { Suspense, useState } from "react";
import { usePalliativeCare } from "../../context/PalliativeContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Search, AlertTriangle } from "lucide-react";
import { SymptomCard } from "@/components/ui/symptom-card";
import { SymptomCardSkeleton } from "@/components/ui/symptom-card-skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SymptomSearch } from "../../../../components/ui/symptom-search";
import { SymptomTemplate } from "../../../../types/symptoms";

import type { Symptom } from "../../context/PalliativeContext";

const DeliriumAssessment = React.lazy(() => import("../delirium/DeliriumAssessment"));

const deliriumCriteria = {
  consciousness: ['alert', 'drowsy', 'stupor'],
  orientationDomains: ['Person', 'Place', 'Time'],
  attentionStates: ['normal', 'impaired'],
  onsetTypes: ['acute', 'gradual']
};

const SymptomControl = () => {
  const { state, updateSymptom } = usePalliativeCare();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const [isAddingSymptom, setIsAddingSymptom] = useState(false);

  // Filter symptoms based on search query
  const filteredSymptoms = state.currentSymptoms.filter(symptom =>
    symptom.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    symptom.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="palliative-section">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <Input
            type="text"
            placeholder="Search symptoms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            aria-label="Search symptoms"
          />
        </div>
        <button
          onClick={() => setIsAddingSymptom(true)}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          aria-label="Add new symptom"
        >
          Add New Symptom
        </button>
      </div>

      {/* Add Dialog for new symptom */}
      <Dialog open={isAddingSymptom} onOpenChange={setIsAddingSymptom}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Add New Symptom</DialogTitle>
            <DialogDescription>
              Search and select a symptom to start tracking
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <SymptomSearch
              onSelectSymptom={(template: SymptomTemplate) => {
                // Handle adding the symptom here
                const newSymptom: Symptom = {
                  id: template.id,
                  name: template.name,
                  description: template.description || '',
                  severity: 'mild',
                  onset: new Date().toISOString(),
                  notes: '',
                  interventions: [],
                  suggestedInterventions: {
                    pharmacological: template.interventions?.pharmacological?.map(i => i.name) || [],
                    nonPharmacological: template.interventions?.nonPharmacological?.map(i => i.name) || []
                  },
                  assessmentPoints: [],
                  redFlags: []
                };
                updateSymptom(newSymptom);
                setIsAddingSymptom(false);
              }}
              currentSymptoms={state.currentSymptoms.map(s => s.id)}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList aria-label="Symptom management sections">
          <TabsTrigger 
            value="active"
            aria-controls="active-symptoms-content"
          >
            Active Symptoms
          </TabsTrigger>
          <TabsTrigger 
            value="delirium"
            aria-controls="delirium-assessment-content"
          >
            Delirium Assessment
          </TabsTrigger>
          <TabsTrigger 
            value="history"
            aria-controls="symptom-history-content"
          >
            Symptom History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" id="active-symptoms-content" role="tabpanel">
          <Card>
            <CardHeader>
              <CardTitle>Current Symptoms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredSymptoms.length === 0 && !searchQuery && (
                  <p className="col-span-full text-center py-4 text-gray-500 dark:text-gray-400">
                    No active symptoms recorded
                  </p>
                )}
                {filteredSymptoms.length === 0 && searchQuery && (
                  <p className="col-span-full text-center py-4 text-gray-500 dark:text-gray-400">
                    No symptoms match your search
                  </p>
                )}
                {filteredSymptoms.map(symptom => (
                  <SymptomCard 
                    key={symptom.id} 
                    symptom={symptom}
                    onUpdate={updateSymptom}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delirium" id="delirium-assessment-content" role="tabpanel">
          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SymptomCardSkeleton />
              <SymptomCardSkeleton />
            </div>
          }>
            <DeliriumAssessment />
          </Suspense>
        </TabsContent>

        <TabsContent value="history" id="symptom-history-content" role="tabpanel">
          <Card>
            <CardHeader>
              <CardTitle>Symptom History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                Symptom history will be displayed here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default React.memo(SymptomControl);
