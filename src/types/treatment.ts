// src/types/treatment.ts
import type { ProtocolDrug } from '@/types/protocol';

// Shared Treatment interface for all treatment-related tabs/components
export interface Treatment {
  drugs: ProtocolDrug[];
  intent?: string;
  route?: string;
  schedule?: string;
  cycle_length?: number | string;
  total_cycles?: number | string;
  notes?: string[];
  premedication?: Array<string | { name: string; dose?: string }>;
}
