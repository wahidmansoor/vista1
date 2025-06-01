import React from 'react';
import SupabaseDataCards from '@/components/ui/supabase-data-cards';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ActivityIcon, ClockIcon, AlertTriangle } from 'lucide-react';
import { ColorMapping } from '@/components/ui/data-card';

// Example symptom data type from your Supabase table
interface Symptom {
  id: string;
  symptom_name: string;
  status: 'active' | 'inactive' | 'pending';
  severity: 'mild' | 'moderate' | 'severe';
  description?: string;
  created_at: string;
  updated_at: string;
  onset?: string;
  category?: string;
  redFlags?: string[];
  assessmentPoints?: string[];
  suggestedInterventions?: {
    pharmacological: string[];
    nonPharmacological: string[];
  };
}

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
  }
};

const statusColorMapping: ColorMapping = {
  field: 'status',
  values: {
    active: {
      background: 'bg-green-50 dark:bg-green-900/20',
      text: 'text-green-700 dark:text-green-400',
      border: 'border-green-200 dark:border-green-800'
    },
    inactive: {
      background: 'bg-gray-50 dark:bg-gray-800/50',
      text: 'text-gray-700 dark:text-gray-400',
      border: 'border-gray-200 dark:border-gray-700'
    },
    pending: {
      background: 'bg-blue-50 dark:bg-blue-900/20',
      text: 'text-blue-700 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800'
    }
  }
};

const categoryColorMapping: ColorMapping = {
  field: 'category',
  values: {
    'Neurologic': {
      background: 'bg-purple-50 dark:bg-purple-900/20',
      text: 'text-purple-700 dark:text-purple-400',
      border: 'border-purple-200 dark:border-purple-800'
    },
    'Gastrointestinal': {
      background: 'bg-amber-50 dark:bg-amber-900/20',
      text: 'text-amber-700 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-800'
    },
    'Respiratory': {
      background: 'bg-sky-50 dark:bg-sky-900/20',
      text: 'text-sky-700 dark:text-sky-400',
      border: 'border-sky-200 dark:border-sky-800'
    },
    'Cardiovascular': {
      background: 'bg-red-50 dark:bg-red-900/20',
      text: 'text-red-700 dark:text-red-400',
      border: 'border-red-200 dark:border-red-800'
    },
    'Metabolic': {
      background: 'bg-emerald-50 dark:bg-emerald-900/20',
      text: 'text-emerald-700 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-800'
    },
    'Hematologic': {
      background: 'bg-pink-50 dark:bg-pink-900/20',
      text: 'text-pink-700 dark:text-pink-400',
      border: 'border-pink-200 dark:border-pink-800'
    },
    'Dermatologic': {
      background: 'bg-orange-50 dark:bg-orange-900/20',
      text: 'text-orange-700 dark:text-orange-400',
      border: 'border-orange-200 dark:border-orange-800'
    }
  },
  default: {
    background: 'bg-gray-50 dark:bg-gray-900/20',
    text: 'text-gray-700 dark:text-gray-400',
    border: 'border-gray-200 dark:border-gray-700'
  }
};

const SymptomDataCards: React.FC = () => {
  const navigate = useNavigate();

  // Handle card click to navigate to symptom detail
  const handleSymptomClick = (symptom: Symptom) => {
    navigate(`/palliative/symptom-control/${symptom.id}`);
  };

  return (
    <div className="container mx-auto py-6">
      <SupabaseDataCards<Symptom>
        tableName="symptoms"
        title="Symptom Control Library"
        displayKeyField="symptom_name"
        descriptionField="description"
        colorMappings={{
          severity: severityColorMapping,
          status: statusColorMapping,
          category: categoryColorMapping
        }}
        defaultColorMapping="severity"
        fields={[          {
            key: 'severity',
            label: 'Severity',
            badge: true
          },
          {
            key: 'status',
            label: 'Status',
            badge: true
          },
          {
            key: 'category',
            label: 'Category',
            badge: true
          },
          {
            key: 'onset',
            label: 'Onset',
            format: (value) => value || 'Not specified'
          },
          {
            key: 'updated_at',
            label: 'Last Updated',
            format: (value) => (
              <div className="flex items-center gap-1 text-gray-500">
                <ClockIcon className="w-3.5 h-3.5" />
                <span>{value ? format(new Date(value), 'MMM d, yyyy') : 'Unknown'}</span>
              </div>
            )
          },          {
            key: 'hasRedFlags',
            visible: (_, data): boolean => !!(data.redFlags && data.redFlags.length > 0),
            format: () => (
              <div className="flex items-center gap-1 mt-1 text-red-600 dark:text-red-400">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">Has red flags</span>
              </div>
            )
          },
          {
            key: 'interventionCount',
            visible: (_, data) => {
              const pharm = data.suggestedInterventions?.pharmacological?.length || 0;
              const nonPharm = data.suggestedInterventions?.nonPharmacological?.length || 0;
              return pharm > 0 || nonPharm > 0;
            },
            format: (_, data) => {
              const pharm = data.suggestedInterventions?.pharmacological?.length || 0;
              const nonPharm = data.suggestedInterventions?.nonPharmacological?.length || 0;
              return (
                <div className="flex items-center gap-1 mt-1 text-gray-500">
                  <ActivityIcon className="w-3.5 h-3.5" />
                  <span className="text-xs">{pharm + nonPharm} interventions available</span>
                </div>
              );
            }
          }
        ]}
        onCardClick={handleSymptomClick}
        searchFields={['symptom_name', 'description', 'category']}
        additionalFilters=""
        limit={100}
        orderBy={{ column: 'updated_at', ascending: false }}
      />
    </div>
  );
};

export default SymptomDataCards;
