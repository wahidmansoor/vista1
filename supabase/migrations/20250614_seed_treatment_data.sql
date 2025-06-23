-- Cancer Treatment Management System - Seed Data
-- Initial data for cancer types, protocols, and reference information

BEGIN;

-- Insert cancer types
INSERT INTO cancer_types (id, name, icd10_code, category, common_stages, biomarkers) VALUES
(
    gen_random_uuid(),
    'Non-Small Cell Lung Cancer',
    'C78.0',
    'solid_tumor',
    '[
        {"name": "Stage I", "code": "T1-2N0M0", "description": "Early stage, localized"},
        {"name": "Stage II", "code": "T1-3N0-1M0", "description": "Early stage with possible lymph node involvement"},
        {"name": "Stage III", "code": "T1-4N0-3M0", "description": "Locally advanced"},
        {"name": "Stage IV", "code": "AnyTAnyNM1", "description": "Metastatic disease"}
    ]'::jsonb,
    '[
        {"name": "EGFR", "type": "genetic", "clinical_significance": "Targeted therapy marker"},
        {"name": "ALK", "type": "genetic", "clinical_significance": "Targeted therapy marker"},
        {"name": "ROS1", "type": "genetic", "clinical_significance": "Targeted therapy marker"},
        {"name": "PD-L1", "type": "protein", "clinical_significance": "Immunotherapy marker"}
    ]'::jsonb
),
(
    gen_random_uuid(),
    'Breast Cancer',
    'C50.9',
    'solid_tumor',
    '[
        {"name": "Stage 0", "code": "TisN0M0", "description": "In situ"},
        {"name": "Stage I", "code": "T1N0M0", "description": "Early invasive"},
        {"name": "Stage II", "code": "T0-2N0-1M0", "description": "Early invasive with possible node involvement"},
        {"name": "Stage III", "code": "T0-4N1-3M0", "description": "Locally advanced"},
        {"name": "Stage IV", "code": "AnyTAnyNM1", "description": "Metastatic"}
    ]'::jsonb,
    '[
        {"name": "ER", "type": "protein", "clinical_significance": "Hormone therapy marker"},
        {"name": "PR", "type": "protein", "clinical_significance": "Hormone therapy marker"},
        {"name": "HER2", "type": "protein", "clinical_significance": "Targeted therapy marker"},
        {"name": "BRCA1", "type": "genetic", "clinical_significance": "Hereditary cancer risk"}
    ]'::jsonb
),
(
    gen_random_uuid(),
    'Colorectal Cancer',
    'C18.9',
    'solid_tumor',
    '[
        {"name": "Stage I", "code": "T1-2N0M0", "description": "Confined to bowel wall"},
        {"name": "Stage II", "code": "T3-4N0M0", "description": "Through bowel wall"},
        {"name": "Stage III", "code": "AnyTN1-2M0", "description": "Lymph node involvement"},
        {"name": "Stage IV", "code": "AnyTAnyNM1", "description": "Distant metastases"}
    ]'::jsonb,
    '[
        {"name": "KRAS", "type": "genetic", "clinical_significance": "Anti-EGFR therapy marker"},
        {"name": "NRAS", "type": "genetic", "clinical_significance": "Anti-EGFR therapy marker"},
        {"name": "BRAF", "type": "genetic", "clinical_significance": "Targeted therapy marker"},
        {"name": "MSI", "type": "molecular", "clinical_significance": "Immunotherapy marker"}
    ]'::jsonb
);

-- Get cancer type IDs for protocol insertion
DO $$ 
DECLARE
    nsclc_id UUID;
    breast_id UUID;
    crc_id UUID;
