import { describe, it, expect } from 'vitest';

// BMI = weight_kg / (height_m * height_m)
const calculateBMILogic = (hCm: number, wKg: number) => {
  if (hCm <= 0 || hCm > 250 || wKg <= 0 || wKg > 500) return null;
  const hM = hCm / 100;
  const bmiValue = wKg / (hM * hM);
  return parseFloat(bmiValue.toFixed(1));
};

const getInterpretation = (val: number) => {
  if (val < 18.5) return 'below-reference';
  if (val < 25.0) return 'within-reference';
  if (val < 30.0) return 'above-reference';
  return 'elevated-bmi';
};

describe('BMI Calculator Logic', () => {
  it('height 170 cm, weight 70 kg → BMI 24.2', () => {
    // 70 / (1.7 * 1.7) = 70 / 2.89 = 24.22
    const result = calculateBMILogic(170, 70);
    expect(result).toBe(24.2);
    expect(getInterpretation(result!)).toBe('within-reference');
  });

  it('height 180 cm, weight 90 kg → BMI 27.8', () => {
    // 90 / (1.8 * 1.8) = 90 / 3.24 = 27.77
    const result = calculateBMILogic(180, 90);
    expect(result).toBe(27.8);
    expect(getInterpretation(result!)).toBe('above-reference');
  });

  it('BMI ≥ 30 returns elevated BMI range', () => {
    // 100 / (1.8 * 1.8) = 100 / 3.24 = 30.86
    const result = calculateBMILogic(180, 100);
    expect(result).toBe(30.9);
    expect(getInterpretation(result!)).toBe('elevated-bmi');
  });

  it('detects below reference range (< 18.5)', () => {
    // 50 / (1.7 * 1.7) = 50 / 2.89 = 17.3
    const result = calculateBMILogic(170, 50);
    expect(result).toBe(17.3);
    expect(getInterpretation(result!)).toBe('below-reference');
  });

  it('rejects invalid height (≤ 0 or clearly impossible)', () => {
    expect(calculateBMILogic(0, 70)).toBe(null);
    expect(calculateBMILogic(-1, 70)).toBe(null);
    expect(calculateBMILogic(300, 70)).toBe(null);
  });

  it('rejects invalid weight (≤ 0 or clearly impossible)', () => {
    expect(calculateBMILogic(170, 0)).toBe(null);
    expect(calculateBMILogic(170, -1)).toBe(null);
    expect(calculateBMILogic(170, 600)).toBe(null);
  });
});
