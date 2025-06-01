import React, { useState, useEffect } from 'react';
import { ChevronDown, AlertCircle, Loader2 } from 'lucide-react';
import { getAllToxicities, ToxicityData } from '@/services/toxicities';
import AlertBanner from '@/components/ui/AlertBanner';

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

const sanitizeToxicity = (data: Partial<ToxicityData>): ToxicityData => ({
  // Basic fields
  id: data.id || crypto.randomUUID(),
  name: data.name || 'Not specified',
  severity: data.severity || 'Not specified',
  grading_scale: data.grading_scale || 'CTCAE v5.0',
  recognition: data.recognition || 'Not specified',
  symptoms: Array.isArray(data.symptoms) ? data.symptoms : [],
  signs: Array.isArray(data.signs) ? data.signs : [],
  imaging: Array.isArray(data.imaging) ? data.imaging : [],
  labs: Array.isArray(data.labs) ? data.labs : [],
  clinical_category: data.clinical_category || 'Uncategorized',
  symptom_onset: data.symptom_onset || '',
  expected_onset: data.expected_onset || '',
  onset_timing_days: data.onset_timing_days || 0,
  reversibility: data.reversibility || 'Unknown',
  toxicity_type: data.toxicity_type || 'Unknown',
  is_dose_limiting: !!data.is_dose_limiting,
  requires_hospitalization: !!data.requires_hospitalization,
  toxicity_risk_factors: Array.isArray(data.toxicity_risk_factors) ? data.toxicity_risk_factors : [],
  
  // Arrays
  management: Array.isArray(data.management) ? data.management : [],
  dose_guidance: Array.isArray(data.dose_guidance) ? data.dose_guidance : [],
  culprit_drugs: Array.isArray(data.culprit_drugs) ? data.culprit_drugs : [],
  culprit_classes: Array.isArray(data.culprit_classes) ? data.culprit_classes : [],
  intervention_required: Array.isArray(data.intervention_required) ? data.intervention_required : [],
  monitoring_recommendations: Array.isArray(data.monitoring_recommendations) ? data.monitoring_recommendations : [],
  lab_triggers: Array.isArray(data.lab_triggers) ? data.lab_triggers : [],
  related_toxicity_ids: Array.isArray(data.related_toxicity_ids) ? data.related_toxicity_ids : [],

  // Special formats
  monitoring_frequency: {
    initial: data.monitoring_frequency?.initial || 'Not specified',
    followup: data.monitoring_frequency?.followup || 'Not specified',
    longterm: data.monitoring_frequency?.longterm || 'Not specified'
  },
  reference_data: data.reference_data || {},
  source_reference: data.source_reference || '',
  notes: data.notes || '',
  notes_clinical_pearls: data.notes_clinical_pearls || '',
  notes_ui_display: data.notes_ui_display || '',
  toxicity_score_weight: data.toxicity_score_weight || 0,

  // Timestamps
  created_at: data.created_at || new Date().toISOString(),
  updated_at: data.updated_at || new Date().toISOString()
});

const AccordionItem = ({ toxicity, isOpen, onToggle }: {
  toxicity: ToxicityData;
  isOpen: boolean;
  onToggle: () => void;
}) => (
  <div className={`bg-white/90 rounded-lg shadow-sm border-l-4 transition-all duration-200 ${getSeverityBorderColor(toxicity.severity)}`}>
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full px-3 py-2 text-left hover:bg-gray-50/50"
      aria-expanded={isOpen}
    >
      <div className="flex items-center gap-2">
        <span className="text-base font-medium text-gray-900">{toxicity.name}</span>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(toxicity.severity)}`}>
          {toxicity.severity}
        </span>
        {toxicity.is_dose_limiting && (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700">
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
              <h3 className="font-medium text-gray-900 mb-1">Causative Agents</h3>
              {toxicity.culprit_drugs.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-1">
                  {toxicity.culprit_drugs.map((drug, i) => (
                    <span key={i} className="px-2 py-0.5 text-xs bg-purple-50 text-purple-700 rounded-full">
                      {drug}
                    </span>
                  ))}
                </div>
              )}
              {toxicity.culprit_classes.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {toxicity.culprit_classes.map((cls, i) => (
                    <span key={i} className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded-full">
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openItem, setOpenItem] = useState<number | null>(null);

  useEffect(() => {
    async function fetchToxicities() {
      try {
        const data = await getAllToxicities();
        setToxicities(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(`Failed to load toxicity data: ${errorMessage}`);
        console.error('Error fetching toxicities:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchToxicities();
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b px-4 py-2">
        <h2 className="text-xl font-semibold text-gray-900">Toxicity Management</h2>
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
          ) : toxicities.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p>No toxicity data available</p>
            </div>
          ) : (
            <div className="h-full overflow-y-auto scrollbar-thin pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {toxicities.map((toxicity, index) => (
                  <AccordionItem
                    key={toxicity.id}
                    toxicity={toxicity}
                    isOpen={openItem === index}
                    onToggle={() => setOpenItem(openItem === index ? null : index)}
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
