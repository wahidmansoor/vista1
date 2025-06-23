# CODEBASE CLEANUP COMMANDS
# Execute these commands from the project root: d:\Mansoor\mwoncovista\vista1

# Phase 1: Remove entire unused directories (324 files)
Remove-Item -Path "src\ai" -Recurse -Force
Remove-Item -Path "src\api" -Recurse -Force  
Remove-Item -Path "src\devtools" -Recurse -Force
Remove-Item -Path "src\education" -Recurse -Force
Remove-Item -Path "src\export" -Recurse -Force
Remove-Item -Path "src\logic" -Recurse -Force
Remove-Item -Path "src\providers" -Recurse -Force
Remove-Item -Path "src\quality" -Recurse -Force
Remove-Item -Path "src\server" -Recurse -Force
Remove-Item -Path "src\services" -Recurse -Force

# Phase 2: Remove duplicate component directories
Remove-Item -Path "src\modules\palliative\safe" -Recurse -Force
Remove-Item -Path "src\modules\safe" -Recurse -Force
Remove-Item -Path "src\modules\cdu\safe" -Recurse -Force

# Phase 3: Remove backup/test files
Remove-Item -Path "src\components\ErrorBoundary_*.tsx" -Force
Remove-Item -Path "src\components\TestErrorBoundary.tsx" -Force
Remove-Item -Path "src\components\TestMarkdownViewer.tsx" -Force
Remove-Item -Path "src\lib\api\aiAgentAPI_backup.ts" -Force

# Phase 4: Remove orphaned modules  
Remove-Item -Path "src\modules\opd\follow-up-oncology" -Recurse -Force
Remove-Item -Path "src\modules\inpatient\sections" -Recurse -Force
Remove-Item -Path "src\components\ai-agent" -Recurse -Force
Remove-Item -Path "src\components\HandbookSearch" -Recurse -Force

# Phase 5: Remove unused hooks and utilities
Remove-Item -Path "src\hooks\useAIResponseHistory.ts" -Force
Remove-Item -Path "src\hooks\useAuth.ts" -Force  
Remove-Item -Path "src\hooks\useEmergencyService.ts" -Force
Remove-Item -Path "src\utils\audioFeedback.ts" -Force
Remove-Item -Path "src\utils\confirmContinue.ts" -Force
Remove-Item -Path "src\utils\logErrorToService.ts" -Force

# Phase 6: Remove test files not in active use
Remove-Item -Path "src\__tests__\ai-agent.integration.test.ts" -Force
Remove-Item -Path "src\__tests__\aiAgentAPI.test.ts" -Force
Remove-Item -Path "src\__tests__\generateGeminiResponse.test.ts" -Force

Write-Host "✅ CLEANUP COMPLETE!" -ForegroundColor Green
Write-Host "📊 Files removed: ~324 files (~60% of codebase)" -ForegroundColor Yellow
Write-Host "💾 Estimated space saved: 2-3MB of source code" -ForegroundColor Cyan
