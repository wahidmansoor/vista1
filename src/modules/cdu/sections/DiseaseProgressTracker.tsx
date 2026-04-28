import React, { useState, useEffect, useMemo } from 'react';
import { Tab, Menu, Transition } from '@headlessui/react';
import { BarChart2, Activity, FolderOpen, Syringe, Bot, AlertTriangle, ChevronDown, CheckCircle2, FileText, Save, List, Trash2, Download } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

// Import new hooks and components
import { usePatientData } from './hooks/usePatientData';
import { useProtocolSuggestions, useLegacyProtocolSuggestions } from './hooks/useProtocolSuggestions';
import { useAiAssistant } from './hooks/useAiAssistant';
import { DiseaseStatusTab } from './components/DiseaseStatusTab';
import ProtocolResultCard from './components/ProtocolResultCard';
import { ProtocolComparisonPanel } from './components/ProtocolComparisonPanel';
import { ClinicalSummaryModal } from './components/ClinicalSummaryModal';
import { ClinicalDataGaps } from './components/ClinicalDataGaps';
import { TreatmentProtocol } from './types/diseaseProgress.types';
import { generateClinicalSummary } from './utils/generateClinicalSummary';
import { caseStorageService, SavedCase } from './utils/caseStorageService';

// Legacy imports - will be removed after refactoring
import { TREATMENT_PROTOCOLS } from "../data/treatmentProtocolsData";

const tabs = [
  { title: 'Disease Status', icon: BarChart2 },
  { title: 'Performance Status', icon: Activity },
  { title: 'Progression', icon: FolderOpen },
  { title: 'Lines of Treatment', icon: Syringe },
  { title: 'CDS Advisor', icon: Bot }
];

