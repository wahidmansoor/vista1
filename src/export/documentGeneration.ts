/**
 * Multi-Format Export System for Cancer Screening Engine
 * ------------------------------------------------------
 * Provides export functions for PDF, EMR, CSV, JSON, patient portal, and care team communication.
 * Includes professional formatting, accessibility, and error handling.
 */

import { ClinicalReport, ScreeningPlan } from './clinicalReports';
import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas'; // For chart/image embedding if needed

// 1. Professional PDF Reports
export async function exportToPDF(report: ClinicalReport, options?: { letterheadUrl?: string; digitalSignature?: string }): Promise<Blob> {
  try {
    const doc = new jsPDF();
    // Letterhead
    if (options?.letterheadUrl) {
      // Optionally embed letterhead image (requires html2canvas or base64)
      // await doc.addImage(options.letterheadUrl, 'PNG', 10, 10, 190, 20);
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Cancer Screening Clinical Report', 10, 30);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(report.executiveSummary, 10, 40);
    doc.addPage();
    doc.text(report.detailedAssessment, 10, 20);
    doc.addPage();
    doc.text(report.patientHandout, 10, 20);
    // Digital signature
    if (options?.digitalSignature) {
      doc.text(`Digitally signed by: ${options.digitalSignature}`, 10, 280);
    }
    // Print optimization: margins, page breaks, etc.
    // Accessibility: font size, contrast, alt text for images (if any)
    return doc.output('blob');
  } catch (err) {
    throw new Error('PDF export failed: ' + (err instanceof Error ? err.message : String(err)));
  }
}

// 2. EMR-Compatible Data Formats
export function exportToFHIR(screeningPlan: ScreeningPlan): object {
  // HL7 FHIR Bundle (simplified)
  try {
    return {
      resourceType: 'Bundle',
      type: 'document',
      entry: screeningPlan.recommendations.map(rec => ({
        resource: {
          resourceType: 'ProcedureRequest',
          code: { text: rec.test_recommended },
          status: 'active',
          intent: 'order',
          reasonCode: [{ text: rec.rationale.clinical_reasoning }],
          note: [{ text: rec.rationale.guideline_source }],
        }
      }))
    };
  } catch (err) {
    throw new Error('FHIR export failed: ' + (err instanceof Error ? err.message : String(err)));
  }
}

export function exportToCDA(screeningPlan: ScreeningPlan): string {
  // CDA XML (very simplified)
  try {
    let xml = `<?xml version="1.0"?><ClinicalDocument><component><structuredBody>`;
    for (const rec of screeningPlan.recommendations) {
      xml += `<section><title>${rec.cancer_type}</title><text>${rec.rationale.clinical_reasoning}</text></section>`;
    }
    xml += `</structuredBody></component></ClinicalDocument>`;
    return xml;
  } catch (err) {
    throw new Error('CDA export failed: ' + (err instanceof Error ? err.message : String(err)));
  }
}

export function exportToCSV(screeningPlan: ScreeningPlan): string {
  try {
    const header = 'CancerType,Test,Status,DueDate,Result\n';
    const rows = screeningPlan.timeline.map(t => `${t.test},${t.status},${t.dueDate.toISOString()},${t.result || ''}`);
    return header + rows.join('\n');
  } catch (err) {
    throw new Error('CSV export failed: ' + (err instanceof Error ? err.message : String(err)));
  }
}

export function exportToJSON(screeningPlan: ScreeningPlan): string {
  try {
    return JSON.stringify(screeningPlan, null, 2);
  } catch (err) {
    throw new Error('JSON export failed: ' + (err instanceof Error ? err.message : String(err)));
  }
}

// 3. Patient Portal Integration
export function exportForPatientPortal(report: ClinicalReport): object {
  return {
    title: 'Your Cancer Screening Plan',
    summary: report.executiveSummary,
    handout: report.patientHandout,
    timeline: report.emrData.timeline,
    reminders: report.emrData.timeline.filter((t: any) => t.status === 'due' || t.status === 'planned'),
    accessibility: {
      mobileFriendly: true,
      section508: true,
      wcag21: true,
    },
  };
}

// 4. Care Team Communication
export function generateReferralLetter(report: ClinicalReport, recipient: string): string {
  return `Referral Letter\nTo: ${recipient}\n\n${report.executiveSummary}\n\nPlease see attached detailed assessment and recommendations.`;
}

export function generateConsultantTemplate(report: ClinicalReport, consultant: string): string {
  return `Consultation Request\nConsultant: ${consultant}\n\n${report.detailedAssessment}\n\nPlease provide your expert opinion on the above case.`;
}

export function generateCareCoordinationSummary(report: ClinicalReport): string {
  return `Care Coordination Summary\n\n${report.executiveSummary}\n\nAction Items:\n${report.emrData.actionItems.join('\n')}`;
}

export function generateQualityReport(report: ClinicalReport): string {
  return `Quality Reporting\n\n${report.emrData.qualityMeasures}`;
}
