-- Create oncology_medications table
CREATE TABLE oncology_medications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    brand_names TEXT[] NOT NULL DEFAULT '{}',
    classification TEXT NOT NULL,
    mechanism TEXT NOT NULL,
    administration TEXT NOT NULL,
    indications JSONB NOT NULL,
    dosing JSONB NOT NULL,
    side_effects JSONB NOT NULL,
    monitoring JSONB NOT NULL,
    interactions JSONB NOT NULL,
    search_vector tsvector,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    reference_sources TEXT[] NOT NULL DEFAULT '{}'
);

-- Create function to update search vector
CREATE OR REPLACE FUNCTION medications_search_update() RETURNS trigger AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.classification, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(array_to_string(NEW.brand_names, ' '), '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.indications->>'cancer_types', '')), 'C');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for search vector updates
CREATE TRIGGER medications_search_vector_update
    BEFORE INSERT OR UPDATE ON oncology_medications
    FOR EACH ROW
    EXECUTE FUNCTION medications_search_update();

-- Create update timestamp function if it doesn't exist
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update timestamps
CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON oncology_medications
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();

-- Create indexes
CREATE INDEX idx_oncology_medications_name ON oncology_medications (name);
CREATE INDEX idx_oncology_medications_classification ON oncology_medications (classification);
CREATE INDEX idx_oncology_medications_search ON oncology_medications USING GIN (search_vector);

-- Add row level security
ALTER TABLE oncology_medications ENABLE ROW LEVEL SECURITY;

-- Create policy for read access
CREATE POLICY "Allow read access to all users"
    ON oncology_medications
    FOR SELECT
    USING (true);
