import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Clock } from 'lucide-react';

interface AssessmentTool {
  id: string;
  name: string;
  description: string;
  tags: string[];
  recommendation: string;
}

interface AssessmentToolCardProps {
  tool: AssessmentTool;
}

export const AssessmentToolCard: React.FC<AssessmentToolCardProps> = ({ tool }) => {
  return (
    <div className="space-y-2 pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
      <div className="flex flex-wrap items-center gap-2 mb-1">
        <h4 className="text-base font-medium text-gray-800 dark:text-gray-200">{tool.name}</h4>
        <div className="flex flex-wrap gap-1">
          {tool.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{tool.description}</p>
      <div className="flex items-start gap-2 mt-2 bg-indigo-50/50 dark:bg-indigo-950/50 p-2 rounded-md">
        <Clock className="h-4 w-4 text-indigo-500 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-gray-600 dark:text-gray-400">{tool.recommendation}</p>
      </div>
    </div>
  );
};

export type { AssessmentTool };