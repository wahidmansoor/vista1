
import React from "react";

const TreatmentProtocols = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-teal-500">Chemotherapy Treatment Protocols</h2>
      <div className="space-y-4">
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-indigo-600">Protocol 1:</strong> Description of chemotherapy protocol 1.
          </li>
          <li>
            <strong className="text-indigo-600">Protocol 2:</strong> Description of chemotherapy protocol 2.
          </li>
          <li>
            <strong className="text-indigo-600">Protocol 3:</strong> Description of chemotherapy protocol 3.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TreatmentProtocols;
