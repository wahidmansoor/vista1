import { BookOpen, Heart } from 'lucide-react';

export const sectionsMeta = [
  {
    id: "medical-oncology",
    title: "Medical Oncology",
    description: "Clinical oncology chapters, diagnosis, treatment, supportive care, emergencies, and reference tools.",
    icon: BookOpen
  },
  {
    id: "radiation-oncology",
    title: "Radiation Oncology",
    description: "Detailed protocols for radiation therapy, treatment planning, dosimetry, and management of radiation-related effects.",
    icon: BookOpen
  },
  {
    id: "palliative-care",
    title: "Palliative Care",
    description: "Guidelines for symptom management, pain control, and improving quality of life for patients with serious illnesses across all specialties.",
    icon: Heart
  }
] as const;