import { useMemo } from 'react';
import type { Protocol } from './types/protocol';

interface ProtocolVersion {
  version: string;
  lastUpdated: string;
  updatedBy: string;
  changes: string[];
}

interface VersionedProtocol extends Protocol {
  versions: ProtocolVersion[];
  latestUpdate: string;
  hasSignificantChanges: boolean;
}

const useProtocolVersions = (protocol: Protocol | null): VersionedProtocol | null => {
  return useMemo(() => {
    if (!protocol) return null;

    const versions: ProtocolVersion[] = [];
    const currentVersion = protocol.version || '1.0.0';
    
    // Track all version updates from the protocol history
    if (protocol.version && protocol.updated_at && protocol.updated_by) {
      versions.push({
        version: currentVersion,
        lastUpdated: protocol.updated_at,
        updatedBy: protocol.updated_by,
        changes: [],
      });
    }

    // Determine if there are significant changes
    const hasSignificantChanges = !!(
      protocol.precautions?.length ||
      protocol.toxicity_monitoring?.expected_toxicities?.length ||
      protocol.ai_notes?.warnings?.length
    );

    const latestUpdate = protocol.updated_at || protocol.created_at || '';

    return {
      ...protocol,
      versions,
      latestUpdate,
      hasSignificantChanges,
    };
  }, [protocol]);
};

export const getVersionChangeSeverity = (changes: string[]): 'high' | 'medium' | 'low' => {
  // Analyze changes to determine severity
  const hasHighSeverity = changes.some(change => 
    change.toLowerCase().includes('warning') ||
    change.toLowerCase().includes('critical') ||
    change.toLowerCase().includes('risk') ||
    change.toLowerCase().includes('danger')
  );

  const hasMediumSeverity = changes.some(change =>
    change.toLowerCase().includes('update') ||
    change.toLowerCase().includes('modify') ||
    change.toLowerCase().includes('change')
  );

  return hasHighSeverity ? 'high' : 
         hasMediumSeverity ? 'medium' : 
         'low';
};

export default useProtocolVersions;