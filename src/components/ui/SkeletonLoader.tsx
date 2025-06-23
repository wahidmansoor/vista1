import React from "react";
import { cn } from "@/lib/utils";

export function SkeletonLoader() {
  return (
    <div className="animate-pulse space-y-4">
      {/* Title */}
      <div className="h-8 bg-muted/60 rounded-md w-3/4" />
      
      {/* Subtitle/metadata */}
      <div className="h-6 bg-muted/60 rounded-md w-5/6" />
      
      {/* Content blocks */}
      <div className="space-y-3">
        <div className="h-4 bg-muted/60 rounded w-full" />
        <div className="h-4 bg-muted/60 rounded w-[95%]" />
        <div className="h-4 bg-muted/60 rounded w-[98%]" />
      </div>

      {/* Table-like structure */}
      <div className="h-32 bg-muted/60 rounded-md" />
      
      {/* More paragraphs */}
      <div className="space-y-3">
        <div className="h-4 bg-muted/60 rounded w-[90%]" />
        <div className="h-4 bg-muted/60 rounded w-[94%]" />
        <div className="h-4 bg-muted/60 rounded w-[85%]" />
      </div>

      {/* Code block */}
      <div className="h-24 bg-muted/60 rounded-md" />
    </div>
  );
}