import React, { useState } from 'react';
import { 
  Activity, 
  Search, 
  AlertCircle, 
  Pill, 
  Wind, 
  Thermometer,
  Droplets,
  Brain,
  PiggyBank,
  GripHorizontal,
  BookOpen
} from 'lucide-react';

// Common utility function from your project
import { cn } from '../../../../lib/utils';

// Type definitions for our symptom data
type SeverityLevel = 'mild' | 'moderate' | 'severe';

interface Treatment {
  drug: string;
  tips: string[];
  flags?: string[];
}

interface SymptomData {
  summary: string;
  levels: Record<SeverityLevel, Treatment>;
  icon: React.ReactNode;
  handbookSectionId?: string;
}

interface SymptomDataCollection {
  [key: string]: SymptomData;
}

// Symptom data structure
const symptomData: SymptomDataCollection = {
  pain: {
    summary: "Pain is one of the most common and distressing symptoms in palliative care. Assessment should include: location, intensity (using validated scales), quality, timing, exacerbating and relieving factors, and impact on function.",
    levels: {
      mild: {
        drug: "Acetaminophen 500-1000mg PO q6h (max 4g/day) or NSAIDs like Ibuprofen 400-600mg PO q6h",
        tips: [
          "Heat or cold therapy",
          "Relaxation techniques",
          "Gentle massage",
          "Position changes"
        ],
        flags: []
      },
      moderate: {
        drug: "Tramadol 50-100mg PO q4-6h or Hydrocodone/Acetaminophen 5-10mg/325mg q4-6h",
        tips: [
          "Combination therapy (non-opioid + opioid)",
          "Scheduled dosing rather than PRN",
          "Adjuvant therapies (e.g., physical therapy)",
          "Psychological support"
        ],
        flags: [
          "Monitor for constipation",
          "Start stool softeners prophylactically"
        ]
      },
      severe: {
        drug: "Morphine 5-10mg PO q4h or Hydromorphone 1-2mg PO q4h; titrate as needed",
        tips: [
          "Use breakthrough dosing (10-15% of 24h total)",
          "Consider adjuvant medications (anticonvulsants, antidepressants)",
          "Consult pain specialist if inadequate relief",
          "Consider route changes if unable to take PO"
        ],
        flags: [
          "Monitor for respiratory depression",
          "Watch for signs of opioid toxicity",
          "Consider opioid rotation if side effects limit dosing",
          "Evaluate for opioid-induced hyperalgesia if pain worsens with increased doses"
        ]
      }
    },
    icon: <Pill className="h-6 w-6" />,
    handbookSectionId: "pain-management"
  },
  dyspnea: {
    summary: "Dyspnea is the subjective sensation of difficulty breathing. Common in advanced disease, it causes significant distress and anxiety. Assessment should include: respiratory rate, use of accessory muscles, oxygen saturation, and patient's subjective experience.",
    levels: {
      mild: {
        drug: "Consider low-dose oral opioids such as Morphine 2.5mg PO q4h PRN",
        tips: [
          "Positioning (upright, leaning forward)",
          "Cool air (fan therapy)",
          "Breathing exercises",
          "Energy conservation"
        ],
        flags: []
      },
      moderate: {
        drug: "Morphine 5mg PO q4h or Hydromorphone 1mg PO q4h; Lorazepam 0.5mg SL PRN for associated anxiety",
        tips: [
          "Supplemental oxygen if hypoxemic",
          "Relaxation techniques",
          "Breathing retraining",
          "Consider pulmonary rehabilitation if appropriate"
        ],
        flags: [
          "Monitor for effectiveness and respiratory depression",
          "Limit benzodiazepines in COPD patients"
        ]
      },
      severe: {
        drug: "Morphine 5-10mg PO q2-4h or 2-5mg IV/SC q2-4h; consider continuous infusion. Midazolam 2.5-5mg SC/IV if anxiety prominent",
        tips: [
          "Oxygen therapy regardless of saturation for comfort",
          "Reduce environmental stimuli",
          "Optimize underlying condition treatment",
          "Consider palliative sedation if refractory"
        ],
        flags: [
          "Close monitoring for respiratory status",
          "Balance symptom control vs. sedation",
          "Discuss goals of care",
          "Consider non-invasive ventilation in select cases"
        ]
      }
    },
    icon: <Wind className="h-6 w-6" />,
    handbookSectionId: "dyspnea-management"
  },
  nausea: {
    summary: "Nausea and vomiting are common symptoms with multiple potential causes in palliative care. Assessment should identify the likely mechanism to guide therapy.",
    levels: {
      mild: {
        drug: "Metoclopramide 10mg PO/IV/SC q6h before meals",
        tips: [
          "Small, frequent meals",
          "Avoid strong odors",
          "Ginger tea or supplements",
          "Cool, clear liquids"
        ],
        flags: []
      },
      moderate: {
        drug: "Ondansetron 4-8mg PO/IV q8h or Haloperidol 0.5-1mg PO/SC q8-12h",
        tips: [
          "Identify and treat underlying causes",
          "Oral hygiene after vomiting",
          "Avoid fatty, spicy foods",
          "Elevate head during and after meals"
        ],
        flags: [
          "Monitor for extrapyramidal symptoms with metoclopramide/haloperidol",
          "Check for dehydration"
        ]
      },
      severe: {
        drug: "Combination therapy: Dexamethasone 4-8mg PO/IV daily + Ondansetron 8mg IV q8h + Haloperidol 1-2mg IV/SC q8h; consider continuous infusion",
        tips: [
          "NPO status if intractable",
          "Consider nasogastric tube for decompression",
          "IV hydration",
          "Aromatherapy for complementary relief"
        ],
        flags: [
          "Assess for bowel obstruction",
          "Monitor fluid/electrolyte status",
          "Watch for QT prolongation with multiple antiemetics",
          "Consider octreotide for inoperable bowel obstruction"
        ]
      }
    },
    icon: <Droplets className="h-6 w-6" />,
    handbookSectionId: "nausea-vomiting"
  },
  delirium: {
    summary: "Placeholder for delirium summary",
    levels: {
      mild: {
        drug: "Placeholder for mild delirium treatment",
        tips: ["Placeholder tip 1", "Placeholder tip 2"],
        flags: []
      },
      moderate: {
        drug: "Placeholder for moderate delirium treatment",
        tips: ["Placeholder tip 1", "Placeholder tip 2"],
        flags: ["Placeholder flag"]
      },
      severe: {
        drug: "Placeholder for severe delirium treatment",
        tips: ["Placeholder tip 1", "Placeholder tip 2"],
        flags: ["Placeholder flag 1", "Placeholder flag 2"]
      }
    },
    icon: <Brain className="h-6 w-6" />,
    handbookSectionId: "delirium-management"
  },
  fatigue: {
    summary: "Placeholder for fatigue summary",
    levels: {
      mild: {
        drug: "Placeholder for mild fatigue treatment",
        tips: ["Placeholder tip 1", "Placeholder tip 2"],
        flags: []
      },
      moderate: {
        drug: "Placeholder for moderate fatigue treatment",
        tips: ["Placeholder tip 1", "Placeholder tip 2"],
        flags: ["Placeholder flag"]
      },
      severe: {
        drug: "Placeholder for severe fatigue treatment",
        tips: ["Placeholder tip 1", "Placeholder tip 2"],
        flags: ["Placeholder flag 1", "Placeholder flag 2"]
      }
    },
    icon: <Activity className="h-6 w-6" />,
    handbookSectionId: "fatigue-management"
  },
  secretions: {
    summary: "Placeholder for secretions summary",
    levels: {
      mild: {
        drug: "Placeholder for mild secretions treatment",
        tips: ["Placeholder tip 1", "Placeholder tip 2"],
        flags: []
      },
      moderate: {
        drug: "Placeholder for moderate secretions treatment",
        tips: ["Placeholder tip 1", "Placeholder tip 2"],
        flags: ["Placeholder flag"]
      },
      severe: {
        drug: "Placeholder for severe secretions treatment",
        tips: ["Placeholder tip 1", "Placeholder tip 2"],
        flags: ["Placeholder flag 1", "Placeholder flag 2"]
      }
    },
    icon: <Droplets className="h-6 w-6" />,
    handbookSectionId: "respiratory-secretions"
  },
  constipation: {
    summary: "Placeholder for constipation summary",
    levels: {
      mild: {
        drug: "Placeholder for mild constipation treatment",
        tips: ["Placeholder tip 1", "Placeholder tip 2"],
        flags: []
      },
      moderate: {
        drug: "Placeholder for moderate constipation treatment",
        tips: ["Placeholder tip 1", "Placeholder tip 2"],
        flags: ["Placeholder flag"]
      },
      severe: {
        drug: "Placeholder for severe constipation treatment",
        tips: ["Placeholder tip 1", "Placeholder tip 2"],
        flags: ["Placeholder flag 1", "Placeholder flag 2"]
      }
    },
    icon: <GripHorizontal className="h-6 w-6" />,
    handbookSectionId: "constipation-management"
  },
};

