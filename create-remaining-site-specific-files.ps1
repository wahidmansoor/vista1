# PowerShell script to create remaining site-specific JSON files for radiation oncology handbook

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

# CNS site-specific files (missing ones)
Create-JSONFile "$basePath\site-specific\cns\Arteriovenous-Malformations.json" "Arteriovenous Malformations" "Site Specific" "CNS"
Create-JSONFile "$basePath\site-specific\cns\Pediatric-CNS-Tumors.json" "Pediatric CNS Tumors" "Site Specific" "CNS"
Create-JSONFile "$basePath\site-specific\cns\Spinal-Cord-Tumors.json" "Spinal Cord Tumors" "Site Specific" "CNS"
Create-JSONFile "$basePath\site-specific\cns\Prophylactic-Cranial-Irradiation.json" "Prophylactic Cranial Irradiation" "Site Specific" "CNS"

# Thoracic site-specific files (all missing)
Create-JSONFile "$basePath\site-specific\thoracic\Lung-Cancer-Overview.json" "Lung Cancer Overview" "Site Specific" "Thoracic"
Create-JSONFile "$basePath\site-specific\thoracic\Non-Small-Cell-Lung-Cancer.json" "Non-Small Cell Lung Cancer" "Site Specific" "Thoracic"
Create-JSONFile "$basePath\site-specific\thoracic\Small-Cell-Lung-Cancer.json" "Small Cell Lung Cancer" "Site Specific" "Thoracic"
Create-JSONFile "$basePath\site-specific\thoracic\Stereotactic-Lung-Radiotherapy.json" "Stereotactic Lung Radiotherapy" "Site Specific" "Thoracic"
Create-JSONFile "$basePath\site-specific\thoracic\Mesothelioma.json" "Mesothelioma" "Site Specific" "Thoracic"
Create-JSONFile "$basePath\site-specific\thoracic\Thymoma-and-Thymic-Tumors.json" "Thymoma and Thymic Tumors" "Site Specific" "Thoracic"
Create-JSONFile "$basePath\site-specific\thoracic\Esophageal-Cancer.json" "Esophageal Cancer" "Site Specific" "Thoracic"
Create-JSONFile "$basePath\site-specific\thoracic\Hodgkin-Lymphoma-Mediastinal.json" "Hodgkin Lymphoma Mediastinal" "Site Specific" "Thoracic"
Create-JSONFile "$basePath\site-specific\thoracic\Pulmonary-Metastases.json" "Pulmonary Metastases" "Site Specific" "Thoracic"
Create-JSONFile "$basePath\site-specific\thoracic\Respiratory-Motion-Management.json" "Respiratory Motion Management" "Site Specific" "Thoracic"
Create-JSONFile "$basePath\site-specific\thoracic\Lung-Dose-Constraints.json" "Lung Dose Constraints" "Site Specific" "Thoracic"

# Breast site-specific files (all missing)
Create-JSONFile "$basePath\site-specific\breast\Breast-Cancer-Radiation-Overview.json" "Breast Cancer Radiation Overview" "Site Specific" "Breast"
Create-JSONFile "$basePath\site-specific\breast\Adjuvant-Whole-Breast-Irradiation.json" "Adjuvant Whole Breast Irradiation" "Site Specific" "Breast"
Create-JSONFile "$basePath\site-specific\breast\Accelerated-Partial-Breast-Irradiation.json" "Accelerated Partial Breast Irradiation" "Site Specific" "Breast"
Create-JSONFile "$basePath\site-specific\breast\Post-Mastectomy-Radiation.json" "Post-Mastectomy Radiation" "Site Specific" "Breast"
Create-JSONFile "$basePath\site-specific\breast\Ductal-Carcinoma-In-Situ.json" "Ductal Carcinoma In Situ" "Site Specific" "Breast"
Create-JSONFile "$basePath\site-specific\breast\Inflammatory-Breast-Cancer.json" "Inflammatory Breast Cancer" "Site Specific" "Breast"
Create-JSONFile "$basePath\site-specific\breast\Male-Breast-Cancer.json" "Male Breast Cancer" "Site Specific" "Breast"
Create-JSONFile "$basePath\site-specific\breast\Breast-Lymphoma.json" "Breast Lymphoma" "Site Specific" "Breast"
Create-JSONFile "$basePath\site-specific\breast\Breast-Reconstruction-Considerations.json" "Breast Reconstruction Considerations" "Site Specific" "Breast"
Create-JSONFile "$basePath\site-specific\breast\Prone-Breast-Techniques.json" "Prone Breast Techniques" "Site Specific" "Breast"
Create-JSONFile "$basePath\site-specific\breast\Deep-Inspiration-Breath-Hold.json" "Deep Inspiration Breath Hold" "Site Specific" "Breast"

