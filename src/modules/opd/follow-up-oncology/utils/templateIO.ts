import { FollowUpTemplate, CancerType } from '../data/followUpTemplates';
import { validateTemplate } from './templateValidation';

export const exportTemplate = (
  cancerType: CancerType,
  template: FollowUpTemplate
): string => {
  return JSON.stringify({
    cancerType,
    template,
    exportDate: new Date().toISOString()
  }, null, 2);
};

export const importTemplate = async (
  file: File
): Promise<{ cancerType: CancerType; template: FollowUpTemplate }> => {
  try {
    const content = await file.text();
    const parsed = JSON.parse(content);
    
    const validation = validateTemplate(parsed.template, parsed.cancerType);
    if (!validation.isValid) {
      throw new Error(`Invalid template: ${validation.errors.join(', ')}`);
    }

    return parsed;  } catch (error) {
    throw new Error(`Failed to import template: ${error instanceof Error ? error.message : String(error)}`);
  }
};