// Component for displaying severity-specific treatments
const SeverityCard = ({ 
  level, 
  treatment, 
  isOpen, 
  toggleOpen 
}: { 
  level: SeverityLevel, 
  treatment: Treatment, 
  isOpen: boolean, 
  toggleOpen: () => void 
}) => {
  const severityColors = {
    mild: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
    moderate: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800",
    severe: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
  };

  const severityLabel = {
    mild: "Mild",
    moderate: "Moderate",
    severe: "Severe"
  };

  return (
    <div 
      className={cn(
        "mb-4 border rounded-xl shadow-sm overflow-hidden",
        "hover:shadow-md transition-all duration-200",
        "dark:bg-slate-800 dark:border-slate-700"
      )}
    >
      <div 
        className={cn(
          "flex items-center justify-between p-3 cursor-pointer",
          "hover:bg-slate-50 dark:hover:bg-slate-700/50",
          isOpen ? "border-b" : "",
          isOpen ? "dark:border-slate-700" : ""
        )}
        onClick={toggleOpen}
      >
        <div className="flex items-center space-x-2">
          <span className={cn(
            "inline-block w-3 h-3 rounded-full",
            level === 'mild' ? "bg-green-500" : level === 'moderate' ? "bg-yellow-500" : "bg-red-500"
          )}></span>
          <h3 className="text-lg font-medium">{severityLabel[level]}</h3>
          <div className={cn(
            "text-xs px-2 py-1 rounded-full",
            severityColors[level]
          )}>
            {level === 'mild' ? 'Low Risk' : level === 'moderate' ? 'Caution' : 'High Alert'}
          </div>
        </div>
        <svg 
          className={cn(
            "w-5 h-5 transition-transform duration-200",
            isOpen ? "rotate-180" : "rotate-0"
          )} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
      
      {isOpen && (
        <div className="p-4 bg-white dark:bg-slate-800">
          <div className="mb-3">
            <h4 className="font-semibold text-sm uppercase text-slate-500 dark:text-slate-400 mb-2">
              Pharmacological
            </h4>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Pill className="h-4 w-4 text-blue-500 dark:text-blue-400 inline-block mr-2" />
              <span className="text-blue-700 dark:text-blue-300">{treatment.drug}</span>
            </div>
          </div>
          
          <div className="mb-3">
            <h4 className="font-semibold text-sm uppercase text-slate-500 dark:text-slate-400 mb-2">
              Non-Pharmacological
            </h4>
            <ul className="space-y-1 pl-5 list-disc marker:text-slate-400">
              {treatment.tips.map((tip, i) => (
                <li key={i} className="text-slate-700 dark:text-slate-300">{tip}</li>
              ))}
            </ul>
          </div>
          
          {treatment.flags && treatment.flags.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm uppercase text-slate-500 dark:text-slate-400 mb-2">
                Red Flags
              </h4>
              <ul className="space-y-1">
                {treatment.flags.map((flag, i) => (
                  <li key={i} className="flex items-start">
                    <AlertCircle className="h-4 w-4 text-red-500 dark:text-red-400 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Component for displaying all information about a symptom
const SymptomPanel = ({ data }: { data: SymptomData }) => {
  const [openCards, setOpenCards] = useState<Record<SeverityLevel, boolean>>({
    mild: true,
    moderate: false,
    severe: false
  });

  const toggleCard = (level: SeverityLevel) => {
    setOpenCards(prev => ({
      ...prev,
      [level]: !prev[level]
    }));
  };

  return (
    <div>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 mb-6 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-2 mb-3">
          {data.icon}
          <h3 className="text-xl font-medium">Overview</h3>
        </div>
        <p className="text-slate-700 dark:text-slate-300">{data.summary}</p>
        
        {data.handbookSectionId && (
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
            <a
              href={`/handbook#${data.handbookSectionId}`}
              className="inline-flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:underline hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <BookOpen className="h-4 w-4 mr-1.5" />
              See full guidance in Handbook
            </a>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300">Management by Severity</h3>
          <button 
            onClick={() => setOpenCards({ mild: true, moderate: true, severe: true })}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Expand All
          </button>
        </div>
        
        <SeverityCard 
          level="mild" 
          treatment={data.levels.mild} 
          isOpen={openCards.mild}
          toggleOpen={() => toggleCard('mild')}
        />
        
        <SeverityCard 
          level="moderate" 
          treatment={data.levels.moderate} 
          isOpen={openCards.moderate}
          toggleOpen={() => toggleCard('moderate')}
        />
        
        <SeverityCard 
          level="severe" 
          treatment={data.levels.severe} 
          isOpen={openCards.severe}
          toggleOpen={() => toggleCard('severe')}
        />
      </div>
    </div>
  );
};

// Main component
function SymptomControlNew() {
  const [activeTab, setActiveTab] = useState("pain");
  const [searchTerm, setSearchTerm] = useState("");
  
  const tabs = [
    { id: "pain", label: "Pain", icon: <Pill className="h-4 w-4" /> },
    { id: "dyspnea", label: "Dyspnea", icon: <Wind className="h-4 w-4" /> },
    { id: "nausea", label: "Nausea", icon: <Droplets className="h-4 w-4" /> },
    { id: "delirium", label: "Delirium", icon: <Brain className="h-4 w-4" /> },
    { id: "fatigue", label: "Fatigue", icon: <Activity className="h-4 w-4" /> },
    { id: "secretions", label: "Secretions", icon: <Droplets className="h-4 w-4" /> },
    { id: "constipation", label: "Constipation", icon: <GripHorizontal className="h-4 w-4" /> }
  ];

  // Filter tabs based on search term
  const filteredTabs = searchTerm 
    ? tabs.filter(tab => tab.label.toLowerCase().includes(searchTerm.toLowerCase()))
    : tabs;

  return (
    <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 md:p-6 min-h-[80vh]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 text-indigo-700 dark:text-indigo-400">Symptom Control</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Evidence-based management strategies for common symptoms in palliative care
        </p>
      </div>
      
      {/* Search Bar */}
      <div className="mb-6 relative max-w-md">
        <Search className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder="Search symptoms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={cn(
            "w-full p-2 pl-10 border border-slate-300 rounded-lg shadow-sm",
            "focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none",
            "dark:bg-slate-800 dark:border-slate-700 dark:text-white",
            "transition duration-200"
          )}
        />
      </div>
      
      {/* Tabs Navigation */}
      <div className="mb-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex space-x-1 overflow-x-auto pb-1 scrollbar-hide">
          {filteredTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200",
                "focus:outline-none whitespace-nowrap flex items-center",
                activeTab === tab.id
                  ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border-t border-l border-r border-slate-200 dark:border-slate-700"
                  : "text-slate-600 dark:text-slate-400 hover:bg-white/80 dark:hover:bg-slate-800/50"
              )}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Content Area */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 border border-slate-200 dark:border-slate-700">
        {filteredTabs.map((tab) => (
          <div
            key={tab.id}
            className={cn(
              "transition-opacity duration-300",
              activeTab === tab.id ? "block" : "hidden"
            )}
          >
            <SymptomPanel data={symptomData[tab.id]} />
          </div>
        ))}
        
        {filteredTabs.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-lg text-slate-500 dark:text-slate-400">No symptoms match your search</p>
            <button
              onClick={() => setSearchTerm("")}
              className="mt-2 text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SymptomControlNew;
