import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Types
export interface Symptom {
  id: string;
  name: string;
  onset: string;
  severity: 'mild' | 'moderate' | 'severe';
  description: string;
  interventions: string[];
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  isMainCaregiver: boolean;
  contactInfo: string;
  needsSupport: boolean[];
}

export interface AdvanceDirective {
  id: string;
  type: 'DNR' | 'LivingWill' | 'PowerOfAttorney' | 'Other';
  status: 'completed' | 'pending' | 'notStarted';
  details: string;
  documents: string[];
  dateCompleted?: string;
}

interface PalliativeState {
  currentSymptoms: Symptom[];
  painScore: number;
  familyMembers: FamilyMember[];
  advanceDirectives: AdvanceDirective[];
  lastUpdated: string;
}

// Actions
type PalliativeAction =
  | { type: 'ADD_SYMPTOM'; payload: Symptom }
  | { type: 'UPDATE_SYMPTOM'; payload: Symptom }
  | { type: 'REMOVE_SYMPTOM'; payload: string }
  | { type: 'SET_PAIN_SCORE'; payload: number }
  | { type: 'ADD_FAMILY_MEMBER'; payload: FamilyMember }
  | { type: 'UPDATE_FAMILY_MEMBER'; payload: { id: string; updates: Partial<FamilyMember> } }
  | { type: 'REMOVE_FAMILY_MEMBER'; payload: string }
  | { type: 'UPDATE_ADVANCE_DIRECTIVE'; payload: AdvanceDirective }
  | { type: 'REMOVE_ADVANCE_DIRECTIVE'; payload: string }
  | { type: 'LOAD_STATE'; payload: PalliativeState };

const initialState: PalliativeState = {
  currentSymptoms: [],
  painScore: 0,
  familyMembers: [],
  advanceDirectives: [],
  lastUpdated: new Date().toISOString()
};

// Context
const PalliativeContext = createContext<{
  state: PalliativeState;
  addSymptom: (symptom: Symptom) => void;
  updateSymptom: (symptom: Symptom) => void;
  removeSymptom: (id: string) => void;
  setPainScore: (score: number) => void;
  addFamilyMember: (member: FamilyMember) => void;
  updateFamilyMember: (id: string, updates: Partial<FamilyMember>) => void;
  removeFamilyMember: (id: string) => void;
  updateAdvanceDirective: (directive: AdvanceDirective) => void;
  removeAdvanceDirective: (id: string) => void;
} | undefined>(undefined);

// Reducer
function palliativeReducer(state: PalliativeState, action: PalliativeAction): PalliativeState {
  switch (action.type) {
    case 'ADD_SYMPTOM':
      return {
        ...state,
        currentSymptoms: [...state.currentSymptoms, action.payload],
        lastUpdated: new Date().toISOString()
      };

    case 'UPDATE_SYMPTOM':
      return {
        ...state,
        currentSymptoms: state.currentSymptoms.map(s => 
          s.id === action.payload.id ? action.payload : s
        ),
        lastUpdated: new Date().toISOString()
      };

    case 'REMOVE_SYMPTOM':
      return {
        ...state,
        currentSymptoms: state.currentSymptoms.filter(s => s.id !== action.payload),
        lastUpdated: new Date().toISOString()
      };

    case 'SET_PAIN_SCORE':
      return {
        ...state,
        painScore: action.payload,
        lastUpdated: new Date().toISOString()
      };

    case 'ADD_FAMILY_MEMBER':
      return {
        ...state,
        familyMembers: [...state.familyMembers, action.payload],
        lastUpdated: new Date().toISOString()
      };

    case 'UPDATE_FAMILY_MEMBER':
      return {
        ...state,
        familyMembers: state.familyMembers.map(m =>
          m.id === action.payload.id ? { ...m, ...action.payload.updates } : m
        ),
        lastUpdated: new Date().toISOString()
      };

    case 'REMOVE_FAMILY_MEMBER':
      return {
        ...state,
        familyMembers: state.familyMembers.filter(m => m.id !== action.payload),
        lastUpdated: new Date().toISOString()
      };

    case 'UPDATE_ADVANCE_DIRECTIVE':
      const existingIndex = state.advanceDirectives.findIndex(d => d.id === action.payload.id);
      const updatedDirectives = existingIndex >= 0
        ? state.advanceDirectives.map(d => d.id === action.payload.id ? action.payload : d)
        : [...state.advanceDirectives, action.payload];

      return {
        ...state,
        advanceDirectives: updatedDirectives,
        lastUpdated: new Date().toISOString()
      };

    case 'REMOVE_ADVANCE_DIRECTIVE':
      return {
        ...state,
        advanceDirectives: state.advanceDirectives.filter(d => d.id !== action.payload),
        lastUpdated: new Date().toISOString()
      };

    case 'LOAD_STATE':
      return action.payload;

    default:
      return state;
  }
}

// Provider Component
export function PalliativeCareProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(palliativeReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('palliativeCareState');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        dispatch({ type: 'LOAD_STATE', payload: parsed });
      } catch (error) {
        console.error('Error loading palliative care state:', error);
      }
    }
  }, []);

  // Save state to localStorage on updates
  useEffect(() => {
    localStorage.setItem('palliativeCareState', JSON.stringify(state));
  }, [state]);

  const addSymptom = (symptom: Symptom) => {
    dispatch({ type: 'ADD_SYMPTOM', payload: symptom });
  };

  const updateSymptom = (symptom: Symptom) => {
    dispatch({ type: 'UPDATE_SYMPTOM', payload: symptom });
  };

  const removeSymptom = (id: string) => {
    dispatch({ type: 'REMOVE_SYMPTOM', payload: id });
  };

  const setPainScore = (score: number) => {
    dispatch({ type: 'SET_PAIN_SCORE', payload: score });
  };

  const addFamilyMember = (member: FamilyMember) => {
    dispatch({ type: 'ADD_FAMILY_MEMBER', payload: member });
  };

  const updateFamilyMember = (id: string, updates: Partial<FamilyMember>) => {
    dispatch({ type: 'UPDATE_FAMILY_MEMBER', payload: { id, updates } });
  };

  const removeFamilyMember = (id: string) => {
    dispatch({ type: 'REMOVE_FAMILY_MEMBER', payload: id });
  };

  const updateAdvanceDirective = (directive: AdvanceDirective) => {
    dispatch({ type: 'UPDATE_ADVANCE_DIRECTIVE', payload: directive });
  };

  const removeAdvanceDirective = (id: string) => {
    dispatch({ type: 'REMOVE_ADVANCE_DIRECTIVE', payload: id });
  };

  return (
    <PalliativeContext.Provider value={{
      state,
      addSymptom,
      updateSymptom,
      removeSymptom,
      setPainScore,
      addFamilyMember,
      updateFamilyMember,
      removeFamilyMember,
      updateAdvanceDirective,
      removeAdvanceDirective
    }}>
      {children}
    </PalliativeContext.Provider>
  );
}

// Custom hook for using the context
export function usePalliativeCare() {
  const context = useContext(PalliativeContext);
  if (context === undefined) {
    throw new Error('usePalliativeCare must be used within a PalliativeCareProvider');
  }
  return context;
}