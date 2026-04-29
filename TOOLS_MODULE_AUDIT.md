# Tools Module Full Audit

## 1. Module Location
The Tools module is primarily located in `src/modules/tools/`.
- Entry point: [src/modules/tools/Tools.tsx](src/modules/tools/Tools.tsx)
- Routes: Defined in [src/routes/AppRoutes.tsx](src/routes/AppRoutes.tsx) under the `/tools` path.

## 2. Files Involved
- [src/modules/tools/Tools.tsx](src/modules/tools/Tools.tsx): Hub for navigation within the Tools module.
- [src/modules/tools/Calculators.tsx](src/modules/tools/Calculators.tsx): Secondary hub for clinical calculators.
- [src/modules/tools/RedFlags.tsx](src/modules/tools/RedFlags.tsx): Interactive cards for red flag conditions.
- [src/modules/tools/calculators/BSA.tsx](src/modules/tools/calculators/BSA.tsx): Body Surface Area calculator.
- [src/modules/tools/calculators/CrCl.tsx](src/modules/tools/calculators/CrCl.tsx): Creatinine Clearance calculator.
- [src/modules/tools/calculators/ANC.tsx](src/modules/tools/calculators/ANC.tsx): Absolute Neutrophil Count calculator.
- [src/modules/tools/components/ToolCard.tsx](src/modules/tools/components/ToolCard.tsx): Shared UI component for the Tools hub.
- Placeholder directories (with empty `index.tsx` "Coming Soon"):
  - `src/modules/tools/quickguides/`
  - `src/modules/tools/cognitive/`
  - `src/modules/tools/labs/`
  - `src/modules/tools/emergencyregimens/`
  - `src/modules/tools/toxicities/`
  - `src/modules/tools/reminders/`

## 3. Current Architecture
- **Navigation Flow**:
  1. User identifies "Tools" in [Sidebar.tsx](src/layout/Sidebar.tsx).
  2. [AppRoutes.tsx](src/routes/AppRoutes.tsx) maps `/tools` to `src/modules/tools/Tools.tsx`.
  3. `Tools.tsx` displays categories as `ToolCard` items.
  4. Each item navigates to a sub-route (e.g., `/tools/calculators`).
- **State Management**: Local React state used exclusively for calculator inputs and results. No global state (Redux/Zustand) or persistence found for tool data.
- **Component Pattern**: Monolithic individual calculator files containing logic, validation, and UI.

## 4. Tool Inventory

| Tool | File | Inputs | Output | Clinical Risk | Status |
|------|------|--------|--------|---------------|--------|
| BSA Calculator | [BSA.tsx](src/modules/tools/calculators/BSA.tsx) | Height, Weight | BSA (m²) | Low (formula standard) | Implemented |
| CrCl Calculator | [CrCl.tsx](src/modules/tools/calculators/CrCl.tsx) | Age, Weight, sCr, Gender | CrCl (mL/min) | High (Units issue) | Implemented |
| ANC Calculator | [ANC.tsx](src/modules/tools/calculators/ANC.tsx) | WBC, Neutrophils, Bands | ANC + Severity | Moderate | Implemented |
| Red Flags & Emergencies | [RedFlags.tsx](src/modules/tools/RedFlags.tsx) | N/A (Informational) | Protocol Info | Moderate | Implemented |
| Symptom Control | `quickguides/index.tsx` | N/A | Coming Soon | N/A | Placeholder |
| Important Labs | `labs/index.tsx` | N/A | Coming Soon | N/A | Placeholder |
| Emergency Regimens | `emergencyregimens/index.tsx` | N/A | Coming Soon | N/A | Placeholder |
| Cognitive Tools | `cognitive/index.tsx` | N/A | Coming Soon | N/A | Placeholder |
| Toxicity Checklists | `toxicities/index.tsx` | N/A | Coming Soon | N/A | Placeholder |
| Scheduling | `reminders/index.tsx` | N/A | Coming Soon | N/A | Placeholder |

## 5. Clinical Calculation Safety Findings

### BSA Calculator ([BSA.tsx](src/modules/tools/calculators/BSA.tsx))
- **Formula**: `Math.sqrt((h * w) / 3600)` (Mosteller) - Correct.
- **Units**: cm and kg - Standard.
- **Bounds**: Checks `h <= 0` or `w <= 0`, but doesn't flag physically impossible values (e.g., height 300cm).
- **Issue**: No clinician review disclaimer.

