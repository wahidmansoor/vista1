import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, X, Pill, Link } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import MedicationDetailModal from './MedicationDetailModal';
import type { Medication, SortConfig, SortField } from './../types';
import { playSound, isAudioSupported } from '@/utils/audioFeedback';

interface MedicationsViewProps {
  initialData?: Medication[];
}

const getClassificationStyle = (classification: string): string => {
  // Add pre-medication styles
  if (classification.includes('Antiemetic')) {
    return 'bg-teal-100 text-teal-800 border border-teal-200';
  }
  if (classification.includes('Antihistamine')) {
    return 'bg-cyan-100 text-cyan-800 border border-cyan-200';
  }
  if (classification.includes('Corticosteroid')) {
    return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
  }
  if (classification.includes('Anxiolytic')) {
    return 'bg-indigo-100 text-indigo-800 border border-indigo-200';
  }
  // Existing medication styles
  if (classification.includes('Chemotherapy')) {
    return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
  }
  if (classification.includes('Checkpoint Inhibitor')) {
    return 'bg-green-100 text-green-800 border border-green-200';
  }
  if (classification.includes('Monoclonal Antibody')) {
    return 'bg-purple-100 text-purple-800 border border-purple-200';
  }
  if (classification.includes('Conjugate')) {
    return 'bg-pink-100 text-pink-800 border border-pink-200';
  }
  if (classification.includes('Inhibitor')) {
    return 'bg-blue-100 text-blue-800 border border-blue-200';
  }
  if (classification.includes('SERM')) {
    return 'bg-orange-100 text-orange-800 border border-orange-200';
  }
  return 'bg-gray-100 text-gray-800 border border-gray-200';
};

const getShortClassification = (classification: string): string => {
  // Add pre-medication abbreviations
  if (classification.includes('5-HT3 Receptor Antagonist')) {
    return '5-HT3 RA';
  }
  if (classification.includes('NK1 Receptor Antagonist')) {
    return 'NK1 RA';
  }
  // Existing abbreviations
  if (classification.includes('Checkpoint Inhibitor')) {
    return classification.replace('Checkpoint Inhibitor', 'Inhibitor');
  }
  if (classification.includes('Monoclonal Antibody')) {
    return classification.replace('Monoclonal Antibody', 'mAb');
  }
  if (classification.includes('Tyrosine Kinase Inhibitor')) {
    return classification.replace('Tyrosine Kinase Inhibitor', 'TKI');
  }
  if (classification.includes('Antibody-Drug Conjugate')) {
    return classification.replace('Targeted Antibody-Drug Conjugate', 'ADC');
  }
  if (classification === 'Selective Estrogen Receptor Modulator (SERM)') {
    return 'SERM';
  }
  return classification;
};

const STORAGE_KEY = 'medications-sort-preference';

const getSavedSort = (): SortConfig => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as SortConfig;
      if (
        parsed.field &&
        ['name', 'classification', 'updated_at'].includes(parsed.field) &&
        parsed.order &&
        ['asc', 'desc'].includes(parsed.order)
      ) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse saved sort preference');
  }
  return { field: 'name', order: 'asc' };
};

