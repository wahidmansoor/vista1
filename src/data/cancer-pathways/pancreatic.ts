import { StepBasedPathway } from "../../types/cancer-pathways";

export const pancreaticCancerPathway: StepBasedPathway = {
  id: "pancreatic",
  name: "Pancreatic Cancer Diagnostic Pathway",
  description: "Evidence-based approach to pancreatic cancer diagnosis, staging, and initial management planning, aligned with NCCN 2024, ESMO 2023, and ASGE guidelines.",
  recommendedTimeframe: "1-2 weeks for diagnosis; 2-3 weeks for full staging and MDT discussion.",
  steps: [
    {
      id: "initial",
      title: "Initial Presentation & Symptom Evaluation",
      description: "Patient presents with symptoms such as painless obstructive jaundice, new-onset diabetes (especially >50 yrs with weight loss), unexplained persistent abdominal/back pain, weight loss, steatorrhea, or acute pancreatitis without clear cause.",
      expectedDuration: "1-2 days",
      guidelineSource: "NCCN PA-1 & PA-2 2024, ESMO Pancreatic Cancer Guidelines 2023",
      evidenceLevel: "I",
      patientInfo: "Explain that symptoms warrant investigation to rule out serious conditions, including pancreatic cancer. Discuss the diagnostic plan, likely involving imaging and specialist referral.",
      pitfalls: ["Attributing symptoms to benign GI issues, delaying diagnosis.", "Not recognizing new-onset diabetes with weight loss as a red flag.", "Delay in imaging for painless jaundice."],
      options: [
        {
          text: "Painless obstructive jaundice (elevated bilirubin, dark urine, pale stools)",
          next: "urgent_imaging_jaundice",
          triggers: ["pan_jaundice"]
        },
        {
          text: "Suspicious pancreatic mass/lesion found on incidental imaging",
          next: "dedicated_pancreatic_imaging"
        },
        {
          text: "Concerning symptoms (e.g., persistent epigastric pain radiating to back, unexplained significant weight loss, new-onset diabetes with weight loss) without jaundice",
          next: "initial_labs_imaging_non_jaundice"
        },
        {
          text: "Vague symptoms, low suspicion initially",
          next: "primary_care_workup_monitoring"
        }
      ],
      redFlags: [
        {
          id: "pan_jaundice",
          condition: "Painless obstructive jaundice.",
          message: "High suspicion for pancreatic head or periampullary malignancy. Requires urgent evaluation.",
          severity: "critical",
          recommendations: [
            "Urgent (within 48 hours) high-quality multiphase pancreatic protocol CT scan (or MRI/MRCP if CT contraindicated/equivocal).",
            "Check LFTs, coagulation profile (INR).",
            "Urgent referral to HPB surgeon / Gastroenterologist with expertise in pancreatobiliary diseases.",
            "Consider biliary drainage (ERCP with stenting or PTBD) if severe jaundice or cholangitis, after imaging if possible."
          ],
          urgency: "Immediate", // For imaging and referral
          actionType: "Urgent Imaging, Labs & Specialist Referral"
        },
        {
          id: "cholangitis_signs",
          condition: "Jaundice with fever, chills, RUQ pain (Charcot's triad) or sepsis.",
          message: "Acute cholangitis, a medical emergency. Requires immediate biliary decompression and antibiotics.",
          severity: "critical",
          recommendations: [
            "Immediate hospital admission.",
            "Broad-spectrum IV antibiotics.",
            "Urgent biliary decompression (ERCP or PTBD) within 12-24 hours.",
            "Fluid resuscitation and supportive care."
          ],
          urgency: "Immediate",
          actionType: "Emergency Admission & Intervention"
        }
      ]
    },
    {
      id: "dedicated_pancreatic_imaging",
      title: "High-Quality Pancreatic Imaging",
      description: "Perform multiphase pancreatic protocol CT (preferred) or MRI/MRCP. This is crucial for characterizing the lesion, assessing vascular involvement (SMA, SMV, portal vein, celiac axis), and detecting metastatic disease.",
      expectedDuration: "2-5 days",
      tooltip: "CT protocol: non-contrast, arterial, pancreatic parenchymal, and portal venous phases. Thin slices. Radiologist expertise is key.",
      guidelineSource: "NCCN PA-2 & PA-3 2024, International Consensus Guidelines 2017 (Radiology)",
      evidenceLevel: "I",
      patientInfo: "Explain the specific type of CT or MRI needed and why it’s important for detailed views of the pancreas and surrounding structures.",
      pitfalls: ["Using a generic abdominal CT instead of a dedicated pancreatic protocol scan.", "Misinterpretation of vascular involvement.", "Not identifying small liver or peritoneal metastases."],
      options: [
        {
          text: "Solid pancreatic mass identified, potentially resectable or borderline resectable",
          next: "ca19_9_tissue_acquisition"
        },
        {
          text: "Clearly unresectable locally advanced disease (e.g., extensive vascular encasement)",
          next: "ca19_9_tissue_acquisition_unresectable"
        },
        {
          text: "Metastatic disease identified on imaging",
          next: "ca19_9_biopsy_metastatic_site",
          triggers: ["pan_metastatic_imaging"]
        },
        {
          text: "Cystic lesion of pancreas identified",
          next: "pancreatic_cystic_lesion_pathway" // Link to separate pathway for cystic neoplasms
        },
        {
          text: "No discrete mass, but diffuse changes or secondary signs (e.g. dilated pancreatic duct)",
          next: "eus_evaluation_pancreas"
        }
      ],
      redFlags: [
        {
          id: "pan_metastatic_imaging",
          condition: "Evidence of metastatic disease (e.g., liver, lung, peritoneal metastases) on initial high-quality imaging.",
          message: "Metastatic pancreatic cancer. Tissue diagnosis is needed, preferably from a metastatic site. Treatment is systemic.",
          severity: "critical",
          recommendations: [
            "Obtain CA 19-9.",
            "Biopsy of an accessible metastatic lesion is preferred for diagnosis and molecular profiling.",
            "Refer to Medical Oncologist.",
            "Early Palliative Care consultation."
          ],
          urgency: "Routine",
          actionType: "Biopsy Planning & Oncology Referral"
        }
      ]
    },
    {
      id: "ca19_9_tissue_acquisition",
      title: "CA 19-9 & Tissue Acquisition Strategy",
      description: "Measure serum CA 19-9. Plan for tissue acquisition. EUS-FNA is preferred for most pancreatic head/body/tail lesions. CT-guided biopsy if EUS not feasible or for specific targets. Biopsy of suspected metastatic sites is preferred if M1 disease. For resectable disease without preoperative therapy planned, some centers proceed to surgery without biopsy if imaging is classic, but biopsy is generally recommended (NCCN PA-3).",
      expectedDuration: "3-7 days (including EUS scheduling and procedure)",
      tooltip: "CA 19-9 can be falsely normal in Lewis antigen negative individuals (~10%). EUS allows FNA and detailed local staging.",
      guidelineSource: "NCCN PA-3 2024, ASGE Guideline 2022 (EUS)",
      evidenceLevel: "I",
      requiresMDT: true, // To decide on biopsy necessity/approach for resectable cases
      patientInfo: "Explain CA 19-9 blood test. Discuss EUS/biopsy procedure, its purpose for confirming diagnosis and guiding treatment, risks (pancreatitis, bleeding, perforation).",
      pitfalls: ["Not obtaining tissue prior to neoadjuvant therapy.", "Performing percutaneous biopsy through uninvolved peritoneum if potentially resectable (risk of seeding - though controversial and often unavoidable).", "Non-diagnostic biopsy delaying treatment."],
      options: [
        {
          text: "Pancreatic adenocarcinoma or other malignancy confirmed by biopsy",
          next: "molecular_testing_staging_mdt"
        },
        {
          text: "Biopsy non-diagnostic, but high suspicion remains",
          next: "repeat_biopsy_alternative_approach"
        },
        {
          text: "Benign pathology, concordant with less suspicious imaging",
          next: "benign_pancreas_followup"
        }
      ]
    },
    {
      id: "molecular_testing_staging_mdt",
      title: "Molecular Testing, Full Staging Review & MDT",
      description: "For confirmed adenocarcinoma, perform germline testing for all patients (BRCA1/2, PALB2, ATM, Lynch syndrome genes, etc.). Somatic tumor testing (e.g., KRAS, NRG1, NTRK fusions, MSI/dMMR, HRD) for advanced/metastatic disease or if informing neoadjuvant/adjuvant choices (NCCN PA-4). Review all imaging with MDT (HPB surgeon, medical/radiation oncologist, radiologist, pathologist) to confirm resectability status (resectable, borderline, locally advanced unresectable, metastatic) using NCCN criteria. Consider staging laparoscopy for select cases (e.g. high CA19-9, large tumors, borderline resectable) to rule out occult peritoneal/liver mets.",
      expectedDuration: "1-2 weeks (molecular testing can take time)",
      guidelineSource: "NCCN PA-3, PA-4, PA-5 2024",
      evidenceLevel: "I",
      requiresMDT: true,
      patientInfo: "Explain that genetic testing (blood and/or tumor) can identify specific mutations that might guide treatment. Discuss MDT review and its role in formulating the best treatment plan. Explain staging laparoscopy if considered.",
      pitfalls: ["Not performing germline testing for all patients.", "Delay in obtaining molecular results for treatment decisions.", "Inaccurate staging due to lack of MDT review or omitting staging laparoscopy when indicated."],
      options: [
        {
          text: "Resectable disease confirmed by MDT",
          next: "treatment_planning_resectable_pancreas"
        },
        {
          text: "Borderline resectable disease confirmed by MDT",
          next: "treatment_planning_borderline_pancreas"
        },
        {
          text: "Locally advanced, unresectable disease confirmed by MDT",
          next: "treatment_planning_locally_advanced_pancreas"
        },
        {
          text: "Metastatic disease confirmed by MDT",
          next: "treatment_planning_metastatic_pancreas",
          triggers: ["pan_metastatic_mdt"]
        }
      ],
      redFlags: [
        {
          id: "pan_metastatic_mdt",
          condition: "Metastatic pancreatic cancer confirmed after full workup and MDT review.",
          message: "Definitive metastatic disease. Focus on systemic therapy and supportive/palliative care.",
          severity: "critical",
          recommendations: [
            "Medical Oncology to lead systemic therapy (chemotherapy +/- targeted therapy based on molecular results).",
            "Palliative care for symptom management, QoL, and goals of care.",
            "Nutritional support, pain management, management of biliary/duodenal obstruction.",
            "Discuss clinical trial options."
          ],
          urgency: "Routine", // Assuming prior referral if metastatic was suspected earlier
          actionType: "Systemic Therapy & Palliative Care"
        }
      ]
    }
    // Further steps for treatment planning based on resectability, neoadjuvant/adjuvant therapy, surgical management, palliative care details etc.
  ]
};
