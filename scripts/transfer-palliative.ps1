# Create main palliative care directory structure
$baseDir = "D:\OncoVista\oncovista-dashboard-ready\public\oncology_handbook\palliative-care"
$sections = @(
    "pain-management",
    "symptom-control",
    "end-of-life",
    "communication",
    "psychosocial",
    "resources"
)

# Create directories
foreach ($section in $sections) {
    New-Item -Path "$baseDir\$section" -ItemType Directory -Force
}

# Copy files from old location to new location
$oldBase = "D:\OncoVista\oncovista-dashboard-ready\public\palliative_handbook"
$mapping = @{
    "pain" = "pain-management"
    "symptoms" = "symptom-control"
    "eol" = "end-of-life"
    "communication" = "communication"
    "psychosocial" = "psychosocial"
    "resources" = "resources"
}

foreach ($oldSection in $mapping.Keys) {
    $newSection = $mapping[$oldSection]
    Copy-Item "$oldBase\$oldSection\*.md" "$baseDir\$newSection\" -Force
}

# Rename files to match new structure if needed
Get-ChildItem $baseDir -Recurse -Filter *.md | ForEach-Object {
    $newName = $_.Name.ToLower().Replace(" ", "-")
    if ($_.Name -ne $newName) {
        Rename-Item $_.FullName $newName
    }
}

# Optional: Remove old directories after successful transfer
# Remove-Item "D:\OncoVista\oncovista-dashboard-ready\src\modules\palliative\handbook" -Recurse -Force
# Remove-Item "D:\OncoVista\oncovista-dashboard-ready\public\palliative_handbook" -Recurse -Force
