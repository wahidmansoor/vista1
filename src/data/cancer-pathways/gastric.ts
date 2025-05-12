import { StepBasedPathway } from "../../types/cancer-pathways";

export const gastricCancerPathway: StepBasedPathway = {
  id: "gastric",
  name: "Gastric Cancer Diagnostic Pathway",
  description: "Systematic approach to gastric cancer diagnosis and staging, aligned with NCCN 2024, ESMO 2023, and Japanese Gastric Cancer Association (JGCA) guidelines.",
  recommendedTimeframe: "1-2 weeks for endoscopy and biopsy results; 2-3 weeks for full staging and MDT discussion if cancer confirmed.",
  steps: [
    {
      id: "initial",
      title: "Initial Assessment & Symptom Evaluation",
      description: "Patient presents with dyspepsia, epigastric pain, weight loss, dysphagia, early satiety, or signs of GI bleeding (melena, hematemesis). Assess for alarm features (NCCN GC-1). Evaluate H. pylori risk factors.",
      expectedDuration: "1-2 days",
      guidelineSource: "NCCN GC-1 2024, ESMO Clinical Practice Guidelines 2023",
      evidenceLevel: "I",
      patientInfo: "Explain the importance of evaluating persistent GI symptoms. Discuss alarm features and the need for endoscopy if present. Address anxiety.",
      pitfalls: ["Attributing symptoms to GERD without investigating further in at-risk patients.", "Delaying endoscopy in patients with alarm features.", "Not considering H. pylori testing in dyspeptic patients without alarm features (age <60)."],
      options: [
        {
          text: "Alarm features present (e.g., weight loss, dysphagia, persistent vomiting, GI bleed, palpable mass, iron deficiency anemia) OR age >60 with new onset dyspepsia (NCCN GC-1)",
          next: "urgent_endoscopy_biopsy",
          triggers: ["alarm_symptoms_gc"]
        },
        {
          text: "No alarm features, age <60: Test for H. pylori (urea breath test or stool antigen). If positive, treat.",
          next: "hp_testing_management"
        },
        {
          text: "No alarm features, H. pylori negative or treated but symptoms persist >4-8 weeks",
          next: "endoscopy_biopsy_non_urgent"
        }
      ],
      redFlags: [
        {
          id: "alarm_symptoms_gc",
          condition: "Presence of alarm features (e.g., significant weight loss, progressive dysphagia, overt GI bleeding, palpable mass).",
          message: "High suspicion for malignancy. Requires prompt endoscopic evaluation.",
          severity: "critical",
          recommendations: [
            "Schedule upper GI endoscopy (EGD) within 2 weeks (NCCN GC-1).",
            "Obtain CBC, iron studies, LFTs, albumin.",
            "If active severe bleeding, manage as GI emergency (see GI Bleed Pathway)."
          ],
          urgency: "Routine", // For endoscopy scheduling, unless active emergency
          actionType: "Endoscopy Scheduling & Lab Workup"
        }
      ]
    },
    {
      id: "urgent_endoscopy_biopsy",
      title: "Upper GI Endoscopy (EGD) & Biopsy",
      description: "Perform EGD with high-definition white light and chromoendoscopy/NBI if available. Document lesion morphology (Paris classification), location, and extent. Obtain multiple biopsies (at least 6-8) from suspicious lesions for histology. Biopsy normal-appearing mucosa if linitis plastica suspected.",
      expectedDuration: "1-3 days (procedure to initial findings)",
      tooltip: "Systematic biopsy protocol is crucial. Photograph lesions. Consider EUS at same session if deep invasion suspected and expertise available.",
      guidelineSource: "NCCN GC-1 2024, ESGE Guideline 2022",
      evidenceLevel: "I",
      patientInfo: "Explain EGD procedure, sedation, risks (bleeding, perforation, aspiration), and purpose of biopsies. Obtain informed consent.",
      pitfalls: ["Insufficient number or quality of biopsies.", "Missing early or flat lesions.", "Not documenting precise location for surgical planning.", "Failure to biopsy suspicious regional nodes if seen on EUS."],
      options: [
        {
          text: "Gastric malignancy suspected/confirmed on EGD/biopsy (adenocarcinoma, lymphoma, GIST, NET)",
          next: "pathology_review_molecular_testing",
          triggers: ["gastric_cancer_diagnosis"]
        },
        {
          text: "High-grade dysplasia found",
          next: "hgd_management"
        },
        {
          text: "Benign findings (e.g., gastritis, ulcer) or low-grade dysplasia",
          next: "benign_lgd_management"
        },
        {
          text: "Non-diagnostic EGD/biopsy but high clinical suspicion persists",
          next: "repeat_egd_alternative_imaging"
        }
      ],
      redFlags: [
        {
          id: "gastric_cancer_diagnosis",
          condition: "Histopathological confirmation of gastric malignancy.",
          message: "Gastric cancer diagnosed. Proceed with comprehensive staging and MDT discussion.",
          severity: "critical",
          recommendations: [
            "Ensure pathology report includes histologic type, grade, Lauren classification (intestinal/diffuse/mixed), HER2 IHC, PD-L1 CPS, and MSI status (NCCN GC-2).",
            "Schedule staging CT Chest/Abdomen/Pelvis with oral and IV contrast.",
            "Refer to multidisciplinary team (surgeon, medical oncologist, radiation oncologist, pathologist, radiologist)."
          ],
          urgency: "Routine",
          actionType: "Staging & MDT Referral"
        },
        {
          id: "linitis_plastica_suspicion",
          condition: "Endoscopic suspicion of linitis plastica (diffusely infiltrated, rigid stomach wall).",
          message: "High suspicion for aggressive diffuse-type adenocarcinoma. Often underdiagnosed on biopsy.",
          severity: "critical",
          recommendations: [
            "Take multiple deep biopsies or jumbo biopsies from different areas.",
            "Consider EUS with FNA of thickened wall.",
            "CT scan may show characteristic wall thickening. PET-CT can be helpful.",
            "Early surgical consultation is critical due to poor prognosis."
          ],
          urgency: "Same-day", // For planning further immediate diagnostics
          actionType: "Enhanced Biopsy & Imaging, Urgent Consult"
        }
      ]
    },
    {
      id: "pathology_review_molecular_testing",
      title: "Pathology Review & Molecular Testing",
      description: "Confirm histologic type (adenocarcinoma most common). For adenocarcinoma: assess grade, Lauren classification. Perform HER2 IHC (reflex FISH if IHC 2+). Test for MSI (IHC or PCR) and PD-L1 (CPS score, e.g., 22C3 or 28-8 pharmDx). Consider NTRK fusion testing for advanced disease.",
      expectedDuration: "5-10 days (for full molecular results)",
      tooltip: "Molecular testing is crucial for guiding systemic therapy in advanced/metastatic disease. Ensure adequate tissue for all tests.",
      guidelineSource: "NCCN GC-2 & GC-F 2024, CAP Guideline 2022",
      evidenceLevel: "I",
      requiresMDT: true,
      patientInfo: "Explain that detailed tumor analysis helps determine the best treatment options, including targeted therapies or immunotherapy.",
      pitfalls: ["Insufficient tissue for all molecular tests.", "Delay in obtaining molecular results impacting treatment decisions.", "Misinterpretation of HER2 or PD-L1 scoring."],
      options: [
        {
          text: "Pathology and molecular results available",
          next: "staging_workup_gastric"
        }
      ]
    },
    {
      id: "staging_workup_gastric",
      title: "Comprehensive Staging Workup",
      description: "CT Chest/Abdomen/Pelvis with oral and IV contrast. EUS for T and N staging of non-metastatic disease (NCCN GC-3). PET-CT if potentially resectable M0 disease to rule out occult mets (especially for GEJ or bulky tumors) or if CT equivocal. Diagnostic laparoscopy with peritoneal washings for all potentially resectable (cT1b or higher) gastric cancers before neoadjuvant/adjuvant therapy or surgery (NCCN GC-3). Assess nutritional status (albumin, prealbumin, weight loss %).",
      expectedDuration: "1-2 weeks",
      guidelineSource: "NCCN GC-3 & GC-4 2024, ESMO Guidelines 2023",
      evidenceLevel: "I",
      requiresMDT: true,
      patientInfo: "Explain the purpose of each staging test (CT, EUS, PET, laparoscopy) in determining the extent of cancer and guiding treatment. Discuss nutritional support if needed.",
      pitfalls: ["Omitting diagnostic laparoscopy for potentially resectable cases, leading to unexpected positive cytology or peritoneal mets at surgery.", "Underutilization of EUS for local staging.", "Not addressing malnutrition preoperatively."],
      options: [
        {
          text: "Resectable disease (cT1-T4a, N0-N3, M0, no positive cytology) - candidate for perioperative/neoadjuvant therapy or upfront surgery based on stage/MDT",
          next: "mdt_treatment_planning_resectable"
        },
        {
          text: "Unresectable locally advanced disease (T4b, bulky N3, encasement of major vessels) OR Oligometastatic disease potentially convertible",
          next: "mdt_treatment_planning_unresectable_locally_advanced"
        },
        {
          text: "Widely metastatic disease (M1) or positive peritoneal cytology",
          next: "mdt_treatment_planning_metastatic",
          triggers: ["metastatic_gastric_cancer"]
        }
      ],
      redFlags: [
        {
          id: "metastatic_gastric_cancer",
          condition: "Metastatic disease (M1) confirmed by imaging or positive peritoneal cytology.",
          message: "Stage IV gastric cancer. Treatment is primarily systemic with palliative intent.",
          severity: "critical",
          recommendations: [
            "Medical oncology consultation for systemic therapy (chemotherapy +/- HER2-targeted therapy +/- immunotherapy based on biomarkers).",
            "Early palliative care referral for symptom management and goals of care discussion.",
            "Nutritional support, management of ascites/obstruction as needed.",
            "Consider clinical trials."
          ],
          urgency: "Same-day", // For oncology referral and palliative care
          actionType: "Systemic Therapy Planning & Supportive Care"
        }
      ]
    }
    // Further steps for MDT planning for resectable, unresectable, metastatic; surgical details; adjuvant/palliative treatments etc.
  ]
};
