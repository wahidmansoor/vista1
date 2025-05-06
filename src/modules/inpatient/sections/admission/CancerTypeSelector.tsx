import React from 'react';

interface CancerType {
  key: string;
  label: string;
  icon?: React.ReactNode;
}

interface Props {
  cancerTypes: CancerType[];
  selected: string;
  onSelect: (key: string) => void;
}

export const CancerTypeSelector: React.FC<Props> = ({ cancerTypes, selected, onSelect }) => (
  <div className="flex items-center gap-4">
    <label className="font-semibold text-gray-700">Cancer Type:</label>
    <select
      className="border rounded px-3 py-2"
      value={selected}
      onChange={e => onSelect(e.target.value)}
    >
      {cancerTypes.map(ct => (
        <option key={ct.key} value={ct.key}>
          {ct.label}
        </option>
      ))}
    </select>
  </div>
);
