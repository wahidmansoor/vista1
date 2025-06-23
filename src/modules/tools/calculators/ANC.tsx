import React, { useState } from 'react';

const ANCCalculator: React.FC = () => {
  const [wbc, setWbc] = useState('');
  const [neutrophils, setNeutrophils] = useState('');
  const [bands, setBands] = useState('');
  const [anc, setAnc] = useState<number | null>(null);
  const [severity, setSeverity] = useState('');

  const calculateANC = () => {
    const w = parseFloat(wbc);
    const n = parseFloat(neutrophils);
    const b = parseFloat(bands);

    if (isNaN(w) || isNaN(n) || isNaN(b) || w <= 0 || n < 0 || b < 0) {
      setAnc(null);
      setSeverity('');
      return;
    }

    const result = (w * (n + b)) / 100;
    const roundedResult = parseFloat(result.toFixed(2));
    setAnc(roundedResult);

    // Determine severity
    if (roundedResult >= 1.5) {
      setSeverity('normal');
    } else if (roundedResult >= 1.0) {
      setSeverity('mild');
    } else if (roundedResult >= 0.5) {
      setSeverity('moderate');
    } else {
      setSeverity('severe');
    }
  };

  const resetFields = () => {
    setWbc('');
    setNeutrophils('');
    setBands('');
    setAnc(null);
    setSeverity('');
  };

  const getSeverityMessage = () => {
    switch (severity) {
      case 'normal':
        return '✅ Normal ANC. No neutropenia.';
      case 'mild':
        return '⚠️ Mild Neutropenia. Monitor carefully.';
      case 'moderate':
        return '⚠️ Moderate Neutropenia. Higher infection risk.';
      case 'severe':
        return '🚨 Severe Neutropenia. Critical infection risk!';
      default:
        return '';
    }
  };

  const getSeverityColor = () => {
    switch (severity) {
      case 'normal':
        return 'bg-green-100 dark:bg-green-700';
      case 'mild':
        return 'bg-yellow-100 dark:bg-yellow-700';
      case 'moderate':
        return 'bg-orange-100 dark:bg-orange-700';
      case 'severe':
        return 'bg-red-100 dark:bg-red-700';
      default:
        return 'bg-gray-100 dark:bg-gray-800';
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">🧮 ANC Calculator (Absolute Neutrophil Count)</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 text-gray-700 dark:text-gray-300 font-semibold">WBC (×10³/μL)</label>
          <input
            type="number"
            value={wbc}
            onChange={(e) => setWbc(e.target.value)}
            placeholder="Enter WBC count"
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-700 dark:text-gray-300 font-semibold">% Neutrophils (segmented)</label>
          <input
            type="number"
            value={neutrophils}
            onChange={(e) => setNeutrophils(e.target.value)}
            placeholder="Enter % Neutrophils"
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-700 dark:text-gray-300 font-semibold">% Bands</label>
          <input
            type="number"
            value={bands}
            onChange={(e) => setBands(e.target.value)}
            placeholder="Enter % Bands"
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={calculateANC}
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

      {anc !== null && (
        <div className={`mt-8 p-6 rounded-lg shadow-inner ${getSeverityColor()} transition`}>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Calculated ANC</h2>
          <p className="text-lg mt-2">{anc} ×10³/μL</p>
          <p className="text-sm mt-2">{getSeverityMessage()}</p>
        </div>
      )}
    </div>
  );
};

export default ANCCalculator;