import React from 'react';
import { Check, Circle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EvaluationSection } from '../../../types/enhanced-evaluation';

export interface StepperStep {
  id: number;
  title: string;
  description?: string;
  status: 'complete' | 'current' | 'upcoming' | 'error';
  completionRate?: number;
  requiredFields?: number;
  completedFields?: number;
  hasWarnings?: boolean;
}

interface EvaluationStepperProps {
  steps: StepperStep[];
  currentStep: number;
  onStepClick: (stepId: number) => void;
  orientation?: 'horizontal' | 'vertical';
  showProgress?: boolean;
  className?: string;
}

const StepIcon: React.FC<{ status: StepperStep['status']; stepNumber: number }> = ({ 
  status, 
  stepNumber 
}) => {
  const baseClasses = "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all duration-200";
  
  switch (status) {
    case 'complete':
      return (
        <div className={cn(baseClasses, "bg-green-500 text-white")}>
          <Check className="h-4 w-4" />
        </div>
      );
    case 'current':
      return (
        <div className={cn(baseClasses, "bg-indigo-600 text-white ring-4 ring-indigo-100")}>
          {stepNumber}
        </div>
      );
    case 'error':
      return (
        <div className={cn(baseClasses, "bg-red-500 text-white")}>
          <AlertTriangle className="h-4 w-4" />
        </div>
      );
    default:
      return (
        <div className={cn(baseClasses, "bg-gray-200 text-gray-500")}>
          {stepNumber}
        </div>
      );
  }
};

const StepConnector: React.FC<{ 
  isCompleted: boolean; 
  orientation: 'horizontal' | 'vertical' 
}> = ({ isCompleted, orientation }) => {
  const classes = cn(
    "transition-colors duration-200",
    orientation === 'horizontal' 
      ? "h-0.5 w-full" 
      : "w-0.5 h-8",
    isCompleted ? "bg-green-500" : "bg-gray-200"
  );
  
  return <div className={classes} />;
};

const ProgressBar: React.FC<{ completionRate: number }> = ({ completionRate }) => (
  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
    <div 
      className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500 ease-out"
      style={{ width: `${completionRate}%` }}
    />
  </div>
);

export const EvaluationStepper: React.FC<EvaluationStepperProps> = ({
  steps,
  currentStep,
  onStepClick,
  orientation = 'horizontal',
  showProgress = true,
  className
}) => {
  const isHorizontal = orientation === 'horizontal';
  
  return (
    <nav 
      className={cn(
        "bg-white border border-gray-200 rounded-lg p-4",
        isHorizontal ? "w-full" : "w-64 h-fit",
        className
      )}
      aria-label="Evaluation progress"
    >
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-900">Evaluation Progress</h3>
        <p className="text-xs text-gray-500 mt-1">
          {steps.filter(s => s.status === 'complete').length} of {steps.length} sections complete
        </p>
      </div>
      
      <ol className={cn(
        "space-y-0",
        isHorizontal 
          ? "flex items-center justify-between" 
          : "space-y-4"
      )}>
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          const isClickable = step.status !== 'upcoming' || index <= currentStep;
          
          return (
            <li 
              key={step.id}
              className={cn(
                isHorizontal ? "flex-1" : "relative",
                isClickable && "cursor-pointer group"
              )}
              onClick={() => isClickable && onStepClick(step.id)}
            >
              <div className={cn(
                "flex items-center",
                isHorizontal ? "flex-col" : "flex-row space-x-3"
              )}>
                {!isHorizontal && !isLast && (
                  <div className="absolute left-4 top-8 h-full">
                    <StepConnector 
                      isCompleted={step.status === 'complete'} 
                      orientation="vertical" 
                    />
                  </div>
                )}
                
                <div className={cn(
                  "relative z-10",
                  isHorizontal && "mb-2"
                )}>
                  <StepIcon status={step.status} stepNumber={step.id} />
                  {step.hasWarnings && (
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-yellow-400 rounded-full flex items-center justify-center">
                      <AlertTriangle className="h-2 w-2 text-white" />
                    </div>
                  )}
                </div>
                
                <div className={cn(
                  "text-center",
                  isHorizontal ? "w-full" : "flex-1 min-w-0"
                )}>
                  <h4 className={cn(
                    "text-sm font-medium transition-colors",
                    step.status === 'current' ? "text-indigo-600" : "text-gray-900",
                    isClickable && "group-hover:text-indigo-600"
                  )}>
                    {step.title}
                  </h4>
                  
                  {step.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {step.description}
                    </p>
                  )}
                  
                  {showProgress && step.completionRate !== undefined && (
                    <ProgressBar completionRate={step.completionRate} />
                  )}
                  
                  {step.requiredFields && step.completedFields !== undefined && (
                    <p className="text-xs text-gray-400 mt-1">
                      {step.completedFields}/{step.requiredFields} fields
                    </p>
                  )}
                </div>
                
                {isHorizontal && !isLast && (
                  <div className="absolute top-4 left-8 right-0 flex justify-center">
                    <StepConnector 
                      isCompleted={step.status === 'complete'} 
                      orientation="horizontal" 
                    />
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      
      {/* Overall Progress Summary */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>Overall Progress</span>
          <span>
            {Math.round((steps.filter(s => s.status === 'complete').length / steps.length) * 100)}%
          </span>
        </div>
        <ProgressBar 
          completionRate={(steps.filter(s => s.status === 'complete').length / steps.length) * 100} 
        />
      </div>
    </nav>
  );
};

export default EvaluationStepper;
