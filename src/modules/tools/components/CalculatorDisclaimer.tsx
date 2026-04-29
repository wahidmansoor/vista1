import React from 'react';
import { AlertTriangle } from 'lucide-react';

const CalculatorDisclaimer: React.FC = () => {
  return (
    <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start gap-3">
      <AlertTriangle className="text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" size={18} />
      <p className="text-sm text-amber-800 dark:text-amber-200 leading-snug italic">
        ⚠️ Clinical decision support only. Verify calculations, units, and institutional protocols before use.
      </p>
    </div>
  );
};

export default CalculatorDisclaimer;
