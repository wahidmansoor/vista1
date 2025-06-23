import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { DataCard, ColorMapping } from '@/components/ui/data-card';
import { AlertCircle, Clock, CalendarIcon, Tag, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Example type for your Supabase data
interface SupabaseRecord {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  severity: 'mild' | 'moderate' | 'severe';
  created_at: string;
  updated_at: string;
  description?: string;
  category?: string;
  [key: string]: any; // For other dynamic fields
}

// Color coding based on severity
const severityColorMapping: ColorMapping = {
  field: 'severity',
  values: {
    mild: {
      background: 'bg-green-50 dark:bg-green-900/20',
      text: 'text-green-700 dark:text-green-400',
      border: 'border-green-200 dark:border-green-800'
    },
    moderate: {
      background: 'bg-yellow-50 dark:bg-yellow-900/20',
      text: 'text-yellow-700 dark:text-yellow-400',
      border: 'border-yellow-200 dark:border-yellow-800'
    },
    severe: {
      background: 'bg-red-50 dark:bg-red-900/20',
      text: 'text-red-700 dark:text-red-400',
      border: 'border-red-200 dark:border-red-800'
    }
  },
  default: {
    background: 'bg-gray-50 dark:bg-gray-900/20',
    text: 'text-gray-700 dark:text-gray-400',
    border: 'border-gray-200 dark:border-gray-800'
  }
};

// Color coding based on status
const statusColorMapping: ColorMapping = {
  field: 'status',
  values: {
    active: {
      background: 'bg-green-50 dark:bg-green-900/20',
      text: 'text-green-700 dark:text-green-400',
      border: 'border-green-200 dark:border-green-800'
    },
    inactive: {
      background: 'bg-gray-50 dark:bg-gray-900/20',
      text: 'text-gray-700 dark:text-gray-400',
      border: 'border-gray-200 dark:border-gray-800'
    },
    pending: {
      background: 'bg-blue-50 dark:bg-blue-900/20',
      text: 'text-blue-700 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800'
    }
  }
};

const SupabaseDataCardExample: React.FC = () => {
  const [data, setData] = useState<SupabaseRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [colorMappingType, setColorMappingType] = useState<'severity' | 'status'>('severity');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Replace 'your_table' with your actual Supabase table name
        const { data, error } = await supabase
          .from('your_table')
          .select('*');
          
        if (error) throw error;
        
        setData(data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        
        // In development mode, use sample data when there's an error
        if (process.env.NODE_ENV === 'development') {
          setData(sampleData);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex justify-center py-8">Loading data...</div>;
  }

  if (error && data.length === 0) {
    return (
      <div className="flex flex-col items-center py-8 text-red-500">
        <AlertCircle className="w-8 h-8 mb-2" />
        <p>Error loading data: {error}</p>
      </div>
    );
  }

  const activeColorMapping = colorMappingType === 'severity' 
    ? severityColorMapping 
    : statusColorMapping;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Supabase Data Cards</h2>
        
        <Tabs 
          defaultValue="severity" 
          onValueChange={(value) => setColorMappingType(value as 'severity' | 'status')}
          className="w-[400px]"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="severity">Color by Severity</TabsTrigger>
            <TabsTrigger value="status">Color by Status</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((item) => (
          <DataCard
            key={item.id}
            data={item}
            title={item.name}
            description={item.description || 'No description available'}
            colorMapping={activeColorMapping}
            fields={[
              { 
                key: 'severity', 
                label: 'Severity', 
                badge: true,
                className: `${
                  item.severity === 'mild' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' :
                  item.severity === 'moderate' ? 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800' :
                  'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
                }`
              },
              { 
                key: 'status', 
                label: 'Status',
                badge: true,
                className: `${
                  item.status === 'active' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' :
                  item.status === 'pending' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800' :
                  'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800'
                }`
              },
              { 
                key: 'category', 
                label: 'Category',
                format: (value) => value || 'Uncategorized',
              },
              {
                key: 'created_at',
                label: 'Created',
                format: (value) => (
                  <div className="flex items-center gap-1 text-gray-500">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    <span>{value ? format(new Date(value), 'MMM d, yyyy') : 'Unknown'}</span>
                  </div>
                )
              },
              // Add more fields as needed
            ]}
            onClick={(item) => console.log('Clicked item:', item)}
            className="hover:scale-[1.01] transition-transform"
          />
        ))}
      </div>
    </div>
  );
};

// Sample data for development/testing
const sampleData: SupabaseRecord[] = [
  {
    id: '1',
    name: 'Neutropenic Fever',
    status: 'active',
    severity: 'severe',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    description: 'Urgent evaluation and IV antibiotics needed immediately.',
    category: 'Oncologic Emergency'
  },
  {
    id: '2',
    name: 'Tumor Lysis Syndrome',
    status: 'active',
    severity: 'moderate',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    description: 'Watch for electrolyte abnormalities and renal failure.',
    category: 'Metabolic'
  },
  {
    id: '3',
    name: 'Anemia',
    status: 'pending',
    severity: 'mild',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    description: 'Regular monitoring recommended.',
    category: 'Hematologic'
  },
  {
    id: '4',
    name: 'Spinal Cord Compression',
    status: 'active',
    severity: 'severe',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    description: 'Early MRI and steroids critical to prevent paralysis.',
    category: 'Neurologic'
  },
  {
    id: '5',
    name: 'Hypercalcemia',
    status: 'inactive',
    severity: 'moderate',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    description: 'Severe dehydration, mental status changes, urgent hydration.',
    category: 'Metabolic'
  },
  {
    id: '6',
    name: 'Superior Vena Cava Syndrome',
    status: 'active',
    severity: 'severe',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    description: 'Neck swelling, dyspnea, urgent imaging required.',
    category: 'Vascular'
  }
];

export default SupabaseDataCardExample;
