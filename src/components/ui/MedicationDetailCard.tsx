import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Badge } from "./badge";
import { Section } from "./medication/Section";
import { TagList } from "./medication/TagList";
import { Pill, AlertTriangle, Clock, Beaker, Activity, Heart, Scale, BarChart } from "lucide-react";
import { format } from "date-fns";
import type { Medication } from "@/modules/cdu/types";

interface MedicationDetailCardProps {
  medication: Medication;
}

export function MedicationDetailCard({ medication }: MedicationDetailCardProps) {
  return (
    <Card className="overflow-hidden bg-white dark:bg-gray-800">
      <CardHeader className="border-b border-gray-100 dark:border-gray-700">
        <div className="flex flex-col gap-4">
          {/* Title and Brand Names */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
              <Pill className="h-5 w-5 text-white" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-xl">{medication.name}</CardTitle>
              {medication.brand_names.length > 0 && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {medication.brand_names.join(", ")}
                </p>
              )}
            </div>
          </div>

          {/* Classification Pills */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{medication.classification}</Badge>
            {medication.is_chemotherapy && (
              <Badge variant="secondary">Chemotherapy</Badge>
            )}
            {medication.is_immunotherapy && (
              <Badge variant="secondary">Immunotherapy</Badge>
            )}
            {medication.is_targeted_therapy && (
              <Badge variant="secondary">Targeted Therapy</Badge>
            )}
            {medication.is_orphan_drug && (
              <Badge variant="secondary">Orphan Drug</Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 grid gap-6">
        {/* Black Box Warning */}
        {medication.black_box_warning && (
          <Section 
            title="⚠️ BLACK BOX WARNING" 
            variant="danger"
            icon={<AlertTriangle className="h-5 w-5" />}
          >
            <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
              {medication.black_box_warning}
            </div>
          </Section>
        )}

        {/* Summary */}
        {medication.summary && (
          <Section title="Summary">
            <p>{medication.summary}</p>
          </Section>
        )}

        {/* Mechanism & Administration */}
        <Section title="Mechanism & Administration" icon={<Beaker className="h-5 w-5" />}>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Mechanism of Action</h4>
              <p>{medication.mechanism}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Administration</h4>
              <p>{medication.administration}</p>
            </div>
          </div>
        </Section>

        {/* Indications */}
        <Section title="Indications" icon={<Activity className="h-5 w-5" />}>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Cancer Types</h4>
              <TagList items={medication.indications.cancer_types} variant="success" />
            </div>
            {medication.indications.staging && (
              <div>
                <h4 className="font-medium mb-2">Disease Stage</h4>
                <TagList items={medication.indications.staging} />
              </div>
            )}
            {medication.indications.biomarkers && (
              <div>
                <h4 className="font-medium mb-2">Biomarkers</h4>
                <TagList items={medication.indications.biomarkers} variant="outline" />
              </div>
            )}
          </div>
        </Section>

        {/* Dosing */}
        <Section title="Dosing" icon={<Scale className="h-5 w-5" />}>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Standard Dosing</h4>
              <p>{medication.dosing.standard}</p>
            </div>
            {medication.dosing.schedule && (
              <div>
                <h4 className="font-medium mb-2">Schedule</h4>
                <p>{medication.dosing.schedule}</p>
              </div>
            )}
            {medication.dosing.adjustments && (
              <div>
                <h4 className="font-medium mb-2">Dose Adjustments</h4>
                <TagList items={medication.dosing.adjustments} variant="warning" />
              </div>
            )}
          </div>
        </Section>

        {/* Side Effects */}
        <Section title="Side Effects & Monitoring" icon={<Heart className="h-5 w-5" />}>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Common Side Effects</h4>
              <TagList items={medication.side_effects.common} />
            </div>
            <div>
              <h4 className="font-medium mb-2">Severe Side Effects</h4>
              <TagList items={medication.side_effects.severe} variant="warning" />
            </div>
          </div>
        </Section>

        {/* Monitoring */}
        <Section title="Monitoring Protocol" icon={<BarChart className="h-5 w-5" />}>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Baseline Tests</h4>
              <TagList items={medication.monitoring.baseline} />
            </div>
            <div>
              <h4 className="font-medium mb-2">Ongoing Monitoring</h4>
              <TagList items={medication.monitoring.ongoing} />
            </div>
            {medication.monitoring.frequency && (
              <div>
                <h4 className="font-medium mb-2">Monitoring Frequency</h4>
                <p>{medication.monitoring.frequency}</p>
              </div>
            )}
          </div>
        </Section>

        {/* Drug Interactions */}
        <Section title="Drug Interactions">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Interacting Drugs</h4>
              <TagList items={medication.interactions.drugs} variant="warning" />
            </div>
            <div>
              <h4 className="font-medium mb-2">Contraindications</h4>
              <TagList items={medication.interactions.contraindications} variant="warning" />
            </div>
          </div>
        </Section>

        {/* Special Considerations */}
        {medication.special_considerations && (
          <Section title="Special Considerations">
            <div className="space-y-4">
              {medication.special_considerations.pregnancy && (
                <div>
                  <h4 className="font-medium mb-2">Pregnancy</h4>
                  <p>{medication.special_considerations.pregnancy}</p>
                </div>
              )}
              {medication.special_considerations.elderly && (
                <div>
                  <h4 className="font-medium mb-2">Elderly Patients</h4>
                  <p>{medication.special_considerations.elderly}</p>
                </div>
              )}
            </div>
          </Section>
        )}

        {/* Reference Sources */}
        <Section title="References" icon={<Clock className="h-5 w-5" />}>
          <div className="space-y-4">
            <TagList items={medication.reference_sources} variant="outline" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {format(new Date(medication.updated_at), "MMMM d, yyyy")}
            </p>
          </div>
        </Section>
      </CardContent>
    </Card>
  );
}