import React, { useState } from 'react';
import { GitBranch, ChevronDown, Info, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DetailedInfo } from '../types/pathways';
import DecisionTree from './DecisionTree';
import { cancerPathwaysData } from '../data/cancer-pathways';
import { lungCancerPathway } from '../data/diagnostic-pathways';

// Example structure for additional info. You can customize this per cancer type.
const additionalCancerInfo: Record<string, Array<{ title: string; items: string[] }>> = {
  'Breast Cancer': [
    {
      title: 'Risk & Screening Guidelines',
      items: [
        'Early mammograms for high-risk patients (BRCA1/BRCA2 mutations)',
        'Annual exams starting at age 40, or earlier for high-risk groups',
        'Refer to official guidelines (NCCN, USPSTF, ACS) for intervals'
      ]
    },
    {
      title: 'Pre-Test Requirements',
      items: [
        'Avoid lotions or deodorants before mammograms',
        'Check for any metal implants before MRI',
        'Verify insurance coverage for genetic testing if indicated'
      ]
    },
    {
      title: 'Test Sensitivity & Specificity',
      items: [
        'Mammogram sensitivity varies by breast density (~80–90%)',
        'MRI can have higher sensitivity (~95%) but more false positives'
      ]
    },
    {
      title: 'Timing & Frequency',
      items: [
        'Annual screenings vs. biannual depends on risk stratification',
        'Follow-up mammograms every 6 months for suspicious lesions'
      ]
    },
    {
      title: 'Cost & Insurance Considerations',
      items: [
        'Most insurance covers screening mammograms',
        'MRI may require prior authorization',
        'Financial assistance programs are available if uninsured'
      ]
    },
    {
      title: 'Patient Preparation & Education',
      items: [
        'Explain the process of mammograms and possible discomfort',
        'Discuss potential side effects or contrast allergies for MRI',
        'Encourage shared decision-making'
      ]
    },
    {
      title: 'Multidisciplinary Coordination',
      items: [
        'Refer to genetics counselor if indicated',
        'Involve surgical, medical, and radiation oncologists early',
        'Update primary care provider on findings'
      ]
    },
    {
      title: 'Staging & Classification',
      items: [
        'TNM staging determines treatment plan',
        'HER2/neu and hormone receptor status guide targeted therapy'
      ]
    },
    {
      title: 'Alternatives & Inconclusive Results',
      items: [
        'If MRI is contraindicated, consider contrast-enhanced mammography',
        'Repeat or second opinion on pathology if biopsy is inconclusive'
      ]
    },
    {
      title: 'References & Further Reading',
      items: [
        'NCCN Guidelines for Breast Cancer Screening and Diagnosis',
        'American Cancer Society: Breast Cancer Resources'
      ]
    }
  ],

  // You can repeat or vary these sections for each cancer type.
  // For brevity, here's a similar structure for other cancers.
  'Lung Cancer': [
    {
      title: 'Risk & Screening Guidelines',
      items: [
        'Annual low-dose CT for high-risk adults aged 50–80 with 20 pack-year history',
        'Smoking cessation advice included'
      ]
    },
    {
      title: 'Pre-Test Requirements',
      items: [
        'Assess renal function if contrast is used',
        'Check for any respiratory instability or oxygen requirements'
      ]
    },
    // ... etc.
  ],
  // ... fill out similarly for other cancer types
};

