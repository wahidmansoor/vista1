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
  
  const data = [
    { range: "0–1", os: 89 },
    { range: "2–3", os: 80 },
    { range: "4–7", os: 61 },
  ];
  
  export default function IPSChart() {
    return (
      <div className="my-8">
        <h3 className="text-lg font-semibold mb-2">📊 IPS Score vs. 5-Year OS</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical" margin={{ left: 30 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <YAxis type="category" dataKey="range" />
            <Tooltip formatter={(value) => `${value}%`} />
            <Bar dataKey="os" fill="#3b82f6">
              <LabelList dataKey="os" position="right" formatter={(val) => `${val}%`} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
  