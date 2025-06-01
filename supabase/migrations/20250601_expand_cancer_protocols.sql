-- Expand Cancer Database with Comprehensive Treatment Protocols
-- This migration adds comprehensive cancer treatment protocols for expanded coverage

-- Insert NSCLC Stage IV Protocols
INSERT INTO cd_protocols (
  code,
  tumour_group,
  tumour_supergroup,
  treatment_intent,
  summary,
  treatment,
  eligibility,
  tests,
  dose_modifications,
  precautions,
  reference_list,
  toxicity_monitoring,
  supportive_care,
  monitoring,
  pre_medications,
  post_medications
) VALUES 
-- EGFR+ NSCLC First Line
(
  'NSCLC-EGFR-001',
  'Lung Cancer',
  'Thoracic Malignancies',
  'Palliative',
  'First-line osimertinib for EGFR-mutated advanced NSCLC',
  '{
    "drugs": [
      {
        "name": "Osimertinib",
        "dose": "80mg",
        "route": "PO",
        "frequency": "Daily",
        "schedule": "Continuous until disease progression"
      }
    ],
    "cycle_length": "28 days",
    "total_cycles": "Until progression"
  }',
  '["Histologically confirmed NSCLC", "Stage IIIB/IV or recurrent disease", "EGFR exon 19 deletion or L858R mutation", "ECOG 0-2", "Adequate organ function"]',
  '{
    "baseline": ["EGFR mutation testing", "CBC", "CMP", "ECG", "ECHO/MUGA"],
    "monitoring": ["CBC every 2 weeks x 2, then monthly", "CMP monthly", "ECG at baseline and if symptoms", "ECHO every 3 months", "CT chest/abdomen/pelvis every 6-8 weeks"]
  }',
  '{
    "grade_3_4_toxicity": "Hold until recovery to ≤ Grade 1, then resume at reduced dose",
    "pneumonitis": "Permanently discontinue for Grade 3-4",
    "qtc_prolongation": "Hold for QTc >500ms or >60ms increase from baseline"
  }',
  '["Monitor for pneumonitis", "QTc interval monitoring", "Cardiac function assessment", "Skin toxicity management"]',
  '["FLAURA Trial: Soria et al. NEJM 2018", "NCCN NSCLC Guidelines v3.2024"]',
  '{
    "monitoring_parameters": ["Pneumonitis", "QTc prolongation", "Diarrhea", "Skin rash", "Cardiac toxicity"],
    "frequency": "Every cycle for first 3 cycles, then every 2 cycles"
  }',
  '["Anti-diarrheal medications as needed", "Skin care education", "Pneumonitis monitoring"]',
  '["CBC", "CMP", "Performance status assessment"]',
  '["Premedication not routinely required"]',
  '["Supportive care as clinically indicated"]'
),

-- ALK+ NSCLC First Line  
(
  'NSCLC-ALK-001',
  'Lung Cancer',
  'Thoracic Malignancies',
  'Palliative',
  'First-line alectinib for ALK-positive advanced NSCLC',
  '{
    "drugs": [
      {
        "name": "Alectinib",
        "dose": "600mg",
        "route": "PO",
        "frequency": "BID",
        "schedule": "Continuous until disease progression"
      }
    ],
    "cycle_length": "28 days",
    "total_cycles": "Until progression"
  }',
  '["Histologically confirmed NSCLC", "Stage IIIB/IV or recurrent disease", "ALK fusion positive", "ECOG 0-2", "Adequate organ function"]',
  '{
    "baseline": ["ALK fusion testing (FISH/IHC/NGS)", "CBC", "CMP", "LFTs", "CPK"],
    "monitoring": ["CBC every 2 weeks x 2, then monthly", "LFTs every 2 weeks x 2, then monthly", "CPK monthly", "CT imaging every 6-8 weeks"]
  }',
  '{
    "grade_3_4_toxicity": "Hold until recovery, resume at reduced dose",
    "hepatotoxicity": "Hold for Grade 3-4, resume at reduced dose after recovery",
    "pneumonitis": "Permanently discontinue for Grade 3-4"
  }',
  '["Monitor LFTs closely", "CPK elevation monitoring", "Bradycardia assessment", "CNS penetration advantage"]',
  '["ALEX Trial: Peters et al. NEJM 2017", "NCCN NSCLC Guidelines v3.2024"]',
  '{
    "monitoring_parameters": ["Hepatotoxicity", "Pneumonitis", "Bradycardia", "CPK elevation", "Fatigue"],
    "frequency": "Every cycle for first 3 cycles, then every 2 cycles"
  }',
  '["LFT monitoring", "Heart rate monitoring", "Fatigue management"]',
  '["CBC", "CMP", "LFTs", "CPK"]',
  '["Take with food to enhance absorption"]',
  '["Supportive care as clinically indicated"]'
),

