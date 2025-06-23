import { useEffect, useState } from "react";
import { RawMarkdownViewer } from "@/components/MarkdownViewer/RawMarkdownViewer";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function PalliativeHandbookViewer({ filePath }: { filePath: string }) {
  return (
    <ErrorBoundary>
      <RawMarkdownViewer filePath={filePath} />
    </ErrorBoundary>
  );
}