BEGIN
    SELECT id INTO nsclc_id FROM cancer_types WHERE name = 'Non-Small Cell Lung Cancer';
    SELECT id INTO breast_id FROM cancer_types WHERE name = 'Breast Cancer';
    SELECT id INTO crc_id FROM cancer_types WHERE name = 'Colorectal Cancer';

    -- Insert treatment protocols for NSCLC
    INSERT INTO treatment_protocols (
        name, protocol_code, cancer_types, eligibility_criteria, treatment_lines,
        drugs, schedule, contraindications, monitoring_requirements, expected_outcomes,
        evidence_level, guideline_sources
    ) VALUES
    (
        'Carboplatin + Paclitaxel',
        'NSCLC-001',
        ARRAY[nsclc_id::text],
        '{
            "performance_status": {"ecog": [0, 1], "karnofsky": [70, 80, 90, 100]},
            "organ_function": {
                "renal": {"creatinine_max": 1.5, "gfr_min": 60},
                "hepatic": {"alt_max": 100, "ast_max": 100, "bilirubin_max": 1.5},
                "hematologic": {"hemoglobin_min": 9, "platelets_min": 100000, "neutrophils_min": 1500}
            },
            "biomarkers": [],
            "stage_requirements": ["Stage IIIB", "Stage IV"],
            "exclusion_criteria": ["Active infection", "Pregnancy", "Severe heart disease"]
        }'::jsonb,
        ARRAY['first'::treatment_line_enum],
        '[
            {
                "drug_id": "carboplatin",
                "role": "primary",
                "dosing": {"standard_dose": "AUC 6 IV Day 1", "dose_modifications": []},
                "administration": {"route": "IV", "duration": "30-60 minutes", "frequency": "Every 21 days"},
                "sequence_order": 1
            },
            {
                "drug_id": "paclitaxel",
                "role": "primary",
                "dosing": {"standard_dose": "200 mg/m² IV Day 1", "dose_modifications": []},
                "administration": {"route": "IV", "duration": "3 hours", "frequency": "Every 21 days"},
                "sequence_order": 2
            }
        ]'::jsonb,
        '{
            "cycle_length_days": 21,
            "total_cycles": 6,
            "rest_periods": [],
            "timing_requirements": []
        }'::jsonb,
        ARRAY['Severe hypersensitivity to taxanes', 'Baseline neuropathy grade 2+'],
        '[
            {
                "parameter": "CBC with differential",
                "frequency": "Before each cycle",
                "timing": "pre_treatment",
                "action_thresholds": [
                    {"condition": "ANC < 1500", "threshold_value": "1500", "recommended_action": "Delay treatment", "urgency": "routine"}
                ]
            }
        ]'::jsonb,
        '{
            "response_rates": {"complete_response": 5, "partial_response": 25, "stable_disease": 40, "progressive_disease": 30},
            "survival_metrics": {"median_progression_free_survival": 180, "median_overall_survival": 365},
            "toxicity_profile": {
                "common_toxicities": [
                    {"name": "Fatigue", "incidence_percentage": 60, "grade_distribution": {"grade_1_2": 50, "grade_3_4": 10, "grade_5": 0}},
                    {"name": "Neuropathy", "incidence_percentage": 40, "grade_distribution": {"grade_1_2": 30, "grade_3_4": 10, "grade_5": 0}}
                ]
            }
        }'::jsonb,
        'A'::evidence_level_enum,
        ARRAY['NCCN Guidelines', 'ESMO Guidelines']
    ),
    (
        'Pembrolizumab Monotherapy',
        'NSCLC-002',
        ARRAY[nsclc_id::text],
        '{
            "performance_status": {"ecog": [0, 1], "karnofsky": [70, 80, 90, 100]},
            "organ_function": {
                "hepatic": {"alt_max": 100, "ast_max": 100},
                "renal": {"creatinine_max": 1.5}
            },
            "biomarkers": [
                {"biomarker_id": "PD-L1", "required_status": "positive", "threshold": 50, "is_required": true}
            ],
            "stage_requirements": ["Stage IV"],
            "exclusion_criteria": ["Active autoimmune disease", "Immunosuppressive therapy"]
        }'::jsonb,
        ARRAY['first'::treatment_line_enum],
        '[
            {
                "drug_id": "pembrolizumab",
                "role": "primary",
                "dosing": {"standard_dose": "200 mg IV every 3 weeks", "dose_modifications": []},
                "administration": {"route": "IV", "duration": "30 minutes", "frequency": "Every 21 days"},
                "sequence_order": 1
            }
        ]'::jsonb,
        '{
            "cycle_length_days": 21,
            "total_cycles": 35,
            "rest_periods": [],
            "timing_requirements": []
        }'::jsonb,
        ARRAY['Active autoimmune disease', 'Organ transplant recipient'],
        '[
            {
                "parameter": "Thyroid function",
                "frequency": "Every 6 weeks",
                "timing": "ongoing",
                "action_thresholds": []
            }
        ]'::jsonb,
        '{
            "response_rates": {"complete_response": 8, "partial_response": 37, "stable_disease": 25, "progressive_disease": 30},
            "survival_metrics": {"median_progression_free_survival": 300, "median_overall_survival": 730}
        }'::jsonb,
        'A'::evidence_level_enum,
        ARRAY['NCCN Guidelines', 'FDA Label']
    );

    -- Insert breast cancer protocols
    INSERT INTO treatment_protocols (
        name, protocol_code, cancer_types, eligibility_criteria, treatment_lines,
        drugs, schedule, contraindications, monitoring_requirements, expected_outcomes,
        evidence_level, guideline_sources
    ) VALUES
    (
        'AC-T (Doxorubicin/Cyclophosphamide followed by Paclitaxel)',
        'BC-001',
        ARRAY[breast_id::text],
        '{
            "performance_status": {"ecog": [0, 1], "karnofsky": [70, 80, 90, 100]},
            "organ_function": {
                "cardiac": {"ejection_fraction_min": 50},
                "hepatic": {"alt_max": 100, "bilirubin_max": 1.5},
                "hematologic": {"hemoglobin_min": 9, "platelets_min": 100000}
            },
            "biomarkers": [],
            "stage_requirements": ["Stage II", "Stage III"],
            "exclusion_criteria": ["Previous anthracycline therapy", "Severe cardiac disease"]
        }'::jsonb,
        ARRAY['first'::treatment_line_enum],
        '[
            {
                "drug_id": "doxorubicin",
                "role": "primary",
                "dosing": {"standard_dose": "60 mg/m² IV Day 1", "dose_modifications": []},
                "administration": {"route": "IV", "duration": "15 minutes", "frequency": "Every 21 days x 4 cycles"},
                "sequence_order": 1
            },
            {
                "drug_id": "cyclophosphamide",
                "role": "combination",
                "dosing": {"standard_dose": "600 mg/m² IV Day 1", "dose_modifications": []},
                "administration": {"route": "IV", "duration": "30 minutes", "frequency": "Every 21 days x 4 cycles"},
                "sequence_order": 2
            },
            {
                "drug_id": "paclitaxel",
                "role": "primary",
                "dosing": {"standard_dose": "175 mg/m² IV Day 1", "dose_modifications": []},
                "administration": {"route": "IV", "duration": "3 hours", "frequency": "Every 21 days x 4 cycles"},
                "sequence_order": 3
            }
        ]'::jsonb,
        '{
            "cycle_length_days": 21,
            "total_cycles": 8,
            "rest_periods": [{"after_cycle": 4, "duration_days": 7, "reason": "Regimen change"}],
            "timing_requirements": []
        }'::jsonb,
        ARRAY['Ejection fraction < 50%', 'Previous anthracycline exposure'],
        '[
            {
                "parameter": "ECHO or MUGA",
                "frequency": "Every 3 cycles",
                "timing": "pre_treatment",
                "action_thresholds": [
                    {"condition": "EF drop > 10%", "threshold_value": "10", "recommended_action": "Cardiology consultation", "urgency": "urgent"}
                ]
            }
        ]'::jsonb,
        '{
            "response_rates": {"complete_response": 15, "partial_response": 55, "stable_disease": 20, "progressive_disease": 10},
            "survival_metrics": {"five_year_survival": 85}
        }'::jsonb,
        'A'::evidence_level_enum,
        ARRAY['NCCN Guidelines', 'ASCO Guidelines']
    ),
    (
        'Trastuzumab + Pertuzumab + Docetaxel',
        'BC-002',
        ARRAY[breast_id::text],
        '{
            "performance_status": {"ecog": [0, 1], "karnofsky": [70, 80, 90, 100]},
            "organ_function": {
                "cardiac": {"ejection_fraction_min": 50},
                "hepatic": {"alt_max": 100, "bilirubin_max": 1.5}
            },
            "biomarkers": [
                {"biomarker_id": "HER2", "required_status": "positive", "is_required": true}
            ],
            "stage_requirements": ["Stage IV"],
            "exclusion_criteria": ["Severe cardiac disease", "Previous HER2-targeted therapy"]
        }'::jsonb,
        ARRAY['first'::treatment_line_enum],
        '[
            {
                "drug_id": "trastuzumab",
                "role": "primary",
                "dosing": {"standard_dose": "8 mg/kg loading, then 6 mg/kg", "dose_modifications": []},
                "administration": {"route": "IV", "duration": "90 minutes first dose, then 30 minutes", "frequency": "Every 21 days"},
                "sequence_order": 1
            },
            {
                "drug_id": "pertuzumab",
                "role": "combination",
                "dosing": {"standard_dose": "840 mg loading, then 420 mg", "dose_modifications": []},
                "administration": {"route": "IV", "duration": "60 minutes first dose, then 30 minutes", "frequency": "Every 21 days"},
                "sequence_order": 2
            },
            {
                "drug_id": "docetaxel",
                "role": "combination",
                "dosing": {"standard_dose": "75 mg/m² IV Day 1", "dose_modifications": []},
                "administration": {"route": "IV", "duration": "1 hour", "frequency": "Every 21 days x 6 cycles"},
                "sequence_order": 3
            }
        ]'::jsonb,
        '{
            "cycle_length_days": 21,
            "total_cycles": 18,
            "rest_periods": [],
            "timing_requirements": []
        }'::jsonb,
        ARRAY['HER2-negative disease', 'LVEF < 50%'],
        '[
            {
                "parameter": "Cardiac function assessment",
                "frequency": "Every 12 weeks",
                "timing": "ongoing",
                "action_thresholds": [
                    {"condition": "LVEF < 50%", "threshold_value": "50", "recommended_action": "Hold therapy", "urgency": "immediate"}
                ]
            }
        ]'::jsonb,
        '{
            "response_rates": {"complete_response": 20, "partial_response": 60, "stable_disease": 15, "progressive_disease": 5},
            "survival_metrics": {"median_progression_free_survival": 540, "median_overall_survival": 1460}
        }'::jsonb,
        'A'::evidence_level_enum,
        ARRAY['NCCN Guidelines', 'FDA Label']
    );

    -- Insert colorectal cancer protocols
    INSERT INTO treatment_protocols (
        name, protocol_code, cancer_types, eligibility_criteria, treatment_lines,
        drugs, schedule, contraindications, monitoring_requirements, expected_outcomes,
        evidence_level, guideline_sources
    ) VALUES
    (
        'FOLFOX (5-FU/Leucovorin/Oxaliplatin)',
        'CRC-001',
        ARRAY[crc_id::text],
        '{
            "performance_status": {"ecog": [0, 1, 2], "karnofsky": [60, 70, 80, 90, 100]},
            "organ_function": {
                "hepatic": {"alt_max": 150, "bilirubin_max": 2.0},
                "renal": {"creatinine_max": 2.0},
                "hematologic": {"hemoglobin_min": 8, "platelets_min": 75000, "neutrophils_min": 1000}
            },
            "biomarkers": [],
            "stage_requirements": ["Stage III", "Stage IV"],
            "exclusion_criteria": ["Peripheral neuropathy grade 2+", "DPD deficiency"]
        }'::jsonb,
        ARRAY['first'::treatment_line_enum, 'second'::treatment_line_enum],
        '[
            {
                "drug_id": "oxaliplatin",
                "role": "primary",
                "dosing": {"standard_dose": "85 mg/m² IV Day 1", "dose_modifications": []},
                "administration": {"route": "IV", "duration": "2 hours", "frequency": "Every 14 days"},
                "sequence_order": 1
            },
            {
                "drug_id": "leucovorin",
                "role": "combination",
                "dosing": {"standard_dose": "400 mg/m² IV Day 1", "dose_modifications": []},
                "administration": {"route": "IV", "duration": "2 hours", "frequency": "Every 14 days"},
                "sequence_order": 2
            },
            {
                "drug_id": "5-fluorouracil",
                "role": "primary",
                "dosing": {"standard_dose": "400 mg/m² bolus + 2400 mg/m² CI", "dose_modifications": []},
                "administration": {"route": "IV", "duration": "46 hours continuous", "frequency": "Every 14 days"},
                "sequence_order": 3
            }
        ]'::jsonb,
        '{
            "cycle_length_days": 14,
            "total_cycles": 12,
            "rest_periods": [],
            "timing_requirements": []
        }'::jsonb,
        ARRAY['DPD deficiency', 'Severe neuropathy'],
        '[
            {
                "parameter": "Neuropathy assessment",
                "frequency": "Before each cycle",
                "timing": "pre_treatment",
                "action_thresholds": [
                    {"condition": "Grade 2 neuropathy", "threshold_value": "2", "recommended_action": "Reduce oxaliplatin dose", "urgency": "routine"}
                ]
            }
        ]'::jsonb,
        '{
            "response_rates": {"complete_response": 8, "partial_response": 42, "stable_disease": 30, "progressive_disease": 20},
            "survival_metrics": {"median_progression_free_survival": 270, "median_overall_survival": 730}
        }'::jsonb,
        'A'::evidence_level_enum,
        ARRAY['NCCN Guidelines', 'ESMO Guidelines']
    );
