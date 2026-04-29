# Tools Module Index

This document serves as the central index and status report for the **Tools Module** (Clinical Calculators & Decision Support).

## 🧮 Calculator List & Routes

| Calculator Name | Route | Category | Description |
|:---|:---|:---|:---|
| **BSA** | `/tools/calculators/bsa` | General | Body Surface Area (Mosteller Formula) |
| **BMI** | `/tools/calculators/bmi` | General | Body Mass Index Calculation |
| **CrCl** | `/tools/calculators/crcl` | Renal | Creatinine Clearance (Cockcroft-Gault) |
| **Carboplatin** | `/tools/calculators/carboplatin` | Renal | Calvert Formula (AUC-based dosing) |
| **ANC** | `/tools/calculators/anc` | Labs | Absolute Neutrophil Count Estimation |
| **Corrected Calcium** | `/tools/calculators/corrected-calcium` | Labs | Albumin-adjusted Calcium estimation |
| **MASCC Index** | `/tools/calculators/mascc` | Labs | Febrile Neutropenia risk scoring |
| **Steroid Equivalence** | `/tools/calculators/steroid-equivalence` | Meds | Glucocorticoid dose cross-referencing |
| **Opioid OME Estimator** | `/tools/calculators/opioid-converter` | Meds | Oral Morphine Equivalent estimation |

## 🛡️ Safety & Clinical Decision Support (CDS) Status

All tools in this module adhere to the following safety principles:
- **Non-Prescriptive:** Tools provide estimations and documentation support only. They do not recommend specific doses or therapy regimens.
- **Shared Disclaimer:** Every calculator includes the `CalculatorDisclaimer` component, reminding users to verify with institutional protocols.
- **Unit Validation:** Standardized units (Metric/US) are provided with clear labels.
- **Range Safety:** Extreme values trigger warnings or are ignored based on clinical safety models.

### High-Risk Tools
- **Carboplatin:** Uses GFR capping (max 125 mL/min) to prevent over-dosing.
- **Opioid OME Estimator:** Explicitly states it is for **documentation only** and warns about incomplete cross-tolerance.

## 🧪 Implementation & Test Status

| Component | Logic File | Test File | Test Status |
|:---|:---|:---|:---|
| Calculator Hub | `Calculators.tsx` | N/A | Manual Verified |
| BSA | `BSA.tsx` | `BSA.test.ts` | ✅ Passed |
| BMI | `BMI.tsx` | `BMI.test.ts` | ✅ Passed |
| CrCl | `CrCl.tsx` | `CrCl.test.ts` | ✅ Passed |
| Carboplatin | `Carboplatin.tsx` | `Carboplatin.test.ts` | ✅ Passed |
| ANC | `ANC.tsx` | `ANC.test.ts` | ✅ Passed |
| Corrected Calcium | `CorrectedCalcium.tsx` | `CorrectedCalcium.test.ts` | ✅ Passed |
| MASCC Index | `MASCC.tsx` | `MASCC.test.ts` | ✅ Passed |
| Steroid Equivalence| `SteroidEquivalence.tsx` | `SteroidEquivalence.test.ts`| ✅ Passed |
| Opioid Estimator | `OpioidConverter.tsx` | `OpioidConverter.test.ts` | ✅ Passed |

## 🛠️ Tech Stack
- **Framework:** React / TypeScript
- **Styling:** Tailwind CSS (Responsive Design, Dark Mode support)
- **Icons:** Lucide-React
- **Testing:** Vitest

---
*Last Updated: 2026-04-29*
