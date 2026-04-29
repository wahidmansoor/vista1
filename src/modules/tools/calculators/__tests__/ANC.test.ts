import { describe, it, expect } from 'vitest';

// ANC = WBC * (%Neutrophils + %Bands) / 100

const calculateANCLogic = (wbc: number, neutrophils: number, bands: number) => {
  if (wbc <= 0 || neutrophils < 0 || bands < 0) return null;
  const result = (wbc * (neutrophils + bands)) / 100;
  return parseFloat(result.toFixed(2));
};

const getSeverity = (anc: number) => {
  if (anc >= 1.5) return 'normal';
  if (anc >= 1.0) return 'mild';
  if (anc >= 0.5) return 'moderate';
  return 'severe';
};

describe('ANC Calculator Logic', () => {
  it('calculates correctly for normal case', () => {
    // WBC = 5, Neutro = 50, Bands = 5 -> 5 * (55) / 100 = 2.75
    const anc = calculateANCLogic(5, 50, 5);
    expect(anc).toBe(2.75);
    expect(getSeverity(anc!)).toBe('normal');
  });

  it('detects severe neutropenia', () => {
    // WBC = 1, Neutro = 10, Bands = 5 -> 1 * 15 / 100 = 0.15
    const anc = calculateANCLogic(1, 10, 5);
    expect(anc).toBe(0.15);
    expect(getSeverity(anc!)).toBe('severe');
  });

  it('detects moderate neutropenia', () => {
    // WBC = 2, Neutro = 20, Bands = 10 -> 2 * 30 / 100 = 0.6
    const anc = calculateANCLogic(2, 20, 10);
    expect(anc).toBe(0.6);
    expect(getSeverity(anc!)).toBe('moderate');
  });

  it('returns null for invalid inputs', () => {
    expect(calculateANCLogic(-1, 50, 5)).toBe(null);
    expect(calculateANCLogic(5, -1, 5)).toBe(null);
    expect(calculateANCLogic(5, 50, -1)).toBe(null);
    expect(calculateANCLogic(0, 50, 5)).toBe(null);
  });
});
