export default function AlertBanner({ type = 'info', message, onClose }) {
  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warn: 'bg-amber-50 border-amber-200 text-amber-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };
  const icons = { success: '✅', error: '❌', warn: '⚠️', info: 'ℹ️' };

  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-sm animate-slide-up ${styles[type]}`}>
      <span>{icons[type]}</span>
      <p className="flex-1">{message}</p>
      {onClose && (
        <button onClick={onClose} className="opacity-60 hover:opacity-100 transition-opacity ml-2">✕</button>
      )}
    </div>
  );
}
