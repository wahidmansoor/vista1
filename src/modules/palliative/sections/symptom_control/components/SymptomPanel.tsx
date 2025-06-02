import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, AlertTriangle, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePalliativeCare } from '../../../context/PalliativeContext';
import type { Symptom } from '../../../context/PalliativeContext';
import type { SymptomTemplate } from '../data/SymptomData';
import SeverityCard from './SeverityCard';
import SymptomSearch from './SymptomSearch';

const SymptomPanel: React.FC = () => {
  const palliativeContext = usePalliativeCare();
  const { state, updateSymptom, toggleFavorite } = palliativeContext;
  const [selectedSymptom, setSelectedSymptom] = useState<Symptom | null>(null);
  const [isAddingSymptom, setIsAddingSymptom] = useState(false);
  const [expandAll, setExpandAll] = useState(false);
  const favoriteSymptomIds = state.favoriteSymptomIds || [];
  const symptoms = state.currentSymptoms || [];

  // Filter symptoms by severity or favorites
  const filterSymptoms = (filter: 'all' | 'mild' | 'moderate' | 'severe' | 'favorites'): Symptom[] => {
    let filtered = symptoms;
    if (filter === 'favorites') {
      return filtered.filter((s: Symptom) => favoriteSymptomIds.includes(s.id));
    }
    if (filter !== 'all') {
      filtered = filtered.filter((s: Symptom) => s.severity === filter);
    }
    return filtered;
  };

  const handleFavoriteToggle = (symptom: Symptom) => {
    toggleFavorite(symptom.id);
  };

  const handleAddSymptom = (template: SymptomTemplate) => {
    const newSymptom: Symptom = {
      ...template,
      id: template.id,
      severity: 'mild', // Default to mild initially
      interventions: [],
      onset: new Date().toISOString(),
      notes: '',
      suggestedInterventions: {
        nonPharmacological: template.interventions.nonPharmacological || [],
        pharmacological: template.interventions.pharmacological || []
      }
    };
    updateSymptom(newSymptom);
    setIsAddingSymptom(false);
    console.log('Added new symptom:', newSymptom); // Debug log
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <h2 className="text-2xl font-bold">Symptom Management</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => setExpandAll(prev => !prev)}
            className="gap-2"
          >
            {expandAll ? "Collapse All" : "Expand All"}
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline"
                onClick={() => setIsAddingSymptom(true)}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Symptom
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Symptoms</TabsTrigger>
          <TabsTrigger value="mild">Mild</TabsTrigger>
          <TabsTrigger value="moderate">Moderate</TabsTrigger>
          <TabsTrigger value="severe">Severe</TabsTrigger>
          <TabsTrigger value="favorites" className="gap-2">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-yellow-500" />
              Favorites
            </div>
          </TabsTrigger>
        </TabsList>

        {(['all', 'mild', 'moderate', 'severe', 'favorites'] as const).map(severity => (
          <TabsContent key={severity} value={severity}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterSymptoms(severity).map((symptom: Symptom) => (
                <SeverityCard
                  key={symptom.id}
                  symptom={symptom}
                  onSelect={() => setSelectedSymptom(symptom)}
                  onFavorite={() => handleFavoriteToggle(symptom)}
                  isFavorite={favoriteSymptomIds.includes(symptom.id)}
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
              currentSymptoms={symptoms.map((s: Symptom) => s.id)}
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