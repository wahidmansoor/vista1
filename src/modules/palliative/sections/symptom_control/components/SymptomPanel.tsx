import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, AlertTriangle } from 'lucide-react';
import { usePalliativeContext } from '../../../context/PalliativeContext';
import type { Symptom } from '../../../context/PalliativeContext';
import type { SymptomTemplate } from '../data/SymptomData';
import SeverityCard from './SeverityCard';
import SymptomSearch from './SymptomSearch';

const SymptomPanel: React.FC = () => {
  const { symptoms, updateSymptoms } = usePalliativeContext();
  const [isAddingSymptom, setIsAddingSymptom] = useState(false);
  const [selectedSymptom, setSelectedSymptom] = useState<Symptom | null>(null);

  const handleAddSymptom = (template: SymptomTemplate) => {
    const newSymptom: Symptom = {
      id: template.id,
      name: template.name,
      description: template.description,
      severity: 'moderate',
      onset: new Date().toISOString(),
      interventions: [],
      notes: '',
      assessmentPoints: template.assessmentPoints,
      redFlags: template.redFlags,
      suggestedInterventions: template.interventions
    };
    
    updateSymptoms([...symptoms, newSymptom]);
    setIsAddingSymptom(false);
  };

  const filterSymptoms = (severity: 'all' | 'mild' | 'moderate' | 'severe') => {
    if (severity === 'all') return symptoms;
    return symptoms.filter(s => s.severity === severity);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Active Symptoms</h3>
        <Button 
          onClick={() => setIsAddingSymptom(true)}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Symptom
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="mild">Mild</TabsTrigger>
          <TabsTrigger value="moderate">Moderate</TabsTrigger>
          <TabsTrigger value="severe">
            <div className="flex items-center gap-2">
              Severe
              {filterSymptoms('severe').length > 0 && (
                <AlertTriangle className="w-4 h-4 text-red-500" />
              )}
            </div>
          </TabsTrigger>
        </TabsList>

        {(['all', 'mild', 'moderate', 'severe'] as const).map(severity => (
          <TabsContent key={severity} value={severity}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterSymptoms(severity).map(symptom => (
                <SeverityCard
                  key={symptom.id}
                  symptom={symptom}
                  onSelect={() => setSelectedSymptom(symptom)}
                />
              ))}
              {filterSymptoms(severity).length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No {severity !== 'all' ? severity : ''} symptoms recorded
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

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
              onSelectSymptom={handleAddSymptom}
              currentSymptoms={symptoms.map(s => s.id)}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedSymptom} onOpenChange={() => setSelectedSymptom(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{selectedSymptom?.name}</DialogTitle>
            <DialogDescription>
              Manage symptom details and interventions
            </DialogDescription>
          </DialogHeader>
          {selectedSymptom && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className="font-medium">Assessment Points</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedSymptom.assessmentPoints.map((point, index) => (
                      <li key={index} className="text-gray-700">{point}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Suggested Interventions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-medium mb-2">Non-Pharmacological</h5>
                      <ul className="list-disc list-inside space-y-1">
                        {selectedSymptom.suggestedInterventions.nonPharmacological.map((int, index) => (
                          <li key={index} className="text-gray-700 text-sm">{int}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium mb-2">Pharmacological</h5>
                      <ul className="list-disc list-inside space-y-1">
                        {selectedSymptom.suggestedInterventions.pharmacological.map((int, index) => (
                          <li key={index} className="text-gray-700 text-sm">{int}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {selectedSymptom.redFlags.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-red-600 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Red Flags
                    </h4>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedSymptom.redFlags.map((flag, index) => (
                        <li key={index} className="text-red-600">{flag}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SymptomPanel;