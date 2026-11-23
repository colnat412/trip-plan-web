import type { StyleSpecification } from 'maplibre-gl';
import type { MapStop } from '@/base/types/maps';

export const getMapRouteSegments = (stops: MapStop[]): number[][][] =>
  stops.flatMap((stop, index) => {
    const next = stops[index + 1];
    // Missing coordinates break the route instead of connecting across an unknown stop.
    return next && next.order === stop.order + 1 ? [[
      [stop.coordinates.longitude, stop.coordinates.latitude],
      [next.coordinates.longitude, next.coordinates.latitude],
    ]] : [];
  });

// Dùng tile raster của Vietmap (tiles/tm/*.png). Style vector (vlc-*.pbf) dùng định dạng
// tile mà MapLibre không giải mã được nên chỉ vẽ ra nền trống.
export const getVietmapStyle = (): StyleSpecification | null => {
  const key = process.env.NEXT_PUBLIC_VIETMAP_TILE_KEY?.trim();
  if (!key) return null;
  return {
    version: 8,
    sources: {
      vietmap: {
        type: 'raster',
        tiles: [`https://maps.vietmap.vn/maps/tiles/tm/{z}/{x}/{y}.png?${new URLSearchParams({ apikey: key })}`],
        tileSize: 256,
        maxzoom: 18,
      },
    },
    layers: [{ id: 'vietmap', type: 'raster', source: 'vietmap' }],
  };
};
