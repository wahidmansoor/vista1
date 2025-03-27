import React from "react";
import { useNavigate } from "react-router-dom";

const Calculators = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6">Oncology Calculators</h2>

      <div className="space-y-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-blue-600 font-semibold">1. BSA (Body Surface Area)</h3>
          <p className="text-sm">
            <strong>Formula:</strong> √((Height(cm) × Weight(kg)) / 3600)<br />
            <em>Example: Height = 170 cm, Weight = 65 kg → BSA ≈ 1.74 m²</em>
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-blue-600 font-semibold">2. AUC (Carboplatin Dose)</h3>
          <p className="text-sm">
            <strong>Formula:</strong> Dose = AUC × (GFR + 25)<br />
            <em>Example: AUC = 5, GFR = 70 → Dose = 475 mg</em>
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-blue-600 font-semibold">3. CrCl (Cockcroft-Gault)</h3>
          <p className="text-sm">
            <strong>Formula:</strong> (140 - age) × weight / (72 × Cr) [× 0.85 if female]<br />
            <em>Example: Age = 60, Wt = 70 kg, Cr = 1.2 → CrCl ≈ 68 mL/min</em>
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-blue-600 font-semibold">4. ANC (Absolute Neutrophil Count)</h3>
          <p className="text-sm">
            <strong>Formula:</strong> ANC = WBC × (%Neutrophils + %Bands) / 100<br />
            <em>Example: WBC = 4.5, Neutrophils 55%, Bands 3% → ANC ≈ 2610</em>
          </p>
        </div>
      </div>

      <button
        onClick={() => navigate("/tools")}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
      >
        ← Back to Tools
      </button>
    </div>
  );
};

export default Calculators;
