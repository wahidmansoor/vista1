import React from "react";
import type { Protocol } from "@/types/protocol";

interface TreatmentTabProps {
  treatment?: Protocol["treatment"];
}

const TreatmentTab: React.FC<TreatmentTabProps> = ({ treatment }) => {
  if (!treatment || !treatment.drugs || treatment.drugs.length === 0) {
    return <p className="text-muted-foreground">No treatment information available.</p>;
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg mb-2">Treatment Drugs</h3>      <div className="overflow-x-auto">
        <table className="w-full table-fixed divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Drug Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Dose</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Administration</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">Special Notes</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {treatment.drugs.map((drug, idx) => (              <tr key={idx}>
                <td className="px-4 py-2">{drug.name}</td>
                <td className="px-4 py-2">{drug.dose || "-"}</td>
                <td className="px-4 py-2 break-words">{drug.administration || "-"}</td>
                <td className="px-4 py-2 max-w-md">
                  {drug.special_notes && drug.special_notes.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1">
                      {drug.special_notes.map((note, noteIdx) => (
                        <li key={noteIdx} className="break-words">{note}</li>
                      ))}
                    </ul>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TreatmentTab;
