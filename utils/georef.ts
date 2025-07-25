import L from 'leaflet';

export interface RefPoint {
  px: number;
  py: number;
  lat: number;
  lng: number;
}

export function computeCorners(map: L.Map, width: number, height: number, p1: RefPoint, p2: RefPoint) {
  const m1 = map.latLngToLayerPoint([p1.lat, p1.lng]);
  const m2 = map.latLngToLayerPoint([p2.lat, p2.lng]);

  const dx = p2.px - p1.px;
  const dy = p2.py - p1.py;
  const dmx = m2.x - m1.x;
  const dmy = m2.y - m1.y;

  const pixelDist = Math.hypot(dx, dy);
  const mapDist = Math.hypot(dmx, dmy);
  const scale = mapDist / pixelDist;

  const anglePixel = Math.atan2(dy, dx);
  const angleMap = Math.atan2(dmy, dmx);
  const theta = angleMap - anglePixel;

  const cos = Math.cos(theta);
  const sin = Math.sin(theta);

  const tx = m1.x - scale * (cos * p1.px - sin * p1.py);
  const ty = m1.y - scale * (sin * p1.px + cos * p1.py);

  const transform = (px: number, py: number) => {
    const x = scale * (cos * px - sin * py) + tx;
    const y = scale * (sin * px + cos * py) + ty;
    return L.point(x, y);
  };

  return {
    tl: map.layerPointToLatLng(transform(0, 0)),
    tr: map.layerPointToLatLng(transform(width, 0)),
    bl: map.layerPointToLatLng(transform(0, height)),
  };
}
