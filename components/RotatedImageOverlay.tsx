import { createLayerComponent } from '@react-leaflet/core';
import L from 'leaflet';
import '../utils/leaflet.imageoverlay.rotated';

export interface RotatedImageOverlayProps extends L.ImageOverlayOptions {
  url: string;
  topleft: L.LatLngExpression;
  topright: L.LatLngExpression;
  bottomleft: L.LatLngExpression;
}

const RotatedImageOverlay = createLayerComponent<L.ImageOverlay, RotatedImageOverlayProps>(
  function createRotatedImageOverlay({ url, topleft, topright, bottomleft, ...options }, ctx) {
    const overlay = (L as any).imageOverlay.rotated(url, topleft, topright, bottomleft, options);
    return {
      instance: overlay,
      context: { ...ctx, overlayContainer: overlay }
    };
  },
  function updateOverlay(overlay, props, prev) {
    if (props.opacity !== prev.opacity) {
      overlay.setOpacity(props.opacity!);
    }
    if (props.url !== prev.url) {
      overlay.setUrl(props.url);
    }
    if (
      props.topleft !== prev.topleft ||
      props.topright !== prev.topright ||
      props.bottomleft !== prev.bottomleft
    ) {
      (overlay as any).reposition(props.topleft, props.topright, props.bottomleft);
    }
  }
);

export default RotatedImageOverlay;
