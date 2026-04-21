import { Link } from 'react-router-dom';
import HygieneScoreBadge from './HygieneScoreBadge';

const categoryIcons = {
  restaurant: '🍽️', street_food: '🌮', canteen: '🥘',
  cloud_kitchen: '📦', mess: '🍛', cafe: '☕', other: '🍴',
};

const priceLabels = { budget: '₹', moderate: '₹₹', expensive: '₹₹₹' };

export default function BusinessCard({ business }) {
  const { _id, name, category, address, hygieneScore, badge, foodType, averageRating, totalReviews, priceRange, isVerified } = business;

  return (
    <Link to={`/business/${_id}`} className="card hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group block">
      <div className="flex items-start gap-4">
        {/* Icon/Logo */}
        <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-2xl flex-shrink-0">
          {categoryIcons[category] || '🍴'}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-display font-semibold text-gray-900 group-hover:text-primary transition-colors truncate">
                {name}
                {isVerified && <span className="ml-1.5 text-primary text-xs">✓</span>}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5 truncate">
                {categoryIcons[category]} {category?.replace('_', ' ')} · {address?.city}
              </p>
            </div>
            <HygieneScoreBadge score={hygieneScore} size="sm" showLabel={false} />
          </div>

          <div className="flex items-center gap-3 mt-2 flex-wrap">
            {/* Food type */}
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              foodType === 'veg' ? 'bg-green-50 text-green-700' :
              foodType === 'non_veg' ? 'bg-red-50 text-red-700' :
              'bg-blue-50 text-blue-700'
            }`}>
              {foodType === 'veg' ? '🟢 Veg' : foodType === 'non_veg' ? '🔴 Non-Veg' : '🔵 Both'}
            </span>

            {/* Rating */}
            {totalReviews > 0 && (
              <span className="text-xs text-gray-500 flex items-center gap-0.5">
                ⭐ {averageRating} <span className="text-gray-400">({totalReviews})</span>
              </span>
            )}

            {/* Price */}
            <span className="text-xs text-gray-500 font-mono">{priceLabels[priceRange]}</span>

            {/* Badge */}
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: badge?.color + '18' || '#6B728018',
                color: badge?.color || '#6B7280',
              }}
            >
              {badge?.emoji} {badge?.label}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
