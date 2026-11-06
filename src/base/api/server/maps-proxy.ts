import { CORE_SERVICE_URL } from '@/base/api/server/backend';
import 'server-only';
import axios from 'axios';
import type { NextRequest } from 'next/server';
import { mapsErrorResponse, mapsJson, MapsError } from './maps-common';
import { requireMapsAccess, readMapsBody } from './maps-access';

export async function forwardMaps(
  request: NextRequest,
  path: '/maps/places' | '/maps/location' | '/maps/distance',
  regionsOnly = false,
) {
  const denied = await requireMapsAccess(request);
  if (denied) return denied;
  try {
    const coreBaseUrl = CORE_SERVICE_URL;
    if (
      process.env.NODE_ENV === 'production' &&
      new URL(coreBaseUrl).protocol !== 'https:'
    ) {
      throw new MapsError(
        'MAPS_HTTPS_REQUIRED',
        502,
        'The Core service requires an HTTPS URL.',
      );
    }
    const query = new URL(request.url).searchParams;
    const isDistanceRequest = path === '/maps/distance';

    const response = await axios.request({
      url: `${coreBaseUrl}/api${path}`,
      method: isDistanceRequest ? 'POST' : 'GET',
      params: isDistanceRequest
        ? undefined
        : {
            q: query.get('q') || '',
            lang: query.get('lang') || 'vi',
            regionsOnly,
          },
      data: isDistanceRequest ? await readMapsBody(request) : undefined,
      headers: {
        Authorization: `Bearer ${request.cookies.get('access_token')!.value}`,
        Accept: 'application/json',
      },
      signal: request.signal,
      timeout: 90_000,
      maxRedirects: 0,
      validateStatus: () => true,
    });
    if (response.status >= 200 && response.status < 300) {
      return mapsJson(response.data.data, response.status);
    }
    return mapsJson(
      {
        code:
          response.data?.data?.code || response.data?.code || 'MAPS_CORE_ERROR',
        message: response.data?.message || 'The map request failed.',
      },
      response.status,
    );
  } catch (error) {
    return mapsErrorResponse(error);
  }
}
