import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AlertTriangle, ArrowRight, Star, ChevronDown } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Symptom } from '../../../context/PalliativeContext';

interface SeverityCardProps {
  symptom: Symptom;
  onSelect?: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
  className?: string;
  expandAll?: boolean;
}

const severityColors = {
  mild: "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20",
  moderate: "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20",
  severe: "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
};

const textColors = {
  mild: "text-green-700 dark:text-green-400",
  moderate: "text-yellow-700 dark:text-yellow-400",
  severe: "text-red-700 dark:text-red-400"
};

const SeverityCard: React.FC<SeverityCardProps> = ({ 
  symptom, 
  onSelect,
  onFavorite,
  isFavorite,
  className,
  expandAll 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasRedFlags = symptom.redFlags && symptom.redFlags.length > 0;
  const hasAssessmentPoints = symptom.assessmentPoints && symptom.assessmentPoints.length > 0;

  // Update local expansion state when expandAll changes
  useEffect(() => {
    setIsExpanded(expandAll ?? false);
  }, [expandAll]);

  return (
    <Card 
      className={cn(
        "transition-all duration-200 hover:shadow-md cursor-pointer relative overflow-hidden",
        severityColors[symptom.severity],
        isExpanded ? "max-h-none" : "max-h-[200px]",
        className
      )}
      onClick={onSelect}
    >
      {onFavorite && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavorite();
          }}
          className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-sm hover:shadow group"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Star className={cn(
            "w-4 h-4 transition-all",
            isFavorite ? "fill-yellow-400 text-yellow-400 scale-110" : "text-gray-400 hover:text-yellow-400"
          )} />
        </button>
      )}

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="flex items-center gap-2">
            <span className="text-lg font-semibold">{symptom.name}</span>
            <span className={cn(
              "text-sm font-medium capitalize",
              textColors[symptom.severity]
            )}>
              {symptom.severity}
            </span>
          </CardTitle>
          <div className="flex gap-2">
            <button
              className="h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(prev => !prev);
              }}
            >
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform",
                isExpanded ? "transform rotate-180" : ""
              )} />
              <span className="sr-only">
                {isExpanded ? "Collapse" : "Expand"
              }</span>
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {symptom.description}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Onset:</span>
            <span className="text-sm">{symptom.onset}</span>
          </div>
          
          {/* Red Flags Section */}
          {symptom.redFlags && symptom.redFlags.length > 0 && (
            <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                <h4 className="font-medium text-red-800 dark:text-red-200">🚨 Red Flags</h4>
              </div>
              <ul className="list-disc list-inside space-y-1">
                {symptom.redFlags.map((flag: string, index: number) => (
                  <li key={index} className="text-sm text-red-700 dark:text-red-300">
                    {flag}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Assessment Tips Section */}
          {symptom.assessmentPoints && symptom.assessmentPoints.length > 0 && (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="assessment-tips" className="border-none">
                <AccordionTrigger className="hover:no-underline py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700 dark:text-gray-200">🧠 Assessment Tips</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal list-inside space-y-1 pl-1">
                    {symptom.assessmentPoints.map((tip, index) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-300">
                        {tip}
                      </li>
                    ))}
                  </ol>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          {symptom.interventions.length > 0 && (
            <div className="pt-2">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Current Interventions:</p>
              <ul className="list-disc list-inside text-sm space-y-1">
                {symptom.interventions.map((intervention, index) => (
                  <li key={index} className="text-gray-700 dark:text-gray-300">{intervention}</li>
                ))}
              </ul>
            </div>
          )}

          {hasRedFlags && (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 
                          rounded-lg p-3 mt-2 transition-all duration-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
                  🚨 Red Flags
                </h4>
              </div>
              <ul className="list-disc list-inside space-y-1">
                {symptom.redFlags.map((flag: string, index: number) => (
                  <li key={index} className="text-sm text-red-600 dark:text-red-300">
                    {flag}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {symptom.severity === 'severe' && (
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 pt-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">Requires immediate attention</span>
            </div>
          )}
        </div>
        
        {onSelect && (
          <div className="flex justify-end pt-4">
            <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SeverityCard;