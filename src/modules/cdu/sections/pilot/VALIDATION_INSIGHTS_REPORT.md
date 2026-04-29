# Disease Progress CDS Phase 10C Aggregated Validation Insights

## 1. Purpose
The Aggregated Validation Insights layer provides a deterministic summary of clinician feedback collected during pilot testing. It surfaces patterns in clinical correctness, identifies recurring logic gaps (e.g., missing options), and prioritizes safety-critical signals for engineering review.

## 2. Data Source
*   **Key**: `vista_validation_log_v1`
*   **Mechanism**: Read-only aggregation of the immutable JSON array of `ValidationEntry` objects.
*   **Persistence**: Handled by the browser's `localStorage`.

## 3. Aggregation Rules
The `validationInsightsService.ts` follows these deterministic rules:
*   **Correctness Split**: Counts entries exactly matching 'correct', 'partially_correct', and 'incorrect'.
*   **Issue Tallying**: Iterates through the `issues` object of every log to count flags like `unsafeWording` and `missingOptions`.
*   **Case Weighting**: Groups logs by `caseId` to determine the "Latest State" based on the most recent timestamp per case.
*   **Safety Signal Detection**: Any log where `unsafeWording === true` OR `correctness === 'incorrect'` triggers an immediate "Review Needed" signal.

## 4. Safety Coverage and Limitations
*   **No Automation**: The system DOES NOT automatically update the CDS engine based on feedback. All clinical logic changes require a controlled software release.
*   **Audit Context**: Insights are for local audit and development prioritization only.
*   **Non-Prescriptive**: The tool does not claim "Total System Correctness" percentage; it presents counts of clinician-reported states.
*   **Sample Size**: Insights are only as reliable as the diversity and volume of the pilot case validations.

## 5. How to Interpret Safely
*   **Review Needed**: Indicates a clinician has explicitly flagged a result as unsafe or fundamentally incorrect. Human review by the MDT is mandatory.
*   **Issue Patterns**: High counts for "Missing Options" suggest the local protocol database needs expansion for that malignancy subtype.
*   **Latest State**: Shows the most recent clinician assessment; useful for tracking if logic updates (manually applied) have resolved previous concerns.
