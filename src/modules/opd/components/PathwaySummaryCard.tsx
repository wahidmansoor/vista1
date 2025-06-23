import React from "react";
import { PathwaySummaryCard as PathwaySummaryType, RedFlag } from "../../../types/cancer-pathways";
import { CheckCircle, Clock, AlertTriangle } from "lucide-react";
import RedFlagAlert from "./RedFlagAlert";

interface PathwaySummaryCardProps {
  summary: PathwaySummaryType;
  onRedFlagDismiss?: (flagId: string) => void;
}

const PathwaySummaryCard: React.FC<PathwaySummaryCardProps> = ({
  summary,
  onRedFlagDismiss,
}) => {
  const { totalSteps, completedSteps, activeRedFlags, estimatedTimeRemaining, nextRequiredActions } = summary;
  
  const progress = Math.round((completedSteps / totalSteps) * 100);
  
  const criticalFlags = activeRedFlags.filter(flag => flag.severity === "critical");
  const warningFlags = activeRedFlags.filter(flag => flag.severity === "warning");

  return (
    <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
      {/* Progress Section */}
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900">Pathway Progress</h3>
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {completedSteps} of {totalSteps} steps completed
            </span>
            <span className="text-sm font-medium text-gray-700">
              {progress}%
            </span>
          </div>
          <div className="mt-2 relative">
            <div className="h-2 bg-gray-100 rounded-full">
              <div
                className={`absolute left-0 h-2 rounded-full ${
                  progress === 100 ? "bg-green-500" : "bg-blue-500"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Estimated Time */}
        {estimatedTimeRemaining && (
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <span>Estimated time remaining: {estimatedTimeRemaining}</span>
          </div>
        )}
      </div>

      {/* Red Flags Section */}
      {activeRedFlags.length > 0 && (
        <div className="p-6 space-y-4">
          <h4 className="text-lg font-medium text-gray-900">Active Red Flags</h4>
          <div className="space-y-3">
            {criticalFlags.map(flag => (
              <RedFlagAlert
                key={flag.id}
                redFlag={flag}
                onDismiss={
                  onRedFlagDismiss 
                    ? () => onRedFlagDismiss(flag.id)
                    : undefined
                }
              />
            ))}
            {warningFlags.map(flag => (
              <RedFlagAlert
                key={flag.id}
                redFlag={flag}
                onDismiss={
                  onRedFlagDismiss 
                    ? () => onRedFlagDismiss(flag.id)
                    : undefined
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* Next Actions Section */}
      {nextRequiredActions.length > 0 && (
        <div className="p-6">
          <h4 className="text-lg font-medium text-gray-900">Next Required Actions</h4>
          <ul className="mt-4 space-y-3">
            {nextRequiredActions.map((action, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                <span className="text-gray-600">{action}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* AI Assistant Button */}
      <div className="p-6">
        <button
          className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => {
            // TODO: Implement AI suggestion generation
            console.log("Generate AI suggestions");
          }}
        >
          <svg 
            className="w-5 h-5 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M13 10V3L4 14h7v7l9-11h-7z" 
            />
          </svg>
          Get AI Suggestions
        </button>
      </div>
    </div>
  );
};

export default PathwaySummaryCard;
