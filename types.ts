import type { FeatureCollection } from 'geojson';

// This file is included for structure, but we will use the types from the 'geojson' package directly in the components.
// For a larger project, you might define custom application-specific types here.

export interface LayerData {
  id: string;
  name: string;
  geojson: FeatureCollection;
}

export interface LogEntry {
  message: string;
  type: 'info' | 'error';
  source?: 'frontend' | 'backend';
  timestamp?: number;
}
