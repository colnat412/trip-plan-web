import type { MetadataRoute } from 'next';
import { APP_NAME } from '@/base/constants/brand';

const manifest = (): MetadataRoute.Manifest => {
  return {
    id: '/',
    name: APP_NAME,
    short_name: APP_NAME,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#1E3A8A',
    icons: [
      {
        src: '/pwa/icon-192.png?v=2',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa/icon-512.png?v=2',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa/icon-maskable-512.png?v=2',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
};

export default manifest;
