import React from 'react';

const DischargeChecklist: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Discharge Checklist</h2>
      
      <div className="space-y-4">
        <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
          <h3 className="text-xl font-semibold text-indigo-800 mb-4">Required Documentation</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <input type="checkbox" className="w-4 h-4 text-indigo-600" id="discharge-summary" />
              <label htmlFor="discharge-summary" className="ml-2 text-indigo-700">Discharge Summary</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" className="w-4 h-4 text-indigo-600" id="medication-list" />
              <label htmlFor="medication-list" className="ml-2 text-indigo-700">Medication List</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" className="w-4 h-4 text-indigo-600" id="follow-up-appointments" />
              <label htmlFor="follow-up-appointments" className="ml-2 text-indigo-700">Follow-up Appointments</label>
            </div>
              <label className="ml-2 text-indigo-700">Follow-up Appointments</label>
            </div>
          </div>
        </div>

        <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
          <h3 className="text-xl font-semibold text-indigo-800 mb-4">Patient Education</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <input type="checkbox" className="w-4 h-4 text-indigo-600" />
              <label className="ml-2 text-indigo-700">Medications Review</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" className="w-4 h-4 text-indigo-600" />
              <label className="ml-2 text-indigo-700">Warning Signs</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" className="w-4 h-4 text-indigo-600" />
              <label className="ml-2 text-indigo-700">Emergency Contacts</label>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default DischargeChecklist;
