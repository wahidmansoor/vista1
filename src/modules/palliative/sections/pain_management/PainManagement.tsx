import React, { useState } from 'react';
import { Activity, Clock, Stethoscope, PieChart, Pill, AlertCircle, BookOpen, ChevronDown, ChevronUp, LucideProps, LucideIcon, Brain } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'; // Assuming ShadCN UI path
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card'; // Assuming ShadCN UI path
import { Button } from '@/components/ui/button'; // Assuming ShadCN UI path
import { cn } from '@/lib/utils'; // Assuming utility function exists
import { Disclosure } from '@headlessui/react'; // Assuming headlessui is installed
import { usePalliativeCare } from "../../context/PalliativeContext";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertTriangle } from "lucide-react";

// Define interfaces for the card data structures
interface BasePainCard {
  id: string;
  title: string;
  severity: 'none' | 'mild' | 'moderate' | 'severe';
  icon: LucideIcon;
  handbookSectionId?: string; // Optional handbook link ID
}

interface AssessmentPainCard extends BasePainCard {
  severity: 'none';
  content: string[];
  tools: string[];
}

interface TreatmentPainCard extends BasePainCard {
  severity: 'mild' | 'moderate' | 'severe';
  drugInfo: string;
  recommendations: string[];
  nonPharm: string[];
  redFlags?: string[]; // Optional red flags
  suggestions?: string[]; // Optional smart suggestions
}

// Union type for any pain card
type PainCard = AssessmentPainCard | TreatmentPainCard;

