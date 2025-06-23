import { StepBasedPathway } from "../../types/cancer-pathways";

export const breastCancerPathway: StepBasedPathway = {
  id: "breast",
  name: "Breast Cancer Diagnostic Pathway",
  description: "Systematic approach to breast cancer diagnosis and staging, aligned with NCCN 2024 and ASCO guidelines.",
  recommendedTimeframe: "1-2 weeks for diagnosis, 2-4 weeks for full staging and treatment plan",
  steps: [
    {
      id: "initial",
      title: "Initial Presentation & Clinical Assessment",
      description: "Patient presents with breast symptoms (e.g., lump, skin changes, nipple discharge) or abnormal screening mammogram. Detailed history (including risk factors like family history, prior breast conditions, hormonal exposures, genetic predisposition) and clinical breast exam (CBE).",
      expectedDuration: "1-2 days",
      guidelineSource: "NCCN BC-1 2024, ASCO Guideline on Breast Cancer Diagnosis 2021",
      evidenceLevel: "I",
      patientInfo: "Explain the importance of evaluating symptoms/findings. Discuss the next steps, likely diagnostic imaging. Address anxiety and provide reassurance. Offer information on risk factors.",
      pitfalls: ["Dismissing patient concerns, especially in younger women or those with dense breasts.", "Incomplete CBE or inadequate documentation.", "Delay in scheduling diagnostic imaging for suspicious findings (BI-RADS 0 on screening, palpable mass)."],
      options: [
        {
          text: "Abnormal screening mammogram (e.g., BI-RADS 0, or new BI-RADS 3, 4, 5 finding)",
          next: "diagnostic_imaging_mammogram_callback"
        },
        {
          text: "Palpable mass, focal persistent pain, suspicious nipple discharge (bloody, unilateral, spontaneous), skin changes (dimpling, erythema, peau d'orange), or axillary adenopathy",
          next: "diagnostic_imaging_symptomatic",
          triggers: ["suspicious_clinical_finding"]
        },
        {
          text: "Non-suspicious symptoms (e.g., cyclical bilateral pain, non-bloody bilateral discharge), no palpable mass, normal screening history",
          next: "risk_assessment_reassurance_low_suspicion"
        },
        {
          text: "High risk patient (e.g. known BRCA mutation, strong family history, prior chest RT) for screening/surveillance",
          next: "high_risk_surveillance_protocol" // May involve MRI
        }
      ],
      redFlags: [
        {
          id: "suspicious_clinical_finding",
          condition: "Palpable dominant hard mass, peau d'orange, skin ulceration, nipple retraction/inversion (new), fixed axillary nodes, or signs of inflammatory breast cancer (diffuse erythema, edema, warmth).",
          message: "High suspicion for locally advanced or inflammatory breast cancer. Requires urgent evaluation.",
          severity: "critical",
          recommendations: [
            "Urgent diagnostic mammogram (if >30 yrs) and targeted ultrasound within 24-72 hours.",
            "Consider early surgical/breast oncology consultation (same day or next day).",
            "Document detailed findings, including size, location, and characteristics of mass and any skin/nodal changes."
          ],
          urgency: "Same-day",
          actionType: "Urgent Imaging & Specialist Consultation"
        }
      ]
    },
    {
      id: "diagnostic_imaging_mammogram_callback", // For screening callbacks
      title: "Diagnostic Mammography & Ultrasound (Screening Callback)",
      description: "Perform diagnostic mammography (additional views, magnification, tomosynthesis as needed) and targeted breast ultrasound for any abnormality seen on screening mammogram. Correlate with prior imaging.",
      expectedDuration: "1-3 days",
      tooltip: "Resolve screening findings. Assign final BI-RADS category.",
      guidelineSource: "ACR Practice Parameter for Breast Imaging 2023, NCCN BC-2 2024",
      evidenceLevel: "I",
      patientInfo: "Explain that additional views are common after screening. Describe procedures. Discuss BI-RADS outcome.",
      pitfalls: ["Not performing ultrasound for all relevant mammographic findings.", "Inadequate views leading to missed lesions."],
      options: [
        {
          text: "BI-RADS 4 or 5 (Suspicious or Highly Suspicious)",
          next: "image_guided_biopsy",
          triggers: ["high_birads_finding"]
        },
        {
          text: "BI-RADS 3 (Probably Benign) - typically short-interval (6-month) follow-up or biopsy based on risk/patient/radiologist preference",
          next: "birads3_management_protocol"
        },
        {
          text: "BI-RADS 1 or 2 (Negative or Benign) - resolved screening finding",
          next: "return_to_routine_screening"
        }
      ],
      redFlags: [
        {
          id: "high_birads_finding",
          condition: "BI-RADS 4 or 5 lesion identified on diagnostic workup.",
          message: "High suspicion for malignancy. Tissue diagnosis is required promptly.",
          severity: "critical",
          recommendations: [
            "Schedule image-guided core needle biopsy (CNB) within 3-5 business days.",
            "Clearly communicate need for biopsy to patient and referring physician.",
            "Determine optimal biopsy modality (ultrasound-guided preferred if visible, stereotactic for calcs, MRI-guided if only seen on MRI)."
          ],
          urgency: "Routine", // For biopsy scheduling
          actionType: "Biopsy Scheduling & Communication"
        }
      ]
    },
    {
      id: "diagnostic_imaging_symptomatic", // For symptomatic patients
      title: "Diagnostic Mammography & Ultrasound (Symptomatic Patient)",
      description: "For palpable mass or other symptoms: if age >40, diagnostic mammogram and targeted ultrasound. If age 30-39, ultrasound first, then mammogram if suspicious/inconclusive. If <30, ultrasound first, mammogram rarely needed. Breast MRI for specific indications (e.g., occult primary with axillary mets, extent of disease in dense breasts with known cancer).",
      expectedDuration: "1-3 days",
      guidelineSource: "ACR Appropriateness Criteria 2022, NCCN BC-1 & BC-2 2024",
      evidenceLevel: "I",
      patientInfo: "Explain imaging based on age/symptoms. Discuss BI-RADS outcome.",
      pitfalls: ["Not using ultrasound as primary modality in young women (<30).", "Delaying mammography in symptomatic women >30 if ultrasound appears benign but mass persists."],
      options: [
        // Same options as diagnostic_imaging_mammogram_callback
        {
          text: "BI-RADS 4 or 5 (Suspicious or Highly Suspicious)",
          next: "image_guided_biopsy",
          triggers: ["high_birads_finding"] // Re-uses red flag from above
        },
        {
          text: "BI-RADS 3 (Probably Benign)",
          next: "birads3_management_protocol"
        },
        {
          text: "BI-RADS 1 or 2 (Negative or Benign) but symptoms persist or clinical concern remains",
          next: "clinical_radiologic_discordance_review"
        },
        {
          text: "BI-RADS 1 or 2 (Negative or Benign), symptoms resolve or concordant benign explanation",
          next: "routine_followup_if_indicated"
        }
      ]
    },
    {
      id: "image_guided_biopsy",
      title: "Image-Guided Core Needle Biopsy (CNB)",
      description: "Perform CNB of BI-RADS 4/5 lesion(s) using appropriate imaging guidance. Obtain multiple cores (typically 4-6). Place biopsy marker clip. Send tissue for histology, ER/PR/HER2 (for invasive cancer and DCIS). Ki-67 optional but often done. Consider tissue for genomic assays if invasive cancer likely.",
      expectedDuration: "1-3 days (procedure + initial pathology report)",
      tooltip: "CNB is standard. Ensure radiologic-pathologic concordance. Document clip placement.",
      guidelineSource: "NCCN BC-3 2024, ASCO/CAP ER/PR/HER2 Testing Guidelines 2020/2023",
      evidenceLevel: "I",
      requiresMDT: true, // For radiologic-pathologic concordance review
      patientInfo: "Explain CNB procedure, purpose (diagnosis), risks (bruising, bleeding, infection, pain, rare pneumothorax for deep lesions), benefits. Obtain informed consent. Post-biopsy care.",
      pitfalls: ["Insufficient sample for all required tests (ER/PR/HER2, genomics).", "Biopsy of non-representative area or sampling error.", "Radiologic-pathologic discordance not identified or addressed.", "Marker clip not placed, misplaced, or migrates.", "Performing FNA instead of CNB for initial diagnosis of solid mass (FNA insufficient for receptor status or distinguishing in-situ from invasive)."],
      options: [
        {
          text: "Malignancy confirmed (Invasive Carcinoma or Ductal Carcinoma In Situ - DCIS)",
          next: "post_biopsy_consult_pathology_review",
          triggers: ["breast_cancer_diagnosis_biopsy"]
        },
        {
          text: "High-risk lesion (e.g., Atypical Ductal Hyperplasia (ADH), Lobular Carcinoma In Situ (LCIS), Flat Epithelial Atypia (FEA), Papilloma with atypia)",
          next: "high_risk_lesion_management_discussion"
        },
        {
          text: "Benign pathology, concordant with imaging findings",
          next: "benign_concordant_pathology_followup"
        },
        {
          text: "Pathology discordant with imaging, or insufficient for diagnosis (e.g. atypia of undetermined significance - AUS)",
          next: "discordant_insufficient_pathology_review_repeat_biopsy"
        }
      ],
      redFlags: [
        {
          id: "breast_cancer_diagnosis_biopsy",
          condition: "Biopsy confirms invasive breast cancer or DCIS.",
          message: "Breast cancer diagnosed. Requires prompt communication with patient, staging, and multidisciplinary discussion.",
          severity: "critical",
          recommendations: [
            "Pathologist to ensure ER/PR/HER2 (with reflex ISH if HER2 IHC 2+) results are processed promptly.",
            "Schedule follow-up with surgeon/breast specialist within 1 week to discuss results and plan.",
            "Initiate staging workup as indicated by tumor type/size/grade (NCCN BC-4).",
            "Refer for genetic counseling if criteria met (NCCN BC-6).",
            "Prepare for presentation at multidisciplinary tumor board (MDT)."
          ],
          urgency: "Routine", // For scheduling next steps
          actionType: "Pathology Processing, Consultation & Staging Initiation"
        }
      ]
    },
    {
      id: "post_biopsy_consult_pathology_review",
      title: "Post-Biopsy Consultation, Full Pathology Review & Staging",
      description: "Consultation to discuss confirmed cancer diagnosis. Review final pathology: histologic type, grade, size (if excisional), ER/PR status, HER2 status (IHC and ISH if done), Ki-67. Clinical staging (TNM) based on exam, imaging, biopsy. Systemic staging (CT C/A/P, bone scan, or PET-CT) for clinical stage IIB (T2N1, T3N0) or higher, or symptomatic patients, or inflammatory BC (NCCN BC-4). Brain MRI if neurological symptoms or specific subtypes (e.g. HER2+, triple negative with high burden).",
      expectedDuration: "3-7 days for full pathology and initial staging plan",
      guidelineSource: "NCCN BC-4 & BC-5 2024, AJCC 8th Ed. Breast Cancer Staging",
      evidenceLevel: "I",
      requiresMDT: true,
      patientInfo: "Provide clear explanation of diagnosis, pathology report (ER/PR/HER2 meaning), and cancer stage. Discuss need for further staging tests. Offer emotional support and resources. Discuss MDT process. Genetic counseling referral if indicated.",
      pitfalls: ["Incomplete or delayed ER/PR/HER2/Ki-67 results.", "Under-staging (missing metastases) or over-staging.", "Delay in MDT presentation or specialist consultations.", "Not offering genetic counseling according to guidelines (e.g., age <50, triple negative, male breast cancer, specific family history - NCCN BC-6)."],
      options: [
        {
          text: "Early stage (Stage I-IIA, selected IIB based on biology) potentially suitable for primary surgery",
          next: "mdt_treatment_planning_early_stage_breast"
        },
        {
          text: "Locally advanced (some Stage IIB, Stage III) or inflammatory breast cancer - typically requires neoadjuvant therapy",
          next: "mdt_treatment_planning_locally_advanced_breast"
        },
        {
          text: "Metastatic disease (Stage IV) identified on staging workup",
          next: "mdt_treatment_planning_metastatic_breast",
          triggers: ["metastatic_breast_cancer_staging"]
        },
        {
          text: "DCIS without invasion",
          next: "mdt_treatment_planning_dcis"
        }
      ],
      redFlags: [
        {
          id: "metastatic_breast_cancer_staging",
          condition: "Metastatic disease (Stage IV) confirmed by staging investigations.",
          message: "Stage IV breast cancer. Treatment is primarily systemic with palliative intent for most; some oligometastatic cases may have different approaches. Requires urgent multidisciplinary input.",
          severity: "critical",
          recommendations: [
            "Urgent medical oncology consultation (within days).",
            "Biopsy of a metastatic site if feasible and not previously done (especially if discordance in receptors suspected or for research protocols).",
            "Early palliative care referral for symptom management, psychosocial support, and goals of care discussion.",
            "Discuss prognosis, treatment goals, and advanced care planning with patient and family.",
            "Consider clinical trials."
          ],
          urgency: "Same-day", // For oncology referral
          actionType: "Urgent Oncology Referral & Palliative Care Integration"
        },
        {
          id: "inflammatory_breast_cancer_confirmed",
          condition: "Clinical diagnosis of inflammatory breast cancer (IBC) confirmed or highly suspected post-imaging/biopsy.",
          message: "IBC is an aggressive form of breast cancer. Requires urgent, coordinated trimodality therapy, starting with neoadjuvant systemic therapy.",
          severity: "critical",
          recommendations: [
            "Urgent medical oncology, surgical oncology, and radiation oncology consultations (within days).",
            "Skin punch biopsy if not already done and diagnosis uncertain, to confirm dermal lymphatic invasion.",
            "Complete staging workup immediately (PET-CT highly recommended for IBC).",
            "Do NOT proceed with upfront surgery."
          ],
          urgency: "Immediate", // For specialist consultations and start of planning
          actionType: "Urgent Multidisciplinary Consultation & Neoadjuvant Planning"
        }
      ]
    }
    // Further steps for MDT treatment planning (early, locally advanced, metastatic, DCIS), high-risk lesion management, benign follow-up, genetic counseling details, survivorship etc.
  ]
};
