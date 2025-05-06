import React, { useState } from 'react';
import { Activity, Search, ThermometerSnowflake, Wind, AlertTriangle, Clock } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface EnhancedSymptom extends ClassicSymptom {
  severity: {
    levels: {
      mild: string[];
      moderate: string[];
      severe: string[];
    };
    assessment: string[];
  };
  timeline: {
    onset: string;
    peak: string;
    duration: string;
  };
  referralCriteria: string[];
}

interface ClassicSymptom {
  id: string;
  name: string;
  description: string;
  interventions: {
    nonPharmacological: string[];
    pharmacological: string[];
  };
  monitoring: string[];
  icon: React.ReactNode;
}

const enhancedSymptoms: EnhancedSymptom[] = [
  {
    id: 'dyspnea',
    name: 'Dyspnea',
    description: 'Breathlessness or shortness of breath with comprehensive management approach',
    interventions: {
      nonPharmacological: [
        'Positioning (upright, forward lean)',
        'Fan therapy',
        'Breathing exercises',
        'Anxiety management',
        'Energy conservation techniques',
        'Relaxation therapy'
      ],
      pharmacological: [
        'Opioids (morphine/hydromorphone)',
        'Anxiolytics if needed',
        'Oxygen therapy if hypoxic',
        'Bronchodilators if indicated',
        'Corticosteroids when appropriate'
      ]
    },
    monitoring: [
      'Respiratory rate',
      'Oxygen saturation',
      'Work of breathing',
      'Associated anxiety',
      'Sleep quality',
      'Activity tolerance'
    ],
    icon: <Wind className="h-6 w-6" />,
    severity: {
      levels: {
        mild: [
          'Breathless on moderate exertion',
          'No interference with daily activities',
          'Normal speech pattern'
        ],
        moderate: [
          'Breathless on minimal exertion',
          'Interferes with some daily activities',
          'Can only speak in short sentences'
        ],
        severe: [
          'Breathless at rest',
          'Unable to perform daily activities',
          'Can only speak in single words'
        ]
      },
      assessment: [
        'Modified Borg Scale',
        'Numerical Rating Scale (0-10)',
        'ESAS Breathlessness Score'
      ]
    },
    timeline: {
      onset: 'Variable, can be acute or gradual',
      peak: '24-72 hours if acute',
      duration: 'Dependent on underlying cause'
    },
    referralCriteria: [
      'Severe breathlessness despite optimal therapy',
      'Associated significant anxiety/panic',
      'Need for advanced respiratory support',
      'Underlying cause requiring specialist input'
    ]
  }
];

export default function EnhancedSymptomView() {
  const [selectedSymptomId, setSelectedSymptomId] = useState('dyspnea');
  const [activeTab, setActiveTab] = useState<'overview' | 'severity' | 'timeline'>('overview');

  const selectedSymptom = enhancedSymptoms.find(s => s.id === selectedSymptomId);

  if (!selectedSymptom) return null;

  return (
    <div className="space-y-6">
      <div className="rounded-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 text-white">
          <div className="flex items-center gap-3">
            {selectedSymptom.icon}
            <h2 className="text-2xl font-bold">{selectedSymptom.name}</h2>
          </div>
          <p className="mt-2 text-indigo-100">{selectedSymptom.description}</p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {['overview', 'severity', 'timeline'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as 'overview' | 'severity' | 'timeline')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors
                  ${activeTab === tab
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Interventions */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Management Approach</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-700">Non-Pharmacological</h4>
                      <ul className="mt-2 space-y-2">
                        {selectedSymptom.interventions.nonPharmacological.map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-600">
                            <span className="text-indigo-600">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700">Pharmacological</h4>
                      <ul className="mt-2 space-y-2">
                        {selectedSymptom.interventions.pharmacological.map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-600">
                            <span className="text-indigo-600">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Monitoring */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Monitoring Parameters</h3>
                  <ul className="space-y-2">
                    {selectedSymptom.monitoring.map((item, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'severity' && (
            <div className="space-y-6">
              {/* Severity Levels */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Severity Assessment</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(selectedSymptom.severity.levels).map(([level, symptoms]) => (
                    <div key={level} className="p-4 rounded-lg">
                      <h4 className={`font-medium mb-2 capitalize
                        ${level === 'mild' ? 'text-green-700' : 
                          level === 'moderate' ? 'text-yellow-700' : 
                          'text-red-700'}`}>
                        {level}
                      </h4>
                      <ul className="space-y-2">
                        {symptoms.map((symptom, index) => (
                          <li key={index} className="text-sm text-gray-600">
                            • {symptom}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assessment Tools */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Assessment Tools</h3>
                <ul className="space-y-2">
                  {selectedSymptom.severity.assessment.map((tool, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-600">
                      <Search className="h-4 w-4 text-indigo-600" />
                      {tool}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-6">
              {/* Timeline */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Symptom Timeline</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-indigo-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-700">Onset</h4>
                      <p className="text-gray-600">{selectedSymptom.timeline.onset}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Activity className="h-5 w-5 text-indigo-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-700">Peak</h4>
                      <p className="text-gray-600">{selectedSymptom.timeline.peak}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <ThermometerSnowflake className="h-5 w-5 text-indigo-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-700">Duration</h4>
                      <p className="text-gray-600">{selectedSymptom.timeline.duration}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Referral Criteria */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Referral Criteria</h3>
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
                    <h4 className="font-medium text-yellow-800">Consider Specialist Referral</h4>
                  </div>
                  <ul className="space-y-2">
                    {selectedSymptom.referralCriteria.map((criteria, index) => (
                      <li key={index} className="flex items-start gap-2 text-yellow-700">
                        <span>•</span>
                        {criteria}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
