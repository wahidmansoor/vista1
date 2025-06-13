# CRITICAL FIXES - Execute BEFORE cleanup
# These files need to be created/fixed for the app to work

# 1. Create missing lib/utils.ts (imported 50+ times)
New-Item -Path "src\lib\utils.ts" -ItemType File -Force
Add-Content -Path "src\lib\utils.ts" -Value @"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
"@

# 2. Fix missing UI components directory
if (!(Test-Path "src\components\ui")) {
  New-Item -Path "src\components\ui" -ItemType Directory -Force
}

# 3. Create missing ErrorBoundary (choose working version)
if (Test-Path "src\components\ErrorBoundary_working.tsx") {
  Copy-Item "src\components\ErrorBoundary_working.tsx" "src\components\ErrorBoundary.tsx" -Force
} elseif (Test-Path "src\components\ErrorBoundary_fixed.tsx") {
  Copy-Item "src\components\ErrorBoundary_fixed.tsx" "src\components\ErrorBoundary.tsx" -Force
}

# 4. Create missing ErrorWrapper  
New-Item -Path "src\components\ErrorWrapper.tsx" -ItemType File -Force
Add-Content -Path "src\components\ErrorWrapper.tsx" -Value @"
import React from 'react';

interface ErrorWrapperProps {
  children: React.ReactNode;
}

export default function ErrorWrapper({ children }: ErrorWrapperProps) {
  return <div className="error-wrapper">{children}</div>;
}
"@

# 5. Create basic missing hooks
New-Item -Path "src\hooks\useUser.ts" -ItemType File -Force  
Add-Content -Path "src\hooks\useUser.ts" -Value @"
export function useUser() {
  return { user: null, isLoading: false, error: null };
}
"@

Write-Host "🔧 Critical fixes applied!" -ForegroundColor Green
Write-Host "⚠️  Review these files before running cleanup" -ForegroundColor Yellow
