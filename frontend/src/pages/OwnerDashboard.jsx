import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import StatCard from '../components/common/StatCard';
import HygieneScoreBadge from '../components/common/HygieneScoreBadge';
import ScoreTrendChart from '../components/common/ScoreTrendChart';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/businesses/my/business');
        setData(res.data);
        if (res.data.business) {
          const trendRes = await api.get(`/hygiene/trend/${res.data.business._id}`);
          setTrend(trendRes.data.trend || []);
        }
      } catch (err) {
        if (err.response?.status !== 404) console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <><Navbar /><LoadingSpinner text="Loading your dashboard..." /></>;

  if (!data?.business) {
    return (
      <>
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <div className="text-6xl mb-6">🏪</div>
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-3">Register Your Business</h2>
          <p className="text-gray-500 mb-8">You haven't registered a business yet. Get started to access your hygiene dashboard.</p>
          <Link to="/owner/register-business" className="btn-primary text-base px-8 py-3 rounded-xl">
            Register Business →
          </Link>
        </div>
      </>
    );
  }

  const { business, reports } = data;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold text-gray-900">Owner Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Welcome back, {user.name.split(' ')[0]} 👋</p>
          </div>
          <div className="flex gap-3">
            <Link to="/owner/scanner" className="btn-primary">🤖 AI Scanner</Link>
            <Link to="/owner/checklist" className="btn-outline">✅ Checklist</Link>
          </div>
        </div>

        {/* Business header card */}
        <div className="card mb-6 flex flex-col sm:flex-row items-start gap-6">
          <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center text-3xl flex-shrink-0">🍽️</div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="font-display text-xl font-bold text-gray-900">{business.name}</h2>
              {business.isVerified
                ? <span className="text-xs bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full font-semibold">✓ Verified</span>
                : <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-0.5 rounded-full font-semibold">⏳ Pending Verification</span>
              }
            </div>
            <p className="text-sm text-gray-500">📍 {business.address?.city} · {business.category?.replace('_', ' ')}</p>
            <div className="flex flex-wrap gap-4 mt-3">
              <Link to="/owner/temperature" className="text-xs text-primary hover:underline font-medium">🌡️ Temperature Monitor</Link>
              <Link to={`/business/${business._id}`} className="text-xs text-primary hover:underline font-medium">👁️ Public Profile</Link>
            </div>
          </div>
          <HygieneScoreBadge score={business.hygieneScore} size="lg" />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon="🏆" label="Hygiene Score" value={`${business.hygieneScore}/100`} color="green" />
          <StatCard icon="⭐" label="Avg Rating" value={business.averageRating > 0 ? `${business.averageRating}/5` : 'N/A'} sub={`${business.totalReviews} reviews`} color="amber" />
          <StatCard icon="🔍" label="AI Scans" value={reports?.length || 0} sub="total scans" color="blue" />
          <StatCard icon="🧹" label="Cleanliness" value={`${business.scores?.cleanliness || 0}%`} color="green" />
        </div>

        {/* Score trend chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="card lg:col-span-2">
            <h3 className="font-display font-semibold text-gray-900 mb-4">📈 Hygiene Score Trend</h3>
            <ScoreTrendChart data={trend} />
          </div>

          {/* Score breakdown */}
          <div className="card">
            <h3 className="font-display font-semibold text-gray-900 mb-4">Score Breakdown</h3>
            <div className="space-y-3">
              {[
                { label: 'Cleanliness', score: business.scores?.cleanliness, weight: '30%', icon: '🧹' },
                { label: 'Food Storage', score: business.scores?.foodStorage, weight: '25%', icon: '🧊' },
                { label: 'Staff Hygiene', score: business.scores?.staffHygiene, weight: '20%', icon: '🧤' },
                { label: 'Reports', score: business.scores?.customerReport, weight: '15%', icon: '👥' },
                { label: 'Inspection', score: business.scores?.inspection, weight: '10%', icon: '🔍' },
              ].map(({ label, score, weight, icon }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>{icon} {label} <span className="text-gray-400">({weight})</span></span>
                    <span className="font-semibold">{score ?? 0}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${score ?? 0}%`,
                        backgroundColor: (score ?? 0) >= 70 ? '#22C55E' : (score ?? 0) >= 50 ? '#F59E0B' : '#EF4444'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Daily Checklist preview */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-gray-900">Daily Checklist</h3>
            <Link to="/owner/checklist" className="text-sm text-primary hover:underline font-medium">Update →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(business.checklistStatus || {}).map(([key, val]) => (
              <div key={key} className={`flex items-center gap-2 p-3 rounded-xl text-sm ${val ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                <span>{val ? '✅' : '⬜'}</span>
                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
              </div>
            ))}
          </div>
          {business.checklistLastUpdated && (
            <p className="text-xs text-gray-400 mt-3">
              Last updated: {new Date(business.checklistLastUpdated).toLocaleString('en-IN')}
            </p>
          )}
        </div>

        {/* Recent Scan Reports */}
        {reports?.length > 0 && (
          <div className="card">
            <h3 className="font-display font-semibold text-gray-900 mb-4">Recent AI Scan Reports</h3>
            <div className="space-y-3">
              {reports.slice(0, 3).map(r => (
                <div key={r._id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold font-display flex-shrink-0"
                    style={{
                      backgroundColor: r.hygieneScore >= 85 ? '#FEF3C7' : r.hygieneScore >= 65 ? '#F3F4F6' : '#FEE2E2',
                      color: r.hygieneScore >= 85 ? '#92400E' : r.hygieneScore >= 65 ? '#374151' : '#991B1B',
                    }}
                  >
                    {r.hygieneScore}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">{r.detectedIssues?.length || 0} issues detected</p>
                    <p className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${r.hygieneScore >= 85 ? 'badge-gold' : r.hygieneScore >= 65 ? 'badge-silver' : 'badge-warn'}`}>
                    {r.hygieneScore >= 85 ? '🥇 Gold' : r.hygieneScore >= 65 ? '🥈 Silver' : '⚠️ Needs Work'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
