import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calculator, 
  AlertTriangle, 
  ClipboardList, 
  Activity, 
  Thermometer, 
  ShieldAlert, 
  Brain, 
  Clock,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import ToolCard from './components/ToolCard';

const Tools: React.FC = () => {
  const navigate = useNavigate();

  const handleOpenTool = (id: string) => {
    if (id === 'calculators') {
      navigate('/tools/calculators');
      return;
    }
    if (id === 'redflags') {
      navigate('/tools/redflags');
      return;
    }
    navigate(`/tools/${id}`);
  };

  const tools = [
    {
      id: 'calculators',
      title: 'Clinical Calculators',
      description: 'BSA, CrCl, ANC, and Carboplatin (Calvert).',
      icon: Calculator
    },
    {
      id: 'redflags',
      title: 'Red Flags & Emergencies',
      description: 'Neutropenic Fever, TLS, SCC, and Hypercalcemia.',
      icon: AlertTriangle
    },
    {
      id: 'quickguides',
      title: 'Symptom Control Guides',
      description: 'Pain Ladder, Anti-emetics (Coming Soon).',
      icon: ClipboardList,
      isComingSoon: true
    },
    {
      id: 'emergencyregimens',
      title: 'Emergency Regimens',
      description: 'Antibiotic protocols (Coming Soon).',
      icon: ShieldAlert,
      isComingSoon: true
    },
    {
      id: 'labs',
      title: 'Important Labs Reference',
      description: 'Reference values, tumor markers (Coming Soon).',
      icon: Thermometer,
      isComingSoon: true
    },
    {
      id: 'cognitive',
      title: 'Cognitive Tools',
      description: 'MMSE, GCS, Delirium screening (Coming Soon).',
      icon: Brain,
      isComingSoon: true
    },
    {
      id: 'toxicities',
      title: 'Treatment Toxicities',
      description: 'CTCAE grading, toxicity alerts (Coming Soon).',
      icon: Activity,
      isComingSoon: true
    },
    {
      id: 'reminders',
      title: 'Scheduling & Reminders',
      description: 'Follow-up calendars, lab trackers (Coming Soon).',
      icon: Clock,
      isComingSoon: true
    }
  ];

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">🛠️ Tools Hub</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Clinical decision support and reference tools.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/handbook/medical-oncology')}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition border border-indigo-200 dark:border-indigo-800 shadow-sm"
          >
            <BookOpen className="w-4 h-4" />
            <span className="text-sm font-semibold">Oncology Handbook</span>
            <ExternalLink className="w-3 h-3 opacity-50" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {tools.map((tool) => (
          <ToolCard
            key={tool.id}
            title={tool.title}
            description={tool.description}
            icon={tool.icon}
            onClick={() => handleOpenTool(tool.id)}
            status={tool.isComingSoon ? "Coming Soon" : undefined}
          />
        ))}
      </div>

      {/* Quick Launch / Documentation Section */}
      <div className="mt-12 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-500" />
          Clinical Governance & Safety
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Standardized Calculations</h3>
            <p className="text-xs text-gray-500 mt-1">All calculators utilize peer-reviewed formulas (Mosteller, Cockcroft-Gault) with validated unit conversion safety buffers.</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Emergency Protocols</h3>
            <p className="text-xs text-gray-500 mt-1">High-risk management steps for oncology emergencies are synchronized with the Medical Oncology Handbook.</p>
          </div>
        </div>
        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-800 dark:text-amber-300 font-medium">
            Clinical decision support only. Verify calculations, units, and institutional protocols before use.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Tools;
