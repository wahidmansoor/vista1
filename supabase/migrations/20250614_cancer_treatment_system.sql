-- Advanced Cancer Treatment Management System Database Schema
-- Production-ready Supabase migration with comprehensive clinical support
-- Created: 2025-06-14

BEGIN;

-- Create custom types and enums
DO $$ BEGIN
    CREATE TYPE cancer_category_enum AS ENUM ('solid_tumor', 'hematologic', 'rare_cancer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE evidence_level_enum AS ENUM ('A', 'B', 'C', 'D');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE treatment_line_enum AS ENUM ('first', 'second', 'third', 'salvage');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE response_type_enum AS ENUM ('complete_response', 'partial_response', 'stable_disease', 'progressive_disease');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE eligibility_status_enum AS ENUM ('eligible', 'partially_eligible', 'ineligible', 'contraindicated');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE triage_level_enum AS ENUM ('immediate', 'urgent', 'routine');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE biomarker_status_enum AS ENUM ('positive', 'negative', 'unknown', 'pending');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE organ_function_status_enum AS ENUM ('adequate', 'borderline', 'inadequate', 'unknown');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE toxicity_grade_enum AS ENUM ('1', '2', '3', '4', '5');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE disease_extent_enum AS ENUM ('localized', 'regional', 'distant');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE treatment_intent_enum AS ENUM ('curative', 'palliative', 'adjuvant', 'neoadjuvant');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Cancer types and classification
CREATE TABLE IF NOT EXISTS cancer_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    icd10_code VARCHAR(10) UNIQUE,
    category cancer_category_enum NOT NULL,
    common_stages JSONB DEFAULT '[]'::jsonb,
    biomarkers JSONB DEFAULT '[]'::jsonb,
    treatment_protocols TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Biomarkers registry
CREATE TABLE IF NOT EXISTS biomarkers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    clinical_significance TEXT,
    target_therapies TEXT[] DEFAULT ARRAY[]::TEXT[],
    testing_method VARCHAR(255),
    reference_ranges JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Drugs and medications
CREATE TABLE IF NOT EXISTS drugs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255),
    drug_class VARCHAR(100),
    mechanism_of_action TEXT,
    dosing_instructions JSONB DEFAULT '{}'::jsonb,
    side_effects JSONB DEFAULT '[]'::jsonb,
    contraindications TEXT[] DEFAULT ARRAY[]::TEXT[],
    drug_interactions JSONB DEFAULT '[]'::jsonb,
    monitoring_parameters TEXT[] DEFAULT ARRAY[]::TEXT[],
    cost_per_cycle DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Treatment protocols repository
CREATE TABLE IF NOT EXISTS treatment_protocols (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    protocol_code VARCHAR(50) UNIQUE NOT NULL,
    cancer_type_ids UUID[] DEFAULT ARRAY[]::UUID[],
    treatment_lines treatment_line_enum[] DEFAULT ARRAY[]::treatment_line_enum[],
    evidence_level evidence_level_enum NOT NULL,
    eligibility_criteria JSONB NOT NULL DEFAULT '{}'::jsonb,
    treatment_schedule JSONB NOT NULL DEFAULT '{}'::jsonb,
    monitoring_plan JSONB DEFAULT '[]'::jsonb,
    expected_outcomes JSONB DEFAULT '{}'::jsonb,
    contraindications TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    clinical_trial BOOLEAN DEFAULT FALSE,
    cost_effectiveness_ratio DECIMAL(10,2),
    quality_of_life_impact TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Protocol drug associations
CREATE TABLE IF NOT EXISTS protocol_drugs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    protocol_id UUID REFERENCES treatment_protocols(id) ON DELETE CASCADE,
    drug_id UUID REFERENCES drugs(id) ON DELETE CASCADE,
    dosing_schedule JSONB NOT NULL DEFAULT '{}'::jsonb,
    administration_days INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    special_instructions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(protocol_id, drug_id)
);

