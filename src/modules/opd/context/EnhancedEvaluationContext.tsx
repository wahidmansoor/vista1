// Enhanced Evaluation Context Provider
// filepath: d:\Mansoor\mwoncovista\vista1\src\modules\opd\context\EnhancedEvaluationContext.tsx

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import {
  CancerType,
  EnhancedPatientEvaluation,
  EnhancedEvaluationContextType,
  EvaluationTemplate,
  ValidationError,
  AIRecommendation,
  RedFlag,
  RiskFactor,
  RiskCategory
} from '../types/enhanced-evaluation';
import { enhancedEvaluationTemplates } from '../data/enhancedEvaluationTemplates';
import { calculateRiskScore, generateAIRecommendations, validateEvaluationForm } from '../services/enhancedEvaluationService';

const EnhancedEvaluationContext = createContext<EnhancedEvaluationContextType | undefined>(undefined);

export const useEnhancedEvaluation = (): EnhancedEvaluationContextType => {
  const context = useContext(EnhancedEvaluationContext);
  if (!context) {
    throw new Error('useEnhancedEvaluation must be used within an EnhancedEvaluationProvider');
  }
  return context;
};

interface EnhancedEvaluationProviderProps {
  children: ReactNode;
  evaluationId?: string; // For editing existing evaluations
}

