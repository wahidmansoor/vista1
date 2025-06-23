# Cancer Screening Module: Blueprint & Audit

## 1. Overview
The Cancer Screening module is a clinical decision-support UI for oncology professionals (no EHR features), providing evidence-based, guideline-compliant screening workflows for major cancers. It integrates risk assessment, patient education, clinical documentation, and EMR/export capabilities.

---

## 2. Clinical Scope
- **Cancers Covered:** Breast, Colorectal, Lung, Prostate, Cervical, Skin, Ovarian, Endometrial, Pancreatic, Gastric, Liver, Bladder, Thyroid, Lymphoma, Leukemia
- **Guidelines:** USPSTF, ACS, NCCN, international standards
- **Patient Populations:** Average risk, high risk (genetic/family history), special populations

---

## 3. Architecture & Data Flow
- **Type System:**
  - Strict TypeScript interfaces (see `src/types/clinical.ts`)
  - Zod validation for all patient and screening data
- **Data Sources:**
  - Genetic risk mapping (`genetic_risk_profiles.ts`)
  - Screening protocol matrix (`screening_protocols.ts`)
  - Symptom-cancer correlation engine (`symptom_correlations.ts`)
- **Logic Engine:**
  - Multi-factorial risk calculator (`riskAssessment.ts`)
  - Evidence-based recommendation engine (`screeningEngine.ts`)
  - Clinical reasoning generator (`clinicalReasoning.ts`)
- **UI/UX:**
  - Professional dashboard (`ClinicalDashboard.tsx`)
  - Risk visualization (`RiskVisualization.tsx`)
  - Recommendation panel (`RecommendationPanel.tsx`)

---

## 4. Clinical Workflow
1. **Patient Intake:**
   - Demographics, risk factors, symptoms, and history collected
   - Family history pedigree and genetic risk assessment
2. **Risk Stratification:**
   - Automated calculation using validated models (Gail, Tyrer-Cuzick, etc.)
   - Polygenic and monogenic risk integration
3. **Screening Recommendation:**
   - Protocol selection based on risk, age, and guidelines
   - Interval and modality optimization
   - Urgency and follow-up triggers
4. **Documentation & Export:**
   - Structured clinical notes, patient handouts, EMR-ready data
   - PDF, FHIR, CSV, JSON, and referral letter generation
5. **Quality Assurance:**
   - Real-time guideline compliance and audit trail logging
   - Clinical accuracy and safety checks

---

## 5. Key Features & Components
- **Dynamic Risk Visualization:**
  - Gauge meters, bar charts, and trend analysis (Recharts)
- **Priority-Coded Recommendations:**
  - URGENT (red), DUE (yellow), FUTURE (green), NOT INDICATED (gray)
- **Patient Education:**
  - Test prep, expectations, shared decision-making
- **Clinical Action Items:**
  - Referrals, order sets, reminders, follow-up tracking
- **Privacy & Security:**
  - Data anonymization, consent management, audit trails
- **Export & Integration:**
  - Multi-format export, EMR/FHIR compatibility, print-friendly layouts

---

## 6. Audit & Validation
- **Guideline Compliance:**
  - All recommendations mapped to USPSTF/ACS/NCCN with version tracking
- **Logic Consistency:**
  - Automated tests for risk and recommendation logic
- **Evidence Quality:**
  - Source grading, confidence intervals, bias checks
- **Clinical Audit Trail:**
  - Decision pathway logging, change tracking, error reporting
- **Regulatory Compliance:**
  - HIPAA, medical device, and international standards

---

## 7. Testing & Quality Assurance
- **Clinical Scenario Testing:**
  - Known case validation, edge case handling, multi-cancer syndromes
- **UI/UX Testing:**
  - Workflow simulation, accessibility, cross-browser/mobile
- **Integration Testing:**
  - EMR, export, AI consultation, performance
- **Automated Pipelines:**
  - CI/CD, regression, and compliance checks

---

## 8. Deployment & Maintenance
- **Performance:**
  - Code splitting, CDN, caching, mobile optimization
- **Security:**
  - HTTPS, CSP, input validation, rate limiting
- **Monitoring:**
  - Error tracking, analytics, clinical outcome monitoring
- **Backup & Recovery:**
  - Data backup, disaster recovery, version control

---

