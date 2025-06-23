import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line, CartesianGrid } from 'recharts';
import { CancerType, RiskScore } from '../types/clinical';

/**
 * Props for RiskVisualization
 */
export interface RiskVisualizationProps {
  riskScores: RiskScore[];
  populationAverages: Record<CancerType, number>;
  riskFactorContributions: Record<CancerType, { factor: string; weight: number }[]>;
  screeningTimeline: { age: number; test: string; recommended: boolean; completed: boolean }[];
  riskHistory?: { year: number; cancerType: CancerType; risk: number }[];
}

const riskLevelColor = (risk: number) => {
  if (risk >= 0.7) return '#d32f2f'; // very high
  if (risk >= 0.4) return '#fbc02d'; // high
  if (risk >= 0.2) return '#1976d2'; // moderate
  return '#388e3c'; // low
};

export const RiskVisualization: React.FC<RiskVisualizationProps> = ({
  riskScores,
  populationAverages,
  riskFactorContributions,
  screeningTimeline,
  riskHistory,
}) => {  const [selectedCancer, setSelectedCancer] = useState<CancerType>(riskScores[0]?.cancer_type || CancerType.BREAST);
  const selectedScore = riskScores.find(r => r.cancer_type === selectedCancer);
  const popAvg = populationAverages[selectedCancer] || 0.1;
  const contributions = riskFactorContributions[selectedCancer] || [];

  // Sensitivity analysis: allow user to adjust a factor (for demo)
  const [factorAdjustments, setFactorAdjustments] = useState<Record<string, number>>({});
  const adjustedContributions = contributions.map(f => ({
    ...f,
    weight: factorAdjustments[f.factor] ?? f.weight,
  }));
  const adjustedRisk = adjustedContributions.reduce((sum, f) => sum + f.weight, 0);

  return (
    <div className="risk-visualization-dashboard grid gap-8 md:grid-cols-2">
      {/* Cancer-Specific Risk Meter */}
      <section aria-label="Cancer-Specific Risk Meter" className="bg-white rounded shadow p-4">
        <h2 className="font-bold text-lg mb-2">Lifetime Risk: {selectedCancer.charAt(0) + selectedCancer.slice(1).toLowerCase()}</h2>
        <div className="flex items-center gap-6">
          {/* Gauge-style risk meter */}
          <div className="w-48 h-48 flex items-center justify-center">
            {/* Use a simple SVG gauge for accessibility */}
            <svg width="180" height="100" viewBox="0 0 180 100" aria-label="Risk Gauge">
              <path d="M10,100 A90,90 0 0,1 170,100" fill="none" stroke="#eee" strokeWidth="20" />             <path d={`M10,100 A90,90 0 0,1 ${10 + 160 * (selectedScore?.absolute_risk ?? 0)},100`} fill="none" stroke={riskLevelColor(selectedScore?.absolute_risk ?? 0)} strokeWidth="20" />
             <circle cx={10 + 160 * (selectedScore?.absolute_risk ?? 0)} cy="100" r="10" fill={riskLevelColor(selectedScore?.absolute_risk ?? 0)} />
            </svg>
          </div>
          <div>            <div className="text-3xl font-bold" style={{ color: riskLevelColor(selectedScore?.absolute_risk ?? 0) }}>{Math.round((selectedScore?.absolute_risk ?? 0) * 100)}%</div>
            <div className="text-gray-600">Population Avg: {Math.round(popAvg * 100)}%</div>
            <div className="text-sm mt-2">Risk Level: <span className="font-semibold">{selectedScore?.risk_level ?? 'N/A'}</span></div>
            <div className="text-xs text-gray-500">Potential risk reduction with screening: <span className="font-bold">{selectedScore ? Math.max(0, Math.round((selectedScore.absolute_risk - popAvg) * 100)) : 0}%</span></div>
          </div>
        </div>
        <div className="mt-4 flex gap-2 flex-wrap">
          {riskScores.map(r => (            <button
              key={r.cancer_type}
              className={`px-3 py-1 rounded ${selectedCancer === r.cancer_type ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => setSelectedCancer(r.cancer_type)}
              aria-pressed={selectedCancer === r.cancer_type}
            >
              {r.cancer_type.charAt(0) + r.cancer_type.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </section>

      {/* Risk Factor Contribution Analysis */}
      <section aria-label="Risk Factor Contribution Analysis" className="bg-white rounded shadow p-4">
        <h2 className="font-bold text-lg mb-2">Risk Factor Contributions</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={adjustedContributions} layout="vertical">
            <XAxis type="number" domain={[0, 1]} hide />
            <YAxis dataKey="factor" type="category" width={120} />
            <Bar dataKey="weight" fill="#1976d2" isAnimationActive />
            <Tooltip />
            <Legend />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-2 text-xs text-gray-600">Adjust factors to see real-time risk changes:</div>
        <div className="flex flex-col gap-2 mt-2">
          {contributions.map(f => (
            <div key={f.factor} className="flex items-center gap-2">
              <label htmlFor={`factor-${f.factor}`} className="w-32 text-sm">{f.factor}</label>
              <input
                id={`factor-${f.factor}`}
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={factorAdjustments[f.factor] ?? f.weight}
                onChange={e => setFactorAdjustments(a => ({ ...a, [f.factor]: parseFloat(e.target.value) }))}
                aria-valuenow={factorAdjustments[f.factor] ?? f.weight}
                aria-valuemin={0}
                aria-valuemax={1}
              />
              <span className="w-10 text-right">{((factorAdjustments[f.factor] ?? f.weight) * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
        <div className="mt-2 text-sm font-semibold">Adjusted Risk: <span style={{ color: riskLevelColor(adjustedRisk) }}>{Math.round(adjustedRisk * 100)}%</span></div>
      </section>

      {/* Screening Timeline Visualization */}
      <section aria-label="Screening Timeline" className="bg-white rounded shadow p-4 col-span-2">
        <h2 className="font-bold text-lg mb-2">Screening Timeline</h2>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={screeningTimeline} layout="horizontal">
            <XAxis dataKey="age" type="number" domain={['dataMin', 'dataMax']} />
            <YAxis dataKey="test" type="category" width={120} />
            <Bar dataKey="recommended" fill="#388e3c" name="Recommended" />
            <Bar dataKey="completed" fill="#1976d2" name="Completed" />
            <Tooltip />
            <Legend />
          </BarChart>
        </ResponsiveContainer>
        <div className="text-xs text-gray-600 mt-2">Green: Recommended | Blue: Completed</div>
      </section>

      {/* Trend Analysis for Longitudinal Care */}
      <section aria-label="Risk Trend Analysis" className="bg-white rounded shadow p-4 col-span-2">
        <h2 className="font-bold text-lg mb-2">Risk Trend Analysis</h2>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={riskHistory?.filter(r => r.cancerType === selectedCancer) || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis domain={[0, 1]} tickFormatter={v => `${Math.round(v * 100)}%`} />
            <Tooltip formatter={v => `${Math.round((v as number) * 100)}%`} />
            <Legend />
            <Line type="monotone" dataKey="risk" stroke="#d32f2f" name="Risk" />
          </LineChart>
        </ResponsiveContainer>
        <div className="text-xs text-gray-600 mt-2">Track risk evolution and screening effectiveness over time.</div>
      </section>
    </div>
  );
};

export default RiskVisualization;
