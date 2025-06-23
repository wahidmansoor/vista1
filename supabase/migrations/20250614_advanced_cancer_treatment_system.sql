-- Advanced Cancer Treatment Management System Database Schema
-- Supabase migration for comprehensive treatment management

-- Create custom types for consistency
CREATE TYPE cancer_category AS ENUM ('solid_tumor', 'hematologic', 'rare_cancer');
CREATE TYPE evidence_level AS ENUM ('A', 'B', 'C', 'D');
CREATE TYPE treatment_line AS ENUM ('first', 'second', 'third', 'salvage', 'maintenance');
CREATE TYPE treatment_intent AS ENUM ('curative', 'adjuvant', 'neoadjuvant', 'palliative');
CREATE TYPE response_type AS ENUM ('complete_response', 'partial_response', 'stable_disease', 'progressive_disease', 'not_evaluable');
CREATE TYPE eligibility_status AS ENUM ('eligible', 'partially_eligible', 'ineligible', 'contraindicated');
CREATE TYPE biomarker_status AS ENUM ('positive', 'negative', 'unknown', 'pending');
CREATE TYPE drug_class AS ENUM ('alkylating_agent', 'antimetabolite', 'topoisomerase_inhibitor', 'antimicrotubule', 'targeted_therapy', 'immunotherapy', 'hormone_therapy', 'supportive_care');
CREATE TYPE administration_route AS ENUM ('IV_push', 'IV_infusion', 'oral', 'subcutaneous', 'intrathecal', 'topical');

-- Core cancer types and classification
CREATE TABLE cancer_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  icd10_code VARCHAR(10) UNIQUE,
  category cancer_category NOT NULL,
  common_stages JSONB DEFAULT '[]',
  biomarker_list TEXT[] DEFAULT '{}',
  treatment_protocol_ids TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT cancer_types_name_unique UNIQUE(name),
  CONSTRAINT cancer_types_icd10_valid CHECK(icd10_code ~ '^[A-Z][0-9]{2}(\.[0-9]{1,2})?$')
);

-- Biomarkers repository
CREATE TABLE biomarkers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  gene VARCHAR(100),
  type VARCHAR(50) NOT NULL,
  clinical_significance VARCHAR(50) NOT NULL,
  actionable BOOLEAN DEFAULT false,
  targeted_therapies JSONB DEFAULT '[]',
  frequency_by_cancer JSONB DEFAULT '{}',
  testing_method VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT biomarkers_name_unique UNIQUE(name),
  CONSTRAINT biomarkers_type_valid CHECK(type IN ('mutation', 'expression', 'fusion', 'amplification', 'deletion')),
  CONSTRAINT biomarkers_significance_valid CHECK(clinical_significance IN ('diagnostic', 'prognostic', 'predictive', 'therapeutic'))
);

-- Treatment protocols repository
CREATE TABLE treatment_protocols (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  protocol_code VARCHAR(50) UNIQUE NOT NULL,
  cancer_type_ids TEXT[] NOT NULL,
  line_of_therapy treatment_line NOT NULL,
  treatment_intent treatment_intent NOT NULL,
  eligibility_criteria JSONB NOT NULL DEFAULT '{}',
  treatment_schedule JSONB NOT NULL DEFAULT '{}',
  drugs JSONB NOT NULL DEFAULT '[]',
  contraindications JSONB DEFAULT '[]',
  monitoring_requirements JSONB DEFAULT '[]',
  expected_outcomes JSONB DEFAULT '{}',
  evidence_level evidence_level NOT NULL,
  guideline_source VARCHAR(255),
  version VARCHAR(20) DEFAULT '1.0',
  is_active BOOLEAN DEFAULT true,
  clinical_trial_eligible BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT treatment_protocols_code_unique UNIQUE(protocol_code),
  CONSTRAINT treatment_protocols_name_unique UNIQUE(name),
  CONSTRAINT treatment_protocols_cancer_types_not_empty CHECK(array_length(cancer_type_ids, 1) > 0)
);

-- Patient profiles
CREATE TABLE patient_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  demographics JSONB NOT NULL DEFAULT '{}',
  disease_status JSONB NOT NULL DEFAULT '{}',
  performance_metrics JSONB DEFAULT '{}',
  treatment_history JSONB DEFAULT '[]',
  laboratory_values JSONB DEFAULT '{}',
  imaging_results JSONB DEFAULT '[]',
  genetic_profile JSONB DEFAULT '{}',
  comorbidities JSONB DEFAULT '[]',
  current_medications JSONB DEFAULT '[]',
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Add constraints for required demographic fields
  CONSTRAINT patient_demographics_required CHECK(
    demographics ? 'age' AND 
    demographics ? 'sex' AND
    (demographics->>'age')::int > 0 AND 
    (demographics->>'age')::int < 150
  ),
  
  -- Add constraints for disease status
  CONSTRAINT patient_disease_status_required CHECK(
    disease_status ? 'primary_cancer_type' AND 
    disease_status ? 'stage'
  )
);

