-- Begin transaction
BEGIN;

-- Create GIN index for the JSONB indications field to improve search performance
CREATE INDEX IF NOT EXISTS idx_oncology_medications_indications ON oncology_medications USING GIN (indications);

-- Create index for partial text search on name
CREATE INDEX IF NOT EXISTS idx_oncology_medications_name_trigram ON oncology_medications USING GIN (name gin_trgm_ops);

-- Create index for search across classification
CREATE INDEX IF NOT EXISTS idx_oncology_medications_classification_trigram ON oncology_medications USING GIN (classification gin_trgm_ops);

-- Enable the pg_trgm extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create a composite index for common filter combinations
CREATE INDEX IF NOT EXISTS idx_oncology_medications_class_name ON oncology_medications (classification, name);

-- Update search_vector column to include more searchable fields
CREATE OR REPLACE FUNCTION update_oncology_medication_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.classification, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.brand_names, ' '), '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(
      array_to_string(
        array(
          SELECT jsonb_array_elements_text(NEW.indications->'cancer_types')
        ),
        ' '
      ),
      ''
    )), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating search vector
DROP TRIGGER IF EXISTS trigger_update_oncology_medication_search_vector ON oncology_medications;
CREATE TRIGGER trigger_update_oncology_medication_search_vector
  BEFORE INSERT OR UPDATE ON oncology_medications
  FOR EACH ROW
  EXECUTE FUNCTION update_oncology_medication_search_vector();

-- Commit transaction
COMMIT;
