import React, { useState, useRef } from 'react';
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';
import type { PdfOverlayConfig } from '../types';

// Use CDN worker
GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.3.136/pdf.worker.min.js';

interface Props {
  onAdd: (cfg: PdfOverlayConfig) => void;
}

const PdfUploader: React.FC<Props> = ({ onAdd }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const points = useRef<{ px: number; py: number; lat: number; lng: number }[]>([]);

  const handleFile = async (file: File) => {
    const buf = await file.arrayBuffer();
    const pdf = await getDocument({ data: buf }).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: ctx, viewport }).promise;
    setImageUrl(canvas.toDataURL());
    setDims({ w: canvas.width, h: canvas.height });
  };

  const handleClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!imgRef.current || !dims) return;
    const rect = imgRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const lat = parseFloat(prompt('Latitude for this point:') || '0');
    const lng = parseFloat(prompt('Longitude for this point:') || '0');
    points.current.push({ px, py, lat, lng });
    if (points.current.length === 2) {
      onAdd({ imageUrl: imageUrl!, width: dims.w, height: dims.h, refPoints: points.current });
      setImageUrl(null);
      setDims(null);
      points.current = [];
    } else {
      alert('Select second point');
    }
  };

  return (
    <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600 space-y-2">
      <label className="block text-sm text-gray-300">PDF Background</label>
      <input type="file" accept="application/pdf" onChange={e => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
      }} />
      {imageUrl && (
        <div className="fixed inset-0 bg-black/80 z-[2000] flex items-center justify-center">
          <img src={imageUrl} ref={imgRef} onClick={handleClick} className="max-h-full max-w-full cursor-crosshair" />
        </div>
      )}
    </div>
  );
};

export default PdfUploader;
