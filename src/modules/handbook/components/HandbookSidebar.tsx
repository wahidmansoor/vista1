import { useState, useEffect } from "react";
import { ChevronRight, File, Folder, FolderOpen, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RawMarkdownViewer } from "@/components/MarkdownViewer/RawMarkdownViewer";
import ErrorBoundary from "@/components/ErrorBoundary";

interface UploadedFile {
  id: string;
  title: string;
  content: string;
}

interface HandbookSidebarProps {
  section: string | null;
  tocData: Record<string, Record<string, Record<string, string[]>>>;
  activeTopicId: string | null;
  onTopicClick: (section: string, topic: string) => void;
}

const formatTitle = (text: string) =>
  text
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

function SectionContent({
  chapterNumber,
  sectionName,
  topics,
  sectionIndex,
  section,
  activeTopicId,
  onTopicClick,
  isOpen: parentIsOpen,
  defaultOpen = true
}: {
  chapterNumber: number;
  sectionName: string;
  topics: string[];
  sectionIndex: number;
  section: string;
  activeTopicId: string | null;
  onTopicClick: (section: string, topic: string) => void;
  isOpen: boolean;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const hasTopics = topics.length > 0;

  // Auto-expand if section contains active topic
  useEffect(() => {
    if (activeTopicId && topics.some(topic => `${section}/${topic}` === activeTopicId)) {
      setIsOpen(true);
    }
  }, [activeTopicId, section, topics]);

  if (!parentIsOpen) return null;

  return (
    <div className="space-y-1">
      <button
        onClick={() => hasTopics && setIsOpen(!isOpen)}
        className={cn(
          "group flex items-center justify-between w-full",
          "px-4 py-1.5 text-left",
          "text-base font-semibold",
          "transition-colors duration-200",
          "hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent",
          "border-l-2 border-border",
          hasTopics ? "text-muted-foreground cursor-pointer" : "text-muted-foreground/70 cursor-default"
        )}
      >
        <span>
          {chapterNumber}.{sectionIndex + 1} {formatTitle(sectionName)}
        </span>
        {hasTopics && (
          <ChevronRight 
            className={cn(
              "h-4 w-4 text-muted-foreground/50",
              "transition-transform duration-300",
              "group-hover:text-foreground",
              isOpen && "rotate-90"
            )}
          />
        )}
      </button>

      {isOpen && hasTopics && (
        <ul className="pl-6 space-y-1 animate-in slide-in-from-left-1">
          {topics.map((topic, topicIndex) => {
            const topicId = `${section}/${topic}`;
            const isActive = activeTopicId === topicId;
            
            return (
              <li key={topic}>
                <button
                  onClick={() => onTopicClick(section, topic)}
                  className={cn(
                    "group w-full text-left px-3 py-1.5",
                    "rounded-md text-sm",
                    "transition-all duration-200",
                    "hover:bg-accent/30 focus:outline-none focus:ring-2 focus:ring-accent",
                    isActive ? 
                      "bg-primary/10 text-primary font-medium" : 
                      "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-medium opacity-60 tabular-nums">
                      {chapterNumber}.{sectionIndex + 1}.{topicIndex + 1}
                    </span>
                    <span className={cn(
                      "group-hover:underline",
                      isActive && "font-medium"
                    )}>
                      {formatTitle(topic)}
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function ChapterAccordion({
  chapterNumber,
  chapterName,
  sections,
  section,
  activeTopicId,
  onTopicClick,
  globalExpand,
}: {
  chapterNumber: number;
  chapterName: string;
  sections: Record<string, string[]>;
  section: string;
  activeTopicId: string | null;
  onTopicClick: (section: string, topic: string) => void;
  globalExpand: boolean;
}) {
  const [isOpen, setIsOpen] = useState(true);

  // Sync with global expand/collapse state
  useEffect(() => {
    setIsOpen(globalExpand);
  }, [globalExpand]);

  // Auto-expand if chapter contains active topic
  useEffect(() => {
    if (activeTopicId) {
      const hasActiveTopic = Object.entries(sections).some(([_, topics]) =>
        topics.some(topic => `${section}/${topic}` === activeTopicId)
      );
      if (hasActiveTopic) setIsOpen(true);
    }
  }, [activeTopicId, section, sections]);

  return (
    <div className="space-y-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "group flex items-center justify-between w-full",
          "px-3 py-2.5 text-left rounded-lg",
          "text-xl font-extrabold text-primary",
          "transition-all duration-200",
          "hover:text-primary/90 hover:bg-accent/20",
          "focus:outline-none focus:ring-2 focus:ring-primary/20"
        )}
        aria-expanded={isOpen}
      >
        <span>{chapterNumber}. {formatTitle(chapterName)}</span>
        <ChevronRight className={cn(
          "h-5 w-5 text-primary/60",
          "transition-transform duration-300 ease-in-out",
          "group-hover:text-primary",
          isOpen && "rotate-90"
        )} />
      </button>

      <div className={cn(
        "pl-3 space-y-5",
        "transition-all duration-300",
        isOpen ? "animate-in slide-in-from-left-2" : "hidden"
      )}>
        {Object.entries(sections).map(([sectionName, topics], sectionIndex) => (
          <SectionContent
            key={sectionName}
            chapterNumber={chapterNumber}
            sectionName={sectionName}
            topics={topics}
            sectionIndex={sectionIndex}
            section={section}
            activeTopicId={activeTopicId}
            onTopicClick={onTopicClick}
            isOpen={isOpen}
          />
        ))}
      </div>
    </div>
  );
}

export function HandbookSidebar({ 
  section, 
  tocData, 
  activeTopicId, 
  onTopicClick 
}: HandbookSidebarProps) {
  const [globalExpand, setGlobalExpand] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedUploadedFile, setSelectedUploadedFile] = useState<UploadedFile | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.name.endsWith('.md')) return;
    
    const text = await file.text();
    const newFile: UploadedFile = {
      id: Date.now().toString(),
      title: file.name.replace('.md', ''),
      content: text,
    };

    setUploadedFiles(prev => [...prev, newFile]);
    setSelectedUploadedFile(newFile);
  };

  return (
    <aside className="w-80 flex-shrink-0 p-4 border-r border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur supports-[backdrop-filter]:bg-white/50">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setGlobalExpand(!globalExpand)}
          className="text-muted-foreground"
        >
          <FolderOpen className="h-4 w-4 mr-2" />
          {globalExpand ? 'Collapse All' : 'Expand All'}
        </Button>
        
        <label className="flex items-center gap-2 px-2 py-1 text-sm text-primary hover:text-primary/80 cursor-pointer rounded transition-colors">
          <UploadCloud className="h-4 w-4" />
          <span className="text-xs">Upload MD</span>
          <input
            type="file"
            accept=".md"
            onChange={handleUpload}
            className="hidden"
          />
        </label>
      </div>

      <ScrollArea className="h-[calc(100vh-8rem)] pr-2">
        <nav className="space-y-8">
          {/* Temporary Uploads Section */}
          {uploadedFiles.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-medium text-muted-foreground mb-2 px-2">
                Temporary Uploads
              </h3>
              <ul className="space-y-1">
                {uploadedFiles.map((file) => (
                  <li key={file.id}>
                    <button
                      onClick={() => setSelectedUploadedFile(file)}
                      className={cn(
                        "w-full px-2 py-1 text-sm text-left rounded-md",
                        "hover:bg-accent hover:text-accent-foreground",
                        selectedUploadedFile?.id === file.id
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {file.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Regular Handbook Content */}
          {Object.entries(tocData[section ?? '']).map(([chapterName, sections], chapterIndex) => (
            <ChapterAccordion
              key={chapterName}
              chapterNumber={chapterIndex + 1}
              chapterName={chapterName}
              sections={sections}
              section={section ?? ''}
              activeTopicId={activeTopicId}
              onTopicClick={onTopicClick}
              globalExpand={globalExpand}
            />
          ))}
        </nav>
      </ScrollArea>

      {/* Preview Panel for Uploaded Files */}
      {selectedUploadedFile && (
        <div className="fixed top-0 right-0 w-[calc(100%-20rem)] h-screen bg-background p-6 overflow-auto border-l">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-lg font-medium mb-4">{selectedUploadedFile.title}</h2>
            <ErrorBoundary>
              <RawMarkdownViewer content={selectedUploadedFile.content} />
            </ErrorBoundary>
          </div>
        </div>
      )}
    </aside>
  );
}