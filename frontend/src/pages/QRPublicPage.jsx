import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import HygieneScoreBadge from '../components/common/HygieneScoreBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../utils/api';

export default function QRPublicPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/businesses/${id}`)
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner text="Loading trust badge..." />;
  if (!data) return <div className="p-10 text-center text-gray-500">Business not found</div>;

  const { business } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="card text-center shadow-xl border-2 border-primary-100">
          {/* Header */}
          <div className="bg-primary rounded-xl p-4 -mx-6 -mt-6 mb-6">
            <div className="flex items-center justify-center gap-2 text-white">
              <span className="text-2xl">🛡️</span>
              <span className="font-display font-bold text-lg">SafeBite AI</span>
            </div>
            <p className="text-primary-100 text-xs mt-1">Official Hygiene Trust Badge</p>
          </div>

          {/* Business Info */}
          <h1 className="font-display text-2xl font-bold text-gray-900 mb-1">{business.name}</h1>
          <p className="text-sm text-gray-500 mb-6">
            📍 {business.address?.city} · {business.category?.replace('_', ' ')}
          </p>

          {/* Score */}
          <div className="flex justify-center mb-6">
            <HygieneScoreBadge score={business.hygieneScore} size="xl" />
          </div>

          {/* Status pills */}
          <div className="flex justify-center gap-3 mb-6">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${business.isVerified ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
              {business.isVerified ? '✅ Verified' : '⏳ Pending'}
            </span>
            {business.lastInspectionDate && (
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                🔍 Inspected {new Date(business.lastInspectionDate).toLocaleDateString('en-IN')}
              </span>
            )}
          </div>

          {/* Score breakdown mini */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2">
            {[
              { label: '🧹 Cleanliness', score: business.scores?.cleanliness },
              { label: '🧊 Food Storage', score: business.scores?.foodStorage },
              { label: '🧤 Staff Hygiene', score: business.scores?.staffHygiene },
            ].map(({ label, score }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="text-xs text-gray-600 w-32">{label}</span>
                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${score ?? 0}%`,
                      backgroundColor: (score ?? 0) >= 70 ? '#22C55E' : (score ?? 0) >= 50 ? '#F59E0B' : '#EF4444'
                    }}
                  />
                </div>
                <span className="text-xs font-mono text-gray-500 w-8 text-right">{score ?? 0}</span>
              </div>
            ))}
          </div>

          {business.averageRating > 0 && (
            <p className="text-sm text-gray-600 mb-4">
              ⭐ {business.averageRating}/5 · {business.totalReviews} customer reviews
            </p>
          )}

          <Link to={`/business/${business._id}`} className="btn-primary w-full py-3 rounded-xl">
            View Full Profile
          </Link>

          <p className="text-xs text-gray-400 mt-4">
            Verified by SafeBite AI · {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}
