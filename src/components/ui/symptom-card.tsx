import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Badge } from "./badge";
import { cn } from "@/lib/utils";
import { AlertTriangle } from 'lucide-react';

export interface SymptomCardProps {
  symptom: {
    id: string;
    name: string;
    description: string;
    severity: 'mild' | 'moderate' | 'severe';
    onset: string;
    interventions: string[];
  };
  onUpdate?: (symptom: any) => void;
  className?: string;
}

const SymptomCard = React.memo(({ symptom, onUpdate, className }: SymptomCardProps) => {
  // Map severity to appropriate styles
  const severityStyles = {
    mild: 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300',
    moderate: 'bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300',
    severe: 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300',
  };

  const severityBadgeStyles = {
    mild: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    moderate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    severe: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  return (
    <Card 
      className={cn(
        'palliative-card transition-all duration-200 hover:shadow-md',
        severityStyles[symptom.severity],
        className
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100">{symptom.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Onset: {new Date(symptom.onset).toLocaleDateString()}</p>
          </div>
          <Badge
            variant="outline"
            className={cn(
              'capitalize',
              severityBadgeStyles[symptom.severity]
            )}
          >
            {symptom.severity}
          </Badge>
        </div>
        
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{symptom.description}</p>
        
        {symptom.interventions.length > 0 && (
          <div className="mt-3">
            <h4 className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Current Interventions:</h4>
            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
              {symptom.interventions.map((intervention, index) => (
                <li key={index}>{intervention}</li>
              ))}
            </ul>
          </div>
        )}

        {symptom.severity === 'severe' && (
          <div className="mt-3 flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">Requires immediate attention</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

SymptomCard.displayName = 'SymptomCard';

export { SymptomCard };