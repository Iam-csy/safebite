export default function StatCard({ icon, label, value, sub, color = 'green', trend }) {
  const colors = {
    green: 'bg-green-50 text-green-700',
    red: 'bg-red-50 text-red-700',
    amber: 'bg-amber-50 text-amber-700',
    blue: 'bg-blue-50 text-blue-700',
    purple: 'bg-purple-50 text-purple-700',
  };

  return (
    <div className="card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${colors[color]}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-display font-bold text-gray-900">{value}</p>
        {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
      </div>
      {trend !== undefined && (
        <div className={`text-sm font-semibold ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </div>
      )}
    </div>
  );
}
