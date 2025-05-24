import React from "react";

interface DoseModificationsTabProps {
  doseModifications?: Array<{
    condition?: string;
    modification?: string;
  }>;
}

const DoseModificationsTab: React.FC<DoseModificationsTabProps> = ({ doseModifications = [] }) => {
  if (!doseModifications || doseModifications.length === 0) {
    return <p className="text-muted-foreground">No dose modification information available.</p>;
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg mb-2">Dose Modification Guidelines</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Condition
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Recommended Modification
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {doseModifications.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-pre-line text-sm text-gray-900 dark:text-gray-100">
                  {item.condition || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-pre-line text-sm text-gray-500 dark:text-gray-400">
                  {item.modification || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoseModificationsTab;
