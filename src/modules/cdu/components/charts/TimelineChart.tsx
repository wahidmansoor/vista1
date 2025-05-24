import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { format, subDays } from 'date-fns';
import type { Protocol } from '@/types/protocol';

interface Props {
  protocols: Protocol[];
}

const TimelineChart: React.FC<Props> = ({ protocols }) => {
  const data = useMemo(() => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = subDays(new Date(), 29 - i);
      return {
        date: format(date, 'yyyy-MM-dd'),
        updates: 0,
      };
    });

    // Count updates per day
    protocols.forEach(protocol => {
      if (protocol.updated_at) {
        const updateDate = format(new Date(protocol.updated_at), 'yyyy-MM-dd');
        const dayData = last30Days.find(day => day.date === updateDate);
        if (dayData) {
          dayData.updates++;
        }
      }
    });

    return last30Days;
  }, [protocols]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          angle={-45}
          textAnchor="end"
          height={80}
          interval={6}
          tickFormatter={(date) => format(new Date(date), 'MMM d')}
        />
        <YAxis />
        <Tooltip
          labelFormatter={(date) => format(new Date(date), 'MMM d, yyyy')}
          formatter={(value: any) => [`${value} updates`, 'Updates']}
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '6px',
            border: '1px solid #ccc',
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="updates"
          stroke="#4F46E5"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TimelineChart;
