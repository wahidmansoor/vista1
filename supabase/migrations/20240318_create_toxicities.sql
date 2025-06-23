create table public.toxicities (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    severity text not null,
    recognition text,
    management text[] default '{}',
    hold_criteria text,
    resume_criteria text,
    consider_change text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Add RLS policies
alter table public.toxicities enable row level security;

create policy "Allow public read access"
    on public.toxicities
    for select
    using (true);

-- Sample data
insert into public.toxicities (name, severity, recognition, management, hold_criteria, resume_criteria, consider_change)
values 
    ('Fatigue', 'Grade 1-2', 'Tiredness, lack of energy', ARRAY['Rest periods', 'Light exercise when able', 'Maintain hydration'], 'Grade 3 or higher', 'Return to Grade 1', 'Dose reduction if persistent'),
    ('Rash', 'Grade 2-3', 'Skin eruptions, itching', ARRAY['Topical steroids', 'Antihistamines', 'Skin care routine'], 'Grade 3 or spreading', 'Rash improving to Grade 1', 'Alternative medication');
