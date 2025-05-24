import React, { useState, useEffect, useMemo, Suspense, startTransition, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Filter, X, Search, AlertCircle, Pill, Calendar, Info, RefreshCw, Bug } from 'lucide-react';
import { Button } from "../../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { useToast } from "../../../components/ui/use-toast";
import ErrorBoundary from "../../../components/ErrorBoundary";
import { Skeleton } from "../../../components/ui/skeleton";
import { ScrollArea } from "../../../components/ui/scroll-area";
import debounce from 'lodash.debounce';
import { getProtocols, ProtocolFilters } from '../../../services/protocols';
import type { Protocol, Drug, SupportiveCareItem } from '../../../types/protocol';
import ProtocolCard from "./ProtocolCard";
import { SupabaseTester } from "../../../components/SupabaseTester";
import { DrugCard, TagList, RichTextBlock } from '../components/medicationComponents';
import { MedicationDetailView } from '../components/MedicationDetailView';
import type { Medication } from '../../../types/medications';
import * as MedicationService from '../../../services/medications';
import { Link, useNavigate } from 'react-router-dom'; // Added for navigation
import { cleanProtocol, safeJsonParse, isValidDrugList } from '../../../types/protocol';

// Lazy load heavy components
const DrugDetailView = React.lazy(() => import('./DrugDetailView'));
import ProtocolDetail from './ProtocolDetail';


// Loading fallback for lazy components
const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
    <div className="flex items-center justify-start space-x-2 mt-4">
      <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    </div>
  </div>
);

// Update interfaces for the components
interface RegimenGroup {
  title: string;
  color: string;
  items: Protocol[];
}

// Helper function to pick appropriate color based on group name
const pickColor = (group: string) => {
  if (group.includes('Breast')) return 'bg-purple-100 dark:bg-purple-900';
  if (group.includes('GI')) return 'bg-red-100 dark:bg-red-900';
  if (group.includes('GU')) return 'bg-gray-100 dark:bg-gray-900';
  if (group.includes('Head') || group.includes('CNS')) return 'bg-green-100 dark:bg-green-900';
  if (group.includes('Lung') || group.includes('Thoracic')) return 'bg-blue-100 dark:bg-blue-900';
  if (group.includes('Hematologic')) return 'bg-yellow-100 dark:bg-yellow-900';
  if (group.includes('Sarcoma') || group.includes('Rare')) return 'bg-amber-100 dark:bg-amber-900';
  return 'bg-slate-100 dark:bg-slate-800';
};

// Import enhanced safeSplit and protocol helpers
import { safeSplit, getProtocolDrugs } from '../../../utils/protocolHelpers';

// Helper function to group protocols by tumour group
const groupProtocols = (protocols: Protocol[]): RegimenGroup[] => {
  try {
    const grouped: Record<string, Protocol[]> = {};

    protocols.forEach((p) => {
      const group = p.tumour_group || 'Uncategorized';
      if (!grouped[group]) grouped[group] = [];

      grouped[group].push({
        ...p
      });
    });

    return Object.entries(grouped).map(([title, items]) => ({
      title,
      color: pickColor(title),
      items
    }));
  } catch (error) {
    console.error('Error processing protocols:', error);
    return [];
  }
};

// Old ProtocolDetail has been replaced with a separate component file
// const ProtocolDetail = ({ protocol, onClose }: { protocol: Protocol | null; onClose: () => void }) => {
//   // ... existing drawer code ...
// };

interface ProtocolSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

interface MainSectionProps {
  group: RegimenGroup;
  onProtocolSelect: (protocol: Protocol) => void;
}

const ProtocolSection: React.FC<ProtocolSectionProps> = ({ title, icon, children }) => (
  <div className="mb-8">
    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
      {icon && <div className="flex items-center justify-center">{icon}</div>}
      {title}
    </h3>
    {children}
  </div>
);

interface MainSectionPropsWithDebug extends MainSectionProps {
  showDebugInfo?: boolean;
  showFullProtocolData?: boolean;
}

