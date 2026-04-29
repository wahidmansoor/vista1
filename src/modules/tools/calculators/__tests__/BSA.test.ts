import { describe, it, expect } from 'vitest';

// Mosteller Formula: BSA = sqrt((Height * Weight) / 3600)

const calculateBSALogic = (height: number, weight: number) => {
  if (height <= 0 || weight <= 0) return null;
  const result = Math.sqrt((height * weight) / 3600);
  return parseFloat(result.toFixed(2));
};

describe('BSA Calculator Logic (Mosteller)', () => {
  it('calculates correctly for standard case', () => {
    // 170cm, 70kg -> sqrt(11900 / 3600) = sqrt(3.3055) = 1.818... -> 1.82
    expect(calculateBSALogic(170, 70)).toBe(1.82);
  });

  it('returns null for zero height or weight', () => {
    expect(calculateBSALogic(0, 70)).toBe(null);
    expect(calculateBSALogic(170, 0)).toBe(null);
  });

  it('returns null for negative height or weight', () => {
    expect(calculateBSALogic(-170, 70)).toBe(null);
    expect(calculateBSALogic(170, -70)).toBe(null);
  });

  it('handles extreme values without crashing', () => {
    // 250cm, 200kg -> sqrt(50000 / 3600) = sqrt(13.888) = 3.726... -> 3.73
    const bsa = calculateBSALogic(250, 200);
    expect(bsa).toBe(3.73);
    expect(typeof bsa).toBe('number');
  });
});
