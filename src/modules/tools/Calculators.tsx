import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, Activity, BarChart, BookOpen, ExternalLink, ClipboardCheck, Pill, ShieldAlert, AlertCircle } from 'lucide-react';

const Calculators: React.FC = () => {
  const navigate = useNavigate();

  const categories = [
    {
      name: 'General / Anthropometrics',
      calculators: [
        {
          id: 'bsa',
          title: 'BSA',
          description: 'Body Surface Area (Mosteller)',
          icon: Calculator,
          isImplemented: true
        },
        {
          id: 'bmi',
          title: 'BMI',
          description: 'Body Mass Index',
          icon: Calculator,
          isImplemented: true
        }
      ]
    },
    {
      name: 'Renal / Dosing Support',
      calculators: [
        {
          id: 'crcl',
          title: 'CrCl',
          description: 'Creatinine Clearance (Cockcroft-Gault)',
          icon: Activity,
          isImplemented: true
        },
        {
          id: 'carboplatin',
          title: 'Carboplatin (Calvert)',
          description: 'Calvert formula with GFR capping',
          icon: Calculator,
          isImplemented: true
        }
      ]
    },
    {
      name: 'Labs & Emergencies',
      calculators: [
        {
          id: 'anc',
          title: 'ANC',
          description: 'Absolute Neutrophil Count estimation',
          icon: BarChart,
          isImplemented: true
        },
        {
          id: 'corrected-calcium',
          title: 'Corrected Calcium',
          description: 'Albumin-adjusted calcium estimation',
          icon: Activity,
          isImplemented: true
        },
        {
          id: 'mascc',
          title: 'MASCC Index',
          description: 'Febrile Neutropenia risk scoring',
          icon: ClipboardCheck,
          isImplemented: true
        }
      ]
    },
    {
      name: 'Medication Equivalence',
      calculators: [
        {
          id: 'steroid-equivalence',
          title: 'Steroid Equivalence',
          description: 'Glucocorticoid dose cross-referencing',
          icon: Pill,
          isImplemented: true
        },
        {
          id: 'opioid-converter',
          title: 'Opioid OME Estimator',
          description: 'Oral Morphine Equivalent estimation',
          icon: ShieldAlert,
          isImplemented: true
        }
      ]
    }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-2">
        <button
          onClick={() => navigate('/tools')}
          className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          ← Back to Tools
        </button>
      </div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">🧮 Clinical Calculators</h1>
        <button
          onClick={() => navigate('/handbook/medical-oncology')}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition border border-indigo-200 dark:border-indigo-800"
        >
          <BookOpen className="w-4 h-4" />
          <span className="text-sm font-medium">Oncology Handbook</span>
        </button>
      </div>

      <div className="space-y-12">
        {categories.map((category) => (
          <section key={category.name}>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
              {category.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.calculators.map((calc) => (
                <button
                  key={calc.id}
                  onClick={() => calc.isImplemented && navigate(`/tools/calculators/${calc.id}`)}
                  className={`group relative flex flex-col p-6 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all text-left ${
                    !calc.isImplemented ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40 transition-colors">
                      <calc.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {calc.title}
                      </h3>
                      {!calc.isImplemented && (
                        <span className="text-[10px] uppercase tracking-wider font-bold text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded">
                          Coming Soon
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4 flex-grow">
                    {calc.description}
                  </p>

                  <div className="flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Open Calculator</span>
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
      
      <div className="mt-16 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-3">
        <AlertCircle className="text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" size={18} />
        <p className="text-sm text-amber-800 dark:text-amber-300">
          <strong>Decision Support Only:</strong> These tools are provided for clinical decision support and documentation purposes. Always verify calculations, units, and institutional protocols before clinical use.
        </p>
      </div>
    </div>
  );
};

export default Calculators;