const MainSection: React.FC<MainSectionPropsWithDebug> = ({ 
  group, 
  onProtocolSelect, // This prop might be re-purposed or removed if direct navigation is used
  showDebugInfo = false,
  showFullProtocolData = false
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {group.items.map(protocol => (
      <Card key={protocol.id} className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="text-lg">{protocol.code}</CardTitle>
          <CardDescription>{protocol.tumour_group} - {protocol.treatment_intent}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground truncate h-10">{protocol.summary || 'No summary available.'}</p>
          {showDebugInfo && (
            <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-auto">
              {showFullProtocolData ? JSON.stringify(protocol, null, 2) : `ID: ${protocol.id}\nVersion: ${protocol.version}`}
            </pre>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          {/* Updated to Link for navigation */}
          <Button asChild variant="outline" size="sm">
            <Link to={`/cdu/treatment-protocols/${protocol.id}`} state={{ protocol }}>
              View Details
            </Link>
          </Button>
        </CardFooter>
      </Card>
    ))}
  </div>
);

// Add these types after the other interfaces
interface FilterState {
  search: string;
  groups: string[];
  intent?: 'Curative' | 'Adjuvant' | 'Neoadjuvant' | 'Palliative';
}

// Add loading component
const LoadingState = () => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
    <p className="text-gray-600 dark:text-gray-400">Loading protocols...</p>
  </div>
);

// Add error component
const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px]">
    <div className="text-red-500 dark:text-red-400 mb-4">{message}</div>
    <button 
      onClick={onRetry}
      className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors"
    >
      Retry
    </button>
  </div>
);

// Add empty state component
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px]">
    <p className="text-gray-600 dark:text-gray-400 mb-4">No treatment protocols found</p>
    <p className="text-sm text-gray-500 dark:text-gray-500">Please try again later or contact support if the issue persists.</p>
  </div>
);

// Add this after other interfaces
interface FilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedGroups: string[];
  availableGroups: string[];
  onGroupToggle: (group: string) => void;
  onClearFilters: () => void;
  selectedIntent?: 'Curative' | 'Adjuvant' | 'Neoadjuvant' | 'Palliative';
  onIntentChange: (intent?: 'Curative' | 'Adjuvant' | 'Neoadjuvant' | 'Palliative') => void;
  showDebugInfo?: boolean;
  onToggleDebugInfo?: () => void;
  showFullProtocolData?: boolean;
  onToggleFullProtocolData?: () => void;
  onTestFetchAllProtocols?: () => void;
}

// Update SearchAndFilter component
// Loading and error states for drug details
interface DrugLoadingState {
  loading: boolean;
  error: string | null;
}

const SearchAndFilter = ({ 
  searchQuery, 
  onSearchChange,
  selectedGroups,
  availableGroups,
  onGroupToggle,
  onClearFilters,
  selectedIntent,
  onIntentChange,
  showDebugInfo = false,
  onToggleDebugInfo,
  showFullProtocolData = false,
  onToggleFullProtocolData,
  onTestFetchAllProtocols
}: FilterProps) => (
  <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm py-4 border-b mb-6">
    <div className="grid grid-cols-1 md:grid-cols-[1fr,auto] gap-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search protocols..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <select
          value={selectedIntent || ''}
          onChange={(e) => onIntentChange(e.target.value as any || undefined)}
          className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
        >
          <option value="">All Intents</option>
          <option value="Curative">Curative</option>
          <option value="Adjuvant">Adjuvant</option>
          <option value="Neoadjuvant">Neoadjuvant</option>
          <option value="Palliative">Palliative</option>
        </select>
      </div>

      <Button
        variant="outline"
        size="default"
        className="flex items-center gap-2 whitespace-nowrap"
        onClick={() => onClearFilters()}
      >
        <X className="h-4 w-4" />
        Clear Filters
      </Button>
    </div>
    
    <div className="mt-4 flex flex-wrap gap-2 justify-between">
      <div className="flex flex-wrap gap-2">
        {availableGroups.map((group) => (
          <Badge
            key={group}
            variant={selectedGroups.includes(group) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => onGroupToggle(group)}
          >
            {group}
          </Badge>
        ))}
      </div>
      
      {process.env.NODE_ENV === 'development' && onToggleDebugInfo && (
        <div className="flex gap-2">
          <Button
            variant={showDebugInfo ? "default" : "outline"}
            size="sm"
            onClick={onToggleDebugInfo}
            className="text-xs flex items-center gap-1"
          >
            <Bug className="h-3 w-3" />
            {showDebugInfo ? 'Hide Debug' : 'Show Debug'}
          </Button>
          
          {showDebugInfo && onToggleFullProtocolData && (
            <Button
              variant={showFullProtocolData ? "default" : "outline"}
              size="sm"
              onClick={onToggleFullProtocolData}
              className="text-xs"
            >
              {showFullProtocolData ? 'Compact View' : 'Full JSON'}
            </Button>
          )}
          {/* Add the test button here */}
          {onTestFetchAllProtocols && (
            <Button
              onClick={onTestFetchAllProtocols}
              variant="outline"
              size="sm"
              className="ml-2 text-xs"
            >
              Test Fetch All Protocols
            </Button>
          )}
        </div>
      )}
    </div>
  </div>
);

