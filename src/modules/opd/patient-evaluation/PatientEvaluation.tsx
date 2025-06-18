import React from 'react';
import { useNavigate } from 'react-router-dom';

const PatientEvaluation: React.FC = () => {
  const navigate = useNavigate();

  return (    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">🎯 Patient Evaluation Overview</h2>
      <p className="text-white/80 max-w-3xl">
        This module guides oncologists through a complete and structured patient evaluation during outpatient visits. It is not an EHR but a clinical decision support tool meant to ensure no critical detail is missed during your assessment.
      </p>

      <div className="bg-white/5 backdrop-blur-sm border border-white/20 p-6 rounded-xl space-y-4">
        <h2 className="text-xl font-semibold text-white">Key Features</h2>
        <ul className="list-disc list-inside text-white/80 space-y-1">
          <li>Structured History Taking: CC, HOPC, PMH, Family & Social History</li>
          <li>Oncology-Focused Physical Examination & Red Flags</li>
          <li>Initial Diagnostic Planning and Performance Status</li>
          <li>Non-EHR format with clinical flexibility</li>
        </ul>

        <div className="pt-4">
          <button
            onClick={() => navigate('/opd/patient-evaluation-form')}
            className="bg-gradient-to-r from-[#004D61] to-[#005B8F] hover:from-[#005B8F] hover:to-[#3B1D74] text-white text-sm px-5 py-2 rounded-md shadow-lg transition-all"
          >
            🚀 Start Patient Evaluation
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientEvaluation;
