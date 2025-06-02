# Image Guidance

## IGRT Overview
Image-guided radiation therapy (IGRT) involves using imaging before and during treatment to ensure accurate delivery. The type and frequency of imaging depends on treatment site, technique, and margins.

> 🎯 **Clinical Pearl:** The choice of IGRT technique should balance setup accuracy requirements, imaging dose, and workflow efficiency. Daily CBCT may not always be necessary for large-margin palliative treatments.

### Available Technologies
| Technology | Applications | Limitations |
|------------|--------------|-------------|
| **kV Planar** | Daily setup | 2D only |
| **CBCT** | Soft tissue visualization | Image quality |
| **MV Portal** | Backup option | Poor contrast |
| **Surface Guidance** | Real-time monitoring | Surface only |
| **MR-guided** | Superior soft tissue | Cost/availability |

---

## Standard Protocols by Site

### 1. Head and Neck
| Parameter | Specification |
|-----------|---------------|
| **Frequency** | Daily CBCT |
| **Match Region** | C2-C3 vertebrae |
| **Tolerances** | 3mm translations, 2° rotations |
| **Action Level** | >3mm = reposition |

### 2. Thoracic
| Parameter | Standard RT | SBRT |
|-----------|------------|------|
| **Imaging** | Daily CBCT | CBCT pre/post |
| **Match** | Carina/spine | Tumor/spine |
| **Tolerance** | 5mm | 3mm |
| **4D Verification** | Weekly | Each fraction |

> ⚠️ **Caution:** For SBRT treatments, verify both pre- and post-CBCT to ensure intrafraction stability.

### 3. Breast
| Setting | Protocol |
|---------|----------|
| **Standard** | Daily kV orthogonal |
| **DIBH** | Surface guidance |
| **Boost** | Weekly CBCT |
| **Regional Nodes** | Daily CBCT |

### 4. Pelvis
| Treatment | Protocol | Preparation |
|-----------|----------|-------------|
| **Prostate** | Daily CBCT | Bladder/rectal protocol |
| **Gynecologic** | Daily CBCT | Bladder filling |
| **Rectal** | Daily CBCT | Bladder protocol |
| **Bone mets** | kV planar | None required |

## Implementation Guidelines

### 1. Setup Verification
▣ Initial setup with lasers  
▣ Couch shifts applied  
▣ Pre-treatment imaging  
▣ Position verification  
▣ Documentation  

### 2. Image Review
| Timeline | Reviewer | Action |
|----------|----------|--------|
| **Daily** | RTT | Apply corrections |
| **Weekly** | Physicist | Trend analysis |
| **Weekly** | Physician | Protocol compliance |

### 3. Documentation
1. **Daily Records**
   - Setup deviations
   - Shift values
   - Image approval
   - Action levels

2. **Weekly Reviews**
   - Systematic errors
   - Random errors
   - Adaptive needs
   - Protocol compliance

## Quality Assurance Program

### 1. Equipment QA
| Component | Frequency | Tests |
|-----------|-----------|-------|
| **kV/MV Imaging** | Monthly | Calibration |
| **CBCT** | Daily | Image quality |
| **Laser** | Daily | Alignment |
| **Couch** | Monthly | Movement accuracy |

### 2. Process QA
| Element | Verification |
|---------|-------------|
| **Protocols** | Annual review |
| **Staff Training** | Competency checks |
| **Documentation** | Audits |
| **Workflows** | Efficiency analysis |

## Special Considerations

### 1. Adaptive Planning
| Trigger | Action |
|---------|---------|
| **>5mm shifts** | Investigation |
| **Anatomy change** | Replan evaluation |
| **Weight loss** | Rescan consideration |
| **3 consecutive shifts** | Systematic error check |

### 2. Hybrid Techniques
| Combination | Use Case |
|-------------|----------|
| **CBCT + Surface** | DIBH breast |
| **kV + Surface** | SRS/SBRT |
| **CBCT + 4D** | Lung SBRT |
| **MR + Surface** | Real-time tracking |

## AI-Generated Summary
- IGRT protocol selection based on treatment site and technique
- Daily imaging standard for most curative treatments
- Site-specific matching and tolerance guidelines
- Regular QA essential for accuracy
- Documentation and review processes critical for quality
- Adaptive triggers should be clearly defined