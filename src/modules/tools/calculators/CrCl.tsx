import React, { useState } from 'react';

const CrClCalculator: React.FC = () => {
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [scr, setScr] = useState('');
  const [gender, setGender] = useState('male');
  const [crcl, setCrcl] = useState<number | null>(null);

  const calculateCrCl = () => {
    const a = parseFloat(age);
    const w = parseFloat(weight);
    const s = parseFloat(scr);

    if (isNaN(a) || isNaN(w) || isNaN(s) || a <= 0 || w <= 0 || s <= 0) {
      setCrcl(null);
      return;
    }

    let crclValue = ((140 - a) * w) / (72 * s);
    if (gender === 'female') {
      crclValue = crclValue * 0.85;
    }

    setCrcl(parseFloat(crclValue.toFixed(2)));
  };

  const resetFields = () => {
    setAge('');
    setWeight('');
    setScr('');
    setGender('male');
    setCrcl(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">🧮 CrCl Calculator (Cockcroft-Gault Formula)</h1>

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
          <label className="block mb-2 text-gray-700 dark:text-gray-300 font-semibold">Serum Creatinine (mg/dL)</label>
          <input
            type="number"
            value={scr}
            onChange={(e) => setScr(e.target.value)}
            placeholder="Enter serum creatinine"
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-700 dark:text-gray-300 font-semibold">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>

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

      {crcl !== null && (
        <div className="mt-8 p-6 bg-green-100 dark:bg-green-700 rounded-lg">
          <h2 className="text-xl font-bold text-green-800 dark:text-green-200">Calculated CrCl</h2>
          <p className="text-lg text-green-700 dark:text-green-300 mt-2">{crcl} mL/min</p>
        </div>
      )}
    </div>
  );
};

export default CrClCalculator;