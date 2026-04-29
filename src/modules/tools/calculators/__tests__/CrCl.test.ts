import { describe, it, expect } from 'vitest';

// Cockcroft-Gault Formula: ((140 - age) * weight) / (72 * sCr)
// Female factor: 0.85
// Unit Conversion: 1 mg/dL = 88.4 µmol/L

const calculateCrClLogic = (age: number, weight: number, scr: number, unit: 'mg/dL' | 'µmol/L', gender: string) => {
  const sCrMgDl = unit === 'µmol/L' ? scr / 88.4 : scr;
  let crclValue = ((140 - age) * weight) / (72 * sCrMgDl);
  if (gender === 'female') {
    crclValue = crclValue * 0.85;
  }
  return parseFloat(crclValue.toFixed(2));
};

describe('CrCl Calculator Logic (Cockcroft-Gault)', () => {
  it('calculates correctly for male in mg/dL', () => {
    // age 60, weight 70, sCr 1.0, male
    // (140 - 60) * 70 / (72 * 1.0) = 80 * 70 / 72 = 5600 / 72 = 77.777...
    const result = calculateCrClLogic(60, 70, 1.0, 'mg/dL', 'male');
    expect(result).toBe(77.78);
  });

  it('calculates correctly for female in mg/dL', () => {
    // (140 - 60) * 70 / (72 * 1.0) * 0.85 = 77.777... * 0.85 = 66.111...
    const result = calculateCrClLogic(60, 70, 1.0, 'mg/dL', 'female');
    expect(result).toBe(66.11);
  });

  it('calculates correctly using µmol/L (88.4 µmol/L = 1 mg/dL)', () => {
    const result = calculateCrClLogic(60, 70, 88.4, 'µmol/L', 'male');
    expect(result).toBe(77.78);
  });

  it('calculates correctly using µmol/L (176.8 µmol/L = 2 mg/dL)', () => {
    const resultUmol = calculateCrClLogic(60, 70, 176.8, 'µmol/L', 'male');
    const resultMgDl = calculateCrClLogic(60, 70, 2.0, 'mg/dL', 'male');
    expect(resultUmol).toBe(resultMgDl);
    expect(resultUmol).toBe(38.89); // 5600 / 144
  });
});
