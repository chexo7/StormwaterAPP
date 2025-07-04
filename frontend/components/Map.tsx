/// <reference types="@types/google.maps" />
"use client";
import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface MapProps {
  apiKey: string;
  geojson?: GeoJSON.GeoJSON;
}

export default function Map({ apiKey, geojson }: MapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const loader = new Loader({ apiKey, version: "weekly" });
    let map: google.maps.Map;

    loader.load().then(() => {
      map = new google.maps.Map(mapRef.current!, {
        center: { lat: 0, lng: 0 },
        zoom: 2,
      });

      if (geojson) {
        map.data.addGeoJson(geojson as any);
        map.data.setStyle({ fillColor: "#00FF00", strokeColor: "#000000" });
        const bounds = new google.maps.LatLngBounds();
        (geojson as any).features?.forEach((f: any) => {
          const g = new google.maps.Data.Feature(f);
          const geom = g.getGeometry();
          if (geom) extendBounds(bounds, geom);
        });
        map.fitBounds(bounds);
      }
    });

    return () => {
      if (map) {
        // cleanup if necessary
      }
    };
  }, [apiKey, geojson]);

  return <div ref={mapRef} style={{ width: "100%", height: "500px" }} />;
}

function extendBounds(bounds: google.maps.LatLngBounds, geom: google.maps.Data.Geometry) {
  if (geom instanceof google.maps.Data.Point) {
    bounds.extend(geom.get());
  } else if (geom instanceof google.maps.Data.MultiPoint || geom instanceof google.maps.Data.LineString) {
    geom.getArray().forEach(p => bounds.extend(p as google.maps.LatLng));
  } else if (geom instanceof google.maps.Data.Polygon || geom instanceof google.maps.Data.MultiLineString) {
    geom.getArray().forEach(part => extendBounds(bounds, part as any));
  } else if (geom instanceof google.maps.Data.MultiPolygon) {
    geom.getArray().forEach(polygon => extendBounds(bounds, polygon as any));
  } else if (geom instanceof google.maps.Data.GeometryCollection) {
    geom.getArray().forEach(g => extendBounds(bounds, g as any));
  }
}
