import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Filter, X, Search, AlertCircle, Pill, Calendar, Info, RefreshCw } from 'lucide-react';
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { useToast } from "../../../components/ui/use-toast";
import ErrorBoundary from "../../../components/ErrorBoundary";
import { Skeleton } from "../../../components/ui/skeleton";
import debounce from 'lodash.debounce';
import { getProtocols, ProtocolFilters } from '../../../services/protocols';
import type { Protocol, Drug, SupportiveCareItem, ContraindicationItem, SpecialNote } from '../../../types/protocol';
import ProtocolCard from "./ProtocolCard";
import ProtocolDetailsDrawer from "./ProtocolDetailsDrawer";
import { SupabaseTester } from "../../../components/SupabaseTester";

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

// Helper function to safely split strings or handle arrays
const safeSplit = (value: any): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') return value.split(';').map(item => item.trim()).filter(Boolean);
  return [];
};

// Helper function to group protocols by tumour group
const groupProtocols = (protocols: Protocol[]): RegimenGroup[] => {
  try {
    const grouped: Record<string, Protocol[]> = {};

    protocols.forEach(p => {
      const group = p.tumour_group || 'Uncategorized';
      if (!grouped[group]) grouped[group] = [];

      // Get drugs from treatment
      const drugs = p.treatment?.drugs || [];
      
      grouped[group].push({
        ...p,
        title: p.code,
        count: drugs.length,
        drugs
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

const DrugDetailView = ({ drug, onBack }: { drug: Drug; onBack: () => void }) => (
  <div className="space-y-6">
    <button
      onClick={onBack}
      className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
    >
      <ChevronLeft className="w-5 h-5 mr-1" />
      Back to Protocol
    </button>

    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        {drug && typeof drug.name === 'string' ? drug.name : 'Unnamed Drug'}
      </h2>
      
      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Dosing</h3>
          <p className="text-gray-700 dark:text-gray-300">
            {drug?.dose || 'No dosing information available'}
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Supportive Care</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            {Array.isArray(drug?.supportiveCare) && drug.supportiveCare.length > 0 ? (
              drug.supportiveCare.map((item: string | SupportiveCareItem, index) => (
                <li key={index}>
                  {typeof item === 'string' ? (
                    item
                  ) : (
                    <div>
                      {item.name && <strong>{item.name}</strong>}
                      {item.dose && <span> — {item.dose}</span>}
                      {item.timing && <span> at {item.timing}</span>}
                      {item.route && <span> via {item.route}</span>}
                      {item.purpose && <div className="ml-4 text-sm">Purpose: {item.purpose}</div>}
                      {!item.name && !item.dose && <span>{JSON.stringify(item)}</span>}
                    </div>
                  )}
                </li>
              ))
            ) : (
              <li>No supportive care information available</li>
            )}
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Contraindications</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            {Array.isArray(drug?.contraindications) && drug.contraindications.length > 0 ? (
              drug.contraindications.map((item: string | ContraindicationItem, index) => (
                <li key={index}>
                  {typeof item === 'string' ? (
                    item
                  ) : (
                    <div>
                      {item.condition && <strong>{item.condition}</strong>}
                      {item.severity && <span> ({item.severity})</span>}
                      {item.management && <div className="ml-4 text-sm">Management: {item.management}</div>}
                      {!item.condition && <span>{JSON.stringify(item)}</span>}
                    </div>
                  )}
                </li>
              ))
            ) : (
              <li>No contraindication information available</li>
            )}
          </ul>
        </section>

        {drug?.special_notes && (
          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Special Notes</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              {Array.isArray(drug.special_notes) ? (
                drug.special_notes.map((note: string | SpecialNote, index: number) => (
                  <li key={index}>
                    {typeof note === 'string' ? (
                      note
                    ) : (
                      <div>
                        {note.title && <strong>{note.title}</strong>}
                        {note.description && <div className="ml-4 text-sm">{note.description}</div>}
                        {!note.title && !note.description && <span>{JSON.stringify(note)}</span>}
                      </div>
                    )}
                  </li>
                ))
              ) : (
                <li>{String(drug.special_notes)}</li>
              )}
            </ul>
          </section>
        )}
      </div>
    </div>
  </div>
);

const ProtocolDetail: React.FC<{ 
  protocol: Protocol; 
  onBack: () => void;
  onDrugSelect: (drug: Drug) => void;
}> = ({ protocol, onBack, onDrugSelect }) => (
  <div className="space-y-6">
    <button
      onClick={onBack}
      className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
    >
      <ChevronLeft className="w-5 h-5 mr-1" />
      Back to Regimens
    </button>
    
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        {protocol && typeof protocol.title === 'string' ? protocol.title : 'Untitled Protocol'}
      </h2>
      <div className="mb-6">
        <span className="inline-block bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-100 px-3 py-1 rounded-full text-sm">
          {typeof protocol?.count === 'number' ? `${protocol.count} protocols available` : '0 protocols available'}
        </span>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Available Drug Regimens</h3>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {Array.isArray(protocol?.drugs) && protocol.drugs.length > 0 ? (
            protocol.drugs.map((drug, index) => (
              <div
                key={index}
                onClick={() => onDrugSelect(drug)}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:shadow-md transition-shadow duration-200 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  {drug && typeof drug.name === 'string' ? drug.name : 'Unnamed Drug'}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {drug?.dose && typeof drug.dose === 'string' 
                    ? drug.dose 
                    : 'No dosing information available'}
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-full p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
              No drug regimens available
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

interface SectionProps {
  group: RegimenGroup;
  onProtocolSelect: (protocol: Protocol) => void;
}

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
}

// Update SearchAndFilter component
const SearchAndFilter = ({ 
  searchQuery, 
  onSearchChange,
  selectedGroups,
  availableGroups,
  onGroupToggle,
  onClearFilters,
  selectedIntent,
  onIntentChange
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
    
    <div className="mt-4 flex flex-wrap gap-2">
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

// Update RegimensLibraryContent component to include debounced search and better error handling
const RegimensLibraryContent: React.FC = () => {
  const { toast } = useToast();
  const [queryState, setQueryState] = useState({
    isLoading: true,
    error: null as Error | null,
    lastUpdated: null as number | null
  });
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  const [regimenGroups, setRegimenGroups] = useState<RegimenGroup[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedIntent, setSelectedIntent] = useState<'Curative' | 'Adjuvant' | 'Neoadjuvant' | 'Palliative'>();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerProtocol, setDrawerProtocol] = useState<any>(null);

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
        tumorGroup: selectedGroups.length > 0 ? selectedGroups[0] : null,
        drugName: searchQuery || null,
        treatmentIntent: selectedIntent || null
      };

      const data = await getProtocols(protocolFilters);
      const grouped = groupProtocols(data);
      
      setRegimenGroups(grouped);
      setQueryState({
        isLoading: false,
        error: null,
        lastUpdated: Date.now()
      });
    } catch (err) {
      console.error('Error fetching protocols:', err);
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

  const handleProtocolSelect = (protocol: Protocol) => {
    setSelectedProtocol({ ...protocol }); // Create new reference
    setSelectedDrug(null);
  };

  const handleDrugSelect = (drug: Drug) => {
    setSelectedDrug({ ...drug }); // Create new reference
  };

  const handleBack = () => {
    if (selectedDrug) {
      setSelectedDrug(null);
    } else {
      setSelectedProtocol(null);
    }
  };

  const handleProtocolView = (protocol: any) => {
    setDrawerProtocol(protocol);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setDrawerProtocol(null);
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
          <Section 
            key={`${group.title}-${index}`}
            group={group} 
            onProtocolSelect={handleProtocolSelect}
          />
        ))}
      </motion.div>
    );
  };

  // Replace ProtocolCard usage in Section with new version
  const Section: React.FC<SectionProps> = ({ group }) => (
    <section className={`mb-8 p-6 rounded-xl ${group.color}`}>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        {group.title} <span className="ml-2 text-sm text-gray-500">– {group.items.length} protocols</span>
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {group.items.map((item, index) => (
          <ProtocolCard 
            key={`${item.title}-${index}`} 
            protocol={item} 
            onView={() => handleProtocolView(item)}
          />
        ))}
      </div>
    </section>
  );

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        Treatment Regimen Library
      </h2>
      
      <SearchAndFilter
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedGroups={selectedGroups}
        availableGroups={availableGroups}
        selectedIntent={selectedIntent}
        onIntentChange={setSelectedIntent}
        onGroupToggle={(group) => {
          setSelectedGroups(prev => 
            prev.includes(group)
              ? prev.filter(g => g !== group)
              : [...prev, group]
          );
        }}
        onClearFilters={() => {
          setSearchQuery("");
          setSelectedGroups([]);
          setSelectedIntent(undefined);
        }}
      />

      {selectedDrug ? (
        <DrugDetailView drug={selectedDrug} onBack={handleBack} />
      ) : selectedProtocol ? (
        <ProtocolDetail 
          protocol={selectedProtocol} 
          onBack={handleBack}
          onDrugSelect={handleDrugSelect}
        />
      ) : renderContent()}
      <ProtocolDetailsDrawer protocol={drawerProtocol} open={drawerOpen} onClose={handleDrawerClose} />
    </div>
  );
};
