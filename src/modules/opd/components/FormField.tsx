import React from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  tooltip?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  redFlags?: string[];
  rows?: number;
  inputClassName?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  tooltip,
  required = false,
  value,
  onChange,
  error = false,
  redFlags = [],
  rows = 3,
  inputClassName
}) => {
  const ariaAttributes: Record<string, string> = {};
  
  if (required) {
    ariaAttributes['aria-required'] = 'true';
  }
  
  if (error) {
    ariaAttributes['aria-invalid'] = 'true';
  }
  
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <label 
          htmlFor={id} 
          className="text-sm font-medium text-gray-900"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={tooltip}
        rows={rows}
        className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 ${
          error ? 'border-red-300 bg-red-50' : ''
        } ${inputClassName || ''}`}
        required={required}
        {...ariaAttributes}
      />
      {redFlags.length > 0 && (
        <div className="mt-1 text-sm text-red-600">
          Monitor for: {redFlags.join(', ')}
        </div>
      )}
    </div>
  );
};

export default FormField;