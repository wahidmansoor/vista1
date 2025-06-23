import { useState, useEffect } from 'react';
import { generateId } from '../../../utils/palliativeUtils';

export type AssessmentType = 'distress' | 'anxiety' | 'depression' | 'social';

export interface Assessment {
  id: string;
  type: AssessmentType;
  score: number;
  notes: string;
  date: string;
}

const STORAGE_KEY = 'palliative-psychosocial-assessments';

export const usePsychosocialData = () => {
  const [assessments, setAssessments] = useState<Assessment[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assessments));
  }, [assessments]);

  const addAssessment = (type: AssessmentType, score: number, notes: string) => {
    const newAssessment: Assessment = {
      id: generateId(),
      type,
      score,
      notes,
      date: new Date().toISOString(),
    };
    setAssessments(prev => [...prev, newAssessment]);
  };

  const deleteAssessment = (id: string) => {
    setAssessments(prev => prev.filter(assessment => assessment.id !== id));
  };

  const updateAssessment = (id: string, updates: Partial<Assessment>) => {
    setAssessments(prev => prev.map(assessment => 
      assessment.id === id ? { ...assessment, ...updates } : assessment
    ));
  };

  const getAssessmentsByType = (type: AssessmentType) => {
    return assessments.filter(assessment => assessment.type === type);
  };

  return {
    assessments,
    addAssessment,
    deleteAssessment,
    updateAssessment,
    getAssessmentsByType,
  };
};