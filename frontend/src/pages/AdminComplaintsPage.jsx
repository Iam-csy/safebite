import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertBanner from '../components/common/AlertBanner';
import api from '../utils/api';

const statusColors = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  under_review: 'bg-blue-50 text-blue-700 border-blue-200',
  resolved: 'bg-green-50 text-green-700 border-green-200',
  dismissed: 'bg-gray-100 text-gray-500 border-gray-200',
};

const typeLabels = {
  dirty_food: '🍽️ Dirty Food',
  hair_insect: '🐛 Hair/Insect',
  food_poisoning: '🤢 Food Poisoning',
  bad_smell: '👃 Bad Smell',
  other: '❓ Other',
};

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = statusFilter ? `?status=${statusFilter}` : '';
      const { data } = await api.get(`/complaints/admin${params}`);
      setComplaints(data.complaints || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchComplaints(); }, [statusFilter]);

  const handleUpdate = async (status) => {
    setSaving(true);
    try {
      await api.put(`/complaints/${selected._id}/status`, { status, adminNote });
      setAlert({ type: 'success', message: `Complaint marked as ${status}` });
      setSelected(null);
      setAdminNote('');
      fetchComplaints();
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to update complaint' });
    } finally { setSaving(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <Link to="/admin" className="text-sm text-gray-500 hover:text-primary mb-2 inline-flex items-center gap-1">← Admin Dashboard</Link>
          <h1 className="font-display text-2xl font-bold text-gray-900">📢 Complaints Management</h1>
          <p className="text-gray-500 text-sm mt-1">{complaints.length} complaint{complaints.length !== 1 ? 's' : ''} found</p>
        </div>

        {alert && <div className="mb-6"><AlertBanner {...alert} onClose={() => setAlert(null)} /></div>}

        {/* Status Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['', 'pending', 'under_review', 'resolved', 'dismissed'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                statusFilter === s ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary'
              }`}
            >
              {s === '' ? 'All' : s.replace('_', ' ')}
            </button>
          ))}
        </div>

        {loading ? <LoadingSpinner /> : (
          <div className="space-y-3">
            {complaints.length === 0 ? (
              <div className="card text-center py-12">
                <div className="text-5xl mb-4">📭</div>
                <p className="text-gray-500">No complaints found</p>
              </div>
            ) : complaints.map(c => (
              <div key={c._id} className="card hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-lg flex-shrink-0">⚠️</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900 text-sm">{c.businessId?.name || 'Unknown Business'}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${statusColors[c.status]}`}>
                        {c.status?.replace('_', ' ')}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {typeLabels[c.type] || c.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{c.description}</p>
                    <p className="text-xs text-gray-400">
                      By {c.userId?.name} · {new Date(c.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                    </p>
                    {c.adminNote && (
                      <p className="text-xs text-blue-600 mt-1 bg-blue-50 px-2 py-1 rounded-lg">
                        Admin note: {c.adminNote}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {c.imageUrl && (
                      <a href={c.imageUrl} target="_blank" rel="noreferrer" className="btn-ghost text-xs py-1 px-2">
                        📷 Photo
                      </a>
                    )}
                    <button
                      onClick={() => { setSelected(c); setAdminNote(c.adminNote || ''); }}
                      className="btn-outline text-xs py-1 px-3"
                    >
                      Review
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-slide-up">
            <h3 className="font-display text-xl font-bold text-gray-900 mb-1">Review Complaint</h3>
            <p className="text-sm text-gray-500 mb-4">{selected.businessId?.name} · {typeLabels[selected.type]}</p>

            <div className="bg-gray-50 rounded-xl p-4 mb-4 text-sm text-gray-700">
              <p className="font-medium mb-1">Customer Report:</p>
              <p>{selected.description}</p>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Admin Note (optional)</label>
              <textarea
                className="input-field resize-none"
                rows={3}
                placeholder="Add a note about this complaint resolution..."
                value={adminNote}
                onChange={e => setAdminNote(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <button
                onClick={() => handleUpdate('under_review')}
                disabled={saving}
                className="border border-blue-200 text-blue-700 py-2 rounded-xl text-sm font-semibold hover:bg-blue-50 transition-colors"
              >
                🔍 Under Review
              </button>
              <button
                onClick={() => handleUpdate('resolved')}
                disabled={saving}
                className="btn-primary py-2 rounded-xl"
              >
                ✅ Resolve
              </button>
              <button
                onClick={() => handleUpdate('dismissed')}
                disabled={saving}
                className="border border-gray-200 text-gray-500 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                🚫 Dismiss
              </button>
              <button onClick={() => setSelected(null)} className="btn-ghost py-2 rounded-xl">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
