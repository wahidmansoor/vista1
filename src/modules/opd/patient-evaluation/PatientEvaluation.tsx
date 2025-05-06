import React from 'react';
import { useNavigate } from 'react-router-dom';

const PatientEvaluation: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-indigo-800">🎯 Patient Evaluation Overview</h2>
      <p className="text-gray-700 max-w-3xl">
        This module guides oncologists through a complete and structured patient evaluation during outpatient visits. It is not an EHR but a clinical decision support tool meant to ensure no critical detail is missed during your assessment.
      </p>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Key Features</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Structured History Taking: CC, HOPC, PMH, Family & Social History</li>
          <li>Oncology-Focused Physical Examination & Red Flags</li>
          <li>Initial Diagnostic Planning and Performance Status</li>
          <li>Non-EHR format with clinical flexibility</li>
        </ul>

        <div className="pt-4">
          <button
            onClick={() => navigate('/opd/patient-evaluation-form')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-5 py-2 rounded-md shadow"
          >
            🚀 Start Patient Evaluation
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientEvaluation;
