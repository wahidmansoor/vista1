# Disease Progress Decision-Support Audit

## 1. Correct Product Intent
The **Disease Progress** module is intended to serve as a **Clinical Decision-Support (CDS) System**. Its primary goal is to assist oncologists in selecting optimal treatment regimens by matching a patient's specific disease state (Diagnosis, Stage, Biomarkers, Performance Status, and Treatment History) against a structured, evidence-based database of protocols. 

Unlike the Handbook (which is a reference library), this module is an **active diagnostic/therapeutic engine** that performs data-driven matching to rank options, provide clinical rationales, and enforce safety guardrails.

---

## 2. Current Implementation

### Active Component
- **File:** [src/modules/cdu/sections/DiseaseProgressTracker.tsx](src/modules/cdu/sections/DiseaseProgressTracker.tsx)
- **Status:** Functioning but limited.
- **UI Structure:** 5-Tab interface (Disease Status, Performance Status, Progression, Lines of Treatment, AI Assistant).

### Architecture & Data Flow
- **State Model:** Managed by `usePatientData.ts` hook using a `useReducer` pattern.
- **Storage Model:** Persisted to Browser `localStorage` (via a yet-to-be-imported `storageService.ts`). There is currently **no database backend**.
- **Fields Captured:**
  - **Disease:** Diagnosis, Stage, Histology/Mutation, Date.
  - **Performance:** ECOG/Karnofsky scores.
  - **Progression:** Imaging type, findings, tumor markers.
  - **History:** Line of therapy (1st, 2nd, etc.), Regimen name, Response (CR, PR, SD, PD).

### Matching Logic
- Currently uses a mix of internal component functions (`getSuggestedProtocols`) and a custom hook (`useProtocolSuggestions`).
- Performance is matched via a hardcoded `ENHANCED_PROTOCOLS` array in the hook file.
- **Weakness:** Logic is purely string/enum matching (e.g., `protocol.diagnosis === diagnosis`).

### Inactive/Enhanced Versions
- **EnhancedDiseaseProgressTracker.tsx** exists in the codebase but is NOT imported by `CDU.tsx`. It contains more advanced visualization (Bar Charts) but essentially uses the same underlying data model.

---

## 3. Current Data Sources

The current system is entirely **hardcoded** across multiple files:

1.  **Diagnosis/Mutation Lists:** [src/modules/cdu/sections/components/DiseaseStatusTab.tsx](src/modules/cdu/sections/components/DiseaseStatusTab.tsx) contains `PRIMARY_DIAGNOSES` and `HISTOLOGY_MUTATIONS`.
2.  **Protocol Data:** [src/modules/cdu/sections/hooks/useProtocolSuggestions.ts](src/modules/cdu/sections/hooks/useProtocolSuggestions.ts) contains `ENHANCED_PROTOCOLS` (as a constant array).
3.  **Legacy Data:** `src/modules/cdu/data/treatmentProtocolsData.ts` (referenced in main component).

**Finding:** There is no external configuration file (JSON/YML) or database table driving this logic. Any new cancer type or mutation requires a code deployment.

---

## 4. Gaps Against Intended Use

