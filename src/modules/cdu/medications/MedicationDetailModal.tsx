import React, { useState } from 'react';
import {
  X, AlertTriangle, Pill, Brain, Activity,
  Beaker, Heart, Clock, Scale, BarChart,
  Loader2
} from 'lucide-react';
import type { Medication } from '../types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Props interface for the main component
interface Props {
  medication: Medication | null;
  isOpen: boolean;
  onClose: () => void;
}

// Helper components
const Section: React.FC<{
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <div className="border-b border-gray-200 dark:border-gray-700 p-6">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
      {icon}
      {title}
    </h3>
    {children}
  </div>
);

const SubSection: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <div className="mb-4 last:mb-0">
    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{title}</h4>
    {children}
  </div>
);

// Loading skeleton component with DialogContent wrapper
const MedicationDetailSkeleton = () => (
  <DialogContent className="w-[95vw] max-w-4xl h-[95vh] flex flex-col bg-white dark:bg-gray-900 p-0 gap-0">
    <div className="animate-pulse">
      <DialogHeader className="px-6 py-4 border-b dark:border-gray-800">
        <div className="space-y-3">
          <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </DialogHeader>
      <div className="p-6 space-y-6">
        <div className="flex flex-wrap gap-2">
          <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="h-6 w-28 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 w-4/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </DialogContent>
);

// Error state component
const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <DialogContent className="w-[95vw] max-w-4xl h-[95vh] flex flex-col bg-white dark:bg-gray-900 p-0 gap-0">
    <div className="flex-1 flex items-center justify-center">
      <div className="p-6 flex flex-col items-center justify-center text-center space-y-4">
        <div className="p-3 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Error Loading Medication Details</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{error}</p>
        </div>
        <button
          onClick={onRetry}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  </DialogContent>
);

// Main modal component
export default function MedicationDetailModal({ medication, isOpen, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle retry
  const handleRetry = () => {
    setError(null);
    setLoading(true);
    // Implement retry logic here if needed
    setLoading(false);
  };

  // Helper function to safely check array length
  const hasItems = (arr: any[] | undefined | null): arr is any[] => 
    Array.isArray(arr) && arr.length > 0;

  // Safe render functions that handle undefined arrays
  const renderListItems = (items: string[] | undefined | null, renderFn: (item: string, index: number) => JSX.Element) => {
    if (!hasItems(items)) return null;
    return items.map(renderFn);
  };

  const renderBadgeItem = (text: string, index: number) => (
    <Badge key={index} variant="outline" className="text-xs">{text}</Badge>
  );

  const renderListItem = (text: string, index: number) => (
    <li key={index} className="text-gray-700 dark:text-gray-300">{text}</li>
  );

  if (!medication) return null;
  
  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <MedicationDetailSkeleton />
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <ErrorState error={error} onRetry={handleRetry} />
      </Dialog>
    );
  }

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={onClose}
      aria-label={`${medication.name} Details`}
    >
      <DialogContent 
        className="w-[95vw] max-w-4xl h-[95vh] flex flex-col bg-white dark:bg-gray-900 p-0 gap-0"
        role="dialog"
        aria-modal="true"
        aria-labelledby="medication-title"
        aria-describedby="medication-description"
      >
        <DialogHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <DialogTitle className="text-xl font-bold flex items-center justify-between">
            <span>{medication.name}</span>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="space-y-6">
            {/* Basic Info Section */}
            <Section title="Basic Information">
              <div className="flex flex-wrap gap-2">
                {medication.brand_names.map((name, index) => (
                  <Badge key={index} variant="outline">{name}</Badge>
                ))}
              </div>
            </Section>

            {/* Side Effects Section */}
            {medication.side_effects && (
              <Section title="Side Effects" icon={<AlertTriangle className="h-5 w-5 text-gray-500" />}>
                <div className="space-y-4">
                  {hasItems(medication.side_effects.common) && (
                    <SubSection title="Common Side Effects">
                      <ul className="list-disc list-inside">
                        {renderListItems(medication.side_effects.common, renderListItem)}
                      </ul>
                    </SubSection>
                  )}

                  {hasItems(medication.side_effects.severe) && (
                    <SubSection title="Severe Side Effects">
                      <ul className="list-disc list-inside">
                        {renderListItems(medication.side_effects.severe, renderListItem)}
                      </ul>
                    </SubSection>
                  )}

                  {hasItems(medication.side_effects.monitoring) && (
                    <SubSection title="Monitoring">
                      <ul className="list-disc list-inside">
                        {renderListItems(medication.side_effects.monitoring, renderListItem)}
                      </ul>
                    </SubSection>
                  )}

                  {hasItems(medication.side_effects.management) && (
                    <SubSection title="Management">
                      <ul className="list-disc list-inside">
                        {renderListItems(medication.side_effects.management, renderListItem)}
                      </ul>
                    </SubSection>
                  )}
                </div>
              </Section>
            )}

            {/* Monitoring Section */}
            {(hasItems(medication.monitoring?.parameters) || hasItems(medication.routine_monitoring)) && (
              <Section title="Monitoring" icon={<BarChart className="h-5 w-5 text-gray-500" />}>
                {hasItems(medication.monitoring?.parameters) && (
                  <SubSection title="Parameters">
                    <div className="flex flex-wrap gap-2">
                      {renderListItems(medication.monitoring.parameters, renderBadgeItem)}
                    </div>
                  </SubSection>
                )}

                {hasItems(medication.routine_monitoring) && (
                  <SubSection title="Routine Monitoring">
                    <div className="flex flex-wrap gap-2">
                      {renderListItems(medication.routine_monitoring, renderBadgeItem)}
                    </div>
                  </SubSection>
                )}
              </Section>
            )}

            {/* Interactions Section */}
            {(hasItems(medication.interactions?.contraindications) || hasItems(medication.interactions?.precautions)) && (
              <Section title="Interactions & Precautions" icon={<AlertTriangle className="h-5 w-5 text-gray-500" />}>
                {hasItems(medication.interactions?.contraindications) && (
                  <SubSection title="Contraindications">
                    <ul className="list-disc list-inside">
                      {renderListItems(medication.interactions.contraindications, renderListItem)}
                    </ul>
                  </SubSection>
                )}

                {hasItems(medication.interactions?.precautions) && (
                  <SubSection title="Precautions">
                    <ul className="list-disc list-inside">
                      {renderListItems(medication.interactions.precautions, renderListItem)}
                    </ul>
                  </SubSection>
                )}
              </Section>
            )}

            {/* Pre-treatment Tests */}
            {hasItems(medication.pre_treatment_tests) && (
              <Section title="Pre-treatment Tests" icon={<Clock className="h-5 w-5 text-gray-500" />}>
                <div className="flex flex-wrap gap-2">
                  {renderListItems(medication.pre_treatment_tests, renderBadgeItem)}
                </div>
              </Section>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}