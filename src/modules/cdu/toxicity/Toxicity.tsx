import React, { useState, useEffect, useMemo } from 'react';
import { ChevronDown, AlertCircle, Loader2, Search, Filter, ExternalLink } from 'lucide-react';
import { getAllToxicities, ToxicityData } from '@/services/toxicities';
import { getAllMedications } from '@/services/medications';
import type { Medication } from '../types';
import AlertBanner from '@/components/ui/AlertBanner';
import { processToxicities, FilterType } from './toxicityFilters';

const getSeverityColor = (severity: string) => {
  if (severity.includes('4')) return 'bg-red-100 text-red-800';
  if (severity.includes('3')) return 'bg-orange-100 text-orange-800';
  if (severity.includes('2')) return 'bg-yellow-100 text-yellow-800';
  return 'bg-green-100 text-green-800';
};

const getSeverityBorderColor = (severity: string) => {
  if (severity.includes('4')) return 'border-red-500';
  if (severity.includes('3')) return 'border-orange-500';
  if (severity.includes('2')) return 'border-yellow-500';
  return 'border-green-500';
};

const MedicationLink = ({ 
  name, 
  allMedications 
}: { 
  name: string; 
  allMedications: Medication[] 
}) => {
  // Deterministic matching: exact case-insensitive match on generic name
  const match = allMedications.find(
    (m) => m.name.toLowerCase() === name.toLowerCase()
  );

  if (!match) {
    return (
      <span className="px-2 py-0.5 text-xs bg-purple-50 text-purple-700 rounded-full border border-purple-100">
        {name}
      </span>
    );
  }

  const handleLink = (e: React.MouseEvent) => {
    e.preventDefault();
    // Navigate using URL parameter as supported by MedicationsView.tsx
    const url = new URL(window.location.href);
    url.searchParams.set('tab', 'medications'); // Hint for parent if nested
    url.searchParams.set('med', match.id);
    window.history.pushState({}, '', url.toString());
    // Trigger a popstate event to let the app know the URL changed
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <button
      onClick={handleLink}
      title="Open medication reference"
      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200 hover:bg-indigo-100 transition-colors"
    >
      {name}
      <ExternalLink className="h-3 w-3" />
    </button>
  );
};

