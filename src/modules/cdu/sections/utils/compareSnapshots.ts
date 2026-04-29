import { CaseSnapshot } from './caseStorageService';

export interface ComparisonResult {
  metadata: {
    vA: number;
    vB: number;
    tsA: string;
    tsB: string;
  };
  clinicalDifferences: {
    diagnosis: FieldChange;
    stage: FieldChange;
    histology: FieldChange;
    ecog: FieldChange;
    biomarkers: ListChange;
    treatmentLines: ListChange;
  };
  protocolDifferences: {
    newlyEligible: string[];
    noLongerEligible: string[];
    stillEligible: string[];
  };
}

export interface FieldChange {
  label: string;
  valA: string;
  valB: string;
  status: 'unchanged' | 'changed';
}

export interface ListChange {
  label: string;
  added: string[];
  removed: string[];
  unchanged: string[];
}

export function compareSnapshots(snapshotA: CaseSnapshot, snapshotB: CaseSnapshot): ComparisonResult {
  const dataA = snapshotA.clinicalData;
  const dataB = snapshotB.clinicalData;

  const compareField = (label: string, valA: any, valB: any): FieldChange => ({
    label,
    valA: String(valA || '—'),
    valB: String(valB || '—'),
    status: valA === valB ? 'unchanged' : 'changed'
  });

  // Biomarker helper
  const getBiomarkerStr = (b: any) => `${b.name}: ${b.status} ${b.value ? `(${b.value})` : ''}`;
  const listA = dataA.diseaseStatus.biomarkers.map(getBiomarkerStr);
  const listB = dataB.diseaseStatus.biomarkers.map(getBiomarkerStr);

  const compareLists = (label: string, a: string[], b: string[]): ListChange => ({
    label,
    added: b.filter(x => !a.includes(x)),
    removed: a.filter(x => !b.includes(x)),
    unchanged: a.filter(x => b.includes(x))
  });

  // Protocol Eligibility Delta Logic
  const getEligibleIds = (s: CaseSnapshot) => 
    (s.protocolResults || [])
      .filter(r => r.status === 'Eligible option')
      .map(r => r.protocolName ? `${r.protocolId}: ${r.protocolName}` : r.protocolId);

  const eligibleA = getEligibleIds(snapshotA);
  const eligibleB = getEligibleIds(snapshotB);

  return {
    metadata: {
      vA: snapshotA.version,
      vB: snapshotB.version,
      tsA: snapshotA.timestamp,
      tsB: snapshotB.timestamp,
    },
    clinicalDifferences: {
      diagnosis: compareField('Diagnosis', dataA.diseaseStatus.primaryDiagnosis, dataB.diseaseStatus.primaryDiagnosis),
      stage: compareField('Stage', dataA.diseaseStatus.stageAtDiagnosis, dataB.diseaseStatus.stageAtDiagnosis),
      histology: compareField('Histology', dataA.diseaseStatus.histology, dataB.diseaseStatus.histology),
      ecog: compareField('ECOG', dataA.performanceStatus.performanceScore, dataB.performanceStatus.performanceScore),
      biomarkers: compareLists('Biomarkers', listA, listB),
      treatmentLines: compareLists(
        'Prior Treatments', 
        dataA.treatmentHistory.map(t => `${t.treatmentLine}: ${t.treatmentRegimen}`),
        dataB.treatmentHistory.map(t => `${t.treatmentLine}: ${t.treatmentRegimen}`)
      )
    },
    protocolDifferences: {
      newlyEligible: eligibleB.filter(x => !eligibleA.includes(x)),
      noLongerEligible: eligibleA.filter(x => !eligibleB.includes(x)),
      stillEligible: eligibleA.filter(x => eligibleB.includes(x))
    }
  };
}
