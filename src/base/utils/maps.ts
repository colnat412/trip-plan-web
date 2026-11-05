export const getGoogleMapsSearchUrl = (location: string): string =>
  `https://www.google.com/maps/search/?${new URLSearchParams({ api: '1', query: location.trim() })}`;

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

export const getVietmapStyleUrl = (): string | null => {
  const key = process.env.NEXT_PUBLIC_VIETMAP_TILE_KEY?.trim();
  return key
    ? `https://maps.vietmap.vn/maps/styles/tm/style.json?${new URLSearchParams({ apikey: key })}`
    : null;
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