| Feature | Current State | Intended State | Gap |
| :--- | :--- | :--- | :--- |
| **Data Source** | Hardcoded arrays in TS files. | Database-driven (Supabase/Config). | High (Requires code changes to update). |
| **Biomarker Logic** | Single "Histology/Mutation" string. | Multi-select structured biomarkers. | High (Can't handle complex HER2+/ER+/PR- combos). |
| **Matching Engine** | Simple `if/else` on strings. | Weighted logic + eligibility rules. | High (Missing nuanced criteria). |
| **Safety Filters** | Basic contraindication strings. | Active blocking/warnings based on score. | Medium (Exists in code but not enforced in UI). |
| **Rationale** | "Matched" label only. | Detailed citation & "Why this option?". | High (Doctor has no evidence context). |
| **History Logic** | Captured but ignored in matching. | Progression on Line 1 triggers Line 2. | Total (System ignores prior therapy in suggestions). |

---

## 5. Required Database Schema (Intended)

To support clinical decision-making, the following tables/config structure is required:

### Table: `oncology_protocols`
- `id`: UUID
- `cancer_type`: String (FK)
- `stage_eligibility`: Array<String>
- `line_of_therapy`: Integer (1, 2, 3+)
- `biomarker_requirements`: JSONB (e.g., `{ "her2": "positive", "egfr": "wild-type" }`)
- `min_ecog_score`: Integer
- `regimen_name`: String
- `agents`: Array<String>
- `evidence_level`: Enum (Category 1, 2A, 2B)
- `rationale`: Text
- `references`: Array<URL>

### Table: `patient_biomarkers` (Patient State)
- `patient_id`: UUID
- `marker_type`: String
- `marker_status`: String
- `test_date`: Date

---

## 6. Required Matching Logic

The matching engine should follow this sequential execution:

1.  **Filter by Diagnosis & Stage:** Initial broad filtering.
2.  **Filter by Line of Therapy:** Look at `PatientHistory.length` to determine if suggesting 1st/2nd/3rd line.
3.  **Filter by Biomarkers:** Exclusive and Inclusive matching (e.g., Must be `KRAS Mutant`, Must NOT have `Severe Neuropathy`).
4.  **Safety Filter (Performance):** Remove regimens where `Patient.ECOG > Protocol.MaxECOG`.
5.  **Ranking:** Primary Recommendation (Category 1) → Alternative (Category 2A) → Clinical Trial (Category 2B).

---

## 7. Safety Guardrails

- **ECOG Warning:** If user selects a protocol requiring ECOG 0-1 but patient is ECOG 2, trigger a high-visibility alert.
- **Duplicate Therapy:** Warning if suggesting an agent the patient recently progressed on.
- **Organ Function:** Placeholders for Renal/Hepatic checks (linked to future Lab results module).
- **Contraindication Alert:** Display specific contraindications (e.g., "Contains Anthracycline: LVEF must be >50%").

---

## 8. Recommended Build Plan

### P0: Foundation (Database & Schema)
- Move hardcoded protocols from `useProtocolSuggestions.ts` into a structured JSON config file (interim) or Supabase table (final).
- Refactor `DiseaseStatus` to allow multiple biomarkers (not just one dropdown).
- Create `ProtocolMatcher` utility class with unit tests for matching logic.

### P1: UI & Logic Enhancement
- Update "AI Assistant" tab to "Treatment Selection Service".
- Replace simple list with "Ranked Options" UI card featuring Rationale and Evidence link.
- Implement conditional warnings in UI for ECOG score mismatches.

### P2: Advanced Features
- **Prior Response Logic:** Logic to exclude previously failed therapies.
- **Export:** "Treatment Plan" PDF generator for tumor board review.
- **Audit Log:** Track who modified the disease status and why.

---

## 9. Files To Change

1.  **[src/modules/cdu/sections/types/diseaseProgress.types.ts](src/modules/cdu/sections/types/diseaseProgress.types.ts):** Update types for multi-biomarkers and structured line-of-therapy.
2.  **[src/modules/cdu/sections/hooks/useProtocolSuggestions.ts](src/modules/cdu/sections/hooks/useProtocolSuggestions.ts):** Remove hardcoded array; replace with fetch/matcher logic.
3.  **[src/modules/cdu/sections/components/DiseaseStatusTab.tsx](src/modules/cdu/sections/components/DiseaseStatusTab.tsx):** Change Histology/Mutation from dropdown to multi-select checkbox/chip list.
4.  **[src/modules/cdu/sections/hooks/usePatientData.ts](src/modules/cdu/sections/hooks/usePatientData.ts):** Add logic to handle new biomarker fields.

---

## 10. Files Not To Touch

- **public/handbook/**: Do NOT link or modify handbook content.
- **src/modules/handbook/**: Do NOT modify rendering logic.
- **src/api/ai/**: Do NOT use AI for clinical treatment logic.
- **src/modules/cdu/safe/**: Do not modify legacy/backup versions of CDU components.
