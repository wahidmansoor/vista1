# System Limitations: Disease Progress CDS

The current implementation of the CDS Advisor has the following known limitations which must be considered during clinical use:

## 1. External APIs
- **No Live Guideline API**: The system does not pull live data from NCCN, ASCO, or ESMO portals. It relies on the local `oncologyProtocols.ts` file.
- **No External Integration**: There is currently no direct integration with live Radiology (PACS) or Pathology (LIMS) systems.

## 2. Clinical Logic
- **No Longitudinal History**: The system evaluates the *current* state. It does not automatically compute temporal logic such as "Platinum-free interval" (e.g., >6 months since last Carboplatin).
- **No Toxicity Modeling**: Cumulative dose toxicities (e.g., lifetime Anthracycline dose) are not tracked or calculated.
- **No Comorbidities**: The engine does not evaluate non-oncological conditions (e.g., Renal failure, Cardiac history) unless manually noted in performance status.

## 3. Data Scope
- **Limited Dataset**: Only 42 specific protocols are currently defined. Rare cancers or niche trial protocols may not be represented.
- **Static Dataset**: Updates to protocols require a code deployment; there is no dynamic administrative UI for protocol management in this phase.