-- High PD-L1 NSCLC First Line
(
  'NSCLC-PDL1-001',
  'Lung Cancer',
  'Thoracic Malignancies',
  'Palliative',
  'First-line pembrolizumab for high PD-L1 NSCLC',
  '{
    "drugs": [
      {
        "name": "Pembrolizumab",
        "dose": "200mg",
        "route": "IV",
        "frequency": "Every 3 weeks",
        "schedule": "Up to 35 cycles (2 years) or until progression"
      }
    ],
    "cycle_length": "21 days",
    "total_cycles": "35 cycles maximum"
  }',
  '["Histologically confirmed NSCLC", "Stage IV or recurrent disease", "PD-L1 TPS ≥50%", "No EGFR/ALK alterations", "ECOG 0-1", "No active autoimmune disease"]',
  '{
    "baseline": ["PD-L1 testing", "EGFR/ALK testing", "CBC", "CMP", "TSH", "LFTs", "Hepatitis B/C testing"],
    "monitoring": ["CBC before each cycle", "CMP before each cycle", "TSH every 6 weeks", "CT imaging every 6 weeks"]
  }',
  '{
    "immune_related_ae": "Hold for Grade 2-4, initiate corticosteroids",
    "pneumonitis": "Hold for Grade 2, permanently discontinue for Grade 3-4",
    "hepatitis": "Hold for Grade 2, permanently discontinue for Grade 3-4"
  }',
  '["Monitor for immune-related adverse events", "Thyroid function monitoring", "Pneumonitis surveillance", "Hepatitis monitoring"]',
  '["KEYNOTE-024: Reck et al. NEJM 2016", "NCCN NSCLC Guidelines v3.2024"]',
  '{
    "monitoring_parameters": ["Pneumonitis", "Hepatitis", "Thyroid dysfunction", "Skin toxicity", "Colitis"],
    "frequency": "Before each cycle and as clinically indicated"
  }',
  '["Immune-related AE management", "Endocrine dysfunction monitoring", "Corticosteroids as needed"]',
  '["CBC", "CMP", "TSH", "LFTs"]',
  '["Standard premedication not required", "Antihistamine and corticosteroid for hypersensitivity if needed"]',
  '["Monitor for delayed immune-related toxicities"]'
),

