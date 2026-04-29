import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Thermometer, ShieldAlert, Activity, HeartPulse, ChevronDown, ChevronUp, BookOpen, ArrowLeft, Shield } from 'lucide-react';

export interface RedFlagItem {
  id: string;
  title: string;
  description: string;
  details: string;
  icon: React.ElementType;
  color: string;
  handbookLink?: string;
}

export const redFlags: RedFlagItem[] = [
  {
    id: 'neutropenic-fever',
    title: 'Neutropenic Fever',
    description: 'Potential oncologic emergency — urgent clinician assessment required.',
    details: `**Signs:** Single oral temperature > 38.3°C or > 38.0°C over 1 hour in a patient with ANC < 0.5 x 10^9/L.  
**Urgent Actions:** Follow institutional emergency pathway based on clinical context. Secure urgent clinician review. Blood cultures and baseline investigations must not delay anti-infective initiation.  
**Critical:** Time-to-antibiotics is a core safety metric; typically required within 1 hour of presentation.`,
    icon: Thermometer,
    color: 'bg-red-500',
    handbookLink: '/handbook/medical-oncology/treatment'
  },
  {
    id: 'tumor-lysis',
    title: 'Tumor Lysis Syndrome',
    description: 'Potential oncologic emergency — urgent clinician assessment required.',
    details: `**Signs:** Rapid elevations in potassium, phosphate, and uric acid with secondary hypocalcemia. Risk of acute kidney injury.  
**Urgent Actions:** Follow institutional emergency pathway based on clinical context. Immediate clinician review. Aggressive hydration and electrolyte management per institutional protocol.  
**Critical:** High-risk patients require frequent (e.g. 6-hourly) laboratory monitoring.`,
    icon: ShieldAlert,
    color: 'bg-yellow-500',
    handbookLink: '/handbook/medical-oncology/diagnosis'
  },
  {
    id: 'spinal-compression',
    title: 'Spinal Cord Compression',
    description: 'Potential oncologic emergency — urgent clinician assessment required.',
    details: `**Signs:** New onset back pain (often nocturnal), motor weakness, sensory changes, or autonomic dysfunction.  
**Urgent Actions:** Follow institutional emergency pathway based on clinical context. Immediate clinician review. Follow institutional emergency protocol which may include high-dose corticosteroids. Urgent MRI of the whole spine (within 24 hours).  
**Critical:** Outcome is highly dependent on neurological status at the time of treatment start.`,
    icon: Activity,
    color: 'bg-orange-500',
    handbookLink: '/handbook/medical-oncology/diagnosis'
  },
  {
    id: 'svc-syndrome',
    title: 'Superior Vena Cava Syndrome (SVCS)',
    description: 'Potential oncologic emergency — urgent clinician assessment required.',
    details: `**Signs:** Facial/neck swelling, dyspnea, upper extremity edema, distended superficial thoracic veins.  
**Urgent Actions:** Follow institutional emergency pathway based on clinical context. Immediate clinician review. Secure airway assessment. Urgent imaging (usually CT chest) to determine etiology and plan therapy. Oncology/Radiotherapy consultation.`,
    icon: HeartPulse,
    color: 'bg-purple-500',
    handbookLink: '/handbook/medical-oncology/diagnosis'
  },
  {
    id: 'hypercalcemia',
    title: 'Hypercalcemia of Malignancy',
    description: 'Potential oncologic emergency — urgent clinician assessment required.',
    details: `**Signs:** Progressive lethargy, confusion, nausea, polyuria, or constipation.  
**Urgent Actions:** Follow institutional emergency pathway based on clinical context. Immediate clinician review. Prompt initiation of intensive IV hydration (institutional IV fluid pathway) and metabolic management per institutional pathways.  
**Critical:** Severe hypercalcemia (Corrected Calcium > 3.0 mmol/L) requires urgent intervention to manage cardiac and neurological risks.`,
    icon: AlertTriangle,
    color: 'bg-pink-500',
    handbookLink: '/handbook/medical-oncology/diagnosis'
  }
];

const RedFlagsPage: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const navigate = useNavigate();

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <button 
          onClick={() => navigate('/tools')}
          className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium mb-4 hover:underline"
        >
          <ArrowLeft size={16} />
          Back to Tools Overview
        </button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">🚨 Red Flags & Emergencies</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 max-w-2xl text-sm">
              Clinical decision support for the identification of acute oncological emergencies. 
              Always prioritize institutional emergency pathways.
            </p>
          </div>
          <button
            onClick={() => navigate('/handbook/medical-oncology')}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition border border-red-200 dark:border-red-800"
          >
            <BookOpen className="w-4 h-4" />
            <span className="text-sm font-medium">Emergency Handbooks</span>
          </button>
        </div>
      </div>

      <div className="mb-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-4">
        <Shield className="text-amber-600 dark:text-amber-400 mt-1 flex-shrink-0" size={20} />
        <div>
          <p className="font-bold text-amber-900 dark:text-amber-100 text-sm">Safety Disclaimer</p>
          <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed italic">
            Emergency guidance is for clinical decision support only. Follow institutional emergency pathways and secure urgent clinician assessment. This tool is not a substitute for professional clinical judgment or established local protocols.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {redFlags.map((flag) => (
          <div key={flag.id} className="flex flex-col items-center">
            <div
              onClick={() => toggleExpand(flag.id)}
              className={`w-full p-5 rounded-xl shadow hover:shadow-lg transition hover:scale-105 flex flex-col justify-center items-center text-center text-white cursor-pointer ${flag.color}`}
            >
              <flag.icon size={40} />
              <h2 className="text-lg font-semibold mt-3">{flag.title}</h2>
              <p className="text-sm mt-2">{flag.description}</p>
              <div className="mt-2 text-white/80">
                {expandedId === flag.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </div>

            {/* Expanded Details Section */}
            {expandedId === flag.id && (
              <div className="w-full mt-2 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-inner transition">
                <div className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line mb-4 leading-relaxed">
                  {flag.details}
                </div>
                {flag.handbookLink && (
                  <button
                    onClick={() => navigate(flag.handbookLink!)}
                    className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition"
                  >
                    <BookOpen size={14} />
                    View related handbook section
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RedFlagsPage;

