# Prostate Cancer

## Risk Stratification & Treatment Selection
Treatment approach for prostate cancer is guided by risk group classification, which determines target volumes, dose, and fractionation.

> 🎯 **Clinical Pearl:** Consider both patient factors (age, comorbidities, sexual function) and tumor factors (PSA kinetics, Gleason score, stage) when selecting treatment approach and dose escalation.

### Risk Classification
| Risk Group | Criteria | Treatment Approach |
|------------|----------|-------------------|
| **Very Low** | T1c, GG1, PSA <10, <3 cores | Active surveillance |
| **Low** | T1-T2a, GG1, PSA <10 | RT alone or AS |
| **Intermediate** | T2b-c or GG2-3 or PSA 10-20 | RT ± ADT (4-6m) |
| **High** | T3-4 or GG4-5 or PSA >20 | RT + ADT (18-36m) |

### Treatment Options
| Setting | Approach | Duration |
|---------|----------|----------|
| **Definitive** | IMRT/VMAT | 20-44 fractions |
| **Post-op** | IMRT/VMAT | 33-35 fractions |
| **SBRT** | Selected cases | 5 fractions |
| **Boost** | Simultaneous/Sequential | Site-specific |

---

## Simulation Process

### 1. Patient Preparation
| Requirement | Details | Timing |
|------------|----------|---------|
| **Bladder** | Comfortably full | 1-2 cups, 1h prior |
| **Rectum** | Empty, flat | Enema morning of |
| **Diet** | Low gas | 2 days before |
| **Hydration** | Consistent intake | Throughout RT |

### 2. Setup Protocol
▣ Supine position  
▣ Knee/foot immobilization  
▣ Arms on chest  
▣ Indexed equipment  
▣ Stable bladder volume  

> ⚠️ **Caution:** Inconsistent bladder filling or rectal gas can significantly impact daily setup accuracy and dose delivery.

## Target Volume Definition

### 1. Definitive RT
| Volume | Definition | Margin |
|--------|------------|--------|
| **GTV** | Prostate ± SV | N/A |
| **CTV_P** | Prostate | 0mm |
| **CTV_SV** | Seminal vesicles | Risk-based |
| **PTV** | CTV | 5-7mm |

### 2. Post-operative
| Volume | Definition | Margin |
|--------|------------|--------|
| **CTV_bed** | Prostate bed | Per guidelines |
| **CTV_nodes** | If indicated | Per risk |
| **PTV** | CTV | 5-7mm |
| **PTV_nodes** | If treating | 7mm |

## Dose Fractionation

### 1. Standard Fractionation
| Approach | Total Dose | Schedule |
|----------|------------|----------|
| **Definitive** | 78Gy | 39 x 2Gy |
| **Post-op** | 66-70Gy | 33-35 x 2Gy |
| **Pelvic nodes** | 45-50.4Gy | 25-28 x 1.8Gy |
| **SV** | 56-60Gy | Risk-adapted |

### 2. Hypofractionation
| Approach | Dose | Evidence |
|----------|------|----------|
| **Moderate** | 60Gy/20fx | PROFIT/CHHiP |
| **SBRT** | 36.25Gy/5fx | PACE-B |
| **Post-op** | 52.5Gy/20fx | PROPER |

## Critical Structure Guidelines

### 1. Primary Constraints
| Structure | Standard RT | SBRT |
|-----------|------------|------|
| **Rectum V65** | <17% | V32 <15% |
| **Bladder V65** | <25% | V37 <25% |
| **Penile Bulb** | Mean <50Gy | Mean <29Gy |
| **Femoral Heads** | V50 <5% | V20 <5% |

### 2. Secondary Goals
| Structure | Goal | Priority |
|-----------|------|----------|
| **Rectum V70** | <10% | High |
| **Bladder V70** | <15% | High |
| **Bowel Bag** | V45 <195cc | If pelvic RT |
| **Urethra** | V42 <50% | SBRT only |

## Image Guidance Protocol

### 1. Daily IGRT
| Modality | Match Priority | Tolerance |
|----------|----------------|-----------|
| **CBCT** | Prostate first | 3mm/3° |
| **Fiducials** | If implanted | 2mm/2° |
| **MVCT** | Backup option | 3mm/3° |

### 2. Adaptive Considerations
1. **Plan Adaptation**
   - Weekly CBCTs
   - Bladder filling
   - Rectal volume
   - Weight changes

2. **Action Levels**
   - >3mm for 3 days
   - Systematic drift
   - Volume changes
   - Coverage risk

## Plan Quality Metrics

### 1. Target Coverage
| Parameter | Goal | Required |
|-----------|------|----------|
| **PTV D98** | >95% | >93% |
| **PTV D2** | <105% | <107% |
| **CTV D99** | >100% | >98% |
| **Conformity** | 0.95-1.05 | <1.10 |

### 2. Technical Parameters
| Metric | Standard | SBRT |
|--------|----------|------|
| **MU/Gy** | <300 | <1000 |
| **Segments** | <70 | <100 |
| **Gradient** | R50 <4 | R50 <3.5 |

## Side Effect Management

### 1. Acute Effects
| Effect | Management | Timing |
|--------|------------|--------|
| **Urinary** | Alpha blockers | Week 2-3 |
| **Bowel** | Diet modification | Throughout |
| **Fatigue** | Exercise program | Throughout |
| **Sexual** | Medications | As needed |

### 2. Late Effects
| Effect | Risk Factors | Monitoring |
|--------|--------------|------------|
| **ED** | Age, dose, diabetic | 6-12 months |
| **Rectal** | V70, anticoagulation | Annual |
| **Urinary** | Prior TURP, size | Annual |

## Patient Education

### 1. Treatment Preparation
▣ Bladder/bowel protocol  
▣ Dietary guidelines  
▣ Exercise program  
▣ Side effect monitoring  
▣ Support resources  

### 2. During Treatment
| Topic | Instructions | Timing |
|-------|--------------|--------|
| **Hydration** | 2L/day minimum | Throughout |
| **Diet** | Low fiber/gas | During RT |
| **Exercise** | Walking program | 3x/week |
| **Monitoring** | Symptom diary | Daily |

## Quality Management

### 1. Weekly Assessments
1. **Clinical Review**
   - Toxicity grading
   - Weight changes
   - Medication review
   - PSA monitoring

2. **Technical Review**
   - Setup accuracy
   - Image matching
   - Adaptive needs
   - Plan quality

### 2. Follow-up Schedule
| Timing | Focus | Tests |
|--------|--------|-------|
| **1 month** | Acute effects | PSA |
| **3 months** | Recovery | PSA |
| **6 months** | Late effects | PSA |
| **Annual** | Surveillance | PSA, exam |

## AI-Generated Summary
- Risk-adapted approach guides treatment selection
- Daily IGRT essential for accurate delivery
- Consistent bladder/bowel preparation critical
- Standard or moderate hypofractionation supported
- SBRT appropriate for selected patients
- Side effects manageable with proactive approach
- Long-term monitoring for late effects needed
- Quality metrics ensure consistent delivery