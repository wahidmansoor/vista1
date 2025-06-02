import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LabelList,
} from "recharts";

interface IPSDataItem {
  range: string;
  os: number;
}

const data: IPSDataItem[] = [
  { range: "0–1", os: 89 },
  { range: "2–3", os: 80 },
  { range: "4–7", os: 61 },
];

const IPSChart: React.FC = () => {
  return (
    <div className="my-8">
      <h3 className="text-lg font-semibold mb-2">📊 IPS Score vs. 5-Year OS</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ left: 30 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 100]} tickFormatter={(v: number) => `${v}%`} />
          <YAxis type="category" dataKey="range" />
          <Tooltip formatter={(value: number) => `${value}%`} />
          <Bar dataKey="os" fill="#3b82f6">
            <LabelList dataKey="os" position="right" formatter={(val: number) => `${val}%`} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IPSChart;
