import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, RotateCcw, ClipboardCheck, Info, ChevronLeft } from 'lucide-react';
import CalculatorDisclaimer from '../components/CalculatorDisclaimer';

type BurdenOfIllness = 'none-mild' | 'moderate' | 'severe';

const MASCCCalculator: React.FC = () => {
  const navigate = useNavigate();
  const [burden, setBurden] = useState<BurdenOfIllness>('none-mild');
  const [noHypotension, setNoHypotension] = useState(true);
  const [noCOPD, setNoCOPD] = useState(true);
  const [solidTumorNoFungal, setSolidTumorNoFungal] = useState(true);
  const [noDehydration, setNoDehydration] = useState(true);
  const [outpatientAtOnset, setOutpatientAtOnset] = useState(true);
  const [ageUnder60, setAgeUnder60] = useState(true);
  const [score, setScore] = useState<number>(26);

  useEffect(() => {
    let currentScore = 0;
    
    // Mutually exclusive burden of illness
    if (burden === 'none-mild') currentScore += 5;
    else if (burden === 'moderate') currentScore += 3;
    // severe = 0

    if (noHypotension) currentScore += 5;
    if (noCOPD) currentScore += 4;
    if (solidTumorNoFungal) currentScore += 4;
    if (noDehydration) currentScore += 3;
    if (outpatientAtOnset) currentScore += 3;
    if (ageUnder60) currentScore += 2;

    setScore(currentScore);
  }, [burden, noHypotension, noCOPD, solidTumorNoFungal, noDehydration, outpatientAtOnset, ageUnder60]);

  const resetFields = () => {
    setBurden('none-mild');
    setNoHypotension(true);
    setNoCOPD(true);
    setSolidTumorNoFungal(true);
    setNoDehydration(true);
    setOutpatientAtOnset(true);
    setAgeUnder60(true);
  };

  const getRiskCategory = (val: number) => {
    if (val >= 21) return { 
      text: 'Lower-risk group by MASCC score — clinician review required', 
      color: 'text-indigo-700 dark:text-indigo-300' 
    };
    return { 
      text: 'Higher-risk group by MASCC score — urgent clinician review required', 
      color: 'text-red-700 dark:text-red-300 font-bold' 
    };
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
        <ClipboardCheck className="text-indigo-600 dark:text-indigo-400" size={32} />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">MASCC Risk Index</h1>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Multinational Association for Supportive Care in Cancer (MASCC) Febrile Neutropenia Risk Index.
      </p>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="space-y-6">
            {/* Burden of Illness - Radio Group */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                Burden of febrile illness
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { id: 'none-mild', label: 'None or mild symptoms (5)', value: 'none-mild' },
                  { id: 'moderate', label: 'Moderate symptoms (3)', value: 'moderate' },
                  { id: 'severe', label: 'Severe symptoms (0)', value: 'severe' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setBurden(opt.value as BurdenOfIllness)}
                    className={`p-3 text-sm rounded-lg border transition text-left ${
                      burden === opt.value 
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-400 dark:text-indigo-300' 
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Checklist items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'No hypotension (sBP > 90 mmHg) (5)', state: noHypotension, setter: setNoHypotension },
                { label: 'No active COPD (4)', state: noCOPD, setter: setNoCOPD },
                { label: 'Solid tumor or no previous fungal infection (4)', state: solidTumorNoFungal, setter: setSolidTumorNoFungal },
                { label: 'No dehydration requiring parenteral fluids (3)', state: noDehydration, setter: setNoDehydration },
                { label: 'Outpatient status at fever onset (3)', state: outpatientAtOnset, setter: setOutpatientAtOnset },
                { label: 'Age < 60 years (2)', state: ageUnder60, setter: setAgeUnder60 },
              ].map((item, idx) => (
                <label key={idx} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 transition">
                  <input
                    type="checkbox"
                    checked={item.state}
                    onChange={(e) => item.setter(e.target.checked)}
                    className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={resetFields}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold rounded-lg transition flex items-center gap-2"
            >
              <RotateCcw size={18} />
              Reset Scale
            </button>
          </div>
        </div>

        <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 m-6 rounded-lg border border-indigo-100 dark:border-indigo-800/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                Total MASCC Score
              </p>
              <div className="flex items-baseline justify-center md:justify-start gap-2 mt-1">
                <span className="text-5xl font-black text-indigo-900 dark:text-indigo-100">{score}</span>
                <span className="text-xl font-medium text-indigo-700 dark:text-indigo-400">/ 26</span>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-indigo-200 dark:border-indigo-800 max-w-md w-full">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Risk Documentation</p>
              <p className={`text-lg leading-snug ${getRiskCategory(score).color}`}>
                {getRiskCategory(score).text}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-3">
        <Info className="text-amber-600 dark:text-amber-400 mt-1 flex-shrink-0" size={20} />
        <p className="text-sm text-amber-900 dark:text-amber-100 italic leading-relaxed">
          MASCC score supports risk documentation only. Disposition and antimicrobial strategy require clinician judgment and institutional pathway review.
        </p>
      </div>

      <CalculatorDisclaimer />
    </div>
  );
};

export default MASCCCalculator;
