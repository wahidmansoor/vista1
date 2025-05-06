export const lungCancerPathway = {
  name: "Lung Cancer Diagnostic Pathway",
  steps: [
    {
      id: "initial",
      title: "Initial Presentation",
      description: "Patient presents with suspicious symptoms or findings",
      options: [
        {
          text: "Suspicious chest imaging findings",
          next: "imaging"
        },
        {
          text: "Symptoms suggestive of lung cancer",
          next: "symptoms"
        }
      ]
    },
    {
      id: "imaging",
      title: "Imaging Studies",
      description: "Confirm findings with appropriate imaging",
      options: [
        {
          text: "CT Chest with contrast",
          next: "characterize"
        },
        {
          text: "PET/CT if metastatic disease suspected",
          next: "staging"
        }
      ]
    },
    {
      id: "symptoms",
      title: "Clinical Assessment",
      description: "Evaluate symptoms and risk factors",
      options: [
        {
          text: "High-risk symptoms/findings",
          next: "imaging"
        },
        {
          text: "Low-risk symptoms",
          next: "monitor"
        }
      ]
    },
    {
      id: "characterize",
      title: "Lesion Characterization",
      description: "Determine lesion features and location",
      options: [
        {
          text: "Peripheral lesion",
          next: "biopsy"
        },
        {
          text: "Central lesion",
          next: "bronchoscopy"
        }
      ]
    },
    {
      id: "staging",
      title: "Disease Staging",
      description: "Determine extent of disease",
      options: [
        {
          text: "Localized disease",
          next: "mdtb"
        },
        {
          text: "Metastatic disease",
          next: "palliative"
        }
      ]
    }
  ]
};
