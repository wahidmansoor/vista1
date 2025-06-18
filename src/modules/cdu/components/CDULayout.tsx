import React from 'react';

interface CDULayoutProps {
  children: React.ReactNode;
}

/**
 * CDU Layout Wrapper Component
 * Provides unified background gradient and styling for the CDU module
 */
const CDULayout: React.FC<CDULayoutProps> = ({ children }) => {  const patternUrl = "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E";

  return (
    <div className="cdu-container">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{ backgroundImage: `url("${patternUrl}")` }}
      />
      
      {/* Content Container */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default CDULayout;
