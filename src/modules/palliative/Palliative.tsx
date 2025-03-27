import React from "react";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="border rounded-lg shadow-sm mb-6">
    <div className="bg-purple-50 px-4 py-2 font-semibold text-purple-800 border-b">{title}</div>
    <div className="p-4 text-sm">{children}</div>
  </div>
);

const Palliative = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Palliative Care in Oncology</h2>

      <Section title="1. Philosophy & Scope">
        <ul className="list-disc ml-6">
          <li>Begins at diagnosis of life-limiting illness</li>
          <li>Emphasizes symptom control, dignity, family-centered care</li>
          <li>Applicable in OPD, IPD, and ICU settings</li>
        </ul>
      </Section>

      <Section title="2. Advanced Symptom Management">
        <p className="font-semibold mt-2 mb-1">A. Pain</p>
        <ul className="list-disc ml-6 mb-2">
          <li>WHO ladder: Non-opioids → Weak → Strong opioids</li>
          <li>Adjuvants: Gabapentin, Amitriptyline</li>
          <li>Opioid switch: Morphine ↔ Fentanyl</li>
        </ul>
        <p className="font-semibold mt-2 mb-1">B. GI Symptoms</p>
        <ul className="list-disc ml-6 mb-2">
          <li>Nausea: Haloperidol, Levomepromazine</li>
          <li>Constipation: Senna, Macrogol</li>
          <li>Bowel obstruction: Octreotide + Dexamethasone</li>
        </ul>
        <p className="font-semibold mt-2 mb-1">C. Respiratory</p>
        <ul className="list-disc ml-6 mb-2">
          <li>Dyspnea: Low-dose Morphine ± Lorazepam</li>
          <li>Secretions: Glycopyrrolate or Scopolamine</li>
        </ul>
        <p className="font-semibold mt-2 mb-1">D. Neurological</p>
        <ul className="list-disc ml-6">
          <li>Delirium: Haloperidol, Midazolam</li>
          <li>Seizures: Buccal Midazolam, Levetiracetam</li>
        </ul>
      </Section>

      <Section title="3. Goals of Care & Advance Planning">
        <ul className="list-disc ml-6">
          <li>SPIKES protocol for breaking bad news</li>
          <li>Advance Care Plans, DNACPR discussions</li>
          <li>Preferred place of death: home vs hospice</li>
          <li>Involve caregivers and legal documentation</li>
        </ul>
      </Section>

      <Section title="4. Psychosocial & Spiritual Care">
        <ul className="list-disc ml-6">
          <li>Support for grief, depression, existential distress</li>
          <li>Family counseling and bereavement planning</li>
          <li>Respect cultural, religious, and spiritual beliefs</li>
        </ul>
      </Section>

      <Section title="5. End-of-Life Care (Last 72h)">
        <ul className="list-disc ml-6">
          <li>Discontinue non-beneficial interventions</li>
          <li>Use syringe driver: Morphine, Midazolam, Glycopyrrolate</li>
          <li>Comfort packs and mouth care kits</li>
          <li>Documentation and family presence encouraged</li>
        </ul>
      </Section>

      <Section title="6. AI Support Tools (Coming Soon)">
        <p className="italic text-gray-600">
          Future versions will auto-generate comfort plans, family notes, and summarize spiritual goals from prompts.
        </p>
      </Section>
    </div>
  );
};

export default Palliative;
