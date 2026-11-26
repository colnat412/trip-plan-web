import type { NextRequest } from 'next/server';
import { forwardTripNotes } from '@/base/api/server/trip-notes-proxy';

export const dynamic = 'force-dynamic';
type Context = { params: Promise<{ id: string; noteId: string }> };
export async function PUT(request: NextRequest, context: Context) {
  const { id, noteId } = await context.params;
  return forwardTripNotes(request, id, 'PUT', noteId);
}
export async function DELETE(request: NextRequest, context: Context) {
  const { id, noteId } = await context.params;
  return forwardTripNotes(request, id, 'DELETE', noteId);
}
