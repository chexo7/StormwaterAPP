import React, { useEffect, useRef } from 'react';
import { FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';
import type { FeatureCollection } from 'geojson';

interface LodDrawerProps {
  data: FeatureCollection | null;
  onChange: (fc: FeatureCollection) => void;
}

const LodDrawer: React.FC<LodDrawerProps> = ({ data, onChange }) => {
  const groupRef = useRef<L.FeatureGroup>(null);

  useEffect(() => {
    if (groupRef.current) {
      const group = groupRef.current;
      group.clearLayers();
      if (data) {
        L.geoJSON(data).eachLayer(layer => group.addLayer(layer));
      }
    }
  }, [data]);

  const update = () => {
    if (groupRef.current) {
      const geojson = groupRef.current.toGeoJSON() as FeatureCollection;
      onChange(geojson);
    }
  };

  return (
    <FeatureGroup ref={groupRef}>
      <EditControl
        position="topright"
        onCreated={update}
        onEdited={update}
        onDeleted={update}
        draw={{
          polygon: true,
          rectangle: false,
          polyline: false,
          marker: false,
          circle: false,
          circlemarker: false,
        }}
      />
    </FeatureGroup>
  );
};

export default LodDrawer;
