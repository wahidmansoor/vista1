import React, { useMemo, useState } from 'react';
import { BarChart3, PieChart, ShieldAlert, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, History, Info, Table } from 'lucide-react';
import { validationInsightsService, ValidationInsights } from '../pilot/validationInsightsService';

const ValidationInsightsPanel: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const insights = useMemo(() => validationInsightsService.getInsights(), [isExpanded]);

  if (insights.totalEntries === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm mb-8">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Pilot Validation Insights</h3>
            <p className="text-[10px] text-slate-500 font-bold">Local Audit Only — {insights.totalEntries} validation entries recorded</p>
          </div>
        </div>
        {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
      </button>

      {isExpanded && (
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 space-y-8 animate-in slide-in-from-top-2 duration-300">
          {/* Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase">Correct</span>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{insights.correctnessCounts.correct}</div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase">Partial</span>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{insights.correctnessCounts.partially_correct}</div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <ShieldAlert className="h-4 w-4 text-red-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase">Incorrect</span>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{insights.correctnessCounts.incorrect}</div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-4 w-4 text-indigo-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase">Issues Logged</span>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {Object.values(insights.issueCounts).reduce((a, b) => a + b, 0)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Case Level Summary */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <Table className="h-4 w-4 text-slate-400" />
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">Case-Level Summary</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px] text-left">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <th className="pb-2 text-slate-400 font-bold uppercase">Malignancy</th>
                      <th className="pb-2 text-slate-400 font-bold uppercase">Validations</th>
                      <th className="pb-2 text-slate-400 font-bold uppercase">Latest State</th>
                      <th className="pb-2 text-slate-400 font-bold uppercase">Audit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                    {insights.caseSummaries.map((cs) => (
                      <tr key={cs.caseId} className="group">
                        <td className="py-3 font-bold text-slate-700 dark:text-slate-200">{cs.caseTitle}</td>
                        <td className="py-3 text-slate-500">{cs.totalValidations}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            cs.latestCorrectness === 'correct' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                            cs.latestCorrectness === 'partially_correct' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30' :
                            'bg-red-100 text-red-700 dark:bg-red-900/30'
                          }`}>
                            {cs.latestCorrectness.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3">
                          {cs.hasSafetyConcern ? (
                            <span className="flex items-center gap-1 text-red-500 font-bold animate-pulse">
                              <ShieldAlert className="h-3 w-3" /> REVIEW NEEDED
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">No signals</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Issue Patterns */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <PieChart className="h-4 w-4 text-slate-400" />
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">Issue Patterns</h4>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Missing Options', count: insights.issueCounts.missingOptions, color: 'bg-indigo-500' },
                  { label: 'Incorr. Eligibility', count: insights.issueCounts.incorrectEligibility, color: 'bg-amber-500' },
                  { label: 'Unclear Output', count: insights.issueCounts.unclearOutput, color: 'bg-slate-400' },
                  { label: 'Safety Concerns', count: insights.issueCounts.unsafeWording, color: 'bg-red-500' }
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500">
                      <span>{item.label}</span>
                      <span>{item.count}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${item.color}`} 
                        style={{ width: `${insights.totalEntries > 0 ? (item.count / insights.totalEntries) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              {insights.safetySignals.length > 0 && (
                <div className="mt-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold text-[10px] mb-2">
                    <History className="h-3 w-3" /> SAFETY SIGNALS LOGGED
                  </div>
                  <ul className="space-y-1">
                    {insights.safetySignals.slice(0, 3).map((s, idx) => (
                      <li key={idx} className="text-[9px] text-red-600 dark:text-red-300 leading-tight">
                        • {s.caseTitle}: {s.notes || "Human review needed"}
                      </li>
                    ))}
                    {insights.safetySignals.length > 3 && (
                      <li className="text-[9px] text-slate-400 italic">+{insights.safetySignals.length - 3} more signals</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidationInsightsPanel;
