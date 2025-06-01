import { useState, useCallback } from 'react';
import { validateProtocol, validateMedications, validateRescueAgents } from '@/schemas/protocol';
import type { Protocol } from '@/types/protocol';

interface ValidationResult {
  isValid: boolean;
  errors: {
    path: (string | number)[];
    message: string;
  }[];
}

export const useProtocolValidation = () => {
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: true,
    errors: []
  });

  const validateProtocolData = useCallback((data: unknown) => {
    const result = validateProtocol(data);
    
    if (!result.success) {
      setValidationResult({
        isValid: false,
        errors: result.error.errors
      });
      return false;
    }

    setValidationResult({
      isValid: true,
      errors: []
    });
    return true;
  }, []);

  const validatePreMedications = useCallback((data: Protocol['pre_medications']) => {
    if (!data) return true;
    const result = validateMedications(data);
    return result.success;
  }, []);

  const validatePostMedications = useCallback((data: Protocol['post_medications']) => {
    if (!data) return true;
    const result = validateMedications(data);
    return result.success;
  }, []);

  const validateProtocolRescueAgents = useCallback((data: Protocol['rescue_agents']) => {
    if (!data) return true;
    const result = validateRescueAgents(data);
    return result.success;
  }, []);

  return {
    validationResult,
    validateProtocolData,
    validatePreMedications,
    validatePostMedications,
    validateProtocolRescueAgents
  };
};
