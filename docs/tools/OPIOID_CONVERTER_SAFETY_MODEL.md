# Opioid Converter Safety Model (Phase P1-J)

## 1. Safety Intent
The Phase P1-J implementation is intentionally restricted to **Oral Morphine Equivalent (OME)** estimation only. It does not provide target dosing for any opioid swap. This approach prevents "one-click" prescribing which can lead to fatal dosing errors if incomplete cross-tolerance or specific pharmacokinetic factors are ignored.

## 2. Methodology
- **Objective**: Provide a standardized baseline for documentation of current opioid burden.
- **Conversion Factors**: Restricted to conservative, widely accepted approximate conversion factors for oral/IV standard opioids.
- **Dose Capping**: Implements "specialist review" flags for doses exceeding standard safety thresholds for automated tools.

## 3. Explicitly Excluded Features
The following are **STRICTLY EXCLUDED** from this documentation utility:
- **Target Dosing**: No calculation of the new opioid's dose.
- **Cross-Tolerance Adjustment**: No automated reduction for cross-tolerance.
- **Methadone**: No methadone conversion (requires non-linear specialty models).
- **Fentanyl Patches**: No patch conversion (complex absorption kinetics).
- **Breakthrough Doses**: No automated PRN dose suggestions.
- **PCA**: No specialized infusion or PCA settings.

## 4. Safety Wording Standards
- Use "Approximate OME estimate" instead of "Equivalent dose."
- Use "High-risk utility" in developer/documentation context.
- Mandatory display of specialist review requirements for high-risk populations (renal/hepatic impairment).

## 5. Future Requirements
Before any "Target Dose" conversion is implemented, the tool must include:
- Mandatory input for clinical environment (inpatient vs outpatient).
- Mandatory clinical verification of renal function.
- Mandatory user acknowledgment of incomplete cross-tolerance principles.
- Expert-authored data tables for target switching.
