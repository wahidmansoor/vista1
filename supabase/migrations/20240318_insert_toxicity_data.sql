-- Clear existing data
TRUNCATE TABLE public.toxicities;

-- Insert comprehensive toxicity data
INSERT INTO public.toxicities 
(name, severity, recognition, management, dose_guidance, culprit_drugs)
VALUES
(
    'Peripheral Neuropathy',
    'Grade 1-4',
    'Numbness, tingling, or pain in hands/feet. May progress to difficulty with fine motor tasks or walking.',
    ARRAY[
        'Regular neurological assessment',
        'Keep extremities warm',
        'Avoid prolonged exposure to cold',
        'Consider gabapentin/pregabalin for symptoms',
        'Physical therapy for severe cases'
    ],
    ARRAY[
        'Grade 1: Continue with careful monitoring',
        'Grade 2: Consider 25% dose reduction',
        'Grade 3: Hold treatment until improvement to Grade 1-2',
        'Grade 4: Discontinue neurotoxic agent'
    ],
    ARRAY['Paclitaxel', 'Oxaliplatin']
),
(
    'Mucositis',
    'Grade 1-4',
    'Oral pain, ulceration, difficulty eating/drinking. Risk of secondary infection.',
    ARRAY[
        'Regular oral hygiene with soft brush',
        'Salt/sodium bicarbonate mouthwashes',
        'Pain management with local analgesics',
        'Consider systemic pain relief if severe',
        'Monitor fluid/nutrition intake'
    ],
    ARRAY[
        'Grade 1: Continue with supportive care',
        'Grade 2: Consider short treatment delay',
        'Grade 3: Hold until recovery to Grade 1',
        'Grade 4: Hold and reduce next cycle dose by 25%'
    ],
    ARRAY['5-Fluorouracil', 'Methotrexate']
),
(
    'Fatigue',
    'Grade 1-3',
    'Persistent tiredness, reduced performance status, impact on daily activities.',
    ARRAY[
        'Regular exercise within tolerance',
        'Maintain good sleep hygiene',
        'Schedule activities during peak energy',
        'Consider referral to fatigue clinic',
        'Monitor for underlying causes'
    ],
    ARRAY[
        'Grade 1: Continue full dose with monitoring',
        'Grade 2: No dose modification required',
        'Grade 3: Consider treatment break'
    ],
    ARRAY['Capecitabine', 'Pembrolizumab', 'Nivolumab']
),
(
    'Rash',
    'Grade 1-3',
    'Acneiform eruption, may be pustular. Most common on face, upper chest, and back.',
    ARRAY[
        'Topical antibiotics/steroids',
        'Oral antibiotics if widespread',
        'Sun protection essential',
        'Regular emollient use',
        'Dermatology review if severe'
    ],
    ARRAY[
        'Grade 1: Continue with prophylactic management',
        'Grade 2: Continue with added topical therapy',
        'Grade 3: Hold until ≤ Grade 2, then reduce dose'
    ],
    ARRAY['Erlotinib', 'Cetuximab']
),
(
    'Neutropenia',
    'Grade 1-4',
    'Reduced neutrophil count increasing infection risk. May be febrile.',
    ARRAY[
        'Regular FBC monitoring',
        'Temperature monitoring',
        'Immediate review if fever',
        'Consider G-CSF prophylaxis',
        'Antibiotic prophylaxis if indicated'
    ],
    ARRAY[
        'Grade 1: Continue with monitoring',
        'Grade 2: Continue if afebrile',
        'Grade 3: Hold until recovery, consider G-CSF',
        'Grade 4: Hold and reduce next cycle by 25%'
    ],
    ARRAY['Docetaxel', 'Cyclophosphamide']
);
