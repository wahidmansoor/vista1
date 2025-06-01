import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Test } from '@/types/protocol';

type TestItem = string | Test;
type TestGroup = TestItem[] | undefined;
type TestSections = { baseline?: TestGroup; monitoring?: TestGroup };

interface TestsSectionTabProps {
  tests?: TestGroup | TestSections;
  title?: string;
}

const isTest = (test: TestItem): test is Test => {
  return typeof test !== 'string' && 'name' in test;
};

const isTestSections = (tests: TestGroup | TestSections): tests is TestSections => {
  return !Array.isArray(tests) && typeof tests === 'object' && tests !== null;
};

const renderTestItem = (test: TestItem) => {
  return isTest(test) ? test.name : test;
};

const TestsSectionTab: React.FC<TestsSectionTabProps> = ({ tests, title = "Tests" }) => {
  const renderTestList = (testData: TestGroup, listTitle: string) => {
    if (!testData || testData.length === 0) {
      return <p className="text-sm text-gray-500">No {listTitle.toLowerCase()} tests specified.</p>;
    }

    return (
      <div>
        <h4 className="font-semibold mb-1">{listTitle}</h4>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          {testData.map((test, index) => (
            <li key={index}>{renderTestItem(test)}</li>
          ))}
        </ul>
      </div>
    );
  };

  let baselineTests: TestGroup = [];
  let monitoringTests: TestGroup = [];

  if (tests) {
    if (isTestSections(tests)) {
      baselineTests = tests.baseline;
      monitoringTests = tests.monitoring;
    } else if (Array.isArray(tests)) {
      baselineTests = tests;
    }
  }
  
  const hasBaselineTests = baselineTests && baselineTests.length > 0;
  const hasMonitoringTests = monitoringTests && monitoringTests.length > 0;

  if (!hasBaselineTests && !hasMonitoringTests) {
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
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
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
          {hasBaselineTests && ( // Corrected: was item-1 before
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
