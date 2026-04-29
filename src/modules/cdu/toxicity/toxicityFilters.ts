import { ToxicityData } from '@/services/toxicities';

export type FilterType = 'all' | 'high-grade' | 'hospital' | 'dlt';

/**
 * Pure helper function to process toxicities based on search and filters.
 * Extracted from UI logic to ensure clinical safety and testability.
 */
export function processToxicities(
  toxicities: ToxicityData[],
  searchQuery: string,
  filterType: FilterType
): ToxicityData[] {
  let filtered = [...toxicities];

  // 1. Apply Search
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(item => 
      item.name.toLowerCase().includes(query) ||
      (item.clinical_category || '').toLowerCase().includes(query) ||
      (item.culprit_drugs || []).some(drug => drug.toLowerCase().includes(query)) ||
      (item.culprit_classes || []).some(cls => cls.toLowerCase().includes(query))
    );
  }

  // 2. Apply Filters
  if (filterType === 'high-grade') {
    filtered = filtered.filter(item => item.severity.includes('4'));
  } else if (filterType === 'hospital') {
    filtered = filtered.filter(item => item.requires_hospitalization);
  } else if (filterType === 'dlt') {
    filtered = filtered.filter(item => item.is_dose_limiting);
  }

  // 3. Prioritize Severity: Hospitalization First > Grade 4 > DLT > Alphabetical
  return filtered.sort((a, b) => {
    // Hospitalization
    if (a.requires_hospitalization && !b.requires_hospitalization) return -1;
    if (!a.requires_hospitalization && b.requires_hospitalization) return 1;

    // Grade 4
    const aIsG4 = a.severity.includes('4');
    const bIsG4 = b.severity.includes('4');
    if (aIsG4 && !bIsG4) return -1;
    if (!aIsG4 && bIsG4) return 1;

    // DLT
    if (a.is_dose_limiting && !b.is_dose_limiting) return -1;
    if (!a.is_dose_limiting && b.is_dose_limiting) return 1;

    // Alphabetical
    return a.name.localeCompare(b.name);
  });
}
