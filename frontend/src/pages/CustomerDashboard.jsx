import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const statusColors = {
  pending: 'bg-amber-50 text-amber-700',
  under_review: 'bg-blue-50 text-blue-700',
  resolved: 'bg-green-50 text-green-700',
  dismissed: 'bg-gray-100 text-gray-500',
};

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/complaints/my')
      .then(res => setComplaints(res.data.complaints || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-gray-900">
            Hello, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">Your SafeBite AI dashboard</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: '🔍', label: 'Find Safe Food', to: '/search', color: 'bg-primary-50 text-primary' },
            { icon: '🥦', label: 'Freshness Check', to: '/freshness', color: 'bg-emerald-50 text-emerald-700' },
            { icon: '⚠️', label: 'Report Issue', to: '/complaint', color: 'bg-red-50 text-red-600' },
            { icon: '🏆', label: 'Leaderboard', to: '/leaderboard', color: 'bg-amber-50 text-amber-700' },
          ].map(a => (
            <Link key={a.label} to={a.to}
              className="card text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <div className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center text-2xl ${a.color}`}>
                {a.icon}
              </div>
              <p className="text-sm font-semibold text-gray-700">{a.label}</p>
            </Link>
          ))}
        </div>

        {/* Safety Tips */}
        <div className="card mb-8 bg-gradient-to-br from-primary-50 to-emerald-50 border-primary-100">
          <div className="flex items-start gap-4">
            <span className="text-3xl">💡</span>
            <div>
              <h3 className="font-display font-semibold text-gray-900 mb-2">Food Safety Tips for You</h3>
              <ul className="space-y-1.5 text-sm text-gray-700">
                <li className="flex gap-2"><span className="text-primary">•</span> Always check the hygiene score before ordering from a new place</li>
                <li className="flex gap-2"><span className="text-primary">•</span> Look for the 🥇 Gold Safe badge for the highest hygiene standards</li>
                <li className="flex gap-2"><span className="text-primary">•</span> Report any hygiene violations to help keep the community safe</li>
                <li className="flex gap-2"><span className="text-primary">•</span> Scan the QR code at restaurants to verify their trust badge</li>
              </ul>
            </div>
          </div>
        </div>

        {/* My Complaints */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-semibold text-gray-900">My Complaints</h2>
            <Link to="/complaint" className="btn-primary text-sm py-2">+ New Report</Link>
          </div>

          {loading ? (
            <LoadingSpinner text="Loading your complaints..." />
          ) : complaints.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-gray-500 text-sm mb-4">You haven't submitted any complaints yet</p>
              <Link to="/complaint" className="btn-primary text-sm">Report a Food Safety Issue</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {complaints.map(c => (
                <div key={c._id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-lg flex-shrink-0">⚠️</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900 text-sm">{c.businessId?.name || 'Unknown'}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusColors[c.status]}`}>
                        {c.status?.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{c.description}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(c.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                      {c.adminNote && <span className="text-blue-500 ml-2">· Admin: {c.adminNote}</span>}
                    </p>
                  </div>
                  <Link to={`/business/${c.businessId?._id}`} className="text-xs text-primary hover:underline flex-shrink-0">
                    View →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
