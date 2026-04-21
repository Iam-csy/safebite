import { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import BusinessCard from '../components/common/BusinessCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../utils/api';

const categories = ['all', 'restaurant', 'street_food', 'canteen', 'cloud_kitchen', 'mess', 'cafe'];
const foodTypes = ['all', 'veg', 'non_veg', 'both'];

export default function SearchPage() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    search: '', city: 'Prayagraj', category: 'all', foodType: 'all', minScore: '', sort: '-hygieneScore',
  });
  const [page, setPage] = useState(1);

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set('search', filters.search);
      if (filters.city) params.set('city', filters.city);
      if (filters.category !== 'all') params.set('category', filters.category);
      if (filters.foodType !== 'all') params.set('foodType', filters.foodType);
      if (filters.minScore) params.set('minScore', filters.minScore);
      params.set('sort', filters.sort);
      params.set('page', page);
      params.set('limit', 12);

      const { data } = await api.get(`/businesses?${params}`);
      setBusinesses(data.businesses || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBusinesses(); }, [filters, page]);

  const setFilter = (key, val) => { setFilters(p => ({ ...p, [key]: val })); setPage(1); };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Search Header */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search input */}
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                className="input-field pl-10"
                placeholder="Search restaurants, canteens, street food..."
                value={filters.search}
                onChange={e => setFilter('search', e.target.value)}
              />
            </div>
            {/* City */}
            <input
              className="input-field w-full md:w-40"
              placeholder="City"
              value={filters.city}
              onChange={e => setFilter('city', e.target.value)}
            />
            {/* Sort */}
            <select
              className="input-field w-full md:w-48"
              value={filters.sort}
              onChange={e => setFilter('sort', e.target.value)}
            >
              <option value="-hygieneScore">↓ Highest Score</option>
              <option value="hygieneScore">↑ Lowest Score</option>
              <option value="-createdAt">Newest</option>
              <option value="-averageRating">Best Rated</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-56 flex-shrink-0">
            <div className="card sticky top-36">
              <h3 className="font-display font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">Filters</h3>

              <div className="space-y-5">
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Category</p>
                  <div className="space-y-1">
                    {categories.map(c => (
                      <button
                        key={c}
                        onClick={() => setFilter('category', c)}
                        className={`w-full text-left text-sm px-3 py-1.5 rounded-lg capitalize transition-colors ${
                          filters.category === c ? 'bg-primary-100 text-primary font-semibold' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {c === 'all' ? 'All Categories' : c.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Food Type</p>
                  <div className="space-y-1">
                    {foodTypes.map(t => (
                      <button
                        key={t}
                        onClick={() => setFilter('foodType', t)}
                        className={`w-full text-left text-sm px-3 py-1.5 rounded-lg capitalize transition-colors ${
                          filters.foodType === t ? 'bg-primary-100 text-primary font-semibold' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {t === 'all' ? 'All Types' : t === 'veg' ? '🟢 Veg' : t === 'non_veg' ? '🔴 Non-Veg' : '🔵 Both'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Min Hygiene Score</p>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="input-field text-sm"
                    placeholder="e.g. 70"
                    value={filters.minScore}
                    onChange={e => setFilter('minScore', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">
                {loading ? 'Searching...' : `${total} restaurant${total !== 1 ? 's' : ''} found`}
              </p>
            </div>

            {loading ? (
              <LoadingSpinner text="Finding safe food near you..." />
            ) : businesses.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="font-display text-xl font-semibold text-gray-700 mb-2">No results found</h3>
                <p className="text-gray-500 text-sm">Try adjusting your filters or search term</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {businesses.map(b => <BusinessCard key={b._id} business={b} />)}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
