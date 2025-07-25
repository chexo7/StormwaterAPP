import React, { useEffect, useRef } from 'react';
import { useMap, Pane } from 'react-leaflet';
import L from 'leaflet';
import { RotatedImageOverlay } from '../utils/RotatedImageOverlay';

interface ControlPoint {
  img: { x: number; y: number };
  latlng: L.LatLngExpression;
}

interface PdfOverlayProps {
  url: string;
  points: [ControlPoint, ControlPoint] | null;
  zIndex?: number;
  onClick?: (imgX: number, imgY: number, event: L.LeafletMouseEvent) => void;
}

const PdfOverlay: React.FC<PdfOverlayProps> = ({ url, points, zIndex = 350, onClick }) => {
  const map = useMap();
  const overlayRef = useRef<RotatedImageOverlay | null>(null);

  useEffect(() => {
    if (!map) return;
    const overlay = new RotatedImageOverlay(url, { opacity: 1, pane: 'pdfPane' });
    overlayRef.current = overlay;
    overlay.addTo(map);
    const img = overlay.getElement();
    if (onClick) {
      img.style.pointerEvents = 'auto';
      img.addEventListener('click', (e: any) => {
        const rect = img.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        onClick(x, y, map.mouseEventToLatLng(e));
      });
    } else {
      img.style.pointerEvents = 'none';
    }
    return () => {
      overlay.remove();
    };
  }, [map, url, onClick]);

  useEffect(() => {
    if (!overlayRef.current) return;
    if (points) {
      const [p1, p2] = points;
      overlayRef.current.setControlPoints(L.point(p1.img), L.point(p2.img), p1.latlng, p2.latlng);
    }
  }, [points]);

  return <Pane name="pdfPane" style={{ zIndex }} />;
};

export default PdfOverlay;