-- Treatment recommendations
CREATE TABLE treatment_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patient_profiles(id) ON DELETE CASCADE,
  protocol_id UUID REFERENCES treatment_protocols(id) ON DELETE CASCADE,
  match_score DECIMAL(3,2) NOT NULL CHECK(match_score >= 0 AND match_score <= 1),
  eligibility_status eligibility_status NOT NULL,
  contraindications TEXT[] DEFAULT '{}',
  required_modifications JSONB DEFAULT '[]',
  alternative_options JSONB DEFAULT '[]',
  rationale TEXT,
  confidence_level VARCHAR(10) CHECK(confidence_level IN ('high', 'medium', 'low')),
  clinical_trial_options JSONB DEFAULT '[]',
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  generated_by VARCHAR(255) NOT NULL,
  
  CONSTRAINT recommendations_patient_protocol_unique UNIQUE(patient_id, protocol_id)
);

-- Treatment outcomes
CREATE TABLE treatment_outcomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patient_profiles(id) ON DELETE CASCADE,
  protocol_id UUID REFERENCES treatment_protocols(id) ON DELETE CASCADE,
  treatment_start_date DATE NOT NULL,
  treatment_end_date DATE,
  cycles_completed INTEGER DEFAULT 0 CHECK(cycles_completed >= 0),
  cycles_planned INTEGER CHECK(cycles_planned >= 0),
  best_response response_type,
  response_evaluation_dates DATE[] DEFAULT '{}',
  progression_free_survival_days INTEGER,
  overall_survival_days INTEGER,
  toxicities JSONB DEFAULT '[]',
  quality_of_life_scores JSONB DEFAULT '[]',
  treatment_satisfaction INTEGER CHECK(treatment_satisfaction >= 1 AND treatment_satisfaction <= 10),
  would_recommend BOOLEAN,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  recorded_by VARCHAR(255) NOT NULL,
  
  CONSTRAINT outcomes_dates_logical CHECK(
    treatment_end_date IS NULL OR treatment_end_date >= treatment_start_date
  ),
  CONSTRAINT outcomes_cycles_logical CHECK(
    cycles_planned IS NULL OR cycles_completed <= cycles_planned
  )
);

-- Protocol effectiveness analytics (materialized view for performance)
CREATE MATERIALIZED VIEW protocol_effectiveness AS
SELECT 
  tp.id as protocol_id,
  tp.name as protocol_name,
  tp.cancer_type_ids,
  tp.line_of_therapy,
  tp.treatment_intent,
  COUNT(to_outcomes.id) as total_treatments,
  AVG(to_outcomes.match_score) as avg_match_score,
  COUNT(CASE WHEN to_outcomes.best_response IN ('complete_response', 'partial_response') THEN 1 END) as response_count,
  COUNT(CASE WHEN to_outcomes.best_response IN ('complete_response', 'partial_response') THEN 1 END)::float / NULLIF(COUNT(to_outcomes.id), 0) as response_rate,
  AVG(to_outcomes.progression_free_survival_days) as avg_pfs_days,
  AVG(to_outcomes.overall_survival_days) as avg_os_days,
  AVG(to_outcomes.treatment_satisfaction) as avg_satisfaction,
  COUNT(CASE WHEN to_outcomes.would_recommend = true THEN 1 END)::float / NULLIF(COUNT(to_outcomes.id), 0) as recommendation_rate,
  ARRAY_AGG(DISTINCT to_outcomes.toxicities) as common_toxicities
FROM treatment_protocols tp
LEFT JOIN treatment_outcomes to_outcomes ON tp.id = to_outcomes.protocol_id
LEFT JOIN treatment_recommendations tr ON tp.id = tr.protocol_id
GROUP BY tp.id, tp.name, tp.cancer_type_ids, tp.line_of_therapy, tp.treatment_intent;

-- Create indexes for performance
CREATE INDEX idx_cancer_types_category ON cancer_types(category);
CREATE INDEX idx_cancer_types_icd10 ON cancer_types(icd10_code);

CREATE INDEX idx_biomarkers_actionable ON biomarkers(actionable);
CREATE INDEX idx_biomarkers_gene ON biomarkers(gene);
CREATE INDEX idx_biomarkers_type ON biomarkers(type);

CREATE INDEX idx_protocols_cancer_types ON treatment_protocols USING GIN(cancer_type_ids);
CREATE INDEX idx_protocols_line_intent ON treatment_protocols(line_of_therapy, treatment_intent);
CREATE INDEX idx_protocols_active ON treatment_protocols(is_active);
CREATE INDEX idx_protocols_evidence ON treatment_protocols(evidence_level);

CREATE INDEX idx_patients_cancer_type ON patient_profiles USING GIN((disease_status->'primary_cancer_type'));
CREATE INDEX idx_patients_stage ON patient_profiles USING GIN((disease_status->'stage'));
CREATE INDEX idx_patients_created ON patient_profiles(created_at);

