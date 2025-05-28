import { Link } from "react-router-dom";
import { BookOpen, Atom, Heart } from "lucide-react";
import type { FC, ReactElement } from 'react';

// Updated sections data for the landing page
const sections = [
  {
    id: "medical-oncology",
    title: "Medical Oncology",
    description: "Clinical oncology chapters, diagnosis, treatment, supportive care, emergencies, and reference tools.",
    icon: BookOpen,
    isImage: false,
    path: "/handbook/medical-oncology"
  },
  {
    id: "radiation-oncology",
    title: "Radiation Oncology",
    description: "Detailed protocols for radiation therapy, treatment planning, dosimetry, and management of radiation-related effects.",
    icon: Atom,
    isImage: false,
    path: "/handbook/radiation-oncology"
  },  {
    id: "palliative-care",
    title: "Palliative Care",
    description: "Guidelines for symptom management, pain control, and improving quality of life for patients with serious illnesses across all specialties.",
    icon: Heart,
    isImage: false,
    path: "/handbook/palliative-care"
  }
];

const HandbookLanding: FC = (): ReactElement => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
          OncoVista Handbook
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-12 text-lg max-w-2xl">
          Select a section to explore detailed oncology guidelines and protocols
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {sections.map((section) => (
            <Link
              key={section.id}
              to={section.path}
              className="group block p-6 bg-white dark:bg-slate-800 rounded-xl
                shadow-sm hover:shadow-md transition-all duration-300
                border border-gray-100 dark:border-gray-700
                hover:border-purple-100 dark:hover:border-purple-900/50
                relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-blue-50/50 
                dark:from-purple-900/10 dark:to-blue-900/10
                opacity-0 group-hover:opacity-100 transition-opacity" 
              />
              
              <div className="relative">
                <div className="mb-4 p-3 rounded-lg inline-block 
                  bg-gradient-to-br from-purple-100 to-blue-100
                  dark:from-purple-900/50 dark:to-blue-900/50">
                  <section.icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                
                <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  {section.title}
                </h2>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {section.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Feature Highlights */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-gray-700">
            <div className="p-3 rounded-lg inline-block bg-blue-100 dark:bg-blue-900/30 mb-4">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Comprehensive Content
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Evidence-based guidelines and protocols for oncology practice
            </p>
          </div>
          {/* Feature 2 */}
          <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-gray-700">
            <div className="p-3 rounded-lg inline-block bg-purple-100 dark:bg-purple-900/30 mb-4">
              <Atom className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Treatment Planning
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Detailed guidance for radiation therapy and palliative care
            </p>
          </div>
          {/* Feature 3 */}
          <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-gray-700">
            <div className="p-3 rounded-lg inline-block bg-rose-100 dark:bg-rose-900/30 mb-4">
              <Heart className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Patient-Centered Care
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Focus on quality of life and holistic patient management
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HandbookLanding;
