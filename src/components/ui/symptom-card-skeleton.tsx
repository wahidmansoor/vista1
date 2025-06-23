import React from 'react';
import { Card, CardContent } from "./card";
import { Skeleton } from "./skeleton";
import { cn } from "@/lib/utils";

interface SymptomCardSkeletonProps {
  className?: string;
}

export function SymptomCardSkeleton({ className }: SymptomCardSkeletonProps) {
  return (
    <Card className={cn('palliative-card', className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-4 w-full mt-4" />
        <div className="mt-4 space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}