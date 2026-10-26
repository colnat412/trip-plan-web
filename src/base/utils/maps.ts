export const getGoogleMapsSearchUrl = (location: string): string =>
  `https://www.google.com/maps/search/?${new URLSearchParams({ api: '1', query: location.trim() })}`;

export const getGoogleMapsEmbedUrl = (
  location: string,
  locale = 'vi',
): string =>
  `https://maps.google.com/maps?${new URLSearchParams({ q: location.trim(), hl: locale === 'en' ? 'en' : 'vi', z: '13', output: 'embed' })}`;
