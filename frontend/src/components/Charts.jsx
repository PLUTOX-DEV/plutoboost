import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export function LineStats({ data }) {
  const formattedData = data.map(item => ({
    ...item,
    name: new Date(item.name).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData}>
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a855f7" stopOpacity={1} />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.2} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="name"
            stroke="#9ca3af"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#9ca3af"
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff",
            }}
          />

          <Line
            type="monotone"
            dataKey="value"
            stroke="url(#lineGradient)"
            strokeWidth={4}
            dot={{ r: 4, fill: "#a855f7" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ===================== PIE CHART ===================== */

const COLORS = ["#ef4444", "#ec4899", "#38bdf8", "#2563eb"];

export function PlatformPie({ data }) {
  if (!data || data.length === 0) return <div className="text-center text-gray-500">No platform data available.</div>;
  return (
    <div className="h-72 w-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart >
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            innerRadius={55}
            paddingAngle={4}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
