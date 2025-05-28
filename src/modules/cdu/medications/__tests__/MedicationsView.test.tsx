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

    screen.debug(); // Debug after click

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText(mockMedications[0].classification)).toBeInTheDocument();
    }, { timeout: 20000 });
  });

  it('closes modal via close button', async () => {
    render(<MedicationsView initialData={mockMedications} />);
    
    // Open modal
    const firstMedCard = screen.getByRole('button', { name: new RegExp(mockMedications[0].name) });
    await userEvent.click(firstMedCard);
    
    // Close modal
    const closeButton = screen.getByRole('button', { name: /close medication details/i });
    await userEvent.click(closeButton);

    screen.debug(); // Debug after close

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    }, { timeout: 20000 });
  });  it('handles search functionality', async () => {
    render(<MedicationsView initialData={mockMedications} />);
    
    const searchInput = screen.getByPlaceholderText(/search medications/i);
    await userEvent.type(searchInput, mockMedications[0].name);

    // Wait for debounced search with increased timeout
    await waitFor(() => {
      expect(screen.getByText(mockMedications[0].name)).toBeInTheDocument();
      expect(screen.queryByText(mockMedications[1].name)).not.toBeInTheDocument();
    }, { timeout: 1000 }); // Increased timeout to account for debouncing
  });  it('handles classification filter', async () => {
    render(<MedicationsView initialData={mockMedications} />);
    
    const filterSelect = screen.getByRole('combobox', { name: /filter by classification/i });
    await userEvent.selectOptions(filterSelect, mockMedications[0].classification);

    await waitFor(() => {
      expect(screen.getByText(mockMedications[0].classification)).toBeInTheDocument();
    }, { timeout: 1000 }); // Reduced timeout since this doesn't involve debouncing
  });
  it('handles keyboard navigation', () => {
    render(<MedicationsView initialData={mockMedications} />);
    
    // Check that medication cards are focusable
    const firstMedCard = screen.getByRole('button', { name: new RegExp(mockMedications[0].name) });
    expect(firstMedCard).toBeInTheDocument();
    expect(firstMedCard).toHaveAttribute('tabIndex', '0');
  });  it('shows empty state when no medications match filters', async () => {
    render(<MedicationsView initialData={mockMedications} />);
    
    const searchInput = screen.getByPlaceholderText(/search medications/i);
    await userEvent.type(searchInput, 'NonexistentMedication');

    // Wait for debounced search and empty state
    await waitFor(() => {
      expect(screen.getByText(/no medications found/i)).toBeInTheDocument();
    }, { timeout: 1000 }); // Increased timeout for debouncing
  });
});
