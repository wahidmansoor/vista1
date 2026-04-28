import React from 'react';
import { Info, AlertCircle } from 'lucide-react';
import { PatientData } from '../types/diseaseProgress.types';

interface ClinicalDataGapsProps {
  patientData: PatientData;
}

/**
 * Deterministically suggests missing biomarkers based on the primary diagnosis.
 * Does NOT recommend treatment; only identifies gaps in the data needed for matching.
 */
export const ClinicalDataGaps: React.FC<ClinicalDataGapsProps> = ({ patientData }) => {
  const diagnosis = patientData.diseaseStatus.primaryDiagnosis;
  const biomarkers = patientData.diseaseStatus.biomarkers.map(b => b.name.toUpperCase());
  
  const gaps: string[] = [];

  // Logic for identifying missing markers based on site
  if (diagnosis === 'NSCLC') {
    if (!biomarkers.includes('EGFR')) gaps.push('EGFR Status');
    if (!biomarkers.includes('ALK')) gaps.push('ALK Rearrangement');
    if (!biomarkers.includes('ROS1')) gaps.push('ROS1 Rearrangement');
    if (!biomarkers.includes('PD-L1')) gaps.push('PD-L1 Expression');
    if (!biomarkers.includes('BRAF')) gaps.push('BRAF V600E');
  } else if (diagnosis === 'Breast Cancer') {
    if (!biomarkers.includes('ER')) gaps.push('ER (Estrogen Receptor)');
    if (!biomarkers.includes('PR')) gaps.push('PR (Progesterone Receptor)');
    if (!biomarkers.includes('HER2')) gaps.push('HER2/neu Status');
  } else if (diagnosis === 'Colorectal Cancer' || diagnosis === 'CRC') {
    if (!biomarkers.includes('RAS') && !biomarkers.includes('KRAS') && !biomarkers.includes('NRAS')) {
      gaps.push('RAS (KRAS/NRAS) Status');
    }
    if (!biomarkers.includes('BRAF')) gaps.push('BRAF Status');
    if (!biomarkers.includes('MSI') && !biomarkers.includes('MMR')) {
      gaps.push('MSI/MMR Status');
    }
  }

  if (gaps.length === 0) return null;

  return (
    <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl">
      <div className="flex items-center gap-2 mb-3 text-indigo-700 dark:text-indigo-300">
        <Info className="h-4 w-4" />
        <h4 className="text-xs font-bold uppercase tracking-wider">Clinical Data Gaps to Resolve</h4>
      </div>
      <p className="text-xs text-indigo-600 dark:text-indigo-400 mb-3">
        The following markers are typically required for precise protocol matching in {diagnosis || "this disease"}:
      </p>
      <div className="flex flex-wrap gap-2">
        {gaps.map((gap, i) => (
          <span 
            key={i} 
            className="px-2 py-1 bg-white dark:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-700 rounded text-[10px] font-medium text-indigo-700 dark:text-indigo-300 flex items-center gap-1"
          >
            <AlertCircle className="h-3 w-3" />
            {gap}
          </span>
        ))}
      </div>
      <p className="mt-3 text-[10px] text-slate-500 italic">
        * Note: These prompts are based on guideline-recommended testing and do not constitute medical advice.
      </p>
    </div>
  );
};
