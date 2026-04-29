import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ChevronLeft } from 'lucide-react';
import CalculatorDisclaimer from '../components/CalculatorDisclaimer';

const CrClCalculator: React.FC = () => {
  const navigate = useNavigate();
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [scr, setScr] = useState('');
  const [scrUnit, setScrUnit] = useState<'mg/dL' | 'µmol/L'>('mg/dL');
  const [gender, setGender] = useState('male');
  const [crcl, setCrcl] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateCrCl = () => {
    setError(null);
    const a = parseFloat(age);
    const w = parseFloat(weight);
    const s = parseFloat(scr);

    if (isNaN(a) || isNaN(w) || isNaN(s)) {
      setError('Please enter valid numeric values for all fields.');
      setCrcl(null);
      return;
    }

    if (a <= 0 || a > 120) {
      setError('Please enter a realistic age (1-120).');
      setCrcl(null);
      return;
    }

    if (w <= 0 || w > 500) {
      setError('Please enter a valid weight.');
      setCrcl(null);
      return;
    }

    if (s <= 0) {
      setError('Serum Creatinine must be greater than zero.');
      setCrcl(null);
      return;
    }

    // Convert sCr to mg/dL if provided in µmol/L
    const sCrMgDl = scrUnit === 'µmol/L' ? s / 88.4 : s;

    let crclValue = ((140 - a) * w) / (72 * sCrMgDl);
    if (gender === 'female') {
      crclValue = crclValue * 0.85;
    }

    setCrcl(parseFloat(crclValue.toFixed(2)));
  };

  const resetFields = () => {
    setAge('');
    setWeight('');
    setScr('');
    setScrUnit('mg/dL');
    setGender('male');
    setCrcl(null);
    setError(null);
  };

  return (
    <div className="p-6">
      <button
        onClick={() => navigate('/tools/calculators')}
        className="flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:underline mb-4"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Calculators
      </button>
      <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-gray-200">🧮 CrCl Calculator (Cockcroft-Gault Formula)</h1>
      <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-6 flex items-center gap-2">
        <AlertCircle size={16} />
        Confirm serum creatinine units before using this estimate. Calculated CrCl requires clinician verification.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 text-gray-700 dark:text-gray-300 font-semibold">Age (years)</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter age"
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-700 dark:text-gray-300 font-semibold">Weight (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Enter weight"
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-700 dark:text-gray-300 font-semibold">
            Serum Creatinine ({scrUnit})
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={scr}
              onChange={(e) => setScr(e.target.value)}
              placeholder={`Enter sCr in ${scrUnit}`}
              className="flex-1 p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
            <select
              title="Serum Creatinine Unit"
              value={scrUnit}
              onChange={(e) => setScrUnit(e.target.value as 'mg/dL' | 'µmol/L')}
              className="p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 bg-gray-50"
            >
              <option value="mg/dL">mg/dL</option>
              <option value="µmol/L">µmol/L</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block mb-2 text-gray-700 dark:text-gray-300 font-semibold">Gender</label>
          <select
            title="Gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg flex items-center gap-2">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="flex gap-4 mt-6">
        <button
          onClick={calculateCrCl}
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
        >
          Calculate
        </button>
        <button
          onClick={resetFields}
          className="px-6 py-3 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-100 font-semibold rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition"
        >
          Reset
        </button>
      </div>

      {crcl !== null && !error && (
        <div className="mt-8 p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Calculated CrCl</h2>
          <p className="text-lg text-indigo-900 dark:text-indigo-300 mt-2">{crcl} mL/min</p>
          <p className="text-xs text-indigo-700 dark:text-indigo-400 mt-4 italic">
            * Cockcroft-Gault estimate. Clinical judgement required. 
            {scrUnit === 'µmol/L' && ` (Converted ${scr} µmol/L to ${(parseFloat(scr)/88.4).toFixed(2)} mg/dL for calculation)`}
          </p>
        </div>
      )}

      <CalculatorDisclaimer />
    </div>
  );
};

export default CrClCalculator;