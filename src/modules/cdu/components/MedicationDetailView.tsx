import React from 'react';
import { ArrowLeft, AlertTriangle, PlusCircle, MinusCircle, Clock, Activity, HeartPulse } from 'lucide-react';
import type { Medication } from '../../../types/medications';
import { Button } from '../../../components/ui/button';
import { DrugCard, Section, TagList, RichTextBlock } from './medicationComponents';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';

interface DetailViewProps {
  medication: Medication;
  onBack: () => void;
}

export const MedicationDetailView: React.FC<DetailViewProps> = ({ medication, onBack }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Library
        </Button>
      </div>

      <DrugCard medication={medication} />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="dosing">Dosing</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="safety">Safety</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="space-y-6">
            <Section title="Mechanism of Action" icon={Activity}>
              <RichTextBlock content={medication.mechanism} />
            </Section>

            {medication.indications?.cancer_types && (
              <Section title="Cancer Types">
                <TagList items={medication.indications.cancer_types} />
              </Section>
            )}

            {medication.pharmacokinetics && (
              <Section title="Pharmacokinetics">
                <RichTextBlock content={medication.pharmacokinetics} />
              </Section>
            )}
          </div>
        </TabsContent>

        <TabsContent value="dosing">
          <div className="space-y-6">
            <Section title="Standard Dosing" icon={PlusCircle}>
              <RichTextBlock content={medication.dosing.standard} />
            </Section>

            {medication.dosing.adjustments && (
              <Section title="Dose Modifications" icon={MinusCircle}>
                <TagList items={medication.dosing.adjustments} />
              </Section>
            )}

            <Section title="Administration" icon={Clock}>
              <RichTextBlock content={medication.administration} />
            </Section>
          </div>
        </TabsContent>

        <TabsContent value="monitoring">
          <div className="space-y-6">
            {medication.monitoring && (
              <>
                {medication.monitoring.labs && (
                  <Section title="Laboratory Tests">
                    <TagList items={medication.monitoring.labs} />
                  </Section>
                )}

                {medication.monitoring.frequency && (
                  <Section title="Monitoring Frequency">
                    <RichTextBlock content={medication.monitoring.frequency} />
                  </Section>
                )}

                {medication.monitoring.precautions && (
                  <Section title="Monitoring Precautions">
                    <TagList items={medication.monitoring.precautions} />
                  </Section>
                )}
              </>
            )}

            {medication.routine_monitoring && (
              <Section title="Routine Monitoring">
                <TagList items={medication.routine_monitoring} />
              </Section>
            )}
          </div>
        </TabsContent>

        <TabsContent value="safety">
          <div className="space-y-6">
            {medication.black_box_warning && (
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border-l-4 border-red-500">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="text-red-500 w-5 h-5" />
                  <h3 className="font-semibold text-red-700 dark:text-red-400">
                    Black Box Warning
                  </h3>
                </div>
                <RichTextBlock content={medication.black_box_warning} />
              </div>
            )}

            <Section title="Side Effects">
              <TagList items={medication.side_effects} />
            </Section>

            {medication.contraindications && (
              <Section title="Contraindications">
                <TagList items={medication.contraindications} />
              </Section>
            )}

            <Section title="Drug Interactions">
              <TagList items={medication.interactions} />
            </Section>

            {medication.special_considerations && (
              <Section title="Special Considerations">
                <RichTextBlock content={medication.special_considerations} />
              </Section>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {medication.reference_sources.length > 0 && (
        <div className="mt-8 pt-6 border-t">
          <Section title="References">
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
              {medication.reference_sources.map((ref, i) => (
                <li key={i}>{ref}</li>
              ))}
            </ul>
          </Section>
        </div>
      )}
    </div>
  );
};
