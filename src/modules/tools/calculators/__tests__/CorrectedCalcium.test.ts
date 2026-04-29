import { describe, it, expect } from 'vitest';

// Formula: Corrected Calcium mmol/L = measured calcium mmol/L + 0.02 * (40 - albumin g/L)
const calculateCorrectedCalciumLogic = (ca: number, alb: number) => {
  if (ca <= 0 || ca > 10 || alb <= 0 || alb > 100) return null;
  const result = ca + 0.02 * (40 - alb);
  return parseFloat(result.toFixed(2));
};

const getInterpretation = (val: number) => {
  if (val < 2.6) return 'not-elevated';
  if (val < 3.0) return 'elevated';
  return 'markedly-elevated';
};

describe('Corrected Calcium Calculator Logic', () => {
  it('measured calcium 2.4, albumin 30 → corrected calcium 2.60', () => {
    // 2.4 + 0.02 * (40 - 30) = 2.4 + 0.02 * 10 = 2.4 + 0.2 = 2.6
    const result = calculateCorrectedCalciumLogic(2.4, 30);
    expect(result).toBe(2.6);
    expect(getInterpretation(result!)).toBe('elevated');
  });

  it('measured calcium 2.8, albumin 40 → corrected calcium 2.80', () => {
    // 2.8 + 0.02 * (40 - 40) = 2.8
    const result = calculateCorrectedCalciumLogic(2.8, 40);
    expect(result).toBe(2.8);
    expect(getInterpretation(result!)).toBe('elevated');
  });

  it('detects severe elevation at corrected calcium ≥ 3.0', () => {
    // 2.8 + 0.02 * (40 - 30) = 2.8 + 0.2 = 3.0
    const result = calculateCorrectedCalciumLogic(2.8, 30);
    expect(result).toBe(3.0);
    expect(getInterpretation(result!)).toBe('markedly-elevated');
  });

  it('identifies not elevated band (< 2.6)', () => {
    // 2.4 + 0.02 * (40 - 45) = 2.4 - 0.1 = 2.3
    const result = calculateCorrectedCalciumLogic(2.4, 45);
    expect(result).toBe(2.3);
    expect(getInterpretation(result!)).toBe('not-elevated');
  });

  it('rejects invalid calcium (≤ 0 or impossible)', () => {
    expect(calculateCorrectedCalciumLogic(0, 40)).toBe(null);
    expect(calculateCorrectedCalciumLogic(-1, 40)).toBe(null);
    expect(calculateCorrectedCalciumLogic(11, 40)).toBe(null);
  });

  it('rejects invalid albumin (≤ 0 or impossible)', () => {
    expect(calculateCorrectedCalciumLogic(2.4, 0)).toBe(null);
    expect(calculateCorrectedCalciumLogic(2.4, -1)).toBe(null);
    expect(calculateCorrectedCalciumLogic(2.4, 101)).toBe(null);
  });
});
