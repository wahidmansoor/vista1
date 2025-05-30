import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Beaker, AlertCircle } from 'lucide-react';
import type { Protocol, Test } from '@/types/protocol';

interface TestsSectionTabProps {
  tests?: Array<Test> | { baseline?: string[]; monitoring?: string[] };
  protocol?: Protocol;
}

const TestsSectionTab: React.FC<TestsSectionTabProps> = ({ tests, protocol }) => {
  // Extract all tests from different protocol sections
  let baselineTests: Test[] | string[] = [];
  let ongoingTests: Test[] | string[] = [];
  let frequencyDetails = "";
  
  // If tests prop is provided directly, use that
  if (tests) {
    if (Array.isArray(tests)) {
      // If it's a plain array, treat as baseline tests
      baselineTests = tests;
    } else {
      // If it has baseline/monitoring structure
      baselineTests = tests.baseline || [];
      ongoingTests = tests.monitoring || [];
    }
  } 
  // Otherwise fall back to protocol.tests if available
  else if (protocol?.tests) {
    if (Array.isArray(protocol.tests)) {
      baselineTests = protocol.tests;
    } else {
      baselineTests = protocol.tests.baseline || [];
      ongoingTests = protocol.tests.monitoring || [];
      frequencyDetails = typeof protocol.tests.frequency === 'string' ? protocol.tests.frequency : "";
    }
  }
  
  // Check if we have any test data
  const hasTestData = baselineTests.length > 0 || ongoingTests.length > 0;
  
  // Function to render test information in a table
  const renderTestTable = (tests: Test[] | string[], title: string) => {
    if (!tests || tests.length === 0) return null;
    
    return (
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">{title}</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Test</TableHead>
              <TableHead>Parameters</TableHead>
              <TableHead>Timing</TableHead>
              <TableHead>Frequency</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tests.map((test, index) => {
              // Handle both string and object test items
              if (typeof test === 'string') {
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{test}</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                  </TableRow>
                );
              } else {
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{test.name}</TableCell>
                    <TableCell>
                      {test.parameters ? (
                        <ul className="list-disc list-inside">
                          {Array.isArray(test.parameters) ? 
                            test.parameters.map((param, idx) => <li key={idx}>{param}</li>) :
                            <li>{test.parameters}</li>
                          }
                        </ul>
                      ) : '-'}
                    </TableCell>
                    <TableCell>{test.timing || '-'}</TableCell>
                    <TableCell>{test.frequency || '-'}</TableCell>
                  </TableRow>
                );
              }
            })}
          </TableBody>
        </Table>
      </div>
    );
  };
  
  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center space-x-3 mb-6">
        <Beaker className="h-6 w-6 text-amber-500" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Tests & Monitoring</h2>
      </div>
      
      {!hasTestData ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-2 text-amber-500">
              <AlertCircle className="h-5 w-5" />
              <p>No test information available for this protocol.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {renderTestTable(baselineTests, "Baseline Tests")}
          {renderTestTable(ongoingTests, "Ongoing Tests")}
          
          {frequencyDetails && (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Frequency Details</h3>
              <p className="text-gray-700 dark:text-gray-300">{frequencyDetails}</p>
            </div>
          )}
          
          {/* Render monitoring instructions if available */}
          {protocol.monitoring && (
            <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-800">
              <h3 className="text-xl font-semibold mb-3">Monitoring Instructions</h3>
              {protocol.monitoring.baseline && protocol.monitoring.baseline.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-lg font-medium mb-2">Baseline Monitoring</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {protocol.monitoring.baseline.map((item, idx) => (
                      <li key={idx} className="text-gray-700 dark:text-gray-300">{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {protocol.monitoring.ongoing && protocol.monitoring.ongoing.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-lg font-medium mb-2">Ongoing Monitoring</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {protocol.monitoring.ongoing.map((item, idx) => (
                      <li key={idx} className="text-gray-700 dark:text-gray-300">{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {protocol.monitoring.frequency && (
                <div>
                  <h4 className="text-lg font-medium mb-2">Monitoring Frequency</h4>
                  <p className="text-gray-700 dark:text-gray-300">{protocol.monitoring.frequency}</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TestsSectionTab;
