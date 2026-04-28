import { PatientData, ProtocolMatch } from '../types/diseaseProgress.types';

/**
 * Generates a structured clinical summary for tumor board or clinical documentation.
 * Maintains a strictly neutral tone avoiding prescriptive language.
 */
export const generateClinicalSummary = (
  patientData: PatientData,
  eligibleMatches: ProtocolMatch[],
  ineligibleMatches: ProtocolMatch[]
): string => {
  const { diseaseStatus, performanceStatus } = patientData;
  
  const sections: string[] = [];

  // 1. EXECUTIVE HEADER
  sections.push(`CLINICAL SUMMARY EVALUATION - ${new Date().toLocaleDateString()}`);
  sections.push(`-----------------------------------`);

  // 2. PATIENT CLINICAL DATA
  sections.push(`PATIENT CLINICAL DATA:`);
  sections.push(`- Diagnosis: ${diseaseStatus.primaryDiagnosis}${diseaseStatus.otherPrimaryDiagnosis ? ` (${diseaseStatus.otherPrimaryDiagnosis})` : ''}`);
  sections.push(`- Stage: ${diseaseStatus.stageAtDiagnosis}`);
  sections.push(`- Performance Status: ${performanceStatus.performanceScale} ${performanceStatus.performanceScore}`);
  
  if (diseaseStatus.biomarkers && diseaseStatus.biomarkers.length > 0) {
    sections.push(`\nKey Biomarkers:`);
    diseaseStatus.biomarkers.forEach(b => {
      sections.push(`- ${b.name}: ${b.status}${b.value ? ` (${b.value})` : ''}`);
    });
  }
  sections.push(`-----------------------------------`);

  // 3. ELIGIBLE STRATEGY OPTIONS
  if (eligibleMatches.length > 0) {
    sections.push(`ELIGIBLE STRATEGY OPTIONS (Matched Criteria):`);
    eligibleMatches.forEach(match => {
      sections.push(`\n[${match.protocol.id}] ${match.protocol.name}`);
      if (match.matchedFactors && match.matchedFactors.length > 0) {
        match.matchedFactors.forEach(factor => sections.push(`  • ${factor}`));
      }
    });
  } else {
    sections.push(`ELIGIBLE STRATEGY OPTIONS: None found in local dataset.`);
  }
  sections.push(`-----------------------------------`);

  // 4. NOT ELIGIBLE OPTIONS (Selected subset for clinical context)
  if (ineligibleMatches.length > 0) {
    sections.push(`NOT ELIGIBLE / CRITERIA MISMATCH:`);
    // Limiting to top 5 to keep summary concise
    ineligibleMatches.slice(0, 5).forEach(match => {
      sections.push(`\n[${match.protocol.id}] ${match.protocol.name}`);
      const reasons = match.warnings.filter(w => w.startsWith('Mismatch:') || w.startsWith('Safety:'));
      if (reasons.length > 0) {
        reasons.forEach(r => sections.push(`  • ${r.replace(/^(Mismatch|Safety): /, '')}`));
      } else {
        sections.push(`  • General mismatch with clinical criteria`);
      }
    });
    if (ineligibleMatches.length > 5) {
      sections.push(`\n...and ${ineligibleMatches.length - 5} other ineligible candidates evaluated.`);
    }
  }
  sections.push(`-----------------------------------`);

  // 5. SAFETY NOTES & DISCLAIMERS
  sections.push(`SAFETY NOTES:`);
  sections.push(`- Data Source: Local deterministic oncology protocol dataset.`);
  sections.push(`- clinical evaluation and multidisciplinary team (MDT) review required.`);
  sections.push(`- This summary is for clinical decision support ONLY and does not constitute a recommendation.`);
  
  return sections.join('\n');
};