-- Breast Cancer HER2+ First Line
(
  'BREAST-HER2-001',
  'Breast Cancer',
  'Breast Malignancies',
  'Palliative',
  'First-line pertuzumab + trastuzumab + docetaxel for HER2+ metastatic breast cancer',
  '{
    "drugs": [
      {
        "name": "Pertuzumab",
        "dose": "840mg loading, then 420mg",
        "route": "IV",
        "frequency": "Every 3 weeks",
        "schedule": "Until disease progression"
      },
      {
        "name": "Trastuzumab",
        "dose": "8mg/kg loading, then 6mg/kg",
        "route": "IV",
        "frequency": "Every 3 weeks",
        "schedule": "Until disease progression"
      },
      {
        "name": "Docetaxel",
        "dose": "75mg/m²",
        "route": "IV",
        "frequency": "Every 3 weeks",
        "schedule": "6-8 cycles, then continue HER2 therapy"
      }
    ],
    "cycle_length": "21 days",
    "total_cycles": "Until progression"
  }',
  '["Histologically confirmed breast adenocarcinoma", "HER2-positive (IHC 3+ or FISH amplified)", "Metastatic disease", "ECOG 0-2", "LVEF ≥50%", "Adequate organ function"]',
  '{
    "baseline": ["HER2 testing", "ECHO/MUGA", "CBC", "CMP", "LFTs"],
    "monitoring": ["LVEF every 3 months", "CBC before each cycle", "CT imaging every 6-9 weeks"]
  }',
  '{
    "cardiotoxicity": "Hold for LVEF drop >10% from baseline or <50%",
    "neutropenia": "Dose reduce docetaxel for Grade 4 neutropenia",
    "neuropathy": "Dose reduce docetaxel for Grade 2-3 neuropathy"
  }',
  '["Cardiac monitoring essential", "Infusion reaction monitoring", "Neuropathy assessment", "Neutropenia surveillance"]',
  '["CLEOPATRA Trial: Baselga et al. NEJM 2012", "NCCN Breast Cancer Guidelines v1.2024"]',
  '{
    "monitoring_parameters": ["Cardiotoxicity", "Infusion reactions", "Neutropenia", "Neuropathy", "Diarrhea"],
    "frequency": "Before each cycle"
  }',
  '["Cardiac function monitoring", "Anti-diarrheal medications", "Growth factor support if needed"]',
  '["CBC", "CMP", "LVEF assessment"]',
  '["Premedication for docetaxel: dexamethasone, antihistamine, H2 blocker"]',
  '["Monitor for delayed cardiotoxicity"]'
),

-- Colorectal Cancer KRAS Wild-Type
(
  'CRC-KRAS-WT-001',
  'Colorectal Cancer',
  'GI Malignancies',
  'Palliative',
  'FOLFOX + cetuximab for KRAS wild-type metastatic colorectal cancer',
  '{
    "drugs": [
      {
        "name": "Oxaliplatin",
        "dose": "85mg/m²",
        "route": "IV",
        "frequency": "Every 2 weeks",
        "schedule": "12 cycles, then maintenance"
      },
      {
        "name": "Leucovorin",
        "dose": "400mg/m²",
        "route": "IV",
        "frequency": "Every 2 weeks",
        "schedule": "Until progression"
      },
      {
        "name": "5-Fluorouracil",
        "dose": "400mg/m² bolus, then 2400mg/m² over 46h",
        "route": "IV",
        "frequency": "Every 2 weeks",
        "schedule": "Until progression"
      },
      {
        "name": "Cetuximab",
        "dose": "500mg/m²",
        "route": "IV",
        "frequency": "Every 2 weeks",
        "schedule": "Until progression"
      }
    ],
    "cycle_length": "14 days",
    "total_cycles": "Until progression"
  }',
  '["Histologically confirmed colorectal adenocarcinoma", "Metastatic disease", "KRAS wild-type", "ECOG 0-2", "Adequate organ function"]',
  '{
    "baseline": ["KRAS/NRAS/BRAF testing", "CBC", "CMP", "Mg/Phos", "CEA"],
    "monitoring": ["CBC before each cycle", "CMP every cycle", "Mg/Phos weekly", "CT imaging every 6-8 weeks"]
  }',
  '{
    "neuropathy": "Dose reduce oxaliplatin for Grade 2-3, discontinue for Grade 4",
    "hypomagnesemia": "Replace magnesium, may require dose reduction",
    "skin_toxicity": "Dose modify cetuximab for Grade 3-4 skin reactions"
  }',
  '["Neuropathy monitoring", "Electrolyte monitoring", "Skin toxicity assessment", "Infusion reaction monitoring"]',
  '["CRYSTAL Trial: Van Cutsem et al. JCO 2011", "NCCN Colon Cancer Guidelines v1.2024"]',
  '{
    "monitoring_parameters": ["Neuropathy", "Skin toxicity", "Hypomagnesemia", "Infusion reactions", "Diarrhea"],
    "frequency": "Before each cycle"
  }',
  '["Neuropathy management", "Skin care", "Electrolyte replacement", "Anti-diarrheal medications"]',
  '["CBC", "CMP", "Mg", "Phos", "CEA"]',
  '["Antihistamine and corticosteroid for cetuximab", "Standard 5-FU premedication"]',
  '["Monitor for delayed skin toxicity and neuropathy"]'
),

