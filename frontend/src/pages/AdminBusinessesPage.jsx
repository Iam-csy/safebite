import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertBanner from '../components/common/AlertBanner';
import api from '../utils/api';

export default function AdminBusinessesPage() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [verifyModal, setVerifyModal] = useState(null);
  const [inspectionScore, setInspectionScore] = useState(80);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const params = search ? `?search=${search}` : '';
      const { data } = await api.get(`/admin/businesses${params}`);
      setBusinesses(data.businesses || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [search]);

  const handleVerify = async (isVerified) => {
    setSaving(true);
    try {
      await api.put(`/admin/businesses/${verifyModal._id}/verify`, {
        isVerified,
        inspectionScore: isVerified ? inspectionScore : 0,
      });
      setAlert({ type: 'success', message: `Business ${isVerified ? 'verified' : 'unverified'} successfully` });
      setVerifyModal(null);
      fetch();
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Action failed' });
    } finally { setSaving(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/admin" className="text-sm text-gray-500 hover:text-primary mb-2 inline-flex items-center gap-1">← Admin Dashboard</Link>
            <h1 className="font-display text-2xl font-bold text-gray-900">🏪 Manage Businesses</h1>
          </div>
        </div>

        {alert && <div className="mb-6"><AlertBanner {...alert} onClose={() => setAlert(null)} /></div>}

        <div className="card mb-6">
          <input
            className="input-field"
            placeholder="Search businesses by name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? <LoadingSpinner /> : (
          <div className="card overflow-hidden p-0">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Business', 'Owner', 'City', 'Score', 'Badge', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {businesses.map(b => (
                  <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 text-sm">{b.name}</p>
                      <p className="text-xs text-gray-400 capitalize">{b.category?.replace('_', ' ')}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{b.ownerId?.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{b.address?.city}</td>
                    <td className="px-4 py-3">
                      <span className={`font-bold text-sm ${b.hygieneScore >= 65 ? 'text-green-600' : 'text-red-500'}`}>
                        {b.hygieneScore}/100
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{b.badge?.emoji} {b.badge?.label}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${b.isVerified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {b.isVerified ? '✓ Verified' : '⏳ Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setVerifyModal(b); setInspectionScore(80); }}
                          className="text-xs btn-outline py-1 px-3"
                        >
                          {b.isVerified ? 'Update' : 'Verify'}
                        </button>
                        <Link to={`/business/${b._id}`} className="text-xs btn-ghost py-1 px-2">View</Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {businesses.length === 0 && (
              <div className="text-center py-10 text-gray-400 text-sm">No businesses found</div>
            )}
          </div>
        )}
      </div>

      {/* Verify Modal */}
      {verifyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-slide-up">
            <h3 className="font-display text-xl font-bold text-gray-900 mb-2">Verify Business</h3>
            <p className="text-sm text-gray-500 mb-6">{verifyModal.name}</p>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Inspection Score (0–100): <span className="text-primary font-bold">{inspectionScore}</span>
              </label>
              <input
                type="range"
                min="0" max="100"
                value={inspectionScore}
                onChange={e => setInspectionScore(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0</span><span>50</span><span>100</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => handleVerify(true)} disabled={saving} className="btn-primary flex-1">
                {saving ? '⏳' : '✅ Verify & Approve'}
              </button>
              {verifyModal.isVerified && (
                <button onClick={() => handleVerify(false)} disabled={saving} className="border border-red-200 text-red-600 px-4 py-2 rounded-xl text-sm hover:bg-red-50">
                  Revoke
                </button>
              )}
              <button onClick={() => setVerifyModal(null)} className="btn-ghost">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
