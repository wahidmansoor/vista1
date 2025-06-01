import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertTriangle } from "lucide-react";

interface DeliriumAssessment {
  consciousness: 'alert' | 'drowsy' | 'stupor';
  orientation: boolean[];
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

const DeliriumAssessment = () => {
  const [assessment, setAssessment] = useState<DeliriumAssessment>({
    consciousness: 'alert',
    orientation: [true, true, true],
    attention: 'normal',
    onset: 'gradual',
    fluctuating: false
  });

  const handleUpdate = (field: keyof DeliriumAssessment, value: any) => {
    setAssessment(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isDeliriumLikely = () => {
    return (
      assessment.consciousness !== 'alert' ||
      assessment.orientation.includes(false) ||
      assessment.attention === 'impaired' ||
      (assessment.onset === 'acute' && assessment.fluctuating)
    );
  };

  return (
    <Card className="palliative-card">
      <CardHeader>
        <CardTitle>Delirium Assessment Tool</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="consciousness" className="text-base">Level of Consciousness</Label>
            <RadioGroup
              id="consciousness"
              value={assessment.consciousness}
              onValueChange={(value: string) => 
                handleUpdate('consciousness', value as DeliriumAssessment['consciousness'])
              }
              className="grid grid-cols-1 gap-2 mt-2"
            >
              {deliriumCriteria.consciousness.map(level => (
                <div key={level} className="flex items-center space-x-2">
                  <RadioGroupItem value={level} id={`consciousness-${level}`} />
                  <Label htmlFor={`consciousness-${level}`} className="capitalize">
                    {level}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base mb-2 block">Orientation Assessment</Label>
            <div className="grid grid-cols-3 gap-4">
              {deliriumCriteria.orientationDomains.map((domain, index) => (
                <button
                  key={domain}
                  type="button"
                  onClick={() => {
                    const newOrientation = [...assessment.orientation];
                    newOrientation[index] = !newOrientation[index];
                    handleUpdate('orientation', newOrientation);
                  }}
                  className={`p-2 rounded-lg text-sm font-medium transition-colors
                    ${assessment.orientation[index]
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-destructive text-destructive-foreground'
                    }`}
                  aria-pressed={assessment.orientation[index]}
                >
                  {domain}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="attention" className="text-base">Attention</Label>
            <RadioGroup
              id="attention"
              value={assessment.attention}
              onValueChange={(value: DeliriumAssessment['attention']) => 
                handleUpdate('attention', value)
              }
              className="grid grid-cols-2 gap-2 mt-2"
            >
              {deliriumCriteria.attentionStates.map(state => (
                <div key={state} className="flex items-center space-x-2">
                  <RadioGroupItem value={state} id={`attention-${state}`} />
                  <Label htmlFor={`attention-${state}`} className="capitalize">
                    {state}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="onset" className="text-base">Onset</Label>
            <RadioGroup
              id="onset"
              value={assessment.onset}
              onValueChange={(value: DeliriumAssessment['onset']) => 
                handleUpdate('onset', value)
              }
              className="grid grid-cols-2 gap-2 mt-2"
            >
              {deliriumCriteria.onsetTypes.map(type => (
                <div key={type} className="flex items-center space-x-2">
                  <RadioGroupItem value={type} id={`onset-${type}`} />
                  <Label htmlFor={`onset-${type}`} className="capitalize">
                    {type}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <input
            type="checkbox"
            id="fluctuating"
            checked={assessment.fluctuating}
            onChange={(e) => handleUpdate('fluctuating', e.target.checked)}
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <Label htmlFor="fluctuating">Symptoms fluctuate throughout the day</Label>
        </div>

        {isDeliriumLikely() && (
          <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-destructive">Delirium Likely</h4>
              <p className="text-sm text-destructive/90 mt-1">
                Immediate assessment needed. Consider reversible causes:
                medications, infection, metabolic disturbance, organ failure.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default React.memo(DeliriumAssessment);