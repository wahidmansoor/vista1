# CrCl P0 Safety Fix Report

## 1. Files Changed
- [src/modules/tools/calculators/CrCl.tsx](src/modules/tools/calculators/CrCl.tsx): Modified to include unit selection, better validation, and safety warnings.
- [src/modules/tools/calculators/__tests__/CrCl.test.ts](src/modules/tools/calculators/__tests__/CrCl.test.ts): Added new unit tests for calculation logic.

## 2. Unit Selector Added
- A new `select` dropdown allows users to choose between **mg/dL** (default) and **µmol/L**.
- The input label and placeholder dynamically update to reflect the selected unit.
- Accessible names (`title` attributes) were added to all dropdowns to ensure UI compliance.

## 3. Conversion Logic
- Implemented deterministic conversion for µmol/L: `creatinineMgDl = creatinineUmolL / 88.4`.
- The Cockcroft-Gault formula now uses the normalized `mg/dL` value regardless of user input unit.
- A technical note was added to the result card when conversion is active (e.g., "Converted 88.4 µmol/L to 1.00 mg/dL...").

## 4. Validation Added
- Added checks for:
  - **Empty fields**: Displays a generic "valid numeric values" error.
  - **Unrealistic Age**: Restricted to 1-120 years.
  - **Unrealistic Weight**: Restricted to 0-500 kg.
  - **Zero/Negative Creatinine**: Explicitly blocked with a specific error message.
- Results and errors are mutually exclusive; calculating with errors clears previous results.

## 5. Safety Warning Added
- **Global Calculator Warning**: "Confirm serum creatinine units before using this estimate. Calculated CrCl requires clinician verification." (Visible at the top in yellow).
- **Result Disclaimer**: "* Cockcroft-Gault estimate. Clinical judgement required." (Visible below the result in green).

## 6. Test Results
Ran `vitest` for the new test file:
- **Total Tests**: 4 passed
- **Scenarios Covered**:
  - Male calculation in mg/dL.
  - Female factor (0.85) application.
  - µmol/L conversion (88.4 -> 1.0).
  - µmol/L conversion (176.8 -> 2.0).

## 7. Build Result
- **TSC**: Encountered 658 existing errors across 77 files in the project. These are pre-existing issues and unrelated to the Tools module changes.
- **Vite Build**: Successful production build completed in 25.82s.

## 8. Remaining Issues
- The calculator still uses a single "Weight" input without differentiating between Ideal, Actual, or Adjusted Body Weight, which can be clinically relevant for obese patients.
- GFR capping (e.g., at 125 mL/min) is not yet implemented.
- These are prioritized as P1 improvements per the [Tools Module Audit](TOOLS_MODULE_AUDIT.md).
