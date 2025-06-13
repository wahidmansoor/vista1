-- Create handbook_files table for storing handbook content
-- This replaces the local file-based system with a database-backed solution

CREATE TABLE IF NOT EXISTS handbook_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section VARCHAR(50) NOT NULL,
  topic VARCHAR(255) NOT NULL,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  format VARCHAR(10) NOT NULL CHECK (format IN ('markdown', 'json')),
  path VARCHAR(500), -- Optional, stores full nested path for reference
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique combination of section and topic
  UNIQUE(section, topic)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_handbook_files_section ON handbook_files(section);
CREATE INDEX IF NOT EXISTS idx_handbook_files_section_topic ON handbook_files(section, topic);
CREATE INDEX IF NOT EXISTS idx_handbook_files_format ON handbook_files(format);
CREATE INDEX IF NOT EXISTS idx_handbook_files_created_at ON handbook_files(created_at);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_handbook_files_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER trigger_update_handbook_files_updated_at
  BEFORE UPDATE ON handbook_files
  FOR EACH ROW
  EXECUTE FUNCTION update_handbook_files_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE handbook_files ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access and restricted write access
-- Public can read all handbook files
CREATE POLICY "Allow public read access" ON handbook_files
  FOR SELECT USING (true);

-- Only authenticated users can insert handbook files (for data migration/admin)
CREATE POLICY "Allow authenticated insert" ON handbook_files
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Only authenticated users can update handbook files
CREATE POLICY "Allow authenticated update" ON handbook_files
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Only authenticated users can delete handbook files
CREATE POLICY "Allow authenticated delete" ON handbook_files
  FOR DELETE USING (auth.role() = 'authenticated');

-- Add comments for documentation
COMMENT ON TABLE handbook_files IS 'Stores handbook content that was previously stored as local .md and .json files';
COMMENT ON COLUMN handbook_files.section IS 'Handbook section (e.g., medical-oncology, palliative, radiation)';
COMMENT ON COLUMN handbook_files.topic IS 'Topic identifier within the section (e.g., diagnosis-workup/breast-cancer)';
COMMENT ON COLUMN handbook_files.title IS 'Human-readable title for the content';
COMMENT ON COLUMN handbook_files.content IS 'The actual content - either markdown text or JSON string';
COMMENT ON COLUMN handbook_files.format IS 'Content format: either "markdown" or "json"';
COMMENT ON COLUMN handbook_files.path IS 'Optional full path for reference (e.g., /medical-oncology/diagnosis-workup/breast-cancer.json)';
