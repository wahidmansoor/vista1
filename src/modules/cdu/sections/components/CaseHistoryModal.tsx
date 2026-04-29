import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, Clock, FileText, Download, History, Scale, Share } from 'lucide-react';
import { CaseRecord, CaseSnapshot } from '../utils/caseStorageService';
import CaseComparisonModal from './CaseComparisonModal';
import CaseExportModal from './CaseExportModal';

interface CaseHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseRecord: CaseRecord;
  onLoadSnapshot: (snapshot: CaseSnapshot) => void;
}

const CaseHistoryModal: React.FC<CaseHistoryModalProps> = ({
  isOpen,
  onClose,
  caseRecord,
  onLoadSnapshot,
}) => {
  const [selectedSnapshotIds, setSelectedSnapshotIds] = useState<string[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const toggleSelection = (id: string) => {
    setSelectedSnapshotIds(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const getSelectedSnapshots = () => {
    return selectedSnapshotIds
      .map(id => caseRecord.snapshots.find(s => s.id === id)!)
      .sort((a, b) => a.version - b.version);
  };
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl transition-all border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                      <History className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <Dialog.Title className="text-xl font-bold text-slate-900 dark:text-white">
                        Case History Trail
                      </Dialog.Title>
                      <p className="text-sm text-slate-500">{caseRecord.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsExportOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-sm"
                    >
                      <Share className="h-4 w-4" />
                      Export Case
                    </button>
                    {selectedSnapshotIds.length === 2 && (
                      <button
                        onClick={() => setIsComparisonOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 dark:shadow-none animate-in zoom-in-95"
                      >
                        <Scale className="h-4 w-4" />
                        Compare Versions
                      </button>
                    )}
                    <button
                      onClick={onClose}
                      title="Close Modal"
                      className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="mb-4 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {selectedSnapshotIds.length === 2 
                      ? "2 versions selected for comparison" 
                      : selectedSnapshotIds.length === 1 
                        ? "Select one more version to compare" 
                        : "Select up to 2 versions to compare"}
                  </span>
                  {selectedSnapshotIds.length > 0 && (
                    <button 
                      onClick={() => setSelectedSnapshotIds([])}
                      className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                    >
                      Clear Selection
                    </button>
                  )}
                </div>

                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                  {[...caseRecord.snapshots].reverse().map((snapshot) => (
                    <div
                      key={snapshot.id}
                      onClick={() => toggleSelection(snapshot.id)}
                      className={`group p-4 rounded-xl border transition-all shadow-sm cursor-pointer ${
                        selectedSnapshotIds.includes(snapshot.id)
                          ? 'bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-400 dark:border-indigo-500 ring-1 ring-indigo-400'
                          : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold rounded-full uppercase tracking-wider">
                            Version {snapshot.version}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                            <Clock className="h-3 w-3" />
                            {new Date(snapshot.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onLoadSnapshot(snapshot);
                            onClose();
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition shadow-sm"
                        >
                          <Download className="h-3.5 w-3.5" />
                          Load Version
                        </button>
                      </div>

                      {snapshot.summary && (
                        <div className="flex items-start gap-2 p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                          <FileText className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 italic">
                            {snapshot.summary}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-3">
                  <div className="p-1 bg-amber-100 dark:bg-amber-800/30 rounded text-amber-600 dark:text-amber-400">
                    <Clock className="h-3.5 w-3.5" />
                  </div>
                  <p className="text-[11px] text-amber-800 dark:text-amber-300">
                    <strong>Audit Integrity:</strong> Case history is for clinical documentation support. Snapshots are immutable and represent the clinical state at the time of save. Verify all data before clinical use.
                  </p>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={onClose}
                    className="px-5 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
      {isComparisonOpen && selectedSnapshotIds.length === 2 && (
        <CaseComparisonModal 
          isOpen={isComparisonOpen}
          onClose={() => setIsComparisonOpen(false)}
          snapshotA={getSelectedSnapshots()[0]}
          snapshotB={getSelectedSnapshots()[1]}
        />
      )}
      {isExportOpen && (
        <CaseExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          caseRecord={caseRecord}
          comparisonSnapshots={selectedSnapshotIds.length === 2 ? getSelectedSnapshots() as [CaseSnapshot, CaseSnapshot] : undefined}
        />
      )}
    </Transition>
  );
};

export default CaseHistoryModal;
