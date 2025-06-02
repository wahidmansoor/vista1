import { renderHook, act, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { useHandbookData } from '../useHandbookData';
import { HANDBOOK_BASE_DIR } from '@/utils/pathUtils';
import { ToastProvider } from '@/components/ui/toast';
import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';

// Types for the TOC data
interface TocItem {
  title: string;
  path: string;
  items?: TocItem[];
}

// Mock TOC data
const mockTocData: TocItem[] = [
  {
    title: "Introduction",
    path: "introduction",
  },
  {
    title: "Diagnosis",
    path: "diagnosis",
    items: [
      {
        title: "Overview",
        path: "diagnosis/overview"
      }
    ]
  }
];

// Set up MSW server
const server = setupServer(
  // Mock TOC endpoint
  http.get('**/medical_oncology_handbook/toc.json', () => {
    return HttpResponse.json(mockTocData);
  }),

  // Mock content endpoint
  http.get('**/medical_oncology_handbook/diagnosis/overview.json', () => {
    return HttpResponse.json({ content: "Test content" });
  })
);

// Wrap component to provide necessary context
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ToastProvider>{children}</ToastProvider>
);

describe('useHandbookData', () => {
  // Start MSW server before tests
  beforeAll(() => server.listen());
  // Reset handlers after each test
  afterEach(() => server.resetHandlers());
  // Clean up after all tests
  afterAll(() => server.close());

  it('should handle initial load with no section', async () => {
    const { result } = renderHook(() => useHandbookData(undefined, null), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.tocData).toBeNull();
    expect(result.current.activeFile).toBeNull();
    expect(result.current.isValidSection).toBe(false);
  });

  it('should load TOC data for valid section', async () => {
    const { result } = renderHook(() => useHandbookData('medical-oncology', null), { wrapper });

    // Should start loading
    expect(result.current.isLoading).toBe(true);

    // Wait for data to load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.tocData).toEqual(mockTocData);
    expect(result.current.activeFile).toBe(`${HANDBOOK_BASE_DIR}/medical_oncology_handbook/overview.json`);
    expect(result.current.error).toBeNull();
    expect(result.current.isValidSection).toBe(true);
  });

  it('should handle invalid section', async () => {
    const { result } = renderHook(() => useHandbookData('invalid-section', null), { wrapper });

    expect(result.current.isValidSection).toBe(false);
    expect(result.current.tocData).toBeNull();
    expect(result.current.activeFile).toBeNull();
  });

  it('should handle network error', async () => {
    // Mock server error for this test
    server.use(
      http.get('**/medical_oncology_handbook/toc.json', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    const { result } = renderHook(() => useHandbookData('medical-oncology', null), { wrapper });

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.tocData).toBeNull();
  });

  it('should use cached data on subsequent loads', async () => {
    const { result, rerender } = renderHook(
      ({ section }: { section: string | undefined }) => useHandbookData(section, null),
      {
        wrapper,
        initialProps: { section: 'medical-oncology' }
      }
    );

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.tocData).toEqual(mockTocData);
    });

    // Mock server to verify cache is used
    let serverCalled = false;
    server.use(
      http.get('**/medical_oncology_handbook/toc.json', () => {
        serverCalled = true;
        return HttpResponse.json(mockTocData);
      })
    );

    // Trigger rerender with same section
    rerender({ section: 'medical-oncology' });

    // Data should be immediately available from cache
    expect(result.current.tocData).toEqual(mockTocData);
    expect(serverCalled).toBe(false);
  });

  it('should handle topic changes', async () => {
    type Props = { section: string; topic: null };  // Match the inferred types
    
    const { result, rerender } = renderHook(
      ({ section, topic }: Props) => useHandbookData(section, topic),
      {
        wrapper,
        initialProps: { section: 'medical-oncology', topic: null }
      }
    );

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.tocData).toEqual(mockTocData);
    });

    // Change topic with the same prop types
    act(() => {
      rerender({ section: 'medical-oncology', topic: null });
    });

    expect(result.current.activeFile).toBe(
      `${HANDBOOK_BASE_DIR}/medical_oncology_handbook/diagnosis/overview.json`
    );
  });
});