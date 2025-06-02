import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, Download, MessageSquare } from 'lucide-react';
import { toast } from 'react-toastify';
import { callAIAgent } from '@/lib/api/aiAgentAPI';

// Types
type Gender = 'male' | 'female';

interface GeneticRisk {
  brcaPositive: boolean;
  lynchSyndrome: boolean;
  otherSyndrome?: string;
}

interface RiskFactors {
  priorCancer: boolean;
  immunocompromised: boolean;
  radiationExposure: boolean;
  geneticRisk: GeneticRisk;
}

interface Symptoms {
  weightLoss: boolean;
  abdominalPain: boolean;
  backPain: boolean;
  jaundice: boolean;
  bloating: boolean;
  earlySatiety: boolean;
  hoarseness: boolean;
  dysphagia: boolean;
  earPain: boolean;
  vomiting: boolean;
  bleeding: boolean;
  fever: boolean;
  nightSweats: boolean;
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
  activeSymptoms: Symptoms;
}

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

interface SymptomWarning {
  severity: 'low' | 'moderate' | 'high';
  description: string;
  suggestedAction: string;
}

interface ScreeningRecommendation {
  cancerType: CancerType;
  status: 'due' | 'upcoming' | 'not-indicated';
  reason: string;
  nextDue?: string;
  isOverdue?: boolean;
}

interface ScreeningResults {
  breast?: ScreeningRecommendation;
  cervical?: ScreeningRecommendation;
  colorectal: ScreeningRecommendation;
  lung: ScreeningRecommendation;
  prostate?: ScreeningRecommendation;
  pancreatic?: ScreeningRecommendation;
  ovarian?: ScreeningRecommendation;
  gastric?: ScreeningRecommendation;
  headNeck?: ScreeningRecommendation;
  lymphoma?: ScreeningRecommendation;
  [key: string]: ScreeningRecommendation | undefined;
}

interface GenerateSummaryParams {
  prompt: string;
  context: string;
}

interface ToastParams {
  title?: string;
  description: string;
  duration?: number;
  variant?: 'default' | 'destructive';
}

