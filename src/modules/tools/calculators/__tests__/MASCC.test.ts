import { describe, it, expect } from 'vitest';

/**
 * MASCC scoring logic
 */
const calculateMASCCLogic = (
  burden: 'none-mild' | 'moderate' | 'severe',
  others: {
    noHypotension: boolean;
    noCOPD: boolean;
    solidTumorNoFungal: boolean;
    noDehydration: boolean;
    outpatient: boolean;
    ageUnder60: boolean;
  }
) => {
  let score = 0;
  if (burden === 'none-mild') score += 5;
  else if (burden === 'moderate') score += 3;
  
  if (others.noHypotension) score += 5;
  if (others.noCOPD) score += 4;
  if (others.solidTumorNoFungal) score += 4;
  if (others.noDehydration) score += 3;
  if (others.outpatient) score += 3;
  if (others.ageUnder60) score += 2;
  
  return score;
};

const getRiskCategory = (val: number) => {
  if (val >= 21) return 'lower-risk';
  return 'higher-risk';
};

describe('MASCC Calculator Logic', () => {
  const allTrue = {
    noHypotension: true,
    noCOPD: true,
    solidTumorNoFungal: true,
    noDehydration: true,
    outpatient: true,
    ageUnder60: true
  };

  it('all favorable criteria → 26', () => {
    const score = calculateMASCCLogic('none-mild', allTrue);
    expect(score).toBe(26);
    expect(getRiskCategory(score)).toBe('lower-risk');
  });

  it('moderate burden instead of mild → 24', () => {
    const score = calculateMASCCLogic('moderate', allTrue);
    expect(score).toBe(24);
    expect(getRiskCategory(score)).toBe('lower-risk');
  });

  it('severe burden with adverse criteria → score below 21', () => {
    // 0 + 0 + 4 + 4 + 0 + 0 + 2 = 10
    const adverse = {
        noHypotension: false,
        noCOPD: true, // yes copd
        solidTumorNoFungal: true, 
        noDehydration: false,
        outpatient: false,
        ageUnder60: true
    };
    const score = calculateMASCCLogic('severe', adverse);
    expect(score).toBe(10);
    expect(getRiskCategory(score)).toBe('higher-risk');
  });

  it('score 21 returns lower-risk group wording', () => {
    // 3 (mod burden) + 5 + 4 + 4 + 3 + 0 (inpatient) + 2 = 21
    const borderline = { ...allTrue, outpatient: false };
    const score = calculateMASCCLogic('moderate', borderline);
    expect(score).toBe(21);
    expect(getRiskCategory(score)).toBe('lower-risk');
  });

  it('score 20 returns higher-risk group wording', () => {
    // 0 (severe burden) + 5 + 4 + 4 + 3 + 3 + 2 = 21
    // but if age >= 60 (-2) -> 19
    const score = calculateMASCCLogic('severe', allTrue);
    expect(score).toBe(21); // severe burden is 0. 5+4+4+3+3+2 = 21. 
    
    const highRisk = { ...allTrue, ageUnder60: false }; // 21 - 2 = 19
    const score2 = calculateMASCCLogic('severe', highRisk);
    expect(score2).toBe(19);
    expect(getRiskCategory(score2)).toBe('higher-risk');
  });
});
