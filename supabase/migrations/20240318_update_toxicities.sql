-- Add new column for culprit drugs
ALTER TABLE public.toxicities 
ADD COLUMN culprit_drugs text[] DEFAULT '{}';

-- Update existing records with sample data
UPDATE public.toxicities
SET culprit_drugs = ARRAY['Paclitaxel', 'Docetaxel']
WHERE name = 'Fatigue';

UPDATE public.toxicities
SET culprit_drugs = ARRAY['Cetuximab', 'Panitumumab']
WHERE name = 'Rash';
