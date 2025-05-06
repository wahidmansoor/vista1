-- Begin transaction
BEGIN;

-- Ensure uuid-ossp extension is available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function to safely insert JSONB arrays
CREATE OR REPLACE FUNCTION safe_json_array(text[])
RETURNS jsonb AS $$
BEGIN
    RETURN COALESCE(
        jsonb_build_array(VARIADIC $1),
        '[]'::jsonb
    );
END;
$$ LANGUAGE plpgsql;

-- Clear existing data if needed
TRUNCATE TABLE oncology_medications;

-- Insert medications
INSERT INTO oncology_medications (
    name, brand_names, classification, indications, dosing, administration, 
    side_effects, interactions, monitoring, reference_sources
) VALUES 
(
    'Cisplatin',
    ARRAY['Platinol'],
    'Platinum Chemotherapy',
    jsonb_build_object(
        'cancer_types', jsonb_build_array('Lung Cancer', 'Bladder Cancer', 'Testicular Cancer')
    ),
    jsonb_build_object(
        'standard', '50-100 mg/m² every 3-4 weeks',
        'adjustments', jsonb_build_array('Reduce dose for renal impairment', 'Hydration protocol required')
    ),
    jsonb_build_array('Infuse over 1-2 hours with hydration'),
    jsonb_build_array('Nephrotoxicity', 'Nausea & vomiting', 'Ototoxicity'),
    jsonb_build_array('Aminoglycosides', 'NSAIDs', 'Loop Diuretics'),
    jsonb_build_object(
        'labs', jsonb_build_array('Renal function', 'Electrolytes'),
        'frequency', 'Prior to each cycle',
        'precautions', jsonb_build_array('Hearing tests')
    ),
    ARRAY['NCCN Guidelines', 'BC Cancer Protocols']
),
(
    'Doxorubicin',
    ARRAY['Adriamycin', 'Doxil'],
    'Anthracycline Chemotherapy',
    jsonb_build_object(
        'cancer_types', jsonb_build_array('Breast Cancer', 'Lymphoma', 'Leukemia')
    ),
    jsonb_build_object(
        'standard', '60-75 mg/m² every 3 weeks'
    ),
    jsonb_build_array('Administer via central line'),
    jsonb_build_array('Cardiotoxicity', 'Myelosuppression', 'Alopecia'),
    jsonb_build_array('Cyclophosphamide', 'Paclitaxel', 'Trastuzumab'),
    jsonb_build_object(
        'labs', jsonb_build_array('CBC', 'Liver function tests'),
        'frequency', 'Prior to each cycle',
        'precautions', jsonb_build_array('Regular cardiac monitoring')
    ),
    ARRAY['NCCN Guidelines']
),
(
    'Pembrolizumab',
    ARRAY['Keytruda'],
    'PD-1 Checkpoint Inhibitor',
    jsonb_build_object(
        'cancer_types', jsonb_build_array('Melanoma', 'NSCLC', 'Head and Neck Cancer', 'Hodgkin Lymphoma')
    ),
    jsonb_build_object(
        'standard', '200 mg every 3 weeks or 400 mg every 6 weeks'
    ),
    jsonb_build_array('IV infusion over 30 minutes'),
    jsonb_build_array('Immune-mediated adverse events', 'Fatigue', 'Pruritus', 'Rash', 'Diarrhea'),
    jsonb_build_array('Systemic corticosteroids', 'Immunosuppressive agents'),
    jsonb_build_object(
        'labs', jsonb_build_array('Thyroid function', 'Liver function', 'Renal function'),
        'frequency', 'Every 3 weeks',
        'precautions', jsonb_build_array('Monitor for immune-related adverse events')
    ),
    ARRAY['NCCN Guidelines', 'FDA prescribing information']
),
(
    'Atezolizumab',
    ARRAY['Tecentriq'],
    'PD-L1 Checkpoint Inhibitor',
    jsonb_build_object(
        'cancer_types', jsonb_build_array('NSCLC', 'Triple-Negative Breast Cancer')
    ),
    jsonb_build_object(
        'standard', '1200 mg IV every 3 weeks'
    ),
    jsonb_build_array('IV infusion over 60 minutes'),
    jsonb_build_array('Immune-mediated adverse events', 'Fatigue', 'Diarrhea', 'Pneumonitis'),
    jsonb_build_array('Systemic corticosteroids', 'Immunosuppressive agents'),
    jsonb_build_object(
        'labs', jsonb_build_array('Liver function', 'Thyroid function'),
        'frequency', 'Every 3 weeks',
        'precautions', jsonb_build_array('Monitor for immune-related adverse events')
    ),
    ARRAY['NCCN Guidelines', 'FDA prescribing information']
),
(
    'Trastuzumab',
    ARRAY['Herceptin'],
    'HER2 Monoclonal Antibody',
    jsonb_build_object(
        'cancer_types', jsonb_build_array('HER2-Positive Breast Cancer', 'HER2-Positive Gastric Cancer')
    ),
    jsonb_build_object(
        'standard', '8 mg/kg loading, then 6 mg/kg every 3 weeks',
        'adjustments', jsonb_build_array('No dose reduction for toxicity')
    ),
    jsonb_build_array('IV infusion', 'First dose over 90 minutes, can reduce if tolerated'),
    jsonb_build_array('Cardiotoxicity', 'Infusion reactions', 'Pneumonitis', 'Diarrhea'),
    jsonb_build_array('Anthracyclines', 'Other cardiotoxic agents'),
    jsonb_build_object(
        'labs', jsonb_build_array('Cardiac function', 'LVEF monitoring'),
        'frequency', 'Every 3 months',
        'precautions', jsonb_build_array('Regular cardiac monitoring', 'Hold for EF decline')
    ),
    ARRAY['NCCN Guidelines', 'BC Cancer Protocols']
),
(
    'Palbociclib',
    ARRAY['Ibrance'],
    'CDK4/6 Inhibitor',
    jsonb_build_object(
        'cancer_types', jsonb_build_array('HR-Positive HER2-Negative Breast Cancer')
    ),
    jsonb_build_object(
        'standard', '125 mg orally once daily for 21 days, then 7 days off'
    ),
    jsonb_build_array('Oral capsule, take with food'),
    jsonb_build_array('Neutropenia', 'Fatigue', 'Infections', 'Pulmonary toxicity'),
    jsonb_build_array('CYP3A4 inhibitors', 'Strong CYP3A inducers'),
    jsonb_build_object(
        'labs', jsonb_build_array('CBC', 'Liver function'),
        'frequency', 'Every cycle',
        'precautions', jsonb_build_array('Monitor for neutropenia and lung toxicity')
    ),
    ARRAY['NCCN Guidelines', 'ASCO Guidelines']
),
(
    'Paclitaxel',
    ARRAY['Taxol', 'Abraxane'],
    'Taxane Chemotherapy',
    jsonb_build_object(
        'cancer_types', jsonb_build_array('Breast Cancer', 'Ovarian Cancer', 'Lung Cancer', 'Head and Neck Cancer')
    ),
    jsonb_build_object(
        'standard', '175 mg/m² every 3 weeks',
        'adjustments', jsonb_build_array('Weekly schedules available', 'Dose reduce for neuropathy')
    ),
    jsonb_build_array('IV infusion over 3 hours', 'Requires premedication'),
    jsonb_build_array('Peripheral neuropathy', 'Hypersensitivity reactions', 'Myelosuppression', 'Alopecia', 'Arthralgia'),
    jsonb_build_array('CYP2C8 inhibitors', 'CYP3A4 inhibitors', 'Platinum agents'),
    jsonb_build_object(
        'labs', jsonb_build_array('CBC', 'Liver function'),
        'frequency', 'Prior to each cycle',
        'precautions', jsonb_build_array('Monitor for hypersensitivity', 'Assess neuropathy')
    ),
    ARRAY['NCCN Guidelines', 'BC Cancer Protocols']
),
(
    'Tamoxifen',
    ARRAY['Nolvadex'],
    'Selective Estrogen Receptor Modulator (SERM)',
    jsonb_build_object(
        'cancer_types', jsonb_build_array('ER-Positive Breast Cancer')
    ),
    jsonb_build_object(
        'standard', '20 mg daily',
        'adjustments', jsonb_build_array('Continue for 5-10 years')
    ),
    jsonb_build_array('Oral administration', 'Take with or without food'),
    jsonb_build_array('Hot flashes', 'Deep vein thrombosis', 'Endometrial cancer risk', 'Mood changes'),
    jsonb_build_array('Warfarin', 'CYP2D6 inhibitors', 'Estrogens'),
    jsonb_build_object(
        'labs', jsonb_build_array('Gynecologic exam', 'Blood counts'),
        'frequency', 'Every 6-12 months',
        'precautions', jsonb_build_array('Monitor for vaginal bleeding', 'Regular gynecologic exams')
    ),
    ARRAY['NCCN Guidelines', 'ASCO Guidelines']
),
(
    'Carboplatin',
    ARRAY['Paraplatin'],
    'Platinum Chemotherapy',
    jsonb_build_object(
        'cancer_types', jsonb_build_array('Ovarian Cancer', 'Lung Cancer', 'Breast Cancer', 'Head and Neck Cancer')
    ),
    jsonb_build_object(
        'standard', 'AUC 5-6 every 3 weeks',
        'adjustments', jsonb_build_array('Calculate dose using Calvert formula', 'Adjust for renal function')
    ),
    jsonb_build_array('IV infusion over 30-60 minutes', 'No pre-hydration required'),
    jsonb_build_array('Thrombocytopenia', 'Neutropenia', 'Nausea and vomiting', 'Fatigue', 'Peripheral neuropathy'),
    jsonb_build_array('Aminoglycosides', 'NSAIDs', 'Nephrotoxic agents'),
    jsonb_build_object(
        'labs', jsonb_build_array('CBC', 'Renal function', 'Electrolytes'),
        'frequency', 'Weekly in first cycle, then prior to each cycle',
        'precautions', jsonb_build_array('Monitor platelet count')
    ),
    ARRAY['NCCN Guidelines', 'BC Cancer Protocols']
),
(
    'Osimertinib',
    ARRAY['Tagrisso'],
    'EGFR Tyrosine Kinase Inhibitor',
    jsonb_build_object(
        'cancer_types', jsonb_build_array('EGFR-Mutant Non-Small Cell Lung Cancer')
    ),
    jsonb_build_object(
        'standard', '80 mg orally once daily',
        'adjustments', jsonb_build_array('Modify for hepatic or renal dysfunction')
    ),
    jsonb_build_array('Oral tablet, take with or without food'),
    jsonb_build_array('Diarrhea', 'Rash', 'QT prolongation', 'Interstitial lung disease'),
    jsonb_build_array('QT prolonging medications', 'Strong CYP3A4 inducers'),
    jsonb_build_object(
        'labs', jsonb_build_array('ECG', 'Liver function', 'Renal function'),
        'frequency', 'Every 4-6 weeks',
        'precautions', jsonb_build_array('Monitor QT interval', 'Assess for lung toxicity')
    ),
    ARRAY['NCCN Guidelines', 'FDA prescribing information']
),
(
    'Sotorasib',
    ARRAY['Lumakras'],
    'KRAS Inhibitor',
    jsonb_build_object(
        'cancer_types', jsonb_build_array('KRAS G12C-Mutant Non-Small Cell Lung Cancer')
    ),
    jsonb_build_object(
        'standard', '960 mg orally once daily'
    ),
    jsonb_build_array('Oral tablet, take with or without food'),
    jsonb_build_array('Hepatotoxicity', 'Diarrhea', 'Fatigue', 'Nausea'),
    jsonb_build_array('CYP3A4 inhibitors', 'P-gp substrates'),
    jsonb_build_object(
        'labs', jsonb_build_array('Liver function', 'Renal function'),
        'frequency', 'Every 4 weeks',
        'precautions', jsonb_build_array('Monitor for liver toxicity')
    ),
    ARRAY['NCCN Guidelines', 'FDA prescribing information']
),
(
    'Alpelisib',
    ARRAY['Piqray'],
    'PI3K Inhibitor',
    jsonb_build_object(
        'cancer_types', jsonb_build_array('HR-Positive, HER2-Negative Breast Cancer')
    ),
    jsonb_build_object(
        'standard', '300 mg orally once daily'
    ),
    jsonb_build_array('Oral tablet, take with food'),
    jsonb_build_array('Hyperglycemia', 'Rash', 'Diarrhea', 'Fatigue'),
    jsonb_build_array('CYP3A4 inhibitors', 'Diabetes medications'),
    jsonb_build_object(
        'labs', jsonb_build_array('Blood glucose', 'Liver function'),
        'frequency', 'Every 2-4 weeks',
        'precautions', jsonb_build_array('Monitor for hyperglycemia')
    ),
    ARRAY['NCCN Guidelines', 'FDA prescribing information']
),
(
    'Trastuzumab Deruxtecan',
    ARRAY['Enhertu'],
    'HER2-Targeted Antibody-Drug Conjugate',
    jsonb_build_object(
        'cancer_types', jsonb_build_array('HER2-Positive Breast Cancer', 'HER2-Low Breast Cancer', 'HER2-Positive Gastric Cancer')
    ),
    jsonb_build_object(
        'standard', '5.4 mg/kg every 3 weeks',
        'adjustments', jsonb_build_array('Dose reduction for toxicity')
    ),
    jsonb_build_array('IV infusion over 90 minutes (first dose)', 'Subsequent doses over 30 minutes if tolerated'),
    jsonb_build_array('Interstitial lung disease', 'Neutropenia', 'Nausea', 'Fatigue', 'Left ventricular dysfunction'),
    jsonb_build_array('Other cardiotoxic agents', 'Strong CYP3A4 inhibitors'),
    jsonb_build_object(
        'labs', jsonb_build_array('CBC', 'Cardiac function', 'Liver function'),
        'frequency', 'Prior to each cycle',
        'precautions', jsonb_build_array('Monitor for ILD/pneumonitis', 'Regular cardiac monitoring')
    ),
    ARRAY['NCCN Guidelines', 'FDA prescribing information']
),
(
    'Sacituzumab Govitecan',
    ARRAY['Trodelvy'],
    'Trop-2-Targeted Antibody-Drug Conjugate',
    jsonb_build_object(
        'cancer_types', jsonb_build_array('Triple-Negative Breast Cancer', 'HR+/HER2- Breast Cancer', 'Urothelial Cancer')
    ),
    jsonb_build_object(
        'standard', '10 mg/kg on days 1 and 8 of 21-day cycle'
    ),
    jsonb_build_array('IV infusion over 3 hours (first dose)', 'Subsequent doses over 1-2 hours if tolerated'),
    jsonb_build_array('Neutropenia', 'Diarrhea', 'Nausea', 'Fatigue', 'Alopecia'),
    jsonb_build_array('UGT1A1 inhibitors', 'BCRP inhibitors'),
    jsonb_build_object(
        'labs', jsonb_build_array('CBC', 'Liver function'),
        'frequency', 'Prior to each dose',
        'precautions', jsonb_build_array('UGT1A1 testing recommended', 'Monitor for severe diarrhea')
    ),
    ARRAY['NCCN Guidelines', 'FDA prescribing information']
),
(
    'Polatuzumab Vedotin',
    ARRAY['Polivy'],
    'CD79b-Targeted Antibody-Drug Conjugate',
    jsonb_build_object(
        'cancer_types', jsonb_build_array('Diffuse Large B-Cell Lymphoma')
    ),
    jsonb_build_object(
        'standard', '1.8 mg/kg every 21 days for 6 cycles'
    ),
    jsonb_build_array('IV infusion over 90 minutes'),
    jsonb_build_array('Peripheral neuropathy', 'Neutropenia', 'Fatigue', 'Diarrhea'),
    jsonb_build_array('Strong CYP3A4 inhibitors', 'Dual CYP3A4/P-gp inhibitors'),
    jsonb_build_object(
        'labs', jsonb_build_array('CBC', 'Liver function'),
        'frequency', 'Prior to each cycle',
        'precautions', jsonb_build_array('Monitor for neuropathy', 'Assess for infections')
    ),
    ARRAY['NCCN Guidelines', 'FDA prescribing information']
),
(
    'Alectinib',
    ARRAY['Alecensa'],
    'ALK Tyrosine Kinase Inhibitor',
    jsonb_build_object(
        'cancer_types', jsonb_build_array('ALK-Positive Non-Small Cell Lung Cancer')
    ),
    jsonb_build_object(
        'standard', '600 mg orally twice daily',
        'adjustments', jsonb_build_array('Dose reduction for adverse reactions')
    ),
    jsonb_build_array('Oral capsules with food'),
    jsonb_build_array('Hepatotoxicity', 'Myalgia', 'Anemia', 'Bradycardia', 'Vision disorders'),
    jsonb_build_array('Strong CYP3A inhibitors', 'P-gp substrates'),
    jsonb_build_object(
        'labs', jsonb_build_array('Liver function', 'CBC', 'CPK'),
        'frequency', 'Every 2 weeks for first 3 months, then monthly',
        'precautions', jsonb_build_array('Monitor for vision changes', 'Regular liver function testing')
    ),
    ARRAY['NCCN Guidelines', 'FDA prescribing information']
),
(
    'Ibrutinib',
    ARRAY['Imbruvica'],
    'BTK Inhibitor',
    jsonb_build_object(
        'cancer_types', jsonb_build_array('Chronic Lymphocytic Leukemia', 'Mantle Cell Lymphoma', 'Waldenström Macroglobulinemia')
    ),
    jsonb_build_object(
        'standard', '420-560 mg orally once daily',
        'adjustments', jsonb_build_array('Dose modify for adverse reactions', 'Adjust for drug interactions')
    ),
    jsonb_build_array('Oral capsules or tablets', 'Take at same time each day'),
    jsonb_build_array('Bleeding', 'Atrial fibrillation', 'Hypertension', 'Cytopenias', 'Infections'),
    jsonb_build_array('CYP3A inhibitors', 'Anticoagulants', 'Antiplatelet agents'),
    jsonb_build_object(
        'labs', jsonb_build_array('CBC', 'Blood pressure', 'ECG'),
        'frequency', 'Monthly initially, then as clinically indicated',
        'precautions', jsonb_build_array('Monitor for bleeding', 'Assess cardiac function')
    ),
    ARRAY['NCCN Guidelines', 'FDA prescribing information']
),
(
    'Lorlatinib',
    ARRAY['Lorbrena'],
    'ALK/ROS1 Tyrosine Kinase Inhibitor',
    jsonb_build_object(
        'cancer_types', jsonb_build_array('ALK-Positive Non-Small Cell Lung Cancer', 'ROS1-Positive NSCLC')
    ),
    jsonb_build_object(
        'standard', '100 mg orally once daily'
    ),
    jsonb_build_array('Oral tablets with or without food'),
    jsonb_build_array('CNS effects', 'Hyperlipidemia', 'Edema', 'Peripheral neuropathy'),
    jsonb_build_array('Strong CYP3A inducers', 'Strong CYP3A4 inhibitors'),
    jsonb_build_object(
        'labs', jsonb_build_array('Lipid panel', 'Liver function', 'ECG'),
        'frequency', 'Monthly for first 3 months, then every 3 months',
        'precautions', jsonb_build_array('Monitor CNS symptoms', 'Regular lipid monitoring')
    ),
    ARRAY['NCCN Guidelines', 'FDA prescribing information']
);

-- Commit transaction
COMMIT;
