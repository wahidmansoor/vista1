import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, Activity, BarChart } from 'lucide-react';

const Calculators: React.FC = () => {
  const navigate = useNavigate();

  const calculators = [
    {
      id: 'bsa',
      title: 'BSA Calculator',
      description: 'Body Surface Area using Mosteller Formula',
      icon: Calculator,
      isImplemented: true
    },
    {
      id: 'crcl',
      title: 'CrCl Calculator',
      description: 'Creatinine Clearance using Cockcroft-Gault Formula',
      icon: Activity,
      isImplemented: true
    },
    {
      id: 'anc',
      title: 'ANC Calculator',
      description: 'Absolute Neutrophil Count estimation',
      icon: BarChart,
      isImplemented: true
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">🧮 Clinical Calculators</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {calculators.map((calc: any, index: number) => (
          <button
            key={calc.id}
            onClick={() => navigate(`/tools/calculators/${calc.id}`)}
            disabled={!calc.isImplemented}
            className={`p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition flex flex-col items-center justify-center space-y-2 text-center ${
              calc.isImplemented ? 'hover:scale-105' : 'opacity-50 cursor-not-allowed'
            }`}
          >
            <calc.icon className="w-8 h-8 text-indigo-500 dark:text-indigo-400" />
            <span className="font-semibold text-gray-800 dark:text-gray-200">{calc.title}</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">{calc.description}</span>
            {!calc.isImplemented && (
              <span className="text-xs text-yellow-600 dark:text-yellow-400">Coming soon...</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calculators;
