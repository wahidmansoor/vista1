import React, { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { BarChart2, Activity, FolderOpen, Syringe, Bot, AlertTriangle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

// Import new hooks and components
import { usePatientData } from './hooks/usePatientData';
import { useProtocolSuggestions, useLegacyProtocolSuggestions } from './hooks/useProtocolSuggestions';
import { useAiAssistant } from './hooks/useAiAssistant';
import { DiseaseStatusTab } from './components/DiseaseStatusTab';

// Legacy imports - will be removed after refactoring
import { TREATMENT_PROTOCOLS } from "../data/treatmentProtocolsData";

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
  const [aiInput, setAiInput] = useState('');

  // Use new hooks for state management
  const patientData = usePatientData();
  const protocolSuggestions = useProtocolSuggestions(
    patientData.state.diseaseStatus,
    patientData.state.performanceStatus
  );
  const legacySuggestions = useLegacyProtocolSuggestions(
    patientData.state.diseaseStatus.primaryDiagnosis
  );
  const aiAssistant = useAiAssistant(patientData.state);

  // Load data on mount
  useEffect(() => {
    patientData.actions.loadFromStorage();
  }, []);

  // Legacy helper functions for backward compatibility
  const getSuggestedProtocols = () => {
    if (!patientData.state.diseaseStatus.primaryDiagnosis || !patientData.state.diseaseStatus.stageAtDiagnosis) return [];
    return TREATMENT_PROTOCOLS.filter(protocol => 
      protocol.diagnosis === (patientData.state.diseaseStatus.primaryDiagnosis === "Other" ? patientData.state.diseaseStatus.otherPrimaryDiagnosis : patientData.state.diseaseStatus.primaryDiagnosis) && 
      (protocol.stage === patientData.state.diseaseStatus.stageAtDiagnosis || protocol.stage === "Any")
    );
  };

  const getSuggestedPremeds = () => {
    const protocols = getSuggestedProtocols();
    if (!protocols.length) return [];
    return [...new Set(protocols.flatMap(p => p.premedications || []))];
  };
  // Enhanced AI handling with new hook
  const handleAskAi = async () => {
    try {
      // Add warning if insufficient data
      if (aiAssistant.hasInsufficientData) {
        toast({
          title: "Warning",
          description: "Please provide diagnosis and stage for better suggestions",
          variant: "destructive"
        });
      }

      await aiAssistant.askAi(aiInput);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate AI suggestions",
        variant: "destructive"
      });
    }
  };

  // Get validation summary
  const validationSummary = patientData.computed.getValidationSummary();

  // Save handlers with validation
  const handleSaveDiseaseStatus = async () => {
    try {
      await patientData.actions.saveToStorage();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleSavePerformanceStatus = async () => {
    try {
      await patientData.actions.saveToStorage();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleSaveProgression = async () => {
    try {
      await patientData.actions.saveToStorage();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleSaveTreatmentLines = async () => {
    try {
      await patientData.actions.saveToStorage();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  // Clear all data handler
  const handleClearAllData = () => {
    patientData.actions.resetAll();
  };

  return (
    <div className="p-6 bg-content rounded-2xl shadow-lg fix-visibility">
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

        <Tab.Panels className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">          {/* Disease Status */}
          <Tab.Panel>
            <DiseaseStatusTab
              data={patientData.state.diseaseStatus}
              onChange={patientData.actions.updateDiseaseStatus}
              onSave={handleSaveDiseaseStatus}
              validation={validationSummary.diseaseStatus}
              isLoading={patientData.state.isLoading}
            />
          </Tab.Panel>          {/* Performance Status */}
          <Tab.Panel>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="assessment-date" className="block text-sm font-medium text-gray-700 mb-1">
                  Assessment Date
                </label>
                <input 
                  id="assessment-date"
                  type="date" 
                  value={patientData.state.performanceStatus.assessmentDate} 
                  onChange={(e) => patientData.actions.updatePerformanceStatus({ assessmentDate: e.target.value })} 
                  className="input-field focus:ring-2 focus:ring-indigo-500 transition-all duration-200" 
                  aria-label="Assessment Date"
                />
              </div>
              <div>
                <label htmlFor="performance-scale" className="block text-sm font-medium text-gray-700 mb-1">
                  Performance Scale
                </label>                <select 
                  id="performance-scale"
                  value={patientData.state.performanceStatus.performanceScale} 
                  onChange={(e) => patientData.actions.updatePerformanceStatus({ performanceScale: e.target.value as any })} 
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
                  value={patientData.state.performanceStatus.performanceScore} 
                  onChange={(e) => patientData.actions.updatePerformanceStatus({ performanceScore: e.target.value as any })} 
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
                  value={patientData.state.performanceStatus.performanceNotes} 
                  onChange={(e) => patientData.actions.updatePerformanceStatus({ performanceNotes: e.target.value })} 
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
          </Tab.Panel>          {/* Progression */}
          <Tab.Panel>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input 
                type="date" 
                value={patientData.state.progression.reassessmentDate} 
                onChange={(e) => patientData.actions.updateProgression({ reassessmentDate: e.target.value })} 
                className="input-field" 
                aria-label="Reassessment Date"
                placeholder="Reassessment Date"
              />
              <select 
                value={patientData.state.progression.imagingType} 
                onChange={(e) => patientData.actions.updateProgression({ imagingType: e.target.value as any })} 
                className="input-field"
                aria-label="Imaging Type"
              >
                <option value="">Select Imaging Type</option>
                <option value="CT">CT Scan</option>
                <option value="MRI">MRI</option>
                <option value="PET">PET Scan</option>
                <option value="XRay">X-Ray</option>
              </select>
              <textarea 
                value={patientData.state.progression.findingsSummary || ''} 
                onChange={(e) => patientData.actions.updateProgression({ findingsSummary: e.target.value })} 
                placeholder="Findings Summary..." 
                rows={4} 
                className="textarea-field" 
              />
              <input 
                type="text" 
                value={patientData.state.progression.markerType || ''} 
                onChange={(e) => patientData.actions.updateProgression({ markerType: e.target.value })} 
                placeholder="Tumor Marker Type" 
                className="input-field" 
              />
              <input 
                type="number" 
                value={patientData.state.progression.markerValue || ''} 
                onChange={(e) => patientData.actions.updateProgression({ markerValue: e.target.value })} 
                placeholder="Tumor Marker Value" 
                className="input-field" 
              />
              <textarea 
                value={patientData.state.progression.progressionNotes || ''} 
                onChange={(e) => patientData.actions.updateProgression({ progressionNotes: e.target.value })} 
                placeholder="Progression Notes..." 
                rows={4} 
                className="textarea-field" 
              />
            </form>

            <div className="flex justify-end mt-6">
              <button type="button" onClick={handleSaveProgression} className="save-button">Save Progression</button>
            </div>
          </Tab.Panel>          {/* Lines of Treatment */}
          <Tab.Panel>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <select 
                value={patientData.state.treatmentLine.treatmentLine} 
                onChange={(e) => patientData.actions.updateTreatmentLine({ treatmentLine: e.target.value as any })} 
                className="input-field"
                aria-label="Treatment Line"
              >
                <option value="">Select Line</option>
                <option value="1st Line">1st Line</option>
                <option value="2nd Line">2nd Line</option>
                <option value="3rd Line">3rd Line</option>
                <option value="Maintenance">Maintenance</option>
              </select>
              <input 
                type="text" 
                value={patientData.state.treatmentLine.treatmentRegimen} 
                onChange={(e) => patientData.actions.updateTreatmentLine({ treatmentRegimen: e.target.value })} 
                placeholder="Treatment Regimen" 
                className="input-field" 
              />
              <input 
                type="date" 
                value={patientData.state.treatmentLine.startDate} 
                onChange={(e) => patientData.actions.updateTreatmentLine({ startDate: e.target.value })} 
                className="input-field" 
                aria-label="Start Date"
                placeholder="Start Date"
              />
              <input 
                type="date" 
                value={patientData.state.treatmentLine.endDate || ''} 
                onChange={(e) => patientData.actions.updateTreatmentLine({ endDate: e.target.value })} 
                className="input-field" 
                aria-label="End Date"
                placeholder="End Date"
              />
              <select 
                value={patientData.state.treatmentLine.treatmentResponse} 
                onChange={(e) => patientData.actions.updateTreatmentLine({ treatmentResponse: e.target.value as any })} 
                className="input-field"
                aria-label="Treatment Response"
              >
                <option value="">Select Response</option>
                <option value="Complete Response">Complete Response (CR)</option>
                <option value="Partial Response">Partial Response (PR)</option>
                <option value="Stable Disease">Stable Disease (SD)</option>
                <option value="Progressive Disease">Progressive Disease (PD)</option>
              </select>
              <textarea 
                value={patientData.state.treatmentLine.treatmentNotes || ''} 
                onChange={(e) => patientData.actions.updateTreatmentLine({ treatmentNotes: e.target.value })} 
                placeholder="Treatment Notes..." 
                rows={4} 
                className="textarea-field" 
              />
            </form>

            <div className="flex justify-end mt-6">
              <button type="button" onClick={handleSaveTreatmentLines} className="save-button">Save Line of Treatment</button>
            </div>
          </Tab.Panel>          {/* AI Assistant Panel */}
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
              {legacySuggestions.length > 0 && (
                <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900 dark:to-indigo-900 rounded-xl shadow-sm mb-6 transform transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
                  <h4 className="text-lg font-bold mb-3 text-purple-600 dark:text-purple-400 flex items-center">
                    <span className="mr-2 p-1 bg-purple-100 dark:bg-purple-800 rounded-full">
                      🎯
                    </span>
                    Standard Protocols for {patientData.state.diseaseStatus.primaryDiagnosis}
                  </h4>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1.5">
                    {legacySuggestions.map((protocol, idx) => (
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
                  disabled={aiAssistant.isLoading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                >
                  {aiAssistant.isLoading ? (
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

                {aiAssistant.response && (
                  <div className="p-6 mt-6 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900 rounded-xl shadow-lg border border-blue-100 dark:border-blue-800 transform transition-all duration-500 animate-in fade-in-0 slide-in-from-bottom-4">
                    <h4 className="text-lg font-bold mb-3 text-blue-600 dark:text-blue-300 flex items-center">
                      <span className="mr-2 p-1 bg-blue-100 dark:bg-blue-800 rounded-full">
                        🧠
                      </span>
                      AI Personalized Recommendations
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">{aiAssistant.response}</p>
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
