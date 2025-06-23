import { FollowUpPlan } from '../logic/generateFollowUpPlan';

export const generatePDF = async (
  element: HTMLElement,
  options: { filename: string }
): Promise<void> => {
  try {
    const { toPDF } = await import('html2canvas');
    const pdf = await toPDF(element, {
      margin: [10, 10, 10, 10],
      filename: options.filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    });
    return pdf;
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw new Error('Failed to generate PDF');
  }
};
