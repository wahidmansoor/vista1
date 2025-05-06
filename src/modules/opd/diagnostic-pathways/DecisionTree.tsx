import React, { useState, useEffect } from "react";
import { StepBasedPathway, PathwayProgress, PathwaySummaryCard as PathwaySummaryType } from "../../../types/cancer-pathways";
import PathwaySummaryCard from "../components/PathwaySummaryCard";
import { Info } from "lucide-react";

interface Props {
  pathway: StepBasedPathway;
}

const DecisionTree: React.FC<Props> = ({ pathway }) => {
  const [currentStepId, setCurrentStepId] = useState("initial");
  const [progress, setProgress] = useState<PathwayProgress>({
    completedSteps: [],
    currentStep: "initial",
    redFlagsTriggered: [],
    timeStarted: Date.now()
  });

  const currentStep = pathway.steps.find(step => step.id === currentStepId);

  // Calculate summary for the progress card
  const calculateSummary = (): PathwaySummaryType => {
    const totalSteps = pathway.steps.length;
    const completedSteps = progress.completedSteps.length;
    
    // Get active red flags from completed steps
    const activeRedFlags = pathway.steps
      .filter(step => progress.redFlagsTriggered.some(flagId => 
        step.redFlags?.some(flag => flag.id === flagId)
      ))
      .flatMap(step => step.redFlags || [])
      .filter(flag => progress.redFlagsTriggered.includes(flag.id));

    // Calculate estimated time remaining based on pathway recommendedTimeframe
    const estimatedTimeRemaining = pathway.recommendedTimeframe 
      ? `${pathway.recommendedTimeframe} (estimated)`
      : undefined;

    // Determine next actions based on current step
    const nextRequiredActions = currentStep 
      ? [currentStep.description, ...(currentStep.redFlags || []).flatMap(flag => flag.recommendations)]
      : [];

    return {
      totalSteps,
      completedSteps,
      activeRedFlags,
      estimatedTimeRemaining,
      nextRequiredActions
    };
  };

  const handleOptionSelect = (nextId: string, triggers?: string[]) => {
    // Track completed step
    setProgress(prev => ({
      ...prev,
      completedSteps: [...prev.completedSteps, currentStepId],
      currentStep: nextId,
      redFlagsTriggered: [
        ...prev.redFlagsTriggered,
        ...(triggers || [])
      ]
    }));
    setCurrentStepId(nextId);
  };

  const dismissRedFlag = (flagId: string) => {
    setProgress(prev => ({
      ...prev,
      redFlagsTriggered: prev.redFlagsTriggered.filter(id => id !== flagId)
    }));
  };

  if (!currentStep) {
    return (
      <div className="p-4 rounded-md bg-red-50 text-red-700">
        Error: Step not found for ID "{currentStepId}"
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Step Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{currentStep.title}</h2>
            <p className="mt-2 text-gray-700">{currentStep.description}</p>
          </div>
          {currentStep.tooltip && (
            <div className="group relative">
              <Info className="w-5 h-5 text-gray-400 hover:text-gray-500 cursor-help" />
              <div className="invisible group-hover:visible absolute right-0 w-64 p-2 mt-2 text-sm text-gray-600 bg-white rounded-lg shadow-lg border border-gray-200">
                {currentStep.tooltip}
              </div>
            </div>
          )}
        </div>

        {currentStep.expectedDuration && (
          <div className="mt-4 text-sm text-gray-600">
            Expected duration: {currentStep.expectedDuration}
          </div>
        )}
      </div>

      {/* Progress Summary */}
      <PathwaySummaryCard 
        summary={calculateSummary()} 
        onRedFlagDismiss={dismissRedFlag}
      />

      {/* Options */}
      <div className="space-y-4">
        {currentStep.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionSelect(option.next, option.triggers)}
            className="w-full py-3 px-4 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-left"
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DecisionTree;
