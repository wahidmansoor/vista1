import { CaseRecord, CaseSnapshot } from './caseStorageService';
import { compareSnapshots } from './compareSnapshots';

export const caseExportService = {
  generateExportText: (
    record: CaseRecord, 
    options: { includeHistory: boolean; comparisonSnapshots?: [CaseSnapshot, CaseSnapshot] }
  ): string => {
    const latest = record.snapshots[record.snapshots.length - 1];
    let md = `# OncoVista CDS Case Export\n\n`;

    // Safety Disclaimer
    md += `## Safety Disclaimer\n`;
    md += `> Clinical decision support only. Verify all clinical data, protocol eligibility outputs, and institutional pathways before clinical use.\n\n`;

    // Case Metadata
    md += `## Case Metadata\n`;
    md += `- **Case Title**: ${record.title}\n`;
    md += `- **Case ID**: ${record.caseId}\n`;
    md += `- **Created Date**: ${new Date(record.createdAt).toLocaleString()}\n`;
    md += `- **Last Updated**: ${new Date(record.updatedAt).toLocaleString()}\n`;
    md += `- **Version Count**: ${record.snapshots.length} total snapshots\n\n`;

    // Latest Snapshot
    md += `## Latest Snapshot (v${latest.version})\n`;
    md += `- **Timestamp**: ${new Date(latest.timestamp).toLocaleString()}\n`;
    md += `- **Diagnosis**: ${latest.clinicalData.diseaseStatus.primaryDiagnosis || 'N/A'}\n`;
    md += `- **Stage**: ${latest.clinicalData.diseaseStatus.stageAtDiagnosis || 'N/A'}\n`;
    md += `- **Histology**: ${latest.clinicalData.diseaseStatus.histology || 'N/A'}\n`;
    md += `- **ECOG**: ${latest.performanceStatus ? latest.performanceStatus.performanceScore : 'N/A'}\n`;
    
    md += `\n### Clinical Findings\n`;
    md += `- **Biomarkers**: ${latest.clinicalData.diseaseStatus.biomarkers.length > 0 
      ? latest.clinicalData.diseaseStatus.biomarkers.map(b => `${b.name} (${b.status})`).join(', ') 
      : 'None recorded'}\n`;
    md += `- **Prior Treatments**: ${latest.clinicalData.treatmentHistory.length > 0 
      ? latest.clinicalData.treatmentHistory.map(t => `${t.treatmentLine}: ${t.treatmentRegimen}`).join(', ') 
      : 'None recorded'}\n\n`;

    // Latest CDS Output
    if (latest.protocolResults && latest.protocolResults.length > 0) {
      md += `### Latest CDS Output (Stored)\n`;
      const eligible = latest.protocolResults.filter(r => r.status === 'Eligible option');
      const potential = latest.protocolResults.filter(r => r.status === 'Potential option');
      const notEligible = latest.protocolResults.filter(r => r.status.includes('Not eligible'));

      if (eligible.length > 0) md += `**Eligible**\n${eligible.map(e => `- ${e.protocolName || e.protocolId}`).join('\n')}\n`;
      if (potential.length > 0) md += `\n**Potential**\n${potential.map(e => `- ${e.protocolName || e.protocolId}`).join('\n')}\n`;
      if (notEligible.length > 0) md += `\n**Not Eligible**\n${notEligible.map(e => `- ${e.protocolName || e.protocolId}`).join('\n')}\n`;
      md += `\n`;
    }

    // Optional Eligibility Delta
    if (options.comparisonSnapshots) {
      const [snapA, snapB] = options.comparisonSnapshots;
      const diff = compareSnapshots(snapA, snapB);
      md += `## Version Comparison (v${snapA.version} vs v${snapB.version})\n`;
      md += `> Eligibility changes are based on stored outputs only and require clinician review.\n\n`;
      
      if (diff.protocolDifferences.newlyEligible.length > 0) {
        md += `**Newly Eligible (B)**\n${diff.protocolDifferences.newlyEligible.map(p => `- ${p}`).join('\n')}\n`;
      }
      if (diff.protocolDifferences.noLongerEligible.length > 0) {
        md += `\n**No Longer Eligible (A)**\n${diff.protocolDifferences.noLongerEligible.map(p => `- ${p}`).join('\n')}\n`;
      }
      if (diff.protocolDifferences.stillEligible.length > 0) {
        md += `\n**Still Eligible (Identical)**\n${diff.protocolDifferences.stillEligible.map(p => `- ${p}`).join('\n')}\n`;
      }
      md += `\n`;
    }

    // Version History Summary
    if (options.includeHistory) {
      md += `## Version History Summary\n`;
      record.snapshots.slice().reverse().forEach(s => {
        md += `- **v${s.version}** (${new Date(s.timestamp).toLocaleDateString()}): ${s.summary ? s.summary.substring(0, 100) + '...' : 'No summary metadata'}\n`;
      });
      md += `\n`;
    }

    return md;
  }
};
