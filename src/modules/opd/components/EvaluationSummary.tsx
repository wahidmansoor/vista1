import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { EvaluationTemplate } from '../types/evaluation';

interface EvaluationSummaryProps {
  template: EvaluationTemplate;
  formData: Record<string, string>;
}

export const EvaluationSummary: React.FC<EvaluationSummaryProps> = ({ template, formData }) => {
  const missingRequired = template.sections
    .flatMap((section, sIndex) => 
      section.items
        .map((item, iIndex) => ({
          item,
          id: `section-${sIndex}-item-${iIndex}`,
        }))
    )
    .filter(({ item, id }) => 
      item.required && (!formData[id] || formData[id].trim() === '')
    );

  const hasAllRequired = missingRequired.length === 0;

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h3 className="font-semibold text-gray-900 mb-3">Evaluation Summary</h3>

      {/* Required Fields Status */}
      <div className="flex items-center gap-2 mb-2">
        {hasAllRequired ? (
          <CheckCircle className="w-5 h-5 text-green-500" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-amber-500" />
        )}
        <span className={hasAllRequired ? "text-green-700" : "text-amber-700"}>
          {hasAllRequired 
            ? "All required fields are completed"
            : `${missingRequired.length} required field(s) need attention`}
        </span>
      </div>

      {/* Missing Required Fields */}
      {!hasAllRequired && (
        <div className="mt-2 pl-7">
          <ul className="list-disc text-sm text-amber-700">
            {missingRequired.map(({ item, id }) => (
              <li key={id}>{item.text}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Red Flags Check */}
      <div className="mt-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <span className="text-red-700 font-medium">Red Flag Checks</span>
        </div>
        <ul className="pl-7 list-disc text-sm text-red-700 space-y-1">
          {template.redFlags.map((flag, index) => (
            <li key={index}>{flag}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
