import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pill, RotateCcw, Info, AlertTriangle, ChevronLeft } from 'lucide-react';
import CalculatorDisclaimer from '../components/CalculatorDisclaimer';

type SteroidType = 'hydrocortisone' | 'prednisone' | 'prednisolone' | 'methylprednisolone' | 'dexamethasone';

const STEROID_EQUIVALENTS: Record<SteroidType, number> = {
  hydrocortisone: 20,
  prednisone: 5,
  prednisolone: 5,
  methylprednisolone: 4,
  dexamethasone: 0.75
};

const STEROID_LABELS: Record<SteroidType, string> = {
  hydrocortisone: 'Hydrocortisone',
  prednisone: 'Prednisone',
  prednisolone: 'Prednisolone',
  methylprednisolone: 'Methylprednisolone',
  dexamethasone: 'Dexamethasone'
};

const SteroidEquivalence: React.FC = () => {
  const navigate = useNavigate();
  const [sourceSteroid, setSourceSteroid] = useState<SteroidType>('prednisone');
  const [sourceDose, setSourceDose] = useState('');
  const [targetSteroid, setTargetSteroid] = useState<SteroidType>('dexamethasone');
  const [result, setResult] = useState<{ target: number; prednisone: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateConversion = () => {
    setError(null);
    setResult(null);

    const dose = parseFloat(sourceDose);

    if (isNaN(dose)) {
      setError('Please enter a valid numeric dose.');
      return;
    }

    if (dose <= 0) {
      setError('Dose must be greater than zero.');
      return;
    }

    // Convert to Prednisone Equivalent
    const prednisoneEquiv = (dose / STEROID_EQUIVALENTS[sourceSteroid]) * STEROID_EQUIVALENTS['prednisone'];
    
    // Convert to Target Steroid
    const targetEquiv = (prednisoneEquiv / STEROID_EQUIVALENTS['prednisone']) * STEROID_EQUIVALENTS[targetSteroid];

    setResult({
      target: parseFloat(targetEquiv.toFixed(2)),
      prednisone: parseFloat(prednisoneEquiv.toFixed(2))
    });
  };

  const resetFields = () => {
    setSourceSteroid('prednisone');
    setSourceDose('');
    setTargetSteroid('dexamethasone');
    setResult(null);
    setError(null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/tools/calculators')}
        className="flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:underline mb-4"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Calculators
      </button>
      <div className="flex items-center gap-3 mb-2">
        <Pill className="text-indigo-600 dark:text-indigo-400" size={32} />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Steroid Equivalence</h1>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Approximate glucocorticoid dose conversion based on anti-inflammatory potency.
      </p>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Source Steroid
              </label>
              <select
                value={sourceSteroid}
                onChange={(e) => setSourceSteroid(e.target.value as SteroidType)}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {Object.entries(STEROID_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Source Dose (mg)
              </label>
              <input
                type="number"
                value={sourceDose}
                onChange={(e) => setSourceDose(e.target.value)}
                placeholder="e.g. 5"
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Target Steroid
              </label>
              <select
                value={targetSteroid}
                onChange={(e) => setTargetSteroid(e.target.value as SteroidType)}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {Object.entries(STEROID_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={calculateConversion}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition shadow-md"
            >
              Calculate Equivalence
            </button>
            <button
              onClick={resetFields}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold rounded-lg transition flex items-center gap-2"
            >
              <RotateCcw size={18} />
              Reset
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 flex items-center gap-3 m-6">
            <AlertTriangle className="text-red-500" size={20} />
            <p className="text-red-700 dark:text-red-300 text-sm font-medium">{error}</p>
          </div>
        )}

        {result !== null && (
          <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 m-6 rounded-lg border border-indigo-100 dark:border-indigo-800/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                    Approximate Equivalent Target Dose
                  </p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl font-black text-indigo-900 dark:text-indigo-100">{result.target}</span>
                    <span className="text-lg font-medium text-indigo-700 dark:text-indigo-400">mg {STEROID_LABELS[targetSteroid]}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-indigo-200/50 dark:border-indigo-800/50">
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                    Prednisone-Equivalent Dose
                  </p>
                  <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    {result.prednisone} mg
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-indigo-200 dark:border-indigo-800">
                <div className="flex items-start gap-2">
                  <Info className="text-indigo-500 mt-0.5 flex-shrink-0" size={16} />
                  <div className="text-xs text-gray-600 dark:text-gray-400 space-y-2">
                    <p className="font-bold text-gray-700 dark:text-gray-300 uppercase">Conversion Note</p>
                    <p>Steroid equivalence is approximate and context-dependent. Verify indication, route, duration, tapering plan, and institutional guidance.</p>
                    <p className="font-medium text-indigo-600 dark:text-indigo-400">Clinician review required before application.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <CalculatorDisclaimer />
    </div>
  );
};

export default SteroidEquivalence;
