import { describe, it, expect } from 'vitest';

/**
 * OME Estimation Logic
 */
const OME_FACTORS = {
  'oral-morphine': 1,
  'oral-oxycodone': 1.5,
  'oral-hydromorphone': 4,
  'iv-morphine': 3
};

const MAX_SAFE_DOSE = {
  'oral-morphine': 200,
  'oral-oxycodone': 120,
  'oral-hydromorphone': 40,
  'iv-morphine': 60
};

const calculateOMELogic = (sourceOpioid: string, dose: number) => {
  if (dose <= 0) return { error: 'Dose must be greater than zero.' };
  
  const factor = OME_FACTORS[sourceOpioid as keyof typeof OME_FACTORS];
  if (!factor) return { error: 'Unsupported opioid' };

  if (dose > MAX_SAFE_DOSE[sourceOpioid as keyof typeof MAX_SAFE_DOSE]) {
    return { error: 'Dose requires specialist review before calculation.' };
  }

  const ome = dose * factor;
  return { value: parseFloat(ome.toFixed(1)) };
};

describe('Opioid OME Estimator Logic', () => {
  it('Oral morphine 30 mg/day → OME 30 mg/day', () => {
    const res = calculateOMELogic('oral-morphine', 30);
    expect(res.value).toBe(30);
  });

  it('Oral oxycodone 20 mg/day → OME 30 mg/day', () => {
    const res = calculateOMELogic('oral-oxycodone', 20);
    expect(res.value).toBe(30);
  });

  it('Oral hydromorphone 5 mg/day → OME 20 mg/day', () => {
    const res = calculateOMELogic('oral-hydromorphone', 5);
    expect(res.value).toBe(20);
  });

  it('IV morphine 10 mg/day → OME 30 mg/day', () => {
    const res = calculateOMELogic('iv-morphine', 10);
    expect(res.value).toBe(30);
  });

  it('invalid dose rejected', () => {
    const res = calculateOMELogic('oral-morphine', -5);
    expect(res.error).toBe('Dose must be greater than zero.');
  });

  it('unsupported opioid rejected', () => {
    const res = calculateOMELogic('fentanyl-patch', 25);
    expect(res.error).toBe('Unsupported opioid');
  });

  it('extreme dose triggers specialist review message', () => {
    // Max for oxycodone is 120
    const res = calculateOMELogic('oral-oxycodone', 150);
    expect(res.error).toBe('Dose requires specialist review before calculation.');
  });
});
