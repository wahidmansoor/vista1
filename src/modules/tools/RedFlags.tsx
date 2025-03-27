import React from "react";
import { useNavigate } from "react-router-dom";

const RedFlags = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Red Flag Signs in Oncology</h2>

      <ul className="list-disc list-inside space-y-2 text-gray-700">
        <li>Spinal cord compression</li>
        <li>Febrile neutropenia</li>
        <li>Uncontrolled bleeding</li>
        <li>Severe dyspnea or airway obstruction</li>
        <li>Unexplained, rapid neurological deterioration</li>
      </ul>

      <button
        onClick={() => navigate("/tools")}
        className="mt-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
      >
        ← Back to Tools
      </button>
    </div>
  );
};

export default RedFlags;
