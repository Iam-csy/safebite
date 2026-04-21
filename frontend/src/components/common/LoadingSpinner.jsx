export default function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="relative w-12 h-12">
        <div className="w-12 h-12 rounded-full border-4 border-primary-100"></div>
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin absolute inset-0"></div>
      </div>
      <p className="text-sm text-gray-500">{text}</p>
    </div>
  );
}
