import React from 'react';
import { CancerType } from '../../types/evaluation';

interface TNMStagingProps {
  cancerType: CancerType;
  value: {
    t: string;
    n: string;
    m: string;
  };
  onChange: (value: { t: string; n: string; m: string }) => void;
}

const TNMStaging: React.FC<TNMStagingProps> = ({ cancerType, value, onChange }) => {
  const getTOptions = (cancerType: CancerType) => {
    // Basic T staging options - can be expanded per cancer type
    return ['X', 'is', '0', '1', '1a', '1b', '2', '2a', '2b', '3', '3a', '3b', '4', '4a', '4b'];
  };

  const getNOptions = () => ['X', '0', '1', '2', '3'];
  const getMOptions = () => ['X', '0', '1', '1a', '1b'];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">TNM Staging</h3>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">T Stage</label>
          <select
            value={value.t}
            onChange={(e) => onChange({ ...value, t: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select T Stage</option>
            {getTOptions(cancerType).map((t) => (
              <option key={t} value={t}>
                T{t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">N Stage</label>
          <select
            value={value.n}
            onChange={(e) => onChange({ ...value, n: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select N Stage</option>
            {getNOptions().map((n) => (
              <option key={n} value={n}>
                N{n}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">M Stage</label>
          <select
            value={value.m}
            onChange={(e) => onChange({ ...value, m: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select M Stage</option>
            {getMOptions().map((m) => (
              <option key={m} value={m}>
                M{m}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default TNMStaging;