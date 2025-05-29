# PowerShell script to create all remaining JSON files for radiation oncology handbook

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

# Physics files (missing ones)
Create-JSONFile "$basePath\fundamentals\physics\Neutron-and-Proton-Therapy-Physics.json" "Neutron and Proton Therapy Physics" "Fundamentals" "Physics"
Create-JSONFile "$basePath\fundamentals\physics\Radiation-Protection-and-Safety.json" "Radiation Protection and Safety" "Fundamentals" "Physics"

# Equipment files (all missing)
Create-JSONFile "$basePath\fundamentals\equipment\Linear-Accelerators.json" "Linear Accelerators" "Fundamentals" "Equipment"
Create-JSONFile "$basePath\fundamentals\equipment\Cobalt-60-Units.json" "Cobalt-60 Units" "Fundamentals" "Equipment"
Create-JSONFile "$basePath\fundamentals\equipment\Brachytherapy-Sources-and-Applicators.json" "Brachytherapy Sources and Applicators" "Fundamentals" "Equipment"
Create-JSONFile "$basePath\fundamentals\equipment\CT-Simulators.json" "CT Simulators" "Fundamentals" "Equipment"
Create-JSONFile "$basePath\fundamentals\equipment\MRI-and-PET-Integration.json" "MRI and PET Integration" "Fundamentals" "Equipment"
Create-JSONFile "$basePath\fundamentals\equipment\Treatment-Planning-Systems.json" "Treatment Planning Systems" "Fundamentals" "Equipment"
Create-JSONFile "$basePath\fundamentals\equipment\Portal-Imaging-and-IGRT-Systems.json" "Portal Imaging and IGRT Systems" "Fundamentals" "Equipment"
Create-JSONFile "$basePath\fundamentals\equipment\Respiratory-Motion-Management.json" "Respiratory Motion Management" "Fundamentals" "Equipment"
Create-JSONFile "$basePath\fundamentals\equipment\Calibration-and-Commissioning.json" "Calibration and Commissioning" "Fundamentals" "Equipment"

# Dosimetry files (all missing)
Create-JSONFile "$basePath\fundamentals\dosimetry\Dose-Measurement-Principles.json" "Dose Measurement Principles" "Fundamentals" "Dosimetry"
Create-JSONFile "$basePath\fundamentals\dosimetry\Dosimetric-Quantities-and-Units.json" "Dosimetric Quantities and Units" "Fundamentals" "Dosimetry"
Create-JSONFile "$basePath\fundamentals\dosimetry\Ion-Chamber-Dosimetry.json" "Ion Chamber Dosimetry" "Fundamentals" "Dosimetry"
Create-JSONFile "$basePath\fundamentals\dosimetry\TLD-and-OSLD-Systems.json" "TLD and OSLD Systems" "Fundamentals" "Dosimetry"
Create-JSONFile "$basePath\fundamentals\dosimetry\Diode-and-Diamond-Detectors.json" "Diode and Diamond Detectors" "Fundamentals" "Dosimetry"
Create-JSONFile "$basePath\fundamentals\dosimetry\Film-Dosimetry.json" "Film Dosimetry" "Fundamentals" "Dosimetry"
Create-JSONFile "$basePath\fundamentals\dosimetry\Gel-Dosimetry.json" "Gel Dosimetry" "Fundamentals" "Dosimetry"
Create-JSONFile "$basePath\fundamentals\dosimetry\In-Vivo-Dosimetry.json" "In-Vivo Dosimetry" "Fundamentals" "Dosimetry"
Create-JSONFile "$basePath\fundamentals\dosimetry\Small-Field-Dosimetry.json" "Small Field Dosimetry" "Fundamentals" "Dosimetry"
Create-JSONFile "$basePath\fundamentals\dosimetry\Reference-Dosimetry-Protocols.json" "Reference Dosimetry Protocols" "Fundamentals" "Dosimetry"

