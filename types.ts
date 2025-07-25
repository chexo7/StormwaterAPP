import type { FeatureCollection } from 'geojson';

// This file is included for structure, but we will use the types from the 'geojson' package directly in the components.
// For a larger project, you might define custom application-specific types here.

export interface LayerData {
  id: string;
  name: string;
  geojson: FeatureCollection;
  editable: boolean;
  visible: boolean;
  fillColor: string;
  fillOpacity: number;
  category?: string;
}

export interface LogEntry {
  message: string;
  type: 'info' | 'error';
  source?: 'frontend' | 'backend';
  timestamp?: number;
}

export interface PdfOverlayData {
  url: string;
  width: number;
  height: number;
  imagePoints: [{ x: number; y: number }, { x: number; y: number }];
  geoPoints: [[number, number], [number, number]];
}
