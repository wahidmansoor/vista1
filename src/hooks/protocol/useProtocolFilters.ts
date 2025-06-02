import { useMemo } from 'react';
import type { Protocol } from '../../types/protocol';

interface FilterCriteria {
  search: string;
  tumorGroups: string[];
  intents: string[];
  drugs: string[];
  hasWarnings: boolean | null;
}

const useProtocolFilters = (protocols: Protocol[], filters: FilterCriteria) => {
  return useMemo(() => {
    let filtered = [...protocols];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(protocol => 
        protocol.code.toLowerCase().includes(searchLower) ||
        protocol.tumour_group.toLowerCase().includes(searchLower) ||
        protocol.treatment_intent?.toLowerCase().includes(searchLower) ||
        protocol.summary?.toLowerCase().includes(searchLower) ||
        protocol.treatment?.drugs.some(drug => 
          drug.name.toLowerCase().includes(searchLower)
        )
      );
    }

    // Apply tumor group filter
    if (filters.tumorGroups.length > 0) {
      filtered = filtered.filter(protocol =>
        filters.tumorGroups.includes(protocol.tumour_group)
      );
    }

    // Apply treatment intent filter
    if (filters.intents.length > 0) {
      filtered = filtered.filter(protocol =>
        protocol.treatment_intent && 
        filters.intents.includes(protocol.treatment_intent)
      );
    }

    // Apply drugs filter
    if (filters.drugs.length > 0) {
      filtered = filtered.filter(protocol =>
        protocol.treatment?.drugs.some(drug =>
          filters.drugs.includes(drug.name)
        )
      );
    }

    // Apply warnings filter
    if (filters.hasWarnings !== null) {
      filtered = filtered.filter(protocol => {
        const hasWarnings = !!(
          protocol.precautions?.length ||
          protocol.interactions?.contraindications?.length ||
          protocol.toxicity_monitoring?.expected_toxicities?.length ||
          protocol.ai_notes?.warnings?.length
        );
        return filters.hasWarnings ? hasWarnings : !hasWarnings;
      });
    }

    // Calculate statistics
    const stats = {
      total: filtered.length,
      withWarnings: filtered.filter(p => 
        p.precautions?.length ||
        p.interactions?.contraindications?.length ||
        p.toxicity_monitoring?.expected_toxicities?.length ||
        p.ai_notes?.warnings?.length
      ).length,
      byIntent: {} as Record<string, number>,
      byTumorGroup: {} as Record<string, number>
    };

    filtered.forEach(p => {
      stats.byTumorGroup[p.tumour_group] = (stats.byTumorGroup[p.tumour_group] || 0) + 1;
      if (p.treatment_intent) {
        stats.byIntent[p.treatment_intent] = (stats.byIntent[p.treatment_intent] || 0) + 1;
      }
    });

    // Group protocols by tumor group
    const groupedProtocols = filtered.reduce((acc, protocol) => {
      const group = protocol.tumour_group;
      if (!acc[group]) acc[group] = [];
      acc[group].push(protocol);
      return acc;
    }, {} as Record<string, Protocol[]>);

    // Sort groups and protocols within groups
    Object.values(groupedProtocols).forEach(protocols => {
      protocols.sort((a, b) => a.code.localeCompare(b.code));
    });

    return {
      filtered,
      grouped: groupedProtocols,
      stats
    };
  }, [protocols, filters]);
};

export default useProtocolFilters;