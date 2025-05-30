import { EnhancedSearchResult } from '@/services/handbookEnhancedSearch';

/**
 * Export formats for search results
 */
export type ExportFormat = 'pdf' | 'docx' | 'markdown' | 'csv';

/**
 * Options for exporting search results
 */
export interface ExportOptions {
  format: ExportFormat;
  includeExcerpts?: boolean;
  includeMetadata?: boolean;
  fileName?: string;
}

/**
 * Utility function to export search results for clinical documentation
 * @param results Search results to export
 * @param query The search query used
 * @param options Export options including format
 * @returns Promise that resolves when export is complete
 */
export async function exportSearchResults(
  results: EnhancedSearchResult[],
  query: string,
  options: ExportOptions
): Promise<void> {
  const { format, includeExcerpts = true, includeMetadata = true, fileName } = options;
  
  // Generate default filename if not provided
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
  const defaultFileName = `oncovista-search-${query.replace(/\s+/g, '-').toLowerCase()}-${timestamp}`;
  const outputFileName = fileName || defaultFileName;
  
  switch (format) {
    case 'csv':
      return exportAsCSV(results, query, outputFileName, includeExcerpts, includeMetadata);
    case 'markdown':
      return exportAsMarkdown(results, query, outputFileName, includeExcerpts, includeMetadata);
    case 'docx':
      return exportAsDocx(results, query, outputFileName, includeExcerpts, includeMetadata);
    case 'pdf':
      return exportAsPDF(results, query, outputFileName, includeExcerpts, includeMetadata);
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}

/**
 * Export search results as CSV
 */
async function exportAsCSV(
  results: EnhancedSearchResult[],
  query: string,
  fileName: string,
  includeExcerpts: boolean,
  includeMetadata: boolean
): Promise<void> {
  // Create CSV header row
  let csvContent = 'Title,Section,Path';
  if (includeExcerpts) csvContent += ',Excerpt';
  if (includeMetadata) csvContent += ',Clinical Level,Tags,Last Updated,Author';
  csvContent += '\n';
  
  // Add rows for each result
  results.forEach(result => {
    // Clean text fields to handle commas and quotes in CSV
    const cleanForCSV = (text: string = '') => 
      `"${text.replace(/"/g, '""').replace(/<\/?mark>/g, '')}"`;
    
    const sectionName = result.section.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    let row = `${cleanForCSV(result.title)},${cleanForCSV(sectionName)},${cleanForCSV(result.path)}`;
    
    if (includeExcerpts) {
      // Clean excerpt from HTML tags
      const cleanExcerpt = result.excerpt?.replace(/<\/?mark>/g, '') || '';
      row += `,${cleanForCSV(cleanExcerpt)}`;
    }
    
    if (includeMetadata) {
      const level = result.metadata?.clinicalLevel || '';
      const tags = (result.metadata?.tags || []).join(', ');
      const lastUpdated = result.metadata?.lastUpdated || '';
      const author = result.metadata?.author || '';
      
      row += `,${cleanForCSV(level)},${cleanForCSV(tags)},${cleanForCSV(lastUpdated)},${cleanForCSV(author)}`;
    }
    
    csvContent += row + '\n';
  });
  
  // Create a Blob and download it
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  downloadFile(blob, `${fileName}.csv`);
}

/**
 * Export search results as Markdown
 */
async function exportAsMarkdown(
  results: EnhancedSearchResult[],
  query: string,
  fileName: string,
  includeExcerpts: boolean,
  includeMetadata: boolean
): Promise<void> {
  // Create markdown content
  let mdContent = `# OncoVista Handbook Search Results\n\n`;
  mdContent += `**Query:** ${query}\n`;
  mdContent += `**Date:** ${new Date().toLocaleDateString()}\n`;
  mdContent += `**Results:** ${results.length}\n\n`;
  
  // Add each result
  results.forEach((result, index) => {
    const sectionName = result.section.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    mdContent += `## ${index + 1}. ${result.title}\n\n`;
    mdContent += `**Section:** ${sectionName}\n`;
    mdContent += `**Path:** \`${result.path}\`\n\n`;
    
    if (includeMetadata && result.metadata) {
      mdContent += `### Metadata\n\n`;
      if (result.metadata.clinicalLevel) mdContent += `- **Clinical Level:** ${result.metadata.clinicalLevel}\n`;
      if (result.metadata.lastUpdated) mdContent += `- **Last Updated:** ${result.metadata.lastUpdated}\n`;
      if (result.metadata.author) mdContent += `- **Author:** ${result.metadata.author}\n`;
      if (result.metadata.tags && result.metadata.tags.length > 0) {
        mdContent += `- **Tags:** ${result.metadata.tags.join(', ')}\n`;
      }
      mdContent += '\n';
    }
    
    if (includeExcerpts && result.excerpt) {
      mdContent += `### Excerpt\n\n`;
      // Clean excerpt from HTML tags
      const cleanExcerpt = result.excerpt.replace(/<mark>/g, '**').replace(/<\/mark>/g, '**');
      mdContent += `${cleanExcerpt}\n\n`;
    }
    
    mdContent += `---\n\n`;
  });
  
  // Add footer
  mdContent += `\n\n*Exported from OncoVista Handbook*`;
  
  // Create a Blob and download it
  const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
  downloadFile(blob, `${fileName}.md`);
}

/**
 * Export search results as DOCX
 * In a real application, you might use a library like docx.js
 * This is a simplified placeholder implementation
 */
async function exportAsDocx(
  results: EnhancedSearchResult[],
  query: string,
  fileName: string,
  includeExcerpts: boolean,
  includeMetadata: boolean
): Promise<void> {
  // In a real implementation, you would use a library like docx.js to generate the file
  // For this example, we'll use a simple HTML-based approach and convert it
  
  alert('DOCX export is not fully implemented in this version. Please use Markdown or CSV format.');
  
  // This would be the correct way to implement it with a proper library:
  // const doc = new Document();
  // ... add content to document
  // const blob = await Packer.toBlob(doc);
  // downloadFile(blob, `${fileName}.docx`);
}

/**
 * Export search results as PDF
 * In a real application, you might use a library like pdfmake or jsPDF
 * This is a simplified placeholder implementation
 */
async function exportAsPDF(
  results: EnhancedSearchResult[],
  query: string,
  fileName: string,
  includeExcerpts: boolean,
  includeMetadata: boolean
): Promise<void> {
  // In a real implementation, you would use a library like jsPDF to generate the file
  // For this example, we'll use a simple HTML-based approach and print to PDF
  
  alert('PDF export is not fully implemented in this version. Please use Markdown or CSV format.');
  
  // This would be the correct way to implement it with a proper library:
  // const pdf = new jsPDF();
  // ... add content to PDF
  // pdf.save(`${fileName}.pdf`);
}

/**
 * Helper function to trigger file download
 */
function downloadFile(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
