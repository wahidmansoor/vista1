-- Production-Ready Supabase Migration for Cancer Treatment Management System
-- Version: 2.0.0
-- Date: June 14, 2025

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enable Row Level Security (RLS) by default
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- ==================================================
-- CORE MEDICAL ENTITIES
-- ==================================================

-- Cancer Types and Classifications
CREATE TABLE cancer_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL, -- solid_tumor, hematologic, other
    icd_10_code TEXT,
    description TEXT,
    prevalence_data JSONB,
    risk_factors TEXT[],
    screening_guidelines JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Biomarkers and Genetic Markers
CREATE TABLE biomarkers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL, -- genomic, proteomic, metabolomic, imaging
    cancer_types UUID[] REFERENCES cancer_types(id),
    testing_methods TEXT[],
    clinical_significance TEXT,
    actionable BOOLEAN DEFAULT FALSE,
    fda_approved BOOLEAN DEFAULT FALSE,
    evidence_level TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Treatment Protocols
CREATE TABLE treatment_protocols (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    full_title TEXT NOT NULL,
    description TEXT NOT NULL,
    cancer_types UUID[] REFERENCES cancer_types(id),
    indications TEXT[],
    contraindications TEXT[],
    inclusion_criteria TEXT[],
    exclusion_criteria TEXT[],
    treatment_intent TEXT NOT NULL, -- curative, palliative, adjuvant, neoadjuvant
    line_of_therapy TEXT NOT NULL, -- first_line, second_line, third_line, salvage
    evidence_level TEXT NOT NULL, -- high, moderate, low
    nccn_category TEXT,
    fda_approved BOOLEAN DEFAULT FALSE,
    estimated_duration_weeks INTEGER,
    estimated_cycles INTEGER,
    response_rate_percent DECIMAL(5,2),
    survival_benefit_months DECIMAL(6,2),
    protocol_version TEXT NOT NULL,
    effective_date DATE NOT NULL,
    expiration_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Medications within protocols
CREATE TABLE protocol_medications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    protocol_id UUID REFERENCES treatment_protocols(id) ON DELETE CASCADE,
    medication_name TEXT NOT NULL,
    dose TEXT NOT NULL,
    route TEXT NOT NULL,
    frequency TEXT NOT NULL,
    classification TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT TRUE, -- primary vs supportive
    sequence_number INTEGER,
    special_instructions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Protocol biomarker requirements
CREATE TABLE protocol_biomarker_requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    protocol_id UUID REFERENCES treatment_protocols(id) ON DELETE CASCADE,
    biomarker_id UUID REFERENCES biomarkers(id),
    requirement_type TEXT NOT NULL, -- required_positive, required_negative, optional
    testing_method TEXT,
    threshold_value TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Common toxicities for protocols
CREATE TABLE protocol_toxicities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    protocol_id UUID REFERENCES treatment_protocols(id) ON DELETE CASCADE,
    toxicity_name TEXT NOT NULL,
    grade INTEGER CHECK (grade >= 1 AND grade <= 5),
    frequency_percent DECIMAL(5,2),
    management_strategy TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Monitoring requirements for protocols
CREATE TABLE protocol_monitoring (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    protocol_id UUID REFERENCES treatment_protocols(id) ON DELETE CASCADE,
    test_type TEXT NOT NULL,
    frequency TEXT NOT NULL,
    timing TEXT, -- baseline, weekly, cycle, etc.
    rationale TEXT,
    critical_values JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================
-- PATIENT MANAGEMENT
-- ==================================================

-- Patient profiles
CREATE TABLE patient_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    external_patient_id TEXT UNIQUE, -- For integration with EMR systems
    demographics JSONB NOT NULL,
    disease_status JSONB NOT NULL,
    performance_metrics JSONB NOT NULL,
    laboratory_values JSONB,
    imaging_results JSONB,
    genetic_profile JSONB,
    comorbidities JSONB,
    current_medications JSONB,
    preferences JSONB,
    enrolled_studies TEXT[],
    consent_status JSONB,
    privacy_settings JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Treatment history and outcomes
CREATE TABLE treatment_outcomes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patient_profiles(id) ON DELETE CASCADE,
    protocol_id UUID REFERENCES treatment_protocols(id),
    treatment_start_date DATE NOT NULL,
    treatment_end_date DATE,
    cycles_completed INTEGER DEFAULT 0,
    cycles_planned INTEGER,
    best_response TEXT,
    response_evaluation_dates DATE[],
    progression_free_survival_days INTEGER,
    overall_survival_days INTEGER,
    quality_of_life_scores JSONB,
    treatment_satisfaction INTEGER CHECK (treatment_satisfaction >= 1 AND treatment_satisfaction <= 10),
    would_recommend BOOLEAN,
    discontinuation_reason TEXT,
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    recorded_by TEXT NOT NULL
);

-- Patient toxicities
CREATE TABLE patient_toxicities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patient_profiles(id) ON DELETE CASCADE,
    treatment_outcome_id UUID REFERENCES treatment_outcomes(id),
    toxicity_name TEXT NOT NULL,
    grade INTEGER CHECK (grade >= 1 AND grade <= 5),
    onset_date DATE NOT NULL,
    resolution_date DATE,
    management_actions TEXT[],
    dose_modifications BOOLEAN DEFAULT FALSE,
    hospitalization_required BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Treatment recommendations and matching
CREATE TABLE treatment_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patient_profiles(id) ON DELETE CASCADE,
    protocol_id UUID REFERENCES treatment_protocols(id),
    match_score DECIMAL(4,3) CHECK (match_score >= 0 AND match_score <= 1),
    eligibility_status JSONB NOT NULL,
    contraindications TEXT[],
    required_modifications JSONB,
    clinical_rationale TEXT NOT NULL,
    estimated_benefit JSONB,
    priority_rank INTEGER,
    confidence_level DECIMAL(4,3),
    generated_by TEXT NOT NULL, -- system, physician, committee
    reviewed_by TEXT,
    status TEXT DEFAULT 'pending', -- pending, approved, rejected, implemented
    implementation_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================
-- CLINICAL DECISION SUPPORT
-- ==================================================

-- Clinical alerts and monitoring
CREATE TABLE monitoring_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_type TEXT NOT NULL, -- safety, efficacy, quality, operational
    severity TEXT NOT NULL, -- low, medium, high, critical
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    patient_affected UUID REFERENCES patient_profiles(id),
    protocol_affected UUID REFERENCES treatment_protocols(id),
    recommended_actions TEXT[],
    alert_data JSONB,
    acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_by TEXT,
    acknowledged_at TIMESTAMPTZ,
    resolved BOOLEAN DEFAULT FALSE,
    resolved_by TEXT,
    resolved_at TIMESTAMPTZ,
    resolution_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quality metrics and analytics
CREATE TABLE quality_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_type TEXT NOT NULL, -- protocol_adherence, data_quality, outcome_tracking
    measurement_period DATERANGE NOT NULL,
    protocol_id UUID REFERENCES treatment_protocols(id),
    patient_cohort_criteria JSONB,
    metric_value DECIMAL(10,4) NOT NULL,
    target_value DECIMAL(10,4),
    unit TEXT,
    calculation_method TEXT,
    data_sources TEXT[],
    quality_grade TEXT, -- A, B, C, D, F
    improvement_opportunities TEXT[],
    calculated_at TIMESTAMPTZ DEFAULT NOW(),
    calculated_by TEXT NOT NULL
);

