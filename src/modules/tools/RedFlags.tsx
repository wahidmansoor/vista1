import React, { useState } from 'react';
import { AlertTriangle, Thermometer, ShieldAlert, Activity, HeartPulse, ChevronDown, ChevronUp } from 'lucide-react';

export interface RedFlagItem {
  id: string;
  title: string;
  description: string;
  details: string;
  icon: React.ElementType;
  color: string;
}

const redFlags: RedFlagItem[] = [
  {
    id: 'neutropenic-fever',
    title: 'Neutropenic Fever',
    description: 'Urgent evaluation and IV antibiotics needed immediately.',
    details: `**Signs:** Fever > 38.3°C once or >38°C sustained for 1 hour, ANC < 500.  
**Immediate Actions:** Blood cultures, start broad-spectrum IV antibiotics (e.g., Piperacillin-Tazobactam).  
**Critical:** Time to antibiotic administration should be < 1 hour.`,
    icon: Thermometer,
    color: 'bg-red-500'
  },
  {
    id: 'tumor-lysis',
    title: 'Tumor Lysis Syndrome',
    description: 'Watch for electrolyte abnormalities and renal failure.',
    details: `**Signs:** Hyperkalemia, Hyperphosphatemia, Hypocalcemia, Hyperuricemia.  
**Immediate Actions:** Aggressive IV hydration, monitor electrolytes, consider rasburicase.  
**Critical:** Check labs every 6–8 hours.`,
    icon: ShieldAlert,
    color: 'bg-yellow-500'
  },
  {
    id: 'spinal-compression',
    title: 'Spinal Cord Compression',
    description: 'Early MRI and steroids critical to prevent paralysis.',
    details: `**Signs:** New back pain, motor weakness, sensory changes, bladder/bowel dysfunction.  
**Immediate Actions:** High-dose dexamethasone, urgent MRI whole spine, neurosurgical/oncology referral.`,
    icon: Activity,
    color: 'bg-orange-500'
  },
  {
    id: 'svc-syndrome',
    title: 'Superior Vena Cava Syndrome (SVCS)',
    description: 'Neck swelling, dyspnea, urgent imaging required.',
    details: `**Signs:** Facial swelling, dyspnea, distended neck/chest veins.  
**Immediate Actions:** Elevate head of bed, urgent CT chest, oncology consultation.`,
    icon: HeartPulse,
    color: 'bg-purple-500'
  },
  {
    id: 'hypercalcemia',
    title: 'Hypercalcemia of Malignancy',
    description: 'Severe dehydration, mental status changes, urgent hydration.',
    details: `**Signs:** Confusion, dehydration, polyuria, constipation.  
**Immediate Actions:** IV fluids (normal saline), bisphosphonates (zoledronic acid).  
**Critical:** Treat urgently to avoid coma.`,
    icon: AlertTriangle,
    color: 'bg-pink-500'
  }
];

const RedFlagsPage: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">🚨 Red Flags & Emergencies</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {redFlags.map((flag: any, index: number) => (
          <div key={flag.id} className="flex flex-col items-center">
            <div
              onClick={() => toggleExpand(flag.id)}
              className={`w-full p-5 rounded-xl shadow hover:shadow-lg transition hover:scale-105 flex flex-col justify-center items-center text-center text-white cursor-pointer ${flag.color}`}
            >
              <flag.icon size={40} />
              <h2 className="text-lg font-semibold mt-3">{flag.title}</h2>
              <p className="text-sm mt-2">{flag.description}</p>
              <div className="mt-2">
                {expandedId === flag.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </div>

            {/* Expanded Details Section */}
            {expandedId === flag.id && (
              <div className="w-full mt-2 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-inner transition">
                <div className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line">
                  {flag.details}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RedFlagsPage;
export { redFlags };
