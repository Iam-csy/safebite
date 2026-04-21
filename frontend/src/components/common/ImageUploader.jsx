import { useState, useRef } from 'react';

export default function ImageUploader({ onFile, label = 'Upload Image', accept = 'image/*', preview = true }) {
  const [dragging, setDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const inputRef = useRef();

  const handleFile = (file) => {
    if (!file) return;
    onFile(file);
    if (preview) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-3">
      <div
        onClick={() => inputRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200
          ${dragging ? 'border-primary bg-primary-50 scale-[1.01]' : 'border-gray-200 hover:border-primary hover:bg-gray-50'}`}
      >
        <div className="text-4xl mb-3">{previewUrl ? '✅' : '📷'}</div>
        <p className="font-medium text-gray-700 text-sm">{previewUrl ? 'Image selected — click to change' : label}</p>
        <p className="text-xs text-gray-400 mt-1">Drag & drop or click to browse · Max 5MB</p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>

      {preview && previewUrl && (
        <div className="relative rounded-xl overflow-hidden border border-gray-200">
          <img src={previewUrl} alt="Preview" className="w-full max-h-64 object-cover" />
          <button
            onClick={(e) => { e.stopPropagation(); setPreviewUrl(null); onFile(null); }}
            className="absolute top-2 right-2 bg-white rounded-full w-7 h-7 flex items-center justify-center shadow text-gray-600 hover:text-red-500 text-xs"
          >✕</button>
        </div>
      )}
    </div>
  );
}
