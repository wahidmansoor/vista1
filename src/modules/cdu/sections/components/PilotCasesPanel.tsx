import React from 'react';
import { Beaker, ChevronRight, AlertCircle, Info, CheckCircle2 } from 'lucide-react';
import { pilotCases, PilotCase } from '../pilot/sampleCases';

interface PilotCasesPanelProps {
  onLoadCase: (pilotCase: PilotCase) => void;
  currentActiveCaseId?: string;
}

const PilotCasesPanel: React.FC<PilotCasesPanelProps> = ({ onLoadCase, currentActiveCaseId }) => {
  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg">
            <Beaker className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">CDS Pilot Testing Harness</h3>
            <p className="text-xs text-slate-500">Representative oncology cases for deterministic validation</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-full">
          <AlertCircle className="h-3 w-3 text-amber-600 dark:text-amber-400" />
          <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">Internal Pilot Only</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pilotCases.map((pc) => (
          <button
            key={pc.id}
            onClick={() => onLoadCase(pc)}
            className={`flex flex-col text-left p-4 rounded-xl border transition-all ${
              currentActiveCaseId === pc.id
                ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-400 dark:border-indigo-500 ring-1 ring-indigo-400'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-400'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{pc.name}</span>
              {currentActiveCaseId === pc.id && <CheckCircle2 className="h-4 w-4 text-indigo-600" />}
            </div>
            <p className="text-[10px] text-slate-500 line-clamp-2 mb-3 h-8">
              {pc.description}
            </p>
            <div className="mt-auto flex items-center justify-between">
              <span className="text-[9px] font-medium text-slate-400">Load Case Data</span>
              <ChevronRight className="h-3 w-3 text-slate-300" />
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 flex items-start gap-3">
        <Info className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
        <p className="text-[10px] text-slate-500 leading-relaxed">
          <strong>Usage Instructions:</strong> Loading a pilot case will overwrite the current form state with representative clinical data. Use this harness to verify CDS logic across different malignancies and biomarker profiles. <strong>Not for clinical use.</strong>
        </p>
      </div>
    </div>
  );
};

export default PilotCasesPanel;
