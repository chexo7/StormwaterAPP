import React, { useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.min.js';
import L from 'leaflet';

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

export interface PdfOverlayData {
  src: string;
  topLeft: [number, number];
  topRight: [number, number];
  bottomLeft: [number, number];
}

interface Props {
  onOverlayReady: (data: PdfOverlayData) => void;
}

const PdfOverlayUpload: React.FC<Props> = ({ onOverlayReady }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageReady, setImageReady] = useState(false);
  const points = useRef<{x:number,y:number,lat:number,lng:number}[]>([]);
  const sizeRef = useRef<{width:number,height:number} | null>(null);
  const handleFile = async (file: File) => {
    const buf = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1 });
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    sizeRef.current = { width: viewport.width, height: viewport.height };
    await page.render({ canvasContext: ctx, viewport }).promise;
    setImageReady(true);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleClick = async (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!imageReady || !sizeRef.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const latStr = prompt('Latitude for this point?');
    const lngStr = prompt('Longitude for this point?');
    if (!latStr || !lngStr) return;
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    if (isNaN(lat) || isNaN(lng)) return;
    points.current.push({ x, y, lat, lng });
    if (points.current.length === 2) {
      const [p1, p2] = points.current;
      const tl = L.latLng(p1.lat, p1.lng);
      const tr = L.latLng(p2.lat, p2.lng);
      const proj1 = L.CRS.EPSG3857.project(tl);
      const proj2 = L.CRS.EPSG3857.project(tr);
      const vProj = { x: proj2.x - proj1.x, y: proj2.y - proj1.y };
      const vImg = { x: p2.x - p1.x, y: p2.y - p1.y };
      const lenProj = Math.hypot(vProj.x, vProj.y);
      const lenImg = Math.hypot(vImg.x, vImg.y);
      const scale = lenProj / lenImg;
      const angle = Math.atan2(vProj.y, vProj.x) - Math.atan2(vImg.y, vImg.x);
      const p3img = {
        x: p1.x - vImg.y * (sizeRef.current.height / lenImg),
        y: p1.y + vImg.x * (sizeRef.current.height / lenImg)
      };
      const dx = p3img.x - p1.x;
      const dy = p3img.y - p1.y;
      const x3 = proj1.x + (dx * Math.cos(angle) - dy * Math.sin(angle)) * scale;
      const y3 = proj1.y + (dx * Math.sin(angle) + dy * Math.cos(angle)) * scale;
      const bl = L.CRS.EPSG3857.unproject(L.point(x3, y3));
      const src = canvasRef.current.toDataURL();
      onOverlayReady({
        src,
        topLeft: [p1.lat, p1.lng],
        topRight: [p2.lat, p2.lng],
        bottomLeft: [bl.lat, bl.lng]
      });
      points.current = [];
      setImageReady(false);
    }
  };

  return (
    <div className="bg-gray-700/50 p-6 rounded-lg border border-dashed border-gray-600 mt-4">
      <h2 className="text-lg font-semibold text-white mb-4">Upload PDF Background</h2>
      <input type="file" accept="application/pdf" onChange={onFileChange} className="mb-4" />
      {imageReady && (
        <canvas ref={canvasRef} onClick={handleClick} style={{cursor:'crosshair', maxWidth:'100%'}} />
      )}
      {!imageReady && <canvas ref={canvasRef} style={{display:'none'}} />}
    </div>
  );
};

export default PdfOverlayUpload;
