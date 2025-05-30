import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Check,
  X,
  Info,
  HelpCircle,
  Plus,
  Minus,
  Book,
  Pill,
  HeartPulse,
  Activity,
  Beaker,
  Syringe,
  FileHeart,
  Shield,
  AlarmClock,
  NotebookPen,
  Bot,
  CalendarDays,
  Clock,
  ScrollText
} from 'lucide-react';
import { getSupergroups, getProtocols } from '@/services/protocols';
import type { Protocol, Drug } from './types/protocol';

type TabType = 
  | 'overview' 
  | 'eligibility'
  | 'treatment'
  | 'tests'
  | 'monitoring'
  | 'toxicity'
  | 'modifications'
  | 'pharmacology'
  | 'administration'
  | 'prepost'
  | 'rescue'
  | 'precautions'
  | 'ai'
  | 'info';

interface TabDefinition {
  id: TabType;
  label: string;
  color: string;
  hoverColor: string;
  icon: React.ReactNode;
}

interface ProtocolsByGroup {
  [key: string]: Protocol[];
}

const TABS: TabDefinition[] = [
  { 
    id: 'overview',
    label: 'Overview',
    color: 'bg-blue-500',
    hoverColor: 'hover:bg-blue-600',
    icon: <Info className="w-4 h-4" />
  },
  { 
    id: 'eligibility',
    label: 'Eligibility',
    color: 'bg-green-500',
    hoverColor: 'hover:bg-green-600',
    icon: <Check className="w-4 h-4" />
  },
  { 
    id: 'treatment',
    label: 'Treatment',
    color: 'bg-purple-500',
    hoverColor: 'hover:bg-purple-600',
    icon: <Pill className="w-4 h-4" />
  },
  { 
    id: 'tests',
    label: 'Tests',
    color: 'bg-amber-500',
    hoverColor: 'hover:bg-amber-600',
    icon: <Beaker className="w-4 h-4" />
  },
  { 
    id: 'monitoring',
    label: 'Monitoring',
    color: 'bg-cyan-500',
    hoverColor: 'hover:bg-cyan-600',
    icon: <Activity className="w-4 h-4" />
  },
  { 
    id: 'toxicity',
    label: 'Toxicity',
    color: 'bg-red-500',
    hoverColor: 'hover:bg-red-600',
    icon: <AlertTriangle className="w-4 h-4" />
  },
  { 
    id: 'modifications',
    label: 'Modifications',
    color: 'bg-yellow-500',
    hoverColor: 'hover:bg-yellow-600',
    icon: <FileHeart className="w-4 h-4" />
  },
  { 
    id: 'pharmacology',
    label: 'Pharmacology',
    color: 'bg-pink-500',
    hoverColor: 'hover:bg-pink-600',
    icon: <Syringe className="w-4 h-4" />
  },
  { 
    id: 'administration',
    label: 'Administration',
    color: 'bg-violet-500',
    hoverColor: 'hover:bg-violet-600',
    icon: <Clock className="w-4 h-4" />
  },
  { 
    id: 'prepost',
    label: 'Pre/Post Meds',
    color: 'bg-emerald-500',
    hoverColor: 'hover:bg-emerald-600',
    icon: <CalendarDays className="w-4 h-4" />
  },
  { 
    id: 'rescue',
    label: 'Rescue & Support',
    color: 'bg-rose-500',
    hoverColor: 'hover:bg-rose-600',
    icon: <Shield className="w-4 h-4" />
  },
  { 
    id: 'precautions',
    label: 'Precautions',
    color: 'bg-orange-500',
    hoverColor: 'hover:bg-orange-600',
    icon: <AlarmClock className="w-4 h-4" />
  },
  { 
    id: 'ai',
    label: 'AI Insights',
    color: 'bg-indigo-500',
    hoverColor: 'hover:bg-indigo-600',
    icon: <Bot className="w-4 h-4" />
  },
  { 
    id: 'info',
    label: 'Info & Metadata',
    color: 'bg-slate-500',
    hoverColor: 'hover:bg-slate-600',
    icon: <ScrollText className="w-4 h-4" />
  }
];

