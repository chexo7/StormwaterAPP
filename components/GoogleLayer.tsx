import { useEffect } from 'react';
import { createLayerComponent } from '@react-leaflet/core';
import L from 'leaflet';
import 'leaflet.gridlayer.googlemutant';

export interface GoogleLayerProps {
  type?: 'roadmap' | 'satellite' | 'terrain' | 'hybrid';
}

const createGoogleLayer = (props: GoogleLayerProps, context: any) => {
  // @ts-ignore
  const instance = (L.gridLayer as any).googleMutant({
    type: props.type || 'roadmap',
  });
  return { instance, context };
};

const GoogleLayer = createLayerComponent<
  L.GridLayer,
  GoogleLayerProps
>(createGoogleLayer);

export const useLoadGoogleMaps = () => {
  useEffect(() => {
    if ((window as any).google && (window as any).google.maps) return;
    const key = (process.env as any).GOOGLE_MAPS_API_KEY;
    if (!key) return;
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}`;
    script.async = true;
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);
};

export default GoogleLayer;
