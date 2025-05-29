#!/usr/bin/env pwsh

# Script to create placeholder JSON files for radiation oncology handbook
$baseDir = "d:\Mansoor\mwoncovista\vista1\public\radiation_oncology_handbook"

# Define the structure with topics and brief descriptions
$structure = @{
    "fundamentals" = @{
        "physics" = @(
            @{name="X-ray-Production-and-Beam-Characteristics"; title="X-ray Production and Beam Characteristics"; summary="Physics of X-ray production in linear accelerators, beam characteristics, and factors affecting beam quality for clinical radiation therapy applications."},
            @{name="Photon-Beam-Dosimetry"; title="Photon Beam Dosimetry"; summary="Principles and methods for measuring and calculating photon beam dose distributions, including depth dose curves, beam profiles, and output factors."},
            @{name="Electron-Beam-Physics"; title="Electron Beam Physics"; summary="Physics of electron beam interactions, energy deposition patterns, and clinical applications for superficial tumors and boost treatments."},
            @{name="Neutron-and-Proton-Therapy-Physics"; title="Neutron and Proton Therapy Physics"; summary="Advanced particle therapy physics including proton beam characteristics, Bragg peak phenomenon, and relative biological effectiveness."},
            @{name="Radiation-Protection-and-Safety"; title="Radiation Protection and Safety"; summary="Fundamental principles of radiation protection including dose limits, monitoring requirements, and safety protocols for radiation therapy facilities."},
            @{name="Treatment-Planning-Algorithms"; title="Treatment Planning Algorithms"; summary="Mathematical algorithms used in treatment planning systems for dose calculation, including pencil beam, convolution-superposition, and Monte Carlo methods."},
            @{name="Monte-Carlo-Methods"; title="Monte Carlo Methods"; summary="Statistical simulation techniques for modeling radiation transport and dose calculation in complex geometries and heterogeneous media."},
            @{name="Clinical-Applications-of-Physics"; title="Clinical Applications of Physics"; summary="Practical application of physics principles in clinical radiation therapy including beam modeling, commissioning, and quality assurance."}
        ),
        "radiobiology" = @(
            @{name="Introduction-to-Radiobiology"; title="Introduction to Radiobiology"; summary="Fundamental concepts of how radiation affects biological systems, from molecular damage to cellular responses and tissue effects."},
            @{name="DNA-Damage-and-Repair"; title="DNA Damage and Repair"; summary="Mechanisms of radiation-induced DNA damage including direct and indirect effects, and cellular repair processes that determine radiosensitivity."},
            @{name="Cell-Cycle-and-Radiosensitivity"; title="Cell Cycle and Radiosensitivity"; summary="Relationship between cell cycle phases and radiation sensitivity, with implications for timing of radiation therapy delivery."},
            @{name="The-5-Rs-of-Radiobiology"; title="The 5 Rs of Radiobiology"; summary="Classical radiobiological principles: Repair, Repopulation, Redistribution, Reoxygenation, and Radiosensitivity that govern fractionated radiotherapy."},
            @{name="Fractionation-and-Hyperfractionation"; title="Fractionation and Hyperfractionation"; summary="Biological rationale for fractionated radiotherapy and alternative fractionation schemes including hyperfractionation and hypofractionation."},
            @{name="Tumor-Hypoxia-and-Reoxygenation"; title="Tumor Hypoxia and Reoxygenation"; summary="Impact of oxygen levels on radiosensitivity, hypoxic cell radioresistance, and reoxygenation during fractionated treatment."},
            @{name="Normal-Tissue-Tolerance"; title="Normal Tissue Tolerance"; summary="Dose-volume relationships for normal tissues, tolerance doses, and factors affecting normal tissue complications."},
            @{name="Radiosensitizers-and-Radioprotectors"; title="Radiosensitizers and Radioprotectors"; summary="Chemical and biological agents that modify radiation response, including hypoxic cell sensitizers and normal tissue protectors."},
            @{name="Molecular-Targeted-Therapy-and-Radiation"; title="Molecular Targeted Therapy and Radiation"; summary="Integration of molecular targeted agents with radiation therapy to enhance tumor control and overcome resistance mechanisms."}
        ),
        "equipment" = @(
            @{name="Linear-Accelerators"; title="Linear Accelerators"; summary="Design, operation, and components of medical linear accelerators including electron gun, accelerating waveguide, and beam delivery systems."},
            @{name="Cobalt-60-Units"; title="Cobalt-60 Units"; summary="Principles and operation of Cobalt-60 teletherapy units, source characteristics, and safety considerations for gamma ray therapy."},
            @{name="Brachytherapy-Sources-and-Applicators"; title="Brachytherapy Sources and Applicators"; summary="Radioactive sources used in brachytherapy, applicator design, and delivery systems for intracavitary and interstitial treatments."},
            @{name="CT-Simulators"; title="CT Simulators"; summary="Design and operation of CT simulation systems for treatment planning, including imaging protocols and patient positioning devices."},
            @{name="MRI-and-PET-Integration"; title="MRI and PET Integration"; summary="Integration of magnetic resonance imaging and positron emission tomography in radiation therapy planning and adaptive treatments."},
            @{name="Treatment-Planning-Systems"; title="Treatment Planning Systems"; summary="Computer systems for radiation treatment planning including dose calculation algorithms, optimization methods, and plan evaluation tools."},
            @{name="Portal-Imaging-and-IGRT-Systems"; title="Portal Imaging and IGRT Systems"; summary="Electronic portal imaging devices and image-guided radiation therapy systems for patient positioning verification and adaptive treatments."},
            @{name="Respiratory-Motion-Management"; title="Respiratory Motion Management"; summary="Technologies for managing respiratory motion including gating, tracking, and breath-hold techniques for thoracic and abdominal treatments."},
            @{name="Calibration-and-Commissioning"; title="Calibration and Commissioning"; summary="Procedures for calibrating and commissioning radiation therapy equipment to ensure accurate and safe treatment delivery."}
        )
    },
    "techniques" = @{
        "external-beam" = @(
            @{name="3D-Conformal-Radiation-Therapy"; title="3D Conformal Radiation Therapy"; summary="Three-dimensional treatment planning and delivery techniques using CT-based planning and multileaf collimators for tumor conformality."},
            @{name="Volumetric-Modulated-Arc-Therapy"; title="Volumetric Modulated Arc Therapy"; summary="Advanced IMRT technique delivering radiation during continuous gantry rotation with dynamic MLC and dose rate modulation."},
            @{name="Tomotherapy"; title="Tomotherapy"; summary="Helical delivery technique combining CT imaging with intensity-modulated radiation therapy for complex target volumes."},
            @{name="Proton-Beam-Therapy"; title="Proton Beam Therapy"; summary="Clinical applications of proton therapy including passive scattering and pencil beam scanning techniques for dose distribution optimization."},
            @{name="Carbon-Ion-Therapy"; title="Carbon Ion Therapy"; summary="Heavy ion radiation therapy using carbon ions for enhanced biological effectiveness and precise dose localization."},
            @{name="Electron-Beam-Therapy"; title="Electron Beam Therapy"; summary="Clinical applications of electron beams for superficial and deep-seated tumors including bolus design and field matching."},
            @{name="Total-Body-Irradiation"; title="Total Body Irradiation"; summary="Techniques for whole-body irradiation as conditioning for bone marrow transplantation including dose uniformity and organ shielding."},
            @{name="Total-Skin-Electron-Therapy"; title="Total Skin Electron Therapy"; summary="Specialized electron beam technique for treating cutaneous lymphomas with uniform dose distribution over entire skin surface."},
            @{name="Beam-Modifiers-and-Accessories"; title="Beam Modifiers and Accessories"; summary="Physical devices for beam modification including wedges, compensators, blocks, and bolus materials for dose optimization."}
        ),
        "brachytherapy" = @(
            @{name="Introduction-to-Brachytherapy"; title="Introduction to Brachytherapy"; summary="Principles of brachytherapy including source types, dose rate classifications, and advantages of internal radiation delivery."},
            @{name="Low-Dose-Rate-Brachytherapy"; title="Low Dose Rate Brachytherapy"; summary="LDR brachytherapy techniques using permanent seeds and temporary implants for gynecologic, prostate, and other malignancies."},
            @{name="High-Dose-Rate-Brachytherapy"; title="High Dose Rate Brachytherapy"; summary="HDR brachytherapy systems, remote afterloading technology, and treatment protocols for various anatomical sites."},
            @{name="Pulsed-Dose-Rate-Brachytherapy"; title="Pulsed Dose Rate Brachytherapy"; summary="PDR brachytherapy combining advantages of LDR and HDR treatments with pulsed delivery for radiobiological optimization."},
            @{name="Permanent-Seed-Implants"; title="Permanent Seed Implants"; summary="Technique for permanent radioactive seed implantation including pre-planning, real-time planning, and post-implant dosimetry."},
            @{name="Intracavitary-Techniques"; title="Intracavitary Techniques"; summary="Brachytherapy delivery through natural body cavities including gynecologic applications and bronchial treatments."},
            @{name="Interstitial-Techniques"; title="Interstitial Techniques"; summary="Direct implantation of radioactive sources into tumor tissues including breast, prostate, and soft tissue sarcoma applications."},
            @{name="Intravascular-Brachytherapy"; title="Intravascular Brachytherapy"; summary="Specialized brachytherapy for preventing restenosis in cardiovascular interventions using beta and gamma sources."},
            @{name="Electronic-Brachytherapy"; title="Electronic Brachytherapy"; summary="Electronic brachytherapy systems using miniaturized X-ray sources for superficial and interstitial treatments."},
            @{name="Brachytherapy-Dosimetry-Systems"; title="Brachytherapy Dosimetry Systems"; summary="Dose calculation methods for brachytherapy including TG-43 formalism, model-based algorithms, and quality assurance protocols."}
        )
    }
}

