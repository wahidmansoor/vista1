import React from "react";
import { useNavigate } from "react-router-dom";

const ToolCard = ({ title, description, path }: { title: string; description: string; path: string }) => {
  const navigate = useNavigate();
  return (
    <div className="border rounded shadow-sm p-4 mb-4 bg-white">
      <h3 className="text-lg font-semibold mb-1 text-blue-700">{title}</h3>
      <p className="text-sm text-gray-600 mb-2">{description}</p>
      <button
        onClick={() => navigate(path)}
        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
      >
        Open
      </button>
    </div>
  );
};

const Tools = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Tools Dashboard</h2>

      <ToolCard
        title="Calculators"
        description="Quick-access oncology calculators (BSA, AUC, CrCl, ANC)"
        path="/tools/calculators"
      />

      <ToolCard
        title="Red Flags"
        description="Urgent clinical signs that require immediate attention"
        path="/tools/redflags"
      />
    </div>
  );
};

export default Tools;
