import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../utils/api';

const rankStyles = [
  { bg: 'bg-amber-50 border-amber-200', num: 'text-amber-500', medal: '🥇' },
  { bg: 'bg-gray-50 border-gray-200', num: 'text-gray-400', medal: '🥈' },
  { bg: 'bg-orange-50 border-orange-200', num: 'text-orange-500', medal: '🥉' },
];

const categoryIcons = {
  restaurant: '🍽️', street_food: '🌮', canteen: '🥘',
  cloud_kitchen: '📦', mess: '🍛', cafe: '☕', other: '🍴',
};

export default function LeaderboardPage() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/businesses/leaderboard')
      .then(res => setBusinesses(res.data.businesses || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-br from-amber-50 to-white border-b border-amber-100">
        <div className="max-w-4xl mx-auto px-6 py-12 text-center">
          <div className="text-5xl mb-4">🏆</div>
          <h1 className="font-display text-4xl font-bold text-gray-900 mb-3">Hygiene Leaderboard</h1>
          <p className="text-gray-500">Top-rated restaurants by AI-verified hygiene scores this month</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {loading ? <LoadingSpinner text="Loading leaderboard..." /> : (
          <>
            {/* Top 3 podium */}
            {businesses.length >= 3 && (
              <div className="grid grid-cols-3 gap-4 mb-10">
                {/* 2nd place */}
                <div className="flex flex-col items-center pt-8">
                  <div className="text-3xl mb-2">🥈</div>
                  <div className="card w-full text-center border-gray-200">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl mx-auto mb-2">
                      {categoryIcons[businesses[1]?.category] || '🍴'}
                    </div>
                    <p className="font-display font-bold text-sm text-gray-900 truncate">{businesses[1]?.name}</p>
                    <p className="text-2xl font-display font-bold text-gray-500 mt-2">{businesses[1]?.hygieneScore}</p>
                    <p className="text-xs text-gray-400">/100</p>
                  </div>
                </div>
                {/* 1st place */}
                <div className="flex flex-col items-center">
                  <div className="text-4xl mb-2">🥇</div>
                  <div className="card w-full text-center border-amber-300 bg-amber-50 shadow-md">
                    <div className="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center text-3xl mx-auto mb-2">
                      {categoryIcons[businesses[0]?.category] || '🍴'}
                    </div>
                    <p className="font-display font-bold text-sm text-gray-900 truncate">{businesses[0]?.name}</p>
                    <p className="text-3xl font-display font-bold text-amber-600 mt-2">{businesses[0]?.hygieneScore}</p>
                    <p className="text-xs text-amber-500">/100</p>
                    <span className="badge-gold mt-2 inline-block">🥇 Gold Safe</span>
                  </div>
                </div>
                {/* 3rd place */}
                <div className="flex flex-col items-center pt-12">
                  <div className="text-3xl mb-2">🥉</div>
                  <div className="card w-full text-center border-orange-200">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-2xl mx-auto mb-2">
                      {categoryIcons[businesses[2]?.category] || '🍴'}
                    </div>
                    <p className="font-display font-bold text-sm text-gray-900 truncate">{businesses[2]?.name}</p>
                    <p className="text-2xl font-display font-bold text-orange-500 mt-2">{businesses[2]?.hygieneScore}</p>
                    <p className="text-xs text-orange-400">/100</p>
                  </div>
                </div>
              </div>
            )}

            {/* Full Rankings Table */}
            <div className="card overflow-hidden p-0">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h2 className="font-display font-semibold text-gray-900">Full Rankings</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {businesses.map((b, i) => {
                  const style = rankStyles[i] || {};
                  return (
                    <Link
                      key={b._id}
                      to={`/business/${b._id}`}
                      className={`flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors ${i < 3 ? style.bg + ' border-l-4' : ''}`}
                    >
                      {/* Rank */}
                      <div className="w-8 text-center flex-shrink-0">
                        {i < 3
                          ? <span className="text-2xl">{style.medal}</span>
                          : <span className={`font-display font-bold text-lg text-gray-400`}>{i + 1}</span>
                        }
                      </div>

                      {/* Icon */}
                      <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-xl flex-shrink-0">
                        {categoryIcons[b.category] || '🍴'}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{b.name}</p>
                        <p className="text-xs text-gray-500">
                          {b.address?.city} · {b.category?.replace('_', ' ')}
                          {b.averageRating > 0 && ` · ⭐ ${b.averageRating}`}
                        </p>
                      </div>

                      {/* Score */}
                      <div className="text-right flex-shrink-0">
                        <div
                          className="font-display font-bold text-xl"
                          style={{
                            color: b.hygieneScore >= 85 ? '#F59E0B' : b.hygieneScore >= 65 ? '#6B7280' : '#EF4444'
                          }}
                        >
                          {b.hygieneScore}
                        </div>
                        <div className="text-xs text-gray-400">/100</div>
                      </div>

                      {/* Badge */}
                      <div className="hidden sm:block flex-shrink-0 w-28 text-right">
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                          b.hygieneScore >= 85 ? 'badge-gold' :
                          b.hygieneScore >= 65 ? 'badge-silver' :
                          'badge-warn'
                        }`}>
                          {b.badge?.emoji} {b.badge?.label}
                        </span>
                      </div>
                    </Link>
                  );
                })}

                {businesses.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <div className="text-5xl mb-4">🏆</div>
                    <p>No verified businesses yet</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 mb-4">Want your restaurant on the leaderboard?</p>
              <Link to="/register?role=owner" className="btn-primary px-8 py-3 rounded-xl">
                Register Your Business
              </Link>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
