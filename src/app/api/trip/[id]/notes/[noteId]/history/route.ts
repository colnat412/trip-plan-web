import type { NextRequest } from 'next/server';
import { forwardTripNotes } from '@/base/api/server/trip-notes-proxy';

export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest, context: { params: Promise<{ id: string; noteId: string }> }) {
  const { id, noteId } = await context.params;
  return forwardTripNotes(request, id, 'GET', noteId, true);
}
