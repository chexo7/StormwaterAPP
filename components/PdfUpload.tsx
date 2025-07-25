import React, { useState, useRef, useEffect, useCallback } from 'react';
import { UploadIcon } from './Icons';
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist/legacy/build/pdf';

GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.worker.min.js`;

interface Point {
  x: number;
  y: number;
}

export interface PdfUploadResult {
  url: string;
  width: number;
  height: number;
  imagePoints: [Point, Point];
  geoPoints: [[number, number], [number, number]];
}

interface PdfUploadProps {
  onOverlayReady: (data: PdfUploadResult) => void;
}

const PdfUpload: React.FC<PdfUploadProps> = ({ onOverlayReady }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imagePoints, setImagePoints] = useState<Point[]>([]);
  const [geoPoints, setGeoPoints] = useState<[number, number][]>([]);
  const [pdfDims, setPdfDims] = useState<{ width: number; height: number } | null>(null);

  const handleFile = useCallback(async (file: File) => {
    const buffer = await file.arrayBuffer();
    const pdf = await getDocument({ data: buffer }).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    await page.render({ canvasContext: ctx, viewport }).promise;
    setPdfDims({ width: viewport.width, height: viewport.height });
    setImageLoaded(true);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.toLowerCase().endsWith('.pdf')) {
      handleFile(file);
    } else if (file) {
      alert('Only PDF files are supported');
    }
    e.target.value = '';
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!imageLoaded || imagePoints.length >= 2) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const lat = parseFloat(prompt('Latitude for this point?') || '');
    const lng = parseFloat(prompt('Longitude for this point?') || '');
    if (isNaN(lat) || isNaN(lng)) return;
    setImagePoints([...imagePoints, { x, y }]);
    setGeoPoints([...geoPoints, [lat, lng]]);
  };

  useEffect(() => {
    if (imagePoints.length === 2 && geoPoints.length === 2 && pdfDims) {
      const url = canvasRef.current?.toDataURL('image/png');
      if (url) {
        onOverlayReady({
          url,
          width: pdfDims.width,
          height: pdfDims.height,
          imagePoints: [imagePoints[0], imagePoints[1]],
          geoPoints: [geoPoints[0], geoPoints[1]],
        });
      }
    }
  }, [imagePoints, geoPoints, pdfDims, onOverlayReady]);

  return (
    <div className="bg-gray-700/50 p-6 rounded-lg border border-dashed border-gray-600 space-y-2">
      <h2 className="text-lg font-semibold text-white mb-2">Upload PDF Background</h2>
      <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors hover:border-gray-400 bg-gray-800 text-center">
        <UploadIcon className="w-10 h-10 mb-3 text-gray-400" />
        <p className="text-sm text-gray-300">Click to upload PDF</p>
        <input type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
      </label>
      {imageLoaded && (
        <>
          <p className="text-xs text-gray-300">Click two points on the image and enter their coordinates.</p>
          <canvas ref={canvasRef} onClick={handleCanvasClick} className="border border-gray-600 w-full" />
        </>
      )}
    </div>
  );
};

export default PdfUpload;
