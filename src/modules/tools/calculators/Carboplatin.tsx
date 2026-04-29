import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AlertCircle, Copy, Check, ChevronLeft } from 'lucide-react';
import CalculatorDisclaimer from '../components/CalculatorDisclaimer';

/**
 * Carboplatin (Calvert) Calculator
 * Formula: Dose (mg) = Target AUC × (GFR + 25)
 * GFR Cap: 125 mL/min
 */

const CarboplatinCalculator: React.FC = () => {
  const navigate = useNavigate();
  const [auc, setAuc] = useState<string>('');
  const [gfr, setGfr] = useState<string>('');
  const [dose, setDose] = useState<number | null>(null);
  const [isCapped, setIsCapped] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const calculateDose = () => {
    setError(null);
    setDose(null);
    setIsCapped(false);

    const aucVal = parseFloat(auc);
    const gfrVal = parseFloat(gfr);

    if (isNaN(aucVal) || isNaN(gfrVal)) {
      return;
    }

    if (aucVal <= 0 || gfrVal <= 0) {
      setError('Please enter positive values for both Target AUC and GFR.');
      return;
    }

    // Apply GFR Cap of 125 mL/min
    const effectiveGfr = Math.min(gfrVal, 125);
    if (gfrVal > 125) {
      setIsCapped(true);
    }

    // Calvert Formula: Dose = AUC * (GFR + 25)
    const calculatedDose = aucVal * (effectiveGfr + 25);
    setDose(Math.round(calculatedDose));
  };

  useEffect(() => {
    calculateDose();
  }, [auc, gfr]);

  const handleCopy = () => {
    if (dose !== null) {
      navigator.clipboard.writeText(`${dose} mg`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <button
        onClick={() => navigate('/tools/calculators')}
        className="flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:underline mb-4"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Calculators
      </button>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            Carboplatin (Calvert) Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <CalculatorDisclaimer />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="auc">Target AUC</Label>
              <Input
                id="auc"
                type="number"
                placeholder="e.g. 5"
                value={auc}
                onChange={(e) => setAuc(e.target.value)}
                min="0"
                step="0.1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gfr">GFR (mL/min)</Label>
              <Input
                id="gfr"
                type="number"
                placeholder="e.g. 100"
                value={gfr}
                onChange={(e) => setGfr(e.target.value)}
                min="0"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md flex items-center gap-2 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {dose !== null && !error && (
            <div className="mt-8 p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800 text-center space-y-4">
              <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Calculated Carboplatin Dose
              </div>
              <div className="text-5xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-3">
                {dose} <span className="text-2xl font-medium text-gray-500">mg</span>
              </div>

              {isCapped && (
                <div className="text-sm text-amber-600 dark:text-amber-400 font-medium flex items-center justify-center gap-1">
                  <AlertCircle size={14} />
                  GFR capped at 125 mL/min for carboplatin dose estimation.
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="mt-2"
              >
                {copied ? <Check size={14} className="mr-2 text-green-500" /> : <Copy size={14} className="mr-2" />}
                {copied ? 'Copied' : 'Copy result'}
              </Button>
            </div>
          )}

          <div className="text-xs text-gray-500 space-y-2 pt-4 border-t border-gray-100 dark:border-gray-800">
            <p><strong>Note:</strong> Most clinical protocols recommend capping the GFR/CrCl at 125 mL/min when using the Calvert formula to avoid toxicity.</p>
            <p><strong>Verification:</strong> Carboplatin dosing must follow institutional protocol and clinician verification.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CarboplatinCalculator;