function Create-JSONFile {
    param(
        [string]$FilePath,
        [string]$Title,
        [string]$Section,
        [string]$Summary
    )
    
    $content = @{
        title = $Title
        category = "Radiation Oncology"
        section = $Section
        summary = $Summary
        content = @(
            @{
                type = "heading"
                level = 2
                text = "Overview"
            },
            @{
                type = "paragraph"
                text = "This topic covers essential concepts and clinical applications relevant to radiation oncology practice."
            },
            @{
                type = "heading"
                level = 2
                text = "Key Concepts"
            },
            @{
                type = "paragraph"
                text = "Detailed information about fundamental principles and practical applications will be provided here."
            },
            @{
                type = "clinical_pearl"
                text = "Important clinical considerations and best practices for optimal patient outcomes."
            }
        )
    } | ConvertTo-Json -Depth 10
    
    $content | Out-File -FilePath $FilePath -Encoding UTF8
    Write-Host "Created: $FilePath"
}

# Create JSON files for each topic
foreach ($category in $structure.Keys) {
    foreach ($section in $structure[$category].Keys) {
        $sectionPath = Join-Path $baseDir $category $section
        
        foreach ($topic in $structure[$category][$section]) {
            $filePath = Join-Path $sectionPath "$($topic.name).json"
            if (-not (Test-Path $filePath)) {
                Create-JSONFile -FilePath $filePath -Title $topic.title -Section $topic.title.Split(' ')[0] -Summary $topic.summary
            }
        }
    }
}

Write-Host "Completed creating placeholder JSON files for radiation oncology handbook."
