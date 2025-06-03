/**
 * This is a clinical decision-support UI for oncology professionals to view population-level screening guidelines.
 * Do not include any EHR features or patient data.
 * 
 * Supabase table: screening_guidelines
 * CREATE TABLE screening_guidelines (
 *   id UUID PRIMARY KEY,
 *   cancer_type TEXT,
 *   population TEXT,
 *   starting_age TEXT,
 *   modality TEXT,
 *   frequency TEXT,
 *   notes TEXT,
 *   guideline_source TEXT
 * );
 */

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, Database, ChevronDown } from 'lucide-react';
import { getSupabase } from '@/lib/supabaseClient';

// Strict TypeScript interface for screening guidelines
interface ScreeningGuideline {
  id: string;
  cancer_type: string;
  population: string;
  starting_age: string;
  modality: string;
  frequency: string;
  notes: string;
  guideline_source: string;
}

// Component for expandable notes
const ExpandableNotes: React.FC<{ notes: string; maxLength?: number }> = ({ 
  notes, 
  maxLength = 100 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!notes || notes.length <= maxLength) {
    return <p className="text-sm text-gray-600 dark:text-gray-400">{notes || 'No additional notes'}</p>;
  }
  
  return (
    <div>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {isExpanded ? notes : `${notes.substring(0, maxLength)}...`}
      </p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 
                   flex items-center gap-1 transition-colors duration-150"
        aria-label={isExpanded ? 'Show less' : 'Show more'}
      >
        {isExpanded ? 'Show less' : 'Show more'}
        <ChevronDown 
          className={`h-3 w-3 transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`} 
        />
      </button>
    </div>
  );
};

// Individual screening guideline card component
const GuidelineCard: React.FC<{ 
  guideline: ScreeningGuideline; 
  index: number;
}> = ({ guideline, index }) => {
  return (
    <div
      className={`
        p-6 rounded-lg border transition-all duration-200 hover:shadow-md
        ${index % 2 === 0 
          ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700' 
          : 'bg-gray-50 dark:bg-gray-750 border-gray-200 dark:border-gray-600'
        }
        hover:border-blue-300 dark:hover:border-blue-600
      `}
    >
      {/* Cancer Type Header */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize mb-1">
          {guideline.cancer_type}
        </h3>
        <div className="h-1 w-12 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
      </div>

      {/* Main Information Grid */}
      <div className="space-y-4">
        {/* Population */}
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-5 h-5 mt-0.5 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
          </div>
          <div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Population
            </span>
            <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">
              {guideline.population}
            </p>
          </div>
        </div>

        {/* Starting Age */}
        {guideline.starting_age && (
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-5 h-5 mt-0.5 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full"></div>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Starting Age
              </span>
              <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                {guideline.starting_age}
              </p>
            </div>
          </div>
        )}

        {/* Modality */}
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-5 h-5 mt-0.5 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full"></div>
          </div>
          <div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Screening Modality
            </span>
            <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">
              {guideline.modality}
            </p>
          </div>
        </div>

        {/* Frequency */}
        {guideline.frequency && (
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-5 h-5 mt-0.5 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
              <Clock className="w-3 h-3 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Frequency
              </span>
              <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                {guideline.frequency}
              </p>
            </div>
          </div>
        )}

        {/* Notes */}
        {guideline.notes && (
          <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-2">
              Clinical Notes
            </span>
            <ExpandableNotes notes={guideline.notes} maxLength={120} />
          </div>
        )}
      </div>

      {/* Source Badge */}
      {guideline.guideline_source && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium 
                          bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            <Database className="w-3 h-3 mr-1.5" />
            {guideline.guideline_source}
          </div>
        </div>
      )}
    </div>
  );
};

const CancerScreening: React.FC = () => {
  const [guidelines, setGuidelines] = useState<ScreeningGuideline[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch screening guidelines from Supabase
  useEffect(() => {
    const fetchGuidelines = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const supabase = getSupabase();
        const { data, error: fetchError } = await supabase
          .from('screening_guidelines')
          .select('*')
          .order('cancer_type', { ascending: true });

        if (fetchError) {
          throw new Error(`Failed to fetch screening guidelines: ${fetchError.message}`);
        }

        setGuidelines(data || []);
      } catch (err) {
        console.error('Error fetching screening guidelines:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchGuidelines();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-3">
                <Clock className="animate-spin h-6 w-6 text-blue-600 dark:text-blue-400" />
                <span className="text-lg text-gray-700 dark:text-gray-300">
                  Loading screening guidelines...
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
            <div className="flex items-center space-x-3 text-red-600 dark:text-red-400">
              <AlertTriangle className="h-6 w-6" />
              <div>
                <h3 className="text-lg font-semibold">Unable to Load Guidelines</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {error}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Database className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Cancer Screening Guidelines
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Evidence-based screening recommendations for cancer prevention and early detection.
            This reference tool displays population-level guidelines for clinical decision support.
          </p>
        </div>        {/* Guidelines Cards */}
        {guidelines.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
            <Database className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              No Guidelines Found
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              No screening guidelines are currently available in the database.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Screening Guidelines ({guidelines.length} recommendations)
                </h2>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {guidelines.map((guideline, index) => (
                <GuidelineCard
                  key={guideline.id}
                  guideline={guideline}
                  index={index}
                />
              ))}
            </div>
          </>
        )}

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Guidelines are for reference only and should be used in conjunction with clinical judgment.
            Always consult current professional guidelines and institutional protocols.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CancerScreening;
