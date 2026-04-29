# Disease Progress CDS Phase 10B Clinical Validation Log

## 1. Purpose
The Clinical Validation Log is a key component of our safety and quality assurance framework. It allows clinicians to provide structured technical feedback on the deterministic CDS output for representative pilot cases. This data is critical for identifying clinical logic gaps, safety concerns, or surfacing edge cases in oncology protocol selection.

## 2. How to Use
1.  **Load Pilot Case**: Use the Pilot Case Harness at the top of the tracker to load a deterministic scenario (e.g., "NSCLC EGFR+").
2.  **Inspect Results**: Navigate to the **CDS Advisor** tab to review the matched, potential, and ineligible strategy options.
3.  **Validate Outcome**: Scroll past the results to find the **Clinical Validation Feedback** panel.
4.  **Submit Feedback**: Rate the correctness (Correct, Partially Correct, Incorrect), flag specific issues (e.g., "Missing option"), and provide clinical notes.
5.  **Audit Persistence**: Your validation is stored in the browser's `localStorage` and can be retrieved for MDT review and engineering updates.

## 3. Interpretation of Results
*   **Correct (Green)**: The CDS logic accurately reflecting current guidelines for the provided inputs.
*   **Partially Correct (Amber)**: The engine identified the correct strategy, but may have missing secondary biomarkers or slightly outdated guideline references.
*   **Incorrect (Red)**: A mismatch between clinical reality and CDS logic. Requires immediate engineering review of the underlying deterministic engine.

## 4. Safety and Privacy
*   **No Auto-fill**: Correctness is NEVER inferred; it must be a manual clinician action.
*   **Audit Only**: Feedback does not alter the underlying deterministic logic in real-time. Changes are made through controlled software updates.
*   **Data Isolation**: Logs are currently stored in `localStorage` under `vista_validation_log_v1` for audit trail preservation.
