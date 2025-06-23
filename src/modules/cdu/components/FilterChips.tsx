import React from 'react';
import { X } from 'lucide-react';

interface FilterChip {
  type: 'group' | 'intent';
  value: string;
}

interface FilterChipsProps {
  filters: FilterChip[];
  onRemove: (filter: FilterChip) => void;
  onClear: () => void;
}

const FilterChips: React.FC<FilterChipsProps> = ({ filters, onRemove, onClear }) => {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {filters.map((filter) => (
        <div
          key={`${filter.type}-${filter.value}`}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm
                   bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
        >
          <span className="capitalize">{filter.type}:</span>
          <span className="font-medium">{filter.value}</span>
          <button
            onClick={() => onRemove(filter)}
            className="ml-1 p-0.5 hover:bg-indigo-200 dark:hover:bg-indigo-800 rounded-full"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
      {filters.length > 1 && (
        <button
          onClick={onClear}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900
                   dark:hover:text-gray-200 underline"
        >
          Clear all
        </button>
      )}
    </div>
  );
};

export default FilterChips;
