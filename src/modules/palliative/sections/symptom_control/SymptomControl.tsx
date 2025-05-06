import React from "react";
import { usePalliativeCare } from "../../context/PalliativeContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertTriangle, Search } from "lucide-react";

import type { Symptom } from "../../context/PalliativeContext";

interface DeliriumAssessment {
  consciousness: 'alert' | 'drowsy' | 'stupor';
  orientation: boolean[];  // Array of orientation domains [person, place, time]
  attention: 'normal' | 'impaired';
  onset: 'acute' | 'gradual';
  fluctuating: boolean;
}

const deliriumCriteria = {
  consciousness: ['alert', 'drowsy', 'stupor'],
  orientationDomains: ['Person', 'Place', 'Time'],
  attentionStates: ['normal', 'impaired'],
  onsetTypes: ['acute', 'gradual']
};

const SymptomControl = () => {
  const { state, updateSymptom } = usePalliativeCare();
  const [deliriumData, setDeliriumData] = React.useState<DeliriumAssessment>({
    consciousness: 'alert',
    orientation: [true, true, true],
    attention: 'normal',
    onset: 'gradual',
    fluctuating: false
  });

  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("active");

  const handleDeliriumUpdate = (field: keyof DeliriumAssessment, value: any) => {
    setDeliriumData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isDeliriumLikely = () => {
    return (
      deliriumData.consciousness !== 'alert' ||
      deliriumData.orientation.includes(false) ||
      deliriumData.attention === 'impaired' ||
      (deliriumData.onset === 'acute' && deliriumData.fluctuating)
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search symptoms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">Add New Symptom</Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active Symptoms</TabsTrigger>
          <TabsTrigger value="delirium">Delirium Assessment</TabsTrigger>
          <TabsTrigger value="history">Symptom History</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Current Symptoms</CardTitle>
            </CardHeader>
            <CardContent>
              {state.currentSymptoms.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No active symptoms recorded</p>
              ) : (
                <div className="space-y-4">
                  {state.currentSymptoms.map(symptom => (
                    <SymptomCard 
                      key={symptom.id} 
                      symptom={symptom}
                      onUpdate={updateSymptom}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delirium">
          <Card>
            <CardHeader>
              <CardTitle>Delirium Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label>Level of Consciousness</Label>
                  <RadioGroup
                    value={deliriumData.consciousness}
                    onValueChange={(value) => 
                      handleDeliriumUpdate('consciousness', value)
                    }
                    className="flex gap-4 mt-2"
                  >
                    {deliriumCriteria.consciousness.map(level => (
                      <div key={level} className="flex items-center space-x-2">
                        <RadioGroupItem value={level} id={level} />
                        <Label htmlFor={level} className="capitalize">{level}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label>Orientation</Label>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    {deliriumCriteria.orientationDomains.map((domain, index) => (
                      <Button
                        key={domain}
                        variant={deliriumData.orientation[index] ? "default" : "destructive"}
                        onClick={() => {
                          const newOrientation = [...deliriumData.orientation];
                          newOrientation[index] = !newOrientation[index];
                          handleDeliriumUpdate('orientation', newOrientation);
                        }}
                      >
                        {domain}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Attention</Label>
                  <RadioGroup
                    value={deliriumData.attention}
                    onValueChange={(value) => 
                      handleDeliriumUpdate('attention', value)
                    }
                    className="flex gap-4 mt-2"
                  >
                    {deliriumCriteria.attentionStates.map(state => (
                      <div key={state} className="flex items-center space-x-2">
                        <RadioGroupItem value={state} id={state} />
                        <Label htmlFor={state} className="capitalize">{state}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label>Onset</Label>
                  <RadioGroup
                    value={deliriumData.onset}
                    onValueChange={(value) => 
                      handleDeliriumUpdate('onset', value)
                    }
                    className="flex gap-4 mt-2"
                  >
                    {deliriumCriteria.onsetTypes.map(type => (
                      <div key={type} className="flex items-center space-x-2">
                        <RadioGroupItem value={type} id={type} />
                        <Label htmlFor={type} className="capitalize">{type}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={deliriumData.fluctuating}
                    onChange={(e) => 
                      handleDeliriumUpdate('fluctuating', e.target.checked)
                    }
                    className="rounded border-gray-300"
                  />
                  <Label>Symptoms fluctuate throughout the day</Label>
                </div>

                {isDeliriumLikely() && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-800">Delirium Likely</h4>
                      <p className="text-sm text-red-700 mt-1">
                        Immediate assessment needed. Consider reversible causes:
                        medications, infection, metabolic disturbance, organ failure.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Symptom History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 text-center py-4">
                Symptom history will be displayed here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface SymptomCardProps {
  symptom: Symptom;
  onUpdate: (symptom: Symptom) => void;
}

const SymptomCard = ({ symptom, onUpdate }: SymptomCardProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">{symptom.name}</h3>
            <p className="text-sm text-gray-500">Onset: {symptom.onset}</p>
          </div>
          <Badge
            variant={
              symptom.severity === 'severe' ? 'destructive' :
              symptom.severity === 'moderate' ? 'default' :
              'secondary'
            }
          >
            {symptom.severity}
          </Badge>
        </div>
        <p className="mt-2 text-sm text-gray-600">{symptom.description}</p>
        {symptom.interventions.length > 0 && (
          <div className="mt-3">
            <h4 className="text-sm font-medium mb-1">Current Interventions:</h4>
            <ul className="list-disc list-inside text-sm text-gray-600">
              {symptom.interventions.map((intervention, index) => (
                <li key={index}>{intervention}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SymptomControl;
