import { cancerTypes, getSummaryTemplate } from './admissionTemplates';

export function getSummaryForCancerType(key: string) {
  const cancer = cancerTypes.find(c => c.key === key);
  const summary = getSummaryTemplate(key);
  if (typeof summary === 'string') {
    return {
      cancerType: cancer?.label || '',
      reason: '',
      urgency: '',
      checklistStatus: '',
    };
  }
  return {
    cancerType: cancer?.label || '',
    reason: summary.reason || '',
    urgency: summary.urgency || '',
    checklistStatus: summary.checklistStatus || '',
  };
}
