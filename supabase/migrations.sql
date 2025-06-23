-- Run migrations in this order to maintain dependencies
\echo 'Running database migrations...'

-- Set up support functions and triggers
\echo 'Creating triggers and functions...'
\i migrations/20250413_create_triggers.sql

-- Set up protocols
\echo 'Creating protocols table...'
\i migrations/20250413_create_protocols.sql

-- Set up full-text search
\echo 'Creating search functions...'
\i migrations/20250413_create_search_function.sql

-- Set up medications
\echo 'Creating medications table...'
\i migrations/20250416_create_oncology_medications.sql

-- Seed initial data
\echo 'Seeding medications data...'
\i migrations/20250416_seed_oncology_medications.sql

-- Create additional indexes
\echo 'Creating performance indexes...'
\i migrations/20250416_create_medication_indexes.sql

\echo 'All migrations completed successfully!'
