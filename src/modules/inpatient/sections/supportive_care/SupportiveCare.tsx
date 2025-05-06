import React from 'react';

const SupportiveCare: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Supportive Care</h2>
      
      <div className="grid gap-4">
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-xl font-semibold text-green-800 mb-2">Pain Management</h3>
          <p className="text-green-700">Pain management protocols will be added here.</p>
        </div>

        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-xl font-semibold text-green-800 mb-2">Nutritional Support</h3>
          <p className="text-green-700">Nutritional support guidelines will be added here.</p>
        </div>

        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-xl font-semibold text-green-800 mb-2">Psychological Support</h3>
          <p className="text-green-700">Psychological support resources will be added here.</p>
        </div>
      </div>
    </div>
  );
};

export default SupportiveCare;
