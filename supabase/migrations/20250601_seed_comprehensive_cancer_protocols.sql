
-- Comprehensive Cancer Treatment Protocols Migration
-- This migration populates the protocols table with evidence-based treatment protocols
-- for major cancer types with biomarker-specific recommendations

BEGIN;

-- Clear existing protocol data to avoid duplicates
DELETE FROM protocols WHERE tumour_group IN (
  'Non-Small Cell Lung Cancer', 
  'Breast Cancer', 
  'Colorectal Cancer', 
  'Prostate Cancer',
  'Melanoma',
  'Ovarian Cancer'
);

-- =====================================================
-- NON-SMALL CELL LUNG CANCER PROTOCOLS
-- =====================================================

-- NSCLC Stage IV - EGFR Positive
INSERT INTO protocols (
  code, 
  tumour_group, 
  tumour_supergroup,
  treatment_intent, 
  summary,
  eligibility,
  treatment,
  dose_modifications,
  monitoring,
  toxicity_monitoring,
  interactions,
  supportive_care,
  pre_medications,
  cycle_info,
  reference_list,
  contraindications,
  status
) VALUES (
  'NSCLC-EGFR-L1',
  'Non-Small Cell Lung Cancer',
  'Thoracic Malignancies',
  'Palliative',
  'First-line targeted therapy for EGFR-mutated metastatic NSCLC',
  '{
    "performance_status": ["ECOG 0-2"],
    "biomarkers": ["EGFR Exon 19 deletion", "EGFR L858R mutation"],
    "stage": ["IV", "Recurrent"],
    "histology": ["Adenocarcinoma", "NSCLC NOS"],
    "contraindications": ["QTc >470ms", "Severe hepatic impairment"]
  }'::jsonb,
  '{
    "drugs": [
      {
        "name": "Osimertinib",
        "dosage": "80mg daily",
        "route": "oral",
        "frequency": "once daily",
        "duration": "until progression or toxicity",
        "evidence_level": "NCCN Category 1",
        "trial_data": "FLAURA: mPFS 18.9 vs 10.2 months",
        "response_rate": "80%",
        "median_pfs": "18.9 months"
      }
    ]
  }'::jsonb,
  '{
    "renal": [
      {"creatinine_clearance": "<30 mL/min", "modification": "Use with caution, monitor closely"}
    ],
    "hepatic": [
      {"condition": "Severe hepatic impairment", "modification": "Contraindicated"}
    ],
    "hematological": [
      {"parameter": "ANC", "threshold": "<1000", "action": "Hold until recovery"}
    ],
    "cardiac": [
      {"parameter": "QTc", "threshold": ">500ms", "action": "Discontinue permanently"}
    ]
  }'::jsonb,
  '{
    "baseline": ["CBC", "Comprehensive metabolic panel", "LFTs", "ECG", "ECHO/MUGA"],
    "ongoing": [
      {"test": "ECG", "frequency": "Every 3 months"},
      {"test": "LFTs", "frequency": "Every 6 weeks"},
      {"test": "CBC", "frequency": "Every 6 weeks"}
    ]
  }'::jsonb,
  '{
    "expected_toxicities": [
      {"name": "Diarrhea", "frequency": "42%", "grade_3_4": "2%"},
      {"name": "Skin toxicity", "frequency": "35%", "grade_3_4": "1%"},
      {"name": "QTc prolongation", "frequency": "9%", "grade_3_4": "1%"}
    ],
    "monitoring_parameters": "QTc interval, LFTs, CBC, skin examination",
    "frequency_details": "Weekly for first month, then every 6 weeks",
    "thresholds_for_action": {
      "QTc": ">500ms discontinue, 481-500ms reduce dose",
      "Grade_3_skin": "Hold until Grade ≤1",
      "Grade_3_diarrhea": "Hold, supportive care"
    }
  }'::jsonb,
  '{
    "drugs_to_avoid": ["Strong CYP3A4 inducers", "Proton pump inhibitors"],
    "contraindications": ["Congenital long QT syndrome"],
    "precautions_with_other_drugs": [
      {"drug": "Warfarin", "precaution": "Monitor INR closely"},
      {"drug": "Digoxin", "precaution": "Monitor digoxin levels"}
    ]
  }'::jsonb,
  '{
    "required": [
      {"medication": "Anti-diarrheal agents", "indication": "As needed for diarrhea"},
      {"medication": "Topical corticosteroids", "indication": "For skin toxicity"}
    ],
    "optional": [
      {"medication": "Proton pump inhibitor", "indication": "If administered, separate dosing by 6+ hours"}
    ]
  }'::jsonb,
  '[]'::jsonb,
  '{
    "cycle_length": "28 days",
    "total_cycles": "Until progression or toxicity",
    "schedule": "Continuous daily dosing"
  }'::jsonb,
  '[
    "Soria JC, et al. Osimertinib in Untreated EGFR-Mutated Advanced Non-Small-Cell Lung Cancer. NEJM 2018;378:113-125",
    "NCCN Guidelines Version 3.2024 Non-Small Cell Lung Cancer"
  ]'::jsonb,
  '[
    "QTc interval >470ms at baseline",
    "Severe hepatic impairment (Child-Pugh C)",
    "Congenital long QT syndrome",
    "Pregnant or breastfeeding"
  ]'::jsonb,
  'active'
);

