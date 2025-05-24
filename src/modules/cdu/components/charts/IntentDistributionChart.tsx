import React, { useCallback } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import type { Protocol } from '@/types/protocol';

interface Props {
  protocols: Protocol[];
  onIntentSelect?: (intent: string) => void;
}

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'];

const IntentDistributionChart: React.FC<Props> = ({ protocols, onIntentSelect }) => {
  const data = React.useMemo(() => {
    const intents = protocols.reduce((acc: { name: string; value: number }[], protocol) => {
      const intent = protocol.treatment_intent || 'Unspecified';
      const existing = acc.find(item => item.name === intent);
      if (existing) {
        existing.value++;
      } else {
        acc.push({ name: intent, value: 1 });
      }
      return acc;
    }, []).sort((a, b) => b.value - a.value);

    return intents;
  }, [protocols]);

  const handleClick = useCallback((data: any) => {
    onIntentSelect?.(data.name);
  }, [onIntentSelect]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={true}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          onClick={handleClick}
          cursor="pointer"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              className="hover:opacity-80 transition-opacity"
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: any) => [`${value} protocols`, 'Count']}
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '6px',
            border: '1px solid #ccc',
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default IntentDistributionChart;
