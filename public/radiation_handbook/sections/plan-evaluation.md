# Plan Evaluation

## Evaluation Process
Plan evaluation is a systematic review of treatment plans to ensure they meet clinical goals while maintaining safety. This process requires integration of dosimetric, clinical, and practical considerations.

> 🎯 **Clinical Pearl:** Don't rely solely on DVH metrics - careful review of isodose distributions in all planes is essential to identify potential hot spots or cold areas that might be missed in DVH analysis.

### Core Components
| Component | Evaluation Points |
|-----------|------------------|
| **Target Coverage** | PTV D95, conformity, homogeneity |
| **OAR Doses** | Maximum/mean doses, DVH metrics |
| **Technique** | Beam arrangement, modulation, efficiency |
| **Deliverability** | MU/fx, complexity, robustness |

---

## Evaluation Metrics

### 1. Target Coverage Indices
| Metric | Formula | Goal |
|--------|---------|------|
| **Conformity Index** | TV95/PTV | 0.95-1.05 |
| **Homogeneity Index** | D2%/D98% | < 1.15 |
| **Gradient Index** | V50%/V100% | Site-specific |
| **Coverage Index** | V95% | > 95% |

### 2. Plan Quality Metrics
| Parameter | Standard | SBRT |
|-----------|----------|------|
| **MU/Gy** | < 300 | < 1000 |
| **Segments** | < 100 | < 150 |
| **Delivery Time** | < 5 min | < 30 min |
| **QA Pass Rate** | > 95% | > 98% |

> ⚠️ **Caution:** Highly modulated plans may achieve better DVH metrics but can be less robust to setup errors and anatomical changes.

## Systematic Review Process

### 1. Initial Checks
▣ Prescription correctness  
▣ Structure naming  
▣ Image fusion review  
▣ Density overrides  
▣ Grid size  

### 2. DVH Analysis
| Structure | Primary Metrics | Secondary Checks |
|-----------|----------------|------------------|
| **PTV** | D95, D98, D2 | V107%, mean |
| **OARs** | Protocol constraints | Intermediate doses |
| **Ring structures** | Gradient fall-off | Maximum doses |
| **Normal tissue** | V5Gy, V10Gy | Integral dose |

### 3. Visual Assessment
1. **Axial Review**
   - Target coverage
   - Hot spots
   - OAR sparing
   - Dose fall-off

2. **Sagittal/Coronal**
   - Superior/inferior coverage
   - Junction doses
   - Beam entry/exit
   
3. **3D Review**
   - Overall distribution
   - Dose painting
   - Cold spots

## Technical Parameters

### 1. Delivery Parameters
| Parameter | Evaluation | Action Limit |
|-----------|------------|--------------|
| **MU/fx** | Compare to typical | > 2SD from mean |
| **Segment Size** | Minimum area | < 4 cm² |
| **Segment MU** | Minimum MU | < 2 MU |
| **Leaf Speed** | Maximum required | > 2.5 cm/sec |

### 2. Plan Robustness
| Test | Method | Criteria |
|------|--------|----------|
| **Setup Error** | ±3mm shifts | Coverage >90% |
| **Density** | ±3% variation | D95 >95% |
| **Breathing** | 4D accumulation | D98 >95% |
| **Deformation** | DIR validation | Gamma <1 |

## Documentation Requirements

### 1. Plan Summary
| Element | Details Required |
|---------|-----------------|
| **Technique** | IMRT/VMAT/3D |
| **Energy** | Photon/electron |
| **References** | Protocol/trial |
| **Variations** | Justification |

### 2. Review Checklist
▣ Target coverage metrics  
▣ OAR constraint review  
▣ Delivery parameters  
▣ QA requirements  
▣ Special instructions  

## Quality Management

### 1. Peer Review Process
| Level | Reviewer | Timing |
|-------|----------|--------|
| **Initial** | Dosimetrist | During planning |
| **Physics** | Physicist | Pre-treatment |
| **Clinical** | Physician | Weekly review |
| **Chart Check** | Physics | Weekly |

### 2. Plan Robustness
1. **Setup Variations**
   - Isocenter shifts
   - Rotations
   - Deformations
   
2. **Anatomical Changes**
   - Weight loss
   - Cavity changes
   - Organ filling

## AI-Generated Summary
- Comprehensive plan evaluation requires systematic review process
- Both quantitative metrics and qualitative assessment needed
- Technical parameters must ensure reliable delivery
- Robustness analysis critical for complex techniques
- Documentation and peer review essential for quality
- Regular monitoring during treatment course