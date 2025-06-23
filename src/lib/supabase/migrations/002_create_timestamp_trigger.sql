CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_premedications_updated_at
    BEFORE UPDATE ON public.premedications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
