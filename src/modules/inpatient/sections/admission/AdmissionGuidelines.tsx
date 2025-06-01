import React, { useState, useMemo, useCallback } from 'react';
import { cancerTypes, getPreAdmissionChecklist, getInitialOrders } from './admissionTemplates';
import { motion, AnimatePresence } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Printer, AlertTriangle } from "lucide-react";

interface PresentingIssue {
  key: string;
  label: string;
  isUrgent?: boolean;
}

const presentingIssues: PresentingIssue[] = [
  { key: 'febrile_neutropenia', label: 'Febrile Neutropenia', isUrgent: true },
  { key: 'pain', label: 'Uncontrolled Pain' },
  { key: 'nausea_vomiting', label: 'Intractable Nausea/Vomiting' },
  { key: 'sob', label: 'Shortness of Breath' },
  { key: 'ams', label: 'Altered Mental Status', isUrgent: true },
  { key: 'cord_compression', label: 'Suspected Cord Compression', isUrgent: true },
  { key: 'svcs', label: 'Suspected SVCS', isUrgent: true },
  { key: 'hypercalcemia', label: 'Hypercalcemia', isUrgent: true },
  { key: 'tls', label: 'Tumor Lysis Syndrome Risk', isUrgent: true },
];

interface TriageResult {
  action: 'Admit' | 'OPD' | 'Refer';
  urgency: 'Critical' | 'High' | 'Moderate' | 'Low';
}

const triageLogic = (cancerKey: string, issueKey: string): TriageResult => {
  if (['cord_compression', 'svcs', 'ams', 'hypercalcemia', 'tls'].includes(issueKey)) {
    return { action: 'Admit', urgency: 'Critical' };
  }
  if (issueKey === 'febrile_neutropenia') {
    return { action: 'Admit', urgency: 'High' };
  }
  if (['pain', 'nausea_vomiting', 'sob'].includes(issueKey)) {
    return { action: 'Admit', urgency: 'Moderate' };
  }
  return { action: 'OPD', urgency: 'Low' };
};

interface Disposition {
  location: string;
  reason: string;
}

const getDisposition = (cancerKey: string, issueKey: string, triage: TriageResult): Disposition => {
  if (triage.urgency === 'Critical' || ['cord_compression', 'svcs', 'ams'].includes(issueKey)) {
    return { location: 'ICU/Step-Down', reason: `Critical issue: ${issueKey}` };
  }
  if (triage.action === 'Admit') {
    return { location: 'Oncology Ward', reason: `Admission required for ${issueKey}` };
  }
  if (triage.action === 'OPD') {
    return { location: 'Outpatient Clinic Follow-up', reason: 'Stable for outpatient management' };
  }
  return { location: 'Refer to ED/Specialist', reason: 'Requires further evaluation or different service' };
};

const generateAdmissionNote = (
  cancer: string,
  issue: string,
  triage: TriageResult,
  orders: string[],
  disposition: Disposition
): string => {
  const cancerLabel = cancerTypes.find((c: { key: string; label: string }) => c.key === cancer)?.label || cancer;
  const issueLabel = presentingIssues.find((i: PresentingIssue) => i.key === issue)?.label || issue;

  return `
**Oncology Admission Note**

**Patient Presentation:** Patient with ${cancerLabel} presents with ${issueLabel}.

**History of Present Illness (HPI):**
[Detailed HPI to be filled in by clinician]

**Reason for Admission:** ${issueLabel} requiring inpatient management. Triage assessment indicates ${triage.action} with ${triage.urgency} urgency.

**Initial Orders:**
${orders.map((order: string) => `- ${order}`).join('\n')}

**Plan & Disposition:**
- Admit to ${disposition.location}.
- Rationale: ${disposition.reason}.
- Consults: [Add consults as needed, e.g., Neurosurgery, Palliative Care]
- Follow-up: [Add follow-up plan]

**Code Status:** [Confirm code status]

[Clinician Name/Signature]
Date/Time: ${new Date().toLocaleString()}
  `.trim();
};

