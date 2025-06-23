import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HandbookChapterProps {
  title: string;
  topics: string[];
  isOpen?: boolean;
  activeTopicId: string | null;
  onTopicClick: (topic: string) => void;
}

export function HandbookChapter({
  title,
  topics,
  isOpen: defaultOpen = false,
  activeTopicId,
  onTopicClick
}: HandbookChapterProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-1 last:mb-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between w-full px-2 py-3",
          "text-lg font-semibold text-primary transition-colors",
          "hover:text-primary/80 focus:outline-none focus:ring-2",
          "focus:ring-primary/20 rounded-lg"
        )}
      >
        <span>{title}</span>
        <ChevronRight 
          className={cn(
            "w-5 h-5 transition-transform duration-200",
            isOpen && "rotate-90"
          )}
        />
      </button>

      <div
        className={cn(
          "grid transition-all duration-200 ease-in-out",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="space-y-1 py-1 pl-6">
            {topics.map((topic) => (
              <button
                key={topic}
                onClick={() => onTopicClick(topic)}
                className={cn(
                  "w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors",
                  "hover:text-primary hover:underline",
                  activeTopicId?.endsWith(topic)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground"
                )}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-1 border-b border-border dark:border-slate-700" />
    </div>
  );
}