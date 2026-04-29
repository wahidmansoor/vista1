import { describe, it, expect } from 'vitest';

// We extract the logic for testing since the component is React-heavy
const calculateCalvertDose = (auc: number, gfr: number): { dose: number, isCapped: boolean } => {
  // Apply GFR Cap of 125 mL/min
  const effectiveGfr = Math.min(gfr, 125);
  const isCapped = gfr > 125;

  // Calvert Formula: Dose = AUC * (GFR + 25)
  const calculatedDose = auc * (effectiveGfr + 25);
  return {
    dose: Math.round(calculatedDose),
    isCapped
  };
};

describe('Carboplatin (Calvert) Calculator Logic', () => {
  it('should correctly calculate dose for GFR < 125', () => {
    // GFR 100, AUC 5 -> 5 * (100 + 25) = 625
    const result = calculateCalvertDose(5, 100);
    expect(result.dose).toBe(625);
    expect(result.isCapped).toBe(false);
  });

  it('should cap GFR at 125 and calculate dose for GFR > 125', () => {
    // GFR 150, AUC 5 -> 5 * (capped 125 + 25) = 750
    const result = calculateCalvertDose(5, 150);
    expect(result.dose).toBe(750);
    expect(result.isCapped).toBe(true);
  });

  it('should handle boundary condition GFR = 125', () => {
    // GFR 125, AUC 6 -> 6 * (125 + 25) = 900
    const result = calculateCalvertDose(6, 125);
    expect(result.dose).toBe(900);
    expect(result.isCapped).toBe(false);
  });

  it('should calculate correctly for AUC 6 and GFR 75', () => {
    // GFR 75, AUC 6 -> 6 * (75 + 25) = 600
    const result = calculateCalvertDose(6, 75);
    expect(result.dose).toBe(600);
    expect(result.isCapped).toBe(false);
  });
});
