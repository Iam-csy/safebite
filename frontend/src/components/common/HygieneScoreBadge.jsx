export default function HygieneScoreBadge({ score, size = 'md', showLabel = true }) {
  const getColor = (s) => {
    if (s >= 85) return { ring: '#F59E0B', bg: '#FFFBEB', text: '#92400E', label: 'Gold Safe', emoji: '🥇' };
    if (s >= 65) return { ring: '#9CA3AF', bg: '#F9FAFB', text: '#374151', label: 'Silver Safe', emoji: '🥈' };
    if (s >= 40) return { ring: '#F97316', bg: '#FFF7ED', text: '#9A3412', label: 'Needs Improvement', emoji: '⚠️' };
    return { ring: '#EF4444', bg: '#FEF2F2', text: '#991B1B', label: 'Unsafe', emoji: '🚨' };
  };

  const sizes = {
    sm: { outer: 'w-12 h-12', text: 'text-sm', sub: 'text-[9px]' },
    md: { outer: 'w-16 h-16', text: 'text-lg', sub: 'text-[10px]' },
    lg: { outer: 'w-24 h-24', text: 'text-2xl', sub: 'text-xs' },
    xl: { outer: 'w-32 h-32', text: 'text-4xl', sub: 'text-sm' },
  };

  const color = getColor(score);
  const sz = sizes[size];

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`${sz.outer} rounded-full flex flex-col items-center justify-center border-4 font-display font-bold`}
        style={{ borderColor: color.ring, backgroundColor: color.bg, color: color.text }}
      >
        <span className={sz.text}>{score}</span>
        <span className={`${sz.sub} font-body font-normal opacity-70`}>/100</span>
      </div>
      {showLabel && (
        <span
          className="text-xs font-semibold px-2.5 py-0.5 rounded-full border"
          style={{ color: color.text, backgroundColor: color.bg, borderColor: color.ring }}
        >
          {color.emoji} {color.label}
        </span>
      )}
    </div>
  );
}
