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

export const getGoogleMapsSearchUrl = (location: string): string =>
  `https://www.google.com/maps/search/?${new URLSearchParams({ api: '1', query: location.trim() })}`;

// Google Maps URL API cho phép tối đa 9 điểm waypoint + điểm đi + điểm đến.
export const GOOGLE_MAPS_MAX_ROUTE_STOPS = 11;

export const getGoogleMapsRouteUrl = (locations: string[]): string | null => {
  const places = locations.map((place) => place.trim()).filter(Boolean)
    .slice(0, GOOGLE_MAPS_MAX_ROUTE_STOPS);
  if (places.length < 2) return null;
  const params = new URLSearchParams({
    api: '1',
    origin: places[0],
    destination: places[places.length - 1],
    travelmode: 'driving',
  });
  if (places.length > 2) params.set('waypoints', places.slice(1, -1).join('|'));
  return `https://www.google.com/maps/dir/?${params}`;
};

// URL nhúng Google Maps như preview cũ; không dùng service key Vietmap/Google.
export const getGoogleMapsEmbedUrl = (
  location: string,
  locale = 'vi',
): string => {
  const params = new URLSearchParams({
    q: location.trim(),
    hl: locale === 'en' ? 'en' : 'vi',
    z: '13',
    output: 'embed',
  });
  return `https://maps.google.com/maps?${params}`;
};

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

export const getOsmEmbedUrl = (latitude: number, longitude: number): string =>
  `https://www.openstreetmap.org/export/embed.html?${new URLSearchParams({
    bbox: [
      Math.max(-180, longitude - 0.025),
      Math.max(-85, latitude - 0.015),
      Math.min(180, longitude + 0.025),
      Math.min(85, latitude + 0.015),
    ].join(','),
    layer: 'mapnik',
    marker: `${latitude},${longitude}`,
  })}`;