### CrCl Calculator ([CrCl.tsx](src/modules/tools/calculators/CrCl.tsx))
- **Formula**: `((140 - a) * w) / (72 * s)` - Cockcroft-Gault.
- **CRITICAL**: The denominator `/ (72 * s)` assumes sCr in **mg/dL**. Many hospital systems use **µmol/L**. Mixing these up results in order-of-magnitude errors. There is no unit selector.
- **Missing**: No GFR/CrCl cap (often capped at 125 mL/min in some protocols, especially for Carboplatin).
- **Missing**: No guidance on which weight to use (Actual vs Ideal vs Adjusted). It simply labels "Weight (kg)".

### ANC Calculator ([ANC.tsx](src/modules/tools/calculators/ANC.tsx))
- **Formula**: `(w * (n + b)) / 100` where `w` is WBC (×10³/μL) and `n`, `b` are percentages. - Correct.
- **Missing**: Disclaimer that severity levels ('Normal', 'Mild', etc.) are estimates and institutional protocols vary.

### Red Flags ([RedFlags.tsx](src/modules/tools/RedFlags.tsx))
- **Content**: Generally correct protocols (e.g., < 1 hour to antibiotics for Neutropenic Fever).
- **Missing**: Explicit source citations for these protocols.

## 6. UI / UX Findings
- **Mobile Responsiveness**: Uses `grid-cols-1 md:grid-cols-2`, which works well for small screens.
- **Accessibility**: UI buttons lack ARIA labels where only icons are used in some places (though `ToolCard` does use text).
- **Reset Behavior**: `Reset` button correctly clears state in all calculators.
- **Clarity**: The "Coming Soon" placeholders are visible in the main hub but leads to empty pages, which may frustrate users.
- **Navigation inconsistency**: [Calculators.tsx](src/modules/tools/Calculators.tsx) has its own grid, and [tools/calculators/index.tsx](src/modules/tools/calculators/index.tsx) also exists with a different grid. [AppRoutes.tsx](src/routes/AppRoutes.tsx) uses the former.

## 7. Safety Language Findings
- **Issues**:
  - No disclaimers found in any calculator file.
  - "Normal ANC" message (checked in [ANC.tsx](src/modules/tools/calculators/ANC.tsx)) is overconfident. "No neutropenia" should be "Within reference range".
- **Missing Required Phrases**:
  - "For clinical decision support only"
  - "Verify all calculations manually"
  - "Units must be confirmed before calculation"

## 8. Integration Findings
- **Patient Data**: SAFE - Currently zero integration. Calculators require manual entry, which avoids risk of stale data but increases manual error risk.
- **Handbook**: MISSING but useful - Red Flags should link to specific handbook chapters for full protocols.
- **CDU/OPD**: UNNECESSARY - Keeping tools decoupled is safer unless a specific "copy to notes" feature is requested.
- **LocalStorage**: MISSING - No persistence of selected units or last values (might be useful for units specifically).

## 9. Test Coverage Findings
- **CRITICAL**: ZERO test files found specifically for the tools module.
- Identified test gaps:
  - BSA: Boundary testing (min/max height/weight).
  - CrCl: Gender switch validation, sCr unit sanity checks.
  - ANC: Segmented vs Bands addition validation.

## 10. Critical Issues
1. **[CrCl.tsx](src/modules/tools/calculators/CrCl.tsx)**: Serum Creatinine unit ambiguity (mg/dL vs µmol/L).
2. **Missing Disclaimers**: No global or per-tool safety disclaimers.
3. **Redundancy**: Two different "Calculators" hub files ([Calculators.tsx](src/modules/tools/Calculators.tsx) and [calculators/index.tsx](src/modules/tools/calculators/index.tsx)).
4. **Lack of Coverage**: No automated tests for clinical logic.

## 11. Recommended Fix Plan
### P0: Clinical Safety
- Add a mandatory unit toggle (mg/dL vs µmol/L) to `CrCl.tsx` with clear conversion logic.
- Add a global disclaimer footer to the `Tools` module.
- Add per-tool clinical caution alerts (e.g., "Confirm weight type for CrCl").

### P1: Reliability & Usability
- Implement unit tests for all calculator logic in `src/modules/tools/__tests__`.
- Resolve redundancy between `Calculators.tsx` and `calculators/index.tsx`.
- Add input validation to prevent physically impossible values.

### P2: Polish
- Link Red Flags to Handbook chapters.
- Replace "Coming Soon" placeholders with a more useful "Resources coming in next update" or hide cards until content exists.

## 12. Do-Not-Touch Areas
- The core Mosteller and Cockcroft-Gault formulas themselves are standard; only the unit handling around them needs adjustment.
- The `ToolCard` visual styling is consistent with the app theme and should be preserved.