## 9. Future Roadmap
- **Continuous Guideline Updates:** Automated monitoring and versioning
- **Advanced Analytics:** Population health, outcome tracking
- **Education Integration:** CME, case-based learning, progress tracking
- **Internationalization:** Multi-language and region-specific protocols

---

## 11. Database Schema

The cancer screening system uses the following database schema structure for storing patient data and screening information:

```sql
-- Core patient demographics table
CREATE TABLE patient_demographics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  age INTEGER NOT NULL CHECK (age >= 0 AND age <= 120),
  biological_sex VARCHAR(20) NOT NULL CHECK (biological_sex IN ('male', 'female', 'intersex', 'unknown')),
  ethnicity VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Family history tracking
CREATE TABLE family_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patient_demographics(id),
  cancer_type VARCHAR(50) NOT NULL,
  relationship VARCHAR(50) NOT NULL,
  age_at_diagnosis INTEGER CHECK (age_at_diagnosis >= 0 AND age_at_diagnosis <= 120),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Genetic profiles and mutations
CREATE TABLE genetic_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patient_demographics(id),
  mutation VARCHAR(50) NOT NULL CHECK (mutation IN ('BRCA1', 'BRCA2', 'LYNCH', 'TP53', 'PALB2', 'APC', 'OTHER')),
  confirmed BOOLEAN NOT NULL DEFAULT false,
  details TEXT,
  penetrance_score DECIMAL(3,2) CHECK (penetrance_score >= 0 AND penetrance_score <= 1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Risk factor profiles
CREATE TABLE risk_factors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patient_demographics(id),
  current_smoker BOOLEAN DEFAULT false,
  pack_years INTEGER CHECK (pack_years >= 0),
  alcohol_drinks_per_week INTEGER CHECK (alcohol_drinks_per_week >= 0),
  bmi DECIMAL(4,1) CHECK (bmi >= 10 AND bmi <= 100),
  exercise_minutes_per_week INTEGER CHECK (exercise_minutes_per_week >= 0),
  immunosuppressed BOOLEAN DEFAULT false,
  radiation_exposure BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Current symptoms tracking
CREATE TABLE patient_symptoms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patient_demographics(id),
  symptom VARCHAR(100) NOT NULL,
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('mild', 'moderate', 'severe', 'very_severe')),
  duration_days INTEGER NOT NULL CHECK (duration_days >= 0),
  worsening BOOLEAN DEFAULT false,
  assessment_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Screening history
CREATE TABLE screening_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patient_demographics(id),
  test_type VARCHAR(50) NOT NULL,
  test_date DATE NOT NULL,
  result VARCHAR(20) NOT NULL CHECK (result IN ('normal', 'abnormal', 'negative', 'positive', 'pending', 'other')),
  result_details TEXT,
  follow_up_needed BOOLEAN DEFAULT false,
  follow_up_completed BOOLEAN DEFAULT false,
  location VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Clinical recommendations
CREATE TABLE clinical_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patient_demographics(id),
  cancer_type VARCHAR(50) NOT NULL,
  urgency VARCHAR(20) NOT NULL CHECK (urgency IN ('emergent', 'urgent', 'soon', 'routine', 'future', 'not_indicated')),
  test_recommended VARCHAR(50) NOT NULL,
  guideline_source VARCHAR(100) NOT NULL,
  recommendation_grade VARCHAR(10),
  clinical_reasoning TEXT NOT NULL,
  evidence_quality VARCHAR(20),
  patient_instructions TEXT,
  generated_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  review_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for better query performance
CREATE INDEX idx_patient_demographics_age ON patient_demographics(age);
CREATE INDEX idx_patient_demographics_sex ON patient_demographics(biological_sex);
CREATE INDEX idx_family_history_patient ON family_history(patient_id);
CREATE INDEX idx_family_history_cancer_type ON family_history(cancer_type);
CREATE INDEX idx_genetic_profiles_patient ON genetic_profiles(patient_id);
CREATE INDEX idx_genetic_profiles_mutation ON genetic_profiles(mutation);
CREATE INDEX idx_risk_factors_patient ON risk_factors(patient_id);
CREATE INDEX idx_symptoms_patient ON patient_symptoms(patient_id);
CREATE INDEX idx_symptoms_date ON patient_symptoms(assessment_date);
CREATE INDEX idx_screening_patient ON screening_history(patient_id);
CREATE INDEX idx_screening_test_type ON screening_history(test_type);
CREATE INDEX idx_screening_date ON screening_history(test_date);
CREATE INDEX idx_recommendations_patient ON clinical_recommendations(patient_id);
CREATE INDEX idx_recommendations_cancer_type ON clinical_recommendations(cancer_type);
CREATE INDEX idx_recommendations_urgency ON clinical_recommendations(urgency);
```

