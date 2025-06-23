import React from 'react';

const ReferralCard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {children}
    </div>
  );
};

export default ReferralCard;
