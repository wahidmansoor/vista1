import React, { useMemo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, CheckCircle, AlertCircle, Save, Trash2, Printer, Brain } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { EvaluationSummary } from '../components/EvaluationSummary';
import { CancerType } from '../types/evaluation';
import { evaluationTemplates } from '../data/evaluationTemplates';
import FormField from '../components/FormField';
import Button from '../components/Button';
import { useEvaluation } from '../context/EvaluationContext';
import { savePatientEvaluation } from '../../../services/patientEvaluationService';
import { ProgressStepper } from '../components/ProgressStepper';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AISidebar } from '../components/AISidebar';
import type { EvaluationTemplate } from '../types/evaluation';
import { TNMStaging, ECOGSelector, KarnofskySlider } from '../components/staging';
import { TNMStage, PerformanceStatus } from '../types/evaluation';

const cancerTypes: { value: CancerType; label: string }[] = [
  { value: 'breast', label: 'Breast Cancer' },
  { value: 'lung', label: 'Lung Cancer' },
  { value: 'colorectal', label: 'Colorectal Cancer' },
  { value: 'prostate', label: 'Prostate Cancer' },
  { value: 'lymphoma', label: 'Lymphoma' },
  { value: 'ovarian', label: 'Ovarian Cancer' },
  { value: 'gastric', label: 'Gastric Cancer' },
  { value: 'head_neck', label: 'Head and Neck Cancer' }
];

const AUTOSAVE_KEY = 'patient-evaluation-autosave';
const AUTOSAVE_INTERVAL = 30000; // 30 seconds

const PatientEvaluationForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    formData,
    updateFormField,
    clearFormData,
    selectedCancerType,
    setSelectedCancerType,
    isFormSubmitting,
    setIsFormSubmitting,
    formError,
    setFormError,
    formSuccess,
    setFormSuccess
  } = useEvaluation();
  const [isAISidebarOpen, setIsAISidebarOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState<string>();
  const [tnmStage, setTnmStage] = useState<TNMStage>({ t: '', n: '', m: '' });
  const [performanceStatus, setPerformanceStatus] = useState<PerformanceStatus>({
    ecog: 0,
    kps: 100
  });

  const currentTemplate = useMemo(() => {
    if (!selectedCancerType) return null;
    return evaluationTemplates[selectedCancerType];
  }, [selectedCancerType]);

  // Calculate form progress steps
  const steps = useMemo(() => {
    if (!currentTemplate) return [];
    
    return currentTemplate.sections.map((section, index) => ({
      id: index + 1,
      name: section.title,
      description: section.cancerSpecificNotes?.[0] || '',
      status: getStepStatus(index) as 'complete' | 'current' | 'upcoming'
    }));
  }, [currentTemplate, formData]);

  const getStepStatus = (sectionIndex: number) => {
    if (!currentTemplate) return 'upcoming';
    
    const sectionFields = currentTemplate.sections[sectionIndex].items.map(
      (_, itemIndex) => `section-${sectionIndex}-item-${itemIndex}`
    );
    
    const isComplete = sectionFields.every(id => formData[id]?.trim());
    const isCurrent = !isComplete && sectionFields.some(id => formData[id]?.trim());
    
    return isComplete ? 'complete' : isCurrent ? 'current' : 'upcoming';
  };

  // Print functionality
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const styles = `
      <style>
        body { font-family: system-ui; line-height: 1.5; padding: 2rem; }
        h1 { color: #4f46e5; margin-bottom: 1.5rem; }
        .section { margin-bottom: 2rem; }
        .field { margin-bottom: 1rem; }
        .label { font-weight: 600; color: #374151; }
        .value { margin-top: 0.25rem; }
        .red-flag { color: #dc2626; padding: 0.5rem; background: #fee2e2; border-radius: 0.25rem; }
        @media print {
          body { padding: 0; }
          .page-break { page-break-before: always; }
        }
      </style>
    `;

    let content = `
      <h1>Patient Evaluation - ${selectedCancerType}</h1>
      <div class="content">
    `;

    if (currentTemplate) {
      currentTemplate.sections.forEach((section, sIndex) => {
        content += `<div class="section">
          <h2>${section.title}</h2>`;
        
        section.items.forEach((item, iIndex) => {
          const fieldId = `section-${sIndex}-item-${iIndex}`;
          const value = formData[fieldId] || 'Not provided';
          
          content += `
            <div class="field">
              <div class="label">${item.text}</div>
              <div class="value">${value}</div>
              ${item.redFlags?.map(flag => 
                `<div class="red-flag">⚠️ ${flag}</div>`
              ).join('') || ''}
            </div>
          `;
        });
        
        content += '</div>';
      });
    }

    content += '</div>';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>${styles}</head>
        <body>${content}</body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  // Load saved form data on mount
  useEffect(() => {
    const savedData = localStorage.getItem(AUTOSAVE_KEY);
    if (savedData) {
      try {
        const { cancerType, data } = JSON.parse(savedData);
        setSelectedCancerType(cancerType);
        Object.entries(data).forEach(([id, value]) => {
          updateFormField(id, value as string);
        });
        toast({
          title: 'Form Data Restored',
          description: 'Your previous progress has been loaded.',
          duration: 3000
        });
      } catch (error) {
        console.error('Error loading saved form data:', error);
      }
    }
  }, []);

  // Autosave form data periodically
  useEffect(() => {
    if (!selectedCancerType || Object.keys(formData).length === 0) return;
    
    const autosaveData = () => {
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify({
        cancerType: selectedCancerType,
        data: formData,
        timestamp: new Date().toISOString()
      }));
    };

    const intervalId = setInterval(autosaveData, AUTOSAVE_INTERVAL);
    return () => clearInterval(intervalId);
  }, [selectedCancerType, formData]);

  // Clear autosaved data after successful submission
  const clearAutosavedData = () => {
    localStorage.removeItem(AUTOSAVE_KEY);
  };

  const missingRequired = useMemo(() => {
    if (!currentTemplate) return [];
    
    return currentTemplate.sections
      .flatMap((section, sIndex) => 
        section.items
          .map((item, iIndex) => ({
            item,
            id: `section-${sIndex}-item-${iIndex}`,
          }))
      )
      .filter(({ item, id }) => 
        item.required && (!formData[id] || formData[id].trim() === '')
      );
  }, [currentTemplate, formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setFormError(null);
    setFormSuccess(false);
    
    // Validate selected cancer type
    if (!selectedCancerType) {
      setFormError('Please select a cancer type.');
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please select a cancer type to proceed.'
      });
      return;
    }
    
    // Validate required fields
    if (missingRequired.length > 0) {
      const errorMessage = `Please complete all required fields (${missingRequired.length} missing).`;
      setFormError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Missing Required Fields',
        description: errorMessage
      });
      
      // Scroll to first missing field
      const firstMissingId = missingRequired[0].id;
      const element = document.getElementById(firstMissingId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }
    
    // Proceed with submission
    try {
      setIsFormSubmitting(true);
      
      await savePatientEvaluation({
        cancerType: selectedCancerType,
        formData,
        timestamp: new Date().toISOString()
      });
      
      // Clear autosaved data after successful submission
      clearAutosavedData();
      
      setFormSuccess(true);
      toast({
        title: 'Success',
        description: 'Patient evaluation saved successfully.',
        duration: 3000
      });
      
      // Navigate after showing success message
      setTimeout(() => {
        navigate('/opd');
      }, 1000);
      
    } catch (error) {
      console.error('Form submission error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save evaluation. Please try again.';
      setFormError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Save Error',
        description: errorMessage,
        duration: 5000
      });
    } finally {
      setIsFormSubmitting(false);
    }
  };

  // Modified clearFormData handler to also clear autosaved data
  const handleClearForm = () => {
    if (window.confirm('Are you sure you want to clear all form data? This cannot be undone.')) {
      clearFormData();
      clearAutosavedData();
      toast({
        title: 'Form Cleared',
        description: 'All form data has been cleared.',
        duration: 3000
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* AI Assistant Button */}
      <div className="fixed right-4 top-4 z-50">
        <button
          type="button"
          onClick={() => setIsAISidebarOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
        >
          <Brain className="w-5 h-5" />
          <span>AI Assistant</span>
        </button>
      </div>

      {/* AI Sidebar */}
      <AISidebar
        isOpen={isAISidebarOpen}
        onClose={() => setIsAISidebarOpen(false)}
        currentSection={currentSection}
      />

      {/* Progress Stepper */}
      {currentTemplate && (
        <ProgressStepper
          steps={steps}
          currentStep={steps.findIndex(step => step.status === 'current')}
        />
      )}

      {/* Cancer Type Selector */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <label 
          htmlFor="cancer-type-select" 
          className="block text-lg font-semibold text-gray-900 mb-4"
        >
          Select Cancer Type
        </label>
        <select
          id="cancer-type-select"
          aria-label="Cancer Type"
          value={selectedCancerType || ''}
          onChange={(e) => setSelectedCancerType(e.target.value as CancerType)}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select cancer type...</option>
          {cancerTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {currentTemplate && (
        <>
          <h2 className="text-xl font-bold text-gray-800">🩺 Oncologist's Comprehensive OPD Evaluation</h2>
          <p className="text-sm text-gray-600">
            Use this structured form to guide your clinical judgment and capture essential information during patient evaluation in oncology OPD.
          </p>

          {/* Notes and Guidance */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="text-blue-800 font-semibold flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5" />
              Clinical Guidance
            </h3>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              {currentTemplate.notes.map((note, index) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
          </div>

          {/* Red Flags Alert */}
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h3 className="text-red-800 font-semibold flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5" />
              Red Flags to Monitor
            </h3>
            <ul className="list-disc list-inside space-y-1 text-red-700">
              {currentTemplate.redFlags.map((flag, index) => (
                <li key={index}>{flag}</li>
              ))}
            </ul>
          </div>

          {/* Staging Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-900">Disease Staging & Performance Status</h3>
              <p className="mt-2 text-sm text-gray-600">
                Document current disease stage and patient's functional status
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TNMStaging
                cancerType={selectedCancerType as CancerType}
                value={tnmStage}
                onChange={setTnmStage}
              />
              <div className="space-y-6">
                <ECOGSelector
                  value={performanceStatus.ecog}
                  onChange={(value) => setPerformanceStatus(prev => ({ ...prev, ecog: value }))}
                />
                <KarnofskySlider
                  value={performanceStatus.kps}
                  onChange={(value) => setPerformanceStatus(prev => ({ ...prev, kps: value }))}
                />
              </div>
            </div>
          </div>

          {/* Evaluation Sections */}
          {currentTemplate.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                {section.cancerSpecificNotes && (
                  <div className="mt-2 text-sm text-gray-600">
                    {section.cancerSpecificNotes.map((note, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-blue-500" />
                        {note}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {section.items.map((item, itemIndex) => {
                  const fieldId = `section-${sectionIndex}-item-${itemIndex}`;
                  const isRequired = !!item.required;
                  const isError = missingRequired.some(m => m.id === fieldId);
                  const hasRedFlags = item.redFlags && item.redFlags.length > 0;
                  
                  return (
                    <div key={itemIndex} className="relative">
                      <FormField
                        id={fieldId}
                        label={item.text}
                        required={isRequired}
                        value={formData[fieldId] || ''}
                        onChange={(value) => updateFormField(fieldId, value)}
                        error={isError}
                        redFlags={item.redFlags || []}
                        inputClassName={hasRedFlags ? 'border-red-200 focus:ring-red-500 focus:border-red-500' : ''}
                      />
                      {hasRedFlags && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="absolute right-3 top-3">
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="bg-red-50 border border-red-200 p-3 max-w-xs">
                              <div className="font-medium mb-1 text-red-800">Clinical Red Flags:</div>
                              <ul className="list-disc pl-4 text-sm text-red-700">
                                {item.redFlags?.map((flag, idx) => (
                                  <li key={idx}>{flag}</li>
                                ))}
                              </ul>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="mt-6">
            <EvaluationSummary 
              template={currentTemplate as EvaluationTemplate}
              formData={formData}
            />
          </div>

          {/* Error message */}
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              {formError}
            </div>
          )}
          
          {/* Success message */}
          {formSuccess && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-700 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Evaluation saved successfully! Redirecting...
            </div>
          )}

          <div className="flex justify-end gap-4 sticky bottom-0 bg-white p-4 border-t mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={handlePrint}
              icon={<Printer className="w-4 h-4" />}
            >
              Print Summary
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleClearForm}
              disabled={isFormSubmitting}
              icon={<Trash2 className="w-4 h-4" />}
            >
              Clear Form
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isFormSubmitting}
              icon={!isFormSubmitting ? <Save className="w-4 h-4" /> : undefined}
            >
              {isFormSubmitting ? 'Saving...' : 'Save Evaluation'}
            </Button>
          </div>
        </>
      )}
    </form>
  );
};

export { PatientEvaluationForm };
