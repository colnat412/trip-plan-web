import type { NextRequest } from 'next/server';
import { forwardMaps } from '@/base/api/server/maps-proxy';

export async function GET(request: NextRequest) {
  return forwardMaps(request, '/maps/location');
}