export const RegimensLibrary = () => {
  return (
    <div className="space-y-6 p-6">
      <SupabaseTester module="chemotherapy" />
      <ErrorBoundary moduleName="Treatment Regimens">
        <RegimensLibraryContent />
      </ErrorBoundary>
    </div>
  );
};

// Add QueryErrorBoundary component at the top level
const QueryErrorBoundary: React.FC<{ error: Error; onRetry: () => void }> = ({ error, onRetry }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] p-6 bg-red-50 dark:bg-red-900/10 rounded-lg">
    <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
    <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">
      Failed to Load Protocols
    </h3>
    <p className="text-red-600 dark:text-red-300 text-center mb-4">
      {error.message || 'An error occurred while fetching protocols'}
    </p>
    <Button 
      variant="destructive"
      onClick={onRetry}
      className="flex items-center gap-2"
    >
      <RefreshCw className="w-4 h-4" />
      Retry Query
    </Button>
  </div>
);

// Loading and error states for drug details
interface DrugLoadingState {
  loading: boolean;
  error: string | null;
}

// Update RegimensLibraryContent component to include drug loading state
const RegimensLibraryContent: React.FC = () => {
  const navigate = useNavigate(); // Added for navigation
  const { toast } = useToast();
  const [queryState, setQueryState] = useState({
    isLoading: true,
    error: null as Error | null,
    lastUpdated: null as number | null
  });
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  const [drugLoadingState, setDrugLoadingState] = useState<DrugLoadingState>({
    loading: false,
    error: null
  });
  const [regimenGroups, setRegimenGroups] = useState<RegimenGroup[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedIntent, setSelectedIntent] = useState<'Curative' | 'Adjuvant' | 'Neoadjuvant' | 'Palliative'>();
  const [showDebugInfo, setShowDebugInfo] = useState(process.env.NODE_ENV === 'development');
  const [showFullProtocolData, setShowFullProtocolData] = useState(false);

  // Add a button to test fetching all protocols
  const testFetchAllProtocols = async () => {
    console.log("🧪 Attempting to fetch all protocols...");
    try {
      const allProtocols = await getProtocols({
        tumorGroup: null,
        drugName: null,
        treatmentIntent: null
      }); // Fetch with all filters as null
      console.log("🧪 All protocols fetched:", allProtocols);
      // Optionally, you can set these to state to display them, or just log
      // setRegimenGroups(groupProtocols(allProtocols)); 
    } catch (error) {
      console.error("💥 Error fetching all protocols:", error);
      toast({
        title: "Error Fetching All Protocols",
        description: (error instanceof Error ? error.message : String(error)),
        variant: "destructive",
      });
    }
  };

  // Create debounced search handler
  const debouncedSearch = useMemo(
    () => debounce((value: string) => {
      setSearchQuery(value);
    }, 300),
    []
  );

  // Update search handler in SearchAndFilter component
  const handleSearchChange = (value: string) => {
    debouncedSearch(value);
  };

  const fetchProtocols = async (filters: FilterState) => {
    setQueryState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const protocolFilters: ProtocolFilters = {
        tumorGroup: filters.groups.length > 0 ? filters.groups[0] : null,
        drugName: filters.search || null,
        treatmentIntent: filters.intent || null
      };
      const data = await getProtocols(protocolFilters);
      // Clean and validate all protocols
      const cleaned = data.map(cleanProtocol).filter(Boolean) as Protocol[];
      const grouped = groupProtocols(cleaned);
      setRegimenGroups(grouped);
      setQueryState({
        isLoading: false,
        error: null,
        lastUpdated: Date.now()
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unexpected error occurred');
      setQueryState({
        isLoading: false,
        error,
        lastUpdated: null
      });
      toast({
        title: "Error Loading Protocols",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const currentFilters = {
      search: searchQuery,
      groups: selectedGroups,
      intent: selectedIntent
    };
    fetchProtocols(currentFilters);
  }, [searchQuery, selectedGroups, selectedIntent]);
  
  // Handle drug selection with loading and error states
  const handleDrugSelect = async (drug: Drug) => {
    setDrugLoadingState({ loading: true, error: null });
    try {
      // Simulate loading state for now - replace with actual API call if needed
      await new Promise(resolve => setTimeout(resolve, 500));
      setSelectedDrug({ ...drug }); // Create new reference
      setDrugLoadingState({ loading: false, error: null });
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to load drug details';
      setDrugLoadingState({ loading: false, error });
      toast({
        title: "Error Loading Drug",
        description: error,
        variant: "destructive"
      });
    }  };

  // Update handleBack to reset states
  const handleBack = () => {
    startTransition(() => {
      if (selectedDrug) {
        setSelectedDrug(null);
        setDrugLoadingState({ loading: false, error: null }); // Reset drug state
      }
    });
  };

  const handleExport = () => {
    if (selectedDrug) {
      console.log('Exporting drug:', selectedDrug.name); // Changed from selectedDrug.code
      // Implement actual PDF export functionality here
      // For example, window.print() or a library call
      toast({
        title: "Export Triggered",
        description: `Drug ${selectedDrug.name} would be exported.`, // Changed from selectedDrug.code
      });
    }
  };

  // Groups are already filtered by the backend
  const filteredGroups = useMemo(() => {
    return regimenGroups.filter(group => group.items.length > 0);
  }, [regimenGroups]);

  const availableGroups = useMemo(() => {
    // Ensure we have unique groups and they're sorted
    const groups = Array.from(new Set(regimenGroups.map(g => g.title)));
    return groups.sort();
  }, [regimenGroups]);

  // Add toast notifications for error states
  useEffect(() => {
    if (queryState.error) {
      toast({
        title: "Error Loading Protocols",
        description: queryState.error.message,
        variant: "destructive",
      });
    }
  }, [queryState.error, toast]);

  // Add loading skeleton for when protocols are being filtered
  const renderLoadingSkeleton = () => (
    <div className="space-y-8">
      {[1, 2, 3].map((group) => (
        <div key={group} className="mb-8 p-6 rounded-xl bg-gray-50 dark:bg-gray-800">
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((card) => (
              <Skeleton key={card} className="h-32 rounded-xl" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
  // Move renderContent inside component
  const renderContent = () => {
    if (queryState.isLoading) return renderLoadingSkeleton();
    if (queryState.error) return (
      <QueryErrorBoundary
        error={queryState.error}
        onRetry={() => fetchProtocols({
          search: searchQuery,
          groups: selectedGroups,
          intent: selectedIntent
        })}
      />
    );

    if (!Array.isArray(regimenGroups) || regimenGroups.length === 0) return <EmptyState />;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-8"
      >
        {filteredGroups.map((group: RegimenGroup, index: number) => (
          <Section // Changed from MainSection to Section, ensure handleProtocolSelect is used by ProtocolCard
            key={`${group.title}-${index}`}
            group={group}
            // onProtocolSelect is not a prop of Section, ProtocolCard's onView calls handleProtocolSelect
          />
        ))}
      </motion.div>
    );
  };

  const handleProtocolSelect = (protocol: Protocol) => {
    console.log('🧬 Protocol selected:', {
      id: protocol.id,
      code: protocol.code,
      hasData: !!protocol,
      path: `/cdu/treatment-protocols/${protocol.id}`
    });
    navigate(`treatment-protocols/${protocol.id}`, {
      state: { protocol },
      replace: false // Explicitly not replacing to maintain history
    });
  };

  // Add section props interface
  interface SectionProps {
    group: RegimenGroup;
  }
  
  // Replace ProtocolCard usage in Section with new version
  const Section: React.FC<SectionProps> = ({ group }) => (
    <section className={`mb-8 p-6 rounded-xl ${group.color}`}>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        {group.title} <span className="ml-2 text-sm text-gray-500">– {group.items.length} protocols</span>
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {group.items.map((item, index) => (
          <ProtocolCard 
            key={`${item.id}-${index}`} // Use item.id or another unique key like item.code
            protocol={item} 
            onView={() => handleProtocolSelect(item)} // Use handleProtocolSelect directly
          />
        ))}
      </div>
    </section>
  );
  // Add toggle debug info handler with enhanced functionality
  const handleToggleDebugInfo = () => {
    setShowDebugInfo(prev => !prev);
    if (!showDebugInfo) {
      toast({
        title: "Debug Mode Enabled",
        description: "Protocol debug information will be displayed",
        duration: 3000,
      });
      
      // Log the current schema structure to console for debugging
      if (regimenGroups.length > 0 && regimenGroups[0].items.length > 0) {
        const sampleProtocol = regimenGroups[0].items[0];
        console.log('Protocol Structure Sample:', {
          id: sampleProtocol.id,
          hasTreatment: !!sampleProtocol.treatment,
          hasDrugs: !!(sampleProtocol.treatment?.drugs),
          drugCount: sampleProtocol.treatment?.drugs?.length || 0,
          fullSchema: sampleProtocol
        });
      }
    }
  };

  // Add toggle full protocol data handler
  const handleToggleFullProtocolData = () => {
    setShowFullProtocolData(prev => !prev);
  };

  const handleGroupChange = (group: string) => {
    setSelectedGroups(prev => 
      prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]
    );
  };

  const handleIntentChange = (intent?: 'Curative' | 'Adjuvant' | 'Neoadjuvant' | 'Palliative') => {
    setSelectedIntent(intent);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedGroups([]);
    setSelectedIntent(undefined);
  };

  // Deep-linking reload logic
  useEffect(() => {
    const url = new URL(window.location.href);
    const protocolId = url.pathname.split('/').pop();
    if (protocolId && protocolId.length > 5 && !regimenGroups.some(g => g.items.some(p => p.id === protocolId))) {
      // Try to fetch protocol by ID if not present
      getProtocols({ tumorGroup: null, drugName: null, treatmentIntent: null }).then(data => {
        const cleaned = data.map(cleanProtocol).filter(Boolean) as Protocol[];
        const found = cleaned.find(p => p.id === protocolId);
        if (found) {
          setRegimenGroups([{ title: found.tumour_group || 'Uncategorized', color: pickColor(found.tumour_group || ''), items: [found] }]);
        }
      });
    }
  }, [regimenGroups]);

  return (
    <div className="space-y-6">
      {/* Add the Test All Protocols button here, outside SearchAndFilter if it's a top-level action */}
      {/* Or ensure it's passed correctly if meant to be inside SearchAndFilter */}
      <SearchAndFilter
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedGroups={selectedGroups}
        availableGroups={availableGroups}
        onGroupToggle={handleGroupChange}
        onClearFilters={handleClearFilters}
        selectedIntent={selectedIntent}
        onIntentChange={handleIntentChange}
        showDebugInfo={showDebugInfo}
        onToggleDebugInfo={handleToggleDebugInfo}
        showFullProtocolData={showFullProtocolData}
        onToggleFullProtocolData={handleToggleFullProtocolData}
        onTestFetchAllProtocols={testFetchAllProtocols} // <-- Pass as prop
      />

      {selectedDrug ? (
        drugLoadingState.loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin h-10 w-10 border-4 border-t-indigo-500 border-r-indigo-500 border-b-transparent border-l-transparent rounded-full mb-3" />
            <p className="text-gray-600 dark:text-gray-400 font-medium">Loading medication details...</p>
          </div>) : (
          <Suspense fallback={<LoadingSkeleton />}>
            <DrugDetailView drug={selectedDrug} onBack={handleBack} />
          </Suspense>
        )
      ) : (
        renderContent()
      )}
    </div>
  );
};

// MedicationGrid component
const MedicationGrid = ({ medications }: { medications: Medication[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {medications.map((medication) => (
      <DrugCard key={medication.id} medication={medication} />
    ))}
  </div>
);

// FilterBar component
const FilterBar = ({
  searchQuery,
  onSearchChange,
  selectedTypes,
  onTypeSelect,
  availableTypes
}: {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTypes: string[];
  onTypeSelect: (type: string) => void;
  availableTypes: string[];
}) => (
  <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 border-b">
    <div className="flex flex-col sm:flex-row gap-4">
      <Input
        placeholder="Search medications..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-sm"
      />
      <div className="flex flex-wrap gap-2">
        {availableTypes.map((type) => (
          <Badge
            key={type}
            variant={selectedTypes.includes(type) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => onTypeSelect(type)}
          >
            {type}
          </Badge>
        ))}
      </div>
    </div>
  </div>
);
