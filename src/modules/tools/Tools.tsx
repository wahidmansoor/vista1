import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, AlertTriangle, ClipboardList, Activity, Thermometer, ShieldAlert, Brain, Clock } from 'lucide-react';
import ToolCard from './components/ToolCard';

const Tools: React.FC = () => {
  const navigate = useNavigate();

  const handleOpenTool = (id: string) => {
    navigate(`/tools/${id}`);
  };

  const tools = [
    {
      id: 'calculators',
      title: 'Clinical Calculators',
      description: 'BSA, CrCl, ANC, Corrected Calcium, BMI, and more.',
      icon: Calculator
    },
    {
      id: 'redflags',
      title: 'Red Flags & Emergencies',
      description: 'Neutropenic Fever, Hypercalcemia, TLS, Spinal Cord Compression.',
      icon: AlertTriangle
    },
    {
      id: 'quickguides',
      title: 'Symptom Control Quick Guides',
      description: 'Pain Ladder, Anti-emetic protocols, Delirium management.',
      icon: ClipboardList
    },
    {
      id: 'labs',
      title: 'Important Labs Reference',
      description: 'Critical lab values, Tumor markers, Electrolyte corrections.',
      icon: Thermometer
    },
    {
      id: 'emergencyregimens',
      title: 'Emergency Regimens',
      description: 'TLS prophylaxis, Neutropenic fever antibiotics, Adrenal rescue.',
      icon: ShieldAlert
    },
    {
      id: 'cognitive',
      title: 'Cognitive Tools',
      description: 'MMSE, GCS, Delirium Triage Screening.',
      icon: Brain
    },
    {
      id: 'toxicities',
      title: 'Treatment Toxicity Checklists',
      description: 'Chemotherapy, Radiotherapy, Immunotherapy toxicity alerts.',
      icon: Activity
    },
    {
      id: 'reminders',
      title: 'Scheduling and Reminders',
      description: 'Next treatment reminders, Lab follow-up calendars.',
      icon: Clock
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">🛠️ Tools Hub</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {tools.map((tool: any, index: number) => (
          <ToolCard
            key={tool.id}
            title={tool.title}
            description={tool.description}
            icon={tool.icon}
            onClick={() => handleOpenTool(tool.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Tools;
