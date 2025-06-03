/**
 * This is a clinical decision-support UI for oncology professionals to view population-level screening guidelines.
 * Do not include any EHR features or patient data.
 * 
 * Enhanced Supabase table: screening_guidelines
 * Supports comprehensive clinical decision making with detailed guideline information
 */

import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  Database, 
  ChevronDown, 
  ArrowLeft,
  RefreshCcw,
  AlertOctagon,
  LifeBuoy
} from 'lucide-react';
import { getSupabase } from '@/lib/supabaseClient';

// Enhanced TypeScript interface for comprehensive screening guidelines
interface ScreeningGuideline {
  id: string;
  cancer_type: string;
  population: string;
  starting_age: string;
  ending_age?: string;
  gender: 'male' | 'female' | 'all';
  risk_group: string;
  modality: string;
  frequency: string;
  notes: string;
  guideline_source: string;
  benefits?: string;
  harms?: string;
  number_needed_to_screen?: number;
  sensitivity_percent?: number;
  specificity_percent?: number;
  evidence_level: string;
  cost_effectiveness?: string;
  preparation?: string;
  contraindications?: string;
  abnormal_followup?: string;
  shared_decision_making?: boolean;
  last_reviewed?: string;
  next_review_due?: string;
  status: 'active' | 'retired' | 'draft';
  clinical_notes?: string;
}

// Enhanced utility functions for cancer type icons and colors
const getCancerTypeIcon = (cancerType: string): string => {
  const typeMap: Record<string, string> = {
    'breast': '🩷',
    'colorectal': '🟤', 
    'lung': '🫁',
    'prostate': '🔵',
    'cervical': '🟣',
    'skin': '🌞',
    'ovarian': '🟠',
    'thyroid': '🟢',
    'kidney': '🔴',
    'bladder': '💛',
    'pancreatic': '🟫',
    'liver': '🟤',
    'stomach': '🟡',
    'esophageal': '⚪',
    'head_neck': '🔶',
    'lymphoma': '🟪',
    'leukemia': '🔴',
    'melanoma': '⚫'
  };
  return typeMap[cancerType.toLowerCase().replace(/\s+/g, '_')] || '📋';
};

const getRiskLevelColor = (riskLevel: string): string => {
  const level = riskLevel.toLowerCase();
  if (level.includes('high')) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  if (level.includes('moderate') || level.includes('medium')) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
  if (level.includes('low')) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
  return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
};

const getEvidenceLevelColor = (evidenceLevel: string): string => {
  const level = evidenceLevel.toUpperCase();
  if (level === 'A') return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
  if (level === 'B') return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
  if (level === 'C') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
  if (level === 'D') return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
  return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
};

