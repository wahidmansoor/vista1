INSERT INTO public.premedications 
(name, dose, route, timing, required, weight_based, indications, contraindications, warnings, category, admin_sequence) 
VALUES
(
    'Ondansetron',
    '8-16mg',
    'IV',
    '30 minutes before chemotherapy',
    true,
    false,
    ARRAY['Highly emetogenic chemotherapy', 'Moderately emetogenic chemotherapy'],
    ARRAY['Known hypersensitivity'],
    ARRAY['May cause QT prolongation'],
    'Antiemetic',
    1
),
(
    'Dexamethasone',
    '8-20mg',
    'IV',
    '30 minutes before chemotherapy',
    true,
    true,
    ARRAY['Prevention of delayed CINV', 'Anti-inflammatory'],
    ARRAY['Active infection', 'Live vaccines'],
    ARRAY['May affect blood glucose'],
    'Steroid',
    2
),
(
    'Diphenhydramine',
    '25-50mg',
    'IV',
    '30 minutes before taxanes',
    false,
    false,
    ARRAY['Prevention of hypersensitivity reactions', 'Taxane premedication'],
    ARRAY['Narrow angle glaucoma'],
    ARRAY['May cause drowsiness'],
    'Antiallergic',
    3
);
