# PowerShell script to create toxicity and QA JSON files for radiation oncology handbook

# Base template for JSON files
$template = @"
{
  "title": "TITLE_PLACEHOLDER",
  "category": "CATEGORY_PLACEHOLDER",
  "section": "SECTION_PLACEHOLDER",
  "summary": "Clinical overview of TITLE_PLACEHOLDER in radiation oncology practice.",
  "content": [
    {
      "type": "overview",
      "heading": "Clinical Overview",
      "text": "Comprehensive guide to TITLE_PLACEHOLDER including indications, techniques, and clinical considerations."
    },
    {
      "type": "section",
      "heading": "Key Points",
      "text": "Important clinical pearls and practical considerations for TITLE_PLACEHOLDER."
    },
    {
      "type": "section",
      "heading": "Clinical Applications",
      "text": "Evidence-based applications and best practices in radiation oncology."
    },
    {
      "type": "section",
      "heading": "References",
      "text": "Current literature and guidelines supporting clinical practice."
    }
  ]
}
"@

# Function to create JSON file
function Create-JSONFile {
    param(
        [string]$filePath,
        [string]$title,
        [string]$category,
        [string]$section
    )
    
    $directory = Split-Path $filePath -Parent
    if (!(Test-Path $directory)) {
        New-Item -ItemType Directory -Path $directory -Force | Out-Null
    }
    
    if (!(Test-Path $filePath)) {
        $content = $template -replace "TITLE_PLACEHOLDER", $title
        $content = $content -replace "CATEGORY_PLACEHOLDER", $category
        $content = $content -replace "SECTION_PLACEHOLDER", $section
        
        Set-Content -Path $filePath -Value $content -Encoding UTF8
        Write-Host "Created: $filePath"
    }
}

$basePath = "d:\Mansoor\mwoncovista\vista1\public\radiation_oncology_handbook"

# Acute toxicity files (missing ones)
Create-JSONFile "$basePath\toxicities\acute\Diarrhea.json" "Diarrhea" "Toxicities" "Acute"
Create-JSONFile "$basePath\toxicities\acute\Hematologic-Toxicity.json" "Hematologic Toxicity" "Toxicities" "Acute"
Create-JSONFile "$basePath\toxicities\acute\Neurologic-Toxicity.json" "Neurologic Toxicity" "Toxicities" "Acute"

# Late toxicity files (missing ones)
Create-JSONFile "$basePath\toxicities\late\Nephrotoxicity.json" "Nephrotoxicity" "Toxicities" "Late"
Create-JSONFile "$basePath\toxicities\late\Endocrine-Dysfunction.json" "Endocrine Dysfunction" "Toxicities" "Late"
Create-JSONFile "$basePath\toxicities\late\Infertility.json" "Infertility" "Toxicities" "Late"
Create-JSONFile "$basePath\toxicities\late\Growth-and-Development.json" "Growth and Development" "Toxicities" "Late"
Create-JSONFile "$basePath\toxicities\late\Lymphedema.json" "Lymphedema" "Toxicities" "Late"

