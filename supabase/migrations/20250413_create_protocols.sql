-- Create protocols table with full structure
CREATE TABLE IF NOT EXISTS public.protocols (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL,
  tumour_group text NOT NULL,
  treatment_intent text NULL,
  protocol_version text NOT NULL,
  approval_date date NOT NULL,
  review_date date NOT NULL,
  approved_by text NOT NULL,
  emesis_risk text NULL,
  supportive_care jsonb NULL,
  cycle_duration interval NULL,
  total_cycles integer NULL,
  eligibility jsonb NULL,
  treatment jsonb NULL,
  tests jsonb NULL,
  dose_modifications jsonb NULL,
  precautions jsonb NULL,
  reference_list jsonb NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
) TABLESPACE pg_default;

-- Enable Row Level Security
ALTER TABLE public.protocols ENABLE ROW LEVEL SECURITY;

-- Create policy to allow SELECT access to anonymous and authenticated users
CREATE POLICY "Allow read access to anon and authenticated users"
  ON public.protocols
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create safe indexes for common filters
CREATE INDEX IF NOT EXISTS idx_protocols_tumour_group ON public.protocols USING btree (tumour_group) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_protocols_treatment_intent ON public.protocols USING btree (treatment_intent) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_protocols_code ON public.protocols USING btree (code) TABLESPACE pg_default;