# Brachytherapy files (all missing)
Create-JSONFile "$basePath\techniques\brachytherapy\Introduction-to-Brachytherapy.json" "Introduction to Brachytherapy" "Techniques" "Brachytherapy"
Create-JSONFile "$basePath\techniques\brachytherapy\Low-Dose-Rate-Brachytherapy.json" "Low Dose Rate Brachytherapy" "Techniques" "Brachytherapy"
Create-JSONFile "$basePath\techniques\brachytherapy\High-Dose-Rate-Brachytherapy.json" "High Dose Rate Brachytherapy" "Techniques" "Brachytherapy"
Create-JSONFile "$basePath\techniques\brachytherapy\Pulsed-Dose-Rate-Brachytherapy.json" "Pulsed Dose Rate Brachytherapy" "Techniques" "Brachytherapy"
Create-JSONFile "$basePath\techniques\brachytherapy\Permanent-Seed-Implants.json" "Permanent Seed Implants" "Techniques" "Brachytherapy"
Create-JSONFile "$basePath\techniques\brachytherapy\Intracavitary-Techniques.json" "Intracavitary Techniques" "Techniques" "Brachytherapy"
Create-JSONFile "$basePath\techniques\brachytherapy\Interstitial-Techniques.json" "Interstitial Techniques" "Techniques" "Brachytherapy"
Create-JSONFile "$basePath\techniques\brachytherapy\Intravascular-Brachytherapy.json" "Intravascular Brachytherapy" "Techniques" "Brachytherapy"
Create-JSONFile "$basePath\techniques\brachytherapy\Electronic-Brachytherapy.json" "Electronic Brachytherapy" "Techniques" "Brachytherapy"
Create-JSONFile "$basePath\techniques\brachytherapy\Brachytherapy-Dosimetry-Systems.json" "Brachytherapy Dosimetry Systems" "Techniques" "Brachytherapy"

# Stereotactic files (all missing)
Create-JSONFile "$basePath\techniques\stereotactic\Stereotactic-Radiosurgery-Principles.json" "Stereotactic Radiosurgery Principles" "Techniques" "Stereotactic"
Create-JSONFile "$basePath\techniques\stereotactic\Gamma-Knife-Radiosurgery.json" "Gamma Knife Radiosurgery" "Techniques" "Stereotactic"
Create-JSONFile "$basePath\techniques\stereotactic\Linear-Accelerator-SRS.json" "Linear Accelerator SRS" "Techniques" "Stereotactic"
Create-JSONFile "$basePath\techniques\stereotactic\CyberKnife-System.json" "CyberKnife System" "Techniques" "Stereotactic"
Create-JSONFile "$basePath\techniques\stereotactic\Stereotactic-Body-Radiation-Therapy.json" "Stereotactic Body Radiation Therapy" "Techniques" "Stereotactic"
Create-JSONFile "$basePath\techniques\stereotactic\Fractionated-Stereotactic-Radiotherapy.json" "Fractionated Stereotactic Radiotherapy" "Techniques" "Stereotactic"
Create-JSONFile "$basePath\techniques\stereotactic\Stereotactic-Localization-Systems.json" "Stereotactic Localization Systems" "Techniques" "Stereotactic"
Create-JSONFile "$basePath\techniques\stereotactic\Motion-Management-in-SBRT.json" "Motion Management in SBRT" "Techniques" "Stereotactic"
Create-JSONFile "$basePath\techniques\stereotactic\Dose-and-Fractionation-Schedules.json" "Dose and Fractionation Schedules" "Techniques" "Stereotactic"

# Image Guided files (all missing)
Create-JSONFile "$basePath\techniques\image-guided\Image-Guided-Radiation-Therapy-Overview.json" "Image Guided Radiation Therapy Overview" "Techniques" "Image Guided"
Create-JSONFile "$basePath\techniques\image-guided\Portal-Imaging-Systems.json" "Portal Imaging Systems" "Techniques" "Image Guided"
Create-JSONFile "$basePath\techniques\image-guided\Cone-Beam-CT.json" "Cone Beam CT" "Techniques" "Image Guided"
Create-JSONFile "$basePath\techniques\image-guided\MRI-Guided-Radiation-Therapy.json" "MRI Guided Radiation Therapy" "Techniques" "Image Guided"
Create-JSONFile "$basePath\techniques\image-guided\Ultrasound-Guidance.json" "Ultrasound Guidance" "Techniques" "Image Guided"
Create-JSONFile "$basePath\techniques\image-guided\Optical-Surface-Monitoring.json" "Optical Surface Monitoring" "Techniques" "Image Guided"
Create-JSONFile "$basePath\techniques\image-guided\Fiducial-Marker-Systems.json" "Fiducial Marker Systems" "Techniques" "Image Guided"
Create-JSONFile "$basePath\techniques\image-guided\Real-time-Tumor-Tracking.json" "Real-time Tumor Tracking" "Techniques" "Image Guided"
Create-JSONFile "$basePath\techniques\image-guided\Adaptive-Radiation-Therapy.json" "Adaptive Radiation Therapy" "Techniques" "Image Guided"
Create-JSONFile "$basePath\techniques\image-guided\IGRT-Protocols-and-Workflow.json" "IGRT Protocols and Workflow" "Techniques" "Image Guided"

Write-Host "Phase 1 completed: Created fundamental technique files"
