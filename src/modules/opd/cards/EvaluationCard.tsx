import React from 'react';

interface EvaluationCardProps {
  children: React.ReactNode;
}

const EvaluationCard: React.FC<EvaluationCardProps> = ({ children }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="p-6">
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default EvaluationCard;
