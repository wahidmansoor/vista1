import React, { ReactNode } from 'react';

interface OPDLayoutProps {
  children: ReactNode;
}

const OPDLayout: React.FC<OPDLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {children}
      </div>
    </div>
  );
};

export default OPDLayout;
