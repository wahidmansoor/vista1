-- Enable RLS
ALTER TABLE public.premedications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read access for authenticated users"
ON public.premedications
FOR SELECT
USING (auth.role() = 'authenticated');

-- Allow service role full access
CREATE POLICY "Allow full access for service role"
ON public.premedications
FOR ALL
USING (auth.role() = 'service_role');
