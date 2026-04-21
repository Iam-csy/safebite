import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import HygieneScoreBadge from '../components/common/HygieneScoreBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const issueColors = { critical: '#7C3AED', high: '#EF4444', medium: '#F97316', low: '#F59E0B' };

export default function BusinessProfilePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '', hygieneRating: 5, foodRating: 5 });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/businesses/${id}`);
        setData(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, [id]);

  const submitReview = async () => {
    setSubmittingReview(true);
    try {
      await api.post('/reviews', { businessId: id, ...reviewForm });
      const res = await api.get(`/businesses/${id}`);
      setData(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally { setSubmittingReview(false); }
  };

  if (loading) return <><Navbar /><LoadingSpinner text="Loading restaurant profile..." /></>;
  if (!data) return <><Navbar /><div className="p-10 text-center text-gray-500">Business not found</div></>;

  const { business, reviews, recentReports } = data;
  const latestReport = recentReports?.[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-primary-50 flex items-center justify-center text-4xl flex-shrink-0">
              🍽️
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="font-display text-2xl font-bold text-gray-900">{business.name}</h1>
                {business.isVerified && (
                  <span className="bg-primary-100 text-primary text-xs font-semibold px-2.5 py-0.5 rounded-full">✓ Verified</span>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-3">
                📍 {business.address?.street}, {business.address?.city} · {business.category?.replace('_', ' ')} ·
                {business.foodType === 'veg' ? ' 🟢 Veg' : business.foodType === 'non_veg' ? ' 🔴 Non-Veg' : ' 🔵 Both'}
              </p>
              <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                {business.phone && <span>📞 {business.phone}</span>}
                {business.openingHours && (
                  <span>🕐 {business.openingHours.open} – {business.openingHours.close}</span>
                )}
                {business.totalReviews > 0 && (
                  <span>⭐ {business.averageRating} ({business.totalReviews} reviews)</span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <HygieneScoreBadge score={business.hygieneScore} size="lg" />
              {business.lastInspectionDate && (
                <p className="text-xs text-gray-400 text-center">
                  Last inspected<br/>{new Date(business.lastInspectionDate).toLocaleDateString('en-IN')}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Score breakdown */}
            <div className="card">
              <h2 className="font-display font-semibold text-gray-900 mb-4">Hygiene Score Breakdown</h2>
              {[
                { label: 'Cleanliness', score: business.scores?.cleanliness, weight: '30%', icon: '🧹' },
                { label: 'Food Storage', score: business.scores?.foodStorage, weight: '25%', icon: '🧊' },
                { label: 'Staff Hygiene', score: business.scores?.staffHygiene, weight: '20%', icon: '🧤' },
                { label: 'Customer Reports', score: business.scores?.customerReport, weight: '15%', icon: '👥' },
                { label: 'Inspection Result', score: business.scores?.inspection, weight: '10%', icon: '🔍' },
              ].map(({ label, score, weight, icon }) => (
                <div key={label} className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-700">{icon} {label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{weight}</span>
                      <span className="text-sm font-semibold text-gray-900">{score ?? 0}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${score ?? 0}%`,
                        backgroundColor: (score ?? 0) >= 70 ? '#22C55E' : (score ?? 0) >= 50 ? '#F59E0B' : '#EF4444'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Latest AI Report */}
            {latestReport && (
              <div className="card">
                <h2 className="font-display font-semibold text-gray-900 mb-4">🤖 Latest AI Analysis</h2>
                <p className="text-xs text-gray-400 mb-4">
                  Scanned {new Date(latestReport.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                </p>
                {latestReport.detectedIssues?.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Detected Issues</p>
                    <div className="space-y-2">
                      {latestReport.detectedIssues.map(issue => (
                        <div key={issue.id} className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: issueColors[issue.severity] }}
                          />
                          <span className="text-sm text-gray-700">{issue.label}</span>
                          <span
                            className="text-xs px-2 py-0.5 rounded-full ml-auto"
                            style={{ backgroundColor: issueColors[issue.severity] + '18', color: issueColors[issue.severity] }}
                          >
                            {issue.severity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {latestReport.suggestions?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">💡 Suggestions</p>
                    <ul className="space-y-1.5">
                      {latestReport.suggestions.map((s, i) => (
                        <li key={i} className="text-sm text-gray-600 flex gap-2">
                          <span className="text-primary mt-0.5">•</span>{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Reviews */}
            <div className="card">
              <h2 className="font-display font-semibold text-gray-900 mb-4">
                Customer Reviews {reviews?.length > 0 && <span className="text-gray-400 text-sm font-normal">({reviews.length})</span>}
              </h2>

              {/* Submit review */}
              {user?.role === 'customer' && (
                <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
                  <p className="text-sm font-medium text-gray-700 mb-3">Leave a Review</p>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    {[
                      { key: 'rating', label: 'Overall' },
                      { key: 'hygieneRating', label: 'Hygiene' },
                      { key: 'foodRating', label: 'Food' },
                    ].map(({ key, label }) => (
                      <div key={key}>
                        <label className="text-xs text-gray-500">{label}</label>
                        <select
                          className="input-field text-xs mt-1"
                          value={reviewForm[key]}
                          onChange={e => setReviewForm(p => ({ ...p, [key]: Number(e.target.value) }))}
                        >
                          {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{'⭐'.repeat(n)}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                  <textarea
                    className="input-field text-sm resize-none"
                    rows={2}
                    placeholder="Share your experience..."
                    value={reviewForm.comment}
                    onChange={e => setReviewForm(p => ({ ...p, comment: e.target.value }))}
                  />
                  <button
                    onClick={submitReview}
                    disabled={submittingReview}
                    className="btn-primary text-xs py-2 mt-3"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              )}

              {reviews?.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">No reviews yet. Be the first!</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map(r => (
                    <div key={r._id} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-sm font-semibold text-primary">
                          {r.userId?.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{r.userId?.name}</p>
                          <p className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString('en-IN')}</p>
                        </div>
                        <span className="ml-auto text-sm">{'⭐'.repeat(r.rating)}</span>
                      </div>
                      {r.comment && <p className="text-sm text-gray-600 ml-11">{r.comment}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* QR Code */}
            {business.qrCode && (
              <div className="card text-center">
                <h3 className="font-display font-semibold text-gray-900 mb-3">Trust QR Badge</h3>
                <img src={business.qrCode} alt="QR Code" className="w-32 h-32 mx-auto" />
                <p className="text-xs text-gray-500 mt-2">Scan to verify hygiene status</p>
              </div>
            )}

            {/* Report Issue */}
            {user?.role === 'customer' && (
              <Link
                to={`/complaint?businessId=${business._id}`}
                className="card block text-center hover:shadow-md transition-shadow border-red-100 bg-red-50"
              >
                <div className="text-2xl mb-2">⚠️</div>
                <p className="font-semibold text-red-700 text-sm">Report a Hygiene Issue</p>
                <p className="text-xs text-red-500 mt-1">Spotted something wrong? Let us know.</p>
              </Link>
            )}

            {/* Info */}
            <div className="card space-y-3">
              <h3 className="font-display font-semibold text-gray-900 text-sm">Details</h3>
              {[
                { label: 'Category', value: business.category?.replace('_', ' ') },
                { label: 'Cuisine Type', value: business.foodType?.replace('_', ' ') },
                { label: 'Price Range', value: { budget: '₹ Budget', moderate: '₹₹ Moderate', expensive: '₹₹₹ Premium' }[business.priceRange] },
                { label: 'City', value: business.address?.city },
              ].map(({ label, value }) => value && (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{label}</span>
                  <span className="text-gray-800 font-medium capitalize">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
