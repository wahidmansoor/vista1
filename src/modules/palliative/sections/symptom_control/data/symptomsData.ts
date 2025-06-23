export interface Symptom {
  id: string;
  name: string;
  icon: string;
  category: 'physical' | 'neuropsychological' | 'functional' | 'systemic' | 'psychosocial';
  severityLevels: {
    mild: string[];
    moderate: string[];
    severe: string[];
  };
  redFlags: string[];
  assessmentTips: string[];
  notes: string;
}

const symptoms: Symptom[] = [
  // Physical Symptoms
  {
    id: "pain",
    name: "Pain",
    icon: "activity",
    category: "physical",
    severityLevels: {
      mild: ["Manageable with non-opioids", "Minimal impact on function"],
      moderate: ["Requires weak opioids", "Impacts some daily activities"],
      severe: ["Strong opioids needed", "Significant functional impairment"]
    },
    redFlags: ["Acute severe pain", "New neurological symptoms", "Signs of spinal cord compression"],
    assessmentTips: ["Use validated pain scales", "Document location and character", "Ask about breakthrough pain"],
    notes: "Follow WHO analgesic ladder. Consider adjuvant medications."
  },
  {
    id: "nausea",
    name: "Nausea",
    icon: "droplet",
    category: "physical",
    severityLevels: {
      mild: ["Intermittent", "Responds to antiemetics"],
      moderate: ["Persistent", "Affects oral intake"],
      severe: ["Intractable", "Severe dehydration risk"]
    },
    redFlags: ["Intractable vomiting", "Signs of bowel obstruction", "Severe dehydration"],
    assessmentTips: ["Identify triggers", "Check hydration status", "Review medications"],
    notes: "Consider underlying cause (e.g., medications, bowel obstruction, raised ICP)"
  },
  {
    id: "constipation",
    name: "Constipation",
    icon: "arrow-down",
    category: "physical",
    severityLevels: {
      mild: ["Responds to lifestyle measures", "Normal stool consistency"],
      moderate: ["Requires regular laxatives", "Hard stools"],
      severe: ["Manual evacuation needed", "Fecal impaction"]
    },
    redFlags: ["Complete obstruction", "Severe abdominal pain", "Fecal impaction"],
    assessmentTips: ["Bristol stool chart", "Frequency of bowel movements", "Dietary assessment"],
    notes: "Common with opioids - prophylaxis essential"
  },
  {
    id: "dyspnea",
    name: "Dyspnea",
    icon: "lungs",
    category: "physical",
    severityLevels: {
      mild: ["Breathless on exertion", "O2 sats > 94%"],
      moderate: ["Breathless at rest", "Requires O2"],
      severe: ["Acute respiratory distress", "Cyanosis"]
    },
    redFlags: ["Acute onset", "Stridor", "Hemoptysis"],
    assessmentTips: ["Respiratory rate", "O2 saturation", "Work of breathing"],
    notes: "Consider opioids for symptomatic relief"
  },

  // Neuropsychological Symptoms
  {
    id: "delirium",
    name: "Delirium",
    icon: "brain-circuit",
    category: "neuropsychological",
    severityLevels: {
      mild: ["Subtle attention deficits", "Preserved ADLs"],
      moderate: ["Fluctuating awareness", "Needs supervision"],
      severe: ["Severe agitation", "Safety risks"]
    },
    redFlags: ["Acute onset", "Rapid deterioration", "Risk of harm"],
    assessmentTips: ["4AT score", "CAM assessment", "Review medications"],
    notes: "Look for reversible causes"
  },
  {
    id: "anxiety",
    name: "Anxiety",
    icon: "alert-triangle",
    category: "neuropsychological",
    severityLevels: {
      mild: ["Situational", "Self-manageable"],
      moderate: ["Frequent episodes", "Affects daily life"],
      severe: ["Panic attacks", "Constant distress"]
    },
    redFlags: ["Suicidal ideation", "Severe panic", "Total withdrawal"],
    assessmentTips: ["GAD-7 scale", "Impact on sleep", "Physical symptoms"],
    notes: "Consider psychological support alongside medication"
  },

  // Functional Symptoms
  {
    id: "weakness",
    name: "Weakness",
    icon: "weight",
    category: "functional",
    severityLevels: {
      mild: ["Independent mobility", "Minimal assistance"],
      moderate: ["Needs walking aids", "Regular help"],
      severe: ["Bed-bound", "Total care needed"]
    },
    redFlags: ["Sudden onset", "Focal neurological signs", "Falls risk"],
    assessmentTips: ["Muscle strength", "Balance", "ADL assessment"],
    notes: "Consider reversible causes like deconditioning"
  },

  // Systemic Symptoms
  {
    id: "fatigue",
    name: "Fatigue",
    icon: "battery-low",
    category: "systemic",
    severityLevels: {
      mild: ["Activity modification helps", "Normal ADLs"],
      moderate: ["Impacts daily function", "Needs rest periods"],
      severe: ["Bed-bound >50% of day", "Unable to self-care"]
    },
    redFlags: ["Sudden worsening", "Associated weight loss", "New onset"],
    assessmentTips: ["Activity diary", "Impact on function", "Screen for depression"],
    notes: "Balance activity and rest. Consider contributing factors."
  },

  // Psychosocial Symptoms
  {
    id: "spiritual-distress",
    name: "Spiritual Distress",
    icon: "sun",
    category: "psychosocial",
    severityLevels: {
      mild: ["Occasional questions", "Maintains hope"],
      moderate: ["Frequent distress", "Searching for meaning"],
      severe: ["Existential crisis", "Total despair"]
    },
    redFlags: ["Suicidal thoughts", "Complete withdrawal", "Refusal of care"],
    assessmentTips: ["Spiritual beliefs", "Sources of meaning", "Support systems"],
    notes: "Consider chaplaincy or spiritual care referral"
  },
  // Adding new symptoms
  {
    id: "vomiting",
    name: "Vomiting",
    icon: "arrow-up-circle",
    category: "physical",
    severityLevels: {
      mild: ["1-2 episodes/day", "No dehydration"],
      moderate: ["3-5 episodes/day", "Mild dehydration signs"],
      severe: [">5 episodes/day or intractable", "Significant dehydration"]
    },
    redFlags: ["Hematemesis", "Persistent vomiting despite antiemetics", "Signs of bowel obstruction"],
    assessmentTips: ["Frequency, volume, content of vomitus", "Assess hydration", "Review medications"],
    notes: "Identify and treat underlying cause. Ensure adequate hydration."
  },
  {
    id: "diarrhea",
    name: "Diarrhea",
    icon: "arrow-down-circle",
    category: "physical",
    severityLevels: {
      mild: ["<4 stools/day", "No dehydration"],
      moderate: ["4-6 stools/day", "Mild dehydration"],
      severe: [">6 stools/day or nocturnal diarrhea", "Severe dehydration, electrolyte imbalance"]
    },
    redFlags: ["Bloody diarrhea", "High fever", "Severe abdominal pain", "Signs of severe dehydration"],
    assessmentTips: ["Frequency, consistency, volume", "Assess for C. difficile if recent antibiotics", "Monitor electrolytes"],
    notes: "Rule out infectious causes. Manage hydration and electrolytes."
  },
  {
    id: "insomnia",
    name: "Insomnia",
    icon: "moon",
    category: "neuropsychological",
    severityLevels: {
      mild: ["Occasional difficulty sleeping", "Minimal impact on daytime function"],
      moderate: ["Regular difficulty sleeping", "Affects mood and concentration"],
      severe: ["Chronic lack of sleep", "Significant impact on quality of life"]
    },
    redFlags: ["Sudden onset of severe insomnia", "Associated with severe depression or anxiety", "Sleep apnea symptoms"],
    assessmentTips: ["Sleep diary", "Assess sleep hygiene", "Rule out underlying medical conditions or medication side effects"],
    notes: "Address underlying causes. Consider non-pharmacological and pharmacological interventions."
  },
  {
    id: "cough",
    name: "Cough",
    icon: "wind",
    category: "physical",
    severityLevels: {
      mild: ["Occasional, non-distressing", "No impact on sleep or activity"],
      moderate: ["Persistent, bothersome", "May disturb sleep or activity"],
      severe: ["Severe, intractable", "Exhausting, significantly impacts quality of life"]
    },
    redFlags: ["Hemoptysis", "Associated dyspnea or chest pain", "Productive cough with purulent sputum"],
    assessmentTips: ["Character (dry/productive), frequency, triggers", "Assess for infection or aspiration", "Impact on daily life"],
    notes: "Identify and treat underlying cause. Symptomatic relief with antitussives or other agents."
  },
  {
    id: "pruritus",
    name: "Pruritus",
    icon: "sparkles",
    category: "physical",
    severityLevels: {
      mild: ["Localized, intermittent", "Responds to simple measures"],
      moderate: ["Generalized, persistent", "Disturbs sleep, causes distress"],
      severe: ["Severe, intractable", "Leads to skin damage, significant distress"]
    },
    redFlags: ["Sudden onset severe pruritus", "Associated jaundice or rash", "Signs of skin infection"],
    assessmentTips: ["Distribution, intensity, exacerbating factors", "Assess for underlying systemic disease or drug reaction", "Skin examination"],
    notes: "Moisturize skin. Avoid irritants. Consider topical or systemic treatments."
  },
  {
    id: "xerostomia",
    name: "Xerostomia",
    icon: "droplets",
    category: "physical",
    severityLevels: {
      mild: ["Slightly dry mouth", "Minimal discomfort"],
      moderate: ["Persistent dry mouth", "Difficulty speaking or swallowing dry food"],
      severe: ["Severe dry mouth", "Oral pain, difficulty with dentures, increased risk of oral infections"]
    },
    redFlags: ["Rapid onset with other systemic symptoms", "Severe oral pain or ulceration", "Inability to swallow"],
    assessmentTips: ["Assess oral mucosa", "Review medications", "Impact on oral intake and speech"],
    notes: "Oral hygiene, saliva substitutes, sips of water. Avoid caffeine and alcohol."
  },
  {
    id: "anorexia",
    name: "Anorexia",
    icon: "utensils-crossed",
    category: "systemic",
    severityLevels: {
      mild: ["Slight decrease in appetite", "Minimal weight loss"],
      moderate: ["Significant decrease in appetite", "Some weight loss, nutritional risk"],
      severe: ["Complete loss of appetite", "Significant weight loss, malnutrition"]
    },
    redFlags: ["Rapid unintentional weight loss", "Associated dysphagia or odynophagia", "Signs of cachexia"],
    assessmentTips: ["Dietary history, weight changes", "Assess for reversible causes (e.g., nausea, pain, depression)", "Impact on strength and function"],
    notes: "Small, frequent, appealing meals. Nutritional supplements. Address underlying causes."
  },
  {
    id: "sweating",
    name: "Sweating",
    icon: "thermometer",
    category: "systemic",
    severityLevels: {
      mild: ["Occasional, manageable episodes", "No significant distress"],
      moderate: ["Frequent episodes, drenching sweats", "Disturbs sleep, causes discomfort"],
      severe: ["Constant, profuse sweating", "Leads to dehydration, skin breakdown, significant distress"]
    },
    redFlags: ["Associated with fever, infection signs", "Night sweats with unexplained weight loss", "Autonomic dysfunction signs"],
    assessmentTips: ["Pattern, triggers, volume", "Assess for infection, hormonal imbalance, drug side effects", "Impact on daily life"],
    notes: "Keep skin dry. Lightweight clothing. Consider medications if severe and persistent."
  },
  {
    id: "hiccups",
    name: "Hiccups",
    icon: "flame",
    category: "physical",
    severityLevels: {
      mild: ["Brief, self-limiting episodes", "Minimal distress"],
      moderate: ["Persistent episodes", "Causes some distress, may interfere with eating/speaking"],
      severe: ["Intractable, prolonged episodes", "Exhausting, significantly impacts quality of life"]
    },
    redFlags: ["Associated with neurological symptoms", "Signs of GI obstruction or irritation", "Persistent despite simple measures"],
    assessmentTips: ["Frequency, duration, triggers", "Assess for underlying GI or CNS causes", "Impact on nutrition and sleep"],
    notes: "Simple physical maneuvers. Consider medications like chlorpromazine or baclofen for intractable cases."
  },
  {
    id: "mucositis",
    name: "Mucositis",
    icon: "alert-octagon",
    category: "physical",
    severityLevels: {
      mild: ["Oral soreness, erythema", "Able to eat normally"],
      moderate: ["Painful ulceration, edema", "Difficulty eating solid food"],
      severe: ["Extensive ulceration, unable to eat/drink", "Risk of systemic infection"]
    },
    redFlags: ["Signs of secondary infection (e.g., candida)", "Inability to maintain hydration/nutrition", "Bleeding from lesions"],
    assessmentTips: ["WHO mucositis scale", "Assess pain and ability to eat/drink", "Inspect entire oral cavity"],
    notes: "Good oral hygiene, pain management, nutritional support. Avoid irritants."
  },
  {
    id: "depression",
    name: "Depression",
    icon: "frown",
    category: "neuropsychological",
    severityLevels: {
      mild: ["Low mood, anhedonia", "Minimal impact on daily function"],
      moderate: ["Persistent low mood, anhedonia, hopelessness", "Significant impact on daily function"],
      severe: ["Severe depression with suicidal ideation, psychomotor retardation/agitation", "Unable to function"]
    },
    redFlags: ["Suicidal ideation or intent", "Psychotic features", "Rapid deterioration"],
    assessmentTips: ["PHQ-9 or similar scale", "Assess for anhedonia, hopelessness, sleep/appetite changes", "Differentiate from grief"],
    notes: "Psychological support, antidepressants. Address contributing factors."
  },
  {
    id: "hallucinations",
    name: "Hallucinations",
    icon: "eye-off",
    category: "neuropsychological",
    severityLevels: {
      mild: ["Brief, non-distressing, recognized as unreal", "Minimal impact"],
      moderate: ["More frequent or distressing, insight may be impaired", "Causes anxiety"],
      severe: ["Persistent, distressing, believed to be real", "Significant behavioral changes, safety risk"]
    },
    redFlags: ["Associated with delirium or psychosis", "Command hallucinations", "Sudden onset"],
    assessmentTips: ["Type (visual, auditory, etc.), content, distress level", "Assess for underlying delirium, dementia, or psychiatric disorder", "Review medications"],
    notes: "Treat underlying cause if possible (e.g., delirium). Antipsychotics may be needed."
  },
  {
    id: "restlessness",
    name: "Restlessness",
    icon: "move",
    category: "neuropsychological",
    severityLevels: {
      mild: ["Fidgeting, inability to sit still", "Minimal distress"],
      moderate: ["Pacing, constant movement", "Causes distress to patient and caregivers"],
      severe: ["Severe agitation, akathisia", "Risk of falls, exhaustion"]
    },
    redFlags: ["Associated with delirium or psychosis", "Sudden onset or worsening", "Risk of harm to self or others"],
    assessmentTips: ["Observe behavior", "Assess for underlying causes (e.g., pain, anxiety, akathisia from medications)", "Impact on safety and care"],
    notes: "Address underlying causes. Consider anxiolytics or antipsychotics if severe."
  },
  {
    id: "cognitive-decline",
    name: "Cognitive Decline",
    icon: "brain",
    category: "neuropsychological",
    severityLevels: {
      mild: ["Forgetfulness, difficulty with complex tasks", "Independent with ADLs"],
      moderate: ["Memory loss, disorientation, impaired judgment", "Needs assistance with some ADLs"],
      severe: ["Severe memory loss, inability to recognize family", "Dependent for all ADLs"]
    },
    redFlags: ["Rapid onset or fluctuation (suggests delirium)", "Associated focal neurological signs", "Safety concerns (e.g., wandering)"],
    assessmentTips: ["MMSE or MoCA", "Assess impact on function and safety", "Differentiate from delirium and depression"],
    notes: "Identify and treat reversible causes. Supportive care, caregiver education."
  },
  {
    id: "immobility",
    name: "Immobility",
    icon: "accessibility",
    category: "functional",
    severityLevels: {
      mild: ["Reduced mobility, needs occasional assistance", "Independent with transfers"],
      moderate: ["Significantly limited mobility, needs regular assistance", "Difficulty with transfers"],
      severe: ["Bed-bound or chair-bound", "Dependent for all mobility and transfers"]
    },
    redFlags: ["Sudden loss of mobility", "Associated pain or neurological symptoms", "Signs of DVT or pressure ulcers"],
    assessmentTips: ["Assess range of motion, strength, balance", "Identify barriers to mobility", "Risk assessment for complications (pressure ulcers, contractures)"],
    notes: "Encourage movement as tolerated. Physiotherapy. Prevent complications."
  },
  {
    id: "falls",
    name: "Falls",
    icon: "user-minus",
    category: "functional",
    severityLevels: {
      mild: ["Occasional near-misses, no injury", "Independent mobility"],
      moderate: ["Recurrent falls, minor injuries", "Needs mobility aid or supervision"],
      severe: ["Frequent falls, significant injuries (e.g., fracture)", "High risk of further injury"]
    },
    redFlags: ["Fall with loss of consciousness", "Fall with significant injury", "Sudden increase in fall frequency"],
    assessmentTips: ["Fall history (frequency, circumstances, injuries)", "Assess gait, balance, vision, medications", "Environmental assessment"],
    notes: "Multifactorial fall risk assessment and intervention. Modify environment. Consider alarms."
  },
  {
    id: "pressure-ulcers",
    name: "Pressure Ulcers",
    icon: "square",
    category: "functional",
    severityLevels: {
      mild: ["Non-blanchable erythema (Stage 1)", "Skin intact"],
      moderate: ["Partial thickness skin loss (Stage 2) or Full thickness skin loss (Stage 3)", "Shallow open ulcer or deeper crater"],
      severe: ["Full thickness tissue loss with exposed bone/tendon/muscle (Stage 4) or Unstageable", "Significant tissue damage, risk of infection"]
    },
    redFlags: ["Signs of infection (purulence, odor, warmth, cellulitis)", "Rapidly worsening ulcer", "Necrotic tissue"],
    assessmentTips: ["Braden scale or similar risk assessment", "Regular skin inspection, especially over bony prominences", "Stage ulcer accurately"],
    notes: "Pressure redistribution surfaces, regular repositioning, wound care, nutritional support."
  },
  {
    id: "contractures",
    name: "Contractures",
    icon: "shrink",
    category: "functional",
    severityLevels: {
      mild: ["Slight limitation in range of motion", "Minimal functional impact"],
      moderate: ["Significant limitation in range of motion", "Affects ADLs and comfort"],
      severe: ["Fixed joint deformity", "Severe functional impairment, pain, hygiene issues"]
    },
    redFlags: ["Rapidly developing contracture", "Associated pain or nerve compression symptoms", "Skin breakdown over contracture"],
    assessmentTips: ["Assess range of motion of all joints", "Identify risk factors (immobility, spasticity, pain)", "Impact on function and hygiene"],
    notes: "Regular passive and active range of motion exercises. Positioning. Splinting if indicated."
  },
  {
    id: "ascites",
    name: "Ascites",
    icon: "waves",
    category: "physical",
    severityLevels: {
      mild: ["Detectable by ultrasound only", "No symptoms"],
      moderate: ["Moderate symmetrical distension of abdomen", "Mild discomfort, early satiety"],
      severe: ["Large volume ascites with marked abdominal distension", "Dyspnea, significant discomfort, mobility issues"]
    },
    redFlags: ["Rapid onset or worsening", "Associated fever or abdominal pain (suggests SBP)", "Respiratory distress"],
    assessmentTips: ["Assess abdominal girth, shifting dullness, fluid wave", "Monitor weight", "Impact on breathing and appetite"],
    notes: "Diuretics, paracentesis for symptomatic relief. Monitor electrolytes. Address underlying cause if possible."
  },
  {
    id: "pleural-effusion",
    name: "Pleural Effusion",
    icon: "droplets", // Re-using, consider 'layout-list' or similar if distinct needed
    category: "physical",
    severityLevels: {
      mild: ["Small effusion on imaging", "Asymptomatic or mild dyspnea on exertion"],
      moderate: ["Moderate effusion", "Dyspnea on minimal exertion or at rest"],
      severe: ["Large effusion causing lung collapse", "Severe dyspnea, hypoxia, mediastinal shift"]
    },
    redFlags: ["Rapid accumulation", "Associated chest pain or fever", "Signs of respiratory compromise"],
    assessmentTips: ["Chest X-ray or ultrasound", "Assess respiratory status (rate, effort, O2 sats)", "Auscultation for decreased breath sounds"],
    notes: "Thoracentesis for diagnosis and symptomatic relief. Pleurodesis for recurrent malignant effusions."
  },
  {
    id: "seizures",
    name: "Seizures",
    icon: "zap",
    category: "neuropsychological",
    severityLevels: {
      mild: ["Focal seizure without impaired consciousness, brief", "Minimal post-ictal state"],
      moderate: ["Focal seizure with impaired consciousness or generalized seizure, self-limiting", "Post-ictal confusion"],
      severe: ["Status epilepticus or recurrent seizures", "Risk of neurological injury"]
    },
    redFlags: ["New onset seizure", "Status epilepticus", "Focal neurological deficit post-ictally"],
    assessmentTips: ["Type, duration, frequency, triggers", "Assess for underlying cause (e.g., brain metastases, metabolic imbalance)", "Witness accounts"],
    notes: "Anticonvulsant medication. Ensure safety during seizure. Address underlying cause."
  },
  {
    id: "terminal-agitation",
    name: "Terminal Agitation",
    icon: "alert-circle", // Placeholder
    category: "neuropsychological",
    severityLevels: {
      mild: ["Restlessness, fidgeting", "Responsive to reassurance"],
      moderate: ["Moaning, calling out, repetitive movements", "Distressing to patient and family"],
      severe: ["Thrashing, combativeness, unable to be comforted", "Risk of harm, severe distress"]
    },
    redFlags: ["Sudden onset in a previously calm patient", "Associated with uncontrolled pain or other physical symptoms", "Safety risk"],
    assessmentTips: ["Rule out reversible causes (e.g., pain, urinary retention, hypoxia, delirium)", "Assess level of distress", "Impact on family"],
    notes: "Create calm environment. Address reversible causes. Sedation may be necessary for comfort (e.g., midazolam, levomepromazine)."
  },
  {
    id: "hemorrhage",
    name: "Hemorrhage",
    icon: "droplet", // Re-using, consider 'shield-alert' or similar
    category: "physical",
    severityLevels: {
      mild: ["Minor bleeding (e.g., oozing from wound, small hematemesis)", "Hemodynamically stable"],
      moderate: ["Moderate bleeding, requires intervention (e.g., transfusion)", "Signs of mild hypovolemia"],
      severe: ["Massive or uncontrolled bleeding", "Hemodynamic instability, life-threatening"]
    },
    redFlags: ["Massive bleeding", "Signs of shock (hypotension, tachycardia, pallor)", "Bleeding from multiple sites"],
    assessmentTips: ["Source, volume, rate of bleeding", "Monitor vital signs, hemoglobin", "Assess for coagulopathy"],
    notes: "Identify and control source if possible. Transfusion support. Discuss goals of care in context of terminal hemorrhage."
  },
  {
    id: "grief",
    name: "Grief",
    icon: "user-x",
    category: "psychosocial",
    severityLevels: {
      mild: ["Sadness, tearfulness, normal response to loss", "Able to function"],
      moderate: ["Persistent sadness, difficulty coping, withdrawal", "Impacts daily life"],
      severe: ["Complicated grief, severe depression, suicidal thoughts", "Unable to function, needs professional help"]
    },
    redFlags: ["Suicidal ideation", "Prolonged inability to function", "Symptoms of major depression"],
    assessmentTips: ["Differentiate from clinical depression", "Assess coping mechanisms and support systems", "Cultural considerations"],
    notes: "Normalize grief reactions. Provide emotional support. Bereavement counseling for patient and family."
  },
  {
    id: "existential-crisis",
    name: "Existential Crisis",
    icon: "help-circle",
    category: "psychosocial",
    severityLevels: {
      mild: ["Questioning meaning and purpose", "Able to explore feelings"],
      moderate: ["Distress about lack of meaning, hopelessness", "Impacts mood and outlook"],
      severe: ["Overwhelming despair, loss of will to live", "Severe psychological distress"]
    },
    redFlags: ["Suicidal ideation", "Complete withdrawal and despair", "Refusal of care due to hopelessness"],
    assessmentTips: ["Explore patient's beliefs, values, and sources of meaning", "Assess for spiritual distress", "Listen actively and empathetically"],
    notes: "Validate feelings. Facilitate life review. Spiritual care or counseling. Focus on comfort and quality of life."
  },
  {
    id: "family-conflict",
    name: "Family Conflict",
    icon: "users",
    category: "psychosocial",
    severityLevels: {
      mild: ["Minor disagreements, easily resolved", "Minimal impact on patient care"],
      moderate: ["Persistent disagreements, tension among family members", "May affect decision-making or patient well-being"],
      severe: ["Open hostility, breakdown in communication, conflicting goals of care", "Significant distress to patient and family, impedes care"]
    },
    redFlags: ["Conflict leading to neglect or abuse of patient", "Inability to agree on goals of care", "Family members undermining each other"],
    assessmentTips: ["Identify key family members and their roles/perspectives", "Assess communication patterns", "Impact of conflict on patient"],
    notes: "Family meetings, mediation, social work or psychology involvement. Focus on patient's wishes and best interests."
  },
  {
    id: "emotional-numbness",
    name: "Emotional Numbness",
    icon: "meh",
    category: "psychosocial",
    severityLevels: {
      mild: ["Feeling detached or distant occasionally", "Able to connect at times"],
      moderate: ["Persistent feeling of detachment, difficulty experiencing emotions", "Impacts relationships"],
      severe: ["Complete inability to feel emotions, profound sense of emptiness", "Significant distress, social isolation"]
    },
    redFlags: ["Associated with severe depression or trauma", "Sudden onset", "Complete withdrawal from social interaction"],
    assessmentTips: ["Explore patient's description of their emotional state", "Assess for co-existing depression or anxiety", "Impact on quality of life and relationships"],
    notes: "Validate experience. Gentle encouragement of connection. Psychological support. May be a coping mechanism."
  }
];

export default symptoms;