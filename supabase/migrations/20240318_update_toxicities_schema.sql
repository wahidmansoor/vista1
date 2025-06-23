-- Drop and recreate the table
DROP TABLE IF EXISTS public.toxicities CASCADE;

-- Create the table with new schema
CREATE TABLE public.toxicities (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL CHECK (char_length(name) > 0),
    severity text NOT NULL CHECK (char_length(severity) > 0),
    recognition text NOT NULL,
    management text[] NOT NULL DEFAULT '{}',
    dose_guidance text[] NOT NULL DEFAULT '{}',
    culprit_drugs text[] NOT NULL DEFAULT '{}',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Add table comments
COMMENT ON TABLE public.toxicities IS 'Stores chemotherapy toxicity management guidelines';
COMMENT ON COLUMN public.toxicities.name IS 'Name of the toxicity';
COMMENT ON COLUMN public.toxicities.severity IS 'Severity grading scale';
COMMENT ON COLUMN public.toxicities.recognition IS 'Clinical signs and symptoms';
COMMENT ON COLUMN public.toxicities.management IS 'Step-by-step management instructions';
COMMENT ON COLUMN public.toxicities.dose_guidance IS 'Dose modification guidelines per grade';
COMMENT ON COLUMN public.toxicities.culprit_drugs IS 'Drugs commonly causing this toxicity';

-- Set up row level security
ALTER TABLE public.toxicities ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON public.toxicities
    FOR SELECT USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.toxicities
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes
CREATE INDEX idx_toxicities_name ON public.toxicities (name);
CREATE INDEX idx_toxicities_culprit_drugs ON public.toxicities USING gin (culprit_drugs);