-- NSCLC Stage IV - ALK Positive
INSERT INTO protocols (
  code, 
  tumour_group, 
  tumour_supergroup,
  treatment_intent, 
  summary,
  eligibility,
  treatment,
  dose_modifications,
  monitoring,
  toxicity_monitoring,
  interactions,
  supportive_care,
  cycle_info,
  reference_list,
  contraindications,
  status
) VALUES (
  'NSCLC-ALK-L1',
  'Non-Small Cell Lung Cancer',
  'Thoracic Malignancies',
  'Palliative',
  'First-line ALK inhibitor for ALK-rearranged metastatic NSCLC',
  '{
    "performance_status": ["ECOG 0-2"],
    "biomarkers": ["ALK rearrangement"],
    "stage": ["IV", "Recurrent"],
    "histology": ["Adenocarcinoma", "NSCLC NOS"]
  }'::jsonb,
  '{
    "drugs": [
      {
        "name": "Alectinib",
        "dosage": "600mg twice daily",
        "route": "oral",
        "frequency": "twice daily with food",
        "duration": "until progression or toxicity",
        "evidence_level": "NCCN Category 1",
        "trial_data": "ALEX: mPFS 34.8 vs 10.9 months",
        "response_rate": "83%",
        "median_pfs": "34.8 months"
      }
    ]
  }'::jsonb,
  '{
    "renal": [
      {"creatinine_clearance": "<30 mL/min", "modification": "Use with caution"}
    ],
    "hepatic": [
      {"condition": "Severe hepatic impairment", "modification": "Contraindicated"}
    ],
    "hematological": [
      {"parameter": "ANC", "threshold": "<1000", "action": "Hold until recovery to ≥1500"}
    ]
  }'::jsonb,
  '{
    "baseline": ["CBC", "LFTs", "CPK", "Heart rate assessment"],
    "ongoing": [
      {"test": "LFTs", "frequency": "Every 2 weeks for first month, then monthly"},
      {"test": "CPK", "frequency": "Every 2 weeks for first month, then as clinically indicated"},
      {"test": "CBC", "frequency": "Every 4 weeks"}
    ]
  }'::jsonb,
  '{
    "expected_toxicities": [
      {"name": "Constipation", "frequency": "36%", "grade_3_4": "1%"},
      {"name": "Fatigue", "frequency": "33%", "grade_3_4": "2%"},
      {"name": "Myalgia", "frequency": "29%", "grade_3_4": "2%"},
      {"name": "CPK elevation", "frequency": "27%", "grade_3_4": "5%"}
    ],
    "monitoring_parameters": "LFTs, CPK, CBC, bradycardia assessment",
    "frequency_details": "Intensive monitoring first month, then routine",
    "thresholds_for_action": {
      "CPK": ">5x ULN hold until ≤2.5x ULN",
      "ALT/AST": ">5x ULN hold until ≤3x ULN",
      "Bradycardia": "<50 bpm monitor closely"
    }
  }'::jsonb,
  '{
    "drugs_to_avoid": ["Strong CYP3A4 inducers"],
    "precautions_with_other_drugs": [
      {"drug": "Beta-blockers", "precaution": "Monitor for symptomatic bradycardia"}
    ]
  }'::jsonb,
  '{
    "required": [
      {"medication": "Laxatives", "indication": "For constipation management"}
    ],
    "optional": [
      {"medication": "Anti-emetics", "indication": "As needed for nausea"}
    ]
  }'::jsonb,
  '{
    "cycle_length": "28 days",
    "total_cycles": "Until progression or toxicity",
    "schedule": "Continuous twice daily dosing with food"
  }'::jsonb,
  '[
    "Peters S, et al. Alectinib versus Crizotinib in Untreated ALK-Positive Non-Small-Cell Lung Cancer. NEJM 2017;377:829-838",
    "NCCN Guidelines Version 3.2024 Non-Small Cell Lung Cancer"
  ]'::jsonb,
  '[
    "Severe hepatic impairment",
    "Pregnant or breastfeeding"
  ]'::jsonb,
  'active'
);

