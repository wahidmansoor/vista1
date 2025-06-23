# Comprehensive import analysis script
$rootPath = "d:\Mansoor\mwoncovista\vista1\src"
$allFiles = Get-ChildItem -Path $rootPath -Recurse -File -Name | Where-Object { $_ -match '\.(ts|tsx|js|jsx)$' }

Write-Host "=== PHASE 1: DEPENDENCY ANALYSIS ===" -ForegroundColor Cyan
Write-Host "Total TypeScript/JavaScript files: $($allFiles.Count)" -ForegroundColor Yellow

# Read all files and collect imports
$importMap = @{}
$fileContents = @{}

foreach ($file in $allFiles) {
    $fullPath = Join-Path $rootPath $file
    $content = Get-Content $fullPath -Raw -ErrorAction SilentlyContinue
    if ($content) {
        $fileContents[$file] = $content
        
        # Extract import statements
        $imports = [regex]::Matches($content, "import\s+.*?\s+from\s+['""]([^'""]+)['""]", [System.Text.RegularExpressions.RegexOptions]::Multiline)
        $dynamicImports = [regex]::Matches($content, "import\s*\(\s*['""]([^'""]+)['""]\s*\)", [System.Text.RegularExpressions.RegexOptions]::Multiline)
        
        $importMap[$file] = @()
        foreach ($import in $imports) {
            $importMap[$file] += $import.Groups[1].Value
        }
        foreach ($dynImport in $dynamicImports) {
            $importMap[$file] += $dynImport.Groups[1].Value
        }
    }
}

# Find files that are never imported
$importedFiles = @{}
foreach ($file in $importMap.Keys) {
    foreach ($import in $importMap[$file]) {
        # Clean up relative imports
        if ($import.StartsWith("./") -or $import.StartsWith("../")) {
            $resolvedPath = $import -replace "^\./", "" -replace "\.tsx?$", "" -replace "\.jsx?$", ""
            $importedFiles[$resolvedPath] = $true
        } elseif ($import.StartsWith("@/")) {
            $resolvedPath = $import -replace "^@/", "" -replace "\.tsx?$", "" -replace "\.jsx?$", ""
            $importedFiles[$resolvedPath] = $true
        }
    }
}

Write-Host "`n=== FILES NEVER IMPORTED ===" -ForegroundColor Red
$neverImported = @()
foreach ($file in $allFiles) {
    $fileWithoutExt = $file -replace "\.tsx?$", "" -replace "\.jsx?$", ""
    $isImported = $false
    
    # Check if this file is imported anywhere
    foreach ($key in $importedFiles.Keys) {
        if ($key -like "*$fileWithoutExt*" -or $fileWithoutExt -like "*$key*") {
            $isImported = $true
            break
        }
    }
    
    if (-not $isImported) {
        $neverImported += $file
        Write-Host "❌ $file" -ForegroundColor Red
    }
}

Write-Host "`n=== POTENTIAL DUPLICATES ===" -ForegroundColor Yellow
$duplicates = @{}
foreach ($file in $allFiles) {
    $baseName = [System.IO.Path]::GetFileNameWithoutExtension($file)
    if (-not $duplicates.ContainsKey($baseName)) {
        $duplicates[$baseName] = @()
    }
    $duplicates[$baseName] += $file
}

foreach ($key in $duplicates.Keys) {
    if ($duplicates[$key].Count -gt 1) {
        Write-Host "🔄 Multiple files with base name '$key':" -ForegroundColor Yellow
        foreach ($dup in $duplicates[$key]) {
            Write-Host "   - $dup" -ForegroundColor White
        }
    }
}

Write-Host "`n=== BROKEN IMPORT PATHS ===" -ForegroundColor Magenta
$brokenImports = @()
foreach ($file in $importMap.Keys) {
    foreach ($import in $importMap[$file]) {
        if ($import.StartsWith("./") -or $import.StartsWith("../") -or $import.StartsWith("@/")) {
            # Try to resolve the import
            $resolved = $import -replace "^@/", "" -replace "^\./", "" -replace "^../", ""
            $found = $false
            
            # Check if file exists with various extensions
            $possibleFiles = @("$resolved.ts", "$resolved.tsx", "$resolved.js", "$resolved.jsx", "$resolved/index.ts", "$resolved/index.tsx")
            foreach ($possible in $possibleFiles) {
                if ($allFiles -contains $possible) {
                    $found = $true
                    break
                }
            }
            
            if (-not $found) {
                $brokenImports += "❌ $file imports '$import' - NOT FOUND"
            }
        }
    }
}

foreach ($broken in $brokenImports | Select-Object -First 20) {
    Write-Host $broken -ForegroundColor Magenta
}

Write-Host "`n=== SUMMARY ===" -ForegroundColor Green
Write-Host "Total files: $($allFiles.Count)" -ForegroundColor White
Write-Host "Never imported: $($neverImported.Count)" -ForegroundColor Red
Write-Host "Potential broken imports: $($brokenImports.Count)" -ForegroundColor Magenta

# Output results to file
$results = @"
# CODEBASE AUDIT RESULTS

## Files Never Imported (Potential Dead Code)
$($neverImported | ForEach-Object { "- $_" } | Out-String)

## Potential Duplicates
$($duplicates.Keys | Where-Object { $duplicates[$_].Count -gt 1 } | ForEach-Object { 
    "### $_`n" + ($duplicates[$_] | ForEach-Object { "- $_" } | Out-String)
} | Out-String)

## Broken Import Paths
$($brokenImports | ForEach-Object { "- $_" } | Out-String)
"@

$results | Out-File "audit-results.md" -Encoding UTF8
Write-Host "`nResults saved to audit-results.md" -ForegroundColor Green
