import React from 'react';

interface ScreeningCardProps {
  children: React.ReactNode;
}

const ScreeningCard: React.FC<ScreeningCardProps> = ({ children }) => {
  return (
    <div className="opd-card">
      <div className="opd-card-content">
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ScreeningCard;