const AlertBanner: React.FC<{
  type: 'warning' | 'error' | 'success';
  title: string;
  message: string;
}> = ({ type, title, message }) => {
  const colors = {
    warning: 'bg-yellow-50 border-yellow-400 text-yellow-800',
    error: 'bg-red-50 border-red-400 text-red-800',
    success: 'bg-green-50 border-green-400 text-green-800'
  };

  return (
    <div className={`p-4 mb-4 border-l-4 rounded-r ${colors[type]}`}>
      <div className="flex items-center">
        {type === 'warning' && <AlertTriangle className="w-5 h-5 mr-2" />}
        {type === 'error' && <X className="w-5 h-5 mr-2" />}
        {type === 'success' && <Check className="w-5 h-5 mr-2" />}
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="mt-2">{message}</p>
    </div>
  );
};

const Accordion: React.FC<{
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border rounded-lg mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-lg"
      >
        <span className="font-semibold">{title}</span>
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 border-t">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DataTable: React.FC<{
  data: Drug[];
}> = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Drug Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dose</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Administration</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alternatives</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((drug, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{drug.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{drug.dose}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{drug.administration}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {drug.alternative_switches?.join(', ') || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TabContent: React.FC<{
  protocol: Protocol;
  activeTab: TabType;
}> = ({ protocol, activeTab }) => {
  const renderList = (items: any[] | undefined | null) => {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return <p className="text-gray-600">No information available</p>;
    }

    return (
      <ul className="list-disc list-inside space-y-2">
        {items.map((item, index) => (
          <li key={index} className="text-gray-700">
            {typeof item === 'string' ? (
              item
            ) : (
              <div>
                {/* Tests */}
                {item.test && (
                  <span>
                    <strong>{item.test}</strong>
                    {item.purpose && <span> — {item.purpose}</span>}
                    {item.frequency && <span> ({item.frequency})</span>}
                  </span>
                )}
                
                {/* Supportive Meds */}
                {item.name && (
                  <span>
                    <strong>{item.name}</strong>
                    {item.dose && <span> — {item.dose}</span>}
                    {item.timing && <span> at {item.timing}</span>}
                    {item.route && <span> via {item.route}</span>}
                  </span>
                )}

                {/* Rescue Agents */}
                {item.indication && (
                  <span>
                    <strong>{item.name}</strong>
                    {item.indication && <span> — {item.indication}</span>}
                    {item.dosing && <div className="ml-4 text-sm">{item.dosing}</div>}
                  </span>
                )}
                
                {/* Dose Modifications */}
                {item.criteria && (
                  <div>
                    <div><strong>Criteria:</strong> {item.criteria}</div>
                    {item.drug_a_reduction && <div className="ml-4">Drug A: {item.drug_a_reduction}</div>}
                    {item.drug_b_reduction && <div className="ml-4">Drug B: {item.drug_b_reduction}</div>}
                  </div>
                )}

                {/* Fallback for unknown object structures */}
                {!item.test && !item.name && !item.indication && !item.criteria && (
                  <span>{JSON.stringify(item)}</span>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  const content: Record<TabType, React.ReactNode> = {
    overview: (
      <div className="space-y-6">
        {protocol.eligibility?.exclusion_criteria && (
          <AlertBanner
            type="error"
            title="Exclusion Criteria"
            message={protocol.eligibility.exclusion_criteria.join(', ')}
          />
        )}
        
        <Accordion title="Eligibility Criteria" defaultOpen={true}>
          {renderList(protocol.eligibility?.inclusion_criteria)}
        </Accordion>

        <Accordion title="Exclusions">
          {renderList(protocol.eligibility?.exclusion_criteria)}
        </Accordion>
      </div>
    ),
    eligibility: (
      <div className="space-y-6">
        <Accordion title="Inclusion Criteria" defaultOpen={true}>
          {renderList(protocol.eligibility?.inclusion_criteria)}
        </Accordion>
        
        <Accordion title="Exclusion Criteria">
          {renderList(protocol.eligibility?.exclusion_criteria)}
        </Accordion>
      </div>
    ),
    tests: (
      <div className="space-y-6">
        <Accordion title="Baseline Tests" defaultOpen={true}>
          {renderList(protocol.tests?.baseline)}
        </Accordion>
        
        <Accordion title="Monitoring Tests">
          {renderList(protocol.tests?.monitoring)}
        </Accordion>
      </div>
    ),
    treatment: (
        <div className="space-y-6">
          {protocol.treatment && 'protocol' in protocol.treatment && (
            <div className="mb-6">
              <h4 className="font-semibold text-indigo-900 mb-2">Treatment Protocol</h4>
              <p className="text-gray-700">{(protocol.treatment as any).protocol}</p>
            </div>
          )}
  
          {protocol.treatment?.drugs && (
          <div>
            <h4 className="font-semibold text-indigo-900 mb-4">Treatment Details</h4>
            <DataTable data={protocol.treatment.drugs} />
          </div>
        )}
      </div>
    ),
    monitoring: (
      <div className="space-y-6">
        {protocol.toxicity_monitoring && (
          <div className="bg-orange-50 rounded-lg p-4 mb-6">
            <h4 className="text-lg font-semibold text-orange-900 mb-2">Toxicity Monitoring</h4>
            <div className="space-y-4">
              <div>
                <h5 className="font-medium text-orange-800 mb-2">Parameters to Monitor</h5>
                {renderList(protocol.toxicity_monitoring.parameters)}
              </div>
              {protocol.toxicity_monitoring.frequency && (
                <p className="text-orange-800">
                  <span className="font-medium">Frequency:</span> {protocol.toxicity_monitoring.frequency}
                </p>
              )}
              {Object.keys(protocol.toxicity_monitoring.thresholds).length > 0 && (
                <div>
                  <h5 className="font-medium text-orange-800 mb-2">Threshold Values</h5>
                  <pre className="whitespace-pre-wrap text-sm text-orange-700">
                    {JSON.stringify(protocol.toxicity_monitoring.thresholds, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {protocol.monitoring && (
          <>
            <Accordion title="Baseline Monitoring" defaultOpen={true}>
              {renderList(protocol.monitoring.baseline)}
            </Accordion>
            <Accordion title="Ongoing Monitoring">
              {renderList(protocol.monitoring.ongoing)}
            </Accordion>
            {protocol.monitoring.frequency && (
              <div className="bg-orange-50 p-4 rounded-lg">
                <h5 className="font-medium text-orange-800">Monitoring Frequency</h5>
                <p className="mt-1 text-orange-700">{protocol.monitoring.frequency}</p>
              </div>
            )}
          </>
        )}

        {protocol.ai_notes && (
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-purple-900 mb-4">AI Monitoring Recommendations</h4>
            {protocol.ai_notes.recommendations && (
              <Accordion title="Recommendations">
                {renderList(protocol.ai_notes.recommendations)}
              </Accordion>
            )}
            {protocol.ai_notes.warnings && (
              <Accordion title="Warnings">
                {renderList(protocol.ai_notes.warnings)}
              </Accordion>
            )}
          </div>
        )}
      </div>
    ),
    toxicity: (
      <div className="space-y-6">
        {protocol.toxicity_monitoring && (
          <Accordion title="Toxicity Monitoring" defaultOpen={true}>
            {renderList(protocol.toxicity_monitoring?.parameters)}
          </Accordion>
        )}
      </div>
    ),
    modifications: (
      <div className="space-y-6">
        {protocol.dose_modifications?.hematological && (
          <Accordion title="Hematological Modifications" defaultOpen={true}>
            {renderList(protocol.dose_modifications.hematological)}
          </Accordion>
        )}
        
        {protocol.dose_modifications?.nonHematological && (
          <Accordion title="Non-Hematological Modifications">
            {renderList(protocol.dose_modifications.nonHematological)}
          </Accordion>
        )}
        
        {protocol.dose_modifications?.renal && (
          <Accordion title="Renal Modifications">
            {renderList(protocol.dose_modifications.renal)}
          </Accordion>
        )}
        
        {protocol.dose_modifications?.hepatic && (
          <Accordion title="Hepatic Modifications">
            {renderList(protocol.dose_modifications.hepatic)}
          </Accordion>
        )}
      </div>
    ),
    pharmacology: (
      <div className="space-y-6">
        {protocol.drug_class && (
          <div className="bg-pink-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-pink-900 mb-2">Drug Classification</h4>
            <div className="space-y-2">
              {protocol.drug_class.name && (
                <p className="text-pink-800">
                  <span className="font-medium">Class:</span> {protocol.drug_class.name}
                </p>
              )}
              {protocol.drug_class.mechanism && (
                <p className="text-pink-800">
                  <span className="font-medium">Mechanism:</span> {protocol.drug_class.mechanism}
                </p>
              )}
              {protocol.drug_class.classification && (
                <p className="text-pink-800">
                  <span className="font-medium">Classification:</span> {protocol.drug_class.classification}
                </p>
              )}
            </div>
          </div>
        )}

        <Accordion title="Pharmacokinetics" defaultOpen={true}>
          <pre className="whitespace-pre-wrap text-sm">
            {JSON.stringify(protocol.pharmacokinetics, null, 2)}
          </pre>
        </Accordion>

        {protocol.interactions && (
          <div className="space-y-4">
            <Accordion title="Drug Interactions">
              {renderList(protocol.interactions.drugs)}
            </Accordion>
            <Accordion title="Contraindications">
              {renderList(protocol.interactions.contraindications)}
            </Accordion>
            <Accordion title="Special Precautions">
              {renderList(protocol.interactions.precautions)}
            </Accordion>
          </div>
        )}

        {protocol.administration_notes && (
          <Accordion title="Administration Notes">
            {renderList(protocol.administration_notes)}
          </Accordion>
        )}
      </div>
    ),
    administration: (
      <div className="space-y-6">
        {protocol.administration_notes && (
          <Accordion title="Administration Notes" defaultOpen={true}>
            {renderList(protocol.administration_notes)}
          </Accordion>
        )}
      </div>
    ),
    prepost: (
      <div className="space-y-6">
        {protocol.pre_medications && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-teal-900 mb-4">Pre-medications</h4>
            <Accordion title="Required Pre-medications" defaultOpen={true}>
              <DataTable data={protocol.pre_medications.required} />
            </Accordion>
            <Accordion title="Optional Pre-medications">
              <DataTable data={protocol.pre_medications.optional} />
            </Accordion>
          </div>
        )}

        {protocol.post_medications && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-teal-900 mb-4">Post-medications</h4>
            <Accordion title="Required Post-medications">
              <DataTable data={protocol.post_medications.required} />
            </Accordion>
            <Accordion title="Optional Post-medications">
              <DataTable data={protocol.post_medications.optional} />
            </Accordion>
          </div>
        )}
      </div>
    ),
    rescue: (
      <div className="space-y-6">
        {protocol.rescue_agents && protocol.rescue_agents.length > 0 && (
          <div className="bg-teal-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-teal-900 mb-4">Rescue Agents</h4>
            <div className="divide-y divide-teal-200">
              {protocol.rescue_agents.map((agent: { name: string; indication: string; dosing: string }, idx: number) => (
                <div key={idx} className="py-3">
                  <h5 className="font-medium text-teal-800">{agent.name}</h5>
                  <p className="text-sm text-teal-700 mt-1"><span className="font-medium">Indication:</span> {agent.indication}</p>
                  <p className="text-sm text-teal-700 mt-1"><span className="font-medium">Dosing:</span> {agent.dosing}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {protocol.supportive_meds && protocol.supportive_meds.length > 0 && (
          <div className="bg-teal-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-teal-900 mb-4">Supportive Medications</h4>
            <DataTable data={protocol.supportive_meds} />
          </div>
        )}
      </div>
    ),
    precautions: (
      <div className="space-y-6">
        {protocol.precautions && protocol.precautions.length > 0 && (
          <AlertBanner
            type="warning"
            title="Precautions"
            message={protocol.precautions.join(', ')}
          />
        )}
        
        <Accordion title="Precautions" defaultOpen={true}>
          {renderList(protocol.precautions)}
        </Accordion>
        
        <Accordion title="References">
          {renderList(protocol.reference_list)}
        </Accordion>
      </div>
    ),
    ai: (
      <div className="space-y-6">
        {protocol.ai_notes && (
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-purple-900 mb-4">AI Insights</h4>
            {protocol.ai_notes.recommendations && (
              <Accordion title="Recommendations" defaultOpen={true}>
                {renderList(protocol.ai_notes.recommendations)}
              </Accordion>
            )}
            {protocol.ai_notes.warnings && (
              <Accordion title="Warnings">
                {renderList(protocol.ai_notes.warnings)}
              </Accordion>
            )}
          </div>
        )}
      </div>
    ),
    info: (
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Protocol Information</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Code</p>
              <p className="font-medium">{protocol.code}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tumor Group</p>
              <p className="font-medium">{protocol.tumour_group}</p>
            </div>
            {protocol.treatment_intent && (
              <div>
                <p className="text-sm text-gray-600">Treatment Intent</p>
                <p className="font-medium">{protocol.treatment_intent}</p>
              </div>
            )}
            {protocol.version && (
              <div>
                <p className="text-sm text-gray-600">Version</p>
                <p className="font-medium">{protocol.version}</p>
              </div>
            )}
            {protocol.last_reviewed && (
              <div>
                <p className="text-sm text-gray-600">Last Reviewed</p>
                <p className="font-medium">{protocol.last_reviewed}</p>
              </div>
            )}
          </div>
        </div>
        
        {protocol.reference_list && protocol.reference_list.length > 0 && (
          <Accordion title="References" defaultOpen={true}>
            {renderList(protocol.reference_list)}
          </Accordion>
        )}
      </div>
    )
  };

  return (
    <motion.div
      key={activeTab}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="p-6"
    >
      {content[activeTab]}
    </motion.div>
  );
};

const ProtocolCard: React.FC<{
  protocol: Protocol;
  onClick: () => void;
}> = ({ protocol, onClick }) => {
  return (
    <motion.div
      className="relative border p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-indigo-50 to-indigo-100 cursor-pointer"
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
    >
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-indigo-800">{protocol.code}</h3>
        <p className="text-gray-600 text-sm">{protocol.tumour_group}</p>
      </div>
      
      <div className="space-y-2 mb-4">
        {protocol.treatment_intent && (
          <p className="text-gray-700 text-sm">
            <span className="font-medium">Intent:</span> {protocol.treatment_intent}
          </p>
        )}
        {protocol.treatment?.drugs && protocol.treatment.drugs.length > 0 && (
          <p className="text-gray-700 text-sm">
            <span className="font-medium">Drugs:</span>{' '}
            {protocol.treatment.drugs.map((drug: Drug) => drug.name).join(', ')}
          </p>
        )}
      </div>

      <button className="w-full mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
        View Details
      </button>
    </motion.div>
  );
};

const TreatmentProtocols: React.FC = () => {
  const [supergroups, setSupergroups] = useState<string[]>([]);
  const [selectedSupergroup, setSelectedSupergroup] = useState<string | null>(null);
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch supergroups on mount
  useEffect(() => {
    const fetchSupergroups = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getSupergroups();
        setSupergroups(data);
      } catch (err) {
        setError('Failed to load tumour supergroups.');
      } finally {
        setLoading(false);
      }
    };
    fetchSupergroups();
  }, []);

  // Fetch protocols for selected supergroup
  useEffect(() => {
    if (selectedSupergroup) {
      const fetchProtocols = async () => {
        try {
          setLoading(true);
          setError(null);
          const data = await getProtocols({ tumorGroup: selectedSupergroup, drugName: null, treatmentIntent: null });
          setProtocols(data);
        } catch (err) {
          setError('Failed to load protocols for this supergroup.');
        } finally {
          setLoading(false);
        }
      };
      fetchProtocols();
    }
  }, [selectedSupergroup]);

  const handleBack = () => {
    if (selectedProtocol) {
      setSelectedProtocol(null);
    } else if (selectedSupergroup) {
      setSelectedSupergroup(null);
      setProtocols([]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32 text-indigo-600">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-300 rounded-lg bg-red-50 text-red-700">
        {error}
        <button
          onClick={handleBack}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Back
        </button>
      </div>
    );
  }

  if (selectedProtocol) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Protocols
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-indigo-900">
              {selectedProtocol.code}
            </h2>
            {selectedProtocol.treatment_intent && (
              <p className="text-gray-600 mt-1">
                Intent: {selectedProtocol.treatment_intent}
              </p>
            )}
          </div>
          <div className="flex space-x-1 p-2 bg-gray-50">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-md text-white transition-colors duration-200 flex items-center space-x-2 ${
                  activeTab === tab.id ? `${tab.color}` : 'bg-gray-400'
                } ${tab.hoverColor}`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <TabContent protocol={selectedProtocol} activeTab={activeTab} />
          </AnimatePresence>
        </div>
      </div>
    );
  }

  if (!selectedSupergroup) {
    // Step 1: Show supergroups
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-indigo-900 mb-8">Select Tumour Supergroup</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {supergroups.map((sg) => (
            <div
              key={sg}
              className="cursor-pointer p-6 rounded-xl shadow-md bg-gradient-to-br from-indigo-50 to-indigo-100 hover:bg-indigo-200 transition"
              onClick={() => setSelectedSupergroup(sg)}
            >
              <h2 className="text-xl font-bold text-indigo-900">{sg}</h2>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Step 2: Show protocols for selected supergroup
  if (selectedSupergroup && !selectedProtocol) {
    return (
      <div className="space-y-8">
        <button
          onClick={handleBack}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Supergroups
        </button>
        <h1 className="text-3xl font-bold text-indigo-900 mb-8">Protocols in {selectedSupergroup}</h1>
        {protocols.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
            No protocols found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {protocols.map((protocol) => (
              <UnifiedProtocolCard key={protocol.code} protocol={protocol} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default TreatmentProtocols;