const AdmissionAssistant: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedCancer, setSelectedCancer] = useState<string>(cancerTypes[0].key);
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [checklistItems, setChecklistItems] = useState<Record<string, boolean>>({});

  const triageResult = useMemo(() => {
    if (!selectedCancer || !selectedIssue) return null;
    return triageLogic(selectedCancer, selectedIssue);
  }, [selectedCancer, selectedIssue]);

  const dynamicChecklist = useMemo(() => {
    return getPreAdmissionChecklist(selectedCancer);
  }, [selectedCancer]);

  const isChecklistComplete = useMemo(() => {
    if (dynamicChecklist.length === 0) return true;
    return dynamicChecklist.every(item => checklistItems[item]);
  }, [dynamicChecklist, checklistItems]);

  const initialOrders = useMemo(() => {
    if (!selectedCancer || !selectedIssue) return [];
    return getInitialOrders(selectedCancer, selectedIssue);
  }, [selectedCancer, selectedIssue]);

  const disposition = useMemo(() => {
    if (!selectedCancer || !selectedIssue || !triageResult) return null;
    return getDisposition(selectedCancer, selectedIssue, triageResult);
  }, [selectedCancer, selectedIssue, triageResult]);

  const admissionNote = useMemo(() => {
    if (!selectedCancer || !selectedIssue || !triageResult || !disposition) return '';
    return generateAdmissionNote(selectedCancer, selectedIssue, triageResult, initialOrders, disposition);
  }, [selectedCancer, selectedIssue, triageResult, initialOrders, disposition]);

  const handleChecklistChange = useCallback((item: string, checked: boolean) => {
    setChecklistItems(prev => ({ ...prev, [item]: checked }));
  }, []);

  const renderIssueButton = useCallback((issue: PresentingIssue) => (
    <Button
      key={issue.key}
      variant={selectedIssue === issue.key ? "default" : "outline"}
      size="sm"
      className="rounded-lg px-4 py-2 font-semibold border shadow-sm hover:bg-blue-600 hover:text-white transition-all duration-200"
      onClick={() => setSelectedIssue(issue.key)}
    >
      <span className="flex items-center gap-2">
        {issue.label}
        {issue.isUrgent && (
          <AlertTriangle className="inline-block w-4 h-4 text-amber-500" />
        )}
      </span>
    </Button>
  ), [selectedIssue]);

  const getUrgencyColor = (urgency: TriageResult['urgency']): string => {
    switch (urgency) {
      case 'Critical': return 'bg-red-600';
      case 'High': return 'bg-orange-500';
      case 'Moderate': return 'bg-yellow-400 text-black';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-400';
    }
  };

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, 5));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);

  const steps = [
    { label: 'Cancer Type', icon: '🏥' },
    { label: 'Issue', icon: '⚠️' },
    { label: 'Checklist', icon: '📋' },
    { label: 'Note', icon: '📝' },
  ];

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto">
      {/* Stepper Header */}
      <div className="flex justify-between items-center px-6 py-3 bg-slate-50 rounded-xl shadow-sm text-sm font-medium text-gray-600 mb-6">
        {steps.map((step, i) => (
          <div
            key={i}
            className={`flex items-center gap-2 px-3 py-2 rounded transition-all ${
              currentStep === i + 1
                ? 'text-blue-700 font-bold border-b-2 border-blue-600'
                : 'hover:text-blue-500'
            }`}
          >
            <span>{step.icon}</span>
            <span>Step {i + 1}: {step.label}</span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="transition-all duration-200"
          >
            <Card className="rounded-xl border border-slate-200 shadow-lg bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-blue-900">Select Cancer Type</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <Select value={selectedCancer} onValueChange={setSelectedCancer}>
                  <SelectTrigger className="w-full border-slate-200 rounded-lg relative z-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent 
                    className="absolute z-50 bg-white border shadow-md rounded-md mt-1 w-full max-w-xs min-w-[280px] whitespace-normal overflow-x-hidden overflow-y-auto max-h-72"
                    side="bottom"
                  >
                    {cancerTypes.map(cancer => (
                      <SelectItem 
                        key={cancer.key} 
                        value={cancer.key}
                        className="whitespace-normal px-3 py-2 text-sm"
                      >
                        {cancer.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="mt-6 flex justify-end">
                  <Button 
                    onClick={nextStep}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                  >
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="rounded-xl border border-slate-200 shadow-lg bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-blue-900">Select Presenting Issue</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-3">
                  {presentingIssues.map(issue => (
                    <Button
                      key={issue.key}
                      variant={selectedIssue === issue.key ? "default" : "outline"}
                      size="sm"
                      className={`rounded-lg px-4 py-3 font-medium border hover:shadow-md transition duration-150 ${
                        selectedIssue === issue.key 
                          ? "bg-blue-700 text-white shadow-blue-100" 
                          : "bg-white hover:bg-blue-50"
                      }`}
                      onClick={() => setSelectedIssue(issue.key)}
                    >
                      <span className="flex items-center gap-2">
                        {issue.label}
                        {issue.isUrgent && (
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                        )}
                      </span>
                    </Button>
                  ))}
                </div>
                {/* Navigation Buttons */}
                <div className="mt-6 flex justify-between">
                  <Button variant="outline" onClick={prevStep}>Back</Button>
                  <Button 
                    onClick={nextStep} 
                    disabled={!selectedIssue}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                  >
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Checklist Step */}
        {currentStep === 3 && triageResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="rounded-xl border border-slate-200 shadow-lg bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-blue-900">Pre-Admission Checklist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <Badge 
                    className={`px-4 py-1.5 rounded-full text-white font-medium ${getUrgencyColor(triageResult.urgency)}`}
                  >
                    🚨 {triageResult.urgency} Priority
                  </Badge>
                </div>
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  {dynamicChecklist.map((item: string) => (
                    <div key={item} className="flex items-center gap-3 p-2.5 rounded hover:bg-slate-50 transition-colors">
                      <Checkbox
                        checked={checklistItems[item] || false}
                        onCheckedChange={(checked: boolean) => handleChecklistChange(item, checked)}
                        className="border-2 border-slate-300"
                      />
                      <span className="text-sm text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
                {/* Navigation */}
                <div className="mt-6 flex justify-between">
                  <Button variant="outline" onClick={prevStep}>Back</Button>
                  <Button 
                    onClick={nextStep} 
                    disabled={!isChecklistComplete}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                  >
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Admission Note Step */}
        {currentStep === 4 && triageResult && disposition && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="rounded-xl border border-slate-200 shadow-lg bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-blue-900">Admission Note</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={admissionNote}
                  className="h-[30rem] font-mono text-sm bg-slate-50 border border-slate-200 rounded-lg p-4"
                  readOnly
                />
                <div className="mt-6 flex justify-between">
                  <Button variant="outline" onClick={prevStep}>Back</Button>
                  <Button 
                    onClick={handlePrint}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                  >
                    <Printer className="mr-2 h-4 w-4" />
                    Print Note
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdmissionAssistant;
