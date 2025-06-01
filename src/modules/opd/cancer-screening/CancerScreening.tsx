import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, Download, MessageSquare } from 'lucide-react';
import { toast } from 'react-toastify';
import { callAIAgent } from '@/lib/api/aiAgentAPI';

// Types
type Gender = 'male' | 'female';
type CancerType = 
  | 'breast' 
  | 'cervical' 
  | 'colorectal' 
  | 'lung' 
  | 'prostate'
  | 'pancreatic'
  | 'ovarian'
  | 'gastric'
  | 'headNeck'
  | 'lymphoma';

interface RiskFactors {
  priorCancer: boolean;
  immunocompromised: boolean;
  radiationExposure: boolean;
  geneticRisk: GeneticRisk;
}

interface GeneticRisk {
  brcaPositive: boolean;
  lynchSyndrome: boolean;
  otherSyndrome?: string;
}

interface PatientData {
  age: number;
  gender: Gender;
  smokingHistory: boolean;
  packYears?: number;
  isHighRisk: boolean;
  riskFactors: RiskFactors;
  familyHistory: {
    breast: boolean;
    colorectal: boolean;
    prostate: boolean;
    ovarian: boolean;
  };
  lastScreening: {
    mammogram: string;
    colonoscopy: string;
    papSmear: string;
    ldct: string;
    psa: string;
    breastMri: string;
    endoscopy: string;
    ctAbdomen: string;
  };
  activeSymptoms: PatientDataSymptoms;
}

interface RecommendationEntry {
  cancerType: CancerType;
  status: 'due' | 'upcoming' | 'not-indicated';
  reason: string;
  nextDue?: string;
  isOverdue?: boolean;
}

interface PatientDataSymptoms {
  [key: string]: boolean;
}

interface ExpandedPanels {
  [key: string]: boolean;
}

const CancerScreening: React.FC = () => {
  const [patientData, setPatientData] = useState<PatientData>({
    age: 0,
    gender: 'female',
    smokingHistory: false,
    packYears: 0,
    isHighRisk: false,
    riskFactors: {
      priorCancer: false,
      immunocompromised: false,
      radiationExposure: false,
      geneticRisk: {
        brcaPositive: false,
        lynchSyndrome: false
      }
    },
    familyHistory: {
      breast: false,
      colorectal: false,
      prostate: false,
      ovarian: false,
    },
    lastScreening: {
      mammogram: '',
      colonoscopy: '',
      papSmear: '',
      ldct: '',
      psa: '',
      breastMri: '',
      endoscopy: '',
      ctAbdomen: ''
    },
    activeSymptoms: {
      weightLoss: false,
      abdominalPain: false,
      backPain: false,
      jaundice: false,
      bloating: false,
      earlySatiety: false,
      hoarseness: false,
      dysphagia: false,
      earPain: false,
      vomiting: false,
      bleeding: false,
      fever: false,
      nightSweats: false
    }
  });

  const [expandedPanels, setExpandedPanels] = useState<ExpandedPanels>({});

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>): boolean => {
    return e.target.checked;
  };

  const calculateRecommendations = (): Record<string, RecommendationEntry> => {
    // Mock implementation - replace with actual implementation
    return {
      colorectal: {
        cancerType: 'colorectal',
        status: 'due',
        reason: 'Regular screening due',
        isOverdue: false
      }
    };
  };

  const getStatusColor = (status: string, isOverdue?: boolean): string => {
    if (isOverdue) return 'text-red-600 bg-red-50';
    switch (status) {
      case 'due': return 'text-yellow-600 bg-yellow-50';
      case 'upcoming': return 'text-blue-600 bg-blue-50';
      case 'not-indicated': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const recommendations = calculateRecommendations();

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      <div className="mt-4 border-t pt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Active Symptoms</h4>
        <div className="grid md:grid-cols-3 gap-4">
          {Object.entries(patientData.activeSymptoms as PatientDataSymptoms).map(([symptom, isActive]) => (
            <label key={symptom} className="inline-flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setPatientData((prev: PatientData) => ({
                  ...prev,
                  activeSymptoms: {
                    ...prev.activeSymptoms,
                    [symptom]: handleCheckboxChange(e)
                  }
                }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="capitalize">{symptom.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(recommendations as Record<string, RecommendationEntry>).map(([cancerType, recommendation]) => {
          if (!recommendation) return null;
          if ((cancerType === 'breast' || cancerType === 'cervical') && patientData.gender === 'male') return null;
          if (cancerType === 'prostate' && patientData.gender === 'female') return null;

          return (
            <div key={cancerType} className="bg-white rounded-lg shadow">
              <div
                className="p-4 flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedPanels(prev => ({ ...prev, [cancerType]: !prev[cancerType] }))}
              >
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-semibold text-gray-800 capitalize">
                    {cancerType} Cancer Screening
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(recommendation.status, recommendation.isOverdue)}`}>
                    {recommendation.status.toUpperCase()}
                  </span>
                  {recommendation.isOverdue && (
                    <AlertTriangle className="text-red-500" size={20} />
                  )}
                </div>
                {expandedPanels[cancerType] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CancerScreening;