const AccordionItem = ({ toxicity, isOpen, onToggle, allMedications }: {
  toxicity: ToxicityData;
  isOpen: boolean;
  onToggle: () => void;
  allMedications: Medication[];
}) => (
  <div className={`bg-white/90 rounded-lg shadow-sm border-l-4 transition-all duration-200 ${getSeverityBorderColor(toxicity.severity)}`}>
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full px-3 py-2 text-left hover:bg-gray-50/50"
      aria-expanded={isOpen ? 'true' : 'false'}
    >
      <div className="flex items-center gap-2">
        <span className="text-base font-medium text-gray-900">{toxicity.name}</span>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(toxicity.severity)}`}>
          {toxicity.severity}
        </span>
        {toxicity.is_dose_limiting && (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
            DLT
          </span>
        )}
      </div>
      <ChevronDown 
        className={`h-4 w-4 text-gray-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
      />
    </button>
    
    {isOpen && (
      <div className="px-3 pb-3 text-sm">
        <div className="space-y-3 pt-1">
          {/* Safety Hardening: Emergency and Hospitalization Flags */}
          {toxicity.severity.includes('4') && (
            <div className="p-2 mb-1 bg-red-50 border border-red-200 rounded text-red-700 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <p className="font-semibold leading-tight">
                Grade 4 toxicity may represent a medical emergency. Urgent clinician review required.
              </p>
            </div>
          )}
          
          {toxicity.requires_hospitalization && (
            <div className="p-2 mb-1 bg-orange-50 border border-orange-200 rounded text-orange-700 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <p className="font-semibold leading-tight">
                Hospital-level assessment may be required &mdash; follow institutional emergency pathway.
              </p>
            </div>
          )}

          {/* Clinical Details */}
          <section>
            <h3 className="font-medium text-gray-900 mb-1">Clinical Details</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Category:</span>
                <span className="ml-1 text-gray-900">{toxicity.clinical_category}</span>
              </div>
              <div>
                <span className="text-gray-500">Grade:</span>
                <span className="ml-1 text-gray-900">{toxicity.grading_scale}</span>
              </div>
              <div>
                <span className="text-gray-500">Onset:</span>
                <span className="ml-1 text-gray-900">{toxicity.expected_onset}</span>
              </div>
              <div>
                <span className="text-gray-500">Reversibility:</span>
                <span className="ml-1 text-gray-900">{toxicity.reversibility}</span>
              </div>
            </div>
          </section>

          {/* Recognition & Symptoms */}
          <section>
            <h3 className="font-medium text-gray-900 mb-1">Recognition</h3>
            <p className="leading-snug text-gray-700 mb-2">{toxicity.recognition}</p>
            
            {toxicity.symptoms.length > 0 && (
              <div className="mt-2">
                <h4 className="text-sm font-medium text-gray-700">Symptoms</h4>
                <ul className="list-disc pl-4 space-y-0.5">
                  {toxicity.symptoms.map((symptom, i) => (
                    <li key={i} className="text-gray-600">{symptom}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* Management */}
          <section>
            <h3 className="font-medium text-gray-900 mb-1">Management</h3>
            <ul className="list-disc pl-4 space-y-0.5">
              {toxicity.management.map((step, i) => (
                <li key={i} className="text-gray-700 leading-snug">{step}</li>
              ))}
            </ul>
          </section>

          {/* Monitoring */}
          {toxicity.monitoring_recommendations.length > 0 && (
            <section>
              <h3 className="font-medium text-gray-900 mb-1">Monitoring</h3>
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500 block">Initial:</span>
                    <span className="text-gray-900">{toxicity.monitoring_frequency.initial}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Follow-up:</span>
                    <span className="text-gray-900">{toxicity.monitoring_frequency.followup}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Long-term:</span>
                    <span className="text-gray-900">{toxicity.monitoring_frequency.longterm}</span>
                  </div>
                </div>
                <ul className="list-disc pl-4 space-y-0.5 mt-2">
                  {toxicity.monitoring_recommendations.map((rec, i) => (
                    <li key={i} className="text-gray-700 leading-snug">{rec}</li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* Laboratory & Imaging */}
          {(toxicity.labs.length > 0 || toxicity.imaging.length > 0) && (
            <section>
              <h3 className="font-medium text-gray-900 mb-1">Investigations</h3>
              {toxicity.labs.length > 0 && (
                <div className="mb-2">
                  <h4 className="text-sm font-medium text-gray-700">Laboratory Tests</h4>
                  <ul className="list-disc pl-4 space-y-0.5">
                    {toxicity.labs.map((lab, i) => (
                      <li key={i} className="text-gray-600">{lab}</li>
                    ))}
                  </ul>
                </div>
              )}
              {toxicity.imaging.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Imaging</h4>
                  <ul className="list-disc pl-4 space-y-0.5">
                    {toxicity.imaging.map((img, i) => (
                      <li key={i} className="text-gray-600">{img}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          {/* Dose Modification */}
          {toxicity.dose_guidance.length > 0 && (
            <section>
              <h3 className="font-medium text-gray-900 mb-1">Dose Modification</h3>
              <div className="space-y-0.5">
                {toxicity.dose_guidance.map((guide, i) => (
                  <p key={i} className="leading-snug text-gray-700">{guide}</p>
                ))}
              </div>
            </section>
          )}

          {/* Causative Agents */}
          {(toxicity.culprit_drugs.length > 0 || toxicity.culprit_classes.length > 0) && (
            <section>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-gray-900">Causative Agents</h3>
                <span className="text-[10px] text-gray-400 font-normal italic text-right">
                  Medication links are for reference only. Verify drug, dose, and protocol before clinical use.
                </span>
              </div>
              {toxicity.culprit_drugs.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-1">
                  {toxicity.culprit_drugs.map((drug, i) => (
                    <MedicationLink 
                      key={i} 
                      name={drug} 
                      allMedications={allMedications} 
                    />
                  ))}
                </div>
              )}
              {toxicity.culprit_classes.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {toxicity.culprit_classes.map((cls, i) => (
                    <span key={i} className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                      {cls}
                    </span>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Clinical Notes */}
          {toxicity.notes_clinical_pearls && (
            <section>
              <h3 className="font-medium text-gray-900 mb-1">Clinical Pearls</h3>
              <p className="text-gray-700 leading-snug whitespace-pre-wrap">
                {toxicity.notes_clinical_pearls}
              </p>
            </section>
          )}
        </div>
      </div>
    )}
  </div>
);

/**
 * Toxicity component displays information about various toxicities
 * related to oncology treatments and provides management guidance
 */
const Toxicity = () => {
  const [toxicities, setToxicities] = useState<ToxicityData[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openItem, setOpenItem] = useState<string | null>(null);
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');

  useEffect(() => {
    async function fetchData() {
      try {
        const [toxData, medData] = await Promise.all([
          getAllToxicities(),
          getAllMedications()
        ]);
        setToxicities(toxData);
        setMedications(medData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(`Failed to load data: ${errorMessage}`);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Filtering and Prioritization Logic using extracted helper
  const processedToxicities = useMemo(() => {
    return processToxicities(toxicities, searchQuery, filterType);
  }, [toxicities, searchQuery, filterType]);

  return (
    <div className="h-screen flex flex-col">
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b px-4 py-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <h2 className="text-xl font-semibold text-gray-900">Toxicity Management</h2>
          <div className="bg-amber-50 border border-amber-200 px-3 py-1 rounded-md flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
            <p className="text-xs text-amber-800 font-medium leading-tight">
              Clinical decision support only. Verify toxicity grading, patient status, and institutional protocols before clinical use.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50/50 border-b px-4 py-3 space-y-3">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by toxicity, drug, or category..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <Filter className="h-4 w-4 text-gray-400 shrink-0" />
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                filterType === 'all' ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              All Toxicities
            </button>
            <button
              onClick={() => setFilterType('high-grade')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                filterType === 'high-grade' ? 'bg-red-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Grade 4 Only
            </button>
            <button
              onClick={() => setFilterType('hospital')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                filterType === 'hospital' ? 'bg-orange-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Hospital Req
            </button>
            <button
              onClick={() => setFilterType('dlt')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                filterType === 'dlt' ? 'bg-purple-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              DLT Risk
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full p-4">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-6 w-6 text-indigo-600 animate-spin" />
            </div>
          ) : error ? (
            <AlertBanner 
              type="error"
              title="Error Loading Data"
              message={error}
            />
          ) : processedToxicities.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 animate-in fade-in duration-300">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p className="font-medium">No toxicities match the current search/filter.</p>
              <button 
                onClick={() => {setSearchQuery(''); setFilterType('all');}}
                className="mt-4 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="h-full overflow-y-auto scrollbar-thin pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-8">
                {processedToxicities.map((toxicity) => (
                  <AccordionItem
                    key={toxicity.id}
                    toxicity={toxicity}
                    allMedications={medications}
                    isOpen={openItem === toxicity.id}
                    onToggle={() => setOpenItem(openItem === toxicity.id ? null : toxicity.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Toxicity;
