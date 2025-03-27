import React from "react";

export default function FollowUpCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-indigo-300 bg-indigo-50 p-4 rounded-md shadow-sm mb-4">
      <h3 className="text-md font-semibold text-indigo-700 mb-2">📅 Follow-Up Oncology</h3>
      {children}
    </div>
  );
}
