import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProtocolMatch, TreatmentProtocol } from '../types/diseaseProgress.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Lock, Info, AlertTriangle, BookOpen, Layers, PlusCircle, MinusCircle } from 'lucide-react';

interface ProtocolResultCardProps {
  match: ProtocolMatch;
  isComparing?: boolean;
  onToggleCompare?: (protocol: TreatmentProtocol) => void;
}

const ProtocolResultCard: React.FC<ProtocolResultCardProps> = ({ 
  match, 
  isComparing = false, 
  onToggleCompare 
}) => {
  const navigate = useNavigate();
  const { protocol, isEligible, status, warnings, rationale, matchedFactors } = match;

  const getStatusColor = (status: ProtocolMatch['status']) => {
    switch (status) {
      case 'Eligible option': return 'bg-green-100 text-green-800 border-green-200';
      case 'Potential option': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Not recommended':
      case 'Not eligible': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleKnowledgeClick = (anchor: string) => {
    // Map internal anchor names to handbook paths if needed
    // For now, naive mapping to handbook search or direct link
    navigate(`/handbook?search=${anchor}`);
  };

  return (
    <Card className={`mb-4 border-l-4 ${isEligible ? 'border-l-green-500' : status === 'Potential option' ? 'border-l-yellow-500' : 'border-l-red-500 shadow-none opacity-80'}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-muted-foreground">{protocol.id}</span>
              <Badge variant="outline" className={getStatusColor(status)}>
                {status}
              </Badge>
              {protocol.preferredOption && (
                <Badge className="bg-blue-600">Preferred</Badge>
              )}
            </div>
            <CardTitle className="text-lg font-bold text-slate-900">
              {protocol.name}
            </CardTitle>
            <div className="flex gap-3 mt-1 text-sm text-muted-foreground">
              <span>{protocol.treatmentIntent}</span>
              <span>•</span>
              <span>Line: {protocol.lineOfTherapy.join('/')}</span>
              <span>•</span>
              <span className="font-medium text-slate-700">{protocol.evidenceLevel}</span>
            </div>
          </div>
          {onToggleCompare && (
            <Button
              variant={isComparing ? "secondary" : "outline"}
              size="sm"
              className={`h-8 gap-1.5 ${isComparing ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100' : ''}`}
              onClick={() => onToggleCompare(protocol)}
            >
              {isComparing ? (
                <>
                  <MinusCircle className="h-3.5 w-3.5" /> Remove
                </>
              ) : (
                <>
                  <PlusCircle className="h-3.5 w-3.5" /> Compare
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        {/* Agents */}
        <div className="bg-slate-50 p-3 rounded-md border border-slate-100">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Key Regimen Components</h4>
          <div className="flex flex-wrap gap-1.5">
            {protocol.agents.map((agent, i) => (
              <span key={i} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-sm text-slate-700">
                {agent}
              </span>
            ))}
          </div>
        </div>

        {/* Rationale */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Clinical Rationale</h4>
          <p className="text-sm text-slate-700 leading-relaxed">{rationale}</p>
        </div>

        {/* Why This Match Matters (Knowledge Integration) */}
        {/* WHY THIS MATCHED (Eligible) */}
        {isEligible && matchedFactors && matchedFactors.length > 0 && (
          <div className="bg-green-50/50 p-3 rounded-md border border-green-100/50">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-green-700 mb-2 flex items-center gap-1.5">
              <Layers className="h-3 w-3" /> Why This Matched
            </h4>
            <ul className="list-disc pl-4 space-y-0.5">
              {matchedFactors.map((factor, i) => (
                <li key={i} className="text-xs font-medium text-green-800">
                  {factor}
                </li>
              ))}
            </ul>
            <p className="text-[10px] text-green-600 mt-2 italic font-medium">
              Matched based on strict clinical criteria from local dataset.
            </p>
          </div>
        )}

        {/* WHY NOT ELIGIBLE (Ineligible) */}
        {!isEligible && status === 'Not eligible' && (
          <div className="bg-red-50/50 p-3 rounded-md border border-red-100/50">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-red-700 mb-2 flex items-center gap-1.5">
              <AlertCircle className="h-3 w-3" /> Why Not Eligible
            </h4>
            <ul className="list-disc pl-4 space-y-0.5">
              {warnings
                .filter(w => w.startsWith('Mismatch:') || w.startsWith('Safety:'))
                .map((reason, i) => (
                  <li key={i} className="text-xs font-medium text-red-800">
                    {reason.replace(/^(Mismatch|Safety): /, '')}
                  </li>
                ))}
              {/* Fallback to protocol general warnings if no specific mismatches found */}
              {warnings.filter(w => w.startsWith('Mismatch:') || w.startsWith('Safety:')).length === 0 && (
                <li className="text-xs font-medium text-red-800">
                  Does not meet clinical criteria for this regimen.
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Knowledge Links (Biology / Concepts) */}
        {protocol.knowledgeLinks && protocol.knowledgeLinks.length > 0 && (
          <div className="pt-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <BookOpen className="h-3 w-3" /> Underlying Biology / Concepts
            </h4>
            <div className="flex flex-wrap gap-2">
              {protocol.knowledgeLinks.map((link, i) => (
                <button
                  key={i}
                  onClick={() => handleKnowledgeClick(link)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-100 border border-slate-200 hover:border-indigo-200 rounded-full text-xs font-medium text-slate-600 hover:text-indigo-700 transition-all flex items-center gap-1"
                >
                  <span className="text-[10px]">📖</span> {link.replace(/-/g, ' ')}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Warnings & Contraindications */}
        {(warnings.length > 0 || (protocol.contraindications && protocol.contraindications.length > 0)) && (
          <div className="space-y-2">
            {protocol.contraindications && protocol.contraindications.map((contra, i) => (
              <div key={i} className="flex items-start gap-2 p-2.5 bg-red-50 border border-red-100 rounded text-red-900">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div className="text-sm font-medium">Contraindication: {contra}</div>
              </div>
            ))}
            {warnings.map((warning, i) => (
                <div key={i} className="flex items-start gap-2 p-2.5 bg-amber-50 border border-amber-100 rounded text-amber-900">
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">{warning}</div>
                </div>
            ))}
          </div>
        )}

        {/* Monitoring */}
        {protocol.monitoringRequirements && protocol.monitoringRequirements.length > 0 && (
          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1">
              <Info className="h-3 w-3" /> Monitoring Requirements
            </h4>
            <ul className="list-disc pl-4 space-y-1">
              {protocol.monitoringRequirements.map((req, i) => (
                <li key={i} className="text-xs text-slate-600">{req}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Review Lock */}
        {protocol.clinicalReviewRequired && (
          <div className="pt-2 flex items-center gap-2 text-xs font-medium text-slate-500 italic border-t border-slate-50">
            <Lock className="h-3 w-3" />
            Final treatment decision requires oncologist review
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProtocolResultCard;