-- NSCLC Stage IV - PD-L1 High
INSERT INTO protocols (
  code, 
  tumour_group, 
  tumour_supergroup,
  treatment_intent, 
  summary,
  eligibility,
  treatment,
  monitoring,
  toxicity_monitoring,
  supportive_care,
  cycle_info,
  reference_list,
  status
) VALUES (
  'NSCLC-PDL1-L1',
  'Non-Small Cell Lung Cancer',
  'Thoracic Malignancies',
  'Palliative',
  'First-line pembrolizumab for PD-L1 ≥50% metastatic NSCLC',
  '{
    "performance_status": ["ECOG 0-1"],
    "biomarkers": ["PD-L1 ≥50%"],
    "stage": ["IV"],
    "histology": ["Non-squamous", "Squamous"],
    "contraindications": ["Active autoimmune disease", "Organ transplant recipients"]
  }'::jsonb,
  '{
    "drugs": [
      {
        "name": "Pembrolizumab",
        "dosage": "200mg every 3 weeks",
        "route": "intravenous",
        "frequency": "every 3 weeks",
        "duration": "up to 35 cycles or 2 years",
        "evidence_level": "NCCN Category 1",
        "trial_data": "KEYNOTE-024: mPFS 10.3 vs 6.0 months",
        "response_rate": "45%",
        "median_pfs": "10.3 months"
      }
    ]
  }'::jsonb,
  '{
    "baseline": ["CBC", "CMP", "LFTs", "TSH", "Pulmonary function tests"],
    "ongoing": [
      {"test": "TSH", "frequency": "Every 6 weeks"},
      {"test": "LFTs", "frequency": "Before each cycle"},
      {"test": "CBC", "frequency": "Before each cycle"}
    ]
  }'::jsonb,
  '{
    "expected_toxicities": [
      {"name": "Fatigue", "frequency": "38%", "grade_3_4": "4%"},
      {"name": "Pneumonitis", "frequency": "6%", "grade_3_4": "3%"},
      {"name": "Hypothyroidism", "frequency": "9%", "grade_3_4": "<1%"},
      {"name": "Hyperthyroidism", "frequency": "3%", "grade_3_4": "<1%"}
    ],
    "monitoring_parameters": "Immune-related adverse events, thyroid function, pulmonary symptoms",
    "frequency_details": "Before each cycle and as clinically indicated",
    "thresholds_for_action": {
      "Grade_2_pneumonitis": "Hold and initiate corticosteroids",
      "Grade_3_4_any_irAE": "Discontinue permanently",
      "TSH_abnormal": "Evaluate and treat per endocrine guidelines"
    }
  }'::jsonb,
  '{
    "required": [
      {"medication": "Corticosteroids", "indication": "For immune-related adverse events"},
      {"medication": "Thyroid hormone replacement", "indication": "For hypothyroidism if develops"}
    ],
    "optional": [
      {"medication": "Bronchodilators", "indication": "For pneumonitis management"}
    ]
  }'::jsonb,
  '{
    "cycle_length": "21 days",
    "total_cycles": "Maximum 35 cycles (2 years)",
    "schedule": "Day 1 of each 21-day cycle"
  }'::jsonb,
  '[
    "Reck M, et al. Pembrolizumab versus Chemotherapy for PD-L1-Positive Non-Small-Cell Lung Cancer. NEJM 2016;375:1823-1833",
    "NCCN Guidelines Version 3.2024 Non-Small Cell Lung Cancer"
  ]'::jsonb,
  'active'
);

-- =====================================================
-- BREAST CANCER PROTOCOLS
-- =====================================================

