// Diagnostic pathways data

export const lungCancerPathway = {
  name: "Lung Cancer Diagnostic Pathway",
  decisionTree: {
    name: "Lung Cancer Decision Tree",
    nodes: [
      {
        id: "1",
        question: "Patient age > 50 with smoking history?",
        yes: "2",
        no: "3"
      }
    ]
  },
  considerations: [
    "High-risk factors include smoking history, asbestos exposure",
    "Consider screening for high-risk patients"
  ],
  outcomes: [
    "Early detection improves survival",
    "Staging determines treatment approach"
  ],
  followUp: [
    "Regular imaging surveillance",
    "Multidisciplinary team review"
  ]
};
