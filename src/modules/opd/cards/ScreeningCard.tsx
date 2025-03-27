import React from "react";

export default function ScreeningCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-blue-300 bg-blue-50 p-4 rounded-md shadow-sm mb-4">
      <h3 className="text-md font-semibold text-blue-700 mb-2">🛡️ Cancer Screening</h3>
      {children}
    </div>
  );
}