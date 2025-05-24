import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MedicationDetailModal from '../MedicationDetailModal';
import { createMockMedication } from './MedicationTestDataFactory';

describe('MedicationDetailModal', () => {
  const mockMedication = createMockMedication();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders medication details correctly', () => {
    render(
      <MedicationDetailModal
        medication={mockMedication}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    // Check basic medication information
    expect(screen.getByText(mockMedication.name)).toBeInTheDocument();
    expect(screen.getByText(mockMedication.brand_names.join(', '))).toBeInTheDocument();
    expect(screen.getByText(mockMedication.classification)).toBeInTheDocument();

    // Check sections
    expect(screen.getByText(/dosing & administration/i)).toBeInTheDocument();
    expect(screen.getByText(/side effects/i)).toBeInTheDocument();
    expect(screen.getByText(/monitoring/i)).toBeInTheDocument();
  });

  it('renders nothing when medication is null', () => {
    const { container } = render(
      <MedicationDetailModal
        medication={null}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <MedicationDetailModal
        medication={mockMedication}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    const closeButton = screen.getByRole('button', { name: /close medication details/i });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('displays monitoring information correctly', () => {
    render(
      <MedicationDetailModal
        medication={mockMedication}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    mockMedication.monitoring.baseline.forEach(test => {
      expect(screen.getByText(test)).toBeInTheDocument();
    });
    
    mockMedication.monitoring.ongoing.forEach(test => {
      expect(screen.getByText(test)).toBeInTheDocument();
    });
  });

  it('displays side effects with proper categorization', () => {
    render(
      <MedicationDetailModal
        medication={mockMedication}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    mockMedication.side_effects.common.forEach(effect => {
      expect(screen.getByText(effect)).toBeInTheDocument();
    });

    mockMedication.side_effects.severe.forEach(effect => {
      const element = screen.getByText(effect);
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('text-red-600');
    });
  });

  it('displays drug interactions', () => {
    render(
      <MedicationDetailModal
        medication={mockMedication}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    mockMedication.interactions.drugs.forEach(drug => {
      expect(screen.getByText(drug)).toBeInTheDocument();
    });

    mockMedication.interactions.contraindications.forEach(contra => {
      expect(screen.getByText(contra)).toBeInTheDocument();
    });
  });
});
