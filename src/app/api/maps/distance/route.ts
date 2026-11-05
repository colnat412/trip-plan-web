import type { NextRequest } from 'next/server';
import { forwardMaps } from '@/base/api/server/maps-proxy';

export async function POST(request: NextRequest) {
  return forwardMaps(request, '/maps/distance');
}
