# CDS Architecture: Disease Progress Module

## System Overview
The Clinical Decision Support (CDS) Advisor in the Disease Progress module is a **deterministic, rule-based engine** designed to assist oncologists in identifying feasible local protocol options based on patient-specific clinical data.

- **Deterministic**: Logic is hard-coded in the `ProtocolMatcher` engine. There is no stochastic AI inference or unpredictable output.
- **Local Dataset**: Matches are made against a local, curated dataset of 42 high-fidelity oncology protocols.
- **Matcher-Driven Eligibility**: Evaluation is binary (Eligible/Ineligible) or conditional (Potential), driven by strict clinical criteria.

## Data Flow
The system follows a unidirectional data flow to ensure consistency and auditability:
`UI (DiseaseProgressTracker)` → `useProtocolSuggestions` (hook) → `protocolMatcher` (engine) → `oncologyProtocols` (dataset) → `ProtocolMatch` (metadata) → `UI Rendering (ProtocolResultCard)`.

## Core Files
- `src/modules/cdu/sections/data/oncologyProtocols.ts`: The source of truth for all protocol definitions.
- `src/modules/cdu/sections/utils/protocolMatcher.ts`: The core logic engine that evaluates patient data against criteria.
- `src/modules/cdu/sections/hooks/useProtocolSuggestions.ts`: React hook managing the state and triggering the matcher.
- `src/modules/cdu/sections/DiseaseProgressTracker.tsx`: Main container component for the CDS module.
- `src/modules/cdu/sections/components/ProtocolResultCard.tsx`: Specialized UI for rendering clinical results with safety markers.

## Matching Dimensions
Protocols are evaluated across the following dimensions:
- **Diagnosis**: Primary cancer type and histology.
- **Stage**: Clinical and pathological staging (e.g., IV, Metastatic).
- **Line of Therapy**: 1st Line, 2nd Line, Maintenance.
- **Biomarkers**:
  - `ALL_OF`: Every biomarker in the list must match.
  - `ANY_OF`: At least one biomarker must match.
  - `excluded`: If these markers are present, the protocol is blocked (Status: Not eligible).
- **Performance Status**: ECOG score thresholds.