-- Patient profiles
CREATE TABLE IF NOT EXISTS patient_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    demographics JSONB NOT NULL DEFAULT '{}'::jsonb,
    disease_status JSONB NOT NULL DEFAULT '{}'::jsonb,
    performance_metrics JSONB DEFAULT '{}'::jsonb,
    laboratory_values JSONB DEFAULT '{}'::jsonb,
    genetic_profile JSONB DEFAULT '{}'::jsonb,
    comorbidities JSONB DEFAULT '[]'::jsonb,
    current_medications JSONB DEFAULT '[]'::jsonb,
    allergies JSONB DEFAULT '[]'::jsonb,
    social_history JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Treatment history
CREATE TABLE IF NOT EXISTS treatment_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patient_profiles(id) ON DELETE CASCADE,
    protocol_id UUID REFERENCES treatment_protocols(id),
    line_of_therapy treatment_line_enum NOT NULL,
    treatment_intent treatment_intent_enum DEFAULT 'curative',
    start_date DATE NOT NULL,
    end_date DATE,
    response response_type_enum,
    best_response response_type_enum,
    progression_free_survival_days INTEGER,
    toxicities JSONB DEFAULT '[]'::jsonb,
    dose_modifications JSONB DEFAULT '[]'::jsonb,
    discontinuation_reason TEXT,
    treating_physician VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Treatment recommendations
