"use client";
import { useState } from "react";
import Map from "../components/Map";
import shp from "shpjs";

export default function Home() {
  const [geojson, setGeojson] = useState<GeoJSON.GeoJSON | undefined>();
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const buffer = await file.arrayBuffer();
    const data = await shp(buffer);
    setGeojson(data as any);
  }

  return (
    <div className="p-4 space-y-4">
      <input type="file" accept=".zip,.shp" onChange={handleFile} />
      <Map apiKey={apiKey} geojson={geojson} />
    </div>
  );
}