export default function MedicationsView({ initialData }: MedicationsViewProps) {
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const [medications, setMedications] = useState<Medication[]>(initialData || []);
  const [loading, setLoading] = useState(!initialData);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [showPremedsOnly, setShowPremedsOnly] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [sort, setSort] = useState<SortConfig>(getSavedSort());
  const [sortFeedback, setSortFeedback] = useState<string>('');

  // Handle index changes with URL updates
  const handleIndexChange = (newIndex: number) => {
    if (newIndex !== focusedIndex) {
      setFocusedIndex(newIndex);
      playSound('select');
      if (medications[newIndex]) {
        const url = new URL(window.location.href);
        url.searchParams.set('med', medications[newIndex].id);
        window.history.replaceState({}, '', url);
      }
    }
  };

  // Show temporary feedback when using keyboard shortcuts
  const showSortFeedback = (message: string) => {
    setSortFeedback(message);
    setTimeout(() => setSortFeedback(''), 1000);
  };

  // Update URL parameters when state changes
  const updateUrlParams = (params: {
    search?: string;
    class?: string;
    sort?: string;
    order?: string;
    med?: string;
  }) => {
    if (typeof window === 'undefined') return;
    
    const url = new URL(window.location.href);
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key === 'search' ? 'q' : key, value);
      } else {
        url.searchParams.delete(key === 'search' ? 'q' : key);
      }
    });
    window.history.replaceState({}, '', url);
  };

  // Update sort and show feedback
  const updateSort = (newSort: SortConfig, feedback: string) => {
    setSort(newSort);
    showSortFeedback(feedback);
    updateUrlParams({
      sort: newSort.field,
      order: newSort.order
    });
  };

  // Persist sort preferences
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sort));
    } catch (e) {
      console.warn('Failed to save sort preference');
    }
  }, [sort]);

  const handleKeyNavigation = (e: KeyboardEvent) => {
    if (document.activeElement?.tagName === 'INPUT') return;
    
    switch (e.key) {
      case 'ArrowDown':
      case 'j': {
        e.preventDefault();
        const nextIndex = focusedIndex < medications.length - 1 ? focusedIndex + 1 : focusedIndex;
        handleIndexChange(nextIndex);
        break;
      }
      case 'ArrowUp':
      case 'k': {
        e.preventDefault();
        const nextIndex = focusedIndex > 0 ? focusedIndex - 1 : focusedIndex;
        handleIndexChange(nextIndex);
        break;
      }
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < medications.length) {
          setSelectedMedication(medications[focusedIndex]);
          playSound('select');
        }
        break;
      case 'Home':
        e.preventDefault();
        setFocusedIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setFocusedIndex(medications.length - 1);
        break;
      // Sort shortcuts
      case 'n':
      case 'c':
      case 'u':
      case 's':
      case 'l':
        if (e.altKey) {
          e.preventDefault();
          
          // Copy URL (Alt + L)
          if (e.key === 'l') {
            const url = new URL(window.location.href);
            navigator.clipboard.writeText(url.toString());
            showSortFeedback('URL copied to clipboard! ✓');
            playSound('select');
            return;
          }

          // Handle field changes and toggle sort order
          if (e.key === 'n') {
            const newSort = {
              field: 'name' as const,
              order: sort.field === 'name' 
                ? (sort.order === 'asc' ? 'desc' as const : 'asc' as const)
                : 'asc' as const
            };
            updateSort(newSort, `Sorted by name ${newSort.order === 'asc' ? '↑' : '↓'}`);
          } else if (e.key === 'c') {
            const newSort = {
              field: 'classification' as const,
              order: sort.field === 'classification'
                ? (sort.order === 'asc' ? 'desc' as const : 'asc' as const)
                : 'asc' as const
            };
            updateSort(newSort, `Sorted by classification ${newSort.order === 'asc' ? '↑' : '↓'}`);
          } else if (e.key === 'u') {
            const newSort = {
              field: 'updated_at' as const,
              order: sort.field === 'updated_at'
                ? (sort.order === 'asc' ? 'desc' as const : 'asc' as const)
                : 'asc' as const
            };
            updateSort(newSort, `Sorted by date ${newSort.order === 'asc' ? '↑' : '↓'}`);
          }
          
          // Toggle sort order (Alt + S)
          if (e.key === 's') {
            const newSort = {
              ...sort,
              order: sort.order === 'asc' ? 'desc' as const : 'asc' as const
            };
            updateSort(newSort, `Sort order: ${newSort.order === 'asc' ? 'ascending ↑' : 'descending ↓'}`);
          }
        }
        break;
    }
  };

  const fetchMedications = async () => {
    try {
      setLoading(true);
      setError(null);

      // Support for searching across name, classification and JSONB indications
      const searchFilter = searchQuery ? encodeURIComponent(`
        or=(
          name.ilike."%${searchQuery}%",
          classification.ilike."%${searchQuery}%",
          indications->>cancer_types.ilike."%${searchQuery}%"
        )
      `.trim()) : '';

      const classFilter = selectedClass ? 
        `&classification=eq.${encodeURIComponent(selectedClass)}` : '';

      const baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/oncology_medications`;
      const url = `${baseUrl}?select=*${searchFilter ? `&${searchFilter}` : ''}${classFilter}&order=name.asc.nullslast`;

      const response = await fetch(url, {
        headers: {
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Supabase fetch failed: ${response.statusText} (status: ${response.status})`);
      }

      const data = await response.json();
      console.log("✅ Medications fetched:", data);
      setMedications(data);

    } catch (error) {
      const typedError = error as Error;
      console.error("❌ Error fetching medications:", typedError); 
      const errorMsg = typedError.message || 'Failed to fetch medications. Please try again.';
      setError(errorMsg);
      if (isAudioSupported()) playSound('error');
      showSortFeedback(`Error: ${errorMsg}`);
      setMedications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialData) {
      fetchMedications();
    }
  }, [initialData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery || selectedClass) {
        fetchMedications();
      } else if (!initialData) {
        fetchMedications();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedClass, initialData]);

  // Reset focus when results change
  useEffect(() => {
    setFocusedIndex(-1);
  }, [medications]);

  // Handle initial URL parameters
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      
      // Restore search query
      const search = url.searchParams.get('q');
      if (search) setSearchQuery(search);

      // Restore classification filter
      const classification = url.searchParams.get('class');
      if (classification) setSelectedClass(classification);

      // Restore sort preferences
      const sortField = url.searchParams.get('sort') as SortField;
      const sortOrder = url.searchParams.get('order') as 'asc' | 'desc';
      if (sortField && sortOrder) {
        setSort({ field: sortField, order: sortOrder });
      }

      // Restore focused medication
      const medId = url.searchParams.get('med');
      if (medId && medications.length > 0) {
        const index = medications.findIndex(med => med.id === medId);
        if (index !== -1) {
          setFocusedIndex(index);
          setTimeout(() => {
            const element = document.getElementById(`medication-${index}`);
            element?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 100);
        }
      }
    }
  }, [medications]);

  // Keyboard shortcuts and navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // '/' key focuses search input
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }

      // 'Escape' clears filters or focused item
      if (e.key === 'Escape') {
        if (searchQuery || selectedClass) {
          setSearchQuery('');
          setSelectedClass('');
        } else {
          setFocusedIndex(-1);
        }
      }

      // Handle navigation keys
      handleKeyNavigation(e);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchQuery, selectedClass, medications.length]);

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIndex >= 0) {
      const element = document.getElementById(`medication-${focusedIndex}`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [focusedIndex]);

  const MedicationSkeleton = () => (
    <div className="bg-white/30 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-6 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="space-y-3">
          <div className="h-6 w-48 bg-gray-200 rounded-md"></div>
          <div className="h-4 w-32 bg-gray-200 rounded-md"></div>
        </div>
        <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
      </div>
      <div className="mt-4 flex gap-2">
        <div className="h-5 w-20 bg-gray-200 rounded-md"></div>
        <div className="h-5 w-24 bg-gray-200 rounded-md"></div>
        <div className="h-5 w-16 bg-gray-200 rounded-md"></div>
      </div>
    </div>
  );

  const filteredMedications = useMemo(() => {
    return medications.filter(med => {
      // Check search query
      if (searchQuery && !med.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !med.brand_names.some(name => name.toLowerCase().includes(searchQuery.toLowerCase())) &&
          !med.classification.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Check classification filter
      if (selectedClass && !med.classification.includes(selectedClass)) {
        return false;
      }
      
      // Check for premeds only filter
      if (showPremedsOnly) {
        const premedClasses = ['Antiemetic', 'Anxiolytic', 'Antihistamine', 'Corticosteroid'];
        return premedClasses.some(cls => med.classification.includes(cls));
      }
      
      return true;
    });
  }, [medications, searchQuery, selectedClass, showPremedsOnly]);

  if (loading) {
    return (
      <div className="space-y-4">
        <MedicationSkeleton />
        <MedicationSkeleton />
        <MedicationSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Sort Feedback Overlay */}
      {sortFeedback && (
        <div
          className={`
            fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
            bg-gray-900/90 text-white px-4 py-2 rounded-lg shadow-xl 
            backdrop-blur-sm z-50
            animate-in fade-in-0 zoom-in-95 duration-200
            data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95
            flex items-center gap-2 font-medium
          `}
          role="status"
          aria-live="polite"
        >
          {sortFeedback}
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg shadow-lg">
            <Pill className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Oncology Medications
          </h2>
        </div>
        <button
          onClick={() => {
            const url = new URL(window.location.href);
            navigator.clipboard.writeText(url.toString());
            showSortFeedback('URL copied to clipboard! ✓');
            playSound('select');
          }}
          className="px-3 py-2 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 bg-white/30 backdrop-blur-md border border-white/20 rounded-lg shadow-lg hover:shadow-xl opacity-80 hover:opacity-100 transition-all duration-300"
          title="Copy link to clipboard (Alt+L)"
        >
          <Link className="h-4 w-4" />
          Share View
        </button>
      </div>

      {/* Add Premedications Filter Toggle */}
      <div className="flex gap-4 items-center">
        <button
          onClick={() => {
            setShowPremedsOnly(!showPremedsOnly);
            setSelectedClass('');
          }}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium 
            transition-all duration-300
            ${showPremedsOnly 
              ? 'bg-indigo-600 text-white shadow-lg' 
              : 'bg-white/30 text-gray-600 hover:bg-indigo-50'
            }
          `}
        >
          {showPremedsOnly ? '✓ Pre-Medications Only' : 'Show Pre-Medications'}
        </button>
        
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search medications, classifications, or cancer types... (Press '/' to focus)"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              updateUrlParams({
                search: e.target.value || undefined
              });
            }}
            className="pl-10 pr-4 py-2 w-full bg-white/30 backdrop-blur-md border border-white/20 rounded-lg shadow-lg hover:shadow-xl opacity-80 hover:opacity-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
          />
        </div>

        {/* Only show classification filter when not in premedications mode */}
        {!showPremedsOnly && (
          <div className="relative">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="pl-4 pr-10 py-2 bg-white/30 backdrop-blur-md border border-white/20 rounded-lg shadow-lg hover:shadow-xl opacity-80 hover:opacity-100 appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              aria-label="Filter by classification"
            >
              <option value="">All Classifications</option>
              <optgroup label="Pre-Medications">
                <option value="5-HT3 Receptor Antagonist Antiemetic">5-HT3 RA Antiemetic</option>
                <option value="NK1 Receptor Antagonist Antiemetic">NK1 RA Antiemetic</option>
                <option value="D2 Receptor Antagonist Antiemetic">D2 RA Antiemetic</option>
                <option value="H1 Antihistamine">H1 Antihistamine</option>
                <option value="H2 Antihistamine">H2 Antihistamine</option>
                <option value="Corticosteroid">Corticosteroid</option>
                <option value="Benzodiazepine Anxiolytic">Benzodiazepine Anxiolytic</option>
              </optgroup>
              <optgroup label="Traditional Chemotherapy">
                <option value="Platinum Chemotherapy">Platinum Chemotherapy</option>
                <option value="Anthracycline Chemotherapy">Anthracycline Chemotherapy</option>
                <option value="Taxane Chemotherapy">Taxane Chemotherapy</option>
              </optgroup>
              <optgroup label="Immunotherapy">
                <option value="PD-1 Checkpoint Inhibitor">PD-1 Inhibitor</option>
                <option value="PD-L1 Checkpoint Inhibitor">PD-L1 Inhibitor</option>
              </optgroup>
              <optgroup label="Antibody-Drug Conjugates">
                <option value="HER2-Targeted Antibody-Drug Conjugate">HER2 ADC</option>
                <option value="Trop-2-Targeted Antibody-Drug Conjugate">Trop-2 ADC</option>
                <option value="CD79b-Targeted Antibody-Drug Conjugate">CD79b ADC</option>
              </optgroup>
              <optgroup label="Monoclonal Antibodies">
                <option value="HER2 Monoclonal Antibody">HER2 mAb</option>
              </optgroup>
              <optgroup label="Targeted Therapies">
                <option value="EGFR Tyrosine Kinase Inhibitor">EGFR TKI</option>
                <option value="ALK Tyrosine Kinase Inhibitor">ALK TKI</option>
                <option value="ALK/ROS1 Tyrosine Kinase Inhibitor">ALK/ROS1 TKI</option>
                <option value="KRAS Inhibitor">KRAS Inhibitor</option>
                <option value="PI3K Inhibitor">PI3K Inhibitor</option>
                <option value="CDK4/6 Inhibitor">CDK4/6 Inhibitor</option>
                <option value="BTK Inhibitor">BTK Inhibitor</option>
              </optgroup>
              <optgroup label="Hormone Therapy">
                <option value="Selective Estrogen Receptor Modulator (SERM)">SERM</option>
              </optgroup>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        )}
      </div>

      {/* Keyboard Navigation Help */}
      <div className="text-sm text-gray-500" aria-label="Keyboard shortcuts">
        <h3 className="sr-only">Keyboard shortcuts</h3>
        <ul className="flex flex-wrap gap-x-4 gap-y-2">
          {/* Navigation */}
          <li className="flex flex-wrap gap-x-4 gap-y-2">
            <span className="inline-flex items-center gap-1">
              <kbd className="px-2 py-0.5 text-xs bg-gray-100 border border-gray-300 rounded">/</kbd>
              <span>Search</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="px-2 py-0.5 text-xs bg-gray-100 border border-gray-300 rounded">↑</kbd>
              <kbd className="px-2 py-0.5 text-xs bg-gray-100 border border-gray-300 rounded">↓</kbd>
              <span>or</span>
              <kbd className="px-2 py-0.5 text-xs bg-gray-100 border border-gray-300 rounded">j</kbd>
              <kbd className="px-2 py-0.5 text-xs bg-gray-100 border border-gray-300 rounded">k</kbd>
              <span>Navigate</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="px-2 py-0.5 text-xs bg-gray-100 border border-gray-300 rounded">Home</kbd>
              <kbd className="px-2 py-0.5 text-xs bg-gray-100 border border-gray-300 rounded">End</kbd>
              <span>Jump to top/bottom</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="px-2 py-0.5 text-xs bg-gray-100 border border-gray-300 rounded">Enter</kbd>
              <span>View details</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="px-2 py-0.5 text-xs bg-gray-100 border border-gray-300 rounded">Esc</kbd>
              <span>Clear filters</span>
            </span>
          </li>
          {/* Sorting */}
          <li className="flex flex-wrap gap-x-4 gap-y-2 border-t border-gray-200/30 pt-2 w-full">
            <span className="inline-flex items-center gap-1">
              <kbd className="px-2 py-0.5 text-xs bg-gray-100 border border-gray-300 rounded">Alt</kbd>+
              <kbd className="px-2 py-0.5 text-xs bg-gray-100 border border-gray-300 rounded">N</kbd>
              <span>Sort by name</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="px-2 py-0.5 text-xs bg-gray-100 border border-gray-300 rounded">Alt</kbd>+
              <kbd className="px-2 py-0.5 text-xs bg-gray-100 border border-gray-300 rounded">C</kbd>
              <span>Sort by class</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="px-2 py-0.5 text-xs bg-gray-100 border border-gray-300 rounded">Alt</kbd>+
              <kbd className="px-2 py-0.5 text-xs bg-gray-100 border border-gray-300 rounded">U</kbd>
              <span>Sort by updated</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="px-2 py-0.5 text-xs bg-gray-100 border border-gray-300 rounded">Alt</kbd>+
              <kbd className="px-2 py-0.5 text-xs bg-gray-100 border border-gray-300 rounded">S</kbd>
              <span>Toggle ascending/descending</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="px-2 py-0.5 text-xs bg-gray-100 border border-gray-300 rounded">Alt</kbd>+
              <kbd className="px-2 py-0.5 text-xs bg-gray-100 border border-gray-300 rounded">L</kbd>
              <span>Copy sharable link</span>
            </span>
          </li>
        </ul>
      </div>

      {/* Sort Controls */}
      <div 
        className="flex flex-wrap items-center gap-4 text-sm"
        role="toolbar" 
        aria-label="Sort controls"
      >
        <div className="flex items-center gap-2">
          <label htmlFor="sort-field" className="text-gray-600">Sort by:</label>
          <select
            id="sort-field"
            value={sort.field}
            onChange={(e) => {
              const newSort = {
                field: e.target.value as SortField,
                order: 'asc' as const // Reset to ascending when changing sort field
              };
              updateSort(newSort, `Sorted by ${e.target.value.replace(/_/g, ' ')} ${newSort.order === 'asc' ? '↑' : '↓'}`);
            }}
            className={`
              pl-3 pr-8 py-1 bg-white/30 backdrop-blur-md border border-white/20 
              rounded-lg shadow hover:shadow-md opacity-80 hover:opacity-100 
              appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
              transition-all duration-300
              ${sort.field === 'name' && 'text-indigo-700'}
              ${sort.field === 'classification' && 'text-purple-700'}
              ${sort.field === 'updated_at' && 'text-blue-700'}
            `}
            title="Press Alt+N for name, Alt+C for class, Alt+U for updated"
            aria-label={`Sort by ${sort.field}, currently ${sort.order === 'asc' ? 'ascending' : 'descending'}`}
          >
            <option value="name">
              {sort.field === 'name' && (sort.order === 'asc' ? '↑ ' : '↓ ')}Name
            </option>
            <option value="classification">
              {sort.field === 'classification' && (sort.order === 'asc' ? '↑ ' : '↓ ')}Classification
            </option>
            <option value="updated_at">
              {sort.field === 'updated_at' && (sort.order === 'asc' ? '↑ ' : '↓ ')}Last Updated
            </option>
          </select>
        </div>
        <button
          onClick={() => {
            const newSort = { 
              ...sort, 
              order: sort.order === 'asc' ? ('desc' as const) : ('asc' as const)
            };
            updateSort(newSort, `Sort order: ${newSort.order === 'asc' ? 'ascending ↑' : 'descending ↓'}`);
          }}
          className={`
            inline-flex items-center gap-1 px-2.5 py-1.5 
            text-gray-600 hover:text-gray-800 
            border border-transparent hover:border-gray-200 
            rounded-lg transition-all duration-200
            ${sort.order === 'desc' ? 'bg-gray-100/50' : ''}
          `}
          title="Press Alt+S to toggle sort order"
        >
          {sort.order === 'asc' ? '↑' : '↓'}
          {sort.order === 'asc' ? 'Ascending' : 'Descending'}
        </button>
      </div>

      {/* Active Filters and Results Count */}
      <div className="flex flex-wrap items-center gap-2 text-sm border-t border-gray-200/30 pt-3 mt-3">
        {!loading && !error && (
          <span className="text-gray-600">
            Found {medications.length} medication{medications.length !== 1 ? 's' : ''}
            {(searchQuery || selectedClass) && ' matching filters'}
          </span>
        )}
        {searchQuery && (
          <span className="inline-flex items-center px-2 py-1 rounded bg-indigo-100 text-indigo-800 gap-1">
            Search: {searchQuery}
            <button
              onClick={() => setSearchQuery('')}
              className="hover:text-indigo-600"
              title="Clear search"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        )}
        {selectedClass && (
          <span className="inline-flex items-center px-2 py-1 rounded bg-purple-100 text-purple-800 gap-1">
            Type: {selectedClass}
            <button
              onClick={() => setSelectedClass('')}
              className="hover:text-purple-600"
              title="Clear classification filter"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        )}
        {(searchQuery || selectedClass) && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedClass('');
            }}
            className="text-gray-500 hover:text-gray-700 transition-colors text-sm"
          >
            Clear all filters
          </button>
        )}
      </div>

      {error && (
        <div className="bg-white/30 backdrop-blur-md border border-white/20 text-red-700 p-4 rounded-xl shadow-lg hover:shadow-xl opacity-80 hover:opacity-100 transition-all duration-300 flex items-center gap-2">
          <X className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {medications.length === 0 ? (
          <div className="text-center p-8 bg-white/30 backdrop-blur-md border border-white/20 rounded-xl shadow-lg hover:shadow-xl opacity-80 hover:opacity-100 transition-all duration-300">
            No medications found. {searchQuery || selectedClass ? 'Try adjusting your filters.' : ''}
          </div>
        ) : (
          medications.map((medication, index) => (
            <div
              key={medication.id}
              id={`medication-${index}`}
              className={`group bg-white/30 backdrop-blur-md border ${
                focusedIndex === index
                  ? 'border-indigo-500 ring-2 ring-indigo-500 ring-opacity-50 shadow-xl scale-[1.02]'
                  : 'border-white/20 hover:shadow-2xl hover:scale-[1.02]'
              } rounded-xl shadow-lg opacity-80 hover:opacity-100 p-6 cursor-pointer 
                transition-all duration-300
                motion-safe:animate-in 
                motion-safe:fade-in-0 
                ${sort.order === 'asc' 
                  ? 'motion-safe:slide-in-from-bottom-4'
                  : 'motion-safe:slide-in-from-top-4'
                }
                motion-safe:duration-500
                motion-safe:delay-[${Math.min(index * 50, 1000)}ms]`}
              onClick={() => setSelectedMedication(medication)}
              title={`Click to view detailed information (${index + 1} of ${medications.length})`}
              role="button"
              tabIndex={0}
              aria-selected={focusedIndex === index ? "true" : "false"}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {medication.name}
                    </h3>
                    {medication.is_premedication && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                        Pre-Med
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    {medication.brand_names.join(', ')}
                  </p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getClassificationStyle(medication.classification)}`}>
                  {getShortClassification(medication.classification)}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {medication.indications?.cancer_types?.map((cancer, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200 transition-colors duration-200 cursor-help"
                    title={`Search for medications indicated for ${cancer}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSearchQuery(cancer);
                    }}
                  >
                    {cancer}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <MedicationDetailModal
        medication={selectedMedication}
        isOpen={!!selectedMedication}
        onClose={() => setSelectedMedication(null)}
      />
    </div>
  );
}
