import { StepBasedPathway } from "../../types/cancer-pathways";

export const headNeckCancerPathway: StepBasedPathway = {
  id: "head_neck",
  name: "Head & Neck Cancer Diagnostic Pathway",
  description: "Structured approach to head and neck cancer diagnosis, staging, and initial management, aligned with NCCN 2024 and ESMO 2023 guidelines.",
  recommendedTimeframe: "1-2 weeks for diagnosis; 2-3 weeks for full staging and MDT discussion.",
  steps: [
    {
      id: "initial",
      title: "Initial Presentation & Symptom Assessment",
      description: "Patient presents with symptoms such as persistent sore throat, dysphagia, odynophagia, hoarseness, neck mass, oral lesion, unexplained otalgia, or cranial neuropathies. Assess risk factors (tobacco, alcohol, HPV).",
      expectedDuration: "1-2 days",
      guidelineSource: "NCCN HN-1 2024, ESMO H&N Guidelines 2023",
      evidenceLevel: "I",
      patientInfo: "Explain the importance of evaluating persistent symptoms. Discuss risk factors. Address anxiety and the diagnostic plan, likely involving ENT specialist referral.",
      pitfalls: ["Delaying referral for persistent symptoms (>2-4 weeks).", "Not performing a thorough cranial nerve exam.", "Underestimating significance of unilateral otalgia or serous otitis media in adults (nasopharyngeal cancer risk)."],
      options: [
        {
          text: "Red flag symptoms: Stridor, airway compromise, significant bleeding, rapidly enlarging neck mass, cranial neuropathy",
          next: "emergency_assessment_ent",
          triggers: ["hn_emergency_symptoms"]
        },
        {
          text: "Suspicious neck mass, persistent hoarseness >2-4 wks, non-healing oral ulcer >2-4 wks, dysphagia/odynophagia, or other concerning symptoms",
          next: "ent_referral_exam"
        },
        {
          text: "Low suspicion symptoms, no clear red flags",
          next: "primary_care_monitoring_reassess"
        }
      ],
      redFlags: [
        {
          id: "hn_emergency_symptoms",
          condition: "Stridor, airway compromise, active hemorrhage from tumor site, rapidly progressive cranial neuropathy.",
          message: "Potential life-threatening situation. Requires immediate specialist assessment and possible intervention.",
          severity: "critical",
          recommendations: [
            "Immediate referral to ENT/Emergency Department.",
            "Secure airway if compromised (prepare for intubation/tracheostomy).",
            "Control hemorrhage.",
            "Urgent imaging (CT Head/Neck with contrast) may be needed."
          ],
          urgency: "Immediate",
          actionType: "Emergency Referral & Airway/Hemorrhage Management"
        }
      ]
    },
    {
      id: "ent_referral_exam",
      title: "ENT Specialist Examination & Endoscopy",
      description: "Comprehensive head and neck examination by ENT specialist, including palpation of neck nodes, oral cavity, and cranial nerve assessment. Perform flexible nasopharyngolaryngoscopy. Examination under anesthesia (EUA) with direct laryngoscopy, esophagoscopy, bronchoscopy (panendoscopy) may be indicated, especially for unknown primary or synchronous primary suspicion.",
      expectedDuration: "1-3 days",
      tooltip: "Document all subsites. Biopsy suspicious lesions during endoscopy/EUA. Consider HPV testing for oropharyngeal tumors (p16 IHC).",
      guidelineSource: "NCCN HN-1 & HN-2 2024",
      evidenceLevel: "I",
      requiresMDT: true, // For planning biopsy/EUA and subsequent steps
      patientInfo: "Explain the specialist exam, including flexible scope. If EUA needed, explain procedure, anesthesia, and purpose of biopsies.",
      pitfalls: ["Incomplete endoscopic examination missing a primary site.", "Not biopsying all suspicious areas.", "Failure to perform p16 testing on oropharyngeal SCC biopsies."],
      options: [
        {
          text: "Visible lesion identified, biopsy taken/planned",
          next: "pathology_review_hn"
        },
        {
          text: "Neck mass, primary unknown after initial endoscopy. Plan for EUA, imaging, possible FNA of neck node.",
          next: "unknown_primary_workup_hn"
        },
        {
          text: "No lesion found, symptoms persist or high suspicion",
          next: "imaging_hn_initial"
        }
      ]
    },
    {
      id: "pathology_review_hn",
      title: "Pathology Review & HPV Testing",
      description: "Histopathological confirmation of malignancy (usually Squamous Cell Carcinoma). For oropharyngeal SCC, p16 IHC testing is mandatory (NCCN HN-3). For nasopharyngeal carcinoma, EBV (EBER) testing. Note histologic grade and features like PNI, LVI.",
      expectedDuration: "3-7 days",
      tooltip: "p16 status significantly impacts staging and prognosis for oropharyngeal cancer. Ensure adequate tissue for all necessary tests.",
      guidelineSource: "NCCN HN-3 2024, CAP H&N Cancer Reporting Protocols",
      evidenceLevel: "I",
      requiresMDT: true,
      patientInfo: "Explain the biopsy results, including cancer type and HPV/EBV status if relevant. Discuss how this information guides staging and treatment.",
      pitfalls: ["p16 testing not performed or misinterpreted for oropharyngeal SCC.", "Insufficient biopsy material for complete diagnosis and molecular testing.", "Delay in pathology reporting."],
      options: [
        {
          text: "Malignancy confirmed (e.g., SCC, NPC, salivary gland tumor)",
          next: "staging_workup_hn",
          triggers: ["hn_cancer_confirmed"]
        },
        {
          text: "Dysplasia or pre-malignant lesion found",
          next: "premalignant_lesion_management_hn"
        },
        {
          text: "Biopsy benign or non-diagnostic, but high clinical suspicion remains",
          next: "repeat_biopsy_further_investigation_hn"
        }
      ],
      redFlags: [
        {
          id: "hn_cancer_confirmed",
          condition: "Histopathological confirmation of head and neck malignancy.",
          message: "Head and neck cancer diagnosed. Proceed with comprehensive staging and multidisciplinary team discussion.",
          severity: "critical",
          recommendations: [
            "Schedule staging imaging (CT Neck with contrast, CT Chest, PET-CT as per NCCN HN-4).",
            "Refer to multidisciplinary H&N oncology team (ENT surgeon, radiation oncologist, medical oncologist, pathologist, radiologist, speech pathologist, dietitian, dentist).",
            "Dental assessment prior to radiation therapy.",
            "Speech and swallow evaluation.",
            "Nutritional assessment and support."
          ],
          urgency: "Routine",
          actionType: "Staging, MDT Referral & Supportive Care Planning"
        }
      ]
    },
    {
      id: "staging_workup_hn",
      title: "Comprehensive Staging Workup",
      description: "CT Neck with IV contrast (from skull base to clavicles). CT Chest (with or without contrast). PET-CT (skull base to mid-thigh) for stage III/IV disease, unknown primary, or aggressive histology (NCCN HN-4). MRI for specific sites (e.g., nasopharynx, paranasal sinus, skull base, salivary glands, PNI assessment). Dental evaluation and speech/swallow function assessment.",
      expectedDuration: "1-2 weeks",
      guidelineSource: "NCCN HN-4 & HN-5 2024, AJCC 8th Ed. Staging Manual",
      evidenceLevel: "I",
      requiresMDT: true,
      patientInfo: "Explain the purpose of staging scans (CT, PET-CT, MRI) to determine cancer extent. Discuss importance of dental, speech, and swallow evaluations before treatment.",
      pitfalls: ["Incomplete staging (e.g., omitting chest imaging).", "Not performing PET-CT when indicated, potentially missing distant mets or unknown primary.", "Delay in dental clearance impacting start of radiation.", "Underestimation of tumor extent, especially perineural invasion, without appropriate MRI."],
      options: [
        {
          text: "Localized disease (Stage I-II) or selected Stage III/IVA (e.g. HPV+ oropharynx)",
          next: "mdt_treatment_planning_early_hn"
        },
        {
          text: "Locally/regionally advanced disease (Stage III-IVB, excluding M1)",
          next: "mdt_treatment_planning_advanced_hn"
        },
        {
          text: "Metastatic disease (Stage IVC / M1) identified",
          next: "mdt_treatment_planning_metastatic_hn",
          triggers: ["metastatic_hn_cancer"]
        },
        {
          text: "Cancer of Unknown Primary (CUP) with neck node mets",
          next: "unknown_primary_management_hn"
        }
      ],
      redFlags: [
        {
          id: "metastatic_hn_cancer",
          condition: "Metastatic disease (M1) confirmed by staging investigations.",
          message: "Stage IVC (metastatic) head and neck cancer. Treatment intent is primarily palliative.",
          severity: "critical",
          recommendations: [
            "Medical oncology consultation for systemic therapy (chemotherapy, immunotherapy, targeted therapy).",
            "Early palliative care referral for symptom control and goals of care discussion.",
            "Address nutritional support, pain management, and potential airway issues.",
            "Consider clinical trials."
          ],
          urgency: "Same-day", // For oncology and palliative care referrals
          actionType: "Systemic Therapy & Palliative Care Planning"
        }
      ]
    }
    // Further steps for MDT planning based on stage/site, treatment execution (surgery, RT, CRT), unknown primary management, surveillance etc.
  ]
};
