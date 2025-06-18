import React from 'react';

interface ScreeningCardProps {
  children: React.ReactNode;
}

const ScreeningCard: React.FC<ScreeningCardProps> = ({ children }) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
      <div className="p-6">
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ScreeningCard;