---

## 12. Component Structure

**Code Expectation Line**: The following components implement strict TypeScript interfaces with Zod validation, ensuring type safety and clinical data integrity across all cancer screening workflows.

### Core Components Architecture

```typescript
// Main Cancer Screening Component
src/modules/opd/cancer-screening/CancerScreening.tsx
├── PatientDemographicsPanel     // Age, gender, ethnicity input
├── RiskFactorsPanel            // Genetic, lifestyle, medical history
├── FamilyHistoryPanel          // Cancer family history tracking  
├── SymptomAssessmentPanel      // Current symptoms evaluation
├── ScreeningHistoryPanel       // Previous screening dates
└── RecommendationDisplay       // Cancer-specific recommendations

// Clinical Dashboard (Professional Interface)
src/components/ClinicalDashboard.tsx
├── DemographicsPanel           // Controlled patient data input
├── GeneticsPanel              // Mutation and variant tracking
├── RiskStratificationPanel    // Multi-factorial risk calculation
├── ScreeningTimelinePanel     // Historical and planned screenings
└── ClinicalNotesPanel         // EMR-ready documentation

// Risk Visualization Components  
src/components/clinical/
├── RiskVisualization.tsx      // Risk meters and charts (Recharts)
├── RecommendationPanel.tsx    // Priority-coded recommendations
├── PatientEducationPanel.tsx  // Test preparation and instructions
└── ExportControls.tsx         // PDF, FHIR, CSV export options
```

### Type System Structure

```typescript
// Core Clinical Types
src/types/clinical.ts
├── PatientDemographics        // Age, sex, ethnicity, family_history
├── GeneticProfile            // Mutations, variants, penetrance_scores
├── RiskFactorProfile         // Lifestyle, environmental, medical_history
├── SymptomProfile            // Current symptoms, severity, duration
├── ScreeningHistory          // Test history, results, follow-up
├── ClinicalRecommendation    // Cancer type, urgency, test, rationale
└── Zod Schemas              // Runtime validation for all interfaces
```

### Data Layer Structure

```typescript
// Clinical Knowledge Base
src/data/clinical/
├── genetic_risk_profiles.ts   // BRCA1/2, Lynch, TP53, PALB2 mappings
├── screening_protocols.ts     // USPSTF, ACS, NCCN protocols by cancer
├── symptom_correlations.ts    // Symptom-to-cancer correlation engine
└── guideline_references.ts    // Evidence sources and citations

// Logic Engine
src/logic/
├── riskAssessment.ts         // Multi-factorial risk calculation
├── screeningEngine.ts        // Evidence-based recommendations
├── clinicalReasoning.ts      // Structured clinical notes
└── qualityAssurance.ts       // Guideline compliance verification
```

### Export and Integration Structure

```typescript
// Clinical Reporting
src/export/
├── clinicalReports.ts        // Executive summaries and assessments
├── documentGeneration.ts     // PDF, FHIR, CDA, CSV, JSON exports
├── patientHandouts.ts        // Educational materials generation
└── emrIntegration.ts         // EMR-ready structured data

// Quality and Compliance
src/quality/
├── clinicalValidation.ts     // Guideline compliance verification
├── auditTrail.ts            // Decision pathway logging
├── evidenceGrading.ts       // Source quality assessment
└── errorReporting.ts        // Clinical accuracy monitoring
```

---

## 13. Export Component Implementation

When implementing the Cancer Screening component, ensure proper module export for optimal GitHub Copilot recognition and import functionality.

**Export this component as `export default CancerScreening;`**

---

## 10. References
- NCCN Guidelines for Cancer Screening
- USPSTF Recommendations 2024-2025
- ACS Cancer Screening Guidelines
- Major cancer epidemiology studies

---

*This document serves as a living blueprint and audit log for the Cancer Screening module. All changes, updates, and clinical decisions should be documented here for transparency, regulatory review, and continuous improvement.*
