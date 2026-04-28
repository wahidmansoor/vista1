# Clinical Safety Principles

The CDS Advisor is designed as a **Decision Support** tool, not a prescriptive system. The following principles govern its implementation and usage:

## 1. No Automatic Recommendations
The system identifies "Eligible Options" based on data matching. It never uses language like "Best Treatment", "Recommended Treatment", or "Prescribe X". The clinician remains the sole decision-maker.

## 2. Eligibility ≠ Recommendation
Matching a protocol's eligibility criteria is a prerequisite for use, but does not account for specific patient comorbidities, patient preference, or financial constraints.

## 3. Mandatory Clinician Review
All results are surfaced with a prominent notice: "Final treatment decision requires oncologist review." No protocol should be initiated without MDT (Multidisciplinary Team) validation.

## 4. Total Transparency
- **Warnings Always Visible**: Clinical warnings (e.g., "Monitor LFTs") are integrated into the primary card view.
- **Contraindications Never Hidden**: Explicit contraindications (e.g., "Avoid Anti-EGFR in RAS-mutant") use high-visibility red styling and are never collapsed.
- **Rationale Disclosure**: Every match includes a "Clinical Rationale" field explaining the logic behind the suggestion.

## 5. Input Safety
- **Missing Data Blocks**: If primary diagnosis or stage is missing, the system displays a safety banner and may block eligibility matching to prevent unsafe "false negatives".
- **Local Dataset Disclaimer**: Users are explicitly warned that the advisor only searches the local dataset and not the entire global medical literature.
