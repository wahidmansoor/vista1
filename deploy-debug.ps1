#!/usr/bin/env pwsh

Write-Host "🔧 Deploying Production Error Debugging Tools" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Please run from project root." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Building application with source maps..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build completed successfully!" -ForegroundColor Green

# Verify source maps were generated
Write-Host ""
Write-Host "🔍 Verifying source maps..." -ForegroundColor Yellow
$sourceMaps = Get-ChildItem -Path "dist/assets" -Filter "*.js.map" -Recurse
if ($sourceMaps.Count -gt 0) {
    Write-Host "✅ Source maps generated: $($sourceMaps.Count) files" -ForegroundColor Green
    $sourceMaps | ForEach-Object { Write-Host "  • $($_.Name)" -ForegroundColor Gray }
} else {
    Write-Host "❌ No source maps found! Check vite.config.ts" -ForegroundColor Red
    exit 1
}

# Verify critical debug files exist
Write-Host ""
Write-Host "🔍 Verifying debug infrastructure..." -ForegroundColor Yellow
$criticalFiles = @(
    "src/utils/errorTracking.ts",
    "src/pages/ErrorDebugPage.tsx", 
    "src/pages/ProductionErrorAnalyzer.tsx",
    "src/pages/ErrorTestPage.tsx"
)

foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ Missing: $file" -ForegroundColor Red
        exit 1
    }
}
Write-Host ""
Write-Host "🚀 Changes Applied:" -ForegroundColor Cyan
Write-Host "  • Source maps enabled for production debugging" -ForegroundColor White
Write-Host "  • Enhanced ErrorBoundary with better tracking" -ForegroundColor White
Write-Host "  • Global error tracking service initialized" -ForegroundColor White
Write-Host "  • Debug routes added: /debug/errors and /debug/analyzer" -ForegroundColor White
Write-Host "  • Production error analysis tools" -ForegroundColor White
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Deploy the 'dist' folder to your hosting service" -ForegroundColor White
Write-Host "  2. Navigate to /debug/analyzer to analyze your specific error" -ForegroundColor White
Write-Host "  3. Monitor /debug/errors for real-time error capture" -ForegroundColor White
Write-Host "  4. Check browser console for enhanced error information" -ForegroundColor White
Write-Host ""
Write-Host "🔍 Debug URLs:" -ForegroundColor Cyan
Write-Host "  • https://mwoncovista.com/debug/errors - Real-time error dashboard" -ForegroundColor White
Write-Host "  • https://mwoncovista.com/debug/analyzer - Error analysis tool" -ForegroundColor White
Write-Host "  • https://mwoncovista.com/debug/test - Error testing page" -ForegroundColor White
Write-Host ""
Write-Host "📊 Error Tracking:" -ForegroundColor Cyan
Write-Host "  • All errors are now automatically captured and stored" -ForegroundColor White
Write-Host "  • Enhanced context including user agent, URL, timestamp" -ForegroundColor White
Write-Host "  • Integration with LogRocket for production monitoring" -ForegroundColor White
Write-Host "  • Browser console: window.errorTracker for manual inspection" -ForegroundColor White
Write-Host ""
Write-Host "✨ Ready to deploy! The enhanced error tracking will help identify the production issue." -ForegroundColor Green
