import React, { useState } from 'react';

const BSACalculator: React.FC = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bsa, setBsa] = useState<number | null>(null);

  const calculateBSA = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) {
      setBsa(null);
      return;
    }
    const result = Math.sqrt((h * w) / 3600);
    setBsa(parseFloat(result.toFixed(2)));
  };

  const resetFields = () => {
    setHeight('');
    setWeight('');
    setBsa(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">🧮 BSA Calculator (Mosteller Formula)</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 text-gray-700 dark:text-gray-300 font-semibold">Height (cm)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="Enter height in cm"
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-700 dark:text-gray-300 font-semibold">Weight (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Enter weight in kg"
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={calculateBSA}
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

      {bsa !== null && (
        <div className="mt-8 p-6 bg-green-100 dark:bg-green-700 rounded-lg">
          <h2 className="text-xl font-bold text-green-800 dark:text-green-200">Calculated BSA</h2>
          <p className="text-lg text-green-700 dark:text-green-300 mt-2">{bsa} m²</p>
        </div>
      )}
    </div>
  );
};

export default BSACalculator;