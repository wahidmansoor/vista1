import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import OPDModule from './components/OPDModule';
import OPDLayout from './layout/OPDLayout';
import ErrorBoundary from '@/components/ErrorBoundary';
import { PatientEvaluationForm } from './patient-evaluation/PatientEvaluationForm';
import DiagnosticPathways from './diagnostic-pathways/DiagnosticPathways';
import CancerScreening from './cancer-screening/CancerScreening';
import ReferralGuidelines from './referral-guidelines/ReferralGuidelines';
import FollowUpOncology from './follow-up-oncology/FollowUpOncology';
import { EvaluationProvider } from './context/EvaluationContext';

const OPD = () => {
  return (
    <ErrorBoundary moduleName="Oncology OPD">
      <EvaluationProvider>
        <OPDLayout>
          <Routes>
            <Route path="/" element={<OPDModule />} />
            <Route path="/patient-evaluation-form" element={<PatientEvaluationForm />} />
            <Route path="/diagnostic-pathways" element={<DiagnosticPathways />} />
            <Route path="/cancer-screening" element={<CancerScreening />} />
            <Route path="/referral-guidelines" element={<ReferralGuidelines />} />
            <Route path="/follow-up-oncology" element={<FollowUpOncology />} />
          </Routes>
          <Toaster />
        </OPDLayout>
      </EvaluationProvider>
    </ErrorBoundary>
  );
};

export default OPD;
