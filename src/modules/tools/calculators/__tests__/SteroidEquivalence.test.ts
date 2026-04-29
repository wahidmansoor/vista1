import { describe, it, expect } from 'vitest';

/**
 * Steroid Equivalence Logic
 * Based on prednisone 5mg = Hydrocortisone 20mg = Prednisolone 5mg = Methylprednisolone 4mg = Dexamethasone 0.75mg
 */
const STEROID_EQUIVALENTS: Record<string, number> = {
  hydrocortisone: 20,
  prednisone: 5,
  prednisolone: 5,
  methylprednisolone: 4,
  dexamethasone: 0.75
};

const calculateConversionLogic = (sourceSteroid: string, sourceDose: number, targetSteroid: string) => {
  if (sourceDose <= 0) return null;
  if (!STEROID_EQUIVALENTS[sourceSteroid] || !STEROID_EQUIVALENTS[targetSteroid]) return null;

  // Prednisone = (dose / source_val) * prednisone_val (where prednisone_val = 5)
  const prednisoneEquiv = (sourceDose / STEROID_EQUIVALENTS[sourceSteroid]) * 5;
  
  // Target = (pred_equiv / 5) * target_val
  const targetEquiv = (prednisoneEquiv / 5) * STEROID_EQUIVALENTS[targetSteroid];
  
  return {
    target: parseFloat(targetEquiv.toFixed(2)),
    prednisone: parseFloat(prednisoneEquiv.toFixed(2))
  };
};

describe('Steroid Equivalence Calculator Logic', () => {
  it('Prednisone 5 mg → Hydrocortisone 20 mg', () => {
    const res = calculateConversionLogic('prednisone', 5, 'hydrocortisone');
    expect(res?.target).toBe(20);
    expect(res?.prednisone).toBe(5);
  });

  it('Dexamethasone 0.75 mg → Prednisone 5 mg', () => {
    const res = calculateConversionLogic('dexamethasone', 0.75, 'prednisone');
    expect(res?.target).toBe(5);
    expect(res?.prednisone).toBe(5);
  });

  it('Methylprednisolone 4 mg → Prednisone 5 mg', () => {
    const res = calculateConversionLogic('methylprednisolone', 4, 'prednisone');
    expect(res?.target).toBe(5);
    expect(res?.prednisone).toBe(5);
  });

  it('Dexamethasone 4 mg → Prednisone conversion', () => {
    // (4 / 0.75) * 5 = 5.333 * 5 = 26.666
    const res = calculateConversionLogic('dexamethasone', 4, 'prednisone');
    expect(res?.target).toBe(26.67);
  });

  it('invalid dose rejected', () => {
    expect(calculateConversionLogic('prednisone', 0, 'dexamethasone')).toBe(null);
    expect(calculateConversionLogic('prednisone', -10, 'dexamethasone')).toBe(null);
  });

  it('unsupported steroid rejected', () => {
    expect(calculateConversionLogic('nonsense', 5, 'prednisone')).toBe(null);
    expect(calculateConversionLogic('prednisone', 5, 'nonsense')).toBe(null);
  });
});
