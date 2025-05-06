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
  id: data.id || crypto.randomUUID(),
  name: data.name || 'Not specified',
  severity: data.severity || 'Not specified',
  recognition: data.recognition || 'Not specified',
  management: Array.isArray(data.management) ? data.management : [],
  doseGuidance: Array.isArray(data.doseGuidance) ? data.doseGuidance : [],
  culpritDrugs: Array.isArray(data.culpritDrugs) ? data.culpritDrugs : []
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
    >
      <div className="flex items-center gap-2">
        <span className="text-base font-medium text-gray-900">{toxicity.name}</span>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(toxicity.severity)}`}>
          {toxicity.severity}
        </span>
      </div>
      <ChevronDown 
        className={`h-4 w-4 text-gray-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
      />
    </button>
    
    {isOpen && (
      <div className="px-3 pb-2 text-sm">
        <div className="space-y-2 pt-1">
          <section>
            <h3 className="font-medium text-gray-900 mb-1">Recognition</h3>
            <p className="leading-snug text-gray-700">{toxicity.recognition}</p>
          </section>

          <section>
            <h3 className="font-medium text-gray-900 mb-1">Management</h3>
            <ul className="list-disc pl-4 space-y-0.5">
              {toxicity.management.map((step, i) => (
                <li key={i} className="text-gray-700 leading-snug">{step}</li>
              ))}
            </ul>
          </section>

          {toxicity.doseGuidance.length > 0 && (
            <section>
              <h3 className="font-medium text-gray-900 mb-1">Dose Guidance</h3>
              <div className="space-y-0.5">
                {toxicity.doseGuidance.map((guide, i) => (
                  <p key={i} className="leading-snug text-gray-700">{guide}</p>
                ))}
              </div>
            </section>
          )}

          {toxicity.culpritDrugs.length > 0 && (
            <section>
              <h3 className="font-medium text-gray-900 mb-1">Responsible Drugs</h3>
              <div className="flex flex-wrap gap-1">
                {toxicity.culpritDrugs.slice(0, 3).map((drug, i) => (
                  <span key={i} className="px-2 py-0.5 text-xs bg-purple-50 text-purple-700 rounded-full">
                    {drug}
                  </span>
                ))}
                {toxicity.culpritDrugs.length > 3 && (
                  <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full">
                    +{toxicity.culpritDrugs.length - 3} more
                  </span>
                )}
              </div>
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
