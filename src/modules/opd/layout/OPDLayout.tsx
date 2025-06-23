import React, { ReactNode } from 'react';
import '../styles/opd.css';

interface OPDLayoutProps {
  children: ReactNode;
}

const OPDLayout: React.FC<OPDLayoutProps> = ({ children }) => {
  return (
    <div className="opd-module">
      <div className="opd-content p-6">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default OPDLayout;