// Dialog Component for Detailed Guideline View
const GuidelineDialog: React.FC<{
  guideline: ScreeningGuideline | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ guideline, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !guideline) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        
        {/* Dialog */}
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{getCancerTypeIcon(guideline.cancer_type)}</div>
                <div>
                  <h2 className="text-3xl font-bold capitalize">
                    {guideline.cancer_type} Cancer Screening
                  </h2>
                  <p className="text-blue-100 text-lg mt-1">
                    Comprehensive Clinical Guidelines
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-blue-100 transition-colors p-2 rounded-lg hover:bg-white hover:bg-opacity-20"
                aria-label="Close dialog"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: '📋' },
                { id: 'evidence', label: 'Evidence', icon: '📊' },
                { id: 'clinical', label: 'Clinical', icon: '🩺' },
                { id: 'resources', label: 'Resources', icon: '📚' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-150
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }
                  `}
                >
                  <span className="flex items-center space-x-2">
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Key Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">👥</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Population</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{guideline.population}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                        <span className="text-green-600 dark:text-green-400 font-semibold text-sm">🎂</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Age Range</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {guideline.starting_age}{guideline.ending_age ? ` - ${guideline.ending_age}` : '+'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 dark:text-purple-400 font-semibold text-sm">🔬</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Screening Method</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{guideline.modality}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-900 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-orange-100 dark:bg-orange-800 rounded-full flex items-center justify-center">
                        <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Frequency</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{guideline.frequency}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 dark:bg-red-900 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center">
                        <span className="text-red-600 dark:text-red-400 font-semibold text-sm">⚠️</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Risk Group</h3>
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(guideline.risk_group)}`}>
                          {guideline.risk_group}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 dark:text-gray-400 font-semibold text-sm">📋</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Evidence Level</h3>
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getEvidenceLevelColor(guideline.evidence_level)}`}>
                          Grade {guideline.evidence_level}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Clinical Notes */}
                {guideline.notes && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                      <span>📝</span>
                      <span>Clinical Notes</span>
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{guideline.notes}</p>
                  </div>
                )}

                {/* Benefits */}
                {guideline.benefits && (
                  <div className="bg-green-50 dark:bg-green-900 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                      <span>✅</span>
                      <span>Benefits</span>
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{guideline.benefits}</p>
                  </div>
                )}

                {/* Harms */}
                {guideline.harms && (
                  <div className="bg-red-50 dark:bg-red-900 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                      <span>⚠️</span>
                      <span>Potential Harms</span>
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{guideline.harms}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'evidence' && (
              <div className="space-y-6">
                {/* Evidence Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {guideline.sensitivity_percent && (
                    <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center space-x-2">
                        <span>🎯</span>
                        <span>Sensitivity</span>
                      </h3>
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {guideline.sensitivity_percent}%
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        Percentage of cancers detected
                      </p>
                    </div>
                  )}

                  {guideline.specificity_percent && (
                    <div className="bg-green-50 dark:bg-green-900 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center space-x-2">
                        <span>🎯</span>
                        <span>Specificity</span>
                      </h3>
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                        {guideline.specificity_percent}%
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        Percentage of true negatives
                      </p>
                    </div>
                  )}
                </div>

                {guideline.number_needed_to_screen && (
                  <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center space-x-2">
                      <span>📊</span>
                      <span>Number Needed to Screen</span>
                    </h3>
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                      {guideline.number_needed_to_screen.toLocaleString()}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      People to screen to prevent one cancer death
                    </p>
                  </div>
                )}

                {guideline.cost_effectiveness && (
                  <div className="bg-yellow-50 dark:bg-yellow-900 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                      <span>💰</span>
                      <span>Cost Effectiveness</span>
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{guideline.cost_effectiveness}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'clinical' && (
              <div className="space-y-6">
                {/* Preparation */}
                {guideline.preparation && (
                  <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                      <span>📋</span>
                      <span>Patient Preparation</span>
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{guideline.preparation}</p>
                  </div>
                )}

                {/* Contraindications */}
                {guideline.contraindications && (
                  <div className="bg-red-50 dark:bg-red-900 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5" />
                      <span>Contraindications</span>
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{guideline.contraindications}</p>
                  </div>
                )}

                {/* Follow-up for Abnormal Results */}
                {guideline.abnormal_followup && (
                  <div className="bg-orange-50 dark:bg-orange-900 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                      <span>🔄</span>
                      <span>Abnormal Result Follow-up</span>
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{guideline.abnormal_followup}</p>
                  </div>
                )}

                {/* Shared Decision Making */}
                {guideline.shared_decision_making && (
                  <div className="bg-green-50 dark:bg-green-900 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                      <span>🤝</span>
                      <span>Shared Decision Making</span>
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      This screening recommendation requires shared decision making between patient and provider, 
                      considering individual risk factors, preferences, and values.
                    </p>
                  </div>
                )}

                {guideline.clinical_notes && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                      <span>📝</span>
                      <span>Additional Clinical Notes</span>
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{guideline.clinical_notes}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="space-y-6">
                {/* Guideline Source */}
                <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                    <Database className="w-5 h-5" />
                    <span>Guideline Source</span>
                  </h3>
                  <p className="text-lg font-medium text-blue-600 dark:text-blue-400">{guideline.guideline_source}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Evidence Level: <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getEvidenceLevelColor(guideline.evidence_level)}`}>
                      Grade {guideline.evidence_level}
                    </span>
                  </p>
                </div>

                {/* Review Information */}
                {(guideline.last_reviewed || guideline.next_review_due) && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                      <Clock className="w-5 h-5" />
                      <span>Review Information</span>
                    </h3>
                    <div className="space-y-2">
                      {guideline.last_reviewed && (
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          <span className="font-medium">Last Reviewed:</span> {guideline.last_reviewed}
                        </p>
                      )}
                      {guideline.next_review_due && (
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          <span className="font-medium">Next Review Due:</span> {guideline.next_review_due}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Status */}
                <div className="bg-green-50 dark:bg-green-900 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                    <span>📊</span>
                    <span>Guideline Status</span>
                  </h3>
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    guideline.status === 'active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200'
                      : guideline.status === 'retired'
                      ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200'
                  }`}>
                    {guideline.status.charAt(0).toUpperCase() + guideline.status.slice(1)}
                  </span>
                </div>

                {/* Important Notice */}
                <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Important Notice</h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        These guidelines are for reference only and should be used in conjunction with clinical judgment. 
                        Always consult current professional guidelines and institutional protocols. Consider individual 
                        patient factors, preferences, and contraindications when making screening recommendations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Individual screening guideline card component
const GuidelineCard: React.FC<{ 
  guideline: ScreeningGuideline; 
  index: number;
  onClick: () => void;
}> = ({ guideline, index, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`
        p-6 rounded-lg border transition-all duration-200 hover:shadow-lg cursor-pointer
        ${index % 2 === 0 
          ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700' 
          : 'bg-gray-50 dark:bg-gray-750 border-gray-200 dark:border-gray-600'
        }
        hover:border-blue-300 dark:hover:border-blue-600 hover:scale-[1.02]
      `}
    >
      {/* Cancer Type Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{getCancerTypeIcon(guideline.cancer_type)}</div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
              {guideline.cancer_type}
            </h3>
            <div className="h-1 w-12 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
          </div>
        </div>
        <div className="text-blue-600 dark:text-blue-400">
          <ArrowLeft className="h-5 w-5 rotate-180" />
        </div>
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
                Age Range
              </span>
              <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                {guideline.starting_age}{guideline.ending_age ? ` - ${guideline.ending_age}` : '+'}
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
              Screening Method
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

        {/* Risk Group Badge */}
        {guideline.risk_group && (
          <div className="pt-2">
            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(guideline.risk_group)}`}>
              {guideline.risk_group} Risk
            </span>
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
  const [selectedGuideline, setSelectedGuideline] = useState<ScreeningGuideline | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterRisk, setFilterRisk] = useState<string>('all');

  // Filter guidelines based on search and risk level
  const filteredGuidelines = guidelines.filter(guideline => {
    const matchesSearch = guideline.cancer_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guideline.population.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guideline.modality.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRisk = filterRisk === 'all' || 
                       guideline.risk_group.toLowerCase().includes(filterRisk.toLowerCase());
    
    return matchesSearch && matchesRisk;
  });

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
                <RefreshCcw className="animate-spin h-6 w-6 text-blue-600 dark:text-blue-400" />
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
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center space-x-2"
                >
                  <RefreshCcw className="h-4 w-4" />
                  <span>Retry</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Database className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Cancer Screening Guidelines
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl">
            Evidence-based screening recommendations for cancer prevention and early detection.
            This comprehensive reference tool displays population-level guidelines for clinical decision support.
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AlertOctagon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search cancer types, populations, or modalities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 
                           rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>

            {/* Risk Filter */}
            <div className="md:w-48">
              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
                className="block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 
                         rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Risk Levels</option>
                <option value="low">Low Risk</option>
                <option value="moderate">Moderate Risk</option>
                <option value="high">High Risk</option>
              </select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredGuidelines.length} of {guidelines.length} guidelines
            </div>
            {(searchTerm || filterRisk !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterRisk('all');
                }}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Guidelines Cards */}
        {filteredGuidelines.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
            <LifeBuoy className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              {guidelines.length === 0 ? 'No Guidelines Found' : 'No Matching Guidelines'}
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {guidelines.length === 0 
                ? 'No screening guidelines are currently available in the database.'
                : 'Try adjusting your search terms or filters to find guidelines.'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredGuidelines.map((guideline, index) => (
              <GuidelineCard
                key={guideline.id}
                guideline={guideline}
                index={index}
                onClick={() => setSelectedGuideline(guideline)}
              />
            ))}
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-12 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Important Disclaimer</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                These guidelines are for reference only and should be used in conjunction with clinical judgment.
                Always consult current professional guidelines and institutional protocols. Consider individual 
                patient factors, preferences, and contraindications when making screening recommendations.
              </p>
            </div>
          </div>
        </div>

        {/* Dialog Modal */}
        <GuidelineDialog
          guideline={selectedGuideline}
          isOpen={!!selectedGuideline}
          onClose={() => setSelectedGuideline(null)}
        />
      </div>
    </div>
  );
};

export default CancerScreening;
