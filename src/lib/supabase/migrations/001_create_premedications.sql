-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create category enum type
CREATE TYPE premedicine_category AS ENUM ('Antiemetic', 'Steroid', 'Antiallergic', 'Other');

-- Create premedications table
CREATE TABLE public.premedications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    dose TEXT NOT NULL,
    route TEXT NOT NULL,
    timing TEXT,
    required BOOLEAN DEFAULT FALSE,
    weight_based BOOLEAN DEFAULT FALSE,
    indications TEXT[] DEFAULT '{}',
    contraindications TEXT[] DEFAULT '{}',
    warnings TEXT[] DEFAULT '{}',
    alternatives TEXT[] DEFAULT '{}',
    interactions_with TEXT[] DEFAULT '{}',
    category premedicine_category NOT NULL,
    admin_sequence INTEGER,
    language TEXT DEFAULT 'en',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT unique_name UNIQUE(name)
);

-- Create indexes
CREATE INDEX idx_premedications_name ON public.premedications(name);
CREATE INDEX idx_premedications_category ON public.premedications(category);

-- Grant access to authenticated users
GRANT SELECT ON public.premedications TO authenticated;
GRANT SELECT ON public.premedications TO service_role;
