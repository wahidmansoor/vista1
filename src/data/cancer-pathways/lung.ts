import { StepBasedPathway } from "../../types/cancer-pathways";

export const lungCancerPathway: StepBasedPathway = {
  id: "lung",
  name: "Lung Cancer Diagnostic Pathway",
  description: "Systematic approach to lung cancer evaluation and staging, compliant with NCCN 2024 and ESMO 2023 guidelines.",
  recommendedTimeframe: "2-3 weeks",
  steps: [
    {
      id: "initial",
      title: "Initial Presentation & Risk Assessment",
      description: "Patient presents with symptoms (e.g., persistent cough, dyspnea, hemoptysis) or incidental imaging finding concerning for lung cancer. Assess risk factors (smoking history, family history, occupational exposure).",
      expectedDuration: "1-2 days",
      guidelineSource: "NCCN LU-1 2024",
      evidenceLevel: "I",
      patientInfo: "Discuss the importance of evaluating symptoms and the plan for initial imaging if indicated. Counsel on smoking cessation.",
      pitfalls: ["Dismissing symptoms as benign without investigation in high-risk patients.", "Delay in ordering initial imaging."],
      options: [
        {
          text: "Suspicious chest imaging findings (e.g., nodule >8mm)",
          next: "imaging",
          triggers: ["suspicious_imaging"]
        },
        {
          text: "Symptoms suggestive of lung cancer (e.g., hemoptysis, new persistent cough >3 weeks)",
          next: "symptoms",
          triggers: ["concerning_symptoms"]
        }
      ],
      redFlags: [
        {
          id: "suspicious_imaging",
          condition: "Suspicious chest imaging (e.g., solid nodule >8mm, part-solid nodule, GGO with solid component)",
          message: "Imaging findings concerning for malignancy. Refer to NCCN LU-2 for nodule management.",
          severity: "critical",
          recommendations: [
            "Expedite dedicated CT chest with contrast (unless contraindicated).",
            "Early pulmonology/thoracic surgery consultation within 1 week.",
            "Review smoking history and occupational exposures in detail."
          ],
          urgency: "Same-day",
          actionType: "Referral and Imaging"
        },
        {
          id: "concerning_symptoms",
          condition: "High-risk symptoms (e.g., hemoptysis, unexplained weight loss, new hoarseness)",
          message: "Symptoms concerning for lung cancer warrant prompt investigation.",
          severity: "warning",
          recommendations: [
            "Chest imaging (CXR or CT) within 1 week as per NICE NG12.",
            "Document duration, severity, and progression of symptoms.",
            "Assess for other red flag symptoms (e.g., superior vena cava syndrome)."
          ],
          urgency: "Routine",
          actionType: "Investigation"
        }
      ]
    },
    {
      id: "imaging",
      title: "Diagnostic Imaging Studies",
      description: "Perform high-quality CT chest with IV contrast to characterize lesion(s) and assess for mediastinal/hilar adenopathy and distant metastases. PET-CT for staging if appropriate (NCCN LU-3).",
      expectedDuration: "3-5 days",
      tooltip: "CT features: size, morphology (solid, subsolid), spiculation, pleural retraction. PET-CT for FDG-avidity. Ensure renal function adequate for contrast.",
      guidelineSource: "NCCN LU-3 2024, ESMO LG-2023",
      evidenceLevel: "I",
      patientInfo: "Explain the purpose of CT/PET-CT, what to expect during the scan, and potential findings. Discuss contrast allergy risks.",
      pitfalls: ["Inadequate CT slice thickness for small nodule characterization.", "Misinterpretation of inflammatory vs. malignant FDG uptake on PET.", "Not performing PET-CT prior to invasive staging in potentially resectable disease."],
      options: [
        {
          text: "Definitive lesion on CT Chest requiring characterization",
          next: "characterize",
          triggers: ["significant_findings"]
        },
        {
          text: "Suspected Stage III/IV or indeterminate findings, proceed to PET/CT",
          next: "staging",
          triggers: ["metastatic_suspicion"]
        }
      ],
      redFlags: [
        {
          id: "significant_findings",
          condition: "CT findings highly suspicious for malignancy (e.g., spiculated mass, large nodule with growth)",
          message: "Features highly suspicious for malignancy. Requires tissue diagnosis.",
          severity: "critical",
          recommendations: [
            "Expedite tissue diagnosis (biopsy/bronchoscopy).",
            "Consider PET/CT for staging if not already done (NCCN LU-4).",
            "Early thoracic MDT discussion planning (within 1-2 weeks)."
          ],
          urgency: "Same-day",
          actionType: "Biopsy and Staging"
        },
        {
          id: "metastatic_suspicion",
          condition: "Suspected metastatic disease on CT or PET-CT (e.g., adrenal, liver, bone lesions)",
          message: "Features concerning for advanced/metastatic disease. Biopsy of metastatic site may be preferred.",
          severity: "critical",
          recommendations: [
            "Complete staging workup (e.g., brain MRI).",
            "Early medical oncology consultation.",
            "Plan for molecular testing on diagnostic tissue (NCCN LU-5)."
          ],
          urgency: "Same-day",
          actionType: "Referral and Staging"
        }
      ]
    },
    {
      id: "characterize",
      title: "Lesion Characterization & Biopsy Planning",
      description: "Determine optimal biopsy strategy based on lesion location, size, and patient fitness. Peripheral lesions often amenable to CT-guided biopsy; central lesions may require bronchoscopy (EBUS/Navigational).",
      expectedDuration: "1-2 days",
      guidelineSource: "ACCP Lung Cancer Guidelines 2013, BTS 2023",
      evidenceLevel: "I",
      requiresMDT: true,
      patientInfo: "Discuss biopsy options, risks (pneumothorax, bleeding), benefits, and alternatives. Obtain informed consent.",
      pitfalls: ["Choosing a suboptimal biopsy technique leading to non-diagnostic sample.", "Delay in biopsy scheduling.", "Not obtaining sufficient tissue for molecular testing."],
      options: [
        {
          text: "Peripheral lesion accessible to percutaneous biopsy",
          next: "biopsy"
        },
        {
          text: "Central lesion or mediastinal nodes requiring bronchoscopy/EBUS",
          next: "bronchoscopy"
        }
      ]
    },
    {
      id: "biopsy",
      title: "Tissue Biopsy (Percutaneous)",
      description: "Perform image-guided (typically CT) core needle biopsy for peripheral lung lesions. Ensure adequate sample for histology and molecular testing (NCCN LU-5).",
      expectedDuration: "2-5 days",
      tooltip: "Core biopsy preferred over FNA for architectural assessment and molecular studies. Risks: pneumothorax (15-25%), bleeding. Post-procedure CXR.",
      guidelineSource: "NCCN LU-4 2024",
      evidenceLevel: "I",
      requiresMDT: true,
      patientInfo: "Discuss risks (pneumothorax, bleeding, pain) and benefits of CT-guided biopsy. Obtain informed consent. Provide post-procedure instructions.",
      pitfalls: ["Non-diagnostic sample due to poor targeting or insufficient tissue.", "Delay in pathology reporting.", "Not sending tissue for molecular markers if adenocarcinoma suspected."],
      options: [
        { text: "Malignancy confirmed (e.g., NSCLC, SCLC)", next: "staging_post_biopsy" },
        { text: "Non-diagnostic or benign pathology", next: "mdt_review_indeterminate" }
      ]
    },
    {
      id: "bronchoscopy",
      title: "Bronchoscopy & Endobronchial Ultrasound (EBUS)",
      description: "For central lesions or mediastinal/hilar lymph node staging. EBUS-TBNA for lymph node sampling. Navigational bronchoscopy for peripheral lesions not suitable for CT-biopsy.",
      expectedDuration: "2-5 days",
      tooltip: "EBUS-TBNA is crucial for mediastinal staging (NCCN LU-4). Risks: bleeding, infection, pneumothorax (rare).",
      guidelineSource: "NCCN LU-4 2024, ERS/ESTS Guidelines",
      evidenceLevel: "I",
      requiresMDT: true,
      patientInfo: "Explain procedure, sedation, potential discomfort, and risks. Obtain informed consent. NPO instructions.",
      pitfalls: ["Inadequate nodal staging if EBUS not performed systematically.", "Complications in patients with severe COPD.", "Insufficient material from FNA for all molecular tests."],
      options: [
        { text: "Malignancy confirmed, staging complete or needs PET", next: "staging_post_biopsy" },
        { text: "Non-diagnostic or benign pathology", next: "mdt_review_indeterminate" }
      ]
    },
    {
      id: "staging_post_biopsy",
      title: "Post-Biopsy Staging & MDT Review",
      description: "Integrate histological diagnosis with PET-CT and other imaging (e.g., Brain MRI for NSCLC as per NCCN LU-6) to establish definitive TNM stage. All cases to be discussed at MDT.",
      expectedDuration: "5-7 days",
      guidelineSource: "NCCN LU-6/LU-7 2024",
      evidenceLevel: "I",
      requiresMDT: true,
      patientInfo: "Explain the staging results and their implications for treatment options. Outline the role of the MDT.",
      pitfalls: ["Incomplete staging (e.g., omitting brain MRI in non-metastatic NSCLC).", "Delay in MDT discussion.", "Not performing molecular testing for NSCLC adenocarcinoma (EGFR, ALK, ROS1, BRAF, PD-L1 etc. - NCCN LU-5)."],
      options: [
        {
          text: "Localized disease (Stage I-II, selected III)",
          next: "treatment_planning_curative"
        },
        {
          text: "Locally advanced disease (Stage III)",
          next: "treatment_planning_multimodal"
        },
        {
          text: "Metastatic disease (Stage IV)",
          next: "palliative",
          triggers: ["metastatic_confirmed"]
        }
      ],
      redFlags: [
        {
          id: "metastatic_confirmed",
          condition: "Confirmed metastatic disease (Stage IV)",
          message: "Stage IV disease identified. Focus on systemic therapy and palliative care.",
          severity: "critical",
          recommendations: [
            "Urgent medical oncology consultation (within 1 week).",
            "Ensure comprehensive molecular testing is performed/pending (NCCN LU-9).",
            "Early palliative care involvement for symptom management and goals of care discussion.",
            "Discuss prognosis and treatment goals with patient and family."
          ],
          urgency: "Same-day",
          actionType: "Referral and Systemic Therapy Planning"
        }
      ]
    }
    // Add further steps for treatment planning, palliative care, MDT review of indeterminate findings etc.
  ]
};
