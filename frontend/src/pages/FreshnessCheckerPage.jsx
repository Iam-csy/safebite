import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import ImageUploader from '../components/common/ImageUploader';
import AlertBanner from '../components/common/AlertBanner';
import api from '../utils/api';

const statusConfig = {
  Fresh:   { icon: '✅', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', bar: '#22C55E', tip: 'Safe to serve and consume.' },
  Medium:  { icon: '⚠️', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', bar: '#F59E0B', tip: 'Consume soon. Do not store further.' },
  Spoiled: { icon: '🚫', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', bar: '#EF4444', tip: 'Do not serve. Discard immediately.' },
  Unsafe:  { icon: '☠️', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800', bar: '#7C3AED', tip: 'Hazardous. Discard and sanitize storage.' },
};

export default function FreshnessCheckerPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleCheck = async () => {
    if (!file) { setError('Please upload a food image to analyze'); return; }
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const { data } = await api.post('/hygiene/freshness', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cfg = result ? statusConfig[result.status] : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="text-sm text-gray-500 hover:text-primary mb-4 inline-flex items-center gap-1">← Home</Link>
          <h1 className="font-display text-2xl font-bold text-gray-900">🥦 Food Freshness Checker</h1>
          <p className="text-gray-500 text-sm mt-1">
            Upload a photo of any food item — fruit, vegetables, cooked food — and get an instant AI freshness analysis.
          </p>
        </div>

        {/* Upload Card */}
        <div className="card mb-6">
          <h2 className="font-display font-semibold text-gray-900 mb-4">Upload Food Image</h2>
          <ImageUploader onFile={setFile} label="Drop or click to upload food photo" />

          {error && <div className="mt-4"><AlertBanner type="error" message={error} onClose={() => setError('')} /></div>}

          <button
            onClick={handleCheck}
            disabled={loading || !file}
            className="btn-primary w-full py-3 mt-4 rounded-xl text-base"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Analyzing freshness...
              </span>
            ) : '🔬 Analyze Freshness'}
          </button>
        </div>

        {/* Result */}
        {result && cfg && (
          <div className={`card border-2 animate-slide-up ${cfg.bg} ${cfg.border}`}>
            <div className="flex items-center gap-4 mb-6">
              <div className="text-5xl">{cfg.icon}</div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Freshness Status</p>
                <h2 className={`font-display text-3xl font-bold mt-0.5 ${cfg.text}`}>{result.status}</h2>
              </div>
            </div>

            {/* Confidence bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-gray-600 font-medium">AI Confidence</span>
                <span className={`font-bold font-display ${cfg.text}`}>{result.confidence}%</span>
              </div>
              <div className="h-3 bg-white rounded-full overflow-hidden border border-gray-100">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${result.confidence}%`, backgroundColor: cfg.bar }}
                />
              </div>
            </div>

            {/* Message */}
            <div className={`p-4 rounded-xl bg-white/60 mb-4`}>
              <p className={`text-sm font-semibold ${cfg.text} mb-1`}>AI Assessment</p>
              <p className="text-sm text-gray-700">{result.message}</p>
            </div>

            {/* Tip */}
            <div className="flex items-start gap-3 p-3 bg-white/60 rounded-xl">
              <span className="text-lg">💡</span>
              <div>
                <p className="text-sm font-semibold text-gray-800">Recommended Action</p>
                <p className="text-sm text-gray-600 mt-0.5">{cfg.tip}</p>
              </div>
            </div>

            <button
              onClick={() => { setResult(null); setFile(null); }}
              className="btn-outline w-full mt-5"
            >
              Check Another Food Item
            </button>
          </div>
        )}

        {/* Info cards */}
        {!result && (
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(statusConfig).map(([status, s]) => (
              <div key={status} className={`p-4 rounded-xl border ${s.bg} ${s.border}`}>
                <div className="text-2xl mb-1">{s.icon}</div>
                <p className={`font-display font-bold text-sm ${s.text}`}>{status}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.tip}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
