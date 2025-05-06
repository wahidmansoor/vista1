import { Heart, Users, Globe, Sunrise, Download, FileText } from 'lucide-react';
import { SupportResource } from '../components/SupportCard';
import { AssessmentTool } from '../components/AssessmentToolCard';
import { DocumentationGuideline } from '../components/DocumentationList';
import React from 'react';

// Support resources data
export const supportResources: SupportResource[] = [
  {
    id: 'emotional',
    type: 'Emotional Support',
    description: 'Services to address psychological and emotional needs',
    services: [
      'Individual counseling',
      'Group therapy sessions',
      'Depression screening',
      'Anxiety management'
    ],
    contacts: [
      'Psychology Department',
      'Social Work Services',
      'Counseling Hotline'
    ],
    icon: React.createElement(Heart, { className: "h-6 w-6" })
  },
  {
    id: 'social',
    type: 'Social Support',
    description: 'Resources for social and practical assistance',
    services: [
      'Family meetings',
      'Support groups',
      'Resource coordination',
      'Financial counseling'
    ],
    contacts: [
      'Social Work Department',
      'Patient Navigator',
      'Community Services'
    ],
    icon: React.createElement(Users, { className: "h-6 w-6" })
  },
  {
    id: 'spiritual',
    type: 'Spiritual Care',
    description: 'Spiritual and religious support services',
    services: [
      'Spiritual counseling',
      'Religious services',
      'Meditation support',
      'Cultural rituals'
    ],
    contacts: [
      'Chaplaincy Services',
      'Religious Leaders',
      'Meditation Guide'
    ],
    icon: React.createElement(Sunrise, { className: "h-6 w-6" })
  },
  {
    id: 'cultural',
    type: 'Cultural Support',
    description: 'Culturally sensitive care and services',
    services: [
      'Cultural liaison',
      'Language services',
      'Traditional healing',
      'Cultural celebrations'
    ],
    contacts: [
      'Cultural Affairs Office',
      'Translation Services',
      'Community Leaders'
    ],
    icon: React.createElement(Globe, { className: "h-6 w-6" })
  }
];

// Assessment tools data
export const assessmentTools: Record<string, AssessmentTool[]> = {
  psychological: [
    {
      id: 'phq9',
      name: 'PHQ-9 Depression Scale',
      description: 'A 9-item questionnaire that screens for depression severity and monitors treatment response',
      tags: ['Validated', 'Quick', 'Screening'],
      recommendation: 'Consider administering at initial visit and every 2-4 weeks during treatment'
    },
    {
      id: 'gad7',
      name: 'GAD-7 Anxiety Assessment',
      description: 'A 7-item tool that screens for generalized anxiety disorder',
      tags: ['Validated', 'Quick', 'Screening'],
      recommendation: 'Use for patients reporting worry, tension, or anxiety symptoms'
    },
    {
      id: 'distress',
      name: 'Distress Thermometer',
      description: 'Visual analog scale (0-10) with problem checklist to identify sources of distress',
      tags: ['Quick', 'NCCN-Endorsed'],
      recommendation: 'Implement at pivotal treatment points: diagnosis, treatment changes, and completion'
    }
  ],
  social: [
    {
      id: 'mspss',
      name: 'MSPSS (Multidimensional Scale of Perceived Social Support)',
      description: 'Measures perceived support from family, friends, and significant others',
      tags: ['Validated', 'Comprehensive'],
      recommendation: 'Useful for identifying patients with insufficient social support networks'
    },
    {
      id: 'needs',
      name: 'Resource Needs Assessment',
      description: 'Evaluates practical needs including financial, transportation, and caregiver support',
      tags: ['Practical', 'Referral-Oriented'],
      recommendation: 'Complete during initial intake and when circumstances change'
    },
    {
      id: 'cultural',
      name: 'Cultural Background Assessment',
      description: 'Documents important cultural considerations and preferences for care',
      tags: ['Patient-Centered', 'Comprehensive'],
      recommendation: 'Essential for culturally sensitive care planning'
    }
  ]
};

// Documentation guidelines data
export const documentationGuidelines: DocumentationGuideline[] = [
  {
    id: 'regular-assessment',
    title: 'Regular Assessment Documentation',
    content: 'Document psychosocial assessments at diagnosis, treatment transitions, and when significant life events occur. Include screening results, interventions, and follow-up plans.'
  },
  {
    id: 'family-meetings',
    title: 'Family Meetings & Care Conferences',
    content: 'Record attendance, key concerns discussed, decisions made, and next steps. Document family dynamics that impact care planning.'
  },
  {
    id: 'cultural-spiritual',
    title: 'Cultural & Spiritual Preferences',
    content: 'Document specific cultural or spiritual preferences, accommodations provided, and how these impact the care plan. Include resources utilized.'
  },
  {
    id: 'referrals',
    title: 'Support Service Referrals',
    content: 'Document referrals to psychosocial services, reason for referral, and follow-up plan. Track completion and outcomes of referrals.'
  }
];

// Resources & Downloads data (new addition)
export interface ResourceDownload {
  id: string;
  title: string;
  description: string;
  fileType: string;
  downloadLink: string;
  lastUpdated: string;
  icon: React.ReactNode;
}

export const resourceDownloads: ResourceDownload[] = [
  {
    id: 'psy-assessment-form',
    title: 'Psychosocial Assessment Form',
    description: 'Comprehensive form for documenting patient psychosocial assessment',
    fileType: 'PDF',
    downloadLink: '/resources/psychosocial-assessment-form.pdf',
    lastUpdated: '2025-03-15',
    icon: React.createElement(FileText, { className: "h-6 w-6" })
  },
  {
    id: 'screening-tools-package',
    title: 'Screening Tools Package',
    description: 'Collection of validated screening instruments for psychosocial assessment',
    fileType: 'ZIP',
    downloadLink: '/resources/screening-tools-package.zip',
    lastUpdated: '2025-02-20',
    icon: React.createElement(Download, { className: "h-6 w-6" })
  },
  {
    id: 'support-services-guide',
    title: 'Support Services Guide',
    description: 'Comprehensive directory of support services with referral information',
    fileType: 'PDF',
    downloadLink: '/resources/support-services-guide.pdf',
    lastUpdated: '2025-04-01',
    icon: React.createElement(FileText, { className: "h-6 w-6" })
  },
  {
    id: 'documentation-templates',
    title: 'Documentation Templates',
    description: 'Standard templates for psychosocial documentation in patient records',
    fileType: 'DOCX',
    downloadLink: '/resources/documentation-templates.docx',
    lastUpdated: '2025-03-10',
    icon: React.createElement(FileText, { className: "h-6 w-6" })
  }
];