-- Breast Cancer Stage IV - HER2 Positive
INSERT INTO protocols (
  code, 
  tumour_group, 
  tumour_supergroup,
  treatment_intent, 
  summary,
  eligibility,
  treatment,
  dose_modifications,
  monitoring,
  toxicity_monitoring,
  interactions,
  supportive_care,
  cycle_info,
  reference_list,
  contraindications,
  status
) VALUES (
  'BREAST-HER2-L2',
  'Breast Cancer',
  'Breast and Gynecologic Malignancies',
  'Palliative',
  'Second-line T-DM1 for HER2-positive metastatic breast cancer',
  '{
    "performance_status": ["ECOG 0-2"],
    "biomarkers": ["HER2 3+ by IHC or HER2 amplified by FISH"],
    "stage": ["IV"],
    "prior_treatment": ["Prior trastuzumab", "Prior taxane"],
    "contraindications": ["LVEF <50%", "Severe hepatic impairment"]
  }'::jsonb,
  '{
    "drugs": [
      {
        "name": "Trastuzumab emtansine (T-DM1)",
        "dosage": "3.6 mg/kg every 3 weeks",
        "route": "intravenous",
        "frequency": "every 3 weeks",
        "duration": "until progression or toxicity",
        "evidence_level": "NCCN Category 1",
        "trial_data": "EMILIA: mPFS 9.6 vs 6.4 months",
        "response_rate": "44%",
        "median_pfs": "9.6 months"
      }
    ]
  }'::jsonb,
  '{
    "hepatic": [
      {"condition": "Mild hepatic impairment", "modification": "Reduce to 3.0 mg/kg"},
      {"condition": "Moderate hepatic impairment", "modification": "Reduce to 2.4 mg/kg"},
      {"condition": "Severe hepatic impairment", "modification": "Contraindicated"}
    ],
    "hematological": [
      {"parameter": "Platelets", "threshold": "<50,000", "action": "Hold until recovery to ≥75,000"}
    ],
    "cardiac": [
      {"parameter": "LVEF", "threshold": "<50%", "action": "Discontinue permanently"}
    ]
  }'::jsonb,
  '{
    "baseline": ["ECHO/MUGA", "CBC with platelets", "LFTs", "Pulmonary function"],
    "ongoing": [
      {"test": "ECHO/MUGA", "frequency": "Every 3 months"},
      {"test": "CBC with platelets", "frequency": "Before each cycle"},
      {"test": "LFTs", "frequency": "Before each cycle"}
    ]
  }'::jsonb,
  '{
    "expected_toxicities": [
      {"name": "Thrombocytopenia", "frequency": "31%", "grade_3_4": "15%"},
      {"name": "Fatigue", "frequency": "36%", "grade_3_4": "2%"},
      {"name": "Nausea", "frequency": "40%", "grade_3_4": "1%"},
      {"name": "Left ventricular dysfunction", "frequency": "2%", "grade_3_4": "1%"}
    ],
    "monitoring_parameters": "LVEF, platelet count, LFTs, pulmonary symptoms",
    "frequency_details": "Before each cycle and as clinically indicated",
    "thresholds_for_action": {
      "LVEF_drop": "≥10% to <50% discontinue",
      "Grade_4_thrombocytopenia": "Hold until recovery",
      "Grade_3_ALT": "Hold until Grade ≤1"
    }
  }'::jsonb,
  '{
    "drugs_to_avoid": ["Live vaccines during treatment"],
    "precautions_with_other_drugs": [
      {"drug": "Strong CYP3A4 inhibitors", "precaution": "Monitor for increased toxicity"}
    ]
  }'::jsonb,
  '{
    "required": [
      {"medication": "Platelet transfusion", "indication": "For severe thrombocytopenia if bleeding"},
      {"medication": "ACE inhibitors", "indication": "For cardiac dysfunction if develops"}
    ],
    "optional": [
      {"medication": "Anti-emetics", "indication": "For nausea management"}
    ]
  }'::jsonb,
  '{
    "cycle_length": "21 days",
    "total_cycles": "Until progression or toxicity",
    "schedule": "Day 1 of each 21-day cycle"
  }'::jsonb,
  '[
    "Verma S, et al. Trastuzumab emtansine for HER2-positive advanced breast cancer. NEJM 2012;367:1783-1791",
    "NCCN Guidelines Version 4.2024 Breast Cancer"
  ]'::jsonb,
  '[
    "LVEF <50%",
    "Severe hepatic impairment (Child-Pugh C)",
    "Platelet count <100,000 at baseline",
    "Pregnant or breastfeeding"
  ]'::jsonb,
  'active'
);

