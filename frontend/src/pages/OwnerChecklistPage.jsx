import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import AlertBanner from '../components/common/AlertBanner';
import api from '../utils/api';

const checklistItems = [
  { key: 'floorCleaned', label: 'Floor Cleaned & Sanitized', icon: '🧹', desc: 'All floors mopped and disinfected' },
  { key: 'fridgeTempOk', label: 'Refrigerator Temp Checked', icon: '🌡️', desc: 'Fridge 2–8°C, Freezer below -15°C' },
  { key: 'staffGlovesWorn', label: 'Staff Wearing Gloves', icon: '🧤', desc: 'All food handlers wearing clean gloves' },
  { key: 'foodCovered', label: 'All Food Covered', icon: '🍱', desc: 'No open/exposed food in storage or prep areas' },
  { key: 'wasteDisposed', label: 'Waste Properly Disposed', icon: '🗑️', desc: 'All garbage bins emptied and cleaned' },
  { key: 'handwashAvailable', label: 'Handwash Station Ready', icon: '🧼', desc: 'Soap, water, and towels available for staff' },
];

export default function OwnerChecklistPage() {
  const [business, setBusiness] = useState(null);
  const [checklist, setChecklist] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    api.get('/businesses/my/business')
      .then(res => {
        setBusiness(res.data.business);
        setChecklist(res.data.business.checklistStatus || {});
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggle = (key) => setChecklist(p => ({ ...p, [key]: !p[key] }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put(`/businesses/${business._id}/checklist`, checklist);
      setBusiness(data.business);
      setAlert({ type: 'success', message: 'Checklist saved! Your hygiene score has been updated.' });
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Failed to save checklist' });
    } finally {
      setSaving(false); }
  };

  const completedCount = Object.values(checklist).filter(Boolean).length;
  const total = checklistItems.length;
  const pct = Math.round((completedCount / total) * 100);

  if (loading) return <><Navbar /></>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <Link to="/owner" className="text-sm text-gray-500 hover:text-primary mb-4 inline-flex items-center gap-1">← Back to Dashboard</Link>
          <h1 className="font-display text-2xl font-bold text-gray-900">✅ Daily Hygiene Checklist</h1>
          <p className="text-gray-500 text-sm mt-1">Complete this daily to maintain your hygiene score</p>
        </div>

        {alert && <div className="mb-6"><AlertBanner {...alert} onClose={() => setAlert(null)} /></div>}

        {/* Progress */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold text-gray-800 text-sm">Today's Progress</p>
            <p className="font-display font-bold text-lg text-primary">{completedCount}/{total}</p>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, backgroundColor: pct === 100 ? '#22C55E' : pct >= 60 ? '#F59E0B' : '#EF4444' }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">{pct}% complete {pct === 100 && '🎉 Excellent!'}</p>
        </div>

        {/* Checklist items */}
        <div className="space-y-3 mb-6">
          {checklistItems.map(({ key, label, icon, desc }) => (
            <div
              key={key}
              onClick={() => toggle(key)}
              className={`card cursor-pointer transition-all duration-200 flex items-center gap-4 hover:shadow-md ${
                checklist[key] ? 'border-primary bg-primary-50 border' : ''
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                checklist[key] ? 'bg-primary text-white' : 'bg-gray-100'
              }`}>
                {checklist[key] ? '✓' : icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm ${checklist[key] ? 'text-primary line-through opacity-70' : 'text-gray-800'}`}>
                  {label}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                checklist[key] ? 'bg-primary border-primary' : 'border-gray-300'
              }`}>
                {checklist[key] && <span className="text-white text-xs">✓</span>}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary w-full py-3 rounded-xl text-base"
        >
          {saving ? '⏳ Saving...' : '💾 Save Checklist & Update Score'}
        </button>

        {business?.checklistLastUpdated && (
          <p className="text-center text-xs text-gray-400 mt-4">
            Last saved: {new Date(business.checklistLastUpdated).toLocaleString('en-IN')}
          </p>
        )}
      </div>
    </div>
  );
}
