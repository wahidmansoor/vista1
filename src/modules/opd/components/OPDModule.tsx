import React from "react";
import { Tab } from "@headlessui/react";
import {
  User,
  Search,
  ShieldCheck,
  Send,
  CalendarClock,
} from "lucide-react";

import EvaluationCard from "../cards/EvaluationCard";
import PathwayCard from "../cards/PathwayCard";
import ScreeningCard from "../cards/ScreeningCard";
import ReferralCard from "../cards/ReferralCard";
import FollowUpCard from "../cards/FollowUpCard";
import AISummary from "./AISummary";

import PatientEvaluation from "../patient-evaluation/PatientEvaluation";
import DiagnosticPathways from "../diagnostic-pathways/DiagnosticPathways";
import CancerScreening from "../cancer-screening/CancerScreening";
import ReferralGuidelines from "../referral-guidelines/ReferralGuidelines";
import FollowUpOncology from "../follow-up-oncology/FollowUpOncology";

const tabs = [
  { 
    label: "Patient Evaluation", 
    icon: User, 
    component: PatientEvaluation, 
    card: EvaluationCard 
  },
  { 
    label: "Diagnostic Pathways", 
    icon: Search, 
    component: DiagnosticPathways, 
    card: PathwayCard 
  },
  { 
    label: "Cancer Screening", 
    icon: ShieldCheck, 
    component: CancerScreening, 
    card: ScreeningCard 
  },
  { 
    label: "Referral Guidelines", 
    icon: Send, 
    component: ReferralGuidelines, 
    card: ReferralCard 
  },
  { 
    label: "Follow-Up Oncology", 
    icon: CalendarClock, 
    component: FollowUpOncology, 
    card: FollowUpCard 
  },
];

const OPDModule: React.FC = () => {
  // Mock patient data for AI summary demonstration
  const mockPatientData = {
    age: 58,
    gender: "female",
    chiefComplaint: "Persistent cough and weight loss",
    riskFactors: ["Smoking history", "Family history of lung cancer"]
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
        🏥 Oncology OPD Module
      </h1>

      <Tab.Group>
        <Tab.List className="flex space-x-2 mb-8">
          {tabs.map(({ label, icon: Icon }) => (
            <Tab
              key={label}
              className={({ selected }) => `
                opd-tab flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${
                  selected
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md scale-[1.02]"
                    : "bg-white text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                }
              `}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Tab>
          ))}
        </Tab.List>
        
        <Tab.Panels>
          {tabs.map(({ label, component: Component, card: Card }) => (
            <Tab.Panel key={label}>
              <Card>
                <Component />
                <AISummary patientData={mockPatientData} isEnabled={true} />
              </Card>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default OPDModule;
