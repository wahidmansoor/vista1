import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import MedicationsView from '../MedicationsView';
import { createMockMedications } from './MedicationTestDataFactory';

// Mock the audio feedback module
vi.mock('@/utils/audioFeedback', () => ({
  playSound: vi.fn(),
  isAudioSupported: () => true
}));

describe('MedicationsView', () => {
  const mockMedications = createMockMedications(3);
  
  beforeEach(() => {
    // Clear mocks before each test
    vi.clearAllMocks();
  });

  it('renders medication cards from initial data', () => {
    render(<MedicationsView initialData={mockMedications} />);
    
    mockMedications.forEach(med => {
      expect(screen.getByText(med.name)).toBeInTheDocument();
      expect(screen.getByText(med.brand_names[0])).toBeInTheDocument();
    });
  });

  it('opens detail modal when clicking a medication card', async () => {
    render(<MedicationsView initialData={mockMedications} />);
    
    const firstMedCard = screen.getByRole('button', { name: new RegExp(mockMedications[0].name) });
    await userEvent.click(firstMedCard);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText(mockMedications[0].classification)).toBeInTheDocument();
    });
  });

  it('closes modal via close button', async () => {
    render(<MedicationsView initialData={mockMedications} />);
    
    // Open modal
    const firstMedCard = screen.getByRole('button', { name: new RegExp(mockMedications[0].name) });
    await userEvent.click(firstMedCard);
    
    // Close modal
    const closeButton = screen.getByRole('button', { name: /close medication details/i });
    await userEvent.click(closeButton);
    
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('filters medications by search', async () => {
    render(<MedicationsView initialData={mockMedications} />);
    
    const searchInput = screen.getByPlaceholderText(/search medications/i);
    await userEvent.type(searchInput, mockMedications[0].name);

    await waitFor(() => {
      expect(screen.getByText(mockMedications[0].name)).toBeInTheDocument();
      expect(screen.queryByText(mockMedications[1].name)).not.toBeInTheDocument();
    });
  });

  it('handles classification filter', async () => {
    // Update mock data to use a classification that exists in the dropdown
    const testMedications = mockMedications.map(med => ({
      ...med,
      classification: 'CDK4/6 Inhibitor'
    }));
    
    render(<MedicationsView initialData={testMedications} />);
    
    const filterSelect = screen.getByRole('combobox', { name: /filter by classification/i });
    await userEvent.selectOptions(filterSelect, 'CDK4/6 Inhibitor');

    await waitFor(() => {
      expect(screen.getByText('CDK4/6 Inhibitor')).toBeInTheDocument();
    });
  });
  
  it('handles keyboard navigation', () => {
    render(<MedicationsView initialData={mockMedications} />);
    
    // Check that medication cards are focusable
    const firstMedCard = screen.getByRole('button', { name: new RegExp(mockMedications[0].name) });
    expect(firstMedCard).toBeInTheDocument();
    expect(firstMedCard).toHaveAttribute('tabIndex', '0');
  });
  
  it('shows empty state when no medications match filters', async () => {
    render(<MedicationsView initialData={mockMedications} />);
    
    const searchInput = screen.getByPlaceholderText(/search medications/i);
    await userEvent.type(searchInput, 'NonexistentMedication');

    await waitFor(() => {
      expect(screen.getByText(/no medications found/i)).toBeInTheDocument();
    });
  });
});
