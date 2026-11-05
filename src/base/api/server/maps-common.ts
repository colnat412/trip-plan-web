import 'server-only';
import { NextResponse } from 'next/server';

export class MapsError extends Error {
  constructor(
    public code: string,
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'MapsError';
  }
}

export function mapsJson(body: unknown, status = 200) {
  const headers: Record<string, string> = {
    'Cache-Control': 'private, no-store',
  };
  if (status === 429) {
    headers['Retry-After'] = '60';
  }
  return NextResponse.json(body, { status, headers });
}

export function mapsErrorResponse(
  error: unknown,
  extra: Record<string, unknown> = {},
) {
  const failure =
    error instanceof MapsError
      ? error
      : new MapsError(
          'MAPS_PROVIDER_ERROR',
          502,
          'Map services are unavailable. Please try again.',
        );
  return mapsJson(
    { ...extra, code: failure.code, message: failure.message },
    failure.status,
  );
}
