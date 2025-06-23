import React, { useCallback } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import type { Protocol } from '@/types/protocol';

interface Props {
  protocols: Protocol[];
  onGroupSelect?: (group: string) => void;
}

const GroupDistributionChart: React.FC<Props> = ({ protocols, onGroupSelect }) => {
  const data = React.useMemo(() => {
    const groups = protocols.reduce((acc: { name: string; count: number }[], protocol) => {
      const group = protocol.tumour_group || 'Uncategorized';
      const existing = acc.find(item => item.name === group);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ name: group, count: 1 });
      }
      return acc;
    }, []).sort((a, b) => b.count - a.count);

    return groups;
  }, [protocols]);

  const handleClick = useCallback((data: any) => {
    onGroupSelect?.(data.name);
  }, [onGroupSelect]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          angle={-45}
          textAnchor="end"
          height={80}
          interval={0}
        />
        <YAxis />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '6px',
            border: '1px solid #ccc',
          }}
        />
        <Legend />
        <Bar
          dataKey="count"
          fill="#4F46E5"
          onClick={handleClick}
          cursor="pointer"
          className="hover:opacity-80 transition-opacity"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default GroupDistributionChart;
