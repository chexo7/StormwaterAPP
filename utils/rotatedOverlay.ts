import L from 'leaflet';

export class RotatedImageOverlay extends L.ImageOverlay {
  private _topLeft: L.LatLng;
  private _topRight: L.LatLng;
  private _bottomLeft: L.LatLng;

  constructor(url: string, topLeft: L.LatLngExpression, topRight: L.LatLngExpression, bottomLeft: L.LatLngExpression, options?: L.ImageOverlayOptions) {
    super(url, [topLeft, bottomLeft], options);
    this._topLeft = L.latLng(topLeft);
    this._topRight = L.latLng(topRight);
    this._bottomLeft = L.latLng(bottomLeft);
  }

  override getEvents() {
    return { zoom: this._reset, viewreset: this._reset } as any;
  }

  override _reset() {
    const img = this._image as HTMLImageElement;
    const map = this._map;
    if (!img || !map) return;

    const tl = map.latLngToLayerPoint(this._topLeft);
    const tr = map.latLngToLayerPoint(this._topRight);
    const bl = map.latLngToLayerPoint(this._bottomLeft);

    const w = img.naturalWidth || img.width;
    const h = img.naturalHeight || img.height;

    const xAxis = tr.subtract(tl);
    const yAxis = bl.subtract(tl);

    img.style.transformOrigin = '0 0';
    img.style.width = `${w}px`;
    img.style.height = `${h}px`;
    img.style.transform = `matrix(${xAxis.x / w},${xAxis.y / w},${yAxis.x / h},${yAxis.y / h},${tl.x},${tl.y})`;
  }
}

export function rotatedImageOverlay(url: string, topLeft: L.LatLngExpression, topRight: L.LatLngExpression, bottomLeft: L.LatLngExpression, options?: L.ImageOverlayOptions) {
  return new RotatedImageOverlay(url, topLeft, topRight, bottomLeft, options);
}
