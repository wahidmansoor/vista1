# Non-Small Cell Lung Cancer

## Treatment Paradigms
Treatment approach for NSCLC varies by stage and patient factors. Radiation therapy plays a crucial role in both definitive and palliative settings.

> 🎯 **Clinical Pearl:** For stage III NSCLC, concurrent chemoradiation improves survival compared to sequential treatment, but patient selection is critical due to increased toxicity.

### Treatment Intent
| Stage | Approach | RT Dose |
|-------|----------|----------|
| **Early (I/II)** | SBRT or Surgery | 48-54Gy/3-5fx |
| **Stage III** | Concurrent CRT | 60Gy/30fx |
| **Stage IV** | Palliative/SBRT | 20-30Gy/5-10fx |
| **Post-op** | Sequential | 50-54Gy/25-27fx |

---

## Simulation Requirements

### 1. Patient Setup
| Element | Specification |
|---------|--------------|
| **Position** | Supine, arms up |
| **Immobilization** | Wing board or vacuum bag |
| **4DCT** | Required for all curative cases |
| **Contrast** | IV contrast for N2/3 disease |

### 2. Imaging Protocol
▣ 4DCT acquisition  
▣ Average CT reconstruction  
▣ MIP/MinIP series  
▣ Diagnostic PET fusion  
▣ Diagnostic chest CT fusion  

> ⚠️ **Caution:** Free-breathing simulation may underestimate tumor motion. 4DCT is essential for accurate target delineation in curative cases.

## Target Volume Delineation

### 1. SBRT Approach
| Volume | Definition | Margin |
|--------|------------|--------|
| **GTV** | Visible tumor all phases | None |
| **ITV** | Union of GTVs | None |
| **PTV** | ITV | 5mm |

### 2. Conventional RT
| Volume | Early Stage | Locally Advanced |
|--------|-------------|------------------|
| **GTV** | Primary + Nodes | Primary + Nodes |
| **CTV** | 5-8mm | 8mm + Nodal Levels |
| **PTV** | 5mm | 5-7mm |

## Dose Specifications

### 1. SBRT Regimens
| Risk | Total Dose | Fractionation |
|------|------------|---------------|
| **Peripheral** | 54Gy | 3 x 18Gy |
| **Central** | 50Gy | 5 x 10Gy |
| **Ultra-central** | 60Gy | 8 x 7.5Gy |

### 2. Conventional RT
| Setting | Dose | Schedule |
|---------|------|----------|
| **Definitive** | 60Gy | 30 x 2Gy |
| **Sequential** | 50-54Gy | 25-27 x 2Gy |
| **Palliative** | 20-30Gy | 5-10 fractions |

## Critical Structure Guidelines

### 1. SBRT Constraints
| Structure | 3 Fraction | 5 Fraction |
|-----------|------------|------------|
| **Cord** | 18Gy max | 25Gy max |
| **Esophagus** | 27Gy max | 35Gy max |
| **Heart** | 24Gy max | 32Gy max |
| **Chest Wall** | 30Gy to 30cc | 40Gy to 30cc |

### 2. Conventional Constraints
| Structure | Constraint | Priority |
|-----------|------------|----------|
| **Lung V20** | < 35% | Required |
| **Mean Lung** | < 20Gy | Required |
| **Cord** | < 45Gy | Required |
| **Heart V30** | < 50% | Optimal |

## Treatment Delivery

### 1. Image Guidance
| Setting | Protocol | Frequency |
|---------|----------|-----------|
| **SBRT** | CBCT pre/post | Each fraction |
| **Standard** | CBCT | Daily |
| **Palliative** | kV imaging | Daily |

### 2. Motion Management
1. **Assessment**
   - 4DCT review
   - Motion amplitude
   - Breathing pattern
   
2. **Strategies**
   - ITV approach
   - Compression
   - Gating
   - Tracking

## Treatment Verification

### 1. Initial Setup
▣ Review 4D dataset  
▣ Check motion management  
▣ Verify immobilization  
▣ Document reference positions  

### 2. During Treatment
| Timeline | Action | Reviewer |
|----------|--------|----------|
| **Daily** | CBCT matching | RTT |
| **Weekly** | Image review | Physician |
| **Mid-treatment** | Response CT | As needed |

## Side Effect Management

### 1. Acute Effects
| Effect | Management | Monitoring |
|--------|------------|------------|
| **Esophagitis** | Diet modification | Weekly |
| **Pneumonitis** | Steroids if needed | Symptoms |
| **Fatigue** | Rest periods | Weekly |
| **Skin** | Moisturizer | Weekly |

### 2. Late Effects
| Effect | Risk Factors | Follow-up |
|--------|--------------|-----------|
| **Fibrosis** | V20, mean lung | 3-6 months |
| **Fractures** | Chest wall dose | Annual |
| **Cardiotoxicity** | Heart dose | Annual |

## Follow-up Schedule
1. **During RT**
   - Weekly visits
   - Symptom assessment
   - Weight monitoring
   
2. **Post-Treatment**
   - 1 month
   - 3 months
   - 6 months
   - Annual

## AI-Generated Summary
- Treatment approach varies by stage and location
- 4DCT essential for accurate target delineation
- Motion management critical for all thoracic cases
- SBRT offers excellent control for early-stage disease
- Daily IGRT required for precise delivery
- Regular monitoring for radiation pneumonitis
- Long-term follow-up needed for late effects