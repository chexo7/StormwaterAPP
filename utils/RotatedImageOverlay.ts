import L from 'leaflet';

export class RotatedImageOverlay extends L.ImageOverlay {
  private _imgP1: L.Point = L.point(0, 0);
  private _imgP2: L.Point = L.point(1, 0);
  private _mapP1: L.LatLng = L.latLng(0, 0);
  private _mapP2: L.LatLng = L.latLng(0, 0);

  constructor(url: string, options?: L.ImageOverlayOptions) {
    super(url, [[0,0],[0,0]], options);
  }

  setControlPoints(img1: L.PointExpression, img2: L.PointExpression, ll1: L.LatLngExpression, ll2: L.LatLngExpression) {
    this._imgP1 = L.point(img1);
    this._imgP2 = L.point(img2);
    this._mapP1 = L.latLng(ll1);
    this._mapP2 = L.latLng(ll2);
    this._reset();
  }

  onAdd(map: L.Map) {
    super.onAdd(map);
    map.on('zoom viewreset move', this._reset, this);
    (this.getElement() as HTMLElement).style.transformOrigin = '0 0';
    if (!this.getElement().complete) {
      this.getElement().addEventListener('load', () => this._reset());
    }
  }

  onRemove(map: L.Map) {
    map.off('zoom viewreset move', this._reset, this);
    super.onRemove(map);
  }

  _reset() {
    if (!this._map) return;
    const map = this._map;
    const p1 = map.latLngToLayerPoint(this._mapP1);
    const p2 = map.latLngToLayerPoint(this._mapP2);
    const dxImg = this._imgP2.x - this._imgP1.x;
    const dyImg = this._imgP2.y - this._imgP1.y;
    const dxMap = p2.x - p1.x;
    const dyMap = p2.y - p1.y;
    const scale = Math.sqrt(dxMap*dxMap + dyMap*dyMap) / Math.sqrt(dxImg*dxImg + dyImg*dyImg || 1);
    const angle = Math.atan2(dyMap, dxMap) - Math.atan2(dyImg, dxImg);
    const cos = Math.cos(angle) * scale;
    const sin = Math.sin(angle) * scale;
    const a = cos;
    const b = sin;
    const c = -sin;
    const d = cos;
    const e = p1.x - a*this._imgP1.x - c*this._imgP1.y;
    const f = p1.y - b*this._imgP1.x - d*this._imgP1.y;
    const el = this.getElement() as HTMLElement;
    el.style.transform = `matrix(${a},${b},${c},${d},${e},${f})`;
  }
}

export function rotatedImageOverlay(url: string, options?: L.ImageOverlayOptions) {
  return new RotatedImageOverlay(url, options);
}
