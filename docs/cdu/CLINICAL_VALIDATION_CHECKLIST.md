# Clinical Validation Checklist

The following scenarios must be verified before the CDS Advisor is considered clinically operational:

- [ ] **HER2+ Breast Cancer**: Verify that 1L Metastatic patients match **THP** (Trastuzumab/Pertuzumab) and identified as "Eligible".
- [ ] **EGFR-mutant NSCLC**: Verify that **Osimertinib** is marked as Eligible, and generic Checkpoint Inhibitors (Pembrolizumab) are explicitly marked as **Ineligible** or **Not Recommended**.
- [ ] **Squamous NSCLC**: Verify that Pemetrexed-containing regimens (e.g., Pem/Pembro) are excluded/blocked for Squamous histology.
- [ ] **RAS-mutant Colorectal**: Verify that Anti-EGFR agents (Cetuximab, Panitumumab) are caught by the `excluded` biomarker logic and marked as a **Contraindication**.
- [ ] **PSMA-positive mCRPC**: Verify that **Lutetium-177 PSMA-617** only matches when both Metastatic CRPC status and PSMA biomarker are present.
- [ ] **BRCA-mutant Ovarian**: Verify that PARP Inhibitor maintenance logic triggers correctly after primary therapy.
- [ ] **No Match Fallback**: Verify that when a patient doesn't match any protocol, the system displays a safe "No clear protocol match found" message instead of a generic error.
