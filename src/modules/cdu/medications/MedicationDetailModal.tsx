import React from 'react';
import { X } from 'lucide-react';
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

interface Props {
  medication: Medication | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function MedicationDetailModal({ medication, isOpen, onClose }: Props) {
  if (!medication) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[700px] w-[94vw] max-h-[90vh] flex flex-col bg-white dark:bg-gray-900">
        <DialogHeader className="border-b dark:border-gray-800">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {medication.name}
              </DialogTitle>
              {medication.brand_names?.length > 0 && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {medication.brand_names.join(', ')}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              aria-label="Close dialog"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            {/* Classification */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Classification</h3>
              <Badge variant="outline" className="text-sm">
                {medication.classification}
              </Badge>
            </div>

            {/* Indications */}
            {medication.indications && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Indications</h3>
                <div className="space-y-2">
                  {medication.indications?.cancer_types && medication.indications.cancer_types.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Cancer Types</h4>
                      <div className="flex flex-wrap gap-2">
                        {medication.indications.cancer_types.map((type, index) => (
                          <Badge key={index} variant="secondary">{type}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {medication.indications?.biomarkers && medication.indications.biomarkers.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Biomarkers</h4>
                      <div className="flex flex-wrap gap-2">
                        {medication.indications.biomarkers.map((marker, index) => (
                          <Badge key={index} variant="secondary">{marker}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Dosing */}
            {medication.dosing && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Dosing & Administration</h3>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4">
                  {medication.dosing.standard && (
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-1">Standard Dose</h4>
                      <p className="text-gray-600 dark:text-gray-400">{medication.dosing.standard}</p>
                    </div>
                  )}
                  {medication.dosing.schedule && (
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-1">Schedule</h4>
                      <p className="text-gray-600 dark:text-gray-400">{medication.dosing.schedule}</p>
                    </div>
                  )}
                  {medication.dosing?.adjustments && medication.dosing.adjustments.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-1">Dose Adjustments</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {medication.dosing.adjustments.map((adjustment, index) => (
                          <li key={index} className="text-gray-600 dark:text-gray-400">{adjustment}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Side Effects */}
            {medication.side_effects && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Side Effects</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {medication.side_effects?.common && medication.side_effects.common.length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Common</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {medication.side_effects.common.map((effect, index) => (
                          <li key={index} className="text-gray-600 dark:text-gray-400">{effect}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {medication.side_effects?.severe && medication.side_effects.severe.length > 0 && (
                    <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-4">
                      <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">Severe</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {medication.side_effects.severe.map((effect, index) => (
                          <li key={index} className="text-red-600 dark:text-red-400">{effect}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Monitoring */}
            {medication.monitoring && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Monitoring</h3>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4">
                  {medication.monitoring?.baseline && medication.monitoring.baseline.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-1">Baseline</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {medication.monitoring.baseline.map((item, index) => (
                          <li key={index} className="text-gray-600 dark:text-gray-400">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {medication.monitoring?.ongoing && medication.monitoring.ongoing.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-1">Ongoing</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {medication.monitoring.ongoing.map((item, index) => (
                          <li key={index} className="text-gray-600 dark:text-gray-400">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {medication.monitoring.frequency && (
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-1">Frequency</h4>
                      <p className="text-gray-600 dark:text-gray-400">{medication.monitoring.frequency}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Interactions */}
            {medication.interactions && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Drug Interactions</h3>
                {medication.interactions?.contraindications && medication.interactions.contraindications.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">Contraindications</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {medication.interactions.contraindications.map((item, index) => (
                        <li key={index} className="text-red-600 dark:text-red-400">{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {medication.interactions?.drugs && medication.interactions.drugs.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Interacting Medications</h4>
                    <div className="flex flex-wrap gap-2">
                      {medication.interactions.drugs.map((drug, index) => (
                        <Badge key={index} variant="outline">{drug}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Additional Info */}
            {medication.additional_info && Object.keys(medication.additional_info).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Additional Information</h3>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4">
                  {medication.additional_info?.warnings && medication.additional_info.warnings.length > 0 && (
                    <div>
                      <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-1">Warnings</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {medication.additional_info.warnings.map((warning, index) => (
                          <li key={index} className="text-amber-600 dark:text-amber-400">{warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {medication.additional_info.special_populations && (
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-1">Special Populations</h4>
                      <p className="text-gray-600 dark:text-gray-400">{medication.additional_info.special_populations}</p>
                    </div>
                  )}
                  {medication.additional_info.storage && (
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-1">Storage</h4>
                      <p className="text-gray-600 dark:text-gray-400">{medication.additional_info.storage}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
