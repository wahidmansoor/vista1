import React from 'react';
import { AlertOctagon, ChevronDown, ChevronUp } from 'lucide-react';

interface Emergency {
  title: string;
  priority: 'high' | 'medium' | 'low';
  symptoms: string[];
  immediateActions: string[];
  monitoring: string[];
}

interface Props {
  emergency: Emergency;
}

export default function EmergencyCard({ emergency }: Props) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div 
      className="rounded-xl shadow-md hover:shadow-xl border border-gray-200/40 opacity-90 hover:opacity-100 hover:scale-102 transition-all duration-300 ease-in-out bg-gradient-to-br from-indigo-50/10 to-purple-50/10 backdrop-blur-lg">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-2">
            <AlertOctagon className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-900">{emergency.title}</h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white mt-1">
                High Priority
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 hover:shadow-md ${
              isExpanded ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50'
            }`}>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-900">Key Symptoms</h4>
              <ul className="mt-2 space-y-1">
                {emergency.symptoms.map((symptom, index) => (
                  <li 
                    key={index} 
                    className="text-gray-600 flex items-start text-sm p-2 rounded-lg bg-gradient-to-r from-indigo-50/30 to-purple-50/30">
                    <span className="mr-2">•</span>
                    {symptom}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900">Immediate Actions</h4>
              <ul className="mt-2 space-y-1">
                {emergency.immediateActions.map((action, index) => (
                  <li 
                    key={index} 
                    className="text-gray-600 flex items-start text-sm p-2 rounded-lg bg-gradient-to-r from-indigo-50/30 to-purple-50/30">
                    <span className="mr-2">{index + 1}.</span>
                    {action}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900">Monitoring</h4>
              <ul className="mt-2 space-y-1">
                {emergency.monitoring.map((item, index) => (
                  <li 
                    key={index} 
                    className="text-gray-600 flex items-start text-sm p-2 rounded-lg bg-gradient-to-r from-indigo-50/30 to-purple-50/30">
                    <span className="mr-2">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
