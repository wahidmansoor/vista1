import React, { useState } from "react";
import { pathways } from "../../../data/cancer-pathways";
import DecisionTree from "./DecisionTree";
import { CancerType } from "../../../types/cancer-pathways";
import { 
  Book, 
  Activity, 
  Brain, 
  Heart, 
  CircleDot,
  Stethoscope, 
  Dna, 
  Waves 
} from "lucide-react";

const DiagnosticPathways: React.FC = () => {
  const [selectedCancer, setSelectedCancer] = useState<CancerType | null>(null);

  const cancerIcons: Record<CancerType, React.ReactNode> = {
    breast: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
    prostate: <Activity className="w-6 h-6" />,
    lung: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11c0-4.4-3.6-8-8-8S3 6.6 3 11c0 2.5 1.2 4.8 3 6.2V21h12v-3.8c1.8-1.4 3-3.7 3-6.2z" />
      </svg>
    ),
    ovarian: <Dna className="w-6 h-6" />,
    gastric: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 13.87C6 16.15 7.57 18 9.46 18H14.54C16.43 18 18 16.15 18 13.87C18 10.5 14 9 12 9C10 9 6 10.5 6 13.87Z" />
      </svg>
    ),
    head_neck: <Stethoscope className="w-6 h-6" />,
    pancreatic: <Heart className="w-6 h-6" />,
    bladder: <Waves className="w-6 h-6" />,
    colorectal: <CircleDot className="w-6 h-6" />,
    lymphoma: <Brain className="w-6 h-6" />
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Diagnostic Pathways</h2>
        {selectedCancer && (
          <button
            onClick={() => setSelectedCancer(null)}
            className="text-sm text-gray-600 hover:text-gray-800 flex items-center"
          >
            <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Cancer Types
          </button>
        )}
      </div>

      {!selectedCancer ? (
        <div className="grid gap-6">
          <div className="p-4 bg-white rounded-lg shadow border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Select Cancer Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(pathways).map(([type, pathway]) => (
                <button
                  key={type}
                  onClick={() => setSelectedCancer(type as CancerType)}
                  className="p-4 text-left bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 flex items-start space-x-3"
                >
                  <div className="text-blue-600">
                    {cancerIcons[type as CancerType]}
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-800">{pathway.name}</h4>
                    <p className="text-sm text-blue-600 mt-1">{pathway.description}</p>
                    {pathway.recommendedTimeframe && (
                      <p className="text-sm text-blue-500 mt-2">
                        Typical timeline: {pathway.recommendedTimeframe}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-white rounded-lg shadow border border-gray-200">
            <div className="flex items-start space-x-3">
              <Book className="w-6 h-6 text-gray-400" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">About Diagnostic Pathways</h3>
                <p className="mt-2 text-gray-600">
                  Select a cancer type above to view its specific diagnostic pathway. Each pathway provides:
                </p>
                <ul className="mt-2 space-y-2 text-gray-600 list-disc list-inside">
                  <li>Step-by-step diagnostic guidance</li>
                  <li>Red flag alerts for critical findings</li>
                  <li>Expected timelines and progress tracking</li>
                  <li>AI-powered suggestions and summaries</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <DecisionTree pathway={pathways[selectedCancer]} />
        </div>
      )}
    </div>
  );
};

export default DiagnosticPathways;
