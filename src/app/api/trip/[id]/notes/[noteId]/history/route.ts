import type { NextRequest } from 'next/server';
import { forwardTripNotes } from '@/base/api/server/trip-notes-proxy';

export const dynamic = 'force-dynamic';
interface GETContextParams { params: Promise<{ id: string; noteId: string }> }

export async function GET(request: NextRequest, context: GETContextParams) {
  const { id, noteId } = await context.params;
  return forwardTripNotes(request, id, 'GET', noteId, true);
}
