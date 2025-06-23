-- Function to automatically update timestamps
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update search vectors
CREATE OR REPLACE FUNCTION update_oncology_medications_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector = 
        setweight(to_tsvector('english', NEW.name), 'A') || 
        setweight(to_tsvector('english', NEW.classification), 'B') ||
        setweight(to_tsvector('english', array_to_string(NEW.brand_names, ' ')), 'B') ||
        setweight(to_tsvector('english', NEW.indications->>'cancer_types'), 'C');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update search vector on changes
CREATE TRIGGER oncology_medications_search_trigger
    BEFORE INSERT OR UPDATE ON oncology_medications
    FOR EACH ROW
    EXECUTE FUNCTION update_oncology_medications_search_vector();
