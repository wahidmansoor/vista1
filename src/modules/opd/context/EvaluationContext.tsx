import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { CancerType } from '../types/evaluation';

interface EvaluationContextType {
  formData: Record<string, string>;
  updateFormField: (id: string, value: string) => void;
  clearFormData: () => void;
  selectedCancerType: CancerType | '';
  setSelectedCancerType: (type: CancerType | '') => void;
  isFormSubmitting: boolean;
  setIsFormSubmitting: (value: boolean) => void;
  formError: string | null;
  setFormError: (error: string | null) => void;
  formSuccess: boolean;
  setFormSuccess: (success: boolean) => void;
}

const EvaluationContext = createContext<EvaluationContextType | undefined>(undefined);

export const useEvaluation = (): EvaluationContextType => {
  const context = useContext(EvaluationContext);
  if (!context) {
    throw new Error('useEvaluation must be used within an EvaluationProvider');
  }
  return context;
};

interface EvaluationProviderProps {
  children: ReactNode;
}

export const EvaluationProvider: React.FC<EvaluationProviderProps> = ({ children }) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [selectedCancerType, setSelectedCancerType] = useState<CancerType | ''>('');
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);

  const updateFormField = useCallback((id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
    
    // Reset submission states when form is edited
    if (formSuccess) setFormSuccess(false);
    if (formError) setFormError(null);
  }, [formSuccess, formError]);

  const clearFormData = useCallback(() => {
    if (window.confirm('Are you sure you want to clear all form data?')) {
      setFormData({});
      setFormError(null);
      setFormSuccess(false);
    }
  }, []);

  const value = {
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
    setFormSuccess,
  };

  return (
    <EvaluationContext.Provider value={value}>
      {children}
    </EvaluationContext.Provider>
  );
};

export default EvaluationContext; 