# Organ-specific toxicity files (all missing)
Create-JSONFile "$basePath\toxicities\organ-specific\Brain-Toxicity.json" "Brain Toxicity" "Toxicities" "Organ Specific"
Create-JSONFile "$basePath\toxicities\organ-specific\Spinal-Cord-Toxicity.json" "Spinal Cord Toxicity" "Toxicities" "Organ Specific"
Create-JSONFile "$basePath\toxicities\organ-specific\Lung-Toxicity.json" "Lung Toxicity" "Toxicities" "Organ Specific"
Create-JSONFile "$basePath\toxicities\organ-specific\Heart-Toxicity.json" "Heart Toxicity" "Toxicities" "Organ Specific"
Create-JSONFile "$basePath\toxicities\organ-specific\Liver-Toxicity.json" "Liver Toxicity" "Toxicities" "Organ Specific"
Create-JSONFile "$basePath\toxicities\organ-specific\Kidney-Toxicity.json" "Kidney Toxicity" "Toxicities" "Organ Specific"
Create-JSONFile "$basePath\toxicities\organ-specific\Bowel-Toxicity.json" "Bowel Toxicity" "Toxicities" "Organ Specific"
Create-JSONFile "$basePath\toxicities\organ-specific\Bladder-Toxicity.json" "Bladder Toxicity" "Toxicities" "Organ Specific"
Create-JSONFile "$basePath\toxicities\organ-specific\Bone-Marrow-Toxicity.json" "Bone Marrow Toxicity" "Toxicities" "Organ Specific"
Create-JSONFile "$basePath\toxicities\organ-specific\Lens-and-Eye-Toxicity.json" "Lens and Eye Toxicity" "Toxicities" "Organ Specific"
Create-JSONFile "$basePath\toxicities\organ-specific\Thyroid-Toxicity.json" "Thyroid Toxicity" "Toxicities" "Organ Specific"
Create-JSONFile "$basePath\toxicities\organ-specific\Gonadal-Toxicity.json" "Gonadal Toxicity" "Toxicities" "Organ Specific"

# Safety QA files (missing ones)
Create-JSONFile "$basePath\quality-assurance\safety\Radiation-Protection-Equipment.json" "Radiation Protection Equipment" "Quality Assurance" "Safety"
Create-JSONFile "$basePath\quality-assurance\safety\Area-Monitoring.json" "Area Monitoring" "Quality Assurance" "Safety"
Create-JSONFile "$basePath\quality-assurance\safety\Radioactive-Source-Security.json" "Radioactive Source Security" "Quality Assurance" "Safety"
Create-JSONFile "$basePath\quality-assurance\safety\Waste-Management.json" "Waste Management" "Quality Assurance" "Safety"
Create-JSONFile "$basePath\quality-assurance\safety\Safety-Training-Programs.json" "Safety Training Programs" "Quality Assurance" "Safety"

# Protocols QA files (missing ones)
Create-JSONFile "$basePath\quality-assurance\protocols\Monthly-QA-Procedures.json" "Monthly QA Procedures" "Quality Assurance" "Protocols"
Create-JSONFile "$basePath\quality-assurance\protocols\Annual-QA-Procedures.json" "Annual QA Procedures" "Quality Assurance" "Protocols"
Create-JSONFile "$basePath\quality-assurance\protocols\Imaging-QA-Protocols.json" "Imaging QA Protocols" "Quality Assurance" "Protocols"
Create-JSONFile "$basePath\quality-assurance\protocols\Brachytherapy-QA.json" "Brachytherapy QA" "Quality Assurance" "Protocols"
Create-JSONFile "$basePath\quality-assurance\protocols\TPS-QA-Procedures.json" "TPS QA Procedures" "Quality Assurance" "Protocols"

# Planning QA files (missing ones)
Create-JSONFile "$basePath\quality-assurance\planning\Plan-Evaluation-Metrics.json" "Plan Evaluation Metrics" "Quality Assurance" "Planning"
Create-JSONFile "$basePath\quality-assurance\planning\Plan-Complexity-Metrics.json" "Plan Complexity Metrics" "Quality Assurance" "Planning"
Create-JSONFile "$basePath\quality-assurance\planning\Independent-Dose-Calculation.json" "Independent Dose Calculation" "Quality Assurance" "Planning"
Create-JSONFile "$basePath\quality-assurance\planning\Pre-treatment-Verification.json" "Pre-treatment Verification" "Quality Assurance" "Planning"
Create-JSONFile "$basePath\quality-assurance\planning\Plan-Review-Checklists.json" "Plan Review Checklists" "Quality Assurance" "Planning"

Write-Host "Phase 4 completed: Created toxicity and QA files"

# Count total JSON files created
$jsonFiles = Get-ChildItem -Path "$basePath" -Recurse -Filter "*.json" | Where-Object { $_.Name -ne "toc.json" }
Write-Host "Total JSON files in radiation oncology handbook: $($jsonFiles.Count)"
