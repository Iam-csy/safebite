import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import api from '../utils/api';

export default function OwnerTemperaturePage() {
  const [business, setBusiness] = useState(null);
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchReadings = async (bizId) => {
    try {
      const { data } = await api.get(`/businesses/${bizId}/temperature`);
      setReadings(data.readings || []);
      setLastRefresh(new Date());
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    api.get('/businesses/my/business')
      .then(res => {
        setBusiness(res.data.business);
        fetchReadings(res.data.business._id);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!business) return;
    const interval = setInterval(() => fetchReadings(business._id), 30000);
    return () => clearInterval(interval);
  }, [business]);

  if (loading) return <><Navbar /></>;

  const alerts = readings.filter(r => !r.safe);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <Link to="/owner" className="text-sm text-gray-500 hover:text-primary mb-4 inline-flex items-center gap-1">← Back to Dashboard</Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-gray-900">🌡️ Temperature Monitor</h1>
              <p className="text-gray-500 text-sm mt-1">Real-time cold storage monitoring</p>
            </div>
            <div className="text-right">
              <button
                onClick={() => business && fetchReadings(business._id)}
                className="btn-ghost text-xs"
              >🔄 Refresh</button>
              <p className="text-xs text-gray-400 mt-1">Updated {lastRefresh.toLocaleTimeString('en-IN')}</p>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 animate-slide-up">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🚨</span>
              <p className="font-semibold text-red-800">{alerts.length} Temperature Alert{alerts.length > 1 ? 's' : ''}</p>
            </div>
            {alerts.map(a => (
              <p key={a.zone} className="text-sm text-red-700 ml-7">
                {a.zone}: {a.current}{a.unit} is outside safe range ({a.safeMin}–{a.safeMax}{a.unit})
              </p>
            ))}
          </div>
        )}

        {alerts.length === 0 && readings.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <span className="text-xl">✅</span>
            <p className="text-green-800 font-semibold text-sm">All temperatures within safe ranges</p>
          </div>
        )}

        {/* Readings grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {readings.map(r => {
            const range = r.safeMax - r.safeMin;
            const offset = r.current - r.safeMin;
            const pct = Math.max(0, Math.min(100, (offset / (range * 1.5) + 0.3) * 100));

            return (
              <div key={r.zone} className={`card border-2 ${r.safe ? 'border-gray-100' : 'border-red-200 bg-red-50'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-display font-semibold text-gray-900 text-sm">{r.zone}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Safe: {r.safeMin} to {r.safeMax}{r.unit}</p>
                  </div>
                  <span className={`text-2xl font-display font-bold ${r.safe ? 'text-primary' : 'text-red-600'}`}>
                    {r.current}{r.unit}
                  </span>
                </div>

                {/* Thermometer visualization */}
                <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden mb-3">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: r.safe ? '#22C55E' : '#EF4444'
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    r.safe ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {r.safe ? '✅ Safe' : '⚠️ Danger Zone'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(r.timestamp).toLocaleTimeString('en-IN', { timeStyle: 'short' })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Guide */}
        <div className="mt-8 card bg-blue-50 border border-blue-100">
          <h3 className="font-semibold text-blue-800 text-sm mb-3">📋 Temperature Safety Guide</h3>
          <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
            <div className="flex items-center gap-2"><span>🥦</span> Vegetables: 5–10°C</div>
            <div className="flex items-center gap-2"><span>🥛</span> Dairy: 2–5°C</div>
            <div className="flex items-center gap-2"><span>🥩</span> Meat: 1–4°C</div>
            <div className="flex items-center gap-2"><span>🧊</span> Freezer: -20 to -15°C</div>
            <div className="flex items-center gap-2"><span>⚠️</span> Danger Zone: 4–60°C</div>
            <div className="flex items-center gap-2"><span>🔥</span> Hot food: Above 60°C</div>
          </div>
        </div>
      </div>
    </div>
  );
}