const DiseaseProgressTracker: React.FC = () => {
  const { toast } = useToast();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [aiInput, setAiInput] = useState('');
  const [compareList, setCompareList] = useState<TreatmentProtocol[]>([]);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState('');
  const [savedCases, setSavedCases] = useState<SavedCase[]>([]);

  // Load cases on mount
  useEffect(() => {
    setSavedCases(caseStorageService.loadCases());
  }, []);

  // Case Management Handlers
  const handleSaveCase = () => {
    const summary = generateClinicalSummary(
      patientData.state,
      eligibleMatches,
      ineligibleMatches
    );
    caseStorageService.saveCase(patientData.state, undefined, summary);
    setSavedCases(caseStorageService.loadCases());
    toast({
      title: "Case Saved",
      description: "Patient scenario has been saved locally.",
    });
  };

  const handleLoadCase = (savedCase: SavedCase) => {
    patientData.actions.loadFromStorage(savedCase.data);
    toast({
      title: "Case Loaded",
      description: `Loaded case from ${new Date(savedCase.updatedAt).toLocaleDateString()}`,
    });
  };

  const handleDeleteCase = (caseId: string) => {
    caseStorageService.deleteCase(caseId);
    setSavedCases(caseStorageService.loadCases());
    toast({
      title: "Case Deleted",
      variant: "destructive"
    });
  };

  // Protocol Comparison Handlers
  const toggleProtocolComparison = (protocol: TreatmentProtocol) => {
    setCompareList(prev => {
      const isAlreadyIn = prev.some(p => p.id === protocol.id);
      if (isAlreadyIn) {
        return prev.filter(p => p.id !== protocol.id);
      }
      if (prev.length >= 3) {
        toast({
          title: "Comparison Limit",
          description: "You can compare up to 3 protocols at a time.",
          variant: "destructive"
        });
        return prev;
      }
      return [...prev, protocol];
    });
  };

  const clearComparison = () => setCompareList([]);

  // Clinical Summary Handler
  const handleGenerateSummary = () => {
    const summary = generateClinicalSummary(
      patientData.state,
      eligibleMatches,
      ineligibleMatches
    );
    setGeneratedSummary(summary);
    setIsSummaryModalOpen(true);
  };

  // Use new hooks for state management
  const patientData = usePatientData();
  const protocolSuggestions = useProtocolSuggestions(
    patientData.state.diseaseStatus,
    patientData.state.performanceStatus,
    patientData.state.treatmentHistory
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

  const EVIDENCE_RANK: Record<string, number> = {
    'Category 1': 1,
    'Category 2A': 2,
    'Category 2B': 3,
    'Category 3': 4
  };

  const sortedMatches = useMemo(() => {
    return [...protocolSuggestions.matches].sort((a, b) => {
      // Sort by status group first (Eligible > Potential > Not Eligible)
      const statusRank = (s: string) => {
        if (s === 'Eligible option') return 1;
        if (s === 'Potential option') return 2;
        return 3;
      };

      const rankA = statusRank(a.status);
      const rankB = statusRank(b.status);

      if (rankA !== rankB) return rankA - rankB;

      // Then by preferredOption
      if (a.protocol.preferredOption && !b.protocol.preferredOption) return -1;
      if (!a.protocol.preferredOption && b.protocol.preferredOption) return 1;

      // Then by evidenceLevel
      const evA = EVIDENCE_RANK[a.protocol.evidenceLevel] || 99;
      const evB = EVIDENCE_RANK[b.protocol.evidenceLevel] || 99;
      return evA - evB;
    });
  }, [protocolSuggestions.matches]);

  // Grouped matches for clean UI rendering
  const eligibleMatches = sortedMatches.filter(m => m.status === 'Eligible option');
  const potentialMatches = sortedMatches.filter(m => m.status === 'Potential option');
  const ineligibleMatches = sortedMatches.filter(m => m.status === 'Not eligible' || m.status === 'Not recommended');

  const missingClinicalData = validationSummary.globalErrors.length > 0;

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
        <div className="flex gap-2">
          {/* Case Management Menu */}
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="inline-flex items-center gap-2 px-4 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition shadow-sm">
              <List className="h-4 w-4" /> My Cases
              <ChevronDown className="h-4 w-4" />
            </Menu.Button>
            <Transition
              as={React.Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-72 origin-top-right divide-y divide-slate-100 dark:divide-slate-700 rounded-xl bg-white dark:bg-slate-800 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div className="px-1 py-1">
                  {savedCases.length === 0 ? (
                    <div className="px-4 py-6 text-center text-sm text-slate-500">
                      No saved cases found.
                    </div>
                  ) : (
                    savedCases.map((c) => (
                      <Menu.Item key={c.caseId}>
                        {({ active }) => (
                          <div className={`${active ? 'bg-indigo-50 dark:bg-indigo-900/30' : ''} px-3 py-2 rounded-lg flex items-center justify-between group`}>
                            <button
                              onClick={() => handleLoadCase(c)}
                              className="flex-1 text-left"
                            >
                              <div className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                {c.data.diseaseStatus.primaryDiagnosis || "Unnamed Case"}
                              </div>
                              <div className="text-[10px] text-slate-500">
                                {new Date(c.updatedAt).toLocaleDateString()} at {new Date(c.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCase(c.caseId);
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Delete Case"
                              aria-label="Delete Case"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </Menu.Item>
                    ))
                  )}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>

          <button
            type="button"
            onClick={handleSaveCase}
            className="px-4 py-3 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-semibold rounded-lg border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 transition flex items-center gap-2 shadow-sm"
          >
            <Save className="h-4 w-4" /> Save
          </button>

          <div className="h-10 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

          <button
            type="button"
            onClick={handleGenerateSummary}
            className="px-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 shadow-md"
          >
            <FileText className="h-4 w-4" /> Summary
          </button>
          
          <button
            type="button"
            onClick={handleClearAllData}
            className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition"
            title="Clear All Data"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
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
          </Tab.Panel>          {/* AI Assistant Panel - Refactored to Clinical Decision Support */}
          <Tab.Panel>
            <div className="max-w-4xl mx-auto py-2">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
                <Bot className="h-6 w-6 text-indigo-600" />
                Clinical Decision Support
              </h3>

              {/* CLINICAL SUMMARY HEADER */}
              <div className="mb-6 p-4 bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-3 flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-400"></div>
                  Clinical Summary
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase mb-1">Diagnosis</span>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate block">
                      {patientData.state.diseaseStatus.primaryDiagnosis || "Not Specified"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase mb-1">Stage / ECOG</span>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200 block">
                      {patientData.state.diseaseStatus.stageAtDiagnosis || "—"} / {patientData.state.performanceStatus.performanceScore || "—"}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-slate-400 block uppercase mb-1">Key Biomarkers</span>
                    <div className="flex flex-wrap gap-1">
                      {patientData.state.diseaseStatus.biomarkers.length > 0 ? (
                        patientData.state.diseaseStatus.biomarkers.slice(0, 3).map((b, i) => (
                          <span key={i} className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px] font-bold text-slate-600 dark:text-slate-300">
                            {b.name}: {b.status}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">None entered</span>
                      )}
                      {patientData.state.diseaseStatus.biomarkers.length > 3 && (
                        <span className="text-[10px] text-slate-400 flex items-center ml-1">
                          +{patientData.state.diseaseStatus.biomarkers.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* CLINICAL DATA GAPS */}
              <ClinicalDataGaps patientData={patientData.state} />

              {/* Safety Banner: Incomplete Data */}
              {missingClinicalData && (
                <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-center gap-3 text-amber-800 dark:text-amber-200">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                  <p className="text-sm font-semibold">
                    ⚠️ Incomplete clinical data — results may be unsafe. Please complete diagnosis and stage fields.
                  </p>
                </div>
              )}

              {/* PROTOCOL COMPARISON PANEL */}
              <ProtocolComparisonPanel 
                protocols={compareList}
                onRemove={(p) => toggleProtocolComparison(p)}
                onClear={clearComparison}
              />

              {/* EMPTY STATE */}
              {protocolSuggestions.matches.length === 0 && (
                <div className="p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 mb-8">
                  <div className="text-4xl mb-3">🔍</div>
                  <h4 className="text-lg font-bold text-slate-700 dark:text-slate-300">No clear protocol match found</h4>
                  <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    Ensure primary diagnosis and biomarkers are entered correctly. Consider full MDT review for complex cases.
                  </p>
                </div>
              )}

              {/* ELIGIBLE OPTIONS */}
              {eligibleMatches.length > 0 && (
                <section className="mb-10">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Eligible Strategy Options</h4>
                  </div>
                  <div className="space-y-4">
                    {eligibleMatches.map(match => (
                      <ProtocolResultCard 
                        key={match.protocol.id} 
                        match={match} 
                        isComparing={compareList.some(p => p.id === match.protocol.id)}
                        onToggleCompare={toggleProtocolComparison}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* POTENTIAL OPTIONS (YELLOW) */}
              {potentialMatches.length > 0 && (
                <section className="mb-10">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Potential Options (Check Conditions)</h4>
                  </div>
                  <div className="space-y-4">
                    {potentialMatches.map(match => (
                      <ProtocolResultCard 
                        key={match.protocol.id} 
                        match={match} 
                        isComparing={compareList.some(p => p.id === match.protocol.id)}
                        onToggleCompare={toggleProtocolComparison}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* INELIGIBLE OPTIONS (COLLAPSED BY DEFAULT) */}
              {ineligibleMatches.length > 0 && (
                <details className="mb-10 group bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                  <summary className="p-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between font-bold text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-400"></div>
                      <span>Not Eligible Recommended ({ineligibleMatches.length})</span>
                    </div>
                    <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="p-4 pt-0 space-y-4">
                    <div className="p-3 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-xs rounded mb-4 border border-red-100 dark:border-red-900">
                      These protocols were evaluated and found ineligible due to clinical mismatches (biomarkers, stage, or histology).
                    </div>
                    {ineligibleMatches.map(match => (
                      <ProtocolResultCard 
                        key={match.protocol.id} 
                        match={match} 
                        isComparing={compareList.some(p => p.id === match.protocol.id)}
                        onToggleCompare={toggleProtocolComparison}
                      />
                    ))}
                  </div>
                </details>
              )}

              {/* Safety Footer */}
              <div className="mt-8 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-center shadow-sm">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium italic leading-relaxed">
                  "This decision support Advisor is based on a limited local protocol dataset. Full clinical evaluation and multidisciplinary team (MDT) review are mandatory before any final decision."
                </p>
              </div>

              {/* Legacy AI Assistant - Integrated at bottom as reference */}
              <div className="mt-16 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
                <h4 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <span className="p-1 bg-indigo-50 dark:bg-indigo-900/50 rounded text-sm">🧪</span>
                  AI Experimental Assistant
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
                      AI Insights Output
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">{aiAssistant.response}</p>
                  </div>
                )}
              </div>
            </div>
          </Tab.Panel>

        </Tab.Panels>
      </Tab.Group>

      {/* Clinical Summary Modal */}
      <ClinicalSummaryModal 
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        summaryText={generatedSummary}
      />
    </div>
  );
};

export default DiseaseProgressTracker;
