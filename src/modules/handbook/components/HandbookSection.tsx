import { HandbookChapter } from './HandbookChapter';

interface HandbookSectionProps {
  title: string;
  sections: Record<string, string[]>;
  activeTopicId: string | null;
  onTopicClick: (section: string, topic: string) => void;
}

export function HandbookSection({
  title,
  sections,
  activeTopicId,
  onTopicClick
}: HandbookSectionProps) {
  const formatTitle = (text: string) => {
    return text
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="mb-6 last:mb-0">
      <div className="text-lg font-bold text-primary mb-2">
        {formatTitle(title)}
      </div>
      <div className="space-y-1 pl-2">
        {Object.entries(sections).map(([sectionName, topics]) => (
          <HandbookChapter
            key={sectionName}
            title={formatTitle(sectionName)}
            topics={topics}
            activeTopicId={activeTopicId}
            onTopicClick={(topic) => onTopicClick(sectionName, topic)}
            isOpen={false}
          />
        ))}
      </div>
      <div className="mt-4 border-b border-border dark:border-slate-700" />
    </div>
  );
}