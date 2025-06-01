import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';
import { CancerSelector } from './components/CancerSelector';
import { DiagnosticTimeline } from './components/DiagnosticTimeline';
import { PerformanceScoreChart } from './components/PerformanceScoreChart';
import { SmartFollowUpSummary } from './components/SmartFollowUpSummary';
import { mockDiagnosticEvents, mockPerformanceData } from './data/followUpData';
import { TNMStage, PerformanceStatus } from '../types/evaluation';
import { CancerType } from './data/followUpTemplates';
import { generateFollowUpPlan, Stage } from './logic/generateFollowUpPlan';
import ErrorBoundary from '@/components/ErrorBoundary';
import { callAIAgent } from '@/lib/api/aiAgentAPI';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import AIFollowUpAssistant from './components/AIFollowUpAssistant';

// Helper type and functions for mock data
type MockData<T> = {
  [K in CancerType]?: T;
};

function hasData<T>(data: MockData<T>, cancer: CancerType): boolean {
  return cancer in data;
}

function getMockData<T>(data: MockData<T>, cancer: CancerType): T | undefined {
  return hasData(data, cancer) ? data[cancer] : undefined;
}

const FollowUpOncology: React.FC = () => {
  const [mockMode, setMockMode] = useState(false);
  const [selectedCancer, setSelectedCancer] = useState<CancerType | null>(null);
  const [stage, setStage] = useState<TNMStage>({ t: '', n: '', m: '' });
  const [intent, setIntent] = useState<'curative' | 'palliative'>('curative');
  const [isLoading, setIsLoading] = useState(false);
  const [followUpPlan, setFollowUpPlan] = useState<any>(null);
  const [aiInsights, setAIInsights] = useState<string | null>(null);

  // Generate follow-up plan when cancer type changes
  useEffect(() => {
    if (selectedCancer) {
      setIsLoading(true);
      try {
        // Use stage directly since it already has the correct shape
        const plan = generateFollowUpPlan(selectedCancer, stage, intent);
        setFollowUpPlan(plan);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to generate follow-up plan. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
  }, [selectedCancer, stage, intent]);

  return (
    <ErrorBoundary>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Follow-up Oncology</h2>
          <button
            onClick={() => setMockMode(!mockMode)}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              mockMode ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
            }`}
          >
            {mockMode ? '🧪 Mock Mode' : '🤖 Gemini Mode'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <motion.div 
            className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <CancerSelector
              selected={selectedCancer}
              onSelect={setSelectedCancer}
            />
          </motion.div>

          {selectedCancer && !isLoading && (
            <>
              <motion.div 
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Card className="dark:bg-gray-900 shadow-lg">
                  <CardHeader>
                    <CardTitle>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>Diagnostic Timeline</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Key milestones in the diagnostic journey</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DiagnosticTimeline 
                      events={getMockData(mockDiagnosticEvents, selectedCancer) || []}
                    />
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div 
                className="lg:col-span-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Card className="dark:bg-gray-900 shadow-lg">
                  <CardHeader>
                    <CardTitle>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>Performance Score Trends</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>ECOG and KPS scores over time</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PerformanceScoreChart 
                      data={getMockData(mockPerformanceData, selectedCancer) || []}
                    />
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div 
                className="lg:col-span-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Card className="dark:bg-gray-900 shadow-lg">
                  <CardHeader>
                    <CardTitle>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>Smart Follow-Up Summary</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>AI-generated follow-up summary and recommendations</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SmartFollowUpSummary
                      cancerType={selectedCancer}
                      stage={`${stage.t}${stage.n}${stage.m}`}
                      tnmStage={stage}
                      diagnosisDate="2025-04-01"
                      currentECOG={0}
                      currentKPS={90}
                      onGenerate={async () => {
                        try {
                          const response = await callAIAgent({
                            module: 'OPD',
                            intent: 'follow-up',
                            prompt: "Generate a follow-up summary and recommendations",
                            context: `Cancer Type: ${selectedCancer}\nStage: ${stage.t}${stage.n}${stage.m}\nIntent: ${intent}`,
                            mockMode
                          });
                          return response.content;
                        } catch (error) {
                          console.error('Error generating AI summary:', error);
                          throw error;
                        }
                      }}
                    />
                    <AIFollowUpAssistant 
                      cancerType={selectedCancer}
                      stage={stage}
                      intent="follow-up"
                      plan={followUpPlan}
                      onInsightsReady={setAIInsights}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </>
          )}

          {isLoading && (
            <motion.div 
              className="flex justify-center items-center p-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="animate-pulse flex space-x-4">
                <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default FollowUpOncology;
