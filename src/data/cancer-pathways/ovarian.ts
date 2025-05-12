import { StepBasedPathway } from "../../types/cancer-pathways";

export const ovarianCancerPathway: StepBasedPathway = {
  id: "ovarian",
  name: "Ovarian Cancer Diagnostic Pathway",
  description: "Evidence-based approach to ovarian cancer diagnosis and staging, aligned with NCCN 2024, ESGO-ESTRO-ESP 2023, and SGO guidelines.",
  recommendedTimeframe: "1-2 weeks for diagnosis; 2-4 weeks for full staging and surgical planning.",
  steps: [
    {
      id: "initial",
      title: "Initial Assessment & Symptom Evaluation",
      description: "Patient presents with symptoms (e.g., bloating, pelvic/abdominal pain, early satiety, urinary urgency/frequency - often persistent and new-onset) or incidental adnexal mass on imaging. Detailed history, including family history of ovarian/breast cancer (BRCA).",
      expectedDuration: "1-2 days",
      guidelineSource: "NCCN OV-1 2024, ACOG Committee Opinion No. 716",
      evidenceLevel: "I",
      patientInfo: "Explain that symptoms can be vague and the importance of thorough evaluation. Discuss family history and potential genetic predisposition. Address anxiety.",
      pitfalls: ["Dismissing vague symptoms as benign, especially in premenopausal women.", "Not taking a detailed family history.", "Delay in referral to gynecologic oncology for suspicious findings."],
      options: [
        {
          text: "Suspicious pelvic mass on prior imaging or exam, or persistent concerning symptoms",
          next: "pelvic_exam_ultrasound"
        },
        {
          text: "Incidental adnexal finding, low suspicion symptoms",
          next: "initial_workup_low_risk"
        }
      ],
      redFlags: [
        {
          id: "acute_symptoms_high_risk",
          condition: "Acute abdominal/pelvic pain with adnexal mass, signs of torsion, rupture, or bowel obstruction.",
          message: "Potential oncologic emergency or acute gynecologic condition. Requires urgent evaluation.",
          severity: "critical",
          recommendations: [
            "Urgent gynecologic/surgical consultation (within 24 hours).",
            "Immediate imaging (pelvic ultrasound, CT if indicated).",
            "Assess for hemodynamic instability."
          ],
          urgency: "Immediate",
          actionType: "Urgent Specialist Consultation & Imaging"
        }
      ]
    },
    {
      id: "pelvic_exam_ultrasound",
      title: "Pelvic Examination & Transvaginal Ultrasound (TVUS)",
      description: "Perform comprehensive pelvic examination (bimanual and rectovaginal). Perform TVUS to characterize adnexal mass(es) - size, morphology (solid components, septations, papillary projections, laterality), and assess for ascites/peritoneal disease. Use IOTA ADNEX model or RMI if available.",
      expectedDuration: "1 day",
      tooltip: "Document mass characteristics meticulously. TVUS is the primary imaging modality. Consider CA-125 concurrently.",
      guidelineSource: "NCCN OV-1 2024, ISUOG Consensus Statement 2017",
      evidenceLevel: "I",
      calculatorId: "IOTA_ADNEX_model", // Example
      patientInfo: "Explain the pelvic exam and TVUS procedure. Discuss how ultrasound helps characterize the mass. Reassure patient during exam.",
      pitfalls: ["Incomplete pelvic exam.", "Suboptimal ultrasound technique or interpretation.", "Not recognizing high-risk ultrasound features."],
      options: [
        {
          text: "High suspicion of malignancy on exam/TVUS (e.g., solid/complex mass, ascites, peritoneal nodules, IOTA ADNEX high risk)",
          next: "tumor_markers_ct_staging",
          triggers: ["suspicious_mass_imaging"]
        },
        {
          text: "Indeterminate findings on TVUS",
          next: "tumor_markers_ct_staging" // Usually proceed with further workup
        },
        {
          text: "Clearly benign simple cyst on TVUS (e.g., <10cm, unilocular, anechoic)",
          next: "benign_cyst_management"
        }
      ],
      redFlags: [
        {
          id: "suspicious_mass_imaging",
          condition: "Adnexal mass with ultrasound features suspicious for malignancy (e.g., solid component, papillary projections, ascites, high vascularity).",
          message: "Findings highly concerning for ovarian malignancy. Requires prompt referral to Gynecologic Oncologist.",
          severity: "critical",
          recommendations: [
            "Refer to Gynecologic Oncologist within 1 week (NCCN OV-2).",
            "Obtain CA-125, HE4 (if available, for ROMA score), and other markers (CEA, CA19-9, AFP, hCG, LDH if suspicious for non-epithelial tumor).",
            "Proceed to CT Chest/Abdomen/Pelvis with contrast for staging."
          ],
          urgency: "Same-day", // For referral initiation and test ordering
          actionType: "Referral & Staging Workup"
        }
      ]
    },
    {
      id: "tumor_markers_ct_staging",
      title: "Tumor Markers & CT Staging",
      description: "Measure serum CA-125. In premenopausal women with complex mass, also consider AFP, hCG, LDH. For postmenopausal women with adnexal mass, CA-125 and HE4 (for ROMA score) can aid risk assessment. Perform CT Chest/Abdomen/Pelvis with contrast for staging (assess peritoneal carcinomatosis, lymphadenopathy, distant mets).",
      expectedDuration: "3-5 days",
      tooltip: "CA-125 can be elevated in benign conditions. Interpret with imaging. CT helps determine resectability and guides surgical planning.",
      guidelineSource: "NCCN OV-1 & OV-2 2024, SGO Guidelines",
      evidenceLevel: "I",
      calculatorId: "ROMA_score", // Example
      patientInfo: "Explain blood tests for tumor markers and CT scan for staging. Discuss that CA-125 is not diagnostic alone but part of overall assessment.",
      pitfalls: ["Relying solely on CA-125 for diagnosis.", "Not ordering appropriate markers for suspected germ cell or stromal tumors in younger patients.", "Inadequate CT protocol or interpretation for peritoneal disease."],
      options: [
        {
          text: "High suspicion based on imaging, elevated markers (e.g., CA-125 >200 U/mL in postmenopausal, or high ROMA/ADNEX score), and/or CT findings of metastatic disease",
          next: "gyn_onc_consult_surgical_planning",
          triggers: ["confirmed_high_risk_oc"]
        },
        {
          text: "Indeterminate findings, further assessment needed (e.g. MRI Pelvis, GI consult if primary GI cancer suspected)",
          next: "mdt_review_further_investigation"
        }
      ],
      redFlags: [
        {
          id: "confirmed_high_risk_oc",
          condition: "Combination of suspicious imaging, significantly elevated tumor markers, and/or CT evidence of advanced disease.",
          message: "High probability of ovarian cancer. Management by Gynecologic Oncologist is mandatory.",
          severity: "critical",
          recommendations: [
            "Ensure Gynecologic Oncologist is leading management.",
            "Discuss goals of care, including fertility preservation if applicable and feasible.",
            "Plan for surgical staging/debulking or neoadjuvant chemotherapy based on resectability assessment (NCCN OV-3/OV-4).",
            "Offer genetic counseling (BRCA, Lynch syndrome) - NCCN OV-1."
          ],
          urgency: "Routine", // Assuming referral already made
          actionType: "Definitive Management Planning"
        },
        {
          id: "bowel_ureteric_obstruction",
          condition: "Evidence of bowel or ureteric obstruction on CT scan.",
          message: "Significant complication requiring urgent intervention or planning.",
          severity: "critical",
          recommendations: [
            "Urgent surgical/urologic/GI consultation as appropriate.",
            "Consider stenting or diversion if symptomatic or impending renal failure.",
            "Incorporate into overall surgical/treatment plan."
          ],
          urgency: "Same-day",
          actionType: "Intervention & Specialist Consultation"
        }
      ]
    },
    {
      id: "gyn_onc_consult_surgical_planning",
      title: "Gynecologic Oncology Consultation & Surgical/Treatment Planning",
      description: "Comprehensive consultation with Gynecologic Oncologist. Review all data, discuss prognosis, treatment options (primary debulking surgery (PDS) vs. neoadjuvant chemotherapy (NACT) followed by interval debulking surgery). Biopsy may be obtained via laparoscopy or image-guided if PDS not planned initially or diagnosis uncertain.",
      expectedDuration: "3-7 days",
      guidelineSource: "NCCN OV-3 & OV-4 2024, ESGO Guidelines",
      evidenceLevel: "I",
      requiresMDT: true,
      patientInfo: "Detailed discussion of diagnosis, stage, treatment goals (curative/palliative), surgical procedures (TAH-BSO, omentectomy, lymphadenectomy, peritonectomy), chemotherapy, side effects, and expected recovery. Importance of MDT input. Clinical trial options.",
      pitfalls: ["Inadequate preoperative assessment of resectability leading to suboptimal surgery.", "Delay in starting NACT for unresectable disease.", "Not performing germline/somatic BRCA testing and HRD testing on tumor tissue (NCCN OV-5)."],
      options: [
        {
          text: "Proceed with Primary Debulking Surgery (PDS)",
          next: "primary_debulking_surgery"
        },
        {
          text: "Candidate for Neoadjuvant Chemotherapy (NACT) due to extensive disease or comorbidities",
          next: "neoadjuvant_chemotherapy_planning"
        },
        {
          text: "Diagnosis uncertain or requires tissue confirmation before major surgery/NACT",
          next: "diagnostic_laparoscopy_biopsy"
        }
      ]
      // Red flags for this step would relate to rapid deterioration or specific surgical contraindications arising.
    }
    // Further steps for surgical outcomes, adjuvant therapy, NACT response, benign cyst management, MDT reviews etc.
  ]
};
