import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, RotateCcw, Calculator, ChevronLeft } from 'lucide-react';
import CalculatorDisclaimer from '../components/CalculatorDisclaimer';

/**
 * Corrected Calcium Calculator
 * Formula: Corrected Calcium mmol/L = measured calcium mmol/L + 0.02 * (40 - albumin g/L)
 */
const CorrectedCalciumCalculator: React.FC = () => {
  const navigate = useNavigate();
  const [calcium, setCalcium] = useState('');
  const [albumin, setAlbumin] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateCorrectedCalcium = () => {
    setError(null);
    setResult(null);

    const ca = parseFloat(calcium);
    const alb = parseFloat(albumin);

    // Validation
    if (isNaN(ca) || isNaN(alb)) {
      setError('Please enter valid numeric values for calcium and albumin.');
      return;
    }

    if (ca <= 0 || ca > 10) {
      setError('Please enter a valid measured calcium value (mmol/L).');
      return;
    }

    if (alb <= 0 || alb > 100) {
      setError('Please enter a valid albumin value (g/L).');
      return;
    }

    // Calculation: ca + 0.02 * (40 - alb)
    const correctedValue = ca + 0.02 * (40 - alb);
    setResult(parseFloat(correctedValue.toFixed(2)));
  };

  const getInterpretation = (val: number) => {
    if (val < 2.6) return { text: 'Not elevated by this calculator', color: 'text-gray-600 dark:text-gray-400' };
    if (val < 3.0) return { text: 'Elevated — clinician review required', color: 'text-amber-600 dark:text-amber-400' };
    return { text: 'Markedly elevated — urgent clinician review required', color: 'text-red-600 dark:text-red-400 font-bold' };
  };

  const resetFields = () => {
    setCalcium('');
    setAlbumin('');
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
        <Calculator className="text-indigo-600 dark:text-indigo-400" size={32} />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Corrected Calcium</h1>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Adjusts measured calcium for albumin concentration using the standard formula.
      </p>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Measured Calcium (mmol/L)
              </label>
              <input
                type="number"
                step="0.01"
                value={calcium}
                onChange={(e) => setCalcium(e.target.value)}
                placeholder="e.g. 2.4"
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Albumin (g/L)
              </label>
              <input
                type="number"
                step="1"
                value={albumin}
                onChange={(e) => setAlbumin(e.target.value)}
                placeholder="e.g. 40"
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={calculateCorrectedCalcium}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition shadow-md"
            >
              Calculate Results
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
            <AlertCircle className="text-red-500" size={20} />
            <p className="text-red-700 dark:text-red-300 text-sm font-medium">{error}</p>
          </div>
        )}

        {result !== null && (
          <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 m-6 rounded-lg border border-indigo-100 dark:border-indigo-800/50">
            <div className="flex flex-col md:flex-row justify-between items-baseline gap-4">
              <div>
                <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                  Corrected Calcium
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-black text-indigo-900 dark:text-indigo-100">{result}</span>
                  <span className="text-lg font-medium text-indigo-700 dark:text-indigo-400">mmol/L</span>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-indigo-200 dark:border-indigo-800 w-full md:w-auto min-w-[250px]">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Interpretation</p>
                <p className={`text-lg font-semibold ${getInterpretation(result).color}`}>
                  {getInterpretation(result).text}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <CalculatorDisclaimer />
    </div>
  );
};

export default CorrectedCalciumCalculator;
