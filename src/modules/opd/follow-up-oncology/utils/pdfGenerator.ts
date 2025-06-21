import { FollowUpPlan } from '../logic/generateFollowUpPlan';

export const generatePDF = async (
  element: HTMLElement,
  options: { filename: string }
): Promise<void> => {
  try {
    const html2canvas = (await import('html2canvas')).default;
    const jsPDF = (await import('jspdf')).default;
    
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF('portrait', 'mm', 'a4');
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(options.filename);
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw new Error('Failed to generate PDF');
  }
};
