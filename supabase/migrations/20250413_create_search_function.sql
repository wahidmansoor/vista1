-- Function to search protocols based on drug name pattern within the treatment JSONB
CREATE OR REPLACE FUNCTION search_protocols_by_drug_name(
  pattern text,
  p_tumour_group text DEFAULT NULL,
  p_treatment_intent text DEFAULT NULL
)
RETURNS SETOF protocols -- Specify the return type as the table itself
LANGUAGE plpgsql
AS $$
DECLARE
  protocol_row protocols%ROWTYPE;
  drug jsonb;
BEGIN
  FOR protocol_row IN 
    SELECT * FROM protocols p
    WHERE 
      (p_tumour_group IS NULL OR p.tumour_group = p_tumour_group) AND
      (p_treatment_intent IS NULL OR p.treatment_intent = p_treatment_intent)
  LOOP
    -- Check if treatment->drugs exists and is an array
    IF jsonb_typeof(protocol_row.treatment->'drugs') = 'array' THEN
      -- Iterate through the drugs array
      FOR drug IN SELECT * FROM jsonb_array_elements(protocol_row.treatment->'drugs')
      LOOP
        -- Check if drug->'name' exists, is text, and matches the pattern (case-insensitive)
        IF jsonb_typeof(drug->'name') = 'string' AND 
           (drug->>'name') ILIKE ('%' || pattern || '%') THEN
          RETURN NEXT protocol_row;
          EXIT; -- Exit inner loop once a match is found for this protocol
        END IF;
      END LOOP;
    END IF;
  END LOOP;
  RETURN;
END;
$$;