-- Audit trail for clinical decisions
CREATE TABLE clinical_audit_trail (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type TEXT NOT NULL, -- patient, protocol, recommendation, alert
    entity_id UUID NOT NULL,
    action_type TEXT NOT NULL, -- create, update, delete, view, approve, reject
    actor_id TEXT NOT NULL,
    actor_role TEXT NOT NULL,
    session_id TEXT,
    ip_address INET,
    user_agent TEXT,
    changes_made JSONB,
    business_justification TEXT,
    compliance_flags JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================
-- ANALYTICS AND REPORTING
-- ==================================================

-- Population health analytics
CREATE TABLE population_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    analysis_period DATERANGE NOT NULL,
    cancer_type_id UUID REFERENCES cancer_types(id),
    patient_count INTEGER NOT NULL,
    demographic_breakdown JSONB NOT NULL,
    treatment_patterns JSONB NOT NULL,
    outcome_metrics JSONB NOT NULL,
    survival_statistics JSONB,
    quality_indicators JSONB,
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    generated_by TEXT NOT NULL
);

-- Biomarker correlation studies
CREATE TABLE biomarker_studies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    study_name TEXT NOT NULL,
    biomarker_id UUID REFERENCES biomarkers(id),
    cancer_type_id UUID REFERENCES cancer_types(id),
    study_population_criteria JSONB NOT NULL,
    sample_size INTEGER NOT NULL,
    correlation_coefficient DECIMAL(6,4),
    p_value DECIMAL(10,8),
    confidence_interval JSONB,
    clinical_interpretation TEXT,
    therapeutic_implications TEXT[],
    publication_reference TEXT,
    study_period DATERANGE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT NOT NULL
);

