import React, { useRef, useState } from 'react';
import { Upload, X, Check, Loader2, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { uploadBannerImage } from '../../services/storageService';

interface ImageUploadFieldProps {
  label: string;
  subLabel?: string;
  currentUrl: string;
  onChange: (url: string) => void;
  folderCategory?: 'hero' | 'sidecards' | 'promos' | 'categories';
  aspectRatioHint?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  subLabel,
  currentUrl,
  onChange,
  folderCategory = 'hero',
  aspectRatioHint,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelected = async (file: File) => {
    if (!file) return;
    setUploadError(null);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const downloadUrl = await uploadBannerImage(file, folderCategory, (prog) => {
        setUploadProgress(prog);
      });
      onChange(downloadUrl);
    } catch (err: any) {
      setUploadError(err.message || 'Görsel yüklenirken hata oluştu.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-gray-700 block">{label}</label>
        {aspectRatioHint && (
          <span className="text-[10px] font-mono text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
            {aspectRatioHint}
          </span>
        )}
      </div>
      {subLabel && <p className="text-[11px] text-gray-500">{subLabel}</p>}

      {/* Preview & Upload Stage */}
      <div className="flex flex-col sm:flex-row gap-3 items-start">
        {/* Visual Thumbnail */}
        <div className="relative w-28 h-20 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
          {currentUrl ? (
            <img
              src={currentUrl}
              alt="Görsel Önizleme"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="text-center p-2 text-gray-400 flex flex-col items-center">
              <ImageIcon className="w-5 h-5 mb-1 opacity-50" />
              <span className="text-[9px]">Görsel Yok</span>
            </div>
          )}
          {currentUrl && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-1 right-1 bg-black/70 hover:bg-black text-white p-0.5 rounded"
              title="Görseli Temizle"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Action Controls & URL Input */}
        <div className="flex-1 w-full space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={currentUrl}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://... veya bilgisayardan yükleyin"
              className="flex-1 text-xs border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-[#c89d3a] focus:border-[#c89d3a] outline-hidden font-mono"
            />

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileSelected(e.target.files[0]);
                }
              }}
            />

            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-lg shrink-0 flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>%{uploadProgress}</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5 text-[#c89d3a]" />
                  <span>Dosya Seç</span>
                </>
              )}
            </button>
          </div>

          {/* Drag & Drop mini dropzone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border border-dashed border-gray-300 hover:border-[#c89d3a] rounded-lg py-1.5 px-3 text-center text-[10px] text-gray-500 bg-gray-50/50 hover:bg-amber-50/30 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            veya görseli buraya sürükleyip bırakın (Max 10MB)
          </div>

          {uploadError && (
            <div className="flex items-center gap-1.5 text-rose-600 text-[11px] bg-rose-50 p-2 rounded">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
