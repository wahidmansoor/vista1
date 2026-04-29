import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, Clipboard, Check, Share, History, FileText, Scale } from 'lucide-react';
import { CaseRecord, CaseSnapshot } from '../utils/caseStorageService';
import { caseExportService } from '../utils/caseExportService';

interface CaseExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseRecord: CaseRecord;
  comparisonSnapshots?: [CaseSnapshot, CaseSnapshot];
}

const CaseExportModal: React.FC<CaseExportModalProps> = ({
  isOpen,
  onClose,
  caseRecord,
  comparisonSnapshots
}) => {
  const [includeHistory, setIncludeHistory] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const exportText = caseExportService.generateExportText(caseRecord, {
    includeHistory,
    comparisonSnapshots
  });

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(exportText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[120]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" />
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
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-3xl bg-white dark:bg-slate-900 p-8 shadow-2xl transition-all border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
                      <Share className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <Dialog.Title className="text-xl font-bold text-slate-900 dark:text-white">
                      Export Case Documentation
                    </Dialog.Title>
                  </div>
                  <button onClick={onClose} title="Close" className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition">
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Export Options</h3>
                    
                    <button
                      onClick={() => setIncludeHistory(!includeHistory)}
                      className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${
                        includeHistory 
                          ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800' 
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <History className={`h-5 w-5 ${includeHistory ? 'text-indigo-600' : 'text-slate-400'}`} />
                        <div className="text-left">
                          <div className={`text-sm font-bold ${includeHistory ? 'text-indigo-900 dark:text-indigo-200' : 'text-slate-700 dark:text-slate-200'}`}>Include Full History</div>
                          <div className="text-[10px] text-slate-500">Append all snapshot version metadata</div>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${includeHistory ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'}`}>
                        {includeHistory && <Check className="h-3 w-3 text-white" />}
                      </div>
                    </button>

                    <div className={`w-full p-4 rounded-xl border flex items-center gap-3 opacity-60 ${comparisonSnapshots ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-800'}`}>
                      <Scale className={`h-5 w-5 ${comparisonSnapshots ? 'text-green-600' : 'text-slate-400'}`} />
                      <div className="text-left">
                        <div className="text-sm font-bold text-slate-700 dark:text-slate-200">Eligibility Delta</div>
                        <div className="text-[10px] text-slate-500">
                          {comparisonSnapshots ? `Comparison v${comparisonSnapshots[0].version} → v${comparisonSnapshots[1].version} active` : 'Select 2 versions in History Trail to enable'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Preview Coverage</h3>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl space-y-2">
                       <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                         <Check className="h-3.5 w-3.5 text-green-500" /> Case ID & Metadata
                       </div>
                       <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                         <Check className="h-3.5 w-3.5 text-green-500" /> Detailed Clinical Inputs (Latest)
                       </div>
                       <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                         <Check className="h-3.5 w-3.5 text-green-500" /> Snapshot CDS Outputs
                       </div>
                       <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                         <Check className="h-3.5 w-3.5 text-green-500" /> Medical Safety Disclaimer
                       </div>
                    </div>
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute top-4 right-4 z-10">
                    <button
                      onClick={handleCopyToClipboard}
                      className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-md transition shadow-sm"
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-4 w-4 text-green-600" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Clipboard className="h-4 w-4" />
                          Copy to Clipboard
                        </>
                      )}
                    </button>
                  </div>
                  <div className="p-6 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 max-h-[30vh] overflow-y-auto custom-scrollbar font-mono text-[11px] leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                    {exportText}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 italic">
                    <FileText className="h-3 w-3" />
                    Plain-text documentation support only.
                  </div>
                  <button
                    onClick={onClose}
                    className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 dark:shadow-none"
                  >
                    Done
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

export default CaseExportModal;
