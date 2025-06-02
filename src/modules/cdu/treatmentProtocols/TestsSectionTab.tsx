import React from "react";

type Test = {
  name?: string;
  timing?: string;
  notes?: string;
};

interface TestsSectionTabProps {
  tests?: Array<Test> | { baseline?: string[]; monitoring?: string[] };
}

// This component handles both test formats (array of test objects or object with baseline/monitoring arrays)
const TestsSectionTab: React.FC<TestsSectionTabProps> = ({ tests }) => {
  if (!tests) {
    return <p className="text-muted-foreground">No tests information available.</p>;
  }

  // Handle baseline/monitoring structure
  if (!Array.isArray(tests)) {
    const { baseline = [], monitoring = [] } = tests;
    
    if (baseline.length === 0 && monitoring.length === 0) {
      return <p className="text-muted-foreground">No tests information available.</p>;
    }
    
    return (
      <div className="space-y-6">
        {baseline.length > 0 && (
          <div>
            <h3 className="font-semibold text-lg mb-2">Baseline Tests</h3>
            <ul className="list-disc list-inside space-y-1">
              {baseline.map((test, idx) => (
                <li key={`baseline-${idx}`}>{test}</li>
              ))}
            </ul>
          </div>
        )}
        
        {monitoring.length > 0 && (
          <div>
            <h3 className="font-semibold text-lg mb-2">Ongoing Tests</h3>
            <ul className="list-disc list-inside space-y-1">
              {monitoring.map((test, idx) => (
                <li key={`monitoring-${idx}`}>{test}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
  
  // Handle array of test objects structure
  if (tests.length === 0) {
    return <p className="text-muted-foreground">No tests information available.</p>;
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg mb-2">Required Tests</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Test
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Timing
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Notes
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {tests.map((test, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {test.name || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {test.timing || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-pre-line text-sm text-gray-500 dark:text-gray-400">
                  {test.notes || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TestsSectionTab;
