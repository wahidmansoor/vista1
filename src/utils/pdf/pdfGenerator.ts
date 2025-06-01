import type { Protocol } from './types/protocol';

/**
 * Generates and exports a PDF document from a treatment protocol
 * @param protocol - The protocol object to export
 * @param options - Optional configuration for PDF generation
 * @returns Promise that resolves when PDF is generated
 */
export const generateProtocolPDF = async (
  protocol: Protocol,
  options: {
    filename?: string;
    includeAIInsights?: boolean;
    includeDebugInfo?: boolean;
  } = {}
): Promise<void> => {
  if (!protocol) {
    throw new Error('Protocol is required for PDF generation');
  }
  
  try {
    // Format protocol data for PDF
    const content = formatProtocolForPDF(protocol, options);
    
    // Create filename based on protocol code
    const filename = options.filename || `${protocol.code.replace(/\s+/g, '-')}_Protocol.pdf`;
    
    // In production, we'd use a PDF library like jsPDF
    // For this implementation, we'll use browser print functionality
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${protocol.code} Protocol</title>
            <style>
              body {
                font-family: system-ui, -apple-system, sans-serif;
                line-height: 1.5;
                padding: 2rem;
                max-width: 800px;
                margin: 0 auto;
              }
              h1, h2, h3 {
                color: #1e40af;
                margin-top: 1.5em;
                margin-bottom: 0.5em;
              }
              .protocol-header {
                border-bottom: 1px solid #e5e7eb;
                padding-bottom: 1rem;
                margin-bottom: 2rem;
              }
              .warning {
                color: #dc2626;
                background-color: #fee2e2;
                padding: 0.5rem;
                border-radius: 0.25rem;
                margin: 1rem 0;
              }
              .meta {
                color: #6b7280;
                font-size: 0.875rem;
              }
              .section {
                margin-bottom: 2rem;
              }
              .drug-list li {
                margin-bottom: 0.5rem;
              }
              table {
                border-collapse: collapse;
                width: 100%;
                margin: 1rem 0;
              }
              th, td {
                border: 1px solid #e5e7eb;
                padding: 0.5rem;
                text-align: left;
              }
              th {
                background-color: #f9fafb;
              }
              @media print {
                body {
                  padding: 0;
                }
                .no-print {
                  display: none;
                }
              }
            </style>
          </head>
          <body>
            <div class="protocol-header">
              <h1>${protocol.code}</h1>
              <div class="meta">
                ${protocol.tumour_group ? `<strong>Tumor Group:</strong> ${protocol.tumour_group}` : ''}
                ${protocol.treatment_intent ? `<strong>Intent:</strong> ${protocol.treatment_intent}` : ''}
              </div>
            </div>
            ${content}
            <div class="meta" style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #e5e7eb;">
              Generated on: ${new Date().toLocaleDateString()}
              ${protocol.version ? `<br>Version: ${protocol.version}` : ''}
              ${protocol.last_reviewed ? `<br>Last Reviewed: ${protocol.last_reviewed}` : ''}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      // Provide time for resources to load before printing
      setTimeout(() => {
        printWindow.print();
      }, 500);
    } else {
      console.error('Could not open print window');
      throw new Error('Could not open print window');
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};

/**
 * Formats protocol data into HTML content for PDF generation
 */
const formatProtocolForPDF = (
  protocol: Protocol,
  options: { includeAIInsights?: boolean; includeDebugInfo?: boolean } = {}
): string => {
  // Sections array to build HTML content
  const sections: string[] = [];

  // Overview section
  if (protocol.summary) {
    sections.push(`
      <div class="section">
        <h2>Clinical Summary</h2>
        <p>${protocol.summary}</p>
      </div>
    `);
  }

  // Treatment section with drugs
  if (protocol.treatment?.drugs?.length) {
    const drugsList = protocol.treatment.drugs.map(drug => {
      const details = [];
      if (drug.name) details.push(`<strong>${drug.name}</strong>`);
      if (drug.dose) details.push(`Dose: ${drug.dose}`);
      if (drug.administration) details.push(`Route: ${drug.administration}`);
      // Note: timing property doesn't exist on ProtocolDrug interface
      return `<li>${details.join(' | ')}</li>`;
    }).join('');

    sections.push(`
      <div class="section">
        <h2>Treatment Regimen</h2>
        <ul class="drug-list">
          ${drugsList}
        </ul>
        ${protocol.cycle_info ? `<p><strong>Cycle Information:</strong> ${protocol.cycle_info}</p>` : ''}
      </div>
    `);
  }

  // Warnings and precautions
  if (protocol.precautions?.length) {
    const warningsList = protocol.precautions.map(warning => 
      `<li class="warning">⚠️ ${warning.note}</li>`
    ).join('');
    
    sections.push(`
      <div class="section">
        <h2>Precautions & Warnings</h2>
        <ul>
          ${warningsList}
        </ul>
      </div>
    `);
  }

  // Pre-medications
  if (protocol.pre_medications?.required?.length) {
    const premedsList = protocol.pre_medications.required.map(med => {
      const details = [];
      if (med.name) details.push(`<strong>${med.name}</strong>`);
      if (med.dose) details.push(med.dose);
      if (med.timing) details.push(med.timing);
      return `<li>${details.join(' | ')}</li>`;
    }).join('');

    sections.push(`
      <div class="section">
        <h2>Required Pre-Medications</h2>
        <ul>
          ${premedsList}
        </ul>
      </div>
    `);
  }

  // Monitoring requirements
  const hasMonitoring = protocol.monitoring?.baseline?.length || protocol.monitoring?.ongoing?.length;
  if (hasMonitoring) {
    sections.push(`
      <div class="section">
        <h2>Monitoring Requirements</h2>
        ${protocol.monitoring?.baseline?.length ? `
          <h3>Baseline Tests</h3>
          <ul>
            ${protocol.monitoring.baseline.map((test: string) => `<li>${test}</li>`).join('')}
          </ul>
        ` : ''}
        
        ${protocol.monitoring?.ongoing?.length ? `
          <h3>Ongoing Monitoring</h3>
          <ul>
            ${protocol.monitoring.ongoing.map((test: string) => `<li>${test}</li>`).join('')}
          </ul>
        ` : ''}
      </div>
    `);
  }

  // Toxicity management
  if (protocol.toxicity_monitoring?.expected_toxicities?.length) {
    sections.push(`
      <div class="section">
        <h2>Expected Toxicities</h2>
        <ul>
          ${protocol.toxicity_monitoring.expected_toxicities.map(tox => `<li>${tox}</li>`).join('')}
        </ul>
      </div>
    `);
  }
  
  // Supportive care
  if (protocol.supportive_care?.required?.length) {
    const careList = protocol.supportive_care.required.map(care => {
      const details = [];
      if (care.name) details.push(`<strong>${care.name}</strong>`);
      if (care.administration) details.push(care.administration);
      if (care.special_notes?.length) details.push(care.special_notes.join(', '));
      return `<li>${details.join(': ')}</li>`;
    }).join('');

    sections.push(`
      <div class="section">
        <h2>Supportive Care Requirements</h2>
        <ul>
          ${careList}
        </ul>
      </div>
    `);
  }

  // AI Insights section (optional)
  if (options.includeAIInsights && protocol.ai_notes) {
    const aiContent = [];
    
    if (protocol.ai_notes.recommendations?.length) {
      aiContent.push(`
        <h3>AI Recommendations</h3>
        <ul>
          ${protocol.ai_notes.recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ul>
      `);
    }
    
    if (protocol.ai_notes.warnings?.length) {
      aiContent.push(`
        <h3>AI Warnings</h3>
        <ul class="warning">
          ${protocol.ai_notes.warnings.map(warn => `<li>⚠️ ${warn}</li>`).join('')}
        </ul>
      `);
    }
    
    if (aiContent.length) {
      sections.push(`
        <div class="section">
          <h2>AI Clinical Decision Support</h2>
          ${aiContent.join('')}
        </div>
      `);
    }
  }

  // Debug info (optional)
  if (options.includeDebugInfo) {
    sections.push(`
      <div class="section">
        <h2>Debug Information</h2>
        <pre style="font-size: 0.8rem; overflow-x: auto; white-space: pre-wrap; background: #f8fafc; padding: 1rem; border: 1px solid #e2e8f0;">
          ${JSON.stringify(protocol, null, 2)}
        </pre>
      </div>
    `);
  }

  return sections.join('');
};
