import { FollowUpPlan } from '../logic/generateFollowUpPlan';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePDF = async (
  element: HTMLElement,
  options: { filename: string }
): Promise<void> => {
  try {
    // Create a canvas from the DOM element
    const canvas = await html2canvas(element, {
      scale: 2,
      logging: false,
      useCORS: true
    });
    
    // Create a new jsPDF instance
    const pdf = new jsPDF({
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    });
    
    // Calculate dimensions
    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = canvas.height * imgWidth / canvas.width;
    
    // Add the image to the PDF
    pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
    
    // Save the PDF
    pdf.save(options.filename);
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw new Error('Failed to generate PDF');
  }
};
