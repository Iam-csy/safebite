import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import StatCard from '../components/common/StatCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../utils/api';

const statusColors = {
  pending: 'bg-amber-50 text-amber-700',
  under_review: 'bg-blue-50 text-blue-700',
  resolved: 'bg-green-50 text-green-700',
  dismissed: 'bg-gray-100 text-gray-500',
};

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats').then(res => setData(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <><Navbar /><LoadingSpinner text="Loading admin dashboard..." /></>;

  const { stats, recentComplaints, recentBusinesses } = data || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold text-gray-900">⚙️ Admin Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">SafeBite AI Control Panel</p>
          </div>
          <div className="flex gap-3">
            <Link to="/admin/businesses" className="btn-outline">🏪 Businesses</Link>
            <Link to="/admin/complaints" className="btn-primary">📢 Complaints</Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <StatCard icon="👥" label="Total Users" value={stats?.totalUsers || 0} color="blue" />
          <StatCard icon="🏪" label="Businesses" value={stats?.totalBusinesses || 0} color="green" />
          <StatCard icon="✅" label="Verified" value={stats?.verifiedBusinesses || 0} color="green" />
          <StatCard icon="⚠️" label="Risky" value={stats?.riskyBusinesses || 0} color="red" />
          <StatCard icon="📢" label="Total Complaints" value={stats?.totalComplaints || 0} color="amber" />
          <StatCard icon="🔔" label="Pending" value={stats?.pendingComplaints || 0} color="amber" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Complaints */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-gray-900">Recent Complaints</h2>
              <Link to="/admin/complaints" className="text-sm text-primary hover:underline">View All →</Link>
            </div>
            {recentComplaints?.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No complaints yet</p>
            ) : (
              <div className="space-y-3">
                {recentComplaints?.map(c => (
                  <div key={c._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-sm flex-shrink-0">⚠️</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{c.businessId?.name || 'Unknown'}</p>
                      <p className="text-xs text-gray-500">{c.userId?.name} · {c.type?.replace('_', ' ')}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusColors[c.status]}`}>
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Businesses */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-gray-900">Recent Businesses</h2>
              <Link to="/admin/businesses" className="text-sm text-primary hover:underline">View All →</Link>
            </div>
            <div className="space-y-3">
              {recentBusinesses?.map(b => (
                <div key={b._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 rounded-xl bg-primary-50 flex items-center justify-center text-sm flex-shrink-0">🍽️</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{b.name}</p>
                    <p className="text-xs text-gray-500">{b.ownerId?.name} · {b.address?.city}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-xs font-bold ${b.hygieneScore >= 65 ? 'text-green-600' : 'text-red-500'}`}>
                      {b.hygieneScore}/100
                    </span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${b.isVerified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {b.isVerified ? '✓' : '⏳'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[
            { icon: '🏪', label: 'Manage Businesses', to: '/admin/businesses', color: 'text-primary' },
            { icon: '📢', label: 'Review Complaints', to: '/admin/complaints', color: 'text-amber-600' },
            { icon: '⚠️', label: 'Risky Businesses', to: '/admin/businesses?risky=true', color: 'text-red-600' },
            { icon: '🏆', label: 'Leaderboard', to: '/leaderboard', color: 'text-purple-600' },
          ].map(action => (
            <Link key={action.label} to={action.to}
              className="card text-center hover:shadow-md transition-shadow">
              <div className={`text-3xl mb-2 ${action.color}`}>{action.icon}</div>
              <p className="text-sm font-semibold text-gray-700">{action.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
