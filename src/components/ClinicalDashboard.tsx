import React, { useState } from "react";
import {
  BiologicalSex,
  Ethnicity,
  CancerType,
  SymptomSeverity,
  ScreeningTestType,
  ScreeningResultType
} from "../types/clinical";
import type {
  PatientDemographics,
  RiskFactorProfile,
  SymptomProfile,
  ScreeningHistory
} from "../types/clinical";

/**
 * ClinicalDashboard: Professional Patient Assessment Interface
 * - Demographics, risk, symptoms, and screening timeline
 * - Modern React, TypeScript strict mode, clinical workflow focus
 */

const AGE_GROUPS = [
  { label: "Pediatric (<18)", min: 0, max: 17 },
  { label: "Young Adult (18-39)", min: 18, max: 39 },
  { label: "Middle Age (40-64)", min: 40, max: 64 },
  { label: "Older Adult (65+)", min: 65, max: 120 },
];

const SEX_LABELS: Record<BiologicalSex, string> = {
  male: "Male",
  female: "Female",
  intersex: "Intersex",
  unknown: "Unknown",
};

const ETHNICITY_LABELS: Record<Ethnicity, string> = {
  caucasian: "Caucasian",
  african_american: "African American",
  hispanic: "Hispanic",
  asian: "Asian",
  native_american: "Native American",
  pacific_islander: "Pacific Islander",
  middle_eastern: "Middle Eastern",
  multiracial: "Multiracial",
  other: "Other",
  unknown: "Unknown",
};

// --- Demographics Panel ---
const DemographicsPanel: React.FC<{
  demographics: PatientDemographics;
  onChange: (d: PatientDemographics) => void;
}> = ({ demographics, onChange }) => {
  // ...existing code for controlled inputs, age validation, sex/ethnicity select, insurance field...
  return (
    <section className="bg-white rounded shadow p-4 mb-6">
      <h2 className="text-lg font-semibold mb-2">Patient Demographics</h2>
      {/* Age input with group validation */}
      <label className="block mb-2">Age
        <input
          type="number"
          min={0}
          max={120}
          value={demographics.age}
          onChange={e => onChange({ ...demographics, age: Number(e.target.value) })}
          className="border rounded px-2 py-1 ml-2 w-24"
        />
        <span className="ml-2 text-sm text-gray-600">
          {AGE_GROUPS.find(g => demographics.age >= g.min && demographics.age <= g.max)?.label}
        </span>
      </label>
      {/* Sex select */}
      <label className="block mb-2">Sex at Birth
        <select
          value={demographics.sex}
          onChange={e => onChange({ ...demographics, sex: e.target.value as BiologicalSex })}
          className="border rounded px-2 py-1 ml-2"
        >
          {Object.entries(SEX_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </label>
      {/* Ethnicity select */}
      <label className="block mb-2">Ethnicity
        <select
          value={demographics.ethnicity}
          onChange={e => onChange({ ...demographics, ethnicity: e.target.value as Ethnicity })}
          className="border rounded px-2 py-1 ml-2"
        >
          {Object.entries(ETHNICITY_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </label>
      {/* Insurance/access field */}
      <label className="block mb-2">Insurance/Access
        <input
          type="text"
          value={demographics["insurance"] || ""}
          onChange={e => onChange({ ...demographics, insurance: e.target.value })}
          className="border rounded px-2 py-1 ml-2 w-48"
        />
      </label>
      {/* Family history builder (see below) */}
    </section>
  );
};

// --- Risk Factor Assessment Tool ---
const RiskFactorPanel: React.FC<{
  riskFactors: RiskFactorProfile;
  onChange: (r: RiskFactorProfile) => void;
}> = ({ riskFactors, onChange }) => {
  // ...existing code for family history pedigree, lifestyle sliders, medical history checklist, medication review...
  return (
    <section className="bg-white rounded shadow p-4 mb-6">
      <h2 className="text-lg font-semibold mb-2">Risk Factor Assessment</h2>
      {/* Family history pedigree builder (interactive) */}
      {/* Lifestyle factor sliders (smoking, alcohol, BMI, exercise) */}
      {/* Medical history checklist */}
      {/* Medication review */}
    </section>
  );
};

// --- Symptom Evaluation Interface ---
const SymptomPanel: React.FC<{
  symptoms: SymptomProfile;
  onChange: (s: SymptomProfile) => void;
}> = ({ symptoms, onChange }) => {
  // ...existing code for body system org, severity scales, duration calendar, alerts...
  return (
    <section className="bg-white rounded shadow p-4 mb-6">
      <h2 className="text-lg font-semibold mb-2">Symptom Evaluation</h2>
      {/* Body system tabs, severity sliders, duration calendar, urgent alerts */}
    </section>
  );
};

// --- Previous Screening Timeline ---
const ScreeningTimeline: React.FC<{
  history: ScreeningHistory;
}> = ({ history }) => {
  // ...existing code for timeline, results, overdue alerts, quality assessment...
  return (
    <section className="bg-white rounded shadow p-4 mb-6">
      <h2 className="text-lg font-semibold mb-2">Screening Timeline</h2>
      {/* Timeline visualization, results, overdue alerts, sample quality */}
    </section>
  );
};

// --- Main Dashboard ---
const ClinicalDashboard: React.FC = () => {
  // Example state (replace with real data integration)
  const [demographics, setDemographics] = useState<PatientDemographics>({
    age: 50,
    sex: BiologicalSex.FEMALE,
    ethnicity: Ethnicity.CAUCASIAN,
    family_history: [],
    insurance: ""
  });
  const [riskFactors, setRiskFactors] = useState<RiskFactorProfile>({
    lifestyle: { current_smoker: false },
    environmental: {},
    medical_history: {},
  });
  const [symptoms, setSymptoms] = useState<SymptomProfile>({
    current_symptoms: [],
    assessment_date: new Date(),
  });
  const [screeningHistory, setScreeningHistory] = useState<ScreeningHistory>({
    screenings: [],
  });

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <DemographicsPanel demographics={demographics} onChange={setDemographics} />
      <RiskFactorPanel riskFactors={riskFactors} onChange={setRiskFactors} />
      <SymptomPanel symptoms={symptoms} onChange={setSymptoms} />
      <ScreeningTimeline history={screeningHistory} />
    </div>
  );
};

export default ClinicalDashboard;
