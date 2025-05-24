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
    // Clear mocks and timers before each test
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
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
  });

  it('handles search functionality', async () => {
    render(<MedicationsView initialData={mockMedications} />);
    
    const searchInput = screen.getByPlaceholderText(/search medications/i);
    userEvent.type(searchInput, mockMedications[0].name);

    await waitFor(() => {
      expect(screen.getByText(mockMedications[0].name)).toBeInTheDocument();
      expect(screen.queryByText(mockMedications[1].name)).not.toBeInTheDocument();
    });
  });

  it('handles classification filter', async () => {
    render(<MedicationsView initialData={mockMedications} />);
    
    const filterSelect = screen.getByRole('combobox', { name: /filter by classification/i });
    userEvent.selectOptions(filterSelect, mockMedications[0].classification);

    await waitFor(() => {
      expect(screen.getByText(mockMedications[0].classification)).toBeInTheDocument();
    });
  });

  it('handles keyboard navigation', () => {
    render(<MedicationsView initialData={mockMedications} />);
    
    // Press 'j' to move focus down
    userEvent.keyboard('{ArrowDown}');
    expect(screen.getByText(mockMedications[0].name).closest('[aria-selected="true"]')).toBeInTheDocument();

    // Press 'k' to move focus up
    userEvent.keyboard('{ArrowUp}');
    expect(screen.getByText(mockMedications[0].name).closest('[aria-selected="false"]')).toBeInTheDocument();
  });

  it('shows empty state when no medications match filters', async () => {
    render(<MedicationsView initialData={mockMedications} />);
    
    const searchInput = screen.getByPlaceholderText(/search medications/i);
    userEvent.type(searchInput, 'NonexistentMedication');

    await waitFor(() => {
      expect(screen.getByText(/no medications found/i)).toBeInTheDocument();
    });
  });
});
