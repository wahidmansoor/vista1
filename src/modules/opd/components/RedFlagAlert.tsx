import React from "react";
import { RedFlag } from "../../../types/cancer-pathways";
import { AlertTriangle, AlertCircle } from "lucide-react";

interface RedFlagAlertProps {
  redFlag: RedFlag;
  onDismiss?: () => void;
}

const RedFlagAlert: React.FC<RedFlagAlertProps> = ({ redFlag, onDismiss }) => {
  const { severity, message, condition, recommendations } = redFlag;

  return (
    <div className={`p-4 rounded-lg border ${
      severity === "critical" 
        ? "bg-red-50 border-red-300" 
        : "bg-yellow-50 border-yellow-300"
    }`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
          {severity === "critical" ? (
            <AlertCircle className="w-5 h-5 text-red-600" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className={`font-semibold ${
              severity === "critical" ? "text-red-800" : "text-yellow-800"
            }`}>
              {condition}
            </h3>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
          <p className={`mt-1 text-sm ${
            severity === "critical" ? "text-red-700" : "text-yellow-700"
          }`}>
            {message}
          </p>
          {recommendations && recommendations.length > 0 && (
            <div className="mt-3">
              <h4 className={`text-sm font-medium ${
                severity === "critical" ? "text-red-800" : "text-yellow-800"
              }`}>
                Recommendations:
              </h4>
              <ul className={`mt-2 text-sm space-y-1 list-disc list-inside ${
                severity === "critical" ? "text-red-700" : "text-yellow-700"
              }`}>
                {recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RedFlagAlert;
