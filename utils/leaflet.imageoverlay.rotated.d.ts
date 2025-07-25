
declare module 'leaflet-imageoverlay-rotated' {
  import * as L from 'leaflet';
  interface RotatedOptions extends L.ImageOverlayOptions {}
  class RotatedImageOverlay extends L.ImageOverlay {
    constructor(image: string | HTMLImageElement | HTMLCanvasElement, topleft: L.LatLngExpression, topright: L.LatLngExpression, bottomleft: L.LatLngExpression, options?: RotatedOptions);
    reposition(topleft: L.LatLngExpression, topright: L.LatLngExpression, bottomleft: L.LatLngExpression): void;
  }
  function rotated(image: string | HTMLImageElement | HTMLCanvasElement, topleft: L.LatLngExpression, topright: L.LatLngExpression, bottomleft: L.LatLngExpression, options?: RotatedOptions): RotatedImageOverlay;
}

