import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AlertTriangle, ArrowRight } from 'lucide-react';
import type { Symptom } from '../../../context/PalliativeContext';

interface SeverityCardProps {
  symptom: Symptom;
  onSelect?: () => void;
  className?: string;
}

const severityColors = {
  mild: "border-green-200 bg-green-50",
  moderate: "border-yellow-200 bg-yellow-50",
  severe: "border-red-200 bg-red-50"
};

const textColors = {
  mild: "text-green-700",
  moderate: "text-yellow-700",
  severe: "text-red-700"
};

const SeverityCard: React.FC<SeverityCardProps> = ({ 
  symptom, 
  onSelect,
  className 
}) => {
  return (
    <Card 
      className={cn(
        "transition-all duration-200 hover:shadow-md cursor-pointer",
        severityColors[symptom.severity],
        className
      )}
      onClick={onSelect}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg font-semibold">{symptom.name}</span>
          <span className={cn(
            "text-sm font-medium capitalize",
            textColors[symptom.severity]
          )}>
            {symptom.severity}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            {symptom.description}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Onset:</span>
            <span className="text-sm">{symptom.onset}</span>
          </div>
          {symptom.interventions.length > 0 && (
            <div className="pt-2">
              <p className="text-sm text-gray-500 mb-1">Current Interventions:</p>
              <ul className="list-disc list-inside text-sm space-y-1">
                {symptom.interventions.map((intervention, index) => (
                  <li key={index} className="text-gray-700">{intervention}</li>
                ))}
              </ul>
            </div>
          )}
          {symptom.severity === 'severe' && (
            <div className="flex items-center gap-2 text-red-600 pt-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">Requires immediate attention</span>
            </div>
          )}
        </div>
        {onSelect && (
          <div className="flex justify-end pt-4">
            <ArrowRight className="w-5 h-5 text-gray-400" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SeverityCard;