const CancerScreening: React.FC = () => {
  const [mockMode, setMockMode] = useState(false);
  type LastScreeningKey = keyof PatientData['lastScreening'];

  // State
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

  const [expandedPanels, setExpandedPanels] = useState<{ [key: string]: boolean }>({
    breast: true,
    cervical: true,
    colorectal: true,
    lung: true,
    prostate: true
  });

  const [loading, setLoading] = useState(false);

  // Helper functions for type checking and event handling
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>): boolean => {
    return e.target.checked;
  };

  const isValidDate = (date: string): boolean => {
    return date !== undefined && date !== null && date.length > 0;
  };

  const getYearsSince = (date: string): number => {
    return isValidDate(date) ? new Date().getFullYear() - new Date(date).getFullYear() : Infinity;
  };

  // Helper functions for risk assessment and symptoms
  const getSymptomBasedCancers = (): CancerType[] => {
    const symptoms = patientData.activeSymptoms;
    const concerns: CancerType[] = [];

    // Pancreatic cancer symptoms
    if (symptoms.weightLoss && (symptoms.backPain || symptoms.jaundice)) {
      concerns.push('pancreatic');
    }

    // Ovarian cancer symptoms
    if (symptoms.bloating && symptoms.earlySatiety && patientData.gender === 'female') {
      concerns.push('ovarian');
    }

    // Head & neck cancer symptoms
    if (symptoms.hoarseness || symptoms.dysphagia || symptoms.earPain) {
      concerns.push('headNeck');
    }

    // Gastric cancer symptoms
    if (symptoms.vomiting || symptoms.bleeding) {
      concerns.push('gastric');
    }

    // Lymphoma symptoms
    if ((symptoms.fever || symptoms.nightSweats) && symptoms.weightLoss) {
      concerns.push('lymphoma');
    }

    return concerns;
  };

  const getHighRiskInterval = (standardInterval: number): number => {
    if (!patientData.isHighRisk) return standardInterval;

    // Reduce intervals for high-risk patients
    if (patientData.riskFactors.geneticRisk.brcaPositive) return Math.max(6, standardInterval / 2);
    if (patientData.riskFactors.geneticRisk.lynchSyndrome) return Math.max(1, standardInterval / 2);
    if (patientData.riskFactors.priorCancer) return Math.max(6, standardInterval * 0.75);
    
    return standardInterval;
  };

  // Helper function to calculate screening recommendations
  const calculateRecommendations = (): ScreeningResults => {
    const results: ScreeningResults = {
      colorectal: { 
        cancerType: 'colorectal',
        status: 'not-indicated', 
        reason: 'Age below screening threshold' 
      },
      lung: { 
        cancerType: 'lung',
        status: 'not-indicated', 
        reason: 'Not meeting screening criteria' 
      }
    };

    // Colorectal Cancer Screening
    if (patientData.age >= 45) {
      const lastColonoscopy = patientData.lastScreening.colonoscopy;
      const yearsSinceColonoscopy = getYearsSince(lastColonoscopy);
      if (!isValidDate(lastColonoscopy)) {
        results.colorectal = {
          cancerType: 'colorectal',
          status: 'due',
          reason: 'Initial screening colonoscopy needed',
          isOverdue: patientData.age > 45
        };
      } else {
        if (yearsSinceColonoscopy >= 10) {
          results.colorectal = {
            cancerType: 'colorectal',
            status: 'due',
            reason: 'Follow-up colonoscopy needed',
            isOverdue: true
          };
        } else if (yearsSinceColonoscopy >= 8) {
          results.colorectal = {
            cancerType: 'colorectal',
            status: 'upcoming',
            reason: 'Colonoscopy due within 2 years',
            nextDue: lastColonoscopy
          };
        }
      }
    }

    // Add symptom-based warnings
    const concernedCancers = getSymptomBasedCancers();
    if (concernedCancers.length > 0) {
      concernedCancers.forEach(cancerType => {
        results[cancerType] = {
          cancerType,
          status: 'due',
          reason: 'Concerning symptoms present - requires immediate evaluation',
          isOverdue: true
        };
      });
    }

    // Gender-specific screenings
    if (patientData.gender === 'female') {
      // Breast Cancer Screening
      if (patientData.age >= 40 && patientData.age <= 74) {
        const lastMammogram = patientData.lastScreening.mammogram;
        results.breast = {
          cancerType: 'breast',
          status: !isValidDate(lastMammogram) || getYearsSince(lastMammogram) >= 1 
            ? 'due' 
            : 'upcoming',
          reason: patientData.familyHistory.breast 
            ? 'High-risk patient requires more frequent screening'
            : patientData.isHighRisk 
              ? 'Modified screening interval due to risk factors'
              : 'Regular annual screening recommended',
          isOverdue: isValidDate(lastMammogram) && getYearsSince(lastMammogram) > 1
        };
      }

      // Cervical Cancer Screening
      if (patientData.age >= 21 && patientData.age <= 65) {
        const lastPap = patientData.lastScreening.papSmear;
        results.cervical = {
          cancerType: 'cervical',
          status: !isValidDate(lastPap) || getYearsSince(lastPap) >= 3
            ? 'due'
            : 'upcoming',
          reason: patientData.age >= 30 
            ? 'Co-testing with HPV recommended every 5 years'
            : 'Pap smear recommended every 3 years',
          isOverdue: isValidDate(lastPap) && getYearsSince(lastPap) > 3
        };
      }
    }

    // Prostate Cancer Screening
    if (patientData.gender === 'male' && patientData.age >= 50) {
      const lastPSA = patientData.lastScreening.psa;
      results.prostate = {
          cancerType: 'prostate',
          status: !isValidDate(lastPSA) || getYearsSince(lastPSA) >= 1
            ? 'due'
            : 'upcoming',
          reason: patientData.familyHistory.prostate
            ? 'High-risk patient requires annual PSA screening'
            : 'Consider PSA screening based on shared decision making',
          isOverdue: isValidDate(lastPSA) && getYearsSince(lastPSA) > 1
      };
    }

    // Lung Cancer Screening
    if (patientData.age >= 50 && patientData.age <= 80 && patientData.smokingHistory && (patientData.packYears ?? 0) >= 20) {
      const lastLDCT = patientData.lastScreening.ldct;
      results.lung = {
          cancerType: 'lung',
          status: !isValidDate(lastLDCT) || getYearsSince(lastLDCT) >= 1
            ? 'due'
            : 'upcoming',
          reason: 'Annual LDCT recommended for high-risk patients',
          isOverdue: isValidDate(lastLDCT) && getYearsSince(lastLDCT) > 1
      };
    }

    return results;
  };

  const generateSummary = async ({ prompt, context }: GenerateSummaryParams): Promise<string> => {
    try {
      const response = await callAIAgent({
        module: 'OPD',
        intent: 'screening',
        prompt,
        context,
        mockMode
      });
      return response.content;
    } catch (error: any) {
      console.error('Generate Summary Error:', error);
      
      // Handle specific API errors
      if (error.name === 'APIError') {
        switch (error.code) {
          case 'INVALID_JSON':
          case 'INVALID_RESPONSE':
            throw new Error('The AI service returned an invalid response. Please try again.');
          case 'RATE_LIMIT':
            throw new Error('Too many requests. Please wait a moment and try again.');
          case 'CONNECTION_ERROR':
            throw new Error('Unable to connect to the AI service. Please check your connection.');
          default:
            throw new Error(error.message || 'Failed to generate summary');
        }
      }

      throw new Error('Failed to generate summary');
    }
  };

  const recommendations = calculateRecommendations();

  // Handle AI consultation
  const showToast = ({ title, description, duration = 5000, variant = 'default' }: ToastParams) => {
    toast(description, {
      type: variant === 'destructive' ? 'error' : 'info',
      autoClose: duration,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleAIConsult = async (cancerType: string) => {
    setLoading(true);
    const recommendation = recommendations[cancerType.toLowerCase()];
    if (!recommendation) return;

    try {
      const context = `
Patient Information:
- Age: ${patientData.age}
- Gender: ${patientData.gender}
- Smoking History: ${patientData.smokingHistory ? `Yes (${patientData.packYears} pack years)` : 'No'}
- High Risk: ${patientData.isHighRisk ? 'Yes' : 'No'}
- Family History: ${Object.entries(patientData.familyHistory)
  .filter(([_, value]) => value)
  .map(([cancer]) => cancer)
  .join(', ')}

Screening Status:
Cancer Type: ${cancerType}
Current Status: ${recommendation.status}
Reason: ${recommendation.reason}
Last Screening: ${patientData.lastScreening[cancerType.toLowerCase() as keyof typeof patientData.lastScreening] || 'Never'}
${recommendation.isOverdue ? 'OVERDUE FOR SCREENING' : ''}
`;

      const response = await generateSummary({
        prompt: "Analyze this patient's cancer screening status and provide personalized recommendations.",
        context
      });

      showToast({
        title: `${cancerType} Screening Analysis`,
        description: response,
        duration: 10000
      });

    } catch (error: any) {
      console.error('AI Consultation Error:', error);
      showToast({
        title: "Consultation Failed",
        description: error.message || "Unable to provide AI consultation at this time. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Export recommendations as PDF
  const exportRecommendations = () => {
    // Implement PDF export logic
    console.log('Exporting recommendations...');
  };

  const getStatusColor = (status: string, isOverdue?: boolean) => {
    if (isOverdue) return 'text-red-600 bg-red-50';
    switch (status) {
      case 'due': return 'text-yellow-600 bg-yellow-50';
      case 'upcoming': return 'text-blue-600 bg-blue-50';
      case 'not-indicated': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Cancer Screening Assistant</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMockMode(!mockMode)}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              mockMode ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
            }`}
          >
            {mockMode ? '🧪 Mock Mode' : '🤖 Gemini Mode'}
          </button>
          <button
            onClick={exportRecommendations}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download size={16} />
            Export PDF
          </button>
        </div>
      </div>

      {/* Patient Input Panel */}
      {/* High Risk Panel */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">High Risk Assessment</h3>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={patientData.isHighRisk}
              onChange={(e) => setPatientData(prev => ({
                ...prev,
                isHighRisk: handleCheckboxChange(e)
              }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            <span className="ml-3 text-sm font-medium text-gray-700">High Risk Patient</span>
          </label>
        </div>

        {patientData.isHighRisk && (
          <div className="mt-4 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={patientData.riskFactors.geneticRisk.brcaPositive}
                  onChange={(e) => setPatientData(prev => ({
                    ...prev,
                    riskFactors: {
                      ...prev.riskFactors,
                      geneticRisk: {
                        ...prev.riskFactors.geneticRisk,
                        brcaPositive: handleCheckboxChange(e)
                      }
                    }
                  }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>BRCA1/2 Positive</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={patientData.riskFactors.geneticRisk.lynchSyndrome}
                  onChange={(e) => setPatientData(prev => ({
                    ...prev,
                    riskFactors: {
                      ...prev.riskFactors,
                      geneticRisk: {
                        ...prev.riskFactors.geneticRisk,
                        lynchSyndrome: handleCheckboxChange(e)
                      }
                    }
                  }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Lynch Syndrome</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={patientData.riskFactors.priorCancer}
                  onChange={(e) => setPatientData(prev => ({
                    ...prev,
                    riskFactors: {
                      ...prev.riskFactors,
                      priorCancer: handleCheckboxChange(e)
                    }
                  }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Prior Cancer History</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={patientData.riskFactors.immunocompromised}
                  onChange={(e) => setPatientData(prev => ({
                    ...prev,
                    riskFactors: {
                      ...prev.riskFactors,
                      immunocompromised: handleCheckboxChange(e)
                    }
                  }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Immunocompromised</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Patient Information Panel */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Patient Information</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Age</label>
            <input
              type="number"
              value={patientData.age || ''}
              onChange={(e) => setPatientData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              value={patientData.gender}
              onChange={(e) => setPatientData(prev => ({ ...prev, gender: e.target.value as Gender }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Smoking History</label>
            <div className="mt-1 space-y-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={patientData.smokingHistory}
                  onChange={(e) => setPatientData(prev => ({ ...prev, smokingHistory: handleCheckboxChange(e) }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2">Current or Former Smoker</span>
              </label>
              {patientData.smokingHistory && (
                <input
                  type="number"
                  placeholder="Pack Years"
                  value={patientData.packYears || ''}
                  onChange={(e) => setPatientData(prev => ({ ...prev, packYears: parseInt(e.target.value) || 0 }))}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              )}
            </div>
          </div>
        </div>

        {/* Family History Section */}
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Family History</h4>
          <div className="grid md:grid-cols-2 gap-4">
            {(Object.keys(patientData.familyHistory) as Array<keyof typeof patientData.familyHistory>).map((cancer) => (
              <label key={cancer} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={patientData.familyHistory[cancer]}
                  onChange={(e) => setPatientData(prev => ({
                    ...prev,
                    familyHistory: {
                      ...prev.familyHistory,
                      [cancer]: handleCheckboxChange(e)
                    }
                  }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 capitalize">{cancer} Cancer</span>
              </label>
            ))}
          </div>
        </div>

        {/* Symptoms Panel */}
        <div className="mt-4 border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Active Symptoms</h4>
          <div className="grid md:grid-cols-3 gap-4">
            {Object.entries(patientData.activeSymptoms).map(([symptom, isActive]) => (
              <label key={symptom} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setPatientData(prev => ({
                    ...prev,
                    activeSymptoms: {
                      ...prev.activeSymptoms,
                      [symptom]: handleCheckboxChange(e)
                    }
                  }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 capitalize">{symptom.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Last Screening Dates */}
        <div className="mt-4 border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Last Screening Dates</h4>
          <div className="grid md:grid-cols-2 gap-4">
            {(Object.keys(patientData.lastScreening) as LastScreeningKey[]).map((screening) => (
              <div key={screening}>
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  {screening.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <input
                  type="date"
                  value={patientData.lastScreening[screening as keyof typeof patientData.lastScreening] || ''}
                  onChange={(e) => setPatientData(prev => ({
                    ...prev,
                    lastScreening: {
                      ...prev.lastScreening,
                      [screening]: e.target.value
                    }
                  }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations Panel */}
      <div className="space-y-4">
        {Object.entries(recommendations).map(([cancerType, recommendation]) => {
          // Skip if recommendation is undefined or gender-specific recommendation doesn't apply
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

              {expandedPanels[cancerType] && (
                <div className="p-4 border-t border-gray-200 space-y-4">
                  <p className="text-gray-600">{recommendation.reason}</p>
                  {recommendation?.nextDue && (
                    <p className="text-sm text-gray-500">
                      Next screening due: {new Date(recommendation.nextDue).toLocaleDateString()}
                    </p>
                  )}
                  <button
                    onClick={() => handleAIConsult(recommendation.cancerType)}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    disabled={loading}
                  >
                    <MessageSquare size={16} />
                    Ask AI about {cancerType} screening
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CancerScreening;
