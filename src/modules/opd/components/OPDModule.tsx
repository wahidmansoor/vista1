import { useState } from "react";
import {
  UserCheck,
  ScanLine,
  ShieldCheck,
  Send,
  CalendarClock,
} from "lucide-react";

import EvaluationCard from "../cards/EvaluationCard";
import PathwayCard from "../cards/PathwayCard";
import ScreeningCard from "../cards/ScreeningCard";
import ReferralCard from "../cards/ReferralCard";
import FollowUpCard from "../cards/FollowUpCard";

import AISummary from "../components/AISummaryPlaceholder";

import PatientEvaluation from "../patient-evaluation/PatientEvaluation";
import DiagnosticPathways from "../diagnostic-pathways/DiagnosticPathways";
import CancerScreening from "../cancer-screening/CancerScreening";
import ReferralGuidelines from "../referral-guidelines/ReferralGuidelines";
import FollowUpOncology from "../follow-up-oncology/FollowUpOncology";

const tabs = [
  { label: "Patient Evaluation", icon: UserCheck },
  { label: "Diagnostic Pathways", icon: ScanLine },
  { label: "Cancer Screening", icon: ShieldCheck },
  { label: "Referral Guidelines", icon: Send },
  { label: "Follow-Up Oncology", icon: CalendarClock },
];

export default function OPDModule() {
  const [activeTab, setActiveTab] = useState("Patient Evaluation");

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        🧑‍⚕️ Oncology OPD Module
      </h1>

      <div className="flex gap-3 mb-6 overflow-x-auto">
        {tabs.map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => setActiveTab(label)}
            className={`flex items-center gap-2 px-4 py-2 rounded shadow-sm text-sm font-medium ${
              activeTab === label
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {activeTab === "Patient Evaluation" && (
        <EvaluationCard>
          <PatientEvaluation />
          <AISummary />
        </EvaluationCard>
      )}
      {activeTab === "Diagnostic Pathways" && (
        <PathwayCard>
          <DiagnosticPathways />
          <AISummary />
        </PathwayCard>
      )}
      {activeTab === "Cancer Screening" && (
        <ScreeningCard>
          <CancerScreening />
          <AISummary />
        </ScreeningCard>
      )}
      {activeTab === "Referral Guidelines" && (
        <ReferralCard>
          <ReferralGuidelines />
          <AISummary />
        </ReferralCard>
      )}
      {activeTab === "Follow-Up Oncology" && (
        <FollowUpCard>
          <FollowUpOncology />
          <AISummary />
        </FollowUpCard>
      )}
    </div>
  );
}
