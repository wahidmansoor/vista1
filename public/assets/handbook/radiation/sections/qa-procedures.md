# QA Procedures

## Quality Assurance Framework
A comprehensive QA program ensures safe and accurate delivery of radiation therapy through systematic verification of all critical components. This program encompasses machine QA, patient-specific QA, and process QA.

> 🎯 **Clinical Pearl:** While individual QA tests are important, the overall QA program should focus on catching errors through multiple independent checks rather than relying on any single test.

### Core Components
| Component | Purpose | Frequency |
|-----------|----------|-----------|
| **Machine QA** | Equipment performance | Daily/Monthly/Annual |
| **Patient QA** | Treatment verification | Per patient |
| **Process QA** | Workflow validation | Ongoing |
| **Chart Checks** | Documentation review | Weekly |

---

## Machine Quality Assurance

### 1. Daily QA
| Test | Tolerance | Method |
|------|-----------|--------|
| **Output** | ±3% | Morning checkout |
| **Lasers** | ±2mm | Visual alignment |
| **Door Interlocks** | Functional | Operation check |
| **Emergency Stops** | Functional | Button test |
| **CBCT/kV** | Image quality | Standard phantom |

### 2. Monthly QA
| Parameter | Tolerance | Tests |
|-----------|-----------|-------|
| **Output** | ±2% | All energies |
| **Symmetry** | ±2% | All angles |
| **MLC Position** | ±1mm | Picket fence |
| **Imaging** | Baseline | Calibration |

> ⚠️ **Caution:** Trends in machine performance are often more important than absolute values. Establish a robust trending program and investigate subtle changes.

## Patient-Specific QA

### 1. IMRT/VMAT QA
| Element | Criteria | Action |
|---------|----------|--------|
| **Gamma 3%/3mm** | >95% | Required |
| **Gamma 2%/2mm** | >90% | Optimal |
| **Point Dose** | ±3% | Required |
| **MU Accuracy** | ±2% | Required |

### 2. Chart Checks
▣ Prescription accuracy  
▣ Plan parameters  
▣ Setup instructions  
▣ Image guidance protocol  
▣ Treatment accessories  

### 3. Setup Verification
1. **Initial Setup**
   - Photo documentation
   - Setup notes
   - Reference images
   - Immobilization

2. **Treatment Verification**
   - Daily imaging
   - Setup reproducibility
   - Position tolerance
   - Anatomical changes

## Process QA

### 1. Workflow Validation
| Process | Verification | Frequency |
|---------|-------------|-----------|
| **Simulation** | Checklist | Each patient |
| **Planning** | Peer review | Each plan |
| **Delivery** | Time out | Each start |
| **Documentation** | Chart check | Weekly |

### 2. Error Prevention
| Stage | Strategy | Implementation |
|-------|----------|----------------|
| **Pre-planning** | Directive review | Standardized forms |
| **Planning** | Auto-checking | Plan scripts |
| **Pre-treatment** | Timeout | Checklist |
| **Treatment** | Daily verification | Setup imaging |

## Documentation Standards

### 1. Required Records
| Document | Content | Storage |
|----------|----------|---------|
| **Machine QA** | All tests | QA database |
| **Patient QA** | Plan verification | EMR |
| **Chart Checks** | Weekly review | EMR |
| **Incidents** | Investigation | Safety system |

### 2. Review Process
1. **Regular Reviews**
   - Monthly QA trends
   - Patient QA results
   - Process deviations
   - Incident reports

2. **Annual Audit**
   - Program evaluation
   - Policy updates
   - Training needs
   - Equipment performance

## Incident Management

### 1. Classification
| Level | Description | Response |
|-------|-------------|----------|
| **Minor** | Near miss | Document/Review |
| **Moderate** | No harm | Investigate/Correct |
| **Major** | Potential harm | Full analysis |
| **Critical** | Actual harm | Immediate action |

### 2. Response Protocol
▣ Immediate mitigation  
▣ Investigation process  
▣ Root cause analysis  
▣ Corrective actions  
▣ Follow-up monitoring  

## Quality Metrics

### 1. Technical Metrics
| Metric | Target | Review |
|--------|--------|--------|
| **QA Pass Rate** | >98% | Monthly |
| **Setup Accuracy** | <3mm | Weekly |
| **Documentation** | 100% | Weekly |
| **Machine QA** | All tests | Daily |

### 2. Process Metrics
| Metric | Goal | Monitoring |
|--------|------|------------|
| **Time to Start** | <5 days | Monthly |
| **Chart Errors** | Zero | Weekly |
| **Plan Quality** | All constraints | Each plan |
| **Patient Delays** | <5% | Monthly |

## AI-Generated Summary
- Comprehensive QA program covers machine, patient, and process
- Daily and monthly QA ensures consistent machine performance
- Patient-specific QA critical for complex treatments
- Process QA prevents systematic errors
- Documentation and review essential for program success
- Incident management system supports continuous improvement