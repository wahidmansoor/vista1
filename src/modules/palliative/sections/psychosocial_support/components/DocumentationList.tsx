import React from 'react';
import { BookOpen } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface DocumentationGuideline {
  id: string;
  title: string;
  content: string;
}

interface DocumentationListProps {
  guidelines: DocumentationGuideline[];
}

export const DocumentationList: React.FC<DocumentationListProps> = ({ guidelines }) => {
  return (
    <Accordion type="multiple" className="w-full">
      {guidelines.map((guideline: DocumentationGuideline, index: number) => (
        <AccordionItem 
          key={guideline.id} 
          value={guideline.id}
          className="border border-gray-200 dark:border-gray-700 rounded-lg mb-3"
        >
          <AccordionTrigger className="px-4 py-3 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/50 rounded-t-lg data-[state=open]:rounded-b-none">
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
              <span className="font-medium text-gray-800 dark:text-gray-200">{guideline.title}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pt-2 pb-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            <p>{guideline.content}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export type { DocumentationGuideline };