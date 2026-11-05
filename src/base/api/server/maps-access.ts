import 'server-only';
import type { NextRequest } from 'next/server';
import { mapsJson, MapsError } from './maps-common';

export async function requireMapsAccess(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    const directHttps = new URL(request.url).protocol === 'https:';
    const proxyHttps =
      process.env.MAPS_TRUST_PROXY === 'true' &&
      request.headers.get('x-forwarded-proto') === 'https';
    if (!directHttps && !proxyHttps)
      return mapsJson(
        {
          code: 'MAPS_HTTPS_REQUIRED',
          message: 'HTTPS is required for map requests.',
        },
        426,
      );
  }
  if (!request.cookies.get('access_token')?.value)
    return mapsJson({ code: 'UNAUTHORIZED', message: 'Unauthorized' }, 401);
  return null;
}

export async function readMapsBody(
  request: NextRequest,
): Promise<Record<string, unknown>> {
  const limit = 96 * 1024;
  const advertisedLength = Number(request.headers.get('content-length'));
  if (advertisedLength > limit)
    throw new MapsError(
      'MAPS_BODY_TOO_LARGE',
      413,
      'Map request body is too large.',
    );
  const reader = request.body?.getReader();
  if (!reader)
    throw new MapsError('INVALID_REQUEST', 400, 'Invalid request body.');
  const decoder = new TextDecoder();
  let bodyText = '';
  let receivedBytes = 0;
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      receivedBytes += chunk.value.byteLength;
      if (receivedBytes > limit) {
        await reader.cancel();
        throw new MapsError(
          'MAPS_BODY_TOO_LARGE',
          413,
          'Map request body is too large.',
        );
      }
      bodyText += decoder.decode(chunk.value, { stream: true });
    }
    bodyText += decoder.decode();
    const data: unknown = JSON.parse(bodyText);
    if (!data || typeof data !== 'object' || Array.isArray(data))
      throw new Error('Invalid body');
    return data as Record<string, unknown>;
  } catch (error) {
    if (error instanceof MapsError) throw error;
    throw new MapsError('INVALID_REQUEST', 400, 'Invalid request body.');
  } finally {
    reader.releaseLock();
  }
}