// Type assertion for the data structure with updated content
const painCardsData: { [key: string]: PainCard } = {
  assessment: {
    id: "assessment",
    title: "Pain Assessment",
    severity: "none",
    icon: Activity,
    content: [
      "Conduct a comprehensive pain history: Location, Quality, Intensity (score), Timing (onset, duration, frequency), Radiation, Aggravating/Relieving factors, Associated symptoms.",
      "Assess impact on function: Activities of Daily Living (ADLs), sleep, mood, appetite, social interaction.",
      "Evaluate psychosocial factors: Anxiety, depression, coping mechanisms, spiritual beliefs, cultural background, financial concerns.",
      "Perform relevant physical examination: Identify potential pain generators, neurological deficits.",
      "Review past medical history, previous pain treatments and their effectiveness/side effects.",
    ],
    tools: ["Numeric Rating Scale (NRS 0-10)", "Visual Analog Scale (VAS)", "Wong-Baker FACES Scale", "Edmonton Symptom Assessment System (ESAS)", "Pain Diary/Log"],
    handbookSectionId: "pain-assessment-details"
  },
  mild: {
    id: "mild",
    title: "Mild Pain (NRS 1-3)",
    severity: "mild",
    icon: Pill,
    drugInfo: "Non-Opioid Analgesics +/- Adjuvants",
    recommendations: [
      "Acetaminophen (Paracetamol): Up to 1g QID (max 3-4g/day). Monitor LFTs with prolonged use or risk factors.",
      "NSAIDs (e.g., Ibuprofen, Naproxen, Celecoxib): Use lowest effective dose for shortest duration. Consider GI protection (PPI) and monitor renal function/BP. Avoid in high-risk patients (renal impairment, heart failure, history of GI bleed).",
      "Adjuvants: Consider based on pain type (e.g., topical lidocaine for localized neuropathic pain, low-dose TCA/gabapentinoid if neuropathic component suspected).",
    ],
    nonPharm: [
      "Heat/cold application",
      "Positioning, supportive devices (pillows, braces)",
      "Gentle stretching/exercise",
      "Distraction (music, reading, conversation)",
      "Relaxation techniques (deep breathing, mindfulness)",
      "Transcutaneous Electrical Nerve Stimulation (TENS)"
    ],
    redFlags: ["Pain persisting > 1-2 weeks despite measures", "New neurological symptoms", "Pain disproportionate to apparent cause"],
    suggestions: ["Ensure regular dosing of Acetaminophen/NSAIDs if pain is constant.", "Re-evaluate diagnosis if pain doesn't respond as expected."]
  },
  moderate: {
    id: "moderate",
    title: "Moderate Pain (NRS 4-6)",
    severity: "moderate",
    icon: Pill,
    drugInfo: "Weak Opioids +/- Non-Opioids/Adjuvants",
    recommendations: [
      "Weak Opioids: Codeine (often in combination products), Tramadol. Start low, titrate cautiously. Monitor for constipation, nausea, sedation, dizziness.",
      "Continue/Optimize Non-Opioids: Ensure regular dosing of Acetaminophen/NSAIDs if appropriate.",
      "Add/Titrate Adjuvants: Especially important if neuropathic pain suspected (e.g., Gabapentin, Pregabalin, TCAs like Nortriptyline, SNRIs like Duloxetine).",
      "Consider short-acting opioid for breakthrough pain if using scheduled weak opioid.",
      "Prophylactic laxative regimen recommended with regular opioid use."
    ],
    nonPharm: [
      "Continue/intensify mild pain strategies",
      "Structured physical therapy/occupational therapy",
      "Psychological support (counseling, CBT)",
      "Acupuncture/Acupressure"
    ],
    redFlags: ["Rapid pain escalation", "Opioid side effects limiting titration (sedation, confusion)", "Development of opioid tolerance without improvement", "Signs of infection at pain site"],
    suggestions: ["Consider adjuvant therapy early if neuropathic features present.", "Evaluate for opioid rotation if side effects are problematic.", "Assess psychosocial factors contributing to pain."]
  },
  severe: {
    id: "severe",
    title: "Severe Pain (NRS 7-10)",
    severity: "severe",
    icon: Pill,
    drugInfo: "Strong Opioids +/- Non-Opioids/Adjuvants",
    recommendations: [
      "Strong Opioids: Morphine, Oxycodone, Hydromorphone (start with immediate-release). Fentanyl patch for stable, chronic pain (use with caution, requires careful conversion).",
      "Titration: Start low, titrate rapidly based on frequent reassessment and breakthrough dose requirements (typically 10-15% of total daily dose q1-4h PRN).",
      "Equianalgesic Dosing: Use conversion tables carefully when switching opioids or routes. Reduce dose by 25-50% for incomplete cross-tolerance.",
      "Continue Non-Opioids/Adjuvants: Maximize multimodal analgesia.",
      "Essential: Prophylactic bowel regimen (stimulant + softener). Manage other side effects (nausea, sedation).",
      "Consider long-acting/extended-release formulations once pain is stable on IR opioid.",
      "Consultation: Palliative Care / Pain Specialist strongly recommended."
    ],
    nonPharm: [
      "Continue previous strategies as tolerated",
      "Interventional techniques (consider early): Nerve blocks, epidural/intrathecal analgesia, spinal cord stimulators.",
      "Radiotherapy for bone metastases",
      "Palliative surgery/procedures",
      "Comprehensive psychosocial and spiritual support"
    ],
    redFlags: ["Uncontrolled pain despite aggressive titration", "Severe opioid toxicity (respiratory depression, myoclonus, severe sedation/delirium)", "Suspected opioid-induced hyperalgesia", "New/worsening neurological deficit (e.g., cauda equina syndrome)", "Sudden cessation of pain (potential catastrophic event)"],
    suggestions: ["Refer to Interventional Pain Team if inadequate response or dose-limiting side effects.", "Consider ketamine infusion for refractory neuropathic/central pain.", "Address existential distress contributing to total pain."]
  }
};

// Helper function for severity colors
const getSeverityClasses = (severity: PainCard['severity']): string => {
  switch (severity) {
    case 'mild':
      return 'border-l-4 border-green-500 dark:border-green-400';
    case 'moderate':
      return 'border-l-4 border-yellow-500 dark:border-yellow-400';
    case 'severe':
      return 'border-l-4 border-red-500 dark:border-red-400';
    default: // 'none' for assessment
      return 'border-l-4 border-blue-500 dark:border-blue-400';
  }
};

// Type guard to check if a card is an AssessmentPainCard
function isAssessmentCard(card: PainCard): card is AssessmentPainCard {
  return card.severity === 'none';
}

interface PainCharacteristics {
  type: 'somatic' | 'visceral' | 'neuropathic' | 'mixed' | undefined;
  location: string[];
  duration: 'acute' | 'chronic' | undefined;
  pattern: 'constant' | 'intermittent' | 'breakthrough' | undefined;
  aggravators: string[];
  relievers: string[];
}

const initialPainCharacteristics: PainCharacteristics = {
  type: undefined,
  location: [],
  duration: undefined,
  pattern: undefined,
  aggravators: [],
  relievers: []
};

