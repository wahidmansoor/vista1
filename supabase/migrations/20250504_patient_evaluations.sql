-- Create patient evaluations table
CREATE TABLE IF NOT EXISTS patient_evaluations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cancer_type TEXT NOT NULL,
    form_data JSONB NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE patient_evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own evaluations"
    ON patient_evaluations
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own evaluations"
    ON patient_evaluations
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_patient_evaluations_updated_at
    BEFORE UPDATE ON patient_evaluations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();