-- Prostate Cancer Metastatic Castration-Resistant
(
  'PROSTATE-CRPC-001',
  'Prostate Cancer',
  'GU Malignancies',
  'Palliative',
  'Enzalutamide for metastatic castration-resistant prostate cancer',
  '{
    "drugs": [
      {
        "name": "Enzalutamide",
        "dose": "160mg",
        "route": "PO",
        "frequency": "Daily",
        "schedule": "Continuous until progression"
      }
    ],
    "cycle_length": "28 days",
    "total_cycles": "Until progression"
  }',
  '["Histologically confirmed prostate adenocarcinoma", "Metastatic disease", "Castration-resistant (testosterone <50 ng/dL)", "Progressive disease", "ECOG 0-2"]',
  '{
    "baseline": ["PSA", "Testosterone", "CBC", "CMP", "LFTs", "Bone scan", "CT imaging"],
    "monitoring": ["PSA monthly", "CBC every 3 months", "LFTs every 3 months", "Imaging every 3-4 months"]
  }',
  '{
    "hepatotoxicity": "Hold for Grade 3-4 ALT/AST elevation",
    "seizures": "Permanently discontinue for seizures",
    "hypertension": "Manage with antihypertensives"
  }',
  '["Seizure risk assessment", "Hypertension monitoring", "LFT monitoring", "Drug interactions"]',
  '["AFFIRM Trial: Scher et al. NEJM 2012", "NCCN Prostate Cancer Guidelines v4.2024"]',
  '{
    "monitoring_parameters": ["Seizures", "Fatigue", "Hypertension", "Hot flashes", "Cognitive impairment"],
    "frequency": "Every cycle"
  }',
  '["Seizure precautions", "Fatigue management", "Cardiovascular monitoring"]',
  '["PSA", "CBC", "CMP", "LFTs"]',
  '["Take with or without food", "Avoid CYP3A4 inducers"]',
  '["Monitor for neurologic symptoms"]'
),

-- Melanoma BRAF-Mutated
(
  'MELANOMA-BRAF-001',
  'Melanoma',
  'Skin Cancer',
  'Palliative',
  'Dabrafenib + trametinib for BRAF V600-mutated metastatic melanoma',
  '{
    "drugs": [
      {
        "name": "Dabrafenib",
        "dose": "150mg",
        "route": "PO",
        "frequency": "BID",
        "schedule": "Continuous until progression"
      },
      {
        "name": "Trametinib",
        "dose": "2mg",
        "route": "PO",
        "frequency": "Daily",
        "schedule": "Continuous until progression"
      }
    ],
    "cycle_length": "28 days",
    "total_cycles": "Until progression"
  }',
  '["Histologically confirmed melanoma", "BRAF V600E or V600K mutation", "Metastatic or unresectable disease", "ECOG 0-2", "Adequate organ function"]',
  '{
    "baseline": ["BRAF mutation testing", "ECHO/MUGA", "CBC", "CMP", "LFTs", "Ophthalmologic exam"],
    "monitoring": ["LVEF every 3 months", "CBC monthly", "LFTs monthly", "Dermatologic exam monthly", "Ophthalmologic exam every 6 months"]
  }',
  '{
    "cardiotoxicity": "Hold for LVEF drop >10% from baseline",
    "skin_toxicity": "Dose reduce for Grade 3 cutaneous SCC",
    "retinal_toxicity": "Hold for retinal vein occlusion"
  }',
  '["Cardiac monitoring", "Skin cancer surveillance", "Retinal monitoring", "Fever management"]',
  '["COMBI-d Trial: Long et al. NEJM 2014", "NCCN Melanoma Guidelines v2.2024"]',
  '{
    "monitoring_parameters": ["Cardiotoxicity", "Secondary skin cancers", "Retinal toxicity", "Fever", "Arthralgia"],
    "frequency": "Monthly for first 3 months, then every 3 months"
  }',
  '["Cardiac function monitoring", "Dermatologic surveillance", "Fever management"]',
  '["CBC", "CMP", "LFTs", "LVEF", "Dermatologic exam"]',
  '["Take on empty stomach (dabrafenib)", "Take with food (trametinib)"]',
  '["Monitor for new skin lesions and secondary malignancies"]'
),

