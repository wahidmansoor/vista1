import React from 'react';
import type { Medication } from '@/modules/cdu/types';
import { Pill, TestTubes, AlertTriangle, Activity, Clock, Scale } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './card';

interface MedicationDetailCardProps {
  medication: Medication;
}

export function MedicationDetailCard({ medication }: MedicationDetailCardProps) {
  return (
    <Card className="overflow-hidden bg-white dark:bg-gray-800">
      <CardHeader className="border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
            <Pill className="h-5 w-5 text-white" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-xl">{medication.name}</CardTitle>
            {medication.brand_names.length > 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {medication.brand_names.join(', ')}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 grid gap-6">
        {/* Classification and Mechanism */}
        <section>
          <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
            🧬 Classification & Mechanism
          </h3>
          <div className="space-y-2">
            <p className="text-sm px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-md inline-block">
              {medication.classification}
            </p>
            {medication.mechanism && (
              <p className="text-sm text-gray-600 dark:text-gray-300">{medication.mechanism}</p>
            )}
          </div>
        </section>

        {/* Indications */}
        <section>
          <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
            <TestTubes className="h-5 w-5" />
            Indications
          </h3>
          {medication.indications.cancer_types && (
            <div className="flex flex-wrap gap-2">
              {medication.indications.cancer_types.map((type, index) => (
                <span
                  key={index}
                  className="px-2.5 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
                >
                  {type}
                </span>
              ))}
            </div>
          )}
        </section>

        {/* Dosing and Administration */}
        <section>
          <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
            <Scale className="h-5 w-5" />
            Dosing & Administration
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700 dark:text-gray-200">Standard Dosing</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">{medication.dosing.standard}</p>
              {medication.dosing.schedule && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Schedule: {medication.dosing.schedule}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700 dark:text-gray-200">Administration</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">{medication.administration}</p>
            </div>
          </div>
        </section>

        {/* Side Effects and Interactions */}
        <div className="grid sm:grid-cols-2 gap-6">
          <section>
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
              <AlertTriangle className="h-5 w-5" />
              Side Effects
            </h3>
            <div className="space-y-3">
              {medication.side_effects.common.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Common</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {medication.side_effects.common.map((effect, index) => (
                      <li key={index} className="text-gray-600 dark:text-gray-300">{effect}</li>
                    ))}
                  </ul>
                </div>
              )}
              {medication.side_effects.severe.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">Severe</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {medication.side_effects.severe.map((effect, index) => (
                      <li key={index} className="text-red-600 dark:text-red-300">{effect}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>

          <section>
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
              ⚠️ Interactions & Contraindications
            </h3>
            <div className="space-y-3">
              {medication.interactions.drugs.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Drug Interactions</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {medication.interactions.drugs.map((drug, index) => (
                      <li key={index} className="text-gray-600 dark:text-gray-300">{drug}</li>
                    ))}
                  </ul>
                </div>
              )}
              {medication.interactions.contraindications.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Contraindications</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {medication.interactions.contraindications.map((item, index) => (
                      <li key={index} className="text-gray-600 dark:text-gray-300">{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Monitoring */}
        <section>
          <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
            <Activity className="h-5 w-5" />
            Monitoring
          </h3>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">Baseline Tests</h4>
              {medication.monitoring.baseline.length > 0 ? (
                <ul className="list-disc list-inside text-sm space-y-1">
                  {medication.monitoring.baseline.map((test, index) => (
                    <li key={index} className="text-gray-600 dark:text-gray-300">{test}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No baseline tests specified</p>
              )}
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">Ongoing Monitoring</h4>
              {medication.monitoring.ongoing.length > 0 ? (
                <ul className="list-disc list-inside text-sm space-y-1">
                  {medication.monitoring.ongoing.map((test, index) => (
                    <li key={index} className="text-gray-600 dark:text-gray-300">{test}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No ongoing monitoring specified</p>
              )}
              {medication.monitoring.frequency && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  <Clock className="h-4 w-4 inline-block mr-1" />
                  Frequency: {medication.monitoring.frequency}
                </p>
              )}
            </div>
          </div>
        </section>
      </CardContent>
    </Card>
  );
}