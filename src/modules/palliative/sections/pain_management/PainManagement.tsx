import React, { useState } from 'react';
import { Activity, Clock, Stethoscope, PieChart, Pill, AlertCircle, BookOpen, ChevronDown, ChevronUp, Brain, Heart, Zap, Shield, Target, Users, Calendar, FileText, TrendingUp, AlertTriangle } from 'lucide-react';

// Mock UI components (replace with actual shadcn/ui imports)
const Card = ({ children, className = "" }) => (
  <div className={`bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="p-6 pb-4">{children}</div>
);

const CardContent = ({ children }) => (
  <div className="p-6 pt-0">{children}</div>
);

const CardTitle = ({ children }) => (
  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{children}</h3>
);

const Button = ({ children, onClick, variant = "default", size = "default", className = "" }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  const variantClasses = variant === "outline" 
    ? "border border-input bg-background hover:bg-accent hover:text-accent-foreground" 
    : "bg-primary text-primary-foreground hover:bg-primary/90";
  const sizeClasses = size === "sm" ? "h-9 px-3 text-sm" : "h-10 px-4 py-2";
  
  return (
    <button 
      onClick={onClick} 
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
    >
      {children}
    </button>
  );
};

const Slider = ({ defaultValue, max, step, onValueChange, className = "" }) => {
  const [value, setValue] = useState(defaultValue[0]);
  
  const handleChange = (e) => {
    const newValue = parseInt(e.target.value);
    setValue(newValue);
    onValueChange([newValue]);
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="range"
        min="0"
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        {Array.from({ length: max + 1 }, (_, i) => (
          <span key={i}>{i}</span>
        ))}
      </div>
    </div>
  );
};

const Label = ({ children, htmlFor, className = "" }) => (
  <label htmlFor={htmlFor} className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>
    {children}
  </label>
);

const RadioGroup = ({ children, value, onValueChange, className = "" }) => {
  return (
    <div className={className} role="radiogroup">
      {React.Children.map(children, child =>
        React.cloneElement(child, { selectedValue: value, onValueChange })
      )}
    </div>
  );
};

const RadioGroupItem = ({ value, id, selectedValue, onValueChange }) => (
  <input
    type="radio"
    id={id}
    value={value}
    checked={selectedValue === value}
    onChange={() => onValueChange(value)}
    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
  />
);

// Enhanced pain management data based on the article
const painManagementData = {
  assessment: {
    id: "assessment",
    title: "Comprehensive Pain Assessment",
    severity: "assessment",
    icon: Activity,
    content: [
      "Conduct comprehensive pain history using PQRST method: Provocation/Palliation, Quality, Region/Radiation, Severity, Timing",
      "Assess functional impact on Activities of Daily Living (ADLs), sleep quality, mood, appetite, and social interactions",
      "Evaluate psychosocial factors: anxiety, depression, coping mechanisms, spiritual beliefs, cultural background, financial concerns",
      "Perform focused physical examination to identify potential pain generators and neurological deficits",
      "Review previous pain treatments, their effectiveness, side effects, and patient preferences"
    ],
    tools: [
      "Numeric Rating Scale (NRS 0-10) - Most commonly used",
      "Visual Analog Scale (VAS) - For patients who can use visual markers",
      "Wong-Baker FACES Scale - For children or cognitively impaired",
      "Edmonton Symptom Assessment System (ESAS) - Comprehensive symptom assessment",
      "Pain Diary/Log - For tracking patterns and triggers"
    ],
    painTypes: [
      { type: "Nociceptive - Somatic", description: "Sharp, localized pain (e.g., bone metastases)", example: "Aching, stabbing, throbbing" },
      { type: "Nociceptive - Visceral", description: "Dull, cramping, poorly localized (e.g., liver capsule distension)", example: "Deep, cramping, pressure-like" },
      { type: "Neuropathic", description: "Burning, electric, shooting pain from nerve damage", example: "Post-chemotherapy neuropathy, diabetic neuropathy" },
      { type: "Mixed Pain", description: "Combination of nociceptive and neuropathic", example: "Common in advanced cancer" },
      { type: "Nociplastic", description: "Pain without clear tissue damage or nerve injury", example: "Fibromyalgia-like pain" },
      { type: "Total Pain", description: "Integration of physical, emotional, spiritual, and social suffering", example: "Holistic approach in palliative care" }
    ]
  },
  mild: {
    id: "mild",
    title: "Mild Pain Management (NRS 1-3)",
    severity: "mild",
    icon: Pill,
    whoStep: "Step 1",
    primaryApproach: "Non-Opioid Analgesics ± Adjuvants",
    medications: [
      {
        name: "Acetaminophen (Paracetamol)",
        dosing: "500-1000mg every 6 hours (max 3g/day in palliative care)",
        notes: "Liver-safe alternative, monitor LFTs with prolonged use",
        contraindications: "Severe liver disease",
        route: "PO or IV"
      },
      {
        name: "NSAIDs",
        examples: "Ibuprofen 400-600mg q6h, Naproxen 250-500mg q12h, Celecoxib 100-200mg q12h",
        notes: "Effective for bone, soft tissue, and inflammatory pain",
        contraindications: "GI bleeding risk, renal impairment, heart failure",
        monitoring: "Consider GI protection (PPI), monitor renal function and BP"
      }
    ],
    adjuvants: [
      "Topical lidocaine for localized neuropathic pain",
      "Low-dose tricyclic antidepressants if neuropathic component suspected",
      "Gabapentinoids for neuropathic features"
    ],
    nonPharmacological: [
      "Heat/cold application for localized pain",
      "Positioning and supportive devices (pillows, braces)",
      "Gentle stretching and range-of-motion exercises",
      "Distraction techniques (music, reading, conversation)",
      "Relaxation techniques (deep breathing, progressive muscle relaxation)",
      "TENS (Transcutaneous Electrical Nerve Stimulation)",
      "Physical therapy and massage",
      "Acupuncture"
    ],
    redFlags: [
      "Pain persisting >1-2 weeks despite appropriate measures",
      "New neurological symptoms or deficits",
      "Pain intensity disproportionate to apparent cause",
      "Signs of systemic illness or infection"
    ],
    clinicalPearls: [
      "Ensure regular dosing of acetaminophen/NSAIDs if pain is constant rather than PRN",
      "Re-evaluate underlying diagnosis if pain doesn't respond as expected",
      "Consider combination therapy early for better efficacy"
    ]
  },
  moderate: {
    id: "moderate",
    title: "Moderate Pain Management (NRS 4-6)",
    severity: "moderate",
    icon: Pill,
    whoStep: "Step 2",
    primaryApproach: "Weak Opioids + Non-Opioids ± Adjuvants",
    medications: [
      {
        name: "Tramadol",
        dosing: "50-100mg every 6 hours (max 400mg/day)",
        notes: "Dual mechanism: opioid and monoamine reuptake inhibition",
        contraindications: "Seizure disorder, MAOIs",
        sideEffects: "Nausea, dizziness, constipation, serotonin syndrome risk"
      },
      {
        name: "Codeine combinations",
        dosing: "30-60mg codeine every 4-6 hours",
        notes: "Often combined with acetaminophen or ibuprofen",
        contraindications: "CYP2D6 poor metabolizers, respiratory depression risk",
        sideEffects: "Constipation, nausea, sedation"
      }
    ],
    continuedTherapies: [
      "Maintain regular dosing of acetaminophen if no contraindications",
      "Continue appropriate NSAIDs with GI protection if indicated",
      "Optimize adjuvant medications based on pain characteristics"
    ],
    adjuvantFocus: [
      "Gabapentin 100-300mg TID, titrate up to 1800mg/day for neuropathic pain",
      "Pregabalin 75mg BID, titrate up to 300mg BID for neuropathic pain",
      "Nortriptyline 10-25mg at bedtime, titrate up to 75mg for neuropathic pain",
      "Duloxetine 30-60mg daily for diabetic neuropathy or fibromyalgia"
    ],
    nonPharmacological: [
      "Continue and intensify mild pain strategies",
      "Structured physical therapy and occupational therapy",
      "Psychological support and counseling",
      "Cognitive Behavioral Therapy (CBT) for pain management",
      "Acupuncture or acupressure",
      "Mindfulness-based stress reduction"
    ],
    sideEffectManagement: [
      "Prophylactic laxative regimen with regular opioid use",
      "Antiemetics for opioid-induced nausea",
      "Monitor for sedation and cognitive effects"
    ],
    redFlags: [
      "Rapid pain escalation requiring frequent dose increases",
      "Opioid side effects limiting further titration",
      "Development of tolerance without pain improvement",
      "Signs of infection or inflammation at pain site",
      "Psychological distress significantly impacting function"
    ],
    clinicalPearls: [
      "Consider adjuvant therapy early if neuropathic features are present",
      "Evaluate for opioid rotation if side effects are problematic",
      "Assess psychosocial factors contributing to total pain experience"
    ]
  },
  severe: {
    id: "severe",
    title: "Severe Pain Management (NRS 7-10)",
    severity: "severe",
    icon: Pill,
    whoStep: "Step 3",
    primaryApproach: "Strong Opioids + Non-Opioids ± Adjuvants",
    strongOpioids: [
      {
        name: "Morphine",
        startingDose: "5-10mg PO q4h or 2-4mg IV/SC q2-4h",
        notes: "Gold standard, multiple formulations available",
        contraindications: "Severe renal impairment (accumulation of metabolites)",
        conversions: "PO:IV ratio 3:1",
        routes: "Oral, IV, SC"
      },
      {
        name: "Oxycodone",
        startingDose: "5mg PO q4-6h",
        notes: "Better tolerated in renal impairment than morphine",
        contraindications: "Severe respiratory depression",
        conversions: "1.5x more potent than morphine PO",
        routes: "Oral, IV"
      },
      {
        name: "Hydromorphone",
        startingDose: "2mg PO q4-6h or 0.5mg IV/SC q2-4h",
        notes: "Highly potent, useful in renal dysfunction",
        contraindications: "Severe respiratory depression",
        conversions: "PO:IV ratio 5:1, 4x more potent than morphine PO",
        routes: "Oral, IV, SC"
      },
      {
        name: "Fentanyl",
        application: "Transdermal patch for stable chronic pain",
        notes: "Only for opioid-tolerant patients, 72-hour duration",
        contraindications: "Acute pain, opioid-naive patients",
        conversions: "25mcg/h patch ≈ 60-90mg morphine PO/day",
        routes: "Transdermal, IV"
      },
      {
        name: "Methadone",
        notes: "NMDA receptor antagonist, good for neuropathic pain",
        specialConsiderations: "Complex pharmacokinetics, QT prolongation risk, requires specialist consultation",
        conversions: "Variable ratio depending on previous opioid dose",
        routes: "Oral"
      },
      {
        name: "Buprenorphine",
        notes: "Partial agonist, ceiling effect for respiratory depression",
        specialConsiderations: "Good for patients with renal impairment",
        routes: "Transdermal, Sublingual"
      }
    ],
    titrationPrinciples: [
      "Start low and titrate rapidly based on frequent reassessment",
      "Breakthrough doses: 10-20% of total 24-hour dose every 1-2 hours PRN",
      "Reassess pain and adjust every 24-48 hours during titration phase",
      "When switching opioids, reduce dose by 25-50% for incomplete cross-tolerance",
      "In palliative care, acceptable to start directly at Step 3 for severe/rapidly escalating pain"
    ],
    multimodalApproach: [
      "Continue acetaminophen if no contraindications",
      "Add appropriate adjuvants based on pain mechanism",
      "Consider corticosteroids for bone metastases or visceral edema",
      "Optimize non-pharmacological interventions"
    ],
    advancedInterventions: [
      "Nerve blocks (celiac plexus, sympathetic blocks)",
      "Epidural or intrathecal analgesia",
      "Spinal cord stimulation",
      "Radiotherapy for bone metastases",
      "Palliative surgical procedures",
      "Ketamine infusion for refractory neuropathic pain",
      "Opioid rotation for side effects or tolerance"
    ],
    sideEffectManagement: [
      "Mandatory prophylactic bowel regimen (stimulant + softener) from day one",
      "Antiemetics for nausea (ondansetron, metoclopramide, haloperidol)",
      "Monitor for sedation and respiratory depression",
      "Manage delirium with low-dose antipsychotics if needed",
      "Consider psychostimulants for persistent sedation"
    ],
    redFlags: [
      "Uncontrolled pain despite aggressive opioid titration",
      "Severe opioid toxicity (respiratory depression, myoclonus, severe sedation)",
      "Suspected opioid-induced hyperalgesia",
      "New or worsening neurological deficits",
      "Sudden complete cessation of pain (potential catastrophic event)"
    ],
    specialistReferral: [
      "Palliative Care consultation strongly recommended",
      "Pain Medicine specialist for interventional procedures",
      "Psychiatry/Psychology for complex psychosocial factors",
      "Spiritual care for existential distress"
    ]
  }
};

const opioidConversionTable = [
  { drug: "Morphine", route: "PO", dose: "30 mg", equivalency: "Standard reference", potency: "1x" },
  { drug: "Morphine", route: "IV/SC", dose: "10 mg", equivalency: "30 mg PO morphine", potency: "3x" },
  { drug: "Oxycodone", route: "PO", dose: "20 mg", equivalency: "30 mg PO morphine", potency: "1.5x" },
  { drug: "Hydromorphone", route: "PO", dose: "7.5 mg", equivalency: "30 mg PO morphine", potency: "4x" },
  { drug: "Hydromorphone", route: "IV/SC", dose: "1.5 mg", equivalency: "30 mg PO morphine", potency: "20x" },
  { drug: "Fentanyl", route: "IV", dose: "0.1 mg (100 mcg)", equivalency: "30 mg PO morphine", potency: "100x" },
  { drug: "Fentanyl Patch", route: "TD", dose: "25 mcg/h", equivalency: "60-90mg morphine PO/day", potency: "Variable" },
  { drug: "Methadone", route: "PO", dose: "Variable*", equivalency: "Requires specialist calculation", potency: "Variable" }
];

const adjuvantMedications = [
  {
    category: "Neuropathic Pain",
    medications: [
      { name: "Gabapentin", dosing: "100-300mg TID, titrate to 1800mg/day", notes: "Adjust for renal function" },
      { name: "Pregabalin", dosing: "75mg BID, titrate to 300mg BID", notes: "More predictable pharmacokinetics" },
      { name: "Nortriptyline", dosing: "10-25mg HS, titrate to 75mg", notes: "Anticholinergic effects" },
      { name: "Duloxetine", dosing: "30-60mg daily", notes: "Good for diabetic neuropathy" }
    ]
  },
  {
    category: "Bone Pain",
    medications: [
      { name: "Dexamethasone", dosing: "4-8mg daily", notes: "For bone mets, visceral edema, CNS pressure" },
      { name: "Zoledronic acid", dosing: "4mg IV monthly", notes: "Bisphosphonate for bone metastases" },
      { name: "Denosumab", dosing: "120mg SC monthly", notes: "Monoclonal antibody for bone mets" }
    ]
  },
  {
    category: "Visceral Pain",
    medications: [
      { name: "Hyoscine butylbromide", dosing: "20mg TID-QID", notes: "Antispasmodic for visceral cramping" },
      { name: "Octreotide", dosing: "100-200mcg SC TID", notes: "For malignant bowel obstruction" }
    ]
  }
];

const nonPharmacologicalInterventions = [
  {
    category: "Physical",
    interventions: [
      "Physical therapy and occupational therapy",
      "Massage therapy",
      "Acupuncture and acupressure",
      "TENS (Transcutaneous Electrical Nerve Stimulation)",
      "Heat and cold therapy",
      "Positioning and supportive devices"
    ]
  },
  {
    category: "Psychological",
    interventions: [
      "Cognitive Behavioral Therapy (CBT)",
      "Relaxation training and deep breathing",
      "Mindfulness-based stress reduction",
      "Distraction techniques",
      "Coping skills training",
      "Biofeedback"
    ]
  },
  {
    category: "Social and Spiritual",
    interventions: [
      "Family counseling and support",
      "Chaplain and spiritual care",
      "Support groups",
      "Cultural considerations",
      "Financial counseling",
      "Advanced care planning"
    ]
  }
];

const PainManagement = () => {
  const [painScore, setPainScore] = useState(0);
  const [selectedCard, setSelectedCard] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [painCharacteristics, setPainCharacteristics] = useState({
    type: undefined,
    location: [],
    duration: undefined,
    pattern: undefined
  });

  const getSeverityFromScore = (score) => {
    if (score === 0) return 'assessment';
    if (score >= 1 && score <= 3) return 'mild';
    if (score >= 4 && score <= 6) return 'moderate';
    if (score >= 7 && score <= 10) return 'severe';
    return 'assessment';
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'mild': return 'text-green-600';
      case 'moderate': return 'text-yellow-600';
      case 'severe': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  const getSeverityBorder = (severity) => {
    switch (severity) {
      case 'mild': return 'border-l-4 border-green-500';
      case 'moderate': return 'border-l-4 border-yellow-500';
      case 'severe': return 'border-l-4 border-red-500';
      default: return 'border-l-4 border-blue-500';
    }
  };

  const handleScoreChange = (value) => {
    setPainScore(value[0]);
    const severity = getSeverityFromScore(value[0]);
    setSelectedCard(severity);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const ExpandableSection = ({ title, children, icon: Icon, isExpanded, onToggle }) => (
    <div className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-indigo-600" />
          <span className="font-medium text-gray-900 dark:text-gray-100">{title}</span>
        </div>
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </button>
      {isExpanded && (
        <div className="p-4 bg-white dark:bg-slate-800">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Palliative Care Pain Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Comprehensive approach to pain assessment and management based on WHO guidelines and evidence-based practices for advanced illness
        </p>
      </div>

      {/* Pain Score Assessment */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-indigo-600" />
            Pain Score Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium mb-4 block">Current Pain Level (0-10 Scale)</Label>
              <Slider
                defaultValue={[painScore]}
                max={10}
                step={1}
                onValueChange={handleScoreChange}
                className="mb-4"
              />
              <div className="flex justify-between text-sm text-gray-500 mb-4">
                <span>No Pain (0)</span>
                <span>Worst Possible Pain (10)</span>
              </div>
              <div className="text-center">
                <span className={`text-3xl font-bold ${getSeverityColor(getSeverityFromScore(painScore))}`}>
                  {painScore}
                </span>
                <span className="text-lg text-gray-500 ml-2">/ 10</span>
                <div className="mt-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Classification: {getSeverityFromScore(painScore) === 'assessment' ? 'No Pain' : 
                                   getSeverityFromScore(painScore).charAt(0).toUpperCase() + getSeverityFromScore(painScore).slice(1)} Pain
                  </span>
                </div>
              </div>
            </div>

            {painScore >= 7 && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-800 dark:text-red-300">Severe Pain Alert</h4>
                    <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                      Immediate intervention required. Consider rescue medication, dose adjustment, or specialist consultation. 
                      In palliative care, it's acceptable to start directly at WHO Step 3 for severe pain.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pain Characteristics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-indigo-600" />
            Pain Characteristics Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-base font-medium mb-3 block">Pain Type</Label>
              <RadioGroup
                value={painCharacteristics.type}
                onValueChange={(value) => setPainCharacteristics(prev => ({ ...prev, type: value }))}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="somatic" id="somatic" />
                  <Label htmlFor="somatic" className="text-sm">Somatic (Sharp, localized)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="visceral" id="visceral" />
                  <Label htmlFor="visceral" className="text-sm">Visceral (Dull, cramping)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="neuropathic" id="neuropathic" />
                  <Label htmlFor="neuropathic" className="text-sm">Neuropathic (Burning, electric)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mixed" id="mixed" />
                  <Label htmlFor="mixed" className="text-sm">Mixed</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="total" id="total" />
                  <Label htmlFor="total" className="text-sm">Total Pain (Physical + Psychosocial)</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-base font-medium mb-3 block">Pain Pattern</Label>
              <RadioGroup
                value={painCharacteristics.pattern}
                onValueChange={(value) => setPainCharacteristics(prev => ({ ...prev, pattern: value }))}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="constant" id="constant" />
                  <Label htmlFor="constant" className="text-sm">Constant</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="intermittent" id="intermittent" />
                  <Label htmlFor="intermittent" className="text-sm">Intermittent</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="breakthrough" id="breakthrough" />
                  <Label htmlFor="breakthrough" className="text-sm">Breakthrough</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="incident" id="incident" />
                  <Label htmlFor="incident" className="text-sm">Incident (Movement-related)</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Management Protocols */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <Stethoscope className="h-6 w-6 text-indigo-600" />
          Management Protocols
        </h2>

        {Object.values(painManagementData).map((protocol) => {
          const Icon = protocol.icon;
          const isSelected = selectedCard === protocol.id;
          const isExpanded = expandedSections[protocol.id] || isSelected;

          return (
            <Card key={protocol.id} className={`${getSeverityBorder(protocol.severity)} ${!isExpanded ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}>
              <CardHeader onClick={() => !isExpanded && toggleSection(protocol.id)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className={`h-6 w-6 ${getSeverityColor(protocol.severity)}`} />
                    <CardTitle className={getSeverityColor(protocol.severity)}>
                      {protocol.title} {protocol.whoStep && `(${protocol.whoStep})`}
                    </CardTitle>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSection(protocol.id);
                    }}
                  >
                    {isExpanded ? 'Collapse' : 'Expand'}
                  </Button>
                </div>
              </CardHeader>
              {isExpanded && (
                <CardContent className="space-y-6">
                  {protocol.primaryApproach && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Primary Approach</h4>
                      <p className="text-blue-700 dark:text-blue-400">{protocol.primaryApproach}</p>
                    </div>
                  )}

                  {protocol.medications && (
                    <ExpandableSection
                      title="Medications"
                      icon={Pill}
                      isExpanded={expandedSections[`${protocol.id}-meds`]}
                      onToggle={() => toggleSection(`${protocol.id}-meds`)}
                    >
                      <div className="space-y-4">
                        {protocol.medications.map((med, idx) => (
                          <div key={idx} className="border-b border-gray-200 dark:border-slate-700 pb-4 last:border-0 last:pb-0">
                            <h5 className="font-medium text-gray-900 dark:text-gray-100">{med.name}</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                              <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400"><span className="font-medium">Dosing:</span> {med.dosing}</p>
                                {med.examples && <p className="text-sm text-gray-600 dark:text-gray-400"><span className="font-medium">Examples:</span> {med.examples}</p>}
                              </div>
                              <div>
                                {med.notes && <p className="text-sm text-gray-600 dark:text-gray-400"><span className="font-medium">Notes:</span> {med.notes}</p>}
                                {med.contraindications && <p className="text-sm text-gray-600 dark:text-gray-400"><span className="font-medium">Contraindications:</span> {med.contraindications}</p>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ExpandableSection>
                  )}

                  {protocol.strongOpioids && (
                    <ExpandableSection
                      title="Strong Opioids"
                      icon={AlertCircle}
                      isExpanded={expandedSections[`${protocol.id}-opioids`]}
                      onToggle={() => toggleSection(`${protocol.id}-opioids`)}
                    >
                      <div className="space-y-4">
                        {protocol.strongOpioids.map((opioid, idx) => (
                          <div key={idx} className="border-b border-gray-200 dark:border-slate-700 pb-4 last:border-0 last:pb-0">
                            <h5 className="font-medium text-gray-900 dark:text-gray-100">{opioid.name}</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                              <div>
                                {opioid.startingDose && <p className="text-sm text-gray-600 dark:text-gray-400"><span className="font-medium">Starting Dose:</span> {opioid.startingDose}</p>}
                                {opioid.application && <p className="text-sm text-gray-600 dark:text-gray-400"><span className="font-medium">Application:</span> {opioid.application}</p>}
                                {opioid.conversions && <p className="text-sm text-gray-600 dark:text-gray-400"><span className="font-medium">Conversions:</span> {opioid.conversions}</p>}
                                {opioid.routes && <p className="text-sm text-gray-600 dark:text-gray-400"><span className="font-medium">Routes:</span> {opioid.routes}</p>}
                              </div>
                              <div>
                                {opioid.notes && <p className="text-sm text-gray-600 dark:text-gray-400"><span className="font-medium">Notes:</span> {opioid.notes}</p>}
                                {opioid.contraindications && <p className="text-sm text-gray-600 dark:text-gray-400"><span className="font-medium">Contraindications:</span> {opioid.contraindications}</p>}
                                {opioid.specialConsiderations && <p className="text-sm text-gray-600 dark:text-gray-400"><span className="font-medium">Special Considerations:</span> {opioid.specialConsiderations}</p>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ExpandableSection>
                  )}

                  {protocol.adjuvants && (
                    <ExpandableSection
                      title="Adjuvant Medications"
                      icon={Shield}
                      isExpanded={expandedSections[`${protocol.id}-adjuvants`]}
                      onToggle={() => toggleSection(`${protocol.id}-adjuvants`)}
                    >
                      <ul className="space-y-2 list-disc pl-5">
                        {protocol.adjuvants.map((adjuvant, idx) => (
                          <li key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                            {adjuvant}
                          </li>
                        ))}
                      </ul>
                    </ExpandableSection>
                  )}

                  {protocol.nonPharmacological && (
                    <ExpandableSection
                      title="Non-Pharmacological Interventions"
                      icon={Heart}
                      isExpanded={expandedSections[`${protocol.id}-nonpharm`]}
                      onToggle={() => toggleSection(`${protocol.id}-nonpharm`)}
                    >
                      <ul className="space-y-2 list-disc pl-5">
                        {protocol.nonPharmacological.map((intervention, idx) => (
                          <li key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                            {intervention}
                          </li>
                        ))}
                      </ul>
                    </ExpandableSection>
                  )}

                  {protocol.redFlags && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                      <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        Red Flags and Warnings
                      </h4>
                      <ul className="space-y-2 list-disc pl-5 text-red-700 dark:text-red-400">
                        {protocol.redFlags.map((flag, idx) => (
                          <li key={idx} className="text-sm">
                            {flag}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {protocol.clinicalPearls && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        Clinical Pearls
                      </h4>
                      <ul className="space-y-2 list-disc pl-5 text-blue-700 dark:text-blue-400">
                        {protocol.clinicalPearls.map((pearl, idx) => (
                          <li key={idx} className="text-sm">
                            {pearl}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {protocol.titrationPrinciples && (
                    <ExpandableSection
                      title="Titration Principles"
                      icon={TrendingUp}
                      isExpanded={expandedSections[`${protocol.id}-titration`]}
                      onToggle={() => toggleSection(`${protocol.id}-titration`)}
                    >
                      <ul className="space-y-2 list-disc pl-5">
                        {protocol.titrationPrinciples.map((principle, idx) => (
                          <li key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                            {principle}
                          </li>
                        ))}
                      </ul>
                    </ExpandableSection>
                  )}

                  {protocol.sideEffectManagement && (
                    <ExpandableSection
                      title="Side Effect Management"
                      icon={AlertTriangle}
                      isExpanded={expandedSections[`${protocol.id}-sideeffects`]}
                      onToggle={() => toggleSection(`${protocol.id}-sideeffects`)}
                    >
                      <ul className="space-y-2 list-disc pl-5">
                        {protocol.sideEffectManagement.map((management, idx) => (
                          <li key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                            {management}
                          </li>
                        ))}
                      </ul>
                    </ExpandableSection>
                  )}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Opioid Conversion Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-indigo-600" />
            Opioid Equianalgesic Conversion Table
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
              <thead className="bg-gray-50 dark:bg-slate-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Drug</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Route</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Equianalgesic Dose</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Relative Potency</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                {opioidConversionTable.map((row, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{row.drug}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{row.route}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{row.dose} {row.equivalency && `≈ ${row.equivalency}`}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{row.potency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            <p><strong>Note:</strong> Methadone has a nonlinear conversion depending on previous opioid exposure. Consult specialist or use conservative conversion ratios and titrate carefully.</p>
          </div>
        </CardContent>
      </Card>

      {/* Adjuvant Medications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-indigo-600" />
            Adjuvant Medications by Pain Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {adjuvantMedications.map((category, idx) => (
              <div key={idx} className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden">
                <div className="bg-gray-50 dark:bg-slate-700 p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">{category.category}</h4>
                </div>
                <div className="p-4">
                  <ul className="space-y-4">
                    {category.medications.map((med, medIdx) => (
                      <li key={medIdx}>
                        <h5 className="font-medium text-gray-900 dark:text-gray-100">{med.name}</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400"><span className="font-medium">Dosing:</span> {med.dosing}</p>
                        {med.notes && <p className="text-sm text-gray-600 dark:text-gray-400"><span className="font-medium">Notes:</span> {med.notes}</p>}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Non-Pharmacological Interventions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-600" />
            Non-Pharmacological Interventions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {nonPharmacologicalInterventions.map((category, idx) => (
              <div key={idx} className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden">
                <div className="bg-gray-50 dark:bg-slate-700 p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">{category.category}</h4>
                </div>
                <div className="p-4">
                  <ul className="space-y-2 list-disc pl-5">
                    {category.interventions.map((intervention, intIdx) => (
                      <li key={intIdx} className="text-sm text-gray-700 dark:text-gray-300">
                        {intervention}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* End-of-Life Considerations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-600" />
            End-of-Life Pain Management Considerations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
              <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">Key Principles</h4>
              <ul className="space-y-2 list-disc pl-5 text-purple-700 dark:text-purple-400">
                <li>Use parenteral routes if oral not tolerated (SC or IV preferred)</li>
                <li>Continuous opioid infusions (e.g., morphine, hydromorphone) for stable pain control</li>
                <li>Maintain breakthrough PRN doses (10-20% of total daily dose)</li>
                <li>Consider palliative sedation for intractable suffering</li>
                <li>Ensure family education on signs of distress and medication use</li>
              </ul>
            </div>

            <ExpandableSection
              title="Common End-of-Life Medications"
              icon={Pill}
              isExpanded={expandedSections['eol-meds']}
              onToggle={() => toggleSection('eol-meds')}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-gray-100">Continuous Infusions</h5>
                  <ul className="space-y-2 mt-2">
                    <li className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Morphine:</span> 2-4mg SC q2-4h or 10-30mg/24h SC infusion
                    </li>
                    <li className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Hydromorphone:</span> 0.5mg SC q2-4h or 2-4mg/24h SC infusion
                    </li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-gray-100">Breakthrough Doses</h5>
                  <ul className="space-y-2 mt-2">
                    <li className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Morphine:</span> 2-4mg SC q1h PRN
                    </li>
                    <li className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Hydromorphone:</span> 0.5mg SC q1h PRN
                    </li>
                  </ul>
                </div>
              </div>
            </ExpandableSection>

            <ExpandableSection
              title="Symptom Management"
              icon={Stethoscope}
              isExpanded={expandedSections['eol-symptoms']}
              onToggle={() => toggleSection('eol-symptoms')}
            >
              <div className="space-y-4">
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-gray-100">Respiratory Secretions</h5>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Glycopyrrolate:</span> 0.2mg SC q4-6h or 0.6-1.2mg/24h SC infusion
                  </p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-gray-100">Agitation/Delirium</h5>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Haloperidol:</span> 0.5-2mg SC q4-6h PRN
                  </p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-gray-100">Nausea/Vomiting</h5>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Metoclopramide:</span> 10mg SC q6h or 40-60mg/24h SC infusion
                  </p>
                </div>
              </div>
            </ExpandableSection>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PainManagement;
