import React from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';
import OPD from '@/modules/opd';
import CDU from '@/modules/cdu';
import Inpatient from '@/modules/inpatient';
import Palliative from '@/modules/palliative';
import Tools from '@/modules/tools';
import Handbook from '@/modules/handbook';
import MedicalHandbookTOC from '@/modules/handbook/MedicalHandbookTOC';
import RadiationHandbookTOC from '@/modules/handbook/RadiationHandbookTOC';
import PalliativeHandbookTOC from '@/modules/handbook/PalliativeHandbookTOC';
import TestMarkdownViewer from '../components/TestMarkdownViewer';
import CallbackPage from '@/pages/CallbackPage';

export const routes = [
  {
    path: '/callback',
    element: (
      <ErrorBoundary moduleName="Auth Callback">
        <CallbackPage key="auth-callback" />
      </ErrorBoundary>
    ),
    errorElement: <ErrorBoundary moduleName="Auth Callback" />
  },
  {
    path: '/opd',
    element: (
      <ErrorBoundary moduleName="Oncology OPD">
        <OPD key="opd" />
      </ErrorBoundary>
    ),
    errorElement: <ErrorBoundary moduleName="Oncology OPD" />
  },
  {
    path: '/cdu',
    element: (
      <ErrorBoundary moduleName="Chemotherapy Day Unit">
        <CDU key="cdu" />
      </ErrorBoundary>
    ),
    errorElement: <ErrorBoundary moduleName="Chemotherapy Day Unit" />
  },
  {
    path: '/inpatient',
    element: (
      <ErrorBoundary moduleName="Inpatient Oncology">
        <Inpatient key="inpatient" />
      </ErrorBoundary>
    ),
    errorElement: <ErrorBoundary moduleName="Inpatient Oncology" />
  },
  {
    path: '/palliative',
    element: (
      <ErrorBoundary moduleName="Palliative Care">
        <Palliative key="palliative" />
      </ErrorBoundary>
    ),
    errorElement: <ErrorBoundary moduleName="Palliative Care" />
  },
  {
    path: '/tools',
    element: (
      <ErrorBoundary moduleName="Tools">
        <Tools key="tools" />
      </ErrorBoundary>
    ),
    errorElement: <ErrorBoundary moduleName="Tools" />
  },
  {
    path: '/handbook',
    element: (
      <ErrorBoundary moduleName="Oncology Handbook">
        <Handbook key="handbook" />
      </ErrorBoundary>
    ),
    errorElement: <ErrorBoundary moduleName="Oncology Handbook" />
  },
  {
    path: '/handbook/medical',
    element: (
      <ErrorBoundary moduleName="Medical Oncology Handbook">
        <MedicalHandbookTOC key="medical-handbook-toc" />
      </ErrorBoundary>
    ),
    errorElement: <ErrorBoundary moduleName="Medical Oncology Handbook" />
  },
  {
    path: '/handbook/medical/:chapterId',
    element: (
      <ErrorBoundary moduleName="Medical Oncology Handbook">
        <MedicalHandbookTOC key="medical-handbook-toc-chapter" />
      </ErrorBoundary>
    ),
    errorElement: <ErrorBoundary moduleName="Medical Oncology Handbook" />
  },
  {
    path: '/handbook/medical-oncology',
    element: (
      <ErrorBoundary moduleName="Medical Oncology Handbook (Legacy)">
        <MedicalHandbookTOC key="medical-handbook-legacy" />
      </ErrorBoundary>
    ),
    errorElement: <ErrorBoundary moduleName="Medical Oncology Handbook (Legacy)" />
  },
  {
    path: '/handbook/radiation',
    element: (
      <ErrorBoundary moduleName="Radiation Oncology Handbook">
        <RadiationHandbookTOC key="radiation-handbook-toc" />
      </ErrorBoundary>
    ),
    errorElement: <ErrorBoundary moduleName="Radiation Oncology Handbook" />
  },
  {
    path: '/handbook/radiation/:chapterId',
    element: (
      <ErrorBoundary moduleName="Radiation Oncology Handbook">
        <RadiationHandbookTOC key="radiation-handbook-toc-chapter" />
      </ErrorBoundary>
    ),
    errorElement: <ErrorBoundary moduleName="Radiation Oncology Handbook" />
  },
  {
    path: '/handbook/palliative',
    element: (
      <ErrorBoundary moduleName="Palliative Handbook">
        <PalliativeHandbookTOC key="palliative-handbook-toc" />
      </ErrorBoundary>
    ),
    errorElement: <ErrorBoundary moduleName="Palliative Handbook" />
  },
  {
    path: '/handbook/palliative/:chapterId',
    element: (
      <ErrorBoundary moduleName="Palliative Handbook">
        <PalliativeHandbookTOC key="palliative-handbook-toc-chapter" />
      </ErrorBoundary>
    ),
    errorElement: <ErrorBoundary moduleName="Palliative Handbook" />
  },
  {
    path: '/test-markdown',
    element: <TestMarkdownViewer />
  }
];
