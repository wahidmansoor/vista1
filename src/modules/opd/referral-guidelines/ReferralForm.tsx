import React from 'react';

interface ReferralFormProps {
  formData: {
    age: string;
    symptoms: string;
    duration: string;
    clinicalFindings: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    age: string;
    symptoms: string;
    duration: string;
    clinicalFindings: string;
  }>>;
}

const ReferralForm: React.FC<ReferralFormProps> = ({ formData, setFormData }) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="age" className="block text-sm font-medium text-gray-700">
          Age
        </label>
        <input
          type="number"
          id="age"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          value={formData.age}
          onChange={(e) => setFormData((prev) => ({ ...prev, age: e.target.value }))}
        />
      </div>

      <div>
        <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700">
          Symptoms
        </label>
        <textarea
          id="symptoms"
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          value={formData.symptoms}
          onChange={(e) => setFormData((prev) => ({ ...prev, symptoms: e.target.value }))}
        />
      </div>

      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
          Duration of Symptoms
        </label>
        <input
          type="text"
          id="duration"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="e.g., 2 weeks"
          value={formData.duration}
          onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
        />
      </div>

      <div>
        <label htmlFor="clinicalFindings" className="block text-sm font-medium text-gray-700">
          Clinical Findings
        </label>
        <textarea
          id="clinicalFindings"
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          value={formData.clinicalFindings}
          onChange={(e) => setFormData((prev) => ({ ...prev, clinicalFindings: e.target.value }))}
        />
      </div>
    </div>
  );
};

export default ReferralForm;
