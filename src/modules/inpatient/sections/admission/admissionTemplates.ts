import React from 'react';

export const cancerTypes: { key: string; label: string }[] = [
  { key: 'breast', label: 'Breast Cancer' },
  { key: 'lung', label: 'Lung Cancer' },
  { key: 'lymphoma', label: 'Lymphoma' },
  { key: 'colorectal', label: 'Colorectal Cancer' },
  { key: 'gastric', label: 'Gastric Cancer' },
  { key: 'pancreatic', label: 'Pancreatic Cancer' },
  { key: 'ovarian', label: 'Ovarian Cancer' },
  { key: 'cervical', label: 'Cervical Cancer' },
  { key: 'renal', label: 'Renal Cell Carcinoma' },
  { key: 'prostate', label: 'Prostate Cancer' },
  { key: 'head_neck', label: 'Head & Neck Cancer' },
  { key: 'bladder', label: 'Bladder Cancer' },
  { key: 'multiple_myeloma', label: 'Multiple Myeloma' },
];

export const presentingIssues: Record<string, string[]> = {
  breast: ['Febrile Neutropenia', 'Uncontrolled Pain', 'Intractable Nausea/Vomiting', 'Shortness of Breath', 'Spinal Cord Compression', 'Hypercalcemia', 'Tumor Lysis Syndrome Risk'],
  lung: ['Hemoptysis', 'Fever', 'Respiratory Distress', 'SVCS', 'Spinal Cord Compression', 'Pneumonitis'],
  lymphoma: ['Fever', 'Tumor Lysis Syndrome', 'Obstruction', 'CNS Symptoms', 'Bone Marrow Failure'],
  colorectal: ['Bowel Obstruction', 'GI Bleeding', 'Pain', 'Intractable Vomiting', 'Febrile Neutropenia'],
  gastric: ['Upper GI Bleed', 'Intractable Vomiting', 'Dehydration', 'Obstruction', 'Malnutrition'],
  pancreatic: ['Obstructive Jaundice', 'Severe Abdominal Pain', 'Weight Loss', 'Fever', 'Infection'],
  ovarian: ['Abdominal Distension', 'Ascites', 'Pain', 'Obstruction', 'Febrile Neutropenia'],
  cervical: ['Bleeding', 'Obstruction', 'Fever', 'Anemia', 'Pain'],
  renal: ['Hematuria', 'Pain', 'Hypercalcemia', 'Febrile Neutropenia', 'Spinal Cord Compression'],
  prostate: ['Urinary Obstruction', 'Bone Pain', 'Spinal Cord Compression', 'Hypercalcemia'],
  head_neck: ['Airway Obstruction', 'Bleeding', 'Infection', 'Pain', 'Swallowing Difficulty'],
  bladder: ['Hematuria', 'Urinary Retention', 'Fever', 'Spinal Cord Compression'],
  multiple_myeloma: ['Hypercalcemia', 'Renal Dysfunction', 'Bone Pain', 'Anemia', 'Infection'],
};

export function triageLogic(cancerType: string, issue: string): { action: string; urgency: string } {
  if (!issue) return { action: '', urgency: '' };
  if (['Spinal Cord Compression', 'SVCS', 'Airway Obstruction', 'Obstructive Jaundice'].includes(issue)) {
    return { action: 'Admit', urgency: 'Critical' };
  }
  if (['GI Bleeding', 'Hypercalcemia', 'Febrile Neutropenia', 'Hematuria'].includes(issue)) {
    return { action: 'Admit', urgency: 'High' };
  }
  if (['Pain', 'Intractable Vomiting', 'Obstruction', 'Infection'].includes(issue)) {
    return { action: 'Admit', urgency: 'Moderate' };
  }
  return { action: 'OPD', urgency: 'Low' };
}

export function getPreAdmissionChecklist(cancerType: string): string[] {
  switch (cancerType) {
    case 'colorectal':
      return ['CBC', 'BMP', 'CT Abdomen', 'Consent', 'Isolation if febrile'];
    case 'gastric':
      return ['CBC', 'CMP', 'Endoscopy Report', 'Nutrition Consult'];
    case 'pancreatic':
      return ['LFTs', 'CT Abdomen', 'Hydration Orders', 'Pain Team Consult'];
    case 'ovarian':
      return ['Pelvic US/CT', 'Ascitic Tap if needed', 'CBC', 'Consent'];
    case 'multiple_myeloma':
      return ['CBC', 'CMP', 'Calcium', 'Renal Panel', 'SPEP'];
    default:
      return ['CBC', 'CMP', 'Consent', 'Vitals', 'Isolation if needed'];
  }
}

export function getInitialOrders(cancerType: string, issue: string): string[] {
  const orders = ['CBC', 'CMP', 'IV Fluids', 'Vitals Q4H'];
  if (issue === 'GI Bleeding') {
    return [...orders, 'Type & Cross', 'IV PPI', 'NPO', 'GI Consult'];
  }
  if (issue === 'Obstructive Jaundice') {
    return [...orders, 'LFTs', 'ERCP/Intervention Referral', 'Hydration'];
  }
  if (issue === 'Spinal Cord Compression') {
    return [...orders, 'MRI Spine', 'IV Steroids (Dexamethasone)', 'Neuro Consult'];
  }
  if (issue === 'Febrile Neutropenia') {
    return [...orders, 'Blood Cultures', 'Start Broad-Spectrum Antibiotics', 'Monitor Temperature Q2H'];
  }
  return orders;
}

export const getAdmissionAlerts = (cancerType: string): string[] => {
  const alerts: Record<string, string[]> = {
    breast: [
      'Monitor for febrile neutropenia',
      'Check for signs of tumor lysis syndrome',
      'Assess pain control adequacy',
      'Monitor for hypercalcemia symptoms'
    ],
    lung: [
      'Monitor respiratory status closely',
      'Watch for signs of SVCS',
      'Check for hemoptysis',
      'Assess pneumonitis risk'
    ],
    default: [
      'Monitor vital signs',
      'Assess pain levels',
      'Watch for infection signs',
      'Monitor fluid balance'
    ]
  };
  
  return alerts[cancerType] || alerts.default;
};

export const getAdmissionProcessSteps = (cancerType: string): string[] => {
  const steps: Record<string, string[]> = {
    breast: [
      'Complete initial assessment',
      'Review current treatment plan',
      'Check laboratory values',
      'Assess performance status',
      'Document current symptoms'
    ],
    lung: [
      'Assess respiratory function',
      'Review imaging studies',
      'Check oxygen saturation',
      'Evaluate pain management',
      'Document disease progression'
    ],
    default: [
      'Complete admission assessment',
      'Review medical history',
      'Order necessary investigations',
      'Plan treatment approach',
      'Communicate with team'
    ]
  };
  
  return steps[cancerType] || steps.default;
};

export const getSummaryTemplate = (cancerType: string): string => {
  const templates: Record<string, string> = {
    breast: 'Patient with breast cancer admitted for [reason]. Current treatment: [treatment]. Performance status: [PS]. Plan: [plan].',
    lung: 'Patient with lung cancer admitted for [reason]. Respiratory status: [status]. Current therapy: [therapy]. Plan: [plan].',
    default: 'Patient with [cancer type] admitted for [reason]. Current status: [status]. Plan: [plan].'
  };
  
  return templates[cancerType] || templates.default;
};
