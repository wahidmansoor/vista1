# General Oncology

## Cancer Biology

- Introduction
- Hallmarks of Cancer
- Oncogenes and Tumor Suppressors
- Genomic Instability & DNA Repair
- Epigenetics in Cancer

## Performance Status

- ECOG Performance Status
- Karnofsky Performance Status

> **Clinical Pearl**  
> Performance status scoring helps determine chemotherapy eligibility and expected prognosis.

---

## Prognostic Scores

| Score | Disease | Meaning |
|:------|:--------|:--------|
| IPI | Lymphoma | International Prognostic Index |
| R-ISS | Multiple Myeloma | Revised International Staging System |
| IPSS | MDS | International Prognostic Scoring System |

Some common terminology:
- CR: Complete Response
- PR: Partial Response
- RECIST: Response Evaluation Criteria in Solid Tumors

```typescript
// Example staging code
interface TNMStaging {
  T: string; // Tumor size
  N: string; // Node involvement
  M: string; // Metastasis
}
```

[Learn More About NCCN Guidelines](https://www.nccn.org)