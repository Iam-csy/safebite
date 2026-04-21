import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import AlertBanner from '../components/common/AlertBanner';
import api from '../utils/api';

export default function RegisterBusinessPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', description: '', category: 'restaurant', foodType: 'both',
    phone: '', email: '', priceRange: 'moderate',
    address: { street: '', city: 'Prayagraj', state: 'Uttar Pradesh', pincode: '' },
    openingHours: { open: '09:00', close: '22:00' },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const setField = (key, val) => setForm(p => ({ ...p, [key]: val }));
  const setAddr = (key, val) => setForm(p => ({ ...p, address: { ...p.address, [key]: val } }));
  const setHours = (key, val) => setForm(p => ({ ...p, openingHours: { ...p.openingHours, [key]: val } }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/businesses', form);
      navigate('/owner');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register business');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <Link to="/owner" className="text-sm text-gray-500 hover:text-primary mb-4 inline-flex items-center gap-1">← Back</Link>
          <h1 className="font-display text-2xl font-bold text-gray-900">🏪 Register Your Business</h1>
          <p className="text-gray-500 text-sm mt-1">Fill in your business details to get started on SafeBite AI</p>
        </div>

        {error && <div className="mb-6"><AlertBanner type="error" message={error} onClose={() => setError('')} /></div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="card space-y-4">
            <h2 className="font-display font-semibold text-gray-900">Basic Information</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Business Name *</label>
              <input className="input-field" placeholder="e.g. The Green Kitchen" value={form.name}
                onChange={e => setField('name', e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea className="input-field resize-none" rows={3}
                placeholder="Brief description of your restaurant..."
                value={form.description} onChange={e => setField('description', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                <select className="input-field" value={form.category} onChange={e => setField('category', e.target.value)}>
                  {['restaurant', 'street_food', 'canteen', 'cloud_kitchen', 'mess', 'cafe', 'other'].map(c => (
                    <option key={c} value={c}>{c.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Food Type</label>
                <select className="input-field" value={form.foodType} onChange={e => setField('foodType', e.target.value)}>
                  <option value="veg">🟢 Veg Only</option>
                  <option value="non_veg">🔴 Non-Veg</option>
                  <option value="both">🔵 Both</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Price Range</label>
                <select className="input-field" value={form.priceRange} onChange={e => setField('priceRange', e.target.value)}>
                  <option value="budget">₹ Budget</option>
                  <option value="moderate">₹₹ Moderate</option>
                  <option value="expensive">₹₹₹ Premium</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                <input className="input-field" placeholder="+91 9876543210"
                  value={form.phone} onChange={e => setField('phone', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="card space-y-4">
            <h2 className="font-display font-semibold text-gray-900">Location</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Street Address *</label>
              <input className="input-field" placeholder="123, Civil Lines"
                value={form.address.street} onChange={e => setAddr('street', e.target.value)} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                <input className="input-field" value={form.address.city} onChange={e => setAddr('city', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Pincode</label>
                <input className="input-field" placeholder="211001" value={form.address.pincode} onChange={e => setAddr('pincode', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Hours */}
          <div className="card">
            <h2 className="font-display font-semibold text-gray-900 mb-4">Opening Hours</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Opens At</label>
                <input type="time" className="input-field" value={form.openingHours.open} onChange={e => setHours('open', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Closes At</label>
                <input type="time" className="input-field" value={form.openingHours.close} onChange={e => setHours('close', e.target.value)} />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 rounded-xl text-base">
            {loading ? '⏳ Registering...' : '🚀 Register Business & Get QR Code'}
          </button>
        </form>
      </div>
    </div>
  );
}
