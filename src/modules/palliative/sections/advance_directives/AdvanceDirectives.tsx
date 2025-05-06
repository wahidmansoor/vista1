import React from 'react';
import { Tab } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Info, Users, Settings, Heart, Brain, Hospital, Home, Users2 } from 'lucide-react';
import { DirectiveCard } from './components/DirectiveCard';
import { CultureBlock } from './components/CultureBlock';
import { LegalItem } from './components/LegalItem';

const cardGridVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const cardItemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3
    }
  }
};

const directiveTypes = [
  {
    title: 'Resuscitation Preferences',
    description: 'Guidelines for cardiopulmonary resuscitation and advanced life support preferences, including DNR orders and levels of medical intervention.',
    icon: Heart
  },
  {
    title: 'Life Support Measures',
    description: 'Decisions about mechanical ventilation, artificial nutrition, and other life-sustaining treatments.',
    icon: Hospital
  },
  {
    title: 'Mental Capacity',
    description: 'Documentation of wishes regarding care if unable to make decisions, including power of attorney arrangements.',
    icon: Brain
  },
  {
    title: 'Preferred Care Location',
    description: 'Specify preferences for where end-of-life care should be provided (home, hospice, hospital).',
    icon: Home
  },
  {
    title: 'Healthcare Proxy',
    description: 'Designation of a trusted individual to make healthcare decisions when unable to do so.',
    icon: Users2
  }
];

const legalRequirements = [
  {
    requirement: 'Patient Capacity Assessment',
    description: 'Document mental capacity to make decisions',
    mandatory: true
  },
  {
    requirement: 'Witness Signatures',
    description: 'Two witnesses required, non-family members',
    mandatory: true
  },
  {
    requirement: 'Healthcare Proxy Details',
    description: 'Full contact information and relationship',
    mandatory: true
  },
  {
    requirement: 'Physician Certification',
    description: 'Discussion documented in medical record',
    mandatory: true
  },
  {
    requirement: 'Regular Review',
    description: 'Update every 6 months or with status changes',
    mandatory: false
  }
];

const culturalConsiderations = [
  {
    culture: 'General Principles',
    considerations: [
      'Religious beliefs about end-of-life',
      'Family decision-making dynamics',
      'Language barriers',
      'Traditional healing practices'
    ],
    recommendations: [
      'Engage cultural/religious leaders',
      'Use professional interpreters',
      'Document cultural preferences',
      'Respect traditional practices'
    ]
  }
];

export default function AdvanceDirectives() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4 sm:p-6">
      <div className="flex items-center gap-4 mb-6">
        <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        <h3 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-gray-100">
          Advance Care Planning Guide
        </h3>
      </div>

      <Tab.Group>
        <Tab.List className="flex space-x-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 p-1 mb-6">
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 px-3 text-sm font-medium leading-5
              ${selected
                ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow'
                : 'text-gray-600 dark:text-gray-400 hover:bg-white/[0.12] hover:text-indigo-500'
              }`
            }
          >
            Overview
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 px-3 text-sm font-medium leading-5
              ${selected
                ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow'
                : 'text-gray-600 dark:text-gray-400 hover:bg-white/[0.12] hover:text-indigo-500'
              }`
            }
          >
            Directive Types
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 px-3 text-sm font-medium leading-5
              ${selected
                ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow'
                : 'text-gray-600 dark:text-gray-400 hover:bg-white/[0.12] hover:text-indigo-500'
              }`
            }
          >
            Cultural Notes
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 px-3 text-sm font-medium leading-5
              ${selected
                ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow'
                : 'text-gray-600 dark:text-gray-400 hover:bg-white/[0.12] hover:text-indigo-500'
              }`
            }
          >
            Legal Info
          </Tab>
        </Tab.List>

        <Tab.Panels>
          {/* Overview Panel */}
          <Tab.Panel>
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="prose dark:prose-invert max-w-none"
              >
                <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <Info className="h-5 w-5 text-indigo-500" />
                  About Advance Care Planning
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Advance care planning is a process that enables individuals to make plans about their future healthcare. 
                  These plans come into effect when the individual loses capacity to make or communicate such decisions.
                </p>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                  <h5 className="text-yellow-800 dark:text-yellow-200 font-medium mb-2">Key Benefits</h5>
                  <ul className="list-disc list-inside space-y-1 text-yellow-700 dark:text-yellow-300">
                    <li>Ensures treatment aligns with personal values</li>
                    <li>Reduces family stress and conflict</li>
                    <li>Improves quality of end-of-life care</li>
                    <li>Increases patient satisfaction</li>
                    <li>Helps healthcare providers deliver appropriate care</li>
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>
          </Tab.Panel>

          {/* Directive Types Panel */}
          <Tab.Panel>
            <AnimatePresence mode="wait">
              <motion.div
                variants={cardGridVariants}
                initial="hidden"
                animate="show"
                className="grid gap-6 md:grid-cols-2"
              >
                {directiveTypes.map((directive, idx) => (
                  <motion.div key={idx} variants={cardItemVariants}>
                    <DirectiveCard
                      title={directive.title}
                      description={directive.description}
                      icon={directive.icon}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </Tab.Panel>

          {/* Cultural Notes Panel */}
          <Tab.Panel>
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="prose dark:prose-invert max-w-none mb-6">
                  <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-indigo-500" />
                    Cultural Considerations in End-of-Life Care
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Cultural competency is essential in advance care planning. Different cultures have varying views on 
                    end-of-life care, family involvement, and medical decision-making.
                  </p>
                </div>
                {culturalConsiderations.map((culture, idx) => (
                  <CultureBlock
                    key={idx}
                    culture={culture.culture}
                    considerations={culture.considerations}
                    recommendations={culture.recommendations}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </Tab.Panel>

          {/* Legal Info Panel */}
          <Tab.Panel>
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="prose dark:prose-invert max-w-none mb-6">
                  <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <Settings className="h-5 w-5 text-indigo-500" />
                    Legal Requirements and Documentation
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Proper documentation and adherence to legal requirements ensures that advance directives are valid 
                    and can be honored by healthcare providers.
                  </p>
                </div>
                {legalRequirements.map((req, idx) => (
                  <LegalItem
                    key={idx}
                    requirement={req.requirement}
                    description={req.description}
                    mandatory={req.mandatory}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}