CREATE TABLE IF NOT EXISTS treatment_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patient_profiles(id) ON DELETE CASCADE,
    protocol_id UUID REFERENCES treatment_protocols(id),
    match_score DECIMAL(3,2) NOT NULL CHECK (match_score >= 0 AND match_score <= 1),
    eligibility_status eligibility_status_enum NOT NULL,
    recommendation_confidence VARCHAR(20) CHECK (recommendation_confidence IN ('high', 'medium', 'low')),
    evidence_level evidence_level_enum,
    recommended_modifications JSONB DEFAULT '[]'::jsonb,
    contraindications TEXT[] DEFAULT ARRAY[]::TEXT[],
    monitoring_recommendations TEXT[] DEFAULT ARRAY[]::TEXT[],
    alternative_options JSONB DEFAULT '[]'::jsonb,
    rationale TEXT,
    generated_by VARCHAR(255),
    review_status VARCHAR(20) DEFAULT 'pending' CHECK (review_status IN ('pending', 'reviewed', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Treatment outcomes tracking
CREATE TABLE IF NOT EXISTS treatment_outcomes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patient_profiles(id) ON DELETE CASCADE,
    protocol_id UUID REFERENCES treatment_protocols(id),
    treatment_start_date DATE NOT NULL,
    response_assessment_date DATE NOT NULL,
    response_type response_type_enum NOT NULL,
    progression_free_survival_days INTEGER,
    overall_survival_days INTEGER,
    toxicity_grade toxicity_grade_enum,
    quality_of_life_score DECIMAL(3,1) CHECK (quality_of_life_score >= 0 AND quality_of_life_score <= 10),
    discontinuation_reason TEXT,
    patient_satisfaction DECIMAL(3,1) CHECK (patient_satisfaction >= 0 AND patient_satisfaction <= 10),
    cost_of_treatment DECIMAL(12,2),
    hospitalization_days INTEGER DEFAULT 0,
    recorded_by VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Biomarker test results
CREATE TABLE IF NOT EXISTS biomarker_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patient_profiles(id) ON DELETE CASCADE,
    biomarker_id UUID REFERENCES biomarkers(id),
    test_date DATE NOT NULL,
    status biomarker_status_enum NOT NULL,
    value DECIMAL(10,4),
    unit VARCHAR(50),
    test_method VARCHAR(255),
    laboratory VARCHAR(255),
    clinical_significance TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Imaging results
CREATE TABLE IF NOT EXISTS imaging_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patient_profiles(id) ON DELETE CASCADE,
    study_type VARCHAR(100) NOT NULL,
    study_date DATE NOT NULL,
    findings TEXT,
    response_assessment response_type_enum,
    target_lesions JSONB DEFAULT '[]'::jsonb,
    non_target_lesions JSONB DEFAULT '[]'::jsonb,
    new_lesions BOOLEAN DEFAULT FALSE,
    radiologist VARCHAR(255),
    comparison_study UUID REFERENCES imaging_results(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Protocol effectiveness metrics (aggregated analytics)
CREATE TABLE IF NOT EXISTS protocol_effectiveness_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    protocol_id UUID REFERENCES treatment_protocols(id) ON DELETE CASCADE,
    total_patients INTEGER DEFAULT 0,
    response_rates JSONB DEFAULT '{}'::jsonb,
    median_progression_free_survival DECIMAL(5,1),
    median_overall_survival DECIMAL(5,1),
    common_toxicities JSONB DEFAULT '[]'::jsonb,
    patient_satisfaction_average DECIMAL(3,1),
    cost_effectiveness_ratio DECIMAL(10,2),
    quality_adjusted_life_years DECIMAL(5,2),
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Real-time monitoring alerts
CREATE TABLE IF NOT EXISTS monitoring_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patient_profiles(id) ON DELETE CASCADE,
    protocol_id UUID REFERENCES treatment_protocols(id),
    alert_type VARCHAR(100) NOT NULL,
    severity triage_level_enum NOT NULL,
    message TEXT NOT NULL,
    monitoring_parameter VARCHAR(255),
    current_value VARCHAR(100),
    threshold_value VARCHAR(100),
    action_required TEXT,
    acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_by VARCHAR(255),
    acknowledged_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clinical decision support rules
CREATE TABLE IF NOT EXISTS decision_support_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_name VARCHAR(255) NOT NULL,
    rule_type VARCHAR(50) NOT NULL,
    condition_criteria JSONB NOT NULL,
    action_recommendation JSONB NOT NULL,
    evidence_level evidence_level_enum NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_by VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit trail for clinical decisions
CREATE TABLE IF NOT EXISTS clinical_audit_trail (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patient_profiles(id) ON DELETE CASCADE,
    action_type VARCHAR(100) NOT NULL,
    action_details JSONB NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    user_role VARCHAR(100),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- Create indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_cancer_types_category ON cancer_types(category);
CREATE INDEX IF NOT EXISTS idx_cancer_types_icd10 ON cancer_types(icd10_code);

CREATE INDEX IF NOT EXISTS idx_treatment_protocols_active ON treatment_protocols(is_active);
CREATE INDEX IF NOT EXISTS idx_treatment_protocols_cancer_types ON treatment_protocols USING GIN(cancer_type_ids);
CREATE INDEX IF NOT EXISTS idx_treatment_protocols_evidence ON treatment_protocols(evidence_level);

CREATE INDEX IF NOT EXISTS idx_patient_profiles_created ON patient_profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_patient_profiles_updated ON patient_profiles(updated_at);

CREATE INDEX IF NOT EXISTS idx_treatment_history_patient ON treatment_history(patient_id);
CREATE INDEX IF NOT EXISTS idx_treatment_history_protocol ON treatment_history(protocol_id);
CREATE INDEX IF NOT EXISTS idx_treatment_history_dates ON treatment_history(start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_treatment_recommendations_patient ON treatment_recommendations(patient_id);
CREATE INDEX IF NOT EXISTS idx_treatment_recommendations_score ON treatment_recommendations(match_score DESC);
CREATE INDEX IF NOT EXISTS idx_treatment_recommendations_status ON treatment_recommendations(review_status);

CREATE INDEX IF NOT EXISTS idx_treatment_outcomes_patient ON treatment_outcomes(patient_id);
CREATE INDEX IF NOT EXISTS idx_treatment_outcomes_protocol ON treatment_outcomes(protocol_id);
CREATE INDEX IF NOT EXISTS idx_treatment_outcomes_response ON treatment_outcomes(response_type);

CREATE INDEX IF NOT EXISTS idx_biomarker_results_patient ON biomarker_results(patient_id);
CREATE INDEX IF NOT EXISTS idx_biomarker_results_biomarker ON biomarker_results(biomarker_id);
CREATE INDEX IF NOT EXISTS idx_biomarker_results_date ON biomarker_results(test_date);

CREATE INDEX IF NOT EXISTS idx_imaging_results_patient ON imaging_results(patient_id);
CREATE INDEX IF NOT EXISTS idx_imaging_results_date ON imaging_results(study_date);

CREATE INDEX IF NOT EXISTS idx_monitoring_alerts_patient ON monitoring_alerts(patient_id);
CREATE INDEX IF NOT EXISTS idx_monitoring_alerts_unacknowledged ON monitoring_alerts(acknowledged) WHERE acknowledged = FALSE;

CREATE INDEX IF NOT EXISTS idx_clinical_audit_patient ON clinical_audit_trail(patient_id);
CREATE INDEX IF NOT EXISTS idx_clinical_audit_timestamp ON clinical_audit_trail(timestamp);

-- Row Level Security (RLS) policies
ALTER TABLE cancer_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE biomarkers ENABLE ROW LEVEL SECURITY;
ALTER TABLE drugs ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE biomarker_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE imaging_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitoring_alerts ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (these should be customized based on your authentication system)
CREATE POLICY "Public read access to cancer types" ON cancer_types FOR SELECT USING (true);
CREATE POLICY "Public read access to biomarkers" ON biomarkers FOR SELECT USING (true);
CREATE POLICY "Public read access to drugs" ON drugs FOR SELECT USING (true);
CREATE POLICY "Public read access to treatment protocols" ON treatment_protocols FOR SELECT USING (is_active = true);

-- Patient data access policies (restrict to authenticated users with appropriate roles)
CREATE POLICY "Authenticated read access to patient profiles" ON patient_profiles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write access to patient profiles" ON patient_profiles FOR ALL USING (auth.role() = 'authenticated');

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_cancer_types_updated_at BEFORE UPDATE ON cancer_types 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_biomarkers_updated_at BEFORE UPDATE ON biomarkers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_drugs_updated_at BEFORE UPDATE ON drugs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_treatment_protocols_updated_at BEFORE UPDATE ON treatment_protocols 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_patient_profiles_updated_at BEFORE UPDATE ON patient_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_treatment_history_updated_at BEFORE UPDATE ON treatment_history 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_treatment_recommendations_updated_at BEFORE UPDATE ON treatment_recommendations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate protocol effectiveness metrics
CREATE OR REPLACE FUNCTION calculate_protocol_effectiveness(protocol_uuid UUID)
RETURNS VOID AS $$
DECLARE
    total_patients_count INTEGER;
    response_data JSONB;
    median_pfs DECIMAL;
    median_os DECIMAL;
    avg_satisfaction DECIMAL;
BEGIN
    -- Calculate total patients
    SELECT COUNT(DISTINCT patient_id) INTO total_patients_count
    FROM treatment_outcomes 
    WHERE protocol_id = protocol_uuid;
    
    -- Calculate response rates
    SELECT jsonb_build_object(
        'complete_response', 
        COALESCE((SELECT COUNT(*) FROM treatment_outcomes WHERE protocol_id = protocol_uuid AND response_type = 'complete_response'), 0),
        'partial_response',
        COALESCE((SELECT COUNT(*) FROM treatment_outcomes WHERE protocol_id = protocol_uuid AND response_type = 'partial_response'), 0),
        'stable_disease',
        COALESCE((SELECT COUNT(*) FROM treatment_outcomes WHERE protocol_id = protocol_uuid AND response_type = 'stable_disease'), 0),
        'progressive_disease',
        COALESCE((SELECT COUNT(*) FROM treatment_outcomes WHERE protocol_id = protocol_uuid AND response_type = 'progressive_disease'), 0)
    ) INTO response_data;
    
    -- Calculate median PFS
    SELECT PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY progression_free_survival_days) INTO median_pfs
    FROM treatment_outcomes 
    WHERE protocol_id = protocol_uuid AND progression_free_survival_days IS NOT NULL;
    
    -- Calculate median OS
    SELECT PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY overall_survival_days) INTO median_os
    FROM treatment_outcomes 
    WHERE protocol_id = protocol_uuid AND overall_survival_days IS NOT NULL;
    
    -- Calculate average patient satisfaction
    SELECT AVG(patient_satisfaction) INTO avg_satisfaction
    FROM treatment_outcomes 
    WHERE protocol_id = protocol_uuid AND patient_satisfaction IS NOT NULL;
    
    -- Insert or update metrics
    INSERT INTO protocol_effectiveness_metrics (
        protocol_id, 
        total_patients, 
        response_rates, 
        median_progression_free_survival,
        median_overall_survival,
        patient_satisfaction_average,
        last_updated
    ) VALUES (
        protocol_uuid,
        total_patients_count,
        response_data,
        median_pfs,
        median_os,
        avg_satisfaction,
        NOW()
    )
    ON CONFLICT (protocol_id) 
    DO UPDATE SET
        total_patients = EXCLUDED.total_patients,
        response_rates = EXCLUDED.response_rates,
        median_progression_free_survival = EXCLUDED.median_progression_free_survival,
        median_overall_survival = EXCLUDED.median_overall_survival,
        patient_satisfaction_average = EXCLUDED.patient_satisfaction_average,
        last_updated = NOW();
END;
$$ LANGUAGE plpgsql;

-- Trigger to update effectiveness metrics when outcomes are inserted/updated
CREATE OR REPLACE FUNCTION trigger_update_effectiveness_metrics()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM calculate_protocol_effectiveness(NEW.protocol_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_effectiveness_on_outcome_change
    AFTER INSERT OR UPDATE ON treatment_outcomes
    FOR EACH ROW EXECUTE FUNCTION trigger_update_effectiveness_metrics();

-- Audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (action, table_name, record_id, new_values)
        VALUES ('INSERT', TG_TABLE_NAME, NEW.id, to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (action, table_name, record_id, old_values, new_values)
        VALUES ('UPDATE', TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (action, table_name, record_id, old_values)
        VALUES ('DELETE', TG_TABLE_NAME, OLD.id, to_jsonb(OLD));
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers to sensitive tables
CREATE TRIGGER audit_patient_profiles
    AFTER INSERT OR UPDATE OR DELETE ON patient_profiles
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_treatment_recommendations
    AFTER INSERT OR UPDATE OR DELETE ON treatment_recommendations
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_treatment_outcomes
    AFTER INSERT OR UPDATE OR DELETE ON treatment_outcomes
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Row Level Security (RLS) policies
ALTER TABLE patient_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_outcomes ENABLE ROW LEVEL SECURITY;

-- Basic RLS policy (customize based on your authentication system)
CREATE POLICY "Users can view their own patient data" ON patient_profiles
    FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view their own treatment history" ON treatment_history
    FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view their own recommendations" ON treatment_recommendations
    FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view their own outcomes" ON treatment_outcomes
    FOR ALL USING (auth.uid() IS NOT NULL);

-- Public read access for reference tables
CREATE POLICY "Public read access to cancer types" ON cancer_types
    FOR SELECT USING (true);

CREATE POLICY "Public read access to treatment protocols" ON treatment_protocols
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public read access to biomarkers" ON biomarkers
    FOR SELECT USING (true);

CREATE POLICY "Public read access to drug interactions" ON drug_interactions
    FOR SELECT USING (true);

-- Performance monitoring view
CREATE OR REPLACE VIEW protocol_performance_summary AS
SELECT 
    tp.id,
    tp.name,
    tp.protocol_code,
    tp.evidence_level,
    pem.total_patients,
    pem.response_rates,
    pem.median_progression_free_survival,
    pem.median_overall_survival,
    pem.patient_satisfaction_average,
    pem.last_updated
FROM treatment_protocols tp
LEFT JOIN protocol_effectiveness_metrics pem ON tp.id = pem.protocol_id
WHERE tp.is_active = true
ORDER BY pem.total_patients DESC NULLS LAST;

-- Patient summary view
CREATE OR REPLACE VIEW patient_summary AS
SELECT 
    pp.id,
    pp.demographics->>'age' as age,
    pp.demographics->>'sex' as sex,
    pp.disease_status->>'cancer_type_id' as cancer_type_id,
    pp.disease_status->>'stage' as stage,
    pp.performance_metrics->>'ecog_score' as ecog_score,
    COUNT(th.id) as treatment_count,
    MAX(th.start_date) as last_treatment_date,
    pp.updated_at
FROM patient_profiles pp
LEFT JOIN treatment_history th ON pp.id = th.patient_id
GROUP BY pp.id, pp.demographics, pp.disease_status, pp.performance_metrics, pp.updated_at;

COMMIT;