END $$;

-- Insert biomarkers reference data
INSERT INTO biomarkers (name, type, clinical_significance, target_therapies, testing_method) VALUES
('EGFR', 'genetic', 'Epidermal Growth Factor Receptor mutations predict response to EGFR inhibitors', ARRAY['Erlotinib', 'Gefitinib', 'Osimertinib'], 'PCR or NGS'),
('ALK', 'genetic', 'ALK rearrangements predict response to ALK inhibitors', ARRAY['Crizotinib', 'Alectinib', 'Brigatinib'], 'FISH or IHC'),
('PD-L1', 'protein', 'PD-L1 expression predicts response to PD-1/PD-L1 inhibitors', ARRAY['Pembrolizumab', 'Nivolumab', 'Atezolizumab'], 'IHC'),
('HER2', 'protein', 'HER2 amplification/overexpression predicts response to HER2-targeted therapy', ARRAY['Trastuzumab', 'Pertuzumab', 'T-DM1'], 'IHC and FISH'),
('ER', 'protein', 'Estrogen receptor positivity predicts response to hormone therapy', ARRAY['Tamoxifen', 'Aromatase inhibitors'], 'IHC'),
('KRAS', 'genetic', 'KRAS mutations predict resistance to anti-EGFR therapy', ARRAY[], 'PCR or NGS'),
('BRAF', 'genetic', 'BRAF V600E mutations predict response to BRAF inhibitors', ARRAY['Vemurafenib', 'Dabrafenib'], 'PCR or NGS'),
('MSI', 'molecular', 'Microsatellite instability predicts response to immunotherapy', ARRAY['Pembrolizumab', 'Nivolumab'], 'PCR or IHC');

