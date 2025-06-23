# Protocol Fetching Documentation

## Overview
The RegimensLibrary component fetches treatment protocols from Supabase using a centralized protocol service. The data flow follows a clean architecture pattern with type safety and error handling.

## Data Flow
1. RegimensLibrary component triggers data fetch
2. Protocol service handles API calls 
3. Supabase client executes query
4. Response is parsed and validated
5. Data is transformed into Protocol objects
6. UI displays protocol groups

## Supabase Query Details

### Base Query
```sql
SELECT 
  id,
  code,
  tumour_group,
  treatment_intent,
  eligibility,
  treatment,
  tests,
  dose_modifications,
  precautions,
  reference_list
FROM protocols
```

### With Filters
```sql
SELECT 
  id,
  code,
  tumour_group,
  treatment_intent,  
  eligibility,
  treatment,
  tests,
  dose_modifications,
  precautions,
  reference_list
FROM protocols
WHERE 
  ($1::text IS NULL OR tumour_group = $1)
  AND ($2::text IS NULL OR treatment_intent = $2)
  AND ($3::text IS NULL OR treatment->>'drugs' LIKE '%' || $3 || '%')
```

## Protocol Service Implementation

The protocol service (`src/services/protocols.ts`) handles data fetching:

```typescript
export interface ProtocolFilters {
  tumorGroup: string | null;
  drugName: string | null;
  treatmentIntent: string | null;
}

export const getProtocols = async (filters?: ProtocolFilters): Promise<Protocol[]> => {
  try {
    let query = supabase
      .from('protocols')
      .select(`
        id,
        code,
        tumour_group,
        treatment_intent,
        eligibility,
        treatment,
        tests,
        dose_modifications,
        precautions,
        reference_list
      `);

    if (filters) {
      if (filters.tumorGroup) {
        query = query.eq('tumour_group', filters.tumorGroup);
      }
      if (filters.treatmentIntent) {
        query = query.eq('treatment_intent', filters.treatmentIntent);
      }
      if (filters.drugName) {
        query = query.contains('treatment->>drugs', filters.drugName);
      }
    }

    const { data, error } = await query;

    if (error) throw error;
    if (!data?.length) return [];

    return data
      .map((item): Protocol => ({
        id: item.id,
        code: item.code,
        tumour_group: item.tumour_group,
        treatment_intent: item.treatment_intent,
        eligibility: safeJSONParse(item.eligibility, []),
        treatment: safeJSONParse(item.treatment, { drugs: [] }),
        tests: safeJSONParse(item.tests, { baseline: [], monitoring: [] }),
        dose_modifications: safeJSONParse(item.dose_modifications, {
          hematological: [],
          nonHematological: [],
          renal: [],
          hepatic: []
        }),
        precautions: safeJSONParse(item.precautions, []),
        reference_list: safeJSONParse(item.reference_list, [])
      }))
      .filter(isValidProtocol);
  } catch (error) {
    console.error('Protocol service error:', error);
    throw error;
  }
};
```

## Database Schema

The protocols table schema in Supabase:

```sql
CREATE TABLE protocols (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  code text NOT NULL,
  tumour_group text NOT NULL,
  treatment_intent text,
  eligibility jsonb DEFAULT '[]'::jsonb,
  treatment jsonb NOT NULL,
  tests jsonb DEFAULT '{"baseline": [], "monitoring": []}'::jsonb,
  dose_modifications jsonb DEFAULT '{
    "hematological": [],
    "nonHematological": [],
    "renal": [],
    "hepatic": []
  }'::jsonb,
  precautions jsonb DEFAULT '[]'::jsonb,
  reference_list jsonb DEFAULT '[]'::jsonb,
  CONSTRAINT valid_treatment CHECK (jsonb_typeof(treatment->'drugs') = 'array')
);

-- Indexes for better query performance
CREATE INDEX idx_protocols_tumour_group ON protocols(tumour_group);
CREATE INDEX idx_protocols_treatment_intent ON protocols(treatment_intent);
CREATE INDEX idx_protocols_code ON protocols(code);
```

## Error Handling

The service implements comprehensive error handling:

1. Database query errors
2. JSON parsing errors for JSONB fields
3. Data validation errors
4. Network connectivity issues

Errors are logged and propagated to the UI layer where they are displayed using toast notifications.

## Type Safety

The implementation uses TypeScript interfaces to ensure type safety:

```typescript
interface Protocol {
  id: string;
  code: string;
  title?: string;
  tumour_group: string;
  treatment_intent?: string;
  eligibility: string[];
  tests?: {
    baseline: string[];
    monitoring: string[];
  };
  treatment: {
    drugs: Drug[];
    protocol?: string;
  };
  dose_modifications?: {
    hematological?: string[];
    nonHematological?: string[];
    renal?: string[];
    hepatic?: string[];
  };
  precautions?: string[];
  reference_list?: string[];
}
```

## Caching and Performance

- Query results are cached by Supabase
- Indexes on commonly filtered columns
- JSON fields are efficiently handled using JSONB
- Client-side data is memoized using `useMemo`

## Usage in RegimensLibrary

The RegimensLibrary component uses the protocol service:

```typescript
const fetchProtocols = async (filters: FilterState) => {
  setQueryState(prev => ({ ...prev, isLoading: true, error: null }));

  try {
    const protocolFilters: ProtocolFilters = {
      tumorGroup: selectedGroups.length > 0 ? selectedGroups[0] : null,
      drugName: searchQuery || null,
      treatmentIntent: selectedIntent || null
    };

    const data = await getProtocols(protocolFilters);
    const grouped = groupProtocols(data);
    
    setRegimenGroups(grouped);
    setQueryState({
      isLoading: false,
      error: null,
      lastUpdated: Date.now()
    });
  } catch (err) {
    console.error('Error fetching protocols:', err);
    const error = err instanceof Error ? err : new Error('An unexpected error occurred');
    setQueryState({
      isLoading: false,
      error,
      lastUpdated: null
    });
  }
};
```