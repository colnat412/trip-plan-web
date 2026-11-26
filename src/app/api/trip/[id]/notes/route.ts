import type { NextRequest } from 'next/server';
import { forwardTripNotes } from '@/base/api/server/trip-notes-proxy';

export const dynamic = 'force-dynamic';
type Context = { params: Promise<{ id: string }> };
export async function GET(request: NextRequest, context: Context) {
  return forwardTripNotes(request, (await context.params).id, 'GET');
}
export async function POST(request: NextRequest, context: Context) {
  return forwardTripNotes(request, (await context.params).id, 'POST');
}
