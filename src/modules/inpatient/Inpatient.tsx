import React from "react";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="border rounded-lg shadow-sm mb-6">
    <div className="bg-red-50 px-4 py-2 font-semibold text-red-800 border-b">{title}</div>
    <div className="p-4 text-sm">{children}</div>
  </div>
);

const Inpatient = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Inpatient Oncology Module</h2>

      <Section title="1. Oncology Emergencies">
        <ul className="list-disc ml-6">
          <li><strong>Tumor Lysis Syndrome:</strong> IV fluids, allopurinol, monitor K+, Ca++, uric acid</li>
          <li><strong>Spinal Cord Compression:</strong> Dexamethasone + urgent MRI + neurosurg/RT consult</li>
          <li><strong>Febrile Neutropenia:</strong> IV broad-spectrum antibiotics immediately</li>
          <li><strong>Hypercalcemia of Malignancy:</strong> IV fluids + bisphosphonates</li>
        </ul>
      </Section>

      <Section title="2. Admission Guidelines">
        <ul className="list-disc ml-6">
          <li>ECOG ≥3 with acute symptoms</li>
          <li>New-onset pain not controlled outpatient</li>
          <li>Febrile patient post-chemo</li>
          <li>Needs IV hydration, transfusion, or close monitoring</li>
        </ul>
      </Section>

      <Section title="3. Common Admissions">
        <ul className="list-disc ml-6">
          <li>Severe pain requiring titration</li>
          <li>Neutropenic fever</li>
          <li>Jaundice/obstruction (ERCP consult)</li>
          <li>Confusion or brain metastases</li>
        </ul>
      </Section>

      <Section title="4. Performance Status">
        <ul className="list-disc ml-6">
          <li><strong>ECOG 0:</strong> Fully active</li>
          <li><strong>ECOG 1:</strong> Restricted in strenuous activity</li>
          <li><strong>ECOG 2:</strong> Ambulatory, self-care, unable to work</li>
          <li><strong>ECOG 3:</strong> Limited self-care, confined to bed/chair &gt;50%</li>
          <li><strong>ECOG 4:</strong> Completely disabled</li>
        </ul>
      </Section>

      <Section title="5. Investigations">
        <ul className="list-disc ml-6">
          <li>CBC, LFTs, Creatinine, Uric Acid, LDH, Calcium</li>
          <li>Imaging: CT Chest/Abdo, MRI Spine, X-ray if urgent</li>
        </ul>
      </Section>

      <Section title="6. Supportive Care">
        <ul className="list-disc ml-6">
          <li>Anti-emetics (Ondansetron, Dexamethasone)</li>
          <li>G-CSF if neutropenic</li>
          <li>PPI, mouthwash, laxatives</li>
          <li>Sleep and anxiety support</li>
          <li>DVT prophylaxis (unless contraindicated)</li>
        </ul>
      </Section>

      <Section title="7. AI Note Summary (Coming Soon)">
        <p className="italic text-gray-600">AI-generated admission/discharge notes will appear here in future versions.</p>
      </Section>
    </div>
  );
};

export default Inpatient;
