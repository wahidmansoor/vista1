-- Fix monitoring field to ensure it's properly structured JSON
UPDATE protocols 
SET monitoring = jsonb_build_object(
  'baseline', 
  CASE 
    WHEN jsonb_typeof(monitoring::jsonb) = 'array' THEN monitoring::jsonb
    WHEN monitoring IS NULL THEN '[]'::jsonb
    ELSE jsonb_build_array(monitoring)
  END,
  'ongoing',
  '[]'::jsonb
)
WHERE monitoring IS NOT NULL 
AND (jsonb_typeof(monitoring::jsonb) != 'object' 
  OR NOT monitoring::jsonb ? 'baseline' 
  OR NOT monitoring::jsonb ? 'ongoing');

-- Fix treatment.drugs to ensure it's an array of objects
UPDATE protocols 
SET treatment = jsonb_set(
  CASE 
    WHEN treatment IS NULL THEN '{"drugs":[]}'::jsonb
    WHEN jsonb_typeof(treatment::jsonb) != 'object' THEN jsonb_build_object('drugs', '[]'::jsonb)
    ELSE treatment::jsonb
  END,
  '{drugs}',
  CASE
    WHEN jsonb_typeof(treatment::jsonb -> 'drugs') = 'array' THEN treatment::jsonb -> 'drugs'
    WHEN treatment::jsonb -> 'drugs' IS NULL THEN '[]'::jsonb
    ELSE jsonb_build_array(treatment::jsonb -> 'drugs')
  END
)
WHERE treatment IS NOT NULL 
AND (jsonb_typeof(treatment::jsonb) != 'object' 
  OR jsonb_typeof(treatment::jsonb -> 'drugs') != 'array');

-- Fix pre_medications to ensure proper structure
UPDATE protocols 
SET pre_medications = 
  CASE
    WHEN pre_medications IS NULL THEN jsonb_build_object('required', '[]'::jsonb, 'optional', '[]'::jsonb)
    WHEN jsonb_typeof(pre_medications::jsonb) = 'array' 
    THEN jsonb_build_object('required', pre_medications::jsonb, 'optional', '[]'::jsonb)
    WHEN jsonb_typeof(pre_medications::jsonb) = 'object' AND (pre_medications::jsonb ? 'required' OR pre_medications::jsonb ? 'optional')
    THEN pre_medications::jsonb
    ELSE jsonb_build_object('required', jsonb_build_array(pre_medications), 'optional', '[]'::jsonb)
  END
WHERE pre_medications IS NOT NULL;

-- Fix post_medications to ensure proper structure
UPDATE protocols 
SET post_medications = 
  CASE
    WHEN post_medications IS NULL THEN jsonb_build_object('required', '[]'::jsonb, 'optional', '[]'::jsonb)
    WHEN jsonb_typeof(post_medications::jsonb) = 'array' 
    THEN jsonb_build_object('required', post_medications::jsonb, 'optional', '[]'::jsonb)
    WHEN jsonb_typeof(post_medications::jsonb) = 'object' AND (post_medications::jsonb ? 'required' OR post_medications::jsonb ? 'optional')
    THEN post_medications::jsonb
    ELSE jsonb_build_object('required', jsonb_build_array(post_medications), 'optional', '[]'::jsonb)
  END
WHERE post_medications IS NOT NULL;

-- Add constraints to ensure proper JSON structure
ALTER TABLE protocols
  ADD CONSTRAINT monitoring_is_json CHECK (
    monitoring IS NULL OR 
    (jsonb_typeof(monitoring::jsonb) = 'object' 
     AND monitoring::jsonb ? 'baseline' 
     AND monitoring::jsonb ? 'ongoing')
  ),
  ADD CONSTRAINT treatment_has_drugs_array CHECK (
    treatment IS NULL OR 
    (jsonb_typeof(treatment::jsonb) = 'object' 
     AND jsonb_typeof(treatment::jsonb -> 'drugs') = 'array')
  ),
  ADD CONSTRAINT medications_structure CHECK (
    (pre_medications IS NULL OR 
     (jsonb_typeof(pre_medications::jsonb) = 'object' 
      AND pre_medications::jsonb ? 'required' 
      AND pre_medications::jsonb ? 'optional'))
    AND
    (post_medications IS NULL OR 
     (jsonb_typeof(post_medications::jsonb) = 'object' 
      AND post_medications::jsonb ? 'required' 
      AND post_medications::jsonb ? 'optional'))
  );
