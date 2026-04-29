import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, ThumbsUp, MessageSquare, ShieldAlert } from 'lucide-react';
import { validationLogService, ValidationEntry } from '../pilot/validationLogService';
import { useToast } from "@/components/ui/use-toast";

interface ValidationPanelProps {
  caseId: string;
  caseTitle: string;
  snapshotVersion: number;
  onSubmitted: () => void;
  onSkip: () => void;
}

const ValidationPanel: React.FC<ValidationPanelProps> = ({
  caseId,
  caseTitle,
  snapshotVersion,
  onSubmitted,
  onSkip
}) => {
  const { toast } = useToast();
  const [correctness, setCorrectness] = useState<ValidationEntry['correctness'] | ''>('');
  const [issues, setIssues] = useState({
    missingOptions: false,
    incorrectEligibility: false,
    unclearOutput: false,
    safetyConcern: false
  });
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (!correctness) {
      toast({
        title: "Input Required",
        description: "Please select a clinical correctness rating.",
        variant: "destructive"
      });
      return;
    }

    const entry: ValidationEntry = {
      caseId,
      caseTitle,
      timestamp: new Date().toISOString(),
      snapshotVersion,
      correctness: correctness as ValidationEntry['correctness'],
      issues: {
        unclearOutput: issues.unclearOutput || undefined,
        unsafeWording: issues.safetyConcern || undefined,
        // Detailed array mappings could be added here if fields were provided
        missingOptions: issues.missingOptions ? ['Observed missing options'] : undefined,
        incorrectEligibility: issues.incorrectEligibility ? ['Observed incorrect eligibility'] : undefined,
      },
      notes
    };

    validationLogService.saveValidation(entry);
    
    toast({
      title: "Validation Saved",
      description: "Clinical feedback has been recorded for the pilot audit.",
    });
    
    onSubmitted();
  };

  return (
    <div className="mt-8 bg-indigo-50/50 dark:bg-indigo-900/10 border-2 border-indigo-100 dark:border-indigo-800/30 rounded-2xl p-6 transition-all">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-600 rounded-lg text-white">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Clinical Validation Feedback</h3>
          <p className="text-xs text-slate-500">Record clinical correctness for pilot case v{snapshotVersion}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Correctness */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-200 block mb-2">
            Is output clinically correct?
          </label>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setCorrectness('correct')}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                correctness === 'correct' 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-300 ring-1 ring-green-500' 
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-green-300'
              }`}
            >
              <CheckCircle className={`h-5 w-5 ${correctness === 'correct' ? 'text-green-500' : 'text-slate-400'}`} />
              <span className="text-sm font-bold text-left flex-1">Correct</span>
              {correctness === 'correct' && <ThumbsUp className="h-4 w-4" />}
            </button>

            <button
              onClick={() => setCorrectness('partially_correct')}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                correctness === 'partially_correct' 
                  ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-500 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500' 
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-amber-300'
              }`}
            >
              <AlertTriangle className={`h-5 w-5 ${correctness === 'partially_correct' ? 'text-amber-500' : 'text-slate-400'}`} />
              <span className="text-sm font-bold text-left flex-1">Partially Correct</span>
            </button>

            <button
              onClick={() => setCorrectness('incorrect')}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                correctness === 'incorrect' 
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-300 ring-1 ring-red-500' 
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-red-300'
              }`}
            >
              <XCircle className={`h-5 w-5 ${correctness === 'incorrect' ? 'text-red-500' : 'text-slate-400'}`} />
              <span className="text-sm font-bold text-left flex-1">Incorrect</span>
            </button>
          </div>
        </div>

        {/* Right Column: Issues & Notes */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-200 block mb-2">
            Issues observed:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'missingOptions', label: 'Missing option' },
              { id: 'incorrectEligibility', label: 'Incorrect eligibility' },
              { id: 'unclearOutput', label: 'Output unclear' },
              { id: 'safetyConcern', label: 'Safety concern' }
            ].map((issue) => (
              <label key={issue.id} className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 cursor-pointer hover:bg-slate-50 transition">
                <input
                  type="checkbox"
                  checked={issues[issue.id as keyof typeof issues]}
                  onChange={(e) => setIssues(prev => ({ ...prev, [issue.id]: e.target.checked }))}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">{issue.label}</span>
              </label>
            ))}
          </div>

          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-4 w-4 text-slate-400" />
              <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Clinical notes:</label>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Provide context for partial or incorrect results..."
              rows={3}
              className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 transition-all custom-scrollbar"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-indigo-100 dark:border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-2 text-[10px] text-slate-500 italic">
          <Info className="h-3 w-3" />
          Feedback is stored locally for quality audit and development.
        </div>
        <div className="flex gap-3">
          <button
            onClick={onSkip}
            className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition"
          >
            Skip Feedback
          </button>
          <button
            onClick={handleSave}
            className="px-8 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 dark:shadow-none"
          >
            Save Validation
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValidationPanel;
