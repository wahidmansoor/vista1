import React, { useState } from 'react';
import {
  X, AlertTriangle, Pill, Brain, Activity,
  Beaker, Heart, Clock, Scale, BarChart,
  Loader2
} from 'lucide-react';
import type { Medication } from './../types';
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

// Types for array elements
interface SideEffect {
  type: string;
  description: string;
  severity?: string;
}

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

// Reusable section component
const Section: React.FC<{
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}> = ({ title, icon, children }) => (
  <div className="relative border border-gray-100 dark:border-gray-800 rounded-xl bg-gradient-to-b from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50 p-6 backdrop-blur shadow-sm">
    <div className="flex items-center gap-3 mb-4">
      {icon && <div className="p-2 bg-gray-100/80 dark:bg-gray-800/80 rounded-lg">{icon}</div>}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
        {title}
      </h3>
    </div>
    {children}
  </div>
);

// Reusable subsection component
const SubSection: React.FC<{
  title: string;
  children: React.ReactNode;
  variant?: 'default' | 'warning' | 'danger';
}> = ({ title, children, variant = 'default' }) => (
  <div className={cn(
    'rounded-lg p-4 backdrop-blur-sm',
    variant === 'warning' && 'bg-yellow-100/30 dark:bg-yellow-900/30 border border-yellow-200/50 dark:border-yellow-700/50',
    variant === 'danger' && 'bg-red-100/30 dark:bg-red-900/30 border border-red-200/50 dark:border-red-700/50',
    variant === 'default' && 'bg-gray-100/30 dark:bg-gray-800/30 border border-gray-200/50 dark:border-gray-700/50'
  )}>
    <div className="flex items-center gap-2 mb-3">
      <h4 className={cn(
        'text-sm font-medium',
        variant === 'warning' && 'text-yellow-800 dark:text-yellow-200',
        variant === 'danger' && 'text-red-800 dark:text-red-200',
        variant === 'default' && 'text-gray-900 dark:text-gray-100'
      )}>
        {title}
      </h4>
    </div>
    <div className="text-sm text-gray-700 dark:text-gray-300">
      {children}
    </div>
  </div>
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

  return (    <Dialog 
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
        <DialogHeader className="px-6 py-4 border-b dark:border-gray-800 sticky top-0 z-10 bg-white dark:bg-gray-900 backdrop-blur-sm bg-opacity-90">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">              <DialogTitle 
                id="medication-title"
                className="text-2xl font-bold text-gray-900 dark:text-gray-50 truncate"
              >
                {medication.name}
              </DialogTitle>
              <p id="medication-description" className="sr-only">Detailed information about the medication, including dosing, side effects, and monitoring.</p>
              {medication.brand_names?.length > 0 && (
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {medication.brand_names.join(', ')}
                </p>
              )}
            </div>            <button
              onClick={onClose}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onClose();
                }
              }}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300 transition-colors rounded-full p-2 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              aria-label="Close medication details"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>        <ScrollArea className="flex-1 h-[calc(95vh-4rem)] overflow-y-auto" role="region" aria-label="Medication details">
          <div className="p-6 space-y-8">
            {/* Header Tags */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="px-2.5 py-1 whitespace-nowrap">
                {medication.classification}
              </Badge>
              {medication.is_chemotherapy && (
                <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300">
                  <Activity className="w-3.5 h-3.5 mr-1" />
                  Chemotherapy
                </Badge>
              )}
              {medication.is_immunotherapy && (
                <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:bg-green-500/20 dark:text-green-300">
                  <Brain className="w-3.5 h-3.5 mr-1" />
                  Immunotherapy
                </Badge>
              )}
              {medication.is_targeted_therapy && (
                <Badge variant="secondary" className="bg-purple-500/10 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300">
                  <Pill className="w-3.5 h-3.5 mr-1" />
                  Targeted Therapy
                </Badge>
              )}
              {medication.is_orphan_drug && (
                <Badge variant="secondary" className="bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                  <Beaker className="w-3.5 h-3.5 mr-1" />
                  Orphan Drug
                </Badge>
              )}
            </div>            {/* Black Box Warning */}
            {medication.black_box_warning && (
              <div className="relative p-6 border-2 border-red-500 dark:border-red-700 bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/50 dark:to-red-900/30 rounded-xl shadow-lg backdrop-blur-sm">
                <div className="absolute -top-3 left-4 px-2 py-0.5 bg-red-500 text-white text-xs font-bold uppercase tracking-wider rounded">
                  Black Box Warning
                </div>
                <div className="flex gap-3 items-start mt-2">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-500 dark:text-red-400" />
                  <div className="flex-1 text-red-800 dark:text-red-200 whitespace-pre-wrap">
                    {medication.black_box_warning}
                  </div>
                </div>
              </div>
            )}

            {/* Overview */}
            {medication.mechanism && (
              <Section title="Mechanism of Action" icon={<Beaker className="h-5 w-5 text-blue-500" />}>
                <p className="text-gray-700 dark:text-gray-300">{medication.mechanism}</p>
                {medication.summary && (
                  <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">{medication.summary}</p>
                )}
              </Section>
            )}

            {/* Indications */}
            {medication.indications && (
              <Section title="Indications" icon={<Activity className="h-5 w-5 text-green-500" />}>
                <div className="grid gap-6 sm:grid-cols-2">
                  {medication.indications?.cancer_types?.length > 0 && (
                    <SubSection title="Cancer Types">
                      <div className="flex flex-wrap gap-2">
                        {medication.indications.cancer_types.map((type, index) => (
                          <Badge key={index} variant="secondary">{type}</Badge>
                        ))}
                      </div>
                    </SubSection>
                  )}
                  {medication.indications?.biomarkers?.length > 0 && (
                    <SubSection title="Biomarkers">
                      <div className="flex flex-wrap gap-2">
                        {medication.indications.biomarkers.map((marker, index) => (
                          <Badge key={index} variant="outline">{marker}</Badge>
                        ))}
                      </div>
                    </SubSection>
                  )}
                  {medication.indications?.staging?.length > 0 && (
                    <SubSection title="Disease Stage">
                      <div className="flex flex-wrap gap-2">
                        {medication.indications.staging.map((stage, index) => (
                          <Badge key={index} variant="secondary">{stage}</Badge>
                        ))}
                      </div>
                    </SubSection>
                  )}
                  {medication.indications?.line_of_therapy?.length > 0 && (
                    <SubSection title="Line of Therapy">
                      <div className="flex flex-wrap gap-2">
                        {medication.indications.line_of_therapy.map((line, index) => (
                          <Badge key={index} variant="secondary">{line}</Badge>
                        ))}
                      </div>
                    </SubSection>
                  )}
                </div>
              </Section>
            )}

            {/* Dosing */}
            {(medication.dosing || medication.administration) && (
              <Section title="Dosing & Administration" icon={<Scale className="h-5 w-5 text-blue-500" />}>
                <div className="space-y-4">
                  {medication.dosing?.standard && (
                    <SubSection title="Standard Dose">
                      <div className="space-y-2">
                        <p className="text-gray-700 dark:text-gray-300">{medication.dosing.standard}</p>
                        {medication.administration && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Administration: {medication.administration}
                          </p>
                        )}
                      </div>
                    </SubSection>
                  )}
                  {medication.dosing?.schedule && (
                    <SubSection title="Schedule">
                      <div className="space-y-2">
                        <p className="text-gray-700 dark:text-gray-300">{medication.dosing.schedule}</p>
                        {medication.dosing.cycle_length && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Cycle Length: {medication.dosing.cycle_length}
                          </p>
                        )}
                        {medication.dosing.duration && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Duration: {medication.dosing.duration}
                          </p>
                        )}
                      </div>
                    </SubSection>
                  )}
                  {medication.dosing?.adjustments?.length > 0 && (
                    <SubSection title="Dose Adjustments" variant="warning">
                      <ul className="list-disc list-inside space-y-1">
                        {medication.dosing.adjustments.map((adjustment, index) => (
                          <li key={index} className="text-gray-700 dark:text-gray-300">{adjustment}</li>
                        ))}
                      </ul>
                    </SubSection>
                  )}
                </div>
              </Section>
            )}

            {/* Side Effects */}
            {medication.side_effects && (
              <Section title="Side Effects" icon={<Heart className="h-5 w-5 text-red-500" />}>
                <div className="grid gap-6 sm:grid-cols-2">
                  {medication.side_effects.common?.length > 0 && (
                    <SubSection title="Common Side Effects">
                      <ul className="list-disc list-inside space-y-1">
                        {medication.side_effects.common.map((effect, index) => (
                          <li key={index} className="text-gray-700 dark:text-gray-300">{effect}</li>
                        ))}
                      </ul>
                    </SubSection>
                  )}
                  {medication.side_effects.severe?.length > 0 && (
                    <SubSection title="Severe Side Effects" variant="danger">
                      <ul className="list-disc list-inside space-y-1">
                        {medication.side_effects.severe.map((effect, index) => (
                          <li key={index} className="text-red-700 dark:text-red-300">{effect}</li>
                        ))}
                      </ul>
                    </SubSection>
                  )}
                  {medication.side_effects.monitoring?.length > 0 && (
                    <SubSection title="Monitoring Required">
                      <ul className="list-disc list-inside space-y-1">
                        {medication.side_effects.monitoring.map((item, index) => (
                          <li key={index} className="text-gray-700 dark:text-gray-300">{item}</li>
                        ))}
                      </ul>
                    </SubSection>
                  )}
                  {medication.side_effects.management?.length > 0 && (
                    <SubSection title="Management">
                      <ul className="list-disc list-inside space-y-1">
                        {medication.side_effects.management.map((item, index) => (
                          <li key={index} className="text-gray-700 dark:text-gray-300">{item}</li>
                        ))}
                      </ul>
                    </SubSection>
                  )}
                </div>
              </Section>
            )}

            {/* Monitoring */}
            {medication.monitoring && (
              <Section title="Monitoring" icon={<BarChart className="h-5 w-5 text-indigo-500" />}>
                <div className="space-y-4">
                  {medication.pre_treatment_tests?.length > 0 && (
                    <SubSection title="Pre-Treatment Tests">
                      <ul className="list-disc list-inside space-y-1">
                        {medication.pre_treatment_tests.map((test, index) => (
                          <li key={index} className="text-gray-700 dark:text-gray-300">{test}</li>
                        ))}
                      </ul>
                    </SubSection>
                  )}
                  {medication.monitoring.baseline?.length > 0 && (
                    <SubSection title="Baseline Tests">
                      <ul className="list-disc list-inside space-y-1">
                        {medication.monitoring.baseline.map((test, index) => (
                          <li key={index} className="text-gray-700 dark:text-gray-300">{test}</li>
                        ))}
                      </ul>
                    </SubSection>
                  )}
                  {medication.monitoring.ongoing?.length > 0 && (
                    <SubSection title="Ongoing Monitoring">
                      <ul className="list-disc list-inside space-y-1">
                        {medication.monitoring.ongoing.map((test, index) => (
                          <li key={index} className="text-gray-700 dark:text-gray-300">{test}</li>
                        ))}
                      </ul>
                    </SubSection>
                  )}                  {medication.monitoring?.parameters?.length > 0 && (
                    <SubSection title="Parameters">
                      <ul className="list-disc list-inside space-y-1">
                        {medication.monitoring.parameters.map((param, index) => (
                          <li key={index} className="text-gray-700 dark:text-gray-300">{param}</li>
                        ))}
                      </ul>
                    </SubSection>
                  )}
                  {medication.monitoring?.frequency && (
                    <SubSection title="Frequency">
                      <p className="text-gray-700 dark:text-gray-300">{medication.monitoring.frequency}</p>
                    </SubSection>
                  )}
                </div>
              </Section>
            )}

            {/* Interactions */}
            {(medication.interactions || medication.contraindications?.length > 0) && (
              <Section title="Drug Interactions" icon={<Activity className="h-5 w-5 text-amber-500" />}>
                <div className="space-y-4">
                  {(medication.interactions?.contraindications?.length > 0 || medication.contraindications?.length > 0) && (
                    <SubSection title="Contraindications" variant="danger">
                      <ul className="list-disc list-inside space-y-1">
                        {[
                          ...(medication.interactions?.contraindications || []),
                          ...(medication.contraindications || [])
                        ].map((item, index) => (
                          <li key={index} className="text-red-700 dark:text-red-300">{item}</li>
                        ))}
                      </ul>
                    </SubSection>
                  )}                  {medication.interactions?.drugs?.length > 0 && (
                    <SubSection title="Interacting Medications">
                      <div className="flex flex-wrap gap-2">
                        {medication.interactions?.drugs?.map((drug, index) => (
                          <Badge key={index} variant="outline">{drug}</Badge>
                        ))}
                      </div>
                    </SubSection>
                  )}
                  {medication.interactions?.precautions?.length > 0 && (
                    <SubSection title="Precautions" variant="warning">
                      <ul className="list-disc list-inside space-y-1">
                        {medication.interactions?.precautions?.map((precaution, index) => (
                          <li key={index} className="text-amber-700 dark:text-amber-300">
                            {precaution}
                          </li>
                        ))}
                      </ul>
                    </SubSection>
                  )}
                </div>
              </Section>
            )}

            {/* Special Considerations */}
            {medication.special_considerations && (
              <Section title="Special Considerations" icon={<AlertTriangle className="h-5 w-5 text-orange-500" />}>
                <div className="space-y-4">
                  {medication.special_considerations.pregnancy && (
                    <SubSection title="Pregnancy">
                      <p className="text-gray-700 dark:text-gray-300">
                        {medication.special_considerations.pregnancy}
                      </p>
                    </SubSection>
                  )}
                  {medication.special_considerations.elderly && (
                    <SubSection title="Elderly">
                      <p className="text-gray-700 dark:text-gray-300">
                        {medication.special_considerations.elderly}
                      </p>
                    </SubSection>
                  )}
                  {medication.special_considerations.renal && (
                    <SubSection title="Renal Impairment">
                      <p className="text-gray-700 dark:text-gray-300">
                        {medication.special_considerations.renal}
                      </p>
                    </SubSection>
                  )}
                  {medication.special_considerations.hepatic && (
                    <SubSection title="Hepatic Impairment">
                      <p className="text-gray-700 dark:text-gray-300">
                        {medication.special_considerations.hepatic}
                      </p>
                    </SubSection>
                  )}                  {medication.special_considerations?.other?.length > 0 && (
                    <SubSection title="Other Considerations">
                      <ul className="list-disc list-inside space-y-1">
                        {medication.special_considerations?.other?.map((item, index) => (
                          <li key={index} className="text-gray-700 dark:text-gray-300">{item}</li>
                        ))}
                      </ul>
                    </SubSection>
                  )}
                </div>
              </Section>
            )}

            {/* Pharmacokinetics */}
            {medication.pharmacokinetics && (
              <Section title="Pharmacokinetics" icon={<Clock className="h-5 w-5 text-purple-500" />}>
                <div className="grid gap-4 sm:grid-cols-2">                  {medication.pharmacokinetics?.half_life && (
                    <SubSection title="Half-Life">
                      <p className="text-gray-700 dark:text-gray-300">
                        {medication.pharmacokinetics.half_life}
                      </p>
                    </SubSection>
                  )}
                  {medication.pharmacokinetics.metabolism && (
                    <SubSection title="Metabolism">
                      <p className="text-gray-700 dark:text-gray-300">
                        {medication.pharmacokinetics.metabolism}
                      </p>
                    </SubSection>
                  )}
                  {medication.pharmacokinetics.excretion && (
                    <SubSection title="Excretion">
                      <p className="text-gray-700 dark:text-gray-300">
                        {medication.pharmacokinetics.excretion}
                      </p>
                    </SubSection>
                  )}
                  {medication.pharmacokinetics.bioavailability && (
                    <SubSection title="Bioavailability">
                      <p className="text-gray-700 dark:text-gray-300">
                        {medication.pharmacokinetics.bioavailability}
                      </p>
                    </SubSection>
                  )}
                  {medication.pharmacokinetics.protein_binding && (
                    <SubSection title="Protein Binding">
                      <p className="text-gray-700 dark:text-gray-300">
                        {medication.pharmacokinetics.protein_binding}
                      </p>
                    </SubSection>
                  )}
                </div>
              </Section>
            )}

            {/* Sources and Routine Monitoring */}
            <div className="grid gap-6 sm:grid-cols-2">
              {medication.reference_sources?.length > 0 && (
                <Section title="References" icon={<Pill className="h-5 w-5 text-gray-500" />}>
                  <div className="flex flex-wrap gap-2">
                    {medication.reference_sources.map((source, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {source}
                      </Badge>
                    ))}
                  </div>
                </Section>
              )}
              {medication.routine_monitoring?.length > 0 && (
                <Section title="Routine Testing" icon={<BarChart className="h-5 w-5 text-gray-500" />}>
                  <ul className="list-disc list-inside space-y-1">
                    {medication.routine_monitoring.map((test, index) => (
                      <li key={index} className="text-gray-700 dark:text-gray-300">{test}</li>
                    ))}
                  </ul>
                </Section>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}