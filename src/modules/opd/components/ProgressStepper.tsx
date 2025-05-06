import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface Step {
  id: number;
  name: string;
  description: string;
  status: 'complete' | 'current' | 'upcoming';
}

interface ProgressStepperProps {
  steps: Step[];
  currentStep: number;
}

export const ProgressStepper: React.FC<ProgressStepperProps> = ({ steps, currentStep }) => {
  return (
    <nav aria-label="Progress" className="mb-8">
      <ol className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li key={step.id} className={`relative ${stepIdx !== steps.length - 1 ? 'flex-1' : ''}`}>
            {step.status === 'complete' ? (
              <motion.div 
                className="group"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <span className="flex items-center">
                  <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600">
                    <Check className="h-5 w-5 text-white" aria-hidden="true" />
                  </span>
                  <span className="ml-3 text-sm font-medium text-gray-900">{step.name}</span>
                </span>
              </motion.div>
            ) : step.status === 'current' ? (
              <motion.div 
                className="flex items-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <span className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-indigo-600">
                  <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
                </span>
                <span className="ml-3 text-sm font-medium text-indigo-600">{step.name}</span>
              </motion.div>
            ) : (
              <div className="flex items-center">
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300">
                  <span className="h-2.5 w-2.5 rounded-full bg-transparent" />
                </div>
                <span className="ml-3 text-sm font-medium text-gray-500">{step.name}</span>
              </div>
            )}

            {stepIdx !== steps.length - 1 && (
              <>
                {/* Separator Line */}
                <div className="absolute left-4 top-4 -ml-px mt-0.5 h-0.5 w-full bg-gray-300">
                  <div
                    className="h-full bg-indigo-600 transition-all duration-500"
                    style={{ width: step.status === 'complete' ? '100%' : '0%' }}
                  />
                </div>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};