-- Breast Cancer Stage IV - HR Positive
INSERT INTO protocols (
  code, 
  tumour_group, 
  tumour_supergroup,
  treatment_intent, 
  summary,
  eligibility,
  treatment,
  dose_modifications,
  monitoring,
  toxicity_monitoring,
  supportive_care,
  cycle_info,
  reference_list,
  status
) VALUES (
  'BREAST-HR-L1',
  'Breast Cancer',
  'Breast and Gynecologic Malignancies',
  'Palliative',
  'First-line CDK4/6 inhibitor plus aromatase inhibitor for HR+/HER2- metastatic breast cancer',
  '{
    "performance_status": ["ECOG 0-2"],
    "biomarkers": ["ER positive and/or PR positive", "HER2 negative"],
    "stage": ["IV"],
    "menopausal_status": ["Postmenopausal or premenopausal with ovarian suppression"]
  }'::jsonb,
  '{
    "drugs": [
      {
        "name": "Palbociclib + Letrozole",
        "dosage": "Palbociclib 125mg daily x 21 days, Letrozole 2.5mg daily continuous",
        "route": "oral",
        "frequency": "Palbociclib: days 1-21 of 28-day cycle, Letrozole: daily",
        "duration": "until progression or toxicity",
        "evidence_level": "NCCN Category 1",
        "trial_data": "PALOMA-2: mPFS 24.8 vs 14.5 months",
        "response_rate": "42%",
        "median_pfs": "24.8 months"
      }
    ]
  }'::jsonb,
  '{
    "hematological": [
      {"parameter": "ANC", "threshold": "<1000", "action": "Hold palbociclib until recovery to ≥1000"},
      {"parameter": "Platelets", "threshold": "<50,000", "action": "Hold palbociclib until recovery to ≥50,000"}
    ],
    "hepatic": [
      {"condition": "Severe hepatic impairment", "modification": "Reduce palbociclib to 75mg daily"}
    ]
  }'::jsonb,
  '{
    "baseline": ["CBC with differential", "CMP", "ECG"],
    "ongoing": [
      {"test": "CBC with differential", "frequency": "Days 1 and 15 of first 2 cycles, then day 1 of each cycle"},
      {"test": "ECG", "frequency": "As clinically indicated for QTc monitoring"}
    ]
  }'::jsonb,
  '{
    "expected_toxicities": [
      {"name": "Neutropenia", "frequency": "80%", "grade_3_4": "66%"},
      {"name": "Fatigue", "frequency": "41%", "grade_3_4": "2%"},
      {"name": "Nausea", "frequency": "35%", "grade_3_4": "1%"},
      {"name": "Arthralgia", "frequency": "33%", "grade_3_4": "1%"}
    ],
    "monitoring_parameters": "ANC, platelet count, QTc interval",
    "frequency_details": "Intensive CBC monitoring first 2 cycles",
    "thresholds_for_action": {
      "ANC": "<500 hold until ≥1000, consider dose reduction",
      "Platelets": "<25,000 hold until ≥50,000",
      "QTc": ">500ms consider discontinuation"
    }
  }'::jsonb,
  '{
    "drugs_to_avoid": ["Strong CYP3A4 inhibitors with palbociclib"],
    "precautions_with_other_drugs": [
      {"drug": "Grapefruit juice", "precaution": "Avoid consumption"}
    ]
  }'::jsonb,
  '{
    "required": [
      {"medication": "G-CSF", "indication": "For recurrent Grade 3-4 neutropenia"},
      {"medication": "Calcium and Vitamin D", "indication": "For bone health with aromatase inhibitor"}
    ],
    "optional": [
      {"medication": "Bisphosphonates", "indication": "For bone metastases or osteoporosis prevention"}
    ]
  }'::jsonb,
  '{
    "cycle_length": "28 days",
    "total_cycles": "Until progression or toxicity",
    "schedule": "Palbociclib days 1-21, 7-day break; Letrozole continuous"
  }'::jsonb,
  '[
    "Finn RS, et al. Palbociclib and Letrozole in Advanced Breast Cancer. NEJM 2016;375:1925-1936",
    "NCCN Guidelines Version 4.2024 Breast Cancer"
  ]'::jsonb,
  'active'
);

-- =====================================================
-- COLORECTAL CANCER PROTOCOLS
-- =====================================================

-- Colorectal Cancer Stage IV - KRAS Wild-type
INSERT INTO protocols (
  code, 
  tumour_group, 
  tumour_supergroup,
  treatment_intent, 
  summary,
  eligibility,
  treatment,
  dose_modifications,
  monitoring,
  toxicity_monitoring,
  supportive_care,
  cycle_info,
  reference_list,
  status
) VALUES (
  'CRC-EGFR-L1',
  'Colorectal Cancer',
  'Gastrointestinal Malignancies',
  'Palliative',
  'First-line FOLFOX + cetuximab for KRAS/NRAS wild-type metastatic colorectal cancer',
  '{
    "performance_status": ["ECOG 0-2"],
    "biomarkers": ["KRAS wild-type", "NRAS wild-type", "Left-sided primary preferred"],
    "stage": ["IV"],
    "histology": ["Adenocarcinoma"]
  }'::jsonb,
  '{
    "drugs": [
      {
        "name": "FOLFOX + Cetuximab",
        "components": [
          {"name": "Oxaliplatin", "dosage": "85 mg/m²", "day": "1"},
          {"name": "Leucovorin", "dosage": "400 mg/m²", "day": "1"},
          {"name": "5-Fluorouracil bolus", "dosage": "400 mg/m²", "day": "1"},
          {"name": "5-Fluorouracil infusion", "dosage": "2400 mg/m²", "day": "1-2"},
          {"name": "Cetuximab", "dosage": "500 mg/m²", "day": "1"}
        ],
        "route": "intravenous",
        "frequency": "every 2 weeks",
        "duration": "until progression or toxicity",
        "evidence_level": "NCCN Category 1",
        "response_rate": "62%",
        "median_pfs": "9.9 months"
      }
    ]
  }'::jsonb,
  '{
    "renal": [
      {"creatinine_clearance": "<30 mL/min", "modification": "Avoid oxaliplatin"}
    ],
    "hepatic": [
      {"condition": "Moderate-severe hepatic impairment", "modification": "Reduce 5-FU dose by 50%"}
    ],
    "hematological": [
      {"parameter": "ANC", "threshold": "<1500", "action": "Delay treatment until recovery"}
    ],
    "neurologic": [
      {"condition": "Grade 2 neuropathy", "modification": "Reduce oxaliplatin dose by 25%"},
      {"condition": "Grade 3 neuropathy", "modification": "Discontinue oxaliplatin"}
    ]
  }'::jsonb,
  '{
    "baseline": ["CBC", "CMP", "Magnesium", "Neurologic exam", "Skin assessment"],
    "ongoing": [
      {"test": "CBC", "frequency": "Before each cycle"},
      {"test": "Magnesium", "frequency": "Before each cycle"},
      {"test": "Neurologic assessment", "frequency": "Before each cycle"}
    ]
  }'::jsonb,
  '{
    "expected_toxicities": [
      {"name": "Peripheral neuropathy", "frequency": "82%", "grade_3_4": "19%"},
      {"name": "Acneiform rash", "frequency": "86%", "grade_3_4": "17%"},
      {"name": "Diarrhea", "frequency": "66%", "grade_3_4": "16%"},
      {"name": "Hypomagnesemia", "frequency": "34%", "grade_3_4": "6%"}
    ],
    "monitoring_parameters": "Neurologic function, skin toxicity, electrolytes, CBC",
    "frequency_details": "Before each cycle and as clinically indicated",
    "thresholds_for_action": {
      "Grade_3_rash": "Hold cetuximab until Grade ≤2",
      "Grade_2_neuropathy": "Reduce oxaliplatin dose",
      "Magnesium": "<1.2 mg/dL supplement and monitor"
    }
  }'::jsonb,
  '{
    "required": [
      {"medication": "Magnesium supplementation", "indication": "For hypomagnesemia prevention/treatment"},
      {"medication": "Topical antibiotics", "indication": "For acneiform rash"},
      {"medication": "Loperamide", "indication": "For diarrhea management"}
    ],
    "optional": [
      {"medication": "Sunscreen", "indication": "For photosensitivity protection"}
    ]
  }'::jsonb,
  '{
    "cycle_length": "14 days",
    "total_cycles": "Until progression or toxicity",
    "schedule": "Day 1 of each 14-day cycle"
  }'::jsonb,
  '[
    "Douillard JY, et al. Randomized, phase III trial of panitumumab with infusional fluorouracil, leucovorin, and oxaliplatin (FOLFOX4) versus FOLFOX4 alone as first-line treatment in patients with previously untreated metastatic colorectal cancer: the PRIME study. JCO 2010;28:4697-4705",
    "NCCN Guidelines Version 1.2024 Colon Cancer"
  ]'::jsonb,
  'active'
);

