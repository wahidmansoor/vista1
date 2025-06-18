import React from 'react';

const PathwayCard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
      {children}
    </div>
  );
};

export default PathwayCard;
