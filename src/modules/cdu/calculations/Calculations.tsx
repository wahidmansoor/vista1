
import React, { useState } from "react";

const BSACalculator = () => {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bsa, setBsa] = useState<number | null>(null);

  const calculateBSA = () => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    if (weightNum && heightNum) {
      const result = Math.sqrt((heightNum * weightNum) / 3600);
      setBsa(result);
    } else {
      setBsa(null);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Body Surface Area (BSA) Calculator</h3>
      <div className="flex space-x-4">
        <div className="flex flex-col">
          <label>Weight (kg)</label>
          <input
            type="number"
            className="p-2 border border-gray-300 rounded"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label>Height (cm)</label>
          <input
            type="number"
            className="p-2 border border-gray-300 rounded"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
        </div>
      </div>
      <button
        onClick={calculateBSA}
        className="px-4 py-2 bg-indigo-600 text-white rounded mt-4"
      >
        Calculate BSA
      </button>
      {bsa !== null && (
        <p className="mt-2 font-semibold">BSA: {bsa.toFixed(2)} m²</p>
      )}
    </div>
  );
};

export default BSACalculator;
