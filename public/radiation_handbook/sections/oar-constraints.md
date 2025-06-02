# OAR Constraints

## Understanding Dose Constraints
Organ at risk (OAR) constraints represent dose-volume limits that help minimize the risk of radiation-induced toxicity. These constraints are based on extensive clinical data and radiobiology principles.

> 🎯 **Clinical Pearl:** When multiple OARs compete with target coverage, prioritize based on organ functional subunits (serial vs parallel) and clinical context.

### Key Metrics
| Metric | Definition | Usage |
|--------|------------|--------|
| **Dmax** | Maximum point dose | Serial organs |
| **Dmean** | Mean organ dose | Parallel organs |
| **Vx** | Volume receiving ≥x Gy | Dose-volume analysis |
| **Dx** | Minimum dose to x% volume | Critical structures |

---

## Standard Constraints by Site

### 1. CNS Treatment
| Structure | Constraint | Protocol |
|-----------|------------|----------|
| **Brainstem** | Dmax < 54Gy | Conventional RT |
| **Optic Pathway** | Dmax < 50Gy | Standard fractionation |
| **Cochlea** | Dmean < 35Gy | Hearing preservation |
| **Lens** | Dmax < 7Gy | Cataract prevention |

### 2. Head & Neck
| Structure | Primary Constraint | Secondary Goal |
|-----------|-------------------|----------------|
| **Spinal Cord** | Dmax < 45Gy | D1cc < 40Gy |
| **Brainstem** | Dmax < 54Gy | D1cc < 50Gy |
| **Parotids** | Dmean < 26Gy | V30 < 50% |
| **Larynx** | Dmean < 45Gy | V50 < 27% |

> ⚠️ **Caution:** For re-irradiation cases, cumulative doses must be carefully considered and constraints may need significant reduction.

### 3. Thoracic RT
| Structure | Constraint | Notes |
|-----------|------------|-------|
| **Heart** | V25 < 10% | Mean < 20Gy |
| **Lungs** | V20 < 30% | Mean < 20Gy |
| **Esophagus** | V50 < 40% | Mean < 34Gy |
| **Cord** | Dmax < 45Gy | 0.03cc < 40Gy |

### 4. Abdominal/Pelvic
| Structure | Primary | SBRT |
|-----------|---------|------|
| **Kidneys** | V20 < 32% | V17.5 < 10% |
| **Liver** | V30 < 30% | 700cc < 15Gy |
| **Bowel** | V45 < 195cc | V25 < 20cc |
| **Rectum** | V75 < 15% | V38 < 1cc |

## SBRT-Specific Constraints

### Single Fraction
| OAR | Point Max | Critical Volume |
|-----|-----------|----------------|
| **Cord** | 14Gy | 0.035cc < 10Gy |
| **Cauda** | 16Gy | 0.035cc < 12Gy |
| **Bowel** | 15.4Gy | 0.035cc < 11.2Gy |
| **Liver** | - | 700cc < 9.1Gy |

### Three Fractions
| OAR | Point Max | Critical Volume |
|-----|-----------|----------------|
| **Cord** | 21.9Gy | 0.035cc < 18Gy |
| **Cauda** | 24Gy | 0.035cc < 21.9Gy |
| **Bowel** | 25.2Gy | 0.035cc < 21Gy |
| **Liver** | - | 700cc < 15Gy |

## Re-irradiation Considerations
1. **Cumulative Limits**
   - Consider time interval
   - Calculate BED
   - Reduce constraints
   
2. **Risk Factors**
   - Prior toxicity
   - Concurrent therapy
   - Patient comorbidities

## Documentation Requirements
| Element | Details |
|---------|----------|
| **Priority List** | OAR ranking |
| **Variations** | Minor/major |
| **Justification** | Clinical rationale |
| **Review Status** | Approval date |

## Quality Assurance
1. **Plan Review**
   - DVH analysis
   - Isodose review
   - Protocol compliance
   
2. **Special Cases**
   - Re-irradiation
   - Trial protocols
   - Unique anatomy

## AI-Generated Summary
- OAR constraints based on organ architecture and clinical evidence
- Site-specific guidelines available for standard fractionation
- SBRT requires distinct constraints based on fractionation
- Re-irradiation needs careful consideration of cumulative dose
- Documentation and QA essential for protocol compliance