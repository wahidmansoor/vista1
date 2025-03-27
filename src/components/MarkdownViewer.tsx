import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

// Glossary (optional)
const glossary: Record<string, string> = {
  ECOG: "Eastern Cooperative Oncology Group performance status scale (0–5)",
  CTCAE: "Common Terminology Criteria for Adverse Events (toxicity grading)",
  OS: "Overall Survival (time from treatment to death)",
  PFS: "Progression-Free Survival",
  HCC: "Hepatocellular Carcinoma",
  TLS: "Tumor Lysis Syndrome",
};

interface Props {
  filePath: string;
}

export default function MarkdownViewer({ filePath }: Props) {
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch(filePath)
      .then((res) => res.text())
      .then((text) => setContent(text))
      .catch(() => setContent("⚠️ Error loading content."));
  }, [filePath]);

  return (
    <div className="markdown-content prose prose-blue max-w-none p-6 overflow-x-auto">
      <ReactMarkdown
        components={{
          text({ children }) {
            return (
              <>
                {String(children)
                  .split(/\b/)
                  .map((chunk, i) =>
                    glossary[chunk] ? (
                      <span
                        key={i}
                        className="relative group cursor-help border-b border-dotted border-blue-500"
                      >
                        {chunk}
                        <span className="absolute z-10 hidden group-hover:block bg-gray-800 text-white text-xs p-2 rounded shadow-md top-full mt-1 left-1/2 transform -translate-x-1/2 w-max max-w-xs">
                          {glossary[chunk]}
                        </span>
                      </span>
                    ) : (
                      <span key={i}>{chunk}</span>
                    )
                  )}
              </>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
