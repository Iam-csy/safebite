import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import ImageUploader from '../components/common/ImageUploader';
import HygieneScoreBadge from '../components/common/HygieneScoreBadge';
import AlertBanner from '../components/common/AlertBanner';
import api from '../utils/api';

const severityColors = { critical: '#7C3AED', high: '#EF4444', medium: '#F97316', low: '#F59E0B' };

export default function OwnerScannerPage() {
  const [business, setBusiness] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/businesses/my/business')
      .then(res => setBusiness(res.data.business))
      .catch(console.error);
  }, []);

  const handleScan = async () => {
    if (!file) { setError('Please select a kitchen image to scan'); return; }
    if (!business) { setError('No business registered'); return; }
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const { data } = await api.post(`/hygiene/scan/${business._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Scan failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/owner" className="text-sm text-gray-500 hover:text-primary mb-4 inline-flex items-center gap-1">
            ← Back to Dashboard
          </Link>
          <h1 className="font-display text-2xl font-bold text-gray-900">🤖 AI Hygiene Scanner</h1>
          <p className="text-gray-500 text-sm mt-1">Upload a kitchen photo to get an instant AI-powered hygiene analysis</p>
        </div>

        {!business && (
          <div className="card text-center py-10">
            <p className="text-gray-500 mb-4">You need to register a business first.</p>
            <Link to="/owner/register-business" className="btn-primary">Register Business</Link>
          </div>
        )}

        {business && (
          <div className="space-y-6">
            {/* Upload */}
            <div className="card">
              <h2 className="font-display font-semibold text-gray-900 mb-4">Upload Kitchen Image</h2>
              <p className="text-sm text-gray-500 mb-4">
                The AI will detect: dirty floors, garbage overflow, open food, unclean utensils, missing gloves/hairnets, pest signs.
              </p>
              <ImageUploader
                onFile={setFile}
                label="Drop or click to upload kitchen photo"
              />

              {error && <div className="mt-4"><AlertBanner type="error" message={error} onClose={() => setError('')} /></div>}

              <button
                onClick={handleScan}
                disabled={loading || !file}
                className="btn-primary w-full py-3 mt-4 rounded-xl text-base"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    AI is analyzing your kitchen...
                  </span>
                ) : '🔍 Run AI Hygiene Scan'}
              </button>
            </div>

            {/* Results */}
            {result && (
              <div className="card animate-slide-up">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display font-semibold text-gray-900">📊 Scan Results</h2>
                  <span className="text-xs text-gray-400">{new Date().toLocaleString('en-IN')}</span>
                </div>

                {/* Score */}
                <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-gray-50 rounded-2xl mb-6">
                  <HygieneScoreBadge score={result.analysis.hygieneScore} size="xl" />
                  <div>
                    <p className="font-display text-lg font-bold text-gray-900">Hygiene Analysis Complete</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {result.analysis.detectedIssues?.length} issue{result.analysis.detectedIssues?.length !== 1 ? 's' : ''} detected
                    </p>
                    <p className="text-xs text-primary mt-2 font-medium">Score updated on your profile ✓</p>
                  </div>
                </div>

                {/* Issues */}
                {result.analysis.detectedIssues?.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 text-sm mb-3">⚠️ Detected Issues</h3>
                    <div className="space-y-2">
                      {result.analysis.detectedIssues.map((issue, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl"
                          style={{ backgroundColor: severityColors[issue.severity] + '10' }}>
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: severityColors[issue.severity] }} />
                          <span className="text-sm text-gray-800 flex-1">{issue.label}</span>
                          <span className="text-xs font-semibold capitalize px-2 py-0.5 rounded-full"
                            style={{ color: severityColors[issue.severity], backgroundColor: severityColors[issue.severity] + '20' }}>
                            {issue.severity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {result.analysis.suggestions?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm mb-3">💡 Improvement Suggestions</h3>
                    <ul className="space-y-2">
                      {result.analysis.suggestions.map((s, i) => (
                        <li key={i} className="flex gap-3 p-3 bg-primary-50 rounded-xl text-sm text-gray-700">
                          <span className="text-primary font-bold mt-0.5">→</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button onClick={() => { setResult(null); setFile(null); }} className="btn-outline flex-1">
                    Scan Another Image
                  </button>
                  <Link to="/owner" className="btn-primary flex-1 text-center">
                    Back to Dashboard
                  </Link>
                </div>
              </div>
            )}

            {/* Tip */}
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
              <p className="text-sm font-semibold text-amber-800 mb-1">💡 Pro Tip</p>
              <p className="text-xs text-amber-700">
                Take clear, well-lit photos of your entire kitchen — floors, storage areas, prep stations, and staff. Multiple scans improve your score accuracy.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