export default function DiagnosticPathways() {
  const [expandedPathway, setExpandedPathway] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [showEnhancedInfo, setShowEnhancedInfo] = useState<Record<number, boolean>>({});
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});

  const pathways = [
    {
      title: 'Breast Cancer',
      steps: [
        'Clinical breast examination',
        'Mammography and/or ultrasound',
        'MRI breast if indicated',
        'Biopsy (core needle or surgical)',
        'Hormonal receptor and HER2/neu status'
      ]
    },
    {
      title: 'Lung Cancer',
id: 'lung-cancer-pathway',
description: 'Lung cancer diagnostic pathway',
decisionTree: {
  name: 'Lung Cancer Pathway',
  id: 'lung-cancer-pathway',
  description: 'Lung cancer diagnostic pathway',
steps: lungCancerPathway.decisionTree.nodes.map(node => ({
    id: node.id,
    title: node.question,
    description: 'Step description',
options: [
  { text: 'Yes', next: node.yes },
  { text: 'No', next: node.no }
]
  }))
},
    },
    {
      title: 'Colorectal Cancer',
      steps: [
        'Colonoscopy with biopsy of any lesions',
        'CT colonography if colonoscopy incomplete',
        'Carcinoembryonic antigen (CEA) levels',
        'MRI or CT of abdomen/pelvis for staging',
        'Genetic testing for Lynch syndrome if indicated'
      ]
    },
    {
      title: 'Prostate Cancer',
      steps: [
        'PSA blood test',
        'Digital rectal exam',
        'Multiparametric MRI of the prostate',
        'Prostate biopsy guided by MRI findings',
        'Bone scan for staging if PSA is very high'
      ]
    },
    {
      title: 'Ovarian Cancer',
      steps: [
        'Pelvic examination',
        'Transvaginal ultrasound',
        'CA-125 blood test',
        'CT or MRI of abdomen/pelvis',
        'Biopsy during laparoscopy if indicated'
      ]
    },
    {
      title: 'Leukemia',
      steps: [
        'Complete blood count and differential',
        'Peripheral blood smear',
        'Bone marrow biopsy and aspirate',
        'Cytogenetic analysis',
        'Molecular testing for specific mutations'
      ]
    },
    {
      title: 'Lymphoma',
      steps: [
        'Physical examination for lymphadenopathy',
        'Excisional biopsy of lymph node',
        'CT of chest/abdomen/pelvis',
        'PET scan to assess metabolic activity',
        'Bone marrow biopsy if needed'
      ]
    },
    {
      title: 'Pancreatic Cancer',
      steps: [
        'History and physical examination',
        'Blood tests including liver function',
        'CT scan or MRI of the abdomen',
        'Endoscopic ultrasound with FNA',
        'Laparoscopy for staging and biopsy'
      ]
    },
    {
      title: 'Skin Cancer',
      steps: [
        'Skin examination by a dermatologist',
        'Dermatoscopy',
        'Biopsy (excisional, incisional, or punch)',
        'Sentinel lymph node biopsy if melanoma',
        'PET-CT or brain MRI for advanced melanoma'
      ]
    },
    {
      title: 'Bladder Cancer',
      steps: [
        'Urinalysis with cytology',
        'Cystoscopy with biopsy',
        'CT urogram',
        'Intravenous pyelogram if CT not available',
        'Urine markers for recurrence monitoring'
      ]
    }
  ];

  const togglePathway = (index: number) => {
    setExpandedPathway(expandedPathway === index ? null : index);
  };

  const toggleSection = (pathwayIndex: number, stepIndex: number) => {
    const key = `${pathwayIndex}-${stepIndex}`;
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleAdditionalInfo = (index: number) => {
    setShowEnhancedInfo((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Existing function for sample step details
  const getStepDetails = (pathwayTitle: string, stepName: string): DetailedInfo => {
    return {
when: `Recommended timing for ${stepName}`,
      considerations: [
        'Patient history and risk factors',
        'Previous test results',
        'Contraindications',
        'Cost and availability'
      ],
      outcomes: [
        'Expected findings',
        'Possible results interpretation',
        'Accuracy and limitations',
        'Impact on treatment decisions'
      ],
      followUp: [
        'Next steps based on results',
        'Required monitoring',
        'Documentation requirements',
        'Patient communication plan'
      ]
    };
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg shadow-lg">
          <GitBranch className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Cancer Diagnostic Pathways
        </h2>
      </motion.div>

      {/* Cards Layout - 2 columns on larger screens */}
      <div className="grid gap-6 md:grid-cols-2">
        <AnimatePresence>
          {pathways.map((pathway, index) => {
            const additionalInfo = additionalCancerInfo[pathway.title] || [];
            const isLungCancerPathway = pathway.title === 'Lung Cancer';

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
                className={`
                  relative rounded-xl overflow-hidden
                  backdrop-blur-sm bg-white bg-opacity-40 
                  border border-gray-200 border-opacity-40
                  transform transition-all duration-300 
                  shadow-lg hover:shadow-xl
                `}
                style={{
                  perspective: '1000px',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Top Button (Title + Additional Info + Chevron) */}
                <button
                  onClick={() => togglePathway(index)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left group"
                >
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {pathway.title}
                    </h3>
                    {/* Show a small info icon if there's additional info for this pathway */}
                    {additionalInfo.length > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAdditionalInfo(index);
                        }}
                        className="p-1 rounded-full hover:bg-indigo-50 hover:bg-opacity-40 transition-colors"
                        aria-label={`Additional information for ${pathway.title}`}
                      >
                        <Info className="h-4 w-4 text-indigo-600" />
                      </button>
                    )}
                  </div>
                  <motion.div
                    animate={{ rotate: expandedPathway === index ? 180 : 0 }}
                    className="p-2 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 bg-opacity-40 group-hover:from-indigo-100 group-hover:to-purple-100"
                  >
                    <ChevronDown className="h-5 w-5 text-indigo-600" />
                  </motion.div>
                </button>

                {/* Expanded Pathway Content */}
                <AnimatePresence>
                  {expandedPathway === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="px-6 pb-6"
                    >
                      {/* Conditionally render DecisionTree for Lung Cancer, otherwise render steps */}
                      {isLungCancerPathway && pathway.decisionTree ? (
                        <DecisionTree tree={pathway.decisionTree} />
                      ) : (
                        <>
                          {/* Steps List with subtle divider between items */}
                          <motion.ol
                            className="space-y-3 divide-y divide-gray-200"
                            initial="collapsed"
                            animate="open"
                            variants={{
                              open: {
                                transition: { staggerChildren: 0.1 }
                              },
                              collapsed: {}
                            }}
                          >
                            {pathway.steps?.map((step, stepIndex) => (
                              <motion.li
                                key={stepIndex}
                                variants={{
                                  open: { opacity: 1, x: 0 },
                                  collapsed: { opacity: 0, x: -20 }
                                }}
                                className="pt-3"
                              >
                                <button
                                  onClick={() => toggleSection(index, stepIndex)}
                                  className="flex items-start group w-full text-left"
                                >
                                  <span className="mr-3 flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium">
                                    {stepIndex + 1}
                                  </span>
                                  <div className="flex justify-between items-center flex-1">
                                    <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                                      {step}
                                    </span>
                                    <ChevronRight
                                      className={`h-4 w-4 text-indigo-600 transform transition-transform ${
                                        expandedSections[`${index}-${stepIndex}`] ? 'rotate-90' : ''
                                      }`}
                                    />
                                  </div>
                                </button>

                                <AnimatePresence>
                                  {expandedSections[`${index}-${stepIndex}`] && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      exit={{ opacity: 0, height: 0 }}
                                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                                      className="ml-9 mt-2 pl-4 border-l-2 border-indigo-100"
                                    >
                                      <div className="text-sm text-gray-600 space-y-4">
                                        {(() => {
                                          const details = getStepDetails(pathway.title, step);
                                          return (
                                            <>
                                              <div>
                                                <h4 className="text-lg font-semibold text-gray-800">When to Perform</h4>
<p>{details.when}</p>
                                              </div>
                                              <div>
                                                <h4 className="text-lg font-semibold text-gray-800">Key Considerations</h4>
                                                <ul className="list-disc pl-4 space-y-1">
                                                  {details.considerations.map((item, idx) => (
                                                    <li key={idx}>{item}</li>
                                                  ))}
                                                </ul>
                                              </div>
                                              <div>
                                                <h4 className="text-lg font-semibold text-gray-800">Expected Outcomes</h4>
                                                <ul className="list-disc pl-4 space-y-1">
                                                  {details.outcomes.map((item, idx) => (
                                                    <li key={idx}>{item}</li>
                                                  ))}
                                                </ul>
                                              </div>
                                              <div>
                                                <h4 className="text-lg font-semibold text-gray-800">Follow-up Steps</h4>
                                                <ul className="list-disc pl-4 space-y-1">
                                                  {details.followUp.map((item, idx) => (
                                                    <li key={idx}>{item}</li>
                                                  ))}
                                                </ul>
                                              </div>
                                            </>
                                          );
                                        })()}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </motion.li>
                            ))}
                          </motion.ol>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
