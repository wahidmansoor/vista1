import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Test } from '@/types/protocol'; // Assuming Test type is imported

interface TestsSectionTabProps {
  tests?: string[] | Test[] | { baseline?: string[] | Test[]; monitoring?: string[] | Test[] };
  // Removed title prop as it's not used and not in the original brief for this step
}

const TestsSectionTab: React.FC<TestsSectionTabProps> = ({ tests }) => {
  const renderTestList = (testData: string[] | Test[] | undefined, listTitle: string) => {
    if (!testData || testData.length === 0) {
      return <p className="text-sm text-gray-500">No {listTitle.toLowerCase()} tests specified.</p>;
    }

    return (
      <div>
        <h4 className="font-semibold mb-1">{listTitle}</h4>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          {testData.map((test, index) => {
            if (typeof test === 'string') {
              return <li key={index}>{test}</li>;
            }
            // Assuming Test object has a 'name' or similar property to display
            // You might need to adjust this based on the actual structure of your Test type
            return <li key={index}>{(test as Test).name || JSON.stringify(test)}</li>; 
          })}
        </ul>
      </div>
    );
  };

  let baselineTests: string[] | Test[] | undefined = [];
  let monitoringTests: string[] | Test[] | undefined = [];

  if (tests) {
    if (Array.isArray(tests)) {
      // If tests is a direct array, assume it's for baseline or general monitoring
      // For simplicity, let's assign to baseline. Adjust if a different logic is needed.
      baselineTests = tests;
    } else {
      if (tests.baseline) {
        baselineTests = Array.isArray(tests.baseline) ? tests.baseline : [];
      }
      if (tests.monitoring) {
        monitoringTests = Array.isArray(tests.monitoring) ? tests.monitoring : [];
      }
    }
  }
  
  const hasBaselineTests = baselineTests && baselineTests.length > 0;
  const hasMonitoringTests = monitoringTests && monitoringTests.length > 0;

  if (!hasBaselineTests && !hasMonitoringTests) {
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">No testing information provided for this protocol.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Tests</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full" defaultValue="baseline">
          {hasBaselineTests && (
            <AccordionItem value="baseline">
              <AccordionTrigger>Baseline Tests</AccordionTrigger>
              <AccordionContent>
                {renderTestList(baselineTests, "Baseline")}
              </AccordionContent>
            </AccordionItem>
          )}
          {hasMonitoringTests && (
            <AccordionItem value="monitoring">
              <AccordionTrigger>Monitoring Tests</AccordionTrigger>
              <AccordionContent>
                {renderTestList(monitoringTests, "Monitoring")}
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default TestsSectionTab;