# Head and Neck site-specific files (all missing)
Create-JSONFile "$basePath\site-specific\head-neck\Head-and-Neck-Cancer-Overview.json" "Head and Neck Cancer Overview" "Site Specific" "Head and Neck"
Create-JSONFile "$basePath\site-specific\head-neck\Nasopharyngeal-Carcinoma.json" "Nasopharyngeal Carcinoma" "Site Specific" "Head and Neck"
Create-JSONFile "$basePath\site-specific\head-neck\Oropharyngeal-Cancer.json" "Oropharyngeal Cancer" "Site Specific" "Head and Neck"
Create-JSONFile "$basePath\site-specific\head-neck\Laryngeal-Cancer.json" "Laryngeal Cancer" "Site Specific" "Head and Neck"
Create-JSONFile "$basePath\site-specific\head-neck\Oral-Cavity-Tumors.json" "Oral Cavity Tumors" "Site Specific" "Head and Neck"
Create-JSONFile "$basePath\site-specific\head-neck\Hypopharyngeal-Cancer.json" "Hypopharyngeal Cancer" "Site Specific" "Head and Neck"
Create-JSONFile "$basePath\site-specific\head-neck\Paranasal-Sinus-Tumors.json" "Paranasal Sinus Tumors" "Site Specific" "Head and Neck"
Create-JSONFile "$basePath\site-specific\head-neck\Salivary-Gland-Tumors.json" "Salivary Gland Tumors" "Site Specific" "Head and Neck"
Create-JSONFile "$basePath\site-specific\head-neck\Thyroid-Cancer.json" "Thyroid Cancer" "Site Specific" "Head and Neck"
Create-JSONFile "$basePath\site-specific\head-neck\Unknown-Primary.json" "Unknown Primary" "Site Specific" "Head and Neck"
Create-JSONFile "$basePath\site-specific\head-neck\Re-irradiation-Techniques.json" "Re-irradiation Techniques" "Site Specific" "Head and Neck"
Create-JSONFile "$basePath\site-specific\head-neck\Organ-Preservation-Protocols.json" "Organ Preservation Protocols" "Site Specific" "Head and Neck"

# Abdomen and Pelvis site-specific files (all missing)
Create-JSONFile "$basePath\site-specific\abdomen-pelvis\Abdominal-and-Pelvic-Overview.json" "Abdominal and Pelvic Overview" "Site Specific" "Abdomen and Pelvis"
Create-JSONFile "$basePath\site-specific\abdomen-pelvis\Pancreatic-Cancer.json" "Pancreatic Cancer" "Site Specific" "Abdomen and Pelvis"
Create-JSONFile "$basePath\site-specific\abdomen-pelvis\Hepatocellular-Carcinoma.json" "Hepatocellular Carcinoma" "Site Specific" "Abdomen and Pelvis"
Create-JSONFile "$basePath\site-specific\abdomen-pelvis\Liver-Metastases.json" "Liver Metastases" "Site Specific" "Abdomen and Pelvis"
Create-JSONFile "$basePath\site-specific\abdomen-pelvis\Gastric-Cancer.json" "Gastric Cancer" "Site Specific" "Abdomen and Pelvis"
Create-JSONFile "$basePath\site-specific\abdomen-pelvis\Colorectal-Cancer.json" "Colorectal Cancer" "Site Specific" "Abdomen and Pelvis"
Create-JSONFile "$basePath\site-specific\abdomen-pelvis\Anal-Cancer.json" "Anal Cancer" "Site Specific" "Abdomen and Pelvis"
Create-JSONFile "$basePath\site-specific\abdomen-pelvis\Renal-Cell-Carcinoma.json" "Renal Cell Carcinoma" "Site Specific" "Abdomen and Pelvis"
Create-JSONFile "$basePath\site-specific\abdomen-pelvis\Adrenal-Metastases.json" "Adrenal Metastases" "Site Specific" "Abdomen and Pelvis"
Create-JSONFile "$basePath\site-specific\abdomen-pelvis\Retroperitoneal-Sarcoma.json" "Retroperitoneal Sarcoma" "Site Specific" "Abdomen and Pelvis"
Create-JSONFile "$basePath\site-specific\abdomen-pelvis\SBRT-for-Abdominal-Tumors.json" "SBRT for Abdominal Tumors" "Site Specific" "Abdomen and Pelvis"

