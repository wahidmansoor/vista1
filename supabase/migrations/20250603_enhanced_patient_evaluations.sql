-- Enhanced Patient Evaluations Schema - OncoVista Advanced Clinical Decision Support
-- Migration: 20250603_enhanced_patient_evaluations.sql

-- Drop existing table if upgrading (be careful in production!)
-- DROP TABLE IF EXISTS public.patient_evaluations CASCADE;

-- Create enhanced patient evaluations table
CREATE TABLE IF NOT EXISTS public.enhanced_patient_evaluations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid, -- Will reference patients table when available
  
  -- Core Clinical Data
  cancer_type text NOT NULL CHECK (cancer_type <> ''),
  cancer_subtype text,
  primary_site text NOT NULL,
  histology text NOT NULL,
  tumor_grade text CHECK (tumor_grade ~ '^G[1-4X]$|^Well|^Moderately|^Poorly|^Undifferentiated$'),
  
  -- Staging System (Enhanced)
  tnm_stage jsonb NOT NULL DEFAULT '{}'::jsonb,
  ajcc_version text DEFAULT '8th_edition',
  stage_clinical text, -- cTNM
  stage_pathological text, -- pTNM
  
  -- Biomarkers & Molecular Profile
  receptor_status jsonb DEFAULT '{}'::jsonb,
  mutation_status jsonb DEFAULT '{}'::jsonb,
  immunohistochemistry jsonb DEFAULT '{}'::jsonb,
  molecular_subtype text,
  msi_status text CHECK (msi_status IN ('MSI-H', 'MSS', 'MSI-L', 'unknown')),
  tmb_score numeric,
  
  -- Performance & Comorbidities
  performance_status jsonb NOT NULL DEFAULT '{}'::jsonb,
  comorbidity_score jsonb, -- Charlson, ACE-27, etc.
  organ_function jsonb, -- Liver, kidney, cardiac function
  
  -- Risk Assessment (AI-Enhanced)
  risk_category text NOT NULL DEFAULT 'low' CHECK (risk_category IN ('minimal', 'low', 'intermediate', 'high', 'very_high')),
  risk_score numeric CHECK (risk_score >= 0 AND risk_score <= 100),
  risk_factors jsonb DEFAULT '[]'::jsonb,
  protective_factors jsonb DEFAULT '[]'::jsonb,
  
  -- Treatment Planning
  treatment_intent text CHECK (treatment_intent IN ('curative', 'palliative', 'adjuvant', 'neoadjuvant')),
  treatment_line text NOT NULL DEFAULT 'first_line',
  recommended_plan jsonb NOT NULL DEFAULT '{}'::jsonb,
  alternative_plans jsonb DEFAULT '[]'::jsonb,
  contraindications jsonb DEFAULT '[]'::jsonb,
  
  -- Clinical Decision Support
  red_flags jsonb DEFAULT '[]'::jsonb,
  ai_recommendations jsonb DEFAULT '{}'::jsonb,
  evidence_level text CHECK (evidence_level IN ('1A', '1B', '2A', '2B', '3', '4', '5')),
  guideline_references jsonb DEFAULT '[]'::jsonb,
  
  -- Form Management
  form_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  validation_errors jsonb DEFAULT '[]'::jsonb,
  completion_percentage numeric DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  
  -- Workflow & Collaboration
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'reviewed', 'approved', 'revised', 'archived')),
  submitted_by uuid REFERENCES auth.users(id),
  reviewed_by uuid REFERENCES auth.users(id),
  mdt_discussed boolean DEFAULT false,
  mdt_date timestamptz,
  
  -- Versioning & Audit
  version integer NOT NULL DEFAULT 1,
  parent_evaluation_id uuid REFERENCES public.enhanced_patient_evaluations(id),
  clinician_notes text,
  revision_reason text,
  
  -- Timestamps
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  submitted_at timestamptz,
  reviewed_at timestamptz,
  
  -- Computed Fields
  overall_stage text GENERATED ALWAYS AS (
    CASE 
      WHEN stage_pathological IS NOT NULL THEN stage_pathological
      ELSE stage_clinical
    END
  ) STORED,
  
  days_since_creation integer GENERATED ALWAYS AS (
    EXTRACT(days FROM (now() - created_at))
  ) STORED
);

