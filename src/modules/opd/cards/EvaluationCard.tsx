import React from "react";

export default function EvaluationCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-green-300 bg-green-50 p-4 rounded-md shadow-sm mb-4">
      <h3 className="text-md font-semibold text-green-700 mb-2">🧑‍⚕️ Patient Evaluation</h3>
      {children}
    </div>
  );
}