# Genitourinary site-specific files (missing ones - Prostate Cancer already exists)
Create-JSONFile "$basePath\site-specific\genitourinary\Genitourinary-Overview.json" "Genitourinary Overview" "Site Specific" "Genitourinary"
Create-JSONFile "$basePath\site-specific\genitourinary\Bladder-Cancer.json" "Bladder Cancer" "Site Specific" "Genitourinary"
Create-JSONFile "$basePath\site-specific\genitourinary\Testicular-Cancer.json" "Testicular Cancer" "Site Specific" "Genitourinary"
Create-JSONFile "$basePath\site-specific\genitourinary\Penile-Cancer.json" "Penile Cancer" "Site Specific" "Genitourinary"
Create-JSONFile "$basePath\site-specific\genitourinary\Ureteral-and-Urethral-Tumors.json" "Ureteral and Urethral Tumors" "Site Specific" "Genitourinary"
Create-JSONFile "$basePath\site-specific\genitourinary\Prostate-Brachytherapy.json" "Prostate Brachytherapy" "Site Specific" "Genitourinary"
Create-JSONFile "$basePath\site-specific\genitourinary\Stereotactic-Prostate-Radiotherapy.json" "Stereotactic Prostate Radiotherapy" "Site Specific" "Genitourinary"
Create-JSONFile "$basePath\site-specific\genitourinary\Pelvic-Lymph-Node-Irradiation.json" "Pelvic Lymph Node Irradiation" "Site Specific" "Genitourinary"
Create-JSONFile "$basePath\site-specific\genitourinary\Salvage-Radiation-Therapy.json" "Salvage Radiation Therapy" "Site Specific" "Genitourinary"

# Gynecologic site-specific files (all missing)
Create-JSONFile "$basePath\site-specific\gynecologic\Gynecologic-Cancers-Overview.json" "Gynecologic Cancers Overview" "Site Specific" "Gynecologic"
Create-JSONFile "$basePath\site-specific\gynecologic\Cervical-Cancer.json" "Cervical Cancer" "Site Specific" "Gynecologic"
Create-JSONFile "$basePath\site-specific\gynecologic\Endometrial-Cancer.json" "Endometrial Cancer" "Site Specific" "Gynecologic"
Create-JSONFile "$basePath\site-specific\gynecologic\Ovarian-Cancer.json" "Ovarian Cancer" "Site Specific" "Gynecologic"
Create-JSONFile "$basePath\site-specific\gynecologic\Vaginal-Cancer.json" "Vaginal Cancer" "Site Specific" "Gynecologic"
Create-JSONFile "$basePath\site-specific\gynecologic\Vulvar-Cancer.json" "Vulvar Cancer" "Site Specific" "Gynecologic"
Create-JSONFile "$basePath\site-specific\gynecologic\Uterine-Sarcoma.json" "Uterine Sarcoma" "Site Specific" "Gynecologic"
Create-JSONFile "$basePath\site-specific\gynecologic\Cervical-Brachytherapy.json" "Cervical Brachytherapy" "Site Specific" "Gynecologic"
Create-JSONFile "$basePath\site-specific\gynecologic\Vaginal-Brachytherapy.json" "Vaginal Brachytherapy" "Site Specific" "Gynecologic"
Create-JSONFile "$basePath\site-specific\gynecologic\Total-Abdominal-Irradiation.json" "Total Abdominal Irradiation" "Site Specific" "Gynecologic"
Create-JSONFile "$basePath\site-specific\gynecologic\Fertility-Preservation.json" "Fertility Preservation" "Site Specific" "Gynecologic"

Write-Host "Phase 3 completed: Created remaining site-specific files"
