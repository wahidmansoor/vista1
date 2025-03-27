import React from "react";

export default function PathwayCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-yellow-300 bg-yellow-50 p-4 rounded-md shadow-sm mb-4">
      <h3 className="text-md font-semibold text-yellow-700 mb-2">🧭 Diagnostic Pathways</h3>
      {children}
    </div>
  );
}