export const EnhancedEvaluationProvider: React.FC<EnhancedEvaluationProviderProps> = ({ 
  children, 
  evaluationId 
}) => {
  // Core evaluation state
  const [evaluation, setEvaluation] = useState<Partial<EnhancedPatientEvaluation>>({
    riskCategory: 'low',
    status: 'draft',
    version: 1,
    formData: {},
    redFlags: [],
    aiRecommendations: [],
    riskFactors: [],
    protectiveFactors: [],
    contraindications: [],
    alternativePlans: [],
    validationErrors: [],
    completionPercentage: 0,
    mdtDiscussed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  // Form and UI state
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [selectedCancerType, setSelectedCancerType] = useState<CancerType | ''>('');
  const [currentTemplate, setCurrentTemplate] = useState<EvaluationTemplate | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);
  const [currentSection, setCurrentSection] = useState<string | null>(null);

  // AI and clinical decision support state
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([]);
  const [redFlags, setRedFlags] = useState<RedFlag[]>([]);
  const [riskAssessment, setRiskAssessment] = useState({
    category: 'low' as RiskCategory,
    score: 0,
    factors: [] as RiskFactor[]
  });

  // Load template when cancer type changes
  useEffect(() => {
    if (selectedCancerType) {
      const template = enhancedEvaluationTemplates[selectedCancerType];
      setCurrentTemplate(template || null);
      setEvaluation(prev => ({
        ...prev,
        cancerType: selectedCancerType
      }));
    } else {
      setCurrentTemplate(null);
    }
  }, [selectedCancerType]);

  // Calculate completion percentage
  const calculateCompletionPercentage = useCallback(() => {
    if (!currentTemplate) return 0;
    
    const requiredFields = currentTemplate.sections
      .flatMap(section => section.items.filter(item => item.required))
      .map(item => item.id);
    
    if (requiredFields.length === 0) return 100;
    
    const completedFields = requiredFields.filter(fieldId => 
      formData[fieldId] && formData[fieldId] !== '' && formData[fieldId] !== null
    );
    
    return Math.round((completedFields.length / requiredFields.length) * 100);
  }, [currentTemplate, formData]);

  // Update completion percentage when form data changes
  useEffect(() => {
    const percentage = calculateCompletionPercentage();
    setEvaluation(prev => ({
      ...prev,
      completionPercentage: percentage,
      formData: formData,
      updatedAt: new Date().toISOString()
    }));
  }, [formData, calculateCompletionPercentage]);

  // Update form field
  const updateFormField = useCallback((fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
    
    // Clear validation errors for this field
    setValidationErrors(prev => prev.filter(error => error.field !== fieldId));
    
    // Trigger real-time validation and AI recommendations
    setTimeout(() => {
      calculateRisk();
    }, 500);
  }, []);

  // Update evaluation
  const updateEvaluation = useCallback((updates: Partial<EnhancedPatientEvaluation>) => {
    setEvaluation(prev => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString()
    }));
  }, []);

  // Clear form data
  const clearFormData = useCallback(() => {
    setFormData({});
    setEvaluation(prev => ({
      ...prev,
      formData: {},
      completionPercentage: 0,
      validationErrors: [],
      updatedAt: new Date().toISOString()
    }));
    setValidationErrors([]);
    setAiRecommendations([]);
    setRedFlags([]);
    setRiskAssessment({
      category: 'low',
      score: 0,
      factors: []
    });
  }, []);

  // Calculate risk
  const calculateRisk = useCallback(async () => {
    if (!selectedCancerType || !currentTemplate) return;
    
    try {
      const riskData = await calculateRiskScore(selectedCancerType, formData, currentTemplate);
      setRiskAssessment(riskData);
      setEvaluation(prev => ({
        ...prev,
        riskCategory: riskData.category,
        riskScore: riskData.score,
        riskFactors: riskData.factors
      }));
      
      // Generate red flags based on risk assessment
      const flags = riskData.factors
        .filter(factor => factor.impact === 'high')
        .map((factor, index) => ({
          id: `risk-${index}`,
          type: 'warning' as const,
          category: 'clinical' as const,
          message: `High-impact risk factor: ${factor.factor}`,
          recommendation: factor.evidence || 'Consider additional evaluation',
          urgency: 'routine' as const,
          triggered: true,
          timestamp: new Date().toISOString()
        }));
      
      setRedFlags(flags);
      setEvaluation(prev => ({
        ...prev,
        redFlags: flags
      }));
    } catch (error) {
      console.error('Risk calculation error:', error);
    }
  }, [selectedCancerType, formData, currentTemplate]);

  // Generate AI recommendations
  const generateAIRecommendationsHandler = useCallback(async () => {
    if (!selectedCancerType || !currentTemplate) return;
    
    try {
      const recommendations = await generateAIRecommendations(selectedCancerType, formData, currentTemplate);
      setAiRecommendations(recommendations);
      setEvaluation(prev => ({
        ...prev,
        aiRecommendations: recommendations
      }));
    } catch (error) {
      console.error('AI recommendations error:', error);
    }
  }, [selectedCancerType, formData, currentTemplate]);

  // Validate form
  const validateForm = useCallback((): ValidationError[] => {
    if (!currentTemplate) return [];
    
    const errors = validateEvaluationForm(formData, currentTemplate);
    setValidationErrors(errors);
    setEvaluation(prev => ({
      ...prev,
      validationErrors: errors
    }));
    
    return errors;
  }, [formData, currentTemplate]);

  // Save evaluation
  const saveEvaluation = useCallback(async () => {
    try {
      setIsFormSubmitting(true);
      setFormError(null);
      
      // Validate before saving
      const errors = validateForm();
      if (errors.some(error => error.severity === 'error')) {
        throw new Error('Please fix validation errors before saving');
      }
      
      // TODO: Implement actual save to Supabase
      console.log('Saving evaluation:', evaluation);
      
      setFormSuccess(true);
      setTimeout(() => setFormSuccess(false), 3000);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save evaluation';
      setFormError(errorMessage);
    } finally {
      setIsFormSubmitting(false);
    }
  }, [evaluation, validateForm]);

  // Submit for review
  const submitForReview = useCallback(async () => {
    try {
      setIsFormSubmitting(true);
      setFormError(null);
      
      // Validate before submission
      const errors = validateForm();
      if (errors.some(error => error.severity === 'error')) {
        throw new Error('Please fix all validation errors before submitting');
      }
      
      // Check completion percentage
      if (evaluation.completionPercentage! < 90) {
        throw new Error('Evaluation must be at least 90% complete before submission');
      }
      
      // Update status and submission timestamp
      setEvaluation(prev => ({
        ...prev,
        status: 'pending_review',
        submittedAt: new Date().toISOString()
      }));
      
      // TODO: Implement actual submission to Supabase
      console.log('Submitting evaluation for review:', evaluation);
      
      setFormSuccess(true);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit evaluation';
      setFormError(errorMessage);
    } finally {
      setIsFormSubmitting(false);
    }
  }, [evaluation, validateForm]);

  // Auto-save functionality
  useEffect(() => {
    if (Object.keys(formData).length === 0) return;
    
    const autoSaveTimer = setTimeout(() => {
      // Auto-save to localStorage
      localStorage.setItem('enhanced-evaluation-autosave', JSON.stringify({
        evaluation,
        formData,
        selectedCancerType,
        timestamp: new Date().toISOString()
      }));
    }, 2000);
    
    return () => clearTimeout(autoSaveTimer);
  }, [evaluation, formData, selectedCancerType]);

  // Load auto-saved data on mount
  useEffect(() => {
    const autoSavedData = localStorage.getItem('enhanced-evaluation-autosave');
    if (autoSavedData && !evaluationId) {
      try {
        const parsed = JSON.parse(autoSavedData);
        const saveTime = new Date(parsed.timestamp);
        const now = new Date();
        const hoursSince = (now.getTime() - saveTime.getTime()) / (1000 * 60 * 60);
        
        // Only restore if saved within last 24 hours
        if (hoursSince < 24) {
          setEvaluation(parsed.evaluation);
          setFormData(parsed.formData);
          setSelectedCancerType(parsed.selectedCancerType);
        }
      } catch (error) {
        console.error('Error loading auto-saved data:', error);
      }
    }
  }, [evaluationId]);

  const contextValue: EnhancedEvaluationContextType = {
    // Current evaluation state
    evaluation,
    updateEvaluation,
    
    // Form state
    formData,
    updateFormField,
    clearFormData,
    
    // Template and cancer type
    selectedCancerType,
    setSelectedCancerType,
    currentTemplate,
    
    // Validation and submission
    validationErrors,
    isFormSubmitting,
    setIsFormSubmitting,
    
    // AI and clinical decision support
    aiRecommendations,
    redFlags,
    riskAssessment,
    
    // Progress and completion
    completionPercentage: evaluation.completionPercentage || 0,
    currentSection,
    setCurrentSection,
    
    // Actions
    saveEvaluation,
    submitForReview,
    calculateRisk,
    generateAIRecommendations: generateAIRecommendationsHandler,
    validateForm,
    
    // Status and messaging
    formError,
    setFormError,
    formSuccess,
    setFormSuccess
  };

  return (
    <EnhancedEvaluationContext.Provider value={contextValue}>
      {children}
    </EnhancedEvaluationContext.Provider>
  );
};
