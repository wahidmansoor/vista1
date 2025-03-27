import React from "react";

export default function ReferralCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-purple-300 bg-purple-50 p-4 rounded-md shadow-sm mb-4">
      <h3 className="text-md font-semibold text-purple-700 mb-2">📤 Referral Guidelines</h3>
      {children}
    </div>
  );
}