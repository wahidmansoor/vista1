# Tools P1-B Carboplatin Safety Report

## 1. Carboplatin Tool Found?
**No**. Extensive searching across `src/modules/tools/`, `src/routes/`, and the wider codebase for terms like "Carboplatin", "Calvert", "AUC", and "GFR cap" confirmed that this calculator is not yet implemented in the Tools Hub.

## 2. Files Reviewed
- `src/modules/tools/Tools.tsx`
- `src/modules/tools/Calculators.tsx`
- `src/modules/tools/calculators/index.tsx`
- `src/routes/AppRoutes.tsx`
- `src/modules/tools/calculators/` (directory listing)

## 3. Issues Found
- **Gap in High-Risk Tools**: The absence of a Calvert calculator is a missed opportunity to centralize a high-risk oncology dosing calculation.
- **Dosing Risk**: Patients are currently reliant on manual calculations or external tools for Carboplatin dosing, which may not consistently apply GFR capping at 125 mL/min.

## 4. Fixes Applied
- No code fixes applied as the tool does not exist.
- Created [CARBOPLATIN_CALVERT_AUDIT.md](CARBOPLATIN_CALVERT_AUDIT.md) with a requirements specification for a safe future implementation.

## 5. Tests Added
- None.

## 6. Build Result
- N/A (No modifications made to existing code).

## 7. Remaining Issues
- Need to implement the Carboplatin calculator as a new tool following the P1-B safety specification.

## 8. Next Recommended Tools Safety Step
Implement the **Carboplatin / Calvert Calculator** with the following P0 requirements:
- Mandatory GFR cap at 125 mL/min.
- AUC range validation (e.g., alert if AUC > 7).
- Persistent safety warning about institutional protocols.
- Integration test suite for capping logic.
