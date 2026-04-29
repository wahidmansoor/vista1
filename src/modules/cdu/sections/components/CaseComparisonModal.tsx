import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, Scale, AlertCircle, ArrowRight } from 'lucide-react';
import { CaseSnapshot } from '../utils/caseStorageService';
import { compareSnapshots, FieldChange, ListChange } from '../utils/compareSnapshots';

interface CaseComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  snapshotA: CaseSnapshot;
  snapshotB: CaseSnapshot;
}

const CaseComparisonModal: React.FC<CaseComparisonModalProps> = ({
  isOpen,
  onClose,
  snapshotA,
  snapshotB
}) => {
  const diff = compareSnapshots(snapshotA, snapshotB);

  const FieldRow = ({ change }: { change: FieldChange }) => (
    <div className={`grid grid-cols-2 gap-4 p-3 rounded-lg border ${change.status === 'changed' ? 'bg-yellow-50/50 border-yellow-200 dark:bg-yellow-900/10 dark:border-yellow-800' : 'border-slate-100 dark:border-slate-800'}`}>
      <div>
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter block mb-1">{change.label}</label>
        <div className="text-sm text-slate-600 dark:text-slate-400">{change.valA}</div>
      </div>
      <div className="border-l border-slate-200 dark:border-slate-700 pl-4">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter block mb-1">{change.label}</label>
        <div className={`text-sm font-medium ${change.status === 'changed' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}>
          {change.valB}
        </div>
      </div>
    </div>
  );

  const ListDiff = ({ change }: { change: ListChange }) => (
    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter block mb-2">{change.label}</label>
      <div className="space-y-1">
        {change.removed.map(item => (
          <div key={item} className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded flex items-center gap-2">
            <span className="font-bold">-</span> {item}
          </div>
        ))}
        {change.added.map(item => (
          <div key={item} className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded flex items-center gap-2">
            <span className="font-bold">+</span> {item}
          </div>
        ))}
        {change.unchanged.map(item => (
          <div key={item} className="text-xs text-slate-500 dark:text-slate-500 px-2 py-1">
            • {item}
          </div>
        ))}
        {change.added.length === 0 && change.removed.length === 0 && change.unchanged.length === 0 && (
          <div className="text-xs text-slate-400 italic">No record found.</div>
        )}
      </div>
    </div>
  );

  const EligibilityDelta = () => {
    const hasChanges = diff.protocolDifferences.newlyEligible.length > 0 || diff.protocolDifferences.noLongerEligible.length > 0;
    
    return (
      <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
          Eligibility Changes
        </h3>
        
        <div className="p-3 bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800 rounded-lg mb-6 flex items-start gap-2">
          <AlertCircle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="text-[10px] text-amber-800 dark:text-amber-300 italic">
            Eligibility changes are based on stored outputs only. Clinical interpretation and treatment decisions require clinician review.
          </p>
        </div>

        {!hasChanges ? (
          <div className="text-sm text-slate-500 italic py-4 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            No eligibility changes detected
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Newly Eligible</label>
              <div className="space-y-2">
                {diff.protocolDifferences.newlyEligible.map(p => (
                  <div key={p} className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="text-xs font-bold text-green-700 dark:text-green-300 mb-1">{p}</div>
                    <div className="text-[10px] text-green-600/70 dark:text-green-400/70 uppercase font-bold tracking-tighter">
                      Newly eligible — clinician review required
                    </div>
                  </div>
                ))}
                {diff.protocolDifferences.newlyEligible.length === 0 && (
                  <div className="text-xs text-slate-400 italic px-2">None</div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">No Longer Eligible</label>
              <div className="space-y-2">
                {diff.protocolDifferences.noLongerEligible.map(p => (
                  <div key={p} className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="text-xs font-bold text-red-700 dark:text-red-300 mb-1">{p}</div>
                    <div className="text-[10px] text-red-600/70 dark:text-red-400/70 uppercase font-bold tracking-tighter">
                      No longer eligible — clinician review required
                    </div>
                  </div>
                ))}
                {diff.protocolDifferences.noLongerEligible.length === 0 && (
                  <div className="text-xs text-slate-400 italic px-2">None</div>
                )}
              </div>
            </div>

            <div className="md:col-span-2 pt-4 border-t border-slate-200 dark:border-slate-800">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3">Still Eligible</label>
              <div className="flex flex-wrap gap-2">
                {diff.protocolDifferences.stillEligible.map(p => (
                  <span key={p} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-full">
                    {p}
                  </span>
                ))}
                {diff.protocolDifferences.stillEligible.length === 0 && (
                  <span className="text-xs text-slate-400 italic">None</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Transition grow show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[110]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-3xl bg-white dark:bg-slate-900 p-8 shadow-2xl transition-all border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl">
                      <Scale className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <Dialog.Title className="text-2xl font-bold text-slate-900 dark:text-white">
                        Snapshot Comparison
                      </Dialog.Title>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span>Version {diff.metadata.vA}</span>
                        <ArrowRight className="h-3 w-3" />
                        <span>Version {diff.metadata.vB}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={onClose} title="Close" className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-8 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 dark:text-amber-300">
                    <strong>Clinician Review Required:</strong> Version comparison is for documentation support only. Clinical interpretation of changes and decision-making requires active clinician review.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                  <div className="md:col-span-2 space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                      Structured Data Differences
                    </h3>
                    <FieldRow change={diff.clinicalDifferences.diagnosis} />
                    <FieldRow change={diff.clinicalDifferences.stage} />
                    <FieldRow change={diff.clinicalDifferences.histology} />
                    <FieldRow change={diff.clinicalDifferences.ecog} />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                      Lists & History
                    </h3>
                    <ListDiff change={diff.clinicalDifferences.biomarkers} />
                    <ListDiff change={diff.clinicalDifferences.treatmentLines} />
                  </div>
                </div>

                <EligibilityDelta />

                <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                  >
                    Close Comparison
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CaseComparisonModal;
