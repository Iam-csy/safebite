import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import ImageUploader from '../components/common/ImageUploader';
import AlertBanner from '../components/common/AlertBanner';
import api from '../utils/api';

const complaintTypes = [
  { value: 'dirty_food', label: '🍽️ Dirty Food', desc: 'Food appeared unclean or contaminated' },
  { value: 'hair_insect', label: '🐛 Hair / Insect in Food', desc: 'Found foreign objects in food' },
  { value: 'food_poisoning', label: '🤢 Food Poisoning', desc: 'Experienced illness after eating' },
  { value: 'bad_smell', label: '👃 Bad Smell', desc: 'Rotten or foul smell from food or kitchen' },
  { value: 'other', label: '❓ Other', desc: 'Any other hygiene violation' },
];

export default function ComplaintPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState([]);
  const [form, setForm] = useState({
    businessId: searchParams.get('businessId') || '',
    type: '',
    description: '',
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api.get('/businesses?limit=100').then(res => setBusinesses(res.data.businesses || [])).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.type) { setError('Please select a complaint type'); return; }
    if (!form.description.trim()) { setError('Please describe the issue'); return; }
    setError('');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('businessId', form.businessId);
      formData.append('type', form.type);
      formData.append('description', form.description);
      if (file) formData.append('image', file);

      await api.post('/complaints', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-md mx-auto px-6 py-20 text-center">
          <div className="card">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-3">Complaint Submitted!</h2>
            <p className="text-gray-500 text-sm mb-6">
              Thank you for helping keep our food ecosystem safe. Our team will review your complaint and take action.
            </p>
            <div className="flex flex-col gap-3">
              <Link to="/dashboard" className="btn-primary py-3 rounded-xl">View My Complaints</Link>
              <Link to="/search" className="btn-ghost">Find Safe Food</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <Link to="/dashboard" className="text-sm text-gray-500 hover:text-primary mb-4 inline-flex items-center gap-1">← Back</Link>
          <h1 className="font-display text-2xl font-bold text-gray-900">⚠️ Report a Food Safety Issue</h1>
          <p className="text-gray-500 text-sm mt-1">Help keep the community safe by reporting hygiene violations</p>
        </div>

        {error && <div className="mb-6"><AlertBanner type="error" message={error} onClose={() => setError('')} /></div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Restaurant Selection */}
          <div className="card">
            <h2 className="font-display font-semibold text-gray-900 mb-4">Which Restaurant?</h2>
            <select
              className="input-field"
              value={form.businessId}
              onChange={e => setForm(p => ({ ...p, businessId: e.target.value }))}
              required
            >
              <option value="">Select a restaurant...</option>
              {businesses.map(b => (
                <option key={b._id} value={b._id}>{b.name} — {b.address?.city}</option>
              ))}
            </select>
          </div>

          {/* Complaint Type */}
          <div className="card">
            <h2 className="font-display font-semibold text-gray-900 mb-4">What's the Issue?</h2>
            <div className="space-y-2">
              {complaintTypes.map(ct => (
                <div
                  key={ct.value}
                  onClick={() => setForm(p => ({ ...p, type: ct.value }))}
                  className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer border-2 transition-all ${
                    form.type === ct.value
                      ? 'border-primary bg-primary-50'
                      : 'border-gray-100 hover:border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
                    form.type === ct.value ? 'bg-primary text-white' : 'bg-white'
                  }`}>
                    {form.type === ct.value ? '✓' : ct.label.split(' ')[0]}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${form.type === ct.value ? 'text-primary' : 'text-gray-800'}`}>
                      {ct.label}
                    </p>
                    <p className="text-xs text-gray-500">{ct.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="card">
            <h2 className="font-display font-semibold text-gray-900 mb-4">Describe the Issue</h2>
            <textarea
              className="input-field resize-none"
              rows={4}
              placeholder="Please describe what you saw or experienced in detail..."
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              maxLength={500}
              required
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{form.description.length}/500</p>
          </div>

          {/* Image Upload */}
          <div className="card">
            <h2 className="font-display font-semibold text-gray-900 mb-4">Add Photo Evidence (Optional)</h2>
            <ImageUploader onFile={setFile} label="Upload photo of the issue" />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 rounded-xl text-base">
            {loading ? '⏳ Submitting...' : '🚨 Submit Complaint'}
          </button>

          <p className="text-xs text-gray-400 text-center">
            Your complaint will be reviewed by our safety team within 24 hours.
          </p>
        </form>
      </div>
    </div>
  );
}
