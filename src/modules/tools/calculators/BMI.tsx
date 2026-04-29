import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, RotateCcw, Calculator, ChevronLeft } from 'lucide-react';
import CalculatorDisclaimer from '../components/CalculatorDisclaimer';

/**
 * BMI Calculator
 * Formula: BMI = weight (kg) / [height (m)]^2
 */
const BMICalculator: React.FC = () => {
  const navigate = useNavigate();
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateBMI = () => {
    setError(null);
    setResult(null);

    const hCm = parseFloat(height);
    const wKg = parseFloat(weight);

    // Validation
    if (isNaN(hCm) || isNaN(wKg)) {
      setError('Please enter valid numeric values for height and weight.');
      return;
    }

    if (hCm <= 50 || hCm > 250) {
      setError('Please enter a realistic height (50cm - 250cm).');
      return;
    }

    if (wKg <= 2 || wKg > 500) {
      setError('Please enter a realistic weight (2kg - 500kg).');
      return;
    }

    // Calculation: weight / (height/100)^2
    const hM = hCm / 100;
    const bmiValue = wKg / (hM * hM);
    setResult(parseFloat(bmiValue.toFixed(1)));
  };

  const getInterpretation = (val: number) => {
    if (val < 18.5) return { text: 'Below reference range — clinician review may be appropriate', color: 'text-amber-600 dark:text-amber-400' };
    if (val < 25.0) return { text: 'Within reference range', color: 'text-green-600 dark:text-green-400' };
    if (val < 30.0) return { text: 'Above reference range', color: 'text-amber-600 dark:text-amber-400' };
    return { text: 'Elevated BMI range', color: 'text-amber-700 dark:text-amber-300 font-bold' };
  };

  const resetFields = () => {
    setHeight('');
    setWeight('');
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
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">BMI Calculator</h1>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Body Mass Index (BMI) provides a standardized estimate based on height and weight.
      </p>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Height (cm)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="e.g. 170"
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Weight (kg)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g. 70"
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={calculateBMI}
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
                  Calculated BMI
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-black text-indigo-900 dark:text-indigo-100">{result}</span>
                  <span className="text-lg font-medium text-indigo-700 dark:text-indigo-400">kg/m²</span>
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

export default BMICalculator;