-- =====================================================
-- PROSTATE CANCER PROTOCOLS
-- =====================================================

-- Prostate Cancer Metastatic CRPC - First-line
INSERT INTO protocols (
  code, 
  tumour_group, 
  tumour_supergroup,
  treatment_intent, 
  summary,
  eligibility,
  treatment,
  dose_modifications,
  monitoring,
  toxicity_monitoring,
  supportive_care,
  cycle_info,
  reference_list,
  status
) VALUES (
  'PROSTATE-AR-L1',
  'Prostate Cancer',
  'Genitourinary Malignancies',
  'Palliative',
  'First-line enzalutamide for metastatic castration-resistant prostate cancer',
  '{
    "performance_status": ["ECOG 0-2"],
    "disease_status": ["Castration-resistant", "Metastatic"],
    "prior_treatment": ["ADT with progression"],
    "contraindications": ["History of seizure", "Severe hepatic impairment"]
  }'::jsonb,
  '{
    "drugs": [
      {
        "name": "Enzalutamide",
        "dosage": "160mg daily",
        "route": "oral",
        "frequency": "once daily",
        "duration": "until progression or toxicity",
        "evidence_level": "NCCN Category 1",
        "trial_data": "PREVAIL: mOS 32.4 vs 30.2 months",
        "response_rate": "59% PSA decline ≥50%",
        "median_pfs": "20.0 months"
      }
    ]
  }'::jsonb,
  '{
    "hepatic": [
      {"condition": "Moderate hepatic impairment", "modification": "Reduce to 80mg daily"},
      {"condition": "Severe hepatic impairment", "modification": "Contraindicated"}
    ],
    "neurologic": [
      {"condition": "Seizure", "modification": "Discontinue permanently"}
    ]
  }'::jsonb,
  '{
    "baseline": ["PSA", "LFTs", "CBC", "Bone scan", "CT chest/abdomen/pelvis"],
    "ongoing": [
      {"test": "PSA", "frequency": "Every 4 weeks for first 3 months, then every 3 months"},
      {"test": "LFTs", "frequency": "Every 3 months"},
      {"test": "Imaging", "frequency": "Every 3-4 months or as clinically indicated"}
    ]
  }'::jsonb,
  '{
    "expected_toxicities": [
      {"name": "Fatigue", "frequency": "33%", "grade_3_4": "6%"},
      {"name": "Hot flashes", "frequency": "18%", "grade_3_4": "<1%"},
      {"name": "Hypertension", "frequency": "14%", "grade_3_4": "7%"},
      {"name": "Seizure", "frequency": "0.4%", "grade_3_4": "0.4%"}
    ],
    "monitoring_parameters": "Neurologic assessment, blood pressure, PSA response",
    "frequency_details": "Regular follow-up every 4-12 weeks",
    "thresholds_for_action": {
      "Seizure": "Discontinue immediately",
      "Grade_3_hypertension": "Optimize antihypertensive therapy",
      "PSA_progression": "Consider treatment change"
    }
  }'::jsonb,
  '{
    "required": [
      {"medication": "Antihypertensive therapy", "indication": "For hypertension management"},
      {"medication": "Bone-targeted therapy", "indication": "For bone metastases"}
    ],
    "optional": [
      {"medication": "Anticonvulsants", "indication": "Contraindicated - may reduce efficacy"}
    ]
  }'::jsonb,
  '{
    "cycle_length": "28 days",
    "total_cycles": "Until progression or toxicity",
    "schedule": "Continuous daily dosing"
  }'::jsonb,
  '[
    "Beer TM, et al. Enzalutamide in metastatic prostate cancer before chemotherapy. NEJM 2014;371:424-433",
    "NCCN Guidelines Version 4.2024 Prostate Cancer"
  ]'::jsonb,
  'active'
);

