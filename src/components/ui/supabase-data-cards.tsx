import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { DataCard, ColorMapping } from '@/components/ui/data-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertCircle,
  Search,
  Loader2,
  ExternalLink,
  SlidersHorizontal,
  RefreshCw
} from 'lucide-react';

interface SupabaseDataCardsProps<T extends Record<string, any>> {
  tableName: string; // Name of the Supabase table
  title?: string; // Page title
  displayKeyField?: keyof T; // Field to use for card title
  descriptionField?: keyof T; // Field to use for card description
  colorMappings: {
    [key: string]: ColorMapping; // Named color mappings
  };
  defaultColorMapping: string; // Default color mapping key 
  fields: Array<{
    key: keyof T | string; // The data field to display
    label?: string; // Label to show next to the value
    format?: (value: any, data: T) => React.ReactNode; // Custom formatter
    visible?: boolean | ((value: any, data: T) => boolean); // Whether field is visible
    badge?: boolean; // Display as a badge
    className?: string; // Custom class for this field
  }>;
  onCardClick?: (data: T) => void; // Callback when a card is clicked
  searchFields?: Array<keyof T>; // Fields to include in search
  additionalFilters?: string; // Additional Supabase filters
  limit?: number; // Number of records to fetch
  orderBy?: {
    column: keyof T;
    ascending?: boolean;
  };
}

/**
 * A configurable component for displaying Supabase table data as color-coded cards
 */
function SupabaseDataCards<T extends Record<string, any>>({
  tableName,
  title = 'Supabase Data',
  displayKeyField = 'name',
  descriptionField = 'description',
  colorMappings,
  defaultColorMapping,
  fields,
  onCardClick,
  searchFields = [],
  additionalFilters = '',
  limit = 100,
  orderBy = { column: 'created_at', ascending: false }
}: SupabaseDataCardsProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [colorMappingType, setColorMappingType] = useState<string>(defaultColorMapping);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // Get the color mapping keys for the tabs
  const colorMappingKeys = Object.keys(colorMappings);

  // Define the query and fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let query = supabase
          .from(tableName)
          .select('*');
          
        if (additionalFilters) {
          // Apply any additional filters
          // This is a simplified approach - ideally we'd parse the filter string properly
          query = query.or(additionalFilters);
        }
          
        if (orderBy) {
          query = query.order(orderBy.column as string, { 
            ascending: orderBy.ascending ?? false
          });
        }
        
        if (limit) {
          query = query.limit(limit);
        }
        
        const { data: fetchedData, error: fetchError } = await query;
        
        if (fetchError) throw fetchError;
        
        setData(fetchedData as T[]);
        
      } catch (err) {
        console.error(`Error fetching data from ${tableName}:`, err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [tableName, additionalFilters, limit, orderBy.column, orderBy.ascending, refreshKey]);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    return data.filter(item => {
      // If searchFields is provided, only search in those fields
      if (searchFields.length > 0) {
        return searchFields.some(field => {
          const value = item[field as string];
          return value && String(value).toLowerCase().includes(lowerSearchTerm);
        });
      }
      
      // Otherwise, search all string-like fields
      return Object.entries(item).some(([_, value]) => {
        return typeof value === 'string' && value.toLowerCase().includes(lowerSearchTerm);
      });
    });
  }, [data, searchTerm, searchFields]);

  // Handle refresh button click
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <span className="ml-3 text-gray-500">Loading data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center py-12 text-red-500">
        <AlertCircle className="h-12 w-12 mb-3" />
        <p className="text-lg">Error loading data</p>
        <p className="text-sm">{error}</p>
        <Button onClick={handleRefresh} variant="outline" className="mt-4">
          <RefreshCw className="h-4 w-4 mr-2" /> Try Again
        </Button>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center py-12 text-gray-500">
        <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4 mb-4">
          <AlertCircle className="h-8 w-8 text-gray-400" />
        </div>
        <p className="text-lg">No data available</p>
        <p className="text-sm">The table appears to be empty</p>
      </div>
    );
  }

  const activeColorMapping = colorMappings[colorMappingType] || colorMappings[defaultColorMapping];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{title}</h2>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {/* Search Bar */}
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full"
            />
          </div>
          
          <div className="flex items-center gap-2">
            {/* Color Mapping Select */}
            {colorMappingKeys.length > 1 && (
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-gray-500" />
                <Select
                  value={colorMappingType}
                  onValueChange={setColorMappingType}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Color by..." />
                  </SelectTrigger>
                  <SelectContent>
                    {colorMappingKeys.map(key => (
                      <SelectItem key={key} value={key}>
                        Color by {key}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {/* View Mode Toggle */}
            <Tabs 
              defaultValue="grid" 
              value={viewMode}
              onValueChange={(value) => setViewMode(value as 'grid' | 'list')}
            >
              <TabsList className="grid w-[80px] grid-cols-2">
                <TabsTrigger value="grid" className="p-1.5">
                  <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="list" className="p-1.5">
                  <div className="flex flex-col gap-0.5 w-4 h-4 justify-center">
                    <div className="bg-current h-0.5 rounded-sm"></div>
                    <div className="bg-current h-0.5 rounded-sm"></div>
                    <div className="bg-current h-0.5 rounded-sm"></div>
                  </div>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            {/* Refresh Button */}
            <Button onClick={handleRefresh} size="icon" variant="outline">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className={`grid gap-4 ${
        viewMode === 'grid' 
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
          : "grid-cols-1"
      }`}>
        {filteredData.map((item, index) => (
          <DataCard
            key={`${tableName}-${item.id || index}`}
            data={item}
            title={item[displayKeyField as string]}
            description={item[descriptionField as string]}
            colorMapping={activeColorMapping}
            fields={fields.map(field => ({
              ...field,
              key: String(field.key),
              format: field.format as any,
              visible: field.visible as any
            }))}
            onClick={onCardClick ? (data) => onCardClick(data as T) : undefined}
            className={viewMode === 'grid' ? "h-full" : ""}
          />
        ))}
      </div>
      
      {filteredData.length === 0 && searchTerm && (
        <div className="flex flex-col items-center py-12 text-gray-500">
          <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4 mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-lg">No matching records found</p>
          <p className="text-sm">Try adjusting your search terms</p>
        </div>
      )}
      
      <div className="text-sm text-gray-500 text-right">
        {filteredData.length} of {data.length} records
      </div>
    </div>
  );
}

export default SupabaseDataCards;