-- Insert common drug interactions
INSERT INTO drug_interactions (drug_a, drug_b, interaction_type, clinical_significance, management_strategy, evidence_level) VALUES
('Warfarin', '5-Fluorouracil', 'major', 'Increased bleeding risk due to enhanced anticoagulation', 'Monitor INR closely and adjust warfarin dose', 'A'),
('Phenytoin', 'Fluorouracil', 'major', 'Increased phenytoin levels leading to toxicity', 'Monitor phenytoin levels and reduce dose if needed', 'B'),
('Cisplatin', 'Aminoglycosides', 'major', 'Increased nephrotoxicity and ototoxicity', 'Avoid combination or monitor closely', 'A'),
('Doxorubicin', 'Trastuzumab', 'major', 'Increased cardiotoxicity risk', 'Monitor cardiac function closely', 'A'),
('Paclitaxel', 'Carboplatin', 'moderate', 'Sequence-dependent interaction affecting efficacy', 'Administer paclitaxel before carboplatin', 'B'),
('Bevacizumab', 'Irinotecan', 'moderate', 'Potential increased bleeding risk', 'Monitor for bleeding events', 'B');

-- Insert clinical guidelines reference
INSERT INTO clinical_guidelines (organization, guideline_name, version, publication_date, cancer_types, summary) VALUES
('NCCN', 'Non-Small Cell Lung Cancer Guidelines', '2024.1', '2024-01-15', ARRAY['Non-Small Cell Lung Cancer'], 'Comprehensive evidence-based guidelines for NSCLC management'),
('NCCN', 'Breast Cancer Guidelines', '2024.1', '2024-01-15', ARRAY['Breast Cancer'], 'Evidence-based recommendations for breast cancer treatment'),
('NCCN', 'Colon Cancer Guidelines', '2024.1', '2024-01-15', ARRAY['Colorectal Cancer'], 'Guidelines for colorectal cancer management'),
('ESMO', 'Lung Cancer Clinical Practice Guidelines', '2023', '2023-09-01', ARRAY['Non-Small Cell Lung Cancer'], 'European consensus guidelines for lung cancer'),
('ASCO', 'Breast Cancer Treatment Guidelines', '2023', '2023-06-01', ARRAY['Breast Cancer'], 'American Society of Clinical Oncology guidelines');

COMMIT;