-- =====================================================
-- MELANOMA PROTOCOLS
-- =====================================================

-- Melanoma Stage IV - BRAF Mutated
INSERT INTO protocols (
  code, 
  tumour_group, 
  tumour_supergroup,
  treatment_intent, 
  summary,
  eligibility,
  treatment,
  dose_modifications,
  monitoring,
  toxicity_monitoring,
  supportive_care,
  cycle_info,
  reference_list,
  status
) VALUES (
  'MELANOMA-BRAF-L1',
  'Melanoma',
  'Skin and Soft Tissue Malignancies',
  'Palliative',
  'First-line dabrafenib + trametinib for BRAF V600-mutated metastatic melanoma',
  '{
    "performance_status": ["ECOG 0-2"],
    "biomarkers": ["BRAF V600E or V600K mutation"],
    "stage": ["IV", "Unresectable Stage III"],
    "contraindications": ["QTc >500ms", "Severe cardiac dysfunction"]
  }'::jsonb,
  '{
    "drugs": [
      {
        "name": "Dabrafenib + Trametinib",
        "components": [
          {"name": "Dabrafenib", "dosage": "150mg twice daily"},
          {"name": "Trametinib", "dosage": "2mg once daily"}
        ],
        "route": "oral",
        "frequency": "Daily continuous",
        "duration": "until progression or toxicity",
        "evidence_level": "NCCN Category 1",
        "trial_data": "COMBI-d: mPFS 11.0 vs 8.8 months",
        "response_rate": "69%",
        "median_pfs": "11.0 months"
      }
    ]
  }'::jsonb,
  '{
    "cardiac": [
      {"parameter": "LVEF", "threshold": "<50%", "action": "Hold until recovery or discontinue"},
      {"parameter": "QTc", "threshold": ">500ms", "action": "Discontinue trametinib"}
    ],
    "dermatologic": [
      {"condition": "Grade 3 rash", "modification": "Hold until Grade ≤1, reduce trametinib dose"}
    ],
    "ocular": [
      {"condition": "Retinal detachment", "modification": "Hold trametinib until resolution"}
    ]
  }'::jsonb,
  '{
    "baseline": ["ECHO/MUGA", "ECG", "Ophthalmologic exam", "CBC", "LFTs"],
    "ongoing": [
      {"test": "ECHO/MUGA", "frequency": "Every 3 months"},
      {"test": "ECG", "frequency": "Monthly for first 3 months, then every 3 months"},
      {"test": "Ophthalmologic exam", "frequency": "Every 6 months"},
      {"test": "CBC", "frequency": "Monthly"}
    ]
  }'::jsonb,
  '{
    "expected_toxicities": [
      {"name": "Pyrexia", "frequency": "56%", "grade_3_4": "6%"},
      {"name": "Fatigue", "frequency": "53%", "grade_3_4": "5%"},
      {"name": "Rash", "frequency": "47%", "grade_3_4": "9%"},
      {"name": "Diarrhea", "frequency": "35%", "grade_3_4": "3%"}
    ],
    "monitoring_parameters": "Cardiac function, QTc interval, skin assessment, ophthalmologic changes",
    "frequency_details": "Intensive monitoring first 3 months, then routine",
    "thresholds_for_action": {
      "LVEF_drop": "≥10% to <LLN hold both drugs",
      "Grade_3_pyrexia": "Hold dabrafenib, supportive care",
      "Retinal_changes": "Hold trametinib, ophthalmology consultation"
    }
  }'::jsonb,
  '{
    "required": [
      {"medication": "Antipyretics", "indication": "For fever management"},
      {"medication": "Topical corticosteroids", "indication": "For skin toxicity"}
    ],
    "optional": [
      {"medication": "Anti-diarrheal agents", "indication": "For diarrhea management"}
    ]
  }'::jsonb,
  '{
    "cycle_length": "28 days",
    "total_cycles": "Until progression or toxicity",
    "schedule": "Continuous daily dosing, take on empty stomach"
  }'::jsonb,
  '[
    "Long GV, et al. Dabrafenib and trametinib versus dabrafenib and placebo for Val600 BRAF-mutant melanoma: a multicentre, double-blind, phase 3 randomised controlled trial. Lancet 2015;386:444-451",
    "NCCN Guidelines Version 3.2024 Melanoma: Cutaneous"
  ]'::jsonb,
  'active'
);