-- Optimized indexes for performance
CREATE INDEX IF NOT EXISTS idx_enhanced_evaluations_patient_id ON public.enhanced_patient_evaluations(patient_id);
CREATE INDEX IF NOT EXISTS idx_enhanced_evaluations_cancer_type ON public.enhanced_patient_evaluations(cancer_type);
CREATE INDEX IF NOT EXISTS idx_enhanced_evaluations_status ON public.enhanced_patient_evaluations(status);
CREATE INDEX IF NOT EXISTS idx_enhanced_evaluations_risk_category ON public.enhanced_patient_evaluations(risk_category);
CREATE INDEX IF NOT EXISTS idx_enhanced_evaluations_created_at ON public.enhanced_patient_evaluations(created_at);
CREATE INDEX IF NOT EXISTS idx_enhanced_evaluations_gin_form_data ON public.enhanced_patient_evaluations USING gin(form_data);
CREATE INDEX IF NOT EXISTS idx_enhanced_evaluations_submitted_by ON public.enhanced_patient_evaluations(submitted_by);
CREATE INDEX IF NOT EXISTS idx_enhanced_evaluations_overall_stage ON public.enhanced_patient_evaluations(overall_stage);

-- Enable Row Level Security
ALTER TABLE public.enhanced_patient_evaluations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own evaluations" ON public.enhanced_patient_evaluations
  FOR SELECT USING (auth.uid() = submitted_by);

CREATE POLICY "Users can insert their own evaluations" ON public.enhanced_patient_evaluations
  FOR INSERT WITH CHECK (auth.uid() = submitted_by);

CREATE POLICY "Users can update their own draft evaluations" ON public.enhanced_patient_evaluations
  FOR UPDATE USING (auth.uid() = submitted_by AND status = 'draft');

CREATE POLICY "Reviewers can view assigned evaluations" ON public.enhanced_patient_evaluations
  FOR SELECT USING (auth.uid() = reviewed_by);

-- Triggers
CREATE OR REPLACE FUNCTION update_enhanced_evaluations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  
  -- Auto-calculate completion percentage
  IF NEW.form_data IS NOT NULL THEN
    NEW.completion_percentage = calculate_completion_percentage(NEW.form_data, NEW.cancer_type);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_enhanced_patient_evaluations_updated_at
  BEFORE UPDATE ON public.enhanced_patient_evaluations
  FOR EACH ROW
  EXECUTE FUNCTION update_enhanced_evaluations_updated_at();

-- Function to calculate completion percentage
CREATE OR REPLACE FUNCTION calculate_completion_percentage(form_data jsonb, cancer_type text)
RETURNS numeric AS $$
DECLARE
  total_fields integer := 0;
  completed_fields integer := 0;
  field_key text;
  field_value text;
BEGIN
  -- Count total and completed fields based on cancer type requirements
  FOR field_key, field_value IN SELECT * FROM jsonb_each_text(form_data)
  LOOP
    total_fields := total_fields + 1;
    IF field_value IS NOT NULL AND field_value != '' THEN
      completed_fields := completed_fields + 1;
    END IF;
  END LOOP;
  
  IF total_fields = 0 THEN
    RETURN 0;
  END IF;
  
  RETURN ROUND((completed_fields::numeric / total_fields::numeric) * 100, 2);
END;
$$ LANGUAGE plpgsql;

-- Create view for dashboard analytics
CREATE OR REPLACE VIEW enhanced_evaluation_analytics AS
SELECT 
  cancer_type,
  risk_category,
  status,
  COUNT(*) as count,
  AVG(completion_percentage) as avg_completion,
  AVG(risk_score) as avg_risk_score,
  COUNT(CASE WHEN mdt_discussed THEN 1 END) as mdt_cases,
  AVG(days_since_creation) as avg_processing_time
FROM public.enhanced_patient_evaluations
GROUP BY cancer_type, risk_category, status;

-- Grant necessary permissions
GRANT ALL ON public.enhanced_patient_evaluations TO authenticated;
GRANT ALL ON enhanced_evaluation_analytics TO authenticated;

-- Comments
COMMENT ON TABLE public.enhanced_patient_evaluations IS 'Enhanced patient evaluations with AI-powered clinical decision support';
COMMENT ON COLUMN public.enhanced_patient_evaluations.risk_score IS 'AI-calculated risk score (0-100)';
COMMENT ON COLUMN public.enhanced_patient_evaluations.ai_recommendations IS 'AI-generated clinical recommendations and insights';
COMMENT ON COLUMN public.enhanced_patient_evaluations.completion_percentage IS 'Auto-calculated form completion percentage';
