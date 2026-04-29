# Disease Progress CDS Phase 10A Pilot Cases Report

## 1. Pilot Case Inventory

A set of 9 representative oncology cases has been established to validate the deterministic CDS engine logic without prescribing treatment.

| ID | Malignancy | Clinical Profile | Key Biomarkers |
|---|---|---|---|
| pc-nsclc-egfr | NSCLC | Metastatic Adenocarcinoma | EGFR+ |
| pc-breast-her2 | Breast Cancer | Metastatic HER2+ | HER2+, ER+, PR+ |
| pc-crc-msih | Colorectal | Metastatic MSI-H/dMMR | MSI-High |
| pc-prostate-psma | Prostate | mCRPC | PSMA+, Castrate Resistant |
| pc-ovarian-brca | Ovarian | Platinum-sensitive Relapse | BRCA1/2 Mutant |
| pc-rcc-clearcell | RCC | Clear-cell Metastatic | IMDC Intermediate |
| pc-dlbcl-rr | DLBCL | Relapsed/Refractory | Prior Systemic Therapy |
| pc-gastric-her2 | Gastric | HER2+ Metastatic | HER2+, PD-L1 CPS High |
| pc-pancreatic-brca | Pancreas | Metastatic Adeno | BRCA1/2 Mutant |

## 2. Validation Rules

The `pilotValidationService.ts` implements the following rules:
- **Data Integrity**: Required fields (Diagnosis, Stage, ECOG) must be populated.
- **Match Presence**: CDS engine must return at least one protocol match for representative cases.
- **Safety Lexicon**: Automated check for "unsafe" prescriptive language.
- **Status Compliance**: Results must map to approved status categories.

## 3. Expected Output Safety

The following terms are **strictly prohibited** in deterministic output logic:
- "recommended treatment"
- "best treatment"
- "safe treatment"
- "guaranteed"
- "should use"

Output statuses are strictly limited to valid clinical support categories (e.g., "Eligible option", "Potential option").

## 4. Workflow Checklist

For each pilot case, the following workflow capabilities are verified:
- [x] Case loaded via Pilot Harness
- [x] CDS output generated automatically
- [x] Snapshot saving into `localStorage`
- [x] Version history retention
- [x] Snapshot comparison (Side-by-side)
- [x] Eligibility delta (New/Lost/Maintained)
- [x] Export to Markdown documentation

## 5. Known Limitations
- **Biomarker Mapping**: Some biomarkers may require exact string matches; manual review is required if results are unexpected.
- **Performance Scale**: Pilot cases currently focus on standard ECOG scores.
- **Treatment Intent**: Adjuvant and neo-adjuvant setting coverage is currently narrower than metastatic.

## 6. Next Recommended Pilot Step
Integrate with a mock FHIR server or bulk clinical data export to test the harness against 50+ de-identified longitudinal records.
