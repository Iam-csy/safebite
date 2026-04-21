import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    const score = payload[0].value;
    const color = score >= 85 ? '#F59E0B' : score >= 65 ? '#6B7280' : '#EF4444';
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3">
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className="font-display font-bold text-lg" style={{ color }}>{score}<span className="text-xs text-gray-400">/100</span></p>
      </div>
    );
  }
  return null;
};

export default function ScoreTrendChart({ data = [] }) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        No scan data yet. Upload kitchen images to start tracking.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={85} stroke="#F59E0B" strokeDasharray="4 4" label={{ value: 'Gold', fill: '#F59E0B', fontSize: 10 }} />
        <ReferenceLine y={65} stroke="#9CA3AF" strokeDasharray="4 4" label={{ value: 'Silver', fill: '#9CA3AF', fontSize: 10 }} />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#16A34A"
          strokeWidth={2.5}
          dot={{ fill: '#16A34A', r: 4, strokeWidth: 2, stroke: '#fff' }}
          activeDot={{ r: 6, fill: '#16A34A' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
