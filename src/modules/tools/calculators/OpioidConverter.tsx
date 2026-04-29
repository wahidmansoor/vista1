import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, RotateCcw, AlertTriangle, Info, ChevronLeft } from 'lucide-react';
import CalculatorDisclaimer from '../components/CalculatorDisclaimer';

type OpioidType = 'oral-morphine' | 'oral-oxycodone' | 'oral-hydromorphone' | 'iv-morphine';

const OME_FACTORS: Record<OpioidType, number> = {
  'oral-morphine': 1,
  'oral-oxycodone': 1.5,
  'oral-hydromorphone': 4,
  'iv-morphine': 3
};

const OPIOID_LABELS: Record<OpioidType, string> = {
  'oral-morphine': 'Oral Morphine',
  'oral-oxycodone': 'Oral Oxycodone',
  'oral-hydromorphone': 'Oral Hydromorphone',
  'iv-morphine': 'IV Morphine'
};

const MAX_SAFE_DOSE: Record<OpioidType, number> = {
  'oral-morphine': 200,
  'oral-oxycodone': 120,
  'oral-hydromorphone': 40,
  'iv-morphine': 60
};

const OpioidConverter: React.FC = () => {
  const navigate = useNavigate();
  const [sourceOpioid, setSourceOpioid] = useState<OpioidType>('oral-morphine');
  const [sourceDose, setSourceDose] = useState('');
  const [ome, setOme] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateOME = () => {
    setError(null);
    setOme(null);

    const dose = parseFloat(sourceDose);

    if (isNaN(dose)) {
      setError('Please enter a valid numeric dose.');
      return;
    }

    if (dose <= 0) {
      setError('Dose must be greater than zero.');
      return;
    }

    if (dose > MAX_SAFE_DOSE[sourceOpioid]) {
      setError('Dose requires specialist review before calculation.');
      return;
    }

    const estimatedOme = dose * OME_FACTORS[sourceOpioid];
    setOme(parseFloat(estimatedOme.toFixed(1)));
  };

  const resetFields = () => {
    setSourceOpioid('oral-morphine');
    setSourceDose('');
    setOme(null);
    setError(null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/tools/calculators')}
        className="flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:underline mb-4"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Calculators
      </button>
      <div className="flex items-center gap-3 mb-2">
        <ShieldAlert className="text-red-600 dark:text-red-400" size={32} />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Opioid OME Estimator</h1>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-6 font-medium">
        Approximate Oral Morphine Equivalent (OME) estimation for clinical documentation.
      </p>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
        <div className="p-4 bg-red-600 text-white font-bold text-center flex items-center justify-center gap-2">
          <AlertTriangle size={20} />
          HIGH-RISK CLINICAL UTILITY
        </div>

        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Source Opioid
              </label>
              <select
                value={sourceOpioid}
                onChange={(e) => setSourceOpioid(e.target.value as OpioidType)}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:ring-2 focus:ring-red-500 outline-none"
              >
                {Object.entries(OPIOID_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Total 24-Hour Dose (mg)
              </label>
              <input
                type="number"
                value={sourceDose}
                onChange={(e) => setSourceDose(e.target.value)}
                placeholder="e.g. 30"
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={calculateOME}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition shadow-md"
            >
              Estimate OME
            </button>
            <button
              onClick={resetFields}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold rounded-lg transition flex items-center gap-2"
            >
              <RotateCcw size={18} />
              Reset Estimate
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 flex items-center gap-3 m-6">
            <AlertTriangle className="text-amber-600" size={20} />
            <p className="text-amber-800 dark:text-amber-200 text-sm font-bold uppercase">{error}</p>
          </div>
        )}

        {ome !== null && (
          <div className="p-6 bg-red-50 dark:bg-red-900/10 m-6 rounded-lg border border-red-100 dark:border-red-900/30">
            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
              <div className="w-full md:w-auto">
                <p className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-widest mb-1">
                  Estimated 24-Hour OME
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-red-900 dark:text-red-100">{ome}</span>
                  <span className="text-xl font-medium text-red-700 dark:text-red-400">mg/day</span>
                </div>
                <p className="text-xs text-red-600 dark:text-red-500 mt-2 italic font-medium">
                  Oral Morphine Equivalent (Approximate)
                </p>
              </div>

              <div className="space-y-4 flex-1">
                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="text-xs font-black text-red-600 uppercase mb-2">Mandatory Safety Warning</p>
                  <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-bold">
                    Opioid conversion is high-risk and incomplete cross-tolerance must be considered. 
                    This tool provides an approximate OME estimate only and must not be used as a final prescribing dose.
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-xs font-bold text-gray-500 uppercase mb-2">Exclusions & Out-of-Scope</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    Target opioid dose, breakthrough dosing, methadone conversion, fentanyl patch conversion, 
                    renal/hepatic impairment adjustment, and palliative-care specialist review are outside this tool.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <CalculatorDisclaimer />
    </div>
  );
};

export default OpioidConverter;
