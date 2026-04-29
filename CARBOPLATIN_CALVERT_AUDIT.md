# Carboplatin Calvert Audit

## Tool Status
**NOT FOUND**. A Carboplatin/Calvert calculator was not found in the `src/modules/tools/` directory, subfolders, or routes.

## Files Reviewed
- `src/modules/tools/Tools.tsx`
- `src/modules/tools/Calculators.tsx`
- `src/modules/tools/calculators/` (directory listing)
- `src/routes/AppRoutes.tsx`
- `src/modules/tools/data/` (checked for existence/content)

## High-Priority Risk
Carboplatin dosing using the Calvert formula is high-risk because it depends on the accuracy of GFR/CrCl estimation. Overestimation of renal function leads to over-dosing and life-threatening toxicity.

## Proposed Safe Implementation Plan
A separate calculator should be added to the Tools module with strict safety constraints.

### 1. Formula
`Dose (mg) = Target AUC × (GFR + 25)`

### 2. GFR Cap Requirement
A mandatory cap at **125 mL/min** must be applied to the GFR value before dosing calculation to prevent over-dosing in patients with exceptionally high CrCl (e.g., young patients with low muscle mass).

### 3. Safety Controls
- Mandatory verification of GFR source (e.g., Cockcroft-Gault vs EDTA).
- Visible warning: “GFR capped at 125 mL/min for carboplatin dose estimation.”
- Warning: “Carboplatin dosing must follow institutional protocol and clinician verification.”
- Mandatory presence of `CalculatorDisclaimer` component.
- Strict input validation for AUC (typically 2–7, must be positive) and GFR (must be positive).
- Rounding to nearest mg or 10mg depending on protocol.

### 4. Required Test Cases
- **Case 1 (Standard)**: GFR 100, AUC 5 → 5 * (100 + 25) = 625 mg.
- **Case 2 (Capped)**: GFR 150, AUC 5 → 5 * (125 + 25) = 750 mg.
- **Case 3 (Boundary)**: GFR 125, AUC 6 → 6 * (125 + 25) = 900 mg.
- **Case 4 (Invalid)**: GFR -10 or AUC 0 → Error.