-- =====================================================
-- OVARIAN CANCER PROTOCOLS  
-- =====================================================

-- Ovarian Cancer Stage IV - BRCA Mutated
INSERT INTO protocols (
  code, 
  tumour_group, 
  tumour_supergroup,
  treatment_intent, 
  summary,
  eligibility,
  treatment,
  dose_modifications,
  monitoring,
  toxicity_monitoring,
  supportive_care,
  cycle_info,
  reference_list,
  status
) VALUES (
  'OVARIAN-BRCA-MAINT',
  'Ovarian Cancer',
  'Breast and Gynecologic Malignancies',
  'Palliative',
  'Maintenance olaparib for BRCA-mutated ovarian cancer after platinum-based chemotherapy',
  '{
    "performance_status": ["ECOG 0-2"],
    "biomarkers": ["BRCA1 or BRCA2 mutation (germline or somatic)"],
    "stage": ["III-IV"],
    "prior_treatment": ["Platinum-based chemotherapy with response"],
    "histology": ["High-grade serous", "Endometrioid", "Clear cell"]
  }'::jsonb,
  '{
    "drugs": [
      {
        "name": "Olaparib",
        "dosage": "300mg twice daily",
        "route": "oral",
        "frequency": "twice daily",
        "duration": "until progression or toxicity",
        "evidence_level": "NCCN Category 1",
        "trial_data": "SOLO-1: mPFS not reached vs 13.8 months",
        "response_rate": "Maintenance indication",
        "median_pfs": ">3 years"
      }
    ]
  }'::jsonb,
  '{
    "renal": [
      {"creatinine_clearance": "30-50 mL/min", "modification": "Reduce to 200mg twice daily"},
      {"creatinine_clearance": "<30 mL/min", "modification": "Avoid use"}
    ],
    "hematological": [
      {"parameter": "Hgb", "threshold": "<8 g/dL", "action": "Hold until recovery to ≥9 g/dL"},
      {"parameter": "ANC", "threshold": "<1000", "action": "Hold until recovery to ≥1500"}
    ]
  }'::jsonb,
  '{
    "baseline": ["CBC with differential", "CMP", "CA-125"],
    "ongoing": [
      {"test": "CBC", "frequency": "Weekly for first month, then monthly"},
      {"test": "CA-125", "frequency": "Every 3 months"},
      {"test": "Imaging", "frequency": "Every 3-4 months"}
    ]
  }'::jsonb,
  '{
    "expected_toxicities": [
      {"name": "Nausea", "frequency": "75%", "grade_3_4": "3%"},
      {"name": "Fatigue", "frequency": "67%", "grade_3_4": "4%"},
      {"name": "Anemia", "frequency": "44%", "grade_3_4": "22%"},
      {"name": "Neutropenia", "frequency": "25%", "grade_3_4": "9%"}
    ],
    "monitoring_parameters": "CBC, CA-125, performance status",
    "frequency_details": "Intensive monitoring first month, then routine",
    "thresholds_for_action": {
      "Grade_3_anemia": "Hold until Hgb ≥9 g/dL, consider transfusion",
      "Grade_4_neutropenia": "Hold until ANC ≥1500",
      "Persistent_nausea": "Optimize antiemetic regimen"
    }
  }'::jsonb,
  '{
    "required": [
      {"medication": "Anti-emetics", "indication": "For nausea management"},
      {"medication": "Iron supplementation", "indication": "For anemia if iron deficient"}
    ],
    "optional": [
      {"medication": "Erythropoiesis stimulating agents", "indication": "For persistent anemia"}
    ]
  }'::jsonb,
  '{
    "cycle_length": "28 days",
    "total_cycles": "Until progression or toxicity (typically continued for 2+ years)",
    "schedule": "Continuous twice daily dosing"
  }'::jsonb,
  '[
    "Moore K, et al. Maintenance Olaparib in Patients with Newly Diagnosed Advanced Ovarian Cancer. NEJM 2018;379:2495-2505",
    "NCCN Guidelines Version 1.2024 Ovarian Cancer"
  ]'::jsonb,
  'active'
);

COMMIT;

-- Verify the data was inserted correctly
SELECT 
  code,
  tumour_group,
  treatment_intent,
  summary,
  status
FROM protocols 
WHERE tumour_group IN (
  'Non-Small Cell Lung Cancer', 
  'Breast Cancer', 
  'Colorectal Cancer', 
  'Prostate Cancer',
  'Melanoma',
  'Ovarian Cancer'
)
ORDER BY tumour_group, code;