-- Ovarian Cancer Platinum-Sensitive Recurrent
(
  'OVARIAN-PLAT-SENS-001',
  'Ovarian Cancer',
  'GYN Malignancies',
  'Palliative',
  'Carboplatin + paclitaxel + bevacizumab for platinum-sensitive recurrent ovarian cancer',
  '{
    "drugs": [
      {
        "name": "Carboplatin",
        "dose": "AUC 6",
        "route": "IV",
        "frequency": "Every 3 weeks",
        "schedule": "6 cycles"
      },
      {
        "name": "Paclitaxel",
        "dose": "175mg/m²",
        "route": "IV",
        "frequency": "Every 3 weeks",
        "schedule": "6 cycles"
      },
      {
        "name": "Bevacizumab",
        "dose": "15mg/kg",
        "route": "IV",
        "frequency": "Every 3 weeks",
        "schedule": "Until progression"
      }
    ],
    "cycle_length": "21 days",
    "total_cycles": "Until progression"
  }',
  '["Histologically confirmed ovarian/fallopian tube/peritoneal cancer", "Platinum-sensitive recurrence (>6 months)", "ECOG 0-2", "No history of bowel obstruction", "Adequate organ function"]',
  '{
    "baseline": ["CBC", "CMP", "CA-125", "Urinalysis", "Blood pressure assessment"],
    "monitoring": ["CBC before each cycle", "CA-125 monthly", "Blood pressure monitoring", "Proteinuria assessment", "CT imaging every 3 cycles"]
  }',
  '{
    "hypertension": "Hold bevacizumab for Grade 4 hypertension",
    "proteinuria": "Hold bevacizumab for >2g protein/24h",
    "bleeding": "Permanently discontinue bevacizumab for Grade 3-4 bleeding",
    "neuropathy": "Dose reduce paclitaxel for Grade 2-3 neuropathy"
  }',
  '["Hypertension monitoring", "Proteinuria surveillance", "Bleeding risk assessment", "Neuropathy monitoring", "Wound healing"]',
  '["OCEANS Trial: Aghajanian et al. JCO 2012", "NCCN Ovarian Cancer Guidelines v1.2024"]',
  '{
    "monitoring_parameters": ["Hypertension", "Proteinuria", "Bleeding", "Neuropathy", "Fatigue"],
    "frequency": "Before each cycle"
  }',
  '["Blood pressure management", "Neuropathy care", "Bleeding precautions"]',
  '["CBC", "CMP", "CA-125", "Urinalysis", "Blood pressure"]',
  '["Standard premedication for paclitaxel", "No premedication required for bevacizumab"]',
  '["Monitor for delayed bevacizumab toxicities"]'
);

-- Add indexes for improved query performance
CREATE INDEX IF NOT EXISTS idx_cd_protocols_tumour_biomarkers ON cd_protocols USING GIN ((eligibility::text));
CREATE INDEX IF NOT EXISTS idx_cd_protocols_treatment_drugs ON cd_protocols USING GIN ((treatment::text));
CREATE INDEX IF NOT EXISTS idx_cd_protocols_intent_stage ON cd_protocols (treatment_intent, tumour_group);

-- Create view for easy protocol searching
CREATE OR REPLACE VIEW v_treatment_protocols AS
SELECT 
  id,
  code,
  tumour_group,
  tumour_supergroup,
  treatment_intent,
  summary,
  treatment->>'drugs' as drug_regimen,
  eligibility,
  reference_list,
  created_at,
  updated_at
FROM cd_protocols
WHERE treatment IS NOT NULL;

-- Grant permissions
GRANT SELECT ON v_treatment_protocols TO anon, authenticated;
