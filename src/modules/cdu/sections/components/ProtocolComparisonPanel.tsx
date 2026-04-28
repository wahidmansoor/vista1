import React from 'react';
import { TreatmentProtocol } from '../types/diseaseProgress.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Check, AlertCircle, Info, Beaker, ClipboardList, Activity } from 'lucide-react';

interface ProtocolComparisonPanelProps {
  protocols: TreatmentProtocol[];
  onRemove: (protocol: TreatmentProtocol) => void;
  onClear: () => void;
}

export const ProtocolComparisonPanel: React.FC<ProtocolComparisonPanelProps> = ({
  protocols,
  onRemove,
  onClear
}) => {
  if (protocols.length === 0) return null;

  return (
    <Card className="mb-6 border-indigo-200 bg-indigo-50/30 overflow-hidden">
      <CardHeader className="bg-indigo-100/50 py-3 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-indigo-700" />
          <CardTitle className="text-sm font-bold text-indigo-900 uppercase tracking-wider">
            Protocol Comparison Evaluation ({protocols.length}/3)
          </CardTitle>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClear}
          className="h-7 text-xs font-semibold text-indigo-700 hover:text-indigo-900 hover:bg-indigo-200/50"
        >
          Clear All
        </Button>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-white border-b border-indigo-100">
              <th className="p-3 font-semibold text-slate-500 w-1/4">Criteria</th>
              {protocols.map(p => (
                <th key={p.id} className="p-3 font-bold text-slate-900 border-l border-indigo-50 relative group">
                  <div className="flex flex-col">
                    <span className="text-xs text-indigo-600 font-mono mb-1">{p.id}</span>
                    <span className="line-clamp-2 min-h-[2.5rem]">{p.name}</span>
                  </div>
                  <button 
                    onClick={() => onRemove(p)}
                    title={`Remove ${p.name} from comparison`}
                    className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white/50">
            {/* Regimen Info */}
            <tr className="border-b border-slate-100">
              <td className="p-3 bg-slate-50/50 font-medium text-slate-700">
                <div className="flex items-center gap-1.5">
                  <Beaker className="h-3.5 w-3.5 text-slate-400" /> Key Agents
                </div>
              </td>
              {protocols.map(p => (
                <td key={p.id} className="p-3 border-l border-slate-100">
                  <div className="flex flex-wrap gap-1">
                    {p.agents.map((a, i) => (
                      <span key={i} className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[11px] text-slate-600">
                        {a}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            {/* Evidence & Line */}
            <tr className="border-b border-slate-100">
              <td className="p-3 bg-slate-50/50 font-medium text-slate-700">
                <div className="flex items-center gap-1.5">
                  <ClipboardList className="h-3.5 w-3.5 text-slate-400" /> Guideline Data
                </div>
              </td>
              {protocols.map(p => (
                <td key={p.id} className="p-3 border-l border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs">
                      <span className="font-semibold px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-100">
                        {p.evidenceLevel}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Line: {p.lineOfTherapy.join(', ') || 'N/A'} | {p.treatmentIntent}
                    </div>
                  </div>
                </td>
              ))}
            </tr>

            {/* Administration / Monitoring */}
            <tr className="border-b border-slate-100">
              <td className="p-3 bg-slate-50/50 font-medium text-slate-700">
                <div className="flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-slate-400" /> Monitoring
                </div>
              </td>
              {protocols.map(p => (
                <td key={p.id} className="p-3 border-l border-slate-100 align-top">
                  {p.monitoringRequirements && p.monitoringRequirements.length > 0 ? (
                    <ul className="list-disc pl-4 space-y-1">
                      {p.monitoringRequirements.slice(0, 3).map((req, i) => (
                        <li key={i} className="text-[11px] text-slate-600 leading-tight">{req}</li>
                      ))}
                      {p.monitoringRequirements.length > 3 && (
                        <li className="text-[10px] text-slate-400 italic">+{p.monitoringRequirements.length - 3} more...</li>
                      )}
                    </ul>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">Standard protocol monitoring</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Contraindications */}
            <tr>
              <td className="p-3 bg-slate-50/50 font-medium text-slate-700">
                <div className="flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5 text-red-400" /> Red Flags
                </div>
              </td>
              {protocols.map(p => (
                <td key={p.id} className="p-3 border-l border-slate-100 align-top">
                  {p.contraindications && p.contraindications.length > 0 ? (
                    <ul className="list-disc pl-4 space-y-1">
                      {p.contraindications.map((c, i) => (
                        <li key={i} className="text-[11px] text-red-700 leading-tight font-medium">{c}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex items-center gap-1 text-[11px] text-green-600">
                      <Check className="h-3 w-3" /> None listed
                    </div>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
        <div className="p-3 bg-indigo-50/50 border-t border-indigo-100">
          <p className="text-[10px] text-indigo-700 italic flex items-center gap-1">
            <Info className="h-3 w-3" /> Side-by-side comparison for clinical evaluation. Total 3 candidates allowed.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
