# Prostate SBRT Technique

## Patient Selection
Stereotactic Body Radiation Therapy (SBRT) for prostate cancer requires careful patient selection and robust technical implementation.

> 🎯 **Clinical Pearl:** Patient selection for SBRT should consider prostate size (<60cc), ability to maintain position, and absence of severe urinary symptoms at baseline.

### Selection Criteria
| Parameter | Optimal | Acceptable |
|-----------|---------|------------|
| **Risk Group** | Low/Int | Selected High |
| **Prostate Vol** | <50cc | <60cc |
| **IPSS Score** | 0-7 | 8-15 |
| **Prior TURP** | No | >6 months prior |
| **ADT** | No | Short-term ok |

---

## Implementation Requirements

### 1. Technical Requirements
| Component | Specification | Validation |
|-----------|--------------|------------|
| **IGRT** | CBCT/Fiducials | Daily pre/post |
| **Motion** | Real-time/tracking | Sub-mm |
| **Delivery** | VMAT/IMRT | QA >98% |
| **Immobilization** | 6-DOF couch | Daily setup |

### 2. Workflow Integration
▣ Dedicated timeslots  
▣ Extended appointment times  
▣ Physics presence  
▣ Physician availability  
▣ Emergency protocols  

> ⚠️ **Caution:** SBRT delivery requires significantly more resources per fraction than conventional RT. Ensure adequate staffing and time allocation.

## Simulation Protocol

### 1. Patient Preparation
| Requirement | Protocol | Verification |
|------------|----------|--------------|
| **Bladder** | 2 cups, 1h prior | CBCT volume |
| **Rectum** | Double enema | Flat on scout |
| **Fiducials** | 2 week healing | Position check |
| **Diet** | Clear liquids | 24h before |

### 2. Imaging Requirements
1. **Primary Scan**
   - Thin slice (1-1.5mm)
   - Full bladder
   - Empty rectum
   - Quiet breathing
   
2. **Additional Studies**
   - MRI fusion
   - Fiducial CBCT
   - Dry run setup
   - Reference images

## Treatment Planning

### 1. Target Volumes
| Structure | Definition | Margin |
|-----------|------------|---------|
| **CTV** | Prostate only | 0mm |
| **PTV** | CTV | 3-5mm |
| **Urethra** | Foley required | PRV 2mm |
| **PRV** | OARs | 2-3mm |

### 2. SBRT-Specific Goals
| Parameter | Primary | Secondary |
|-----------|----------|------------|
| **PTV D95** | >95% Rx | >98% ideal |
| **CTV D99** | >100% Rx | >102% ideal |
| **Gradient** | R50 <3.5 | R25 <8 |
| **Max Dose** | <105% | <103% ideal |

## Critical Structure Constraints

### 1. Primary OARs
| Structure | Per Fraction | Total Course |
|-----------|--------------|--------------|
| **Rectum** | V7.25Gy <15% | V32.5Gy <15% |
| **Bladder** | V7.25Gy <25% | V32.5Gy <25% |
| **Urethra** | V8Gy <50% | V36Gy <50% |
| **Bowel** | V5.5Gy <5cc | V25Gy <20cc |

### 2. Secondary Constraints
| Structure | Per Fraction | Priority |
|-----------|--------------|----------|
| **PenileBulb** | Mean <6Gy | Optional |
| **Femurs** | V4Gy <5% | Optional |
| **Bladder Wall** | V7.25Gy <15% | If visible |
| **Rectal Wall** | V7.25Gy <10% | If visible |

## Treatment Delivery

### 1. Pre-treatment
| Step | Action | Verification |
|------|--------|-------------|
| **Setup** | Position check | 6-DOF couch |
| **Imaging** | CBCT #1 | Soft tissue match |
| **Verification** | Second check | Physician approval |
| **Monitoring** | System check | Tracking active |

### 2. During Treatment
1. **Real-time Monitoring**
   - Position tracking
   - Intrafraction motion
   - Beam interrupts
   - Patient comfort

2. **Documentation**
   - Setup images
   - Shift values
   - Treatment time
   - Motion log

### 3. Post-treatment
▣ CBCT verification  
▣ Position analysis  
▣ Motion review  
▣ Documentation  
▣ Next day prep  

## Quality Assurance

### 1. Patient-Specific QA
| Test | Tolerance | Timing |
|------|-----------|--------|
| **Plan QA** | γ 2%/2mm >98% | Pre-treatment |
| **End-to-End** | 1mm | First fraction |
| **Chart Check** | Complete | Each fraction |
| **Physics Check** | Present | Each fraction |

### 2. Process QA
1. **Daily Verification**
   - Machine QA
   - IGRT systems
   - Tracking system
   - Couch accuracy
   
2. **Documentation**
   - Setup photos
   - CBCT approval
   - Motion traces
   - Delivery record

## Side Effect Management

### 1. Acute Management
| Effect | Intervention | Timing |
|--------|--------------|--------|
| **Urinary** | α-blockers early | Day 1 |
| **Bowel** | Anti-diarrheal | PRN |
| **Pain** | NSAIDs | PRN |
| **Fatigue** | Light exercise | Throughout |

### 2. Monitoring Schedule
| Timepoint | Assessment | Action |
|-----------|------------|--------|
| **Daily** | Symptoms | Document |
| **Weekly** | IPSS score | Adjust meds |
| **1 month** | Full review | PSA check |
| **3 months** | Late effects | PSA trend |

## Patient Instructions

### 1. Pre-treatment
▣ Medication review  
▣ Bladder/bowel prep  
▣ Diet instructions  
▣ Schedule details  
▣ Emergency contacts  

### 2. Treatment Days
| Time | Action | Notes |
|------|--------|-------|
| **2h prior** | Light meal | Clear liquids |
| **1h prior** | Bladder prep | 2 cups water |
| **30min prior** | Arrival | Check in |
| **Post-tx** | Void | Resume normal |

## AI-Generated Summary
- Patient selection critical for SBRT success
- Rigorous technical requirements
- Daily image guidance essential
- Strict OAR constraints per fraction
- Real-time monitoring required
- Comprehensive QA program
- Proactive side effect management
- Patient preparation crucial