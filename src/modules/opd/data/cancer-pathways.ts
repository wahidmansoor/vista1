// Cancer pathways data

export const cancerPathwaysData = {
  lung: {
    name: "Lung Cancer Pathway",
    symptoms: ["Persistent cough", "Shortness of breath", "Chest pain"],
    investigations: ["Chest X-ray", "CT chest", "Bronchoscopy"],
    decisionTree: {
      name: "Lung Cancer Decision Tree",
      nodes: []
    }
  },
  breast: {
    name: "Breast Cancer Pathway", 
    symptoms: ["Breast lump", "Breast pain", "Nipple discharge"],
    investigations: ["Mammography", "Ultrasound", "Biopsy"],
    decisionTree: {
      name: "Breast Cancer Decision Tree",
      nodes: []
    }
  }
};
