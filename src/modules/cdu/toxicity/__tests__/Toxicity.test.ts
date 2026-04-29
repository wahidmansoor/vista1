import { describe, it, expect } from 'vitest';
import { processToxicities } from '../toxicityFilters';
import { ToxicityData } from '../../../../services/toxicities';

const mockToxicities: Partial<ToxicityData>[] = [
  {
    id: '1',
    name: 'Peripheral Neuropathy',
    severity: 'Grade 1-3',
    clinical_category: 'Neurological',
    culprit_drugs: ['Paclitaxel'],
    is_dose_limiting: true,
    requires_hospitalization: false,
  },
  {
    id: '2',
    name: 'Febrile Neutropenia',
    severity: 'Grade 4',
    clinical_category: 'Hematological',
    culprit_drugs: ['Docetaxel'],
    is_dose_limiting: false,
    requires_hospitalization: true,
  },
  {
    id: '3',
    name: 'Mucositis',
    severity: 'Grade 1-4',
    clinical_category: 'Gastrointestinal',
    culprit_drugs: ['5-FU'],
    is_dose_limiting: false,
    requires_hospitalization: false,
  },
  {
    id: '4',
    name: 'Fatigue',
    severity: 'Grade 1-2',
    clinical_category: 'General',
    culprit_drugs: [],
    is_dose_limiting: false,
    requires_hospitalization: false,
  }
];

describe('processToxicities logic', () => {
  const data = mockToxicities as ToxicityData[];

  // 1. Search Tests
  it('should match toxicity by name', () => {
    const results = processToxicities(data, 'Neuropathy', 'all');
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('Peripheral Neuropathy');
  });

  it('should match toxicity by category', () => {
    const results = processToxicities(data, 'Hematological', 'all');
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('Febrile Neutropenia');
  });

  it('should match toxicity by culprit drug', () => {
    const results = processToxicities(data, '5-FU', 'all');
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('Mucositis');
  });

  // 2. Filter Tests
  it('should filter by Grade 4 only', () => {
    const results = processToxicities(data, '', 'high-grade');
    // Mucositis (Grade 1-4) and Febrile Neutropenia (Grade 4) should match
    expect(results.every(t => t.severity.includes('4'))).toBe(true);
    expect(results).toHaveLength(2);
  });

  it('should filter by hospitalization flag', () => {
    const results = processToxicities(data, '', 'hospital');
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('Febrile Neutropenia');
  });

  it('should filter by DLT flag', () => {
    const results = processToxicities(data, '', 'dlt');
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('1');
  });

  // 3. Sorting Tests
  it('should prioritize hospitalization over everything else', () => {
    const results = processToxicities(data, '', 'all');
    expect(results[0].name).toBe('Febrile Neutropenia'); // Has hospital=true
  });

  it('should prioritize Grade 4 over DLT when hospitalization is equal', () => {
    // Modify data to have a non-hospitalized G4 and a non-hospitalized DLT
    const customData: ToxicityData[] = [
      { ...data[3], name: 'B_DLT', is_dose_limiting: true, severity: 'Grade 1' },
      { ...data[3], name: 'A_G4', severity: 'Grade 4', is_dose_limiting: false }
    ] as any;
    
    const results = processToxicities(customData, '', 'all');
    expect(results[0].name).toBe('A_G4');
  });

  it('should fallback to alphabetical sorting', () => {
    const customData: ToxicityData[] = [
      { ...data[3], name: 'Zebra', severity: 'Grade 1' },
      { ...data[3], name: 'Apple', severity: 'Grade 1' }
    ] as any;
    
    const results = processToxicities(customData, '', 'all');
    expect(results[0].name).toBe('Apple');
    expect(results[1].name).toBe('Zebra');
  });

  // 4. Empty State Tests
  it('should return empty array if no matches found', () => {
    const results = processToxicities(data, 'NonExistentToxicity', 'all');
    expect(results).toHaveLength(0);
  });
});