-- ==================================================
-- SYSTEM CONFIGURATION
-- ==================================================

-- System settings and configuration
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_category TEXT NOT NULL,
    setting_key TEXT NOT NULL,
    setting_value JSONB NOT NULL,
    data_type TEXT NOT NULL, -- string, number, boolean, object, array
    description TEXT,
    is_encrypted BOOLEAN DEFAULT FALSE,
    requires_restart BOOLEAN DEFAULT FALSE,
    last_modified_by TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(setting_category, setting_key)
);

-- Feature flags for progressive deployment
CREATE TABLE feature_flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flag_name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    is_enabled BOOLEAN DEFAULT FALSE,
    rollout_percentage INTEGER DEFAULT 0 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
    target_users JSONB, -- user criteria for targeted rollout
    environment TEXT DEFAULT 'production',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT NOT NULL
);

-- ==================================================
-- INDEXES FOR PERFORMANCE
-- ==================================================

-- Core entity indexes
CREATE INDEX idx_cancer_types_category ON cancer_types(category);
CREATE INDEX idx_biomarkers_type ON biomarkers(type);
CREATE INDEX idx_treatment_protocols_active ON treatment_protocols(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_treatment_protocols_cancer_types ON treatment_protocols USING GIN(cancer_types);
CREATE INDEX idx_treatment_protocols_line_therapy ON treatment_protocols(line_of_therapy);

-- Patient data indexes
CREATE INDEX idx_patient_profiles_external_id ON patient_profiles(external_patient_id);
CREATE INDEX idx_patient_profiles_updated ON patient_profiles(updated_at);
CREATE INDEX idx_treatment_outcomes_patient ON treatment_outcomes(patient_id);
CREATE INDEX idx_treatment_outcomes_protocol ON treatment_outcomes(protocol_id);
CREATE INDEX idx_treatment_outcomes_dates ON treatment_outcomes(treatment_start_date, treatment_end_date);

-- Clinical decision support indexes
CREATE INDEX idx_monitoring_alerts_severity ON monitoring_alerts(severity, created_at);
CREATE INDEX idx_monitoring_alerts_patient ON monitoring_alerts(patient_affected);
CREATE INDEX idx_monitoring_alerts_unresolved ON monitoring_alerts(resolved, acknowledged) WHERE resolved = FALSE;
CREATE INDEX idx_treatment_recommendations_patient ON treatment_recommendations(patient_id);
CREATE INDEX idx_treatment_recommendations_status ON treatment_recommendations(status, created_at);

-- Analytics indexes
CREATE INDEX idx_quality_metrics_period ON quality_metrics(measurement_period);
CREATE INDEX idx_quality_metrics_protocol ON quality_metrics(protocol_id);
CREATE INDEX idx_population_analytics_period ON population_analytics(analysis_period);
CREATE INDEX idx_clinical_audit_trail_entity ON clinical_audit_trail(entity_type, entity_id);
CREATE INDEX idx_clinical_audit_trail_actor ON clinical_audit_trail(actor_id, created_at);

-- GIN indexes for JSONB columns
CREATE INDEX idx_patient_profiles_demographics ON patient_profiles USING GIN(demographics);
CREATE INDEX idx_patient_profiles_disease_status ON patient_profiles USING GIN(disease_status);
CREATE INDEX idx_patient_profiles_genetic_profile ON patient_profiles USING GIN(genetic_profile);
CREATE INDEX idx_treatment_outcomes_qol_scores ON treatment_outcomes USING GIN(quality_of_life_scores);

-- ==================================================
-- ROW LEVEL SECURITY (RLS)
-- ==================================================

-- Enable RLS on all patient-related tables
ALTER TABLE patient_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_toxicities ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitoring_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical_audit_trail ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (to be customized based on your authentication system)
CREATE POLICY "Healthcare providers can access patient data" ON patient_profiles
    FOR ALL TO authenticated
    USING (auth.jwt() ->> 'role' IN ('physician', 'nurse', 'admin'));

CREATE POLICY "Patients can access their own data" ON patient_profiles
    FOR SELECT TO authenticated
    USING (auth.jwt() ->> 'patient_id' = external_patient_id);

-- ==================================================
-- FUNCTIONS AND TRIGGERS
-- ==================================================

-- Function to automatically update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_cancer_types_updated_at 
    BEFORE UPDATE ON cancer_types 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_biomarkers_updated_at 
    BEFORE UPDATE ON biomarkers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_treatment_protocols_updated_at 
    BEFORE UPDATE ON treatment_protocols 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patient_profiles_updated_at 
    BEFORE UPDATE ON patient_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_treatment_recommendations_updated_at 
    BEFORE UPDATE ON treatment_recommendations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at 
    BEFORE UPDATE ON system_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feature_flags_updated_at 
    BEFORE UPDATE ON feature_flags 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function for audit logging
CREATE OR REPLACE FUNCTION log_clinical_action()
RETURNS TRIGGER AS $$
DECLARE
    table_name TEXT := TG_TABLE_NAME;
    action_type TEXT := TG_OP;
    entity_id UUID;
    changes JSONB := '{}';
BEGIN
    -- Determine entity ID based on table
    IF table_name IN ('patient_profiles') THEN
        entity_id := COALESCE(NEW.id, OLD.id);
    ELSIF table_name IN ('treatment_outcomes', 'patient_toxicities') THEN
        entity_id := COALESCE(NEW.patient_id, OLD.patient_id);
    ELSIF table_name IN ('treatment_protocols') THEN
        entity_id := COALESCE(NEW.id, OLD.id);
    END IF;

    -- Build changes JSON for UPDATE operations
    IF TG_OP = 'UPDATE' THEN
        changes := jsonb_build_object(
            'old_values', to_jsonb(OLD),
            'new_values', to_jsonb(NEW)
        );
    ELSIF TG_OP = 'INSERT' THEN
        changes := jsonb_build_object('new_values', to_jsonb(NEW));
    ELSIF TG_OP = 'DELETE' THEN
        changes := jsonb_build_object('deleted_values', to_jsonb(OLD));
    END IF;

    -- Insert audit record
    INSERT INTO clinical_audit_trail (
        entity_type,
        entity_id,
        action_type,
        actor_id,
        actor_role,
        changes_made
    ) VALUES (
        table_name,
        entity_id,
        LOWER(action_type),
        COALESCE(current_setting('app.current_user_id', true), 'system'),
        COALESCE(current_setting('app.current_user_role', true), 'system'),
        changes
    );

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit triggers to critical tables
CREATE TRIGGER audit_patient_profiles
    AFTER INSERT OR UPDATE OR DELETE ON patient_profiles
    FOR EACH ROW EXECUTE FUNCTION log_clinical_action();

CREATE TRIGGER audit_treatment_outcomes
    AFTER INSERT OR UPDATE OR DELETE ON treatment_outcomes
    FOR EACH ROW EXECUTE FUNCTION log_clinical_action();

CREATE TRIGGER audit_treatment_recommendations
    AFTER INSERT OR UPDATE OR DELETE ON treatment_recommendations
    FOR EACH ROW EXECUTE FUNCTION log_clinical_action();

-- ==================================================
-- MATERIALIZED VIEWS FOR ANALYTICS
-- ==================================================

-- Real-time dashboard metrics
CREATE MATERIALIZED VIEW dashboard_metrics AS
SELECT 
    COUNT(DISTINCT pp.id) as total_patients,
    COUNT(DISTINCT CASE WHEN pp.created_at >= CURRENT_DATE - INTERVAL '30 days' THEN pp.id END) as new_patients_month,
    COUNT(DISTINCT CASE WHEN toc.treatment_end_date IS NULL THEN toc.patient_id END) as active_treatments,
    COUNT(DISTINCT CASE WHEN ma.severity = 'critical' AND ma.resolved = FALSE THEN ma.id END) as critical_alerts,
    COUNT(DISTINCT CASE WHEN ma.severity = 'high' AND ma.resolved = FALSE THEN ma.id END) as high_alerts,
    AVG(tr.match_score) as avg_match_score,
    COUNT(DISTINCT tr.id) as total_recommendations
FROM patient_profiles pp
LEFT JOIN treatment_outcomes toc ON pp.id = toc.patient_id
LEFT JOIN monitoring_alerts ma ON pp.id = ma.patient_affected
LEFT JOIN treatment_recommendations tr ON pp.id = tr.patient_id
WHERE pp.created_at >= CURRENT_DATE - INTERVAL '1 year';

-- Treatment effectiveness summary
CREATE MATERIALIZED VIEW treatment_effectiveness AS
SELECT 
    tp.id as protocol_id,
    tp.name as protocol_name,
    tp.cancer_types,
    COUNT(DISTINCT toc.patient_id) as patient_count,
    AVG(toc.cycles_completed::DECIMAL / toc.cycles_planned) as completion_rate,
    COUNT(CASE WHEN toc.best_response IN ('Complete Response', 'Partial Response') THEN 1 END)::DECIMAL / COUNT(*) as response_rate,
    AVG(toc.progression_free_survival_days) as avg_pfs_days,
    AVG(toc.overall_survival_days) as avg_os_days,
    AVG(toc.treatment_satisfaction) as avg_satisfaction
FROM treatment_protocols tp
LEFT JOIN treatment_outcomes toc ON tp.id = toc.protocol_id
WHERE tp.is_active = TRUE
GROUP BY tp.id, tp.name, tp.cancer_types
HAVING COUNT(DISTINCT toc.patient_id) >= 10;

-- Create indexes on materialized views
CREATE INDEX idx_dashboard_metrics_refresh ON dashboard_metrics(1);
CREATE INDEX idx_treatment_effectiveness_protocol ON treatment_effectiveness(protocol_id);

-- Function to refresh materialized views
CREATE OR REPLACE FUNCTION refresh_analytics_views()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY dashboard_metrics;
    REFRESH MATERIALIZED VIEW CONCURRENTLY treatment_effectiveness;
END;
$$ LANGUAGE plpgsql;

-- ==================================================
-- COMMENTS FOR DOCUMENTATION
-- ==================================================

COMMENT ON TABLE cancer_types IS 'Master catalog of cancer types with classification and clinical data';
COMMENT ON TABLE biomarkers IS 'Biomarkers and genetic markers relevant for cancer treatment';
COMMENT ON TABLE treatment_protocols IS 'Evidence-based treatment protocols with comprehensive clinical data';
COMMENT ON TABLE patient_profiles IS 'Comprehensive patient clinical profiles with privacy protection';
COMMENT ON TABLE treatment_outcomes IS 'Real-world treatment outcomes and effectiveness data';
COMMENT ON TABLE monitoring_alerts IS 'Clinical decision support alerts and safety monitoring';
COMMENT ON TABLE quality_metrics IS 'Quality assurance and performance metrics';
COMMENT ON TABLE clinical_audit_trail IS 'Complete audit trail for regulatory compliance';

-- ==================================================
-- INITIAL SYSTEM CONFIGURATION
-- ==================================================

-- Insert default system settings
INSERT INTO system_settings (setting_category, setting_key, setting_value, data_type, description, last_modified_by) VALUES
('security', 'session_timeout_minutes', '120', 'number', 'User session timeout in minutes', 'system'),
('security', 'max_login_attempts', '5', 'number', 'Maximum failed login attempts before lockout', 'system'),
('clinical', 'alert_escalation_hours', '24', 'number', 'Hours before unacknowledged critical alerts are escalated', 'system'),
('clinical', 'protocol_review_days', '30', 'number', 'Days between mandatory protocol effectiveness reviews', 'system'),
('analytics', 'data_retention_years', '7', 'number', 'Years to retain clinical data for analytics', 'system'),
('integration', 'emr_sync_enabled', 'false', 'boolean', 'Enable automatic EMR synchronization', 'system'),
('compliance', 'audit_log_retention_years', '10', 'number', 'Years to retain audit logs for compliance', 'system');

-- Insert default feature flags
INSERT INTO feature_flags (flag_name, description, is_enabled, rollout_percentage, environment, created_by) VALUES
('advanced_analytics', 'Enable advanced analytics dashboard', true, 100, 'production', 'system'),
('real_time_monitoring', 'Enable real-time patient monitoring', true, 100, 'production', 'system'),
('ai_recommendations', 'Enable AI-powered treatment recommendations', false, 0, 'production', 'system'),
('biomarker_integration', 'Enable biomarker-based protocol matching', true, 100, 'production', 'system'),
('multi_site_support', 'Enable multi-site clinical operations', false, 0, 'production', 'system');

COMMIT;