const PainManagement = () => {
  const { state, setPainScore } = usePalliativeCare();
  const [characteristics, setCharacteristics] = React.useState<PainCharacteristics>(initialPainCharacteristics);
  const cardIds = Object.values(painCardsData).map(card => card.id);
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [highlightedCardId, setHighlightedCardId] = useState<string | null>(null);

  const handleExpandAll = () => setOpenItems(cardIds);
  const handleCollapseAll = () => setOpenItems([]);
  const toggleAll = () => openItems.length === cardIds.length ? handleCollapseAll() : handleExpandAll();

  const getSeverityFromScore = (score: number | null): PainCard['severity'] => {
    if (score === null || score === 0) return 'none';
    if (score >= 1 && score <= 3) return 'mild';
    if (score >= 4 && score <= 6) return 'moderate';
    if (score >= 7 && score <= 10) return 'severe';
    return 'none';
  };

  const handleScoreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const score = parseInt(event.target.value, 10);
    if (isNaN(score)) {
        handleResetScore();
        return;
    }

    setSelectedScore(score);
    const severity = getSeverityFromScore(score);
    const targetCardId = severity !== 'none' ? severity : null; // 'mild', 'moderate', 'severe' are the IDs
    setHighlightedCardId(targetCardId);

    // Auto-expand the corresponding card
    if (targetCardId && !openItems.includes(targetCardId)) {
      setOpenItems(prevOpenItems => [...prevOpenItems, targetCardId]);
    }
  };

  const handleResetScore = () => {
    setSelectedScore(null);
    setHighlightedCardId(null);
    // Optionally collapse the previously highlighted card or all cards
    // setOpenItems([]); // Uncomment to collapse all on reset
  };
  const handlePainTypeChange = (value: string) => {
    setCharacteristics(prev => ({
      ...prev,
      type: value as PainCharacteristics['type']
    }));
  };

  const handlePainPatternChange = (value: string) => {
    setCharacteristics(prev => ({
      ...prev,
      pattern: value as PainCharacteristics['pattern']
    }));
  };

  const handlePainDurationChange = (value: string) => {
    setCharacteristics(prev => ({
      ...prev,
      duration: value as PainCharacteristics['duration']
    }));
  };

  const getPainSeverityColor = (score: number) => {
    if (score >= 7) return 'text-red-600';
    if (score >= 4) return 'text-yellow-600';
    return 'text-green-600';
  };

  const handleSliderChange = (value: number[]) => {
    setPainScore(value[0]);
  };

  return (
    <div className="space-y-8">

      {/* Pain Score Evaluator */}
      <section className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-200 dark:border-slate-700">
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex justify-between w-full items-center text-left text-lg font-semibold text-gray-900 dark:text-gray-100">
                <span>Pain Score Evaluator</span>
                <ChevronDown className={`${open ? 'transform rotate-180' : ''} w-5 h-5 text-indigo-500`} />
              </Disclosure.Button>
              <Disclosure.Panel className="pt-4 mt-4 border-t border-gray-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <label htmlFor="pain-score" className="font-medium">Select Pain Score (0-10):</label>
                  <select
                    id="pain-score"
                    value={selectedScore ?? ''}
                    onChange={handleScoreChange}
                    className="flex-grow p-2 border rounded-md bg-white dark:bg-slate-700 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="" disabled>Select score...</option>
                    {[...Array(11).keys()].map(i => (
                      <option key={i} value={i}>{i} {
                        i === 0 ? '(None)' :
                        i >= 1 && i <= 3 ? '(Mild)' :
                        i >= 4 && i <= 6 ? '(Moderate)' :
                        '(Severe)'
                      }</option>
                    ))}
                  </select>
                  <Button onClick={handleResetScore} variant="outline" size="sm">Reset</Button>
                </div>
                {selectedScore !== null && (
                  <p className="mt-3 text-xs italic">
                    Score {selectedScore} corresponds to {getSeverityFromScore(selectedScore)} pain. Highlighted card below.
                  </p>
                )}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </section>

      {/* Pain Assessment & Management Cards */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <Activity className="h-6 w-6 text-indigo-500" />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Pain Assessment & Management</span>
          </h2>
          <Button onClick={toggleAll} variant="outline" size="sm">
            {openItems.length === cardIds.length ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
            {openItems.length === cardIds.length ? 'Collapse All' : 'Expand All'}
          </Button>
        </div>

        <Accordion
          type="multiple"
          value={openItems}
          onValueChange={setOpenItems}
          className="w-full space-y-4"
        >
          {Object.values(painCardsData).map((card: PainCard) => {
            const IconComponent = card.icon;
            const Icon = IconComponent as React.FC<LucideProps>;
            const isHighlighted = card.id === highlightedCardId;
            return (
              <AccordionItem value={card.id} key={card.id} className="border-none">
                <Card className={cn(
                  "overflow-hidden rounded-xl shadow-md dark:bg-slate-800/60 backdrop-blur-lg border border-gray-300/30 dark:border-slate-700/50 transition-all duration-300",
                  getSeverityClasses(card.severity),
                  isHighlighted && "ring-2 ring-offset-2 ring-indigo-500 dark:ring-offset-slate-900" // Highlight style
                )}>
                  <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-100/50 dark:hover:bg-slate-700/50 transition-colors">
                    <div className="flex items-center gap-3 w-full">
                      <Icon className={cn("h-5 w-5",
                        card.severity === 'none' ? 'text-blue-500 dark:text-blue-400' :
                        card.severity === 'mild' ? 'text-green-500 dark:text-green-400' :
                        card.severity === 'moderate' ? 'text-yellow-500 dark:text-yellow-400' :
                        'text-red-500 dark:text-red-400'
                      )} />
                      <div className="flex-1">
                        <h3 className="text-md font-semibold text-gray-900 dark:text-gray-100">{card.title}</h3>
                      </div>
                      {/* Optional: Handbook Link */}
                      {card.handbookSectionId && (
                        <a href={`/handbook/${card.handbookSectionId}`} // Adjust link as needed
                           onClick={(e) => e.stopPropagation()} // Prevent accordion toggle
                           className="ml-auto text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                          <BookOpen className="h-3 w-3" /> Handbook
                        </a>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pt-0 pb-4">
                    <div className="space-y-4 text-slate-700 dark:text-slate-300 text-sm">
                      {isAssessmentCard(card) ? (
                        // Assessment Card Content
                        <>
                          {card.content.map((point: string, index: number) => <p key={index}>{point}</p>)}
                          {card.tools && (
                            <div className="mt-3 pt-3 border-t border-gray-300/50 dark:border-slate-700/50">
                              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-1">Common Tools:</h4>
                              <ul className="list-disc list-inside pl-2 space-y-1">
                                {card.tools.map((tool: string, idx: number) => <li key={idx}>{tool}</li>)}
                              </ul>
                            </div>
                          )}
                        </>
                      ) : (
                        // Treatment Card Content (Mild, Moderate, Severe)
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Drug Info */}
                            <div>
                              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
                                <Pill className="h-4 w-4 text-indigo-500" /> Pharmacological Approach
                              </h4>
                              <p className="font-semibold text-indigo-600 dark:text-indigo-400 mb-2">{card.drugInfo}</p>
                              <ul className="list-disc list-inside pl-2 space-y-1">
                                {card.recommendations?.map((rec: string, idx: number) => <li key={idx}>{rec}</li>)}
                              </ul>
                            </div>

                            {/* Non-Pharm */}
                            <div>
                              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Non-Pharmacological Tips</h4>
                              <ul className="list-disc list-inside pl-2 space-y-1">
                                {card.nonPharm?.map((tip: string, idx: number) => <li key={idx}>{tip}</li>)}
                              </ul>
                            </div>

                            {/* Red Flags */}
                            {card.redFlags && card.redFlags.length > 0 && (
                              <div className="md:col-span-2 mt-2 border-t border-gray-300/50 dark:border-slate-700/50 pt-3">
                                <h4 className="font-medium text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
                                  <AlertCircle className="h-4 w-4" /> Red Flags
                                </h4>
                                <ul className="list-disc list-inside pl-2 space-y-1 text-red-700 dark:text-red-300">
                                  {card.redFlags.map((flag: string, idx: number) => <li key={idx}>{flag}</li>)}
                                </ul>
                              </div>
                            )}
                          </div>

                          {/* Smart Suggestions */}
                          {card.suggestions && card.suggestions.length > 0 && (
                            <div className="mt-4 pt-3 border-t border-gray-300/50 dark:border-slate-700/50">
                              <h4 className="font-medium text-indigo-600 dark:text-indigo-400 mb-2 flex items-center gap-2 text-xs uppercase tracking-wider">
                                <Brain className="h-4 w-4" /> Smart Suggestions
                              </h4>
                              <ul className="list-disc list-inside pl-2 space-y-1 text-sm text-indigo-700 dark:text-indigo-300">
                                {card.suggestions.map((suggestion: string, idx: number) => <li key={idx}>{suggestion}</li>)}
                              </ul>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            );
          })}
        </Accordion>
      </section>

      {/* Existing Sections (Keep them below the new Accordion) */}
      {/* Pain Management Guidelines */}
      <section className="bg-gradient-to-br from-indigo-50/10 to-purple-50/10 backdrop-blur-lg p-6 rounded-xl border border-white/20 shadow-md
                         hover:shadow-xl transition-all duration-300 ease-in-out">
         {/* ... existing guideline content ... */}
         <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
           <Stethoscope className="h-6 w-6 text-indigo-500" />
           <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Treatment Guidelines Overview</span>
         </h3>
         {/* ... rest of the existing guideline content ... */}
      </section>

      {/* Monitoring and Follow-up */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* ... existing monitoring content ... */}
         <div className="bg-gradient-to-br from-indigo-50/10 to-purple-50/10 backdrop-blur-lg p-6 rounded-xl border border-gray-200/40 dark:border-slate-700/50 shadow-md
                       hover:shadow-xl hover:scale-102 transition-all duration-300 ease-in-out">
           <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
             <Clock className="h-6 w-6 text-indigo-500" />
             <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Monitoring Schedule</span>
           </h3>
           {/* ... rest of the existing monitoring content ... */}
         </div>
         <div className="bg-gradient-to-br from-indigo-50/10 to-purple-50/10 backdrop-blur-lg p-6 rounded-xl border border-gray-200/40 dark:border-slate-700/50 shadow-md
                       hover:shadow-xl hover:scale-102 transition-all duration-300 ease-in-out">
           <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
             <PieChart className="h-6 w-6 text-indigo-500" />
             <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Outcome Measures</span>
           </h3>
           {/* ... rest of the existing outcome measures content ... */}
         </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Pain Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">No Pain</span>
                <span className="text-sm text-gray-500">Worst Pain</span>
              </div>
              <Slider
                defaultValue={[state.painScore]}
                max={10}
                step={1}
                onValueChange={handleSliderChange}
              />
              <div className="mt-4 text-center">
                <span className={`text-2xl font-bold ${getPainSeverityColor(state.painScore)}`}>
                  {state.painScore}
                </span>
                <span className="text-sm text-gray-500 ml-2">/ 10</span>
              </div>
            </div>

            {state.painScore >= 7 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-800">Severe Pain</h4>
                  <p className="text-sm text-red-700 mt-1">
                    Immediate intervention required. Consider rescue medication or dose adjustment.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pain Characteristics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Label>Pain Type</Label>
              <RadioGroup
                value={characteristics.type}
                onValueChange={handlePainTypeChange}
                className="grid grid-cols-2 gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="somatic" id="somatic" />
                  <Label htmlFor="somatic">Somatic</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="visceral" id="visceral" />
                  <Label htmlFor="visceral">Visceral</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="neuropathic" id="neuropathic" />
                  <Label htmlFor="neuropathic">Neuropathic</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mixed" id="mixed" />
                  <Label htmlFor="mixed">Mixed</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Pattern</Label>
              <RadioGroup
                value={characteristics.pattern}
                onValueChange={handlePainPatternChange}
                className="grid grid-cols-2 gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="constant" id="constant" />
                  <Label htmlFor="constant">Constant</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="intermittent" id="intermittent" />
                  <Label htmlFor="intermittent">Intermittent</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="breakthrough" id="breakthrough" />
                  <Label htmlFor="breakthrough">Breakthrough</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Duration</Label>
              <RadioGroup
                value={characteristics.duration}
                onValueChange={handlePainDurationChange}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="acute" id="acute" />
                  <Label htmlFor="acute">Acute</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="chronic" id="chronic" />
                  <Label htmlFor="chronic">Chronic</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Medications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              No pain medications recorded yet.
            </p>
            <Button variant="outline">Add Medication</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PainManagement;
