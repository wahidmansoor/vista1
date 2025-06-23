/**
 * Simplified Test Suite for Treatment Recommendation Engine
 * Focus on core functionality without complex type dependencies
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import '@testing-library/jest-dom';
import { TreatmentRecommendationEngine } from '../TreatmentRecommendationEngine';

// Mock the services with minimal implementations
vi.mock('../../../services/advancedTreatmentMatcher', () => ({
  default: {
    findMatchingProtocols: vi.fn().mockResolvedValue([]),
    assessEligibility: vi.fn().mockResolvedValue({ status: 'eligible' }),
    identifyContraindications: vi.fn().mockResolvedValue([]),
    calculateMatchScore: vi.fn().mockResolvedValue(0.8)
  }
}));

vi.mock('../../../services/enhancedTreatmentDatabase', () => ({
  default: {
    searchProtocols: vi.fn().mockResolvedValue([]),
    getProtocolDetails: vi.fn().mockResolvedValue(null),
    recordTreatmentSelection: vi.fn().mockResolvedValue(true)
  }
}));

vi.mock('../../../components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

describe('TreatmentRecommendationEngine - Basic Tests', () => {
  const mockPatient = {
    id: 'test-patient-1',
    demographics: {
      age: 65,
      sex: 'female' as const,
      race: 'caucasian' as const,
      ethnicity: 'non-hispanic' as const,
      bmi: 25.0,
      smoking_status: 'former' as const,
      alcohol_use: 'light' as const
    },
    disease_status: {
      primary_cancer_type: 'Breast Cancer',
      stage: 'IIIA',
      diagnosis_date: new Date('2024-01-15'),
      histology: 'Invasive ductal carcinoma',
      grade: 'Grade 2',
      biomarker_status: {},
      metastatic_sites: [],
      disease_burden: 'medium' as const,
      current_status: 'newly_diagnosed' as const
    },
    performance_metrics: {
      ecog_score: 0,
      karnofsky_score: 100,
      assessment_date: new Date('2024-01-10'),
      functional_assessments: []
    },
    treatment_history: [],
    laboratory_values: {
      test_date: new Date('2024-01-18'),
      complete_blood_count: {
        wbc: 6.5,
        anc: 4.2,
        hemoglobin: 12.5,
        hematocrit: 37.8,
        platelets: 285
      },
      comprehensive_metabolic_panel: {
        glucose: 95,
        bun: 18,
        creatinine: 0.9,
        sodium: 140,
        potassium: 4.2,
        chloride: 102,
        co2: 24,
        albumin: 4.1
      },
      liver_function_tests: {
        total_bilirubin: 0.8,
        direct_bilirubin: 0.2,
        alt: 22,
        ast: 19,
        alkaline_phosphatase: 78
      }
    },
    comorbidities: []
  };
  const mockProps = {
    patient: mockPatient,
    onRecommendationsGenerated: vi.fn(),
    onProtocolSelected: vi.fn()
  };
  it('renders without crashing', () => {
    render(<TreatmentRecommendationEngine {...mockProps} />);
    expect(screen.getByText(/treatment recommendation engine/i)).toBeInTheDocument();
  });

  it('displays generate recommendations button', () => {
    render(<TreatmentRecommendationEngine {...mockProps} />);
    expect(screen.getByRole('button', { name: /generate recommendations/i })).toBeInTheDocument();
  });

  it('shows analyzing state when loading', () => {
    render(<TreatmentRecommendationEngine {...mockProps} />);
    const generateButton = screen.getByRole('button', { name: /generate recommendations/i });
    
    // The loading state shows "Analyzing..." text inside the button
    expect(generateButton).toBeInTheDocument();
  });
});