CREATE INDEX idx_recommendations_patient ON treatment_recommendations(patient_id);
CREATE INDEX idx_recommendations_protocol ON treatment_recommendations(protocol_id);
CREATE INDEX idx_recommendations_match_score ON treatment_recommendations(match_score DESC);
CREATE INDEX idx_recommendations_generated ON treatment_recommendations(generated_at);

CREATE INDEX idx_outcomes_patient ON treatment_outcomes(patient_id);
CREATE INDEX idx_outcomes_protocol ON treatment_outcomes(protocol_id);
CREATE INDEX idx_outcomes_response ON treatment_outcomes(best_response);
CREATE INDEX idx_outcomes_start_date ON treatment_outcomes(treatment_start_date);

-- Enable Row Level Security (RLS)
ALTER TABLE cancer_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE biomarkers ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_outcomes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for read access (adjust according to your auth requirements)
CREATE POLICY "Allow read access to cancer_types" ON cancer_types FOR SELECT USING (true);
CREATE POLICY "Allow read access to biomarkers" ON biomarkers FOR SELECT USING (true);
CREATE POLICY "Allow read access to treatment_protocols" ON treatment_protocols FOR SELECT USING (true);

-- More restrictive policies for patient data (example - adjust for your auth system)
CREATE POLICY "Allow users to read their own patient data" ON patient_profiles 
  FOR SELECT USING (auth.uid()::text = id::text OR auth.role() = 'service_role');

CREATE POLICY "Allow users to read their own recommendations" ON treatment_recommendations 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM patient_profiles 
      WHERE patient_profiles.id = treatment_recommendations.patient_id 
      AND (auth.uid()::text = patient_profiles.id::text OR auth.role() = 'service_role')
    )
  );

CREATE POLICY "Allow users to read their own outcomes" ON treatment_outcomes 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM patient_profiles 
      WHERE patient_profiles.id = treatment_outcomes.patient_id 
      AND (auth.uid()::text = patient_profiles.id::text OR auth.role() = 'service_role')
    )
  );

-- Functions for automated updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at columns
CREATE TRIGGER update_cancer_types_updated_at BEFORE UPDATE ON cancer_types 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
CREATE TRIGGER update_biomarkers_updated_at BEFORE UPDATE ON biomarkers 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
CREATE TRIGGER update_treatment_protocols_updated_at BEFORE UPDATE ON treatment_protocols 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
CREATE TRIGGER update_patient_profiles_updated_at BEFORE UPDATE ON patient_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to refresh the materialized view
CREATE OR REPLACE FUNCTION refresh_protocol_effectiveness()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW protocol_effectiveness;
END;
$$ language 'plpgsql';

-- Create a scheduled job to refresh the materialized view (if pg_cron is available)
-- SELECT cron.schedule('refresh-protocol-effectiveness', '0 2 * * *', 'SELECT refresh_protocol_effectiveness();');

-- Insert seed data for testing
INSERT INTO cancer_types (name, icd10_code, category) VALUES 
  ('Breast Cancer', 'C50', 'solid_tumor'),
  ('Lung Cancer', 'C78', 'solid_tumor'),
  ('Colorectal Cancer', 'C18', 'solid_tumor'),
  ('Prostate Cancer', 'C61', 'solid_tumor'),
  ('Acute Myeloid Leukemia', 'C92.0', 'hematologic'),
  ('Lymphoma', 'C85', 'hematologic');

INSERT INTO biomarkers (name, gene, type, clinical_significance, actionable) VALUES 
  ('EGFR Mutation', 'EGFR', 'mutation', 'predictive', true),
  ('ALK Fusion', 'ALK', 'fusion', 'predictive', true),
  ('PD-L1 Expression', 'CD274', 'expression', 'predictive', true),
  ('BRCA1 Mutation', 'BRCA1', 'mutation', 'predictive', true),
  ('BRCA2 Mutation', 'BRCA2', 'mutation', 'predictive', true),
  ('HER2 Amplification', 'ERBB2', 'amplification', 'predictive', true);

-- Comments for documentation
COMMENT ON TABLE cancer_types IS 'Master table of cancer types with ICD-10 classification';
COMMENT ON TABLE biomarkers IS 'Repository of actionable and non-actionable biomarkers';
COMMENT ON TABLE treatment_protocols IS 'Evidence-based treatment protocols with eligibility criteria';
COMMENT ON TABLE patient_profiles IS 'Comprehensive patient profiles with disease and treatment history';
COMMENT ON TABLE treatment_recommendations IS 'AI-generated treatment recommendations with matching scores';
COMMENT ON TABLE treatment_outcomes IS 'Real-world treatment outcomes for effectiveness analysis';
COMMENT ON MATERIALIZED VIEW protocol_effectiveness IS 'Aggregated protocol effectiveness metrics for analytics';
