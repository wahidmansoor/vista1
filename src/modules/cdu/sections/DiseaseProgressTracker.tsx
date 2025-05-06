import React, { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { BarChart2, Activity, FolderOpen, Syringe, Bot, AlertTriangle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { TREATMENT_PROTOCOLS } from "../data/treatmentProtocolsData";

const STORAGE_KEY = "disease-progress-tracker-data";

const DIAGNOSIS_PROTOCOL_MAP: { [key: string]: string[] } = {
  "Breast Cancer": ["AC→T", "FEC→D", "T-DM1", "Kadcyla"],
  "Colorectal Cancer": ["FOLFOX", "FOLFIRI", "FOLFOXIRI", "CAPOX"],
  "Lung Cancer": ["Carbo + Pemetrexed", "Osimertinib", "Durvalumab"],
  "Prostate Cancer": ["Docetaxel", "Abiraterone", "Enzalutamide"],
  "Lymphoma": ["R-CHOP", "ABVD", "Bendamustine + Rituximab"],
  "Leukemia": ["7+3 Regimen", "FLAG-IDA", "Blinatumomab"],
  "Melanoma": ["Nivolumab + Ipilimumab", "Pembrolizumab"],
  "Ovarian Cancer": ["Carboplatin + Paclitaxel", "Bevacizumab"],
  "Other": []
};

const PRIMARY_DIAGNOSES = [
  "Breast Cancer",
  "Colorectal Cancer",
  "Lung Cancer",
  "Prostate Cancer",
  "Ovarian Cancer",
  "Lymphoma",
  "Leukemia",
  "Melanoma",
  "Other"
] as const;

const HISTOLOGY_MUTATIONS = [
  "HER2 Positive",
  "KRAS Mutant",
  "EGFR Mutant",
  "ALK Rearrangement",
  "MSI-High",
  "PD-L1 Positive",
  "BRAF V600E",
  "TP53 Mutant",
  "Other"
] as const;

const tabs = [
  { title: 'Disease Status', icon: BarChart2 },
  { title: 'Performance Status', icon: Activity },
  { title: 'Progression', icon: FolderOpen },
  { title: 'Lines of Treatment', icon: Syringe },
  { title: 'AI Assistant', icon: Bot }
];

const DiseaseProgressTracker: React.FC = () => {
  const { toast } = useToast();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [suggestedProtocols, setSuggestedProtocols] = useState<string[]>([]);

  // Add helper functions before state declarations
  const getSuggestedProtocols = () => {
    if (!primaryDiagnosis || !stageAtDiagnosis) return [];
    return TREATMENT_PROTOCOLS.filter(protocol => 
      protocol.diagnosis === (primaryDiagnosis === "Other" ? otherPrimaryDiagnosis : primaryDiagnosis) && 
      (protocol.stage === stageAtDiagnosis || protocol.stage === "Any")
    );
  };

  const getSuggestedPremeds = () => {
    const protocols = getSuggestedProtocols();
    if (!protocols.length) return [];
    return [...new Set(protocols.flatMap(p => p.premedications || []))];
  };

  // Disease Status
  const [primaryDiagnosis, setPrimaryDiagnosis] = useState('');
  const [otherPrimaryDiagnosis, setOtherPrimaryDiagnosis] = useState('');
  const [stageAtDiagnosis, setStageAtDiagnosis] = useState('');
  const [histologyMutation, setHistologyMutation] = useState('');
  const [otherHistologyMutation, setOtherHistologyMutation] = useState('');
  const [dateOfDiagnosis, setDateOfDiagnosis] = useState('');
  const [diseaseNotes, setDiseaseNotes] = useState('');

  // Performance Status
  const [assessmentDate, setAssessmentDate] = useState('');
  const [performanceScale, setPerformanceScale] = useState('');
  const [performanceScore, setPerformanceScore] = useState('');
  const [performanceNotes, setPerformanceNotes] = useState('');

  // Progression
  const [reassessmentDate, setReassessmentDate] = useState('');
  const [imagingType, setImagingType] = useState('');
  const [findingsSummary, setFindingsSummary] = useState('');
  const [markerType, setMarkerType] = useState('');
  const [markerValue, setMarkerValue] = useState('');
  const [progressionNotes, setProgressionNotes] = useState('');

  // Lines of Treatment
  const [treatmentLine, setTreatmentLine] = useState('');
  const [treatmentRegimen, setTreatmentRegimen] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [treatmentResponse, setTreatmentResponse] = useState('');
  const [treatmentNotes, setTreatmentNotes] = useState('');

  // AI Assistant
  const [aiInput, setAiInput] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const generateAiSuggestions = () => {
    const mutationContext = histologyMutation === 'Other' ? otherHistologyMutation : histologyMutation;
    let suggestions = '🧠 Smart Treatment Suggestions:\n';

    // Use histology to suggest targeted therapies
    if (mutationContext) {
      switch(mutationContext) {
        case 'HER2 Positive':
          suggestions += '- Consider T-DM1 or Trastuzumab-based therapy\n';
          suggestions += '- Dual HER2 blockade may be appropriate\n';
          break;
        case 'KRAS Mutant':
          suggestions += '- KRAS mutation limits anti-EGFR therapy options\n';
          suggestions += '- Consider MEK inhibitor clinical trials\n';
          break;
        case 'EGFR Mutant':
          suggestions += '- EGFR TKI therapy recommended\n';
          suggestions += '- Monitor for T790M resistance mutation\n';
          break;
        case 'PD-L1 Positive':
          suggestions += '- Consider immunotherapy as monotherapy\n';
          suggestions += '- Evaluate combination chemo-immunotherapy\n';
          break;
        default:
          suggestions += '- Consider molecular profiling for targetable mutations\n';
      }
    }

    // Add performance status based recommendations
    if (performanceScore) {
      suggestions += '\n💪 Performance Status Considerations:\n';
      const score = parseInt(performanceScore, 10);
      
      if (isNaN(score)) {
        suggestions += '- Performance score invalid, please reassess\n';
      } else if (score <= 1) {
        suggestions += '- Patient fit for full dose therapy\n';
      } else if (score === 2) {
        suggestions += '- Consider dose reduction or weekly regimens\n';
        suggestions += '- Close monitoring for toxicity needed\n';
      } else {
        suggestions += '- Best supportive care may be most appropriate\n';
        suggestions += '- Avoid aggressive therapy due to poor PS\n';
      }
    }

    // Treatment line specific suggestions
    if (treatmentLine) {
      suggestions += '\n🎯 Line of Therapy Recommendations:\n';
      switch(treatmentLine) {
        case '1st Line':
          suggestions += '- Standard first-line protocols preferred\n';
          suggestions += '- Consider clinical trial enrollment\n';
          break;
        case '2nd Line':
          suggestions += '- Review first-line response duration\n';
          suggestions += '- Consider alternative drug class\n';
          break;
        case '3rd Line':
          suggestions += '- Molecular profiling guided therapy\n';
          suggestions += '- Early palliative care integration\n';
          break;
        case 'Maintenance':
          suggestions += '- Less intensive continuation approach\n';
          suggestions += '- Monitor tolerability closely\n';
          break;
      }
    }

    return suggestions;
  };

  const handleAskAi = async () => {
    try {
      setIsAiLoading(true);
      const aiSuggestions = generateAiSuggestions();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add warning if insufficient data
      if (!primaryDiagnosis || !stageAtDiagnosis) {
        toast({
          title: "Warning",
          description: "Please provide diagnosis and stage for better suggestions",
          variant: "destructive"
        });
      }

      setAiResponse(aiSuggestions);
    } catch (error) {
      console.error("AI Suggestion Error:", error);
      toast({
        title: "Error",
        description: "Failed to generate AI suggestions",
        variant: "destructive"
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  const loadFromLocalStorage = () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);

        // Disease Status
        setPrimaryDiagnosis(parsed.diseaseStatus?.primaryDiagnosis || '');
        setOtherPrimaryDiagnosis(parsed.diseaseStatus?.otherPrimaryDiagnosis || '');
        setStageAtDiagnosis(parsed.diseaseStatus?.stageAtDiagnosis || '');
        setHistologyMutation(parsed.diseaseStatus?.histologyMutation || '');
        setOtherHistologyMutation(parsed.diseaseStatus?.otherHistologyMutation || '');
        setDateOfDiagnosis(parsed.diseaseStatus?.dateOfDiagnosis || '');
        setDiseaseNotes(parsed.diseaseStatus?.diseaseNotes || '');

        // Performance Status
        setAssessmentDate(parsed.performanceStatus?.assessmentDate || '');
        setPerformanceScale(parsed.performanceStatus?.performanceScale || '');
        setPerformanceScore(parsed.performanceStatus?.performanceScore || '');
        setPerformanceNotes(parsed.performanceStatus?.performanceNotes || '');

        // Progression
        setReassessmentDate(parsed.progression?.reassessmentDate || '');
        setImagingType(parsed.progression?.imagingType || '');
        setFindingsSummary(parsed.progression?.findingsSummary || '');
        setMarkerType(parsed.progression?.markerType || '');
        setMarkerValue(parsed.progression?.markerValue || '');
        setProgressionNotes(parsed.progression?.progressionNotes || '');

        // Lines of Treatment
        setTreatmentLine(parsed.linesOfTreatment?.treatmentLine || '');
        setTreatmentRegimen(parsed.linesOfTreatment?.treatmentRegimen || '');
        setStartDate(parsed.linesOfTreatment?.startDate || '');
        setEndDate(parsed.linesOfTreatment?.endDate || '');
        setTreatmentResponse(parsed.linesOfTreatment?.treatmentResponse || '');
        setTreatmentNotes(parsed.linesOfTreatment?.treatmentNotes || '');

        toast({
          title: "Success",
          description: "Previous session data loaded!",
          variant: "default"
        });
      }
    } catch (error) {
      console.error("Failed to load from localStorage", error);
      toast({
        title: "Warning", 
        description: "Failed to load previous data",
        variant: "destructive"
      });
    }
  };

  const saveToLocalStorage = () => {
    const payload = {
      diseaseStatus: {
        primaryDiagnosis,
        otherPrimaryDiagnosis,
        stageAtDiagnosis,
        histologyMutation,
        otherHistologyMutation,
        dateOfDiagnosis,
        diseaseNotes,
      },
      performanceStatus: {
        assessmentDate,
        performanceScale,
        performanceScore,
        performanceNotes,
      },
      progression: {
        reassessmentDate,
        imagingType,
        findingsSummary,
        markerType,
        markerValue,
        progressionNotes,
      },
      linesOfTreatment: {
        treatmentLine,
        treatmentRegimen,
        startDate,
        endDate,
        treatmentResponse,
        treatmentNotes,
      }
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  };

  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  // Save Handlers
  const handleSaveDiseaseStatus = () => {
    saveToLocalStorage();
    toast({
      title: "Success",
      description: "Disease Status Saved!",
      variant: "default"
    });
  };

  const handleSavePerformanceStatus = () => {
    saveToLocalStorage();
    toast({
      title: "Success",
      description: "Performance Status Saved!",
      variant: "default"
    });
  };

  const handleSaveProgression = () => {
    saveToLocalStorage();
    toast({
      title: "Success",
      description: "Progression Record Saved!",
      variant: "default"
    });
  };

  const handleSaveTreatmentLines = () => {
    saveToLocalStorage();
    toast({
      title: "Success",
      description: "Line of Treatment Saved!",
      variant: "default"
    });
  };

  const handleClearAllData = () => {
    localStorage.removeItem(STORAGE_KEY);

    // Disease Status
    setPrimaryDiagnosis('');
    setOtherPrimaryDiagnosis('');
    setStageAtDiagnosis('');
    setHistologyMutation('');
    setOtherHistologyMutation('');
    setDateOfDiagnosis('');
    setDiseaseNotes('');

    // Performance Status
    setAssessmentDate('');
    setPerformanceScale('');
    setPerformanceScore('');
    setPerformanceNotes('');

    // Progression
    setReassessmentDate('');
    setImagingType('');
    setFindingsSummary('');
    setMarkerType('');
    setMarkerValue('');
    setProgressionNotes('');

    // Lines of Treatment
    setTreatmentLine('');
    setTreatmentRegimen('');
    setStartDate('');
    setEndDate('');
    setTreatmentResponse('');
    setTreatmentNotes('');

    toast({
      title: "Success",
      description: "All data cleared!",
      variant: "default"
    });
  };

  // Add effect for auto-updating protocol suggestions
  useEffect(() => {
    if (primaryDiagnosis) {
      const protocols = DIAGNOSIS_PROTOCOL_MAP[primaryDiagnosis] || [];
      setSuggestedProtocols(protocols);
    } else {
      setSuggestedProtocols([]);
    }
  }, [primaryDiagnosis]);

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">📈 Disease & Progress Tracker</h2>
        <button
          type="button"
          onClick={handleClearAllData}
          className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-lg hover:opacity-90 transition"
        >
          🗑️ Clear All Data
        </button>
      </div>

      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        {/* Tab List */}
        <Tab.List className="flex space-x-4 border-b pb-3 mb-6">
          {tabs.map((tab, index) => (
            <Tab key={index} className={({ selected }) => `
              flex items-center gap-2 cursor-pointer py-2 px-4 rounded-lg shadow transition-all duration-300
              ${selected 
                ? "bg-gradient-to-r from-indigo-500 to-teal-500 text-white" 
                : "bg-white text-gray-600 hover:text-indigo-500 hover:shadow-md"}
            `}>
              <tab.icon className="w-5 h-5" />
              {tab.title}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">

          {/* Disease Status */}
          <Tab.Panel>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="primary-diagnosis" className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Diagnosis
                </label>
                <select 
                  id="primary-diagnosis"
                  value={primaryDiagnosis} 
                  onChange={(e) => setPrimaryDiagnosis(e.target.value)} 
                  className="w-full input-field focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                  aria-label="Primary Diagnosis"
                >
                  <option value="">Select Primary Diagnosis</option>
                  {PRIMARY_DIAGNOSES.map((diagnosis) => (
                    <option key={diagnosis} value={diagnosis}>{diagnosis}</option>
                  ))}
                </select>
                {primaryDiagnosis === 'Other' && (
                  <div className="mt-2">
                    <label htmlFor="other-diagnosis" className="block text-sm font-medium text-gray-700 mb-1">
                      Specify Other Diagnosis
                    </label>
                    <input
                      id="other-diagnosis"
                      type="text"
                      value={otherPrimaryDiagnosis}
                      onChange={(e) => setOtherPrimaryDiagnosis(e.target.value)}
                      placeholder="Specify Other Primary Diagnosis"
                      className="w-full input-field focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                    />
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="stage-diagnosis" className="block text-sm font-medium text-gray-700 mb-1">
                  Stage at Diagnosis
                </label>
                <select 
                  id="stage-diagnosis"
                  value={stageAtDiagnosis} 
                  onChange={(e) => setStageAtDiagnosis(e.target.value)} 
                  className="input-field focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                  aria-label="Stage at Diagnosis"
                >
                  <option value="">Select Stage</option>
                  <option value="I">Stage I</option>
                  <option value="II">Stage II</option>
                  <option value="III">Stage III</option>
                  <option value="IV">Stage IV</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="histology-mutation" className="block text-sm font-medium text-gray-700 mb-1">
                  Histology/Mutation
                </label>
                <select 
                  id="histology-mutation"
                  value={histologyMutation} 
                  onChange={(e) => setHistologyMutation(e.target.value)} 
                  className="w-full input-field focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                  aria-label="Histology or Mutation"
                >
                  <option value="">Select Histology/Mutation</option>
                  {HISTOLOGY_MUTATIONS.map((mutation) => (
                    <option key={mutation} value={mutation}>{mutation}</option>
                  ))}
                </select>
                {histologyMutation === 'Other' && (
                  <div className="mt-2">
                    <label htmlFor="other-mutation" className="block text-sm font-medium text-gray-700 mb-1">
                      Specify Other Mutation
                    </label>
                    <input
                      id="other-mutation"
                      type="text"
                      value={otherHistologyMutation}
                      onChange={(e) => setOtherHistologyMutation(e.target.value)}
                      placeholder="Specify Other Histology/Mutation"
                      className="w-full input-field focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                    />
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="date-diagnosis" className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Diagnosis
                </label>
                <input 
                  id="date-diagnosis"
                  type="date" 
                  value={dateOfDiagnosis} 
                  onChange={(e) => setDateOfDiagnosis(e.target.value)} 
                  className="input-field focus:ring-2 focus:ring-indigo-500 transition-all duration-200" 
                  aria-label="Date of Diagnosis"
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="disease-notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Disease Notes
                </label>
                <textarea 
                  id="disease-notes"
                  value={diseaseNotes} 
                  onChange={(e) => setDiseaseNotes(e.target.value)} 
                  placeholder="Disease Notes..." 
                  rows={4} 
                  className="textarea-field focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                />
              </div>
            </form>

            <div className="flex justify-end mt-6">
              <button 
                type="button" 
                onClick={handleSaveDiseaseStatus} 
                className="save-button bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200"
              >
                Save Disease Status
              </button>
            </div>
          </Tab.Panel>

          {/* Performance Status */}
          <Tab.Panel>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="assessment-date" className="block text-sm font-medium text-gray-700 mb-1">
                  Assessment Date
                </label>
                <input 
                  id="assessment-date"
                  type="date" 
                  value={assessmentDate} 
                  onChange={(e) => setAssessmentDate(e.target.value)} 
                  className="input-field focus:ring-2 focus:ring-indigo-500 transition-all duration-200" 
                  aria-label="Assessment Date"
                />
              </div>
              <div>
                <label htmlFor="performance-scale" className="block text-sm font-medium text-gray-700 mb-1">
                  Performance Scale
                </label>
                <select 
                  id="performance-scale"
                  value={performanceScale} 
                  onChange={(e) => setPerformanceScale(e.target.value)} 
                  className="input-field focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                  aria-label="Performance Scale"
                >
                  <option value="">Select Scale</option>
                  <option value="ecog">ECOG</option>
                  <option value="karnofsky">Karnofsky</option>
                </select>
              </div>
              <div>
                <label htmlFor="performance-score" className="block text-sm font-medium text-gray-700 mb-1">
                  Performance Score
                </label>
                <select 
                  id="performance-score"
                  value={performanceScore} 
                  onChange={(e) => setPerformanceScore(e.target.value)} 
                  className="input-field focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                  aria-label="Performance Score"
                >
                  <option value="">Select Score</option>
                  <option value="0">0 - Fully active</option>
                  <option value="1">1 - Restricted in strenuous activity</option>
                  <option value="2">2 - Ambulatory but unable to work</option>
                  <option value="3">3 - Limited self-care</option>
                  <option value="4">4 - Completely disabled</option>
                </select>
              </div>
              <div>
                <label htmlFor="performance-notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Performance Notes
                </label>
                <textarea 
                  id="performance-notes"
                  value={performanceNotes} 
                  onChange={(e) => setPerformanceNotes(e.target.value)} 
                  placeholder="Performance Notes..." 
                  rows={4} 
                  className="textarea-field focus:ring-2 focus:ring-indigo-500 transition-all duration-200" 
                />
              </div>
            </form>

            <div className="flex justify-end mt-6">
              <button 
                type="button" 
                onClick={handleSavePerformanceStatus} 
                className="save-button bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200"
              >
                Save Performance Status
              </button>
            </div>
          </Tab.Panel>

          {/* Progression */}
          <Tab.Panel>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input 
                type="date" 
                value={reassessmentDate} 
                onChange={(e) => setReassessmentDate(e.target.value)} 
                className="input-field" 
                aria-label="Reassessment Date"
                placeholder="Reassessment Date"
              />
              <select 
                value={imagingType} 
                onChange={(e) => setImagingType(e.target.value)} 
                className="input-field"
                aria-label="Imaging Type"
              >
                <option value="">Select Imaging Type</option>
                <option value="CT">CT Scan</option>
                <option value="MRI">MRI</option>
                <option value="PET">PET Scan</option>
                <option value="XRay">X-Ray</option>
              </select>
              <textarea value={findingsSummary} onChange={(e) => setFindingsSummary(e.target.value)} placeholder="Findings Summary..." rows={4} className="textarea-field" />
              <input type="text" value={markerType} onChange={(e) => setMarkerType(e.target.value)} placeholder="Tumor Marker Type" className="input-field" />
              <input type="number" value={markerValue} onChange={(e) => setMarkerValue(e.target.value)} placeholder="Tumor Marker Value" className="input-field" />
              <textarea value={progressionNotes} onChange={(e) => setProgressionNotes(e.target.value)} placeholder="Progression Notes..." rows={4} className="textarea-field" />
            </form>

            <div className="flex justify-end mt-6">
              <button type="button" onClick={handleSaveProgression} className="save-button">Save Progression</button>
            </div>
          </Tab.Panel>

          {/* Lines of Treatment */}
          <Tab.Panel>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <select 
                value={treatmentLine} 
                onChange={(e) => setTreatmentLine(e.target.value)} 
                className="input-field"
                aria-label="Treatment Line"
              >
                <option value="">Select Line</option>
                <option value="1st Line">1st Line</option>
                <option value="2nd Line">2nd Line</option>
                <option value="3rd Line">3rd Line</option>
                <option value="Maintenance">Maintenance</option>
              </select>
              <input type="text" value={treatmentRegimen} onChange={(e) => setTreatmentRegimen(e.target.value)} placeholder="Treatment Regimen" className="input-field" />
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
                className="input-field" 
                aria-label="Start Date"
                placeholder="Start Date"
              />
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} 
                className="input-field" 
                aria-label="End Date"
                placeholder="End Date"
              />
              <select 
                value={treatmentResponse} 
                onChange={(e) => setTreatmentResponse(e.target.value)} 
                className="input-field"
                aria-label="Treatment Response"
              >
                <option value="">Select Response</option>
                <option value="Complete Response">Complete Response (CR)</option>
                <option value="Partial Response">Partial Response (PR)</option>
                <option value="Stable Disease">Stable Disease (SD)</option>
                <option value="Progressive Disease">Progressive Disease (PD)</option>
              </select>
              <textarea value={treatmentNotes} onChange={(e) => setTreatmentNotes(e.target.value)} placeholder="Treatment Notes..." rows={4} className="textarea-field" />
            </form>

            <div className="flex justify-end mt-6">
              <button type="button" onClick={handleSaveTreatmentLines} className="save-button">Save Line of Treatment</button>
            </div>
          </Tab.Panel>

          {/* AI Assistant Panel */}
          <Tab.Panel>
            <div className="space-y-6">
              {/* Protocol Suggestions */}
              {getSuggestedProtocols().length > 0 && (
                <div className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900 dark:to-blue-900 rounded-xl shadow-sm mb-6 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
                  <h4 className="text-lg font-bold mb-3 text-indigo-700 dark:text-indigo-300 flex items-center">
                    <span className="mr-2 p-1 bg-indigo-100 dark:bg-indigo-800 rounded-full">
                      🎯
                    </span>
                    Matched Treatment Protocols
                  </h4>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1.5">
                    {getSuggestedProtocols().map((protocol, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-4 h-4 mr-2 mt-1 bg-indigo-400 dark:bg-indigo-600 rounded-full"></span>
                        <span>{protocol.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Disease-Based Protocol Suggestions */}
              {suggestedProtocols.length > 0 && (
                <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900 dark:to-indigo-900 rounded-xl shadow-sm mb-6 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
                  <h4 className="text-lg font-bold mb-3 text-purple-600 dark:text-purple-400 flex items-center">
                    <span className="mr-2 p-1 bg-purple-100 dark:bg-purple-800 rounded-full">
                      🎯
                    </span>
                    Standard Protocols for {primaryDiagnosis}
                  </h4>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1.5">
                    {suggestedProtocols.map((protocol, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="inline-block w-4 h-4 mr-2 mt-1 bg-purple-400 dark:bg-purple-600 rounded-full"></span>
                        <span>{protocol}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Premedication Suggestions */}
              {getSuggestedPremeds().length > 0 && (
                <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900 dark:to-teal-900 rounded-xl shadow-sm mb-6 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
                  <h4 className="text-lg font-bold mb-3 text-emerald-700 dark:text-emerald-300 flex items-center">
                    <span className="mr-2 p-1 bg-emerald-100 dark:bg-emerald-800 rounded-full">
                      💉
                    </span>
                    Suggested Pre-Medications
                  </h4>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1.5">
                    {getSuggestedPremeds().map((premed, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-4 h-4 mr-2 mt-1 bg-emerald-400 dark:bg-emerald-600 rounded-full"></span>
                        <span>{premed}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
                <h4 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">
                  AI Treatment Assistant
                </h4>
                
                <div className="mb-4">
                  <label htmlFor="ai-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Case Summary (Optional)
                  </label>
                  <textarea 
                    id="ai-input"
                    value={aiInput} 
                    onChange={(e) => setAiInput(e.target.value)} 
                    placeholder="Enter case summary (e.g., Metastatic CRC after FOLFIRI)" 
                    rows={4} 
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                  />
                </div>

                <button 
                  onClick={handleAskAi} 
                  disabled={isAiLoading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                >
                  {isAiLoading ? (
                    <>
                      <div className="w-5 h-5 border-3 border-t-transparent border-white rounded-full animate-spin mr-3" />
                      <span>Analyzing Patient Data...</span>
                    </>
                  ) : (
                    <>
                      <span className="mr-2">🧠</span>
                      <span>Ask AI for Personalized Suggestions</span>
                    </>
                  )}
                </button>

                {aiResponse && (
                  <div className="p-6 mt-6 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900 rounded-xl shadow-lg border border-blue-100 dark:border-blue-800 transform transition-all duration-500 animate-in fade-in-0 slide-in-from-bottom-4">
                    <h4 className="text-lg font-bold mb-3 text-blue-600 dark:text-blue-300 flex items-center">
                      <span className="mr-2 p-1 bg-blue-100 dark:bg-blue-800 rounded-full">
                        🧠
                      </span>
                      AI Personalized Recommendations
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">{aiResponse}</p>
                  </div>
                )}
              </div>
            </div>
          </Tab.Panel>

        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default DiseaseProgressTracker;
