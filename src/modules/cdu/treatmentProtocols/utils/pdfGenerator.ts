import { Protocol, ProtocolDrug } from './types/protocol';

export const generateProtocolPDF = (protocol: Protocol): string => {
  if (protocol.treatment?.drugs?.length) {
    const drugsList = protocol.treatment.drugs.map((drug: ProtocolDrug) => {
      const details = [];
      if (drug.name) details.push(`<strong>${drug.name}</strong>`);
      if (drug.dose) details.push(`Dose: ${drug.dose}`);
      if (drug.administration) details.push(`Route: ${drug.administration}`);
      if (drug.special_notes?.length) {
        details.push(`Notes: ${drug.special_notes.join(', ')}`);
      }
      return details.join(' | ');
    });
    return drugsList.join('\n');
  }
  return '';
};
