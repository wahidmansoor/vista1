import { StepBasedPathway } from "../../types/cancer-pathways";

export const prostateCancerPathway: StepBasedPathway = {
  id: "prostate",
  name: "Prostate Cancer Diagnostic Pathway",
  description: "Evidence-based approach to prostate cancer diagnosis, risk stratification, and initial staging, aligned with NCCN 2024 and EAU 2024 guidelines.",
  recommendedTimeframe: "2-4 weeks from suspicion to diagnostic biopsy result; further 2-4 weeks for full staging and MDT discussion if cancer confirmed.",
  steps: [
    {
      id: "initial",
      title: "Initial Assessment & PSA/DRE Evaluation",
      description: "Patient presents with elevated Prostate-Specific Antigen (PSA), abnormal Digital Rectal Exam (DRE), strong family history, or known genetic predisposition (e.g., BRCA1/2). Assess urinary symptoms (IPSS score) and rule out benign causes of PSA elevation (UTI, prostatitis, recent ejaculation/instrumentation, catheter).",
      expectedDuration: "1-2 days",
      guidelineSource: "NCCN PROS-1 2024, EAU Guidelines on Prostate Cancer 2024",
      evidenceLevel: "I",
      patientInfo: "Discuss PSA/DRE findings, the concept of risk stratification, and the diagnostic pathway. Address anxiety. Explain that not all elevated PSAs mean cancer and benign causes need to be excluded.",
      pitfalls: ["Not repeating an initial elevated PSA after addressing potential benign causes.", "Ignoring abnormal DRE even with normal PSA.", "Failure to consider and rule out UTI or recent ejaculation/instrumentation/catheterization that could transiently elevate PSA before proceeding."],
      options: [
        {
          text: "Elevated PSA (> age-specific range or >4 ng/mL generally, or >3 ng/mL for men with BRCA2 or >40yrs with BRCA1) and/or suspicious DRE (nodule, induration, asymmetry)",
          next: "psa_confirmation_risk_assessment"
        },
        {
          text: "Strong family history (e.g., 1st degree relative <65yrs, multiple relatives) or known genetic predisposition (BRCA1/2, Lynch Syndrome, HOXB13) - consider earlier screening / lower PSA threshold",
          next: "psa_confirmation_risk_assessment" // Lower threshold for investigation
        },
        {
          text: "PSA normal, DRE normal, no significant risk factors",
          next: "routine_screening_surveillance_prostate"
        },
        {
          text: "Symptoms of UTI/prostatitis present",
          next: "treat_uti_recheck_psa"
        }
      ],
      redFlags: [
        {
          id: "prostate_very_high_psa_symptoms",
          condition: "PSA > 20 ng/mL with new onset significant bone pain, or PSA > 50 ng/mL. Any PSA level with neurological symptoms concerning for spinal cord compression (e.g., new leg weakness, saddle anesthesia, bowel/bladder incontinence).",
          message: "High suspicion for metastatic disease or locally advanced disease with complications. Requires urgent evaluation and management.",
          severity: "critical",
          recommendations: [
            "Urgent urology/oncology consultation (within 24-48 hours).",
            "Immediate bone scan and CT Chest/Abdomen/Pelvis (or PSMA PET-CT if available and indicated for high-risk staging).",
            "If cord compression suspected: urgent MRI spine (same day), neurosurgical/radiation oncology consult, consider immediate high-dose corticosteroids."
          ],
          urgency: "Immediate",
          actionType: "Urgent Staging, Specialist Consultation & Symptom Management"
        }
      ]
    },
    {
      id: "psa_confirmation_risk_assessment",
      title: "PSA Confirmation, Risk Assessment & Shared Decision-Making",
      description: "Confirm persistent PSA elevation (repeat test 4-8 weeks after initial, ensuring no interfering factors). Calculate PSA density (PSAD = PSA / prostate volume from TRUS/MRI) and PSA velocity if prior values available. Assess risk factors (age, race, family hx of prostate/breast/ovarian/pancreatic cancer, genetic mutations). Use validated risk calculators (e.g., ERSPC, PCPT, Stockholm3, 4Kscore, SelectMDx, MyProstateScore) to estimate probability of clinically significant cancer. Discuss pros/cons of biopsy.",
      expectedDuration: "1-2 weeks (allowing for repeat test and calculator use)",
      tooltip: "PSAD > 0.15 ng/mL/cc is concerning. Risk calculators and biomarkers can help refine biopsy decisions and avoid overdiagnosis.",
      guidelineSource: "NCCN PROS-2 2024, AUA/SUO Guidelines 2023, EAU Guidelines 2024",
      evidenceLevel: "II",
      patientInfo: "Explain rationale for confirming PSA, role of PSAD, risk calculators, and biomarkers in guiding decisions. Discuss the balance between detecting significant cancer and risks of biopsy/overtreatment. Shared decision-making is key.",
      pitfalls: ["Proceeding to biopsy based on a single elevated PSA without confirmation or comprehensive risk assessment.", "Not using or misinterpreting risk calculators/biomarkers.", "Insufficient discussion of biopsy risks/benefits leading to uninformed patient choice."],
      options: [
        {
          text: "Persistent elevated PSA / high-risk profile on calculators / suspicious DRE / patient preference for diagnostic clarity after discussion",
          next: "pre_biopsy_prostate_mri"
        },
        {
          text: "PSA normalized or low risk profile after assessment / patient preference against biopsy after discussion",
          next: "active_monitoring_psa_dre_risk_reassessment"
        }
      ]
    },
    {
      id: "pre_biopsy_prostate_mri",
      title: "Pre-biopsy Multiparametric Prostate MRI (mpMRI)",
      description: "Perform high-quality mpMRI (3T preferred) prior to initial biopsy if available and PSA/risk warrants. Report using PI-RADS v2.1. For patients with prior negative biopsy but ongoing suspicion, mpMRI is also strongly recommended.",
      expectedDuration: "1-2 weeks (scheduling and reporting)",
      tooltip: "mpMRI improves detection of clinically significant (Grade Group >=2) prostate cancer and can guide targeted biopsies, potentially reducing detection of insignificant cancers.",
      guidelineSource: "NCCN PROS-3 2024, EAU Guidelines 2024, PRECISION Trial, MRI-FIRST Trial",
      evidenceLevel: "I",
      patientInfo: "Explain mpMRI procedure, its benefits in identifying suspicious areas for targeted biopsy, and how results (PI-RADS score) will inform the biopsy plan. Mention it may help avoid biopsy if no suspicious lesions are found in some low-risk men.",
      pitfalls: ["Poor quality mpMRI scan or inexperienced interpretation leading to false positives/negatives.", "Not performing MRI before biopsy if indicated and available, leading to potentially missed targets.", "Over-reliance on PI-RADS 3 lesions without considering other risk factors (PSAD is critical for PI-RADS 3)."],
      options: [
        {
          text: "PI-RADS 4 or 5 lesion (High or Very High suspicion)",
          next: "mri_targeted_plus_systematic_biopsy",
          triggers: ["prostate_high_pirads"]
        },
        {
          text: "PI-RADS 3 lesion (Equivocal) - decision to biopsy based on PSAD, risk profile, biomarkers, patient preference",
          next: "pirads3_lesion_management_discussion"
        },
        {
          text: "PI-RADS 1 or 2 lesion (Low or Very Low suspicion) AND low overall clinical risk (e.g. low PSAD)",
          next: "continue_monitoring_consider_no_biopsy"
        },
        {
          text: "PI-RADS 1 or 2 lesion BUT high clinical risk (e.g. high PSAD, strong family hx) or patient preference",
          next: "systematic_biopsy_consider_no_target"
        },
        {
          text: "No mpMRI performed or available, but clinical suspicion remains high enough to warrant biopsy",
          next: "systematic_prostate_biopsy_only"
        }
      ],
      redFlags: [
        {
          id: "prostate_high_pirads",
          condition: "PI-RADS 4 or 5 lesion identified on mpMRI.",
          message: "High or very high suspicion for clinically significant prostate cancer. MRI-targeted biopsy of the lesion plus systematic biopsies are strongly recommended.",
          severity: "critical", // Critical for decision making
          recommendations: [
            "Schedule MRI-guided or MRI-ultrasound fusion targeted biopsy of the index lesion(s) + standard systematic template biopsies (typically 10-12 cores) within 2-3 weeks.",
            "Discuss findings and biopsy plan clearly with the patient."
          ],
          urgency: "Routine", // For biopsy scheduling
          actionType: "Targeted & Systematic Biopsy Scheduling"
        },
        {
          id: "prostate_extracapsular_extension_mri",
          condition: "Clear evidence of extracapsular extension (ECE), seminal vesicle invasion (SVI), or direct bladder/rectal invasion on mpMRI.",
          message: "Findings suggest locally advanced disease (at least T3). This is critical for staging and impacts treatment planning significantly. Biopsy should confirm.",
          severity: "warning", // Warning for staging implications
          recommendations: [
            "Ensure biopsy plan adequately samples areas near suspected ECE/SVI if safe and feasible.",
            "Flag for urology/MDT discussion regarding neoadjuvant approaches or more extensive surgical planning if cancer is confirmed and resectable.",
            "Consider PSMA PET-CT for staging if high-risk features are present on MRI, once cancer confirmed."
          ],
          urgency: "Routine",
          actionType: "Biopsy Planning Adjustment & MDT Alert for Advanced Disease Features"
        }
      ]
    },
    {
      id: "mri_targeted_plus_systematic_biopsy",
      title: "MRI-Targeted and Systematic Prostate Biopsy",
      description: "Perform MRI-targeted biopsies (cognitive, software fusion, or in-bore) of PI-RADS 3-5 lesions (typically 2-4 cores per target), PLUS systematic template biopsies (e.g., 10-12 cores, transrectal or transperineal approach). Prophylactic antibiotics tailored to local resistance patterns. Consider periprostatic block for pain.",
      expectedDuration: "1-3 days (procedure + initial pathology report)",
      tooltip: "Combination of targeted and systematic biopsy maximizes detection of clinically significant cancer. Transperineal approach has lower infection risk. Discuss risks: bleeding, infection (sepsis is rare but serious), pain, hematuria, hematospermia, temporary urinary retention.",
      guidelineSource: "NCCN PROS-4 2024, AUA/SUO Guidelines 2023, EAU Guidelines 2024",
      evidenceLevel: "I",
      requiresMDT: true, // For pathology review, concordance, and subsequent treatment planning
      patientInfo: "Explain the biopsy procedure (targeted + systematic), chosen approach (transrectal vs transperineal), specific risks, and post-procedure care (e.g., antibiotic completion, signs of infection). Obtain informed consent.",
      pitfalls: ["Targeting error during fusion biopsy leading to false negative in targeted cores.", "Insufficient cores from targeted or systematic component.", "Post-biopsy infection/sepsis, especially with TRUS biopsy if prophylaxis is inadequate or resistance occurs.", "Underestimation of cancer grade/volume if sampling is suboptimal."],
      options: [
        {
          text: "Prostate cancer confirmed (Gleason score and Grade Group available)",
          next: "pathology_review_risk_stratification_mdt",
          triggers: ["prostate_cancer_confirmed_biopsy"]
        },
        {
          text: "Biopsy negative for cancer, despite suspicious MRI/PSA (MRI-pathology discordance)",
          next: "negative_biopsy_discordant_high_suspicion_review"
        },
        {
          text: "Atypical findings (e.g., ASAP - Atypical Small Acinar Proliferation) or HGPIN (High-Grade Prostatic Intraepithelial Neoplasia)",
          next: "atypical_hgpin_biopsy_management"
        },
        {
          text: "Clinically insignificant cancer found (e.g., very low volume Gleason 3+3=6), concordant with low risk MRI/profile",
          next: "discussion_active_surveillance_low_risk"
        }
      ],
      redFlags: [
        {
          id: "prostate_cancer_confirmed_biopsy",
          condition: "Prostate cancer (adenocarcinoma) confirmed on biopsy.",
          message: "Histological confirmation of prostate cancer. Proceed to detailed risk stratification, staging, and multidisciplinary discussion.",
          severity: "critical", // Critical for diagnosis
          recommendations: [
            "Ensure full pathology report includes Gleason score, ISUP Grade Group, number of positive cores, percentage of core involvement for each positive core, presence of intraductal carcinoma (IDC-P), perineural invasion (PNI).",
            "Schedule for risk stratification using NCCN or EAU criteria and staging investigations as indicated (NCCN PROS-5).",
            "Arrange urology/oncology consultation to discuss results and comprehensive treatment options."
          ],
          urgency: "Routine", // For next steps in planning
          actionType: "Detailed Pathology Review, Risk Stratification & Staging Initiation"
        }
      ]
    },
    {
      id: "pathology_review_risk_stratification_mdt",
      title: "Pathology Review, Risk Stratification, Staging & MDT Discussion",
      description: "Detailed review of biopsy pathology. Risk stratify using NCCN criteria (Very Low to Very High Risk) or EAU risk groups (Low, Intermediate, High). Staging investigations: Bone scan and CT Abdomen/Pelvis for unfavorable intermediate-risk with >cT2b or GG >2, or high-risk localized. PSMA PET-CT (if available) is preferred over conventional imaging for initial staging of unfavorable intermediate, high, and very high-risk disease, or any suspected metastatic disease (NCCN PROS-5, EAU 2024). Discuss germline (for all high/very high risk, metastatic, +ve family hx, IDC-P) and somatic testing (for metastatic/recurrent, or regional considering treatment implications). Present at MDT.",
      expectedDuration: "1-2 weeks (for staging and MDT)",
      guidelineSource: "NCCN PROS-5, PROS-6, PROS-7 2024, AJCC 8th Ed., EAU Guidelines 2024",
      evidenceLevel: "I",
      requiresMDT: true,
      patientInfo: "Explain Gleason score, Grade Group, full risk category, and implications for treatment options/prognosis. Discuss need and type of staging scans. Explain genetic testing rationale if indicated. Describe MDT role in recommending optimal treatment.",
      pitfalls: ["Incorrect Gleason grading or incomplete pathology reporting.", "Under-staging due to inappropriate imaging modality or missed metastatic disease.", "Not offering germline/somatic testing as per evolving guidelines, missing actionable mutations.", "Delay in MDT discussion impacting timely treatment initiation for aggressive cancers."],
      options: [
        {
          text: "Localized disease: Very Low, Low, or Favorable Intermediate Risk (NCCN)",
          next: "treatment_options_discussion_low_favorable_intermediate_risk_prostate"
        },
        {
          text: "Localized disease: Unfavorable Intermediate, High, or Very High Risk (NCCN)",
          next: "treatment_options_discussion_unfavorable_intermediate_high_risk_prostate"
        },
        {
          text: "Regional lymph node involvement (N1) identified on staging",
          next: "treatment_planning_n1_prostate_cancer",
          triggers: ["prostate_n1_disease_staging"]
        },
        {
          text: "Metastatic (M1) disease identified on staging",
          next: "treatment_planning_m1_prostate_cancer",
          triggers: ["prostate_m1_disease_staging"]
        }
      ],
      redFlags: [
        {
          id: "prostate_n1_disease_staging",
          condition: "Regional lymph node (N1) disease confirmed on staging investigations.",
          message: "Pelvic lymph node positive (N1) prostate cancer. Treatment typically involves multimodal therapy.",
          severity: "critical", // For treatment planning
          recommendations: [
            "Medical oncology / Urologic oncology / Radiation oncology consultation for multimodal therapy planning (e.g., EBRT + ADT, possibly with abiraterone; or radical prostatectomy + ePLND followed by adjuvant/salvage therapy).",
            "Ensure comprehensive somatic/germline testing.",
            "Discuss prognosis, goals of care, and clinical trial options."
          ],
          urgency: "Routine", // For specialist consults
          actionType: "Multidisciplinary Consultation for N1 Disease"
        },
        {
          id: "prostate_m1_disease_staging",
          condition: "Metastatic (M1) disease confirmed on staging investigations (bone, distant lymph nodes, visceral).",
          message: "Metastatic prostate cancer. Systemic therapy is the cornerstone of management. Assess for oligometastatic vs widespread disease.",
          severity: "critical", // For treatment planning
          recommendations: [
            "Urgent medical oncology/urologic oncology consultation.",
            "Initiate Androgen Deprivation Therapy (ADT) promptly. Consider combination therapy (e.g., ADT + ARPI, ADT + docetaxel, or triplet therapy for high volume/de novo metastatic HSPC).",
            "Ensure comprehensive somatic/germline testing (e.g. BRCA, HRR mutations, MSI/dMMR).",
            "Discuss prognosis, goals of care, palliative care involvement, and clinical trial options.",
            "Address bone health (calcium, Vit D, bone protective agents)."
          ],
          urgency: "Same-day",
          actionType: "Urgent Oncology Consultation & Systemic Therapy Initiation for M1 Disease"
        }
      ]
    }
    // Further steps for treatment options (active surveillance, surgery, radiation, hormonal therapy, chemotherapy), management of recurrence, castrate-resistant disease, survivorship etc.
  ]
};
