import 'server-only';

import axios from 'axios';
import { NextResponse, type NextRequest } from 'next/server';
import { CORE_SERVICE_URL } from './backend';
import { hasSameRequestOrigin } from './request-origin';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';
const MAX_BODY_BYTES = 16384;
const validId = (id: string) => /^[A-Za-z0-9]{1,64}$/.test(id);

async function readPayload(request: NextRequest): Promise<unknown> {
  const reader = request.body?.getReader();
  if (!reader) throw new Error('Invalid JSON');
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let bytes = 0;
  let text = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new Error('Payload too large');
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    return JSON.parse(text);
  } finally {
    reader.releaseLock();
  }
}

export async function forwardTripNotes(request: NextRequest, tripId: string, method: Method, noteId?: string, history = false) {
  const headers = { 'Cache-Control': 'private, no-store' };
  const fail = (status: number, message: string) => NextResponse.json({ status, message, data: null }, { status, headers });
  const token = request.cookies.get('access_token')?.value;
  if (!token) return fail(401, 'Unauthorized');
  if (!validId(tripId) || (noteId !== undefined && !validId(noteId))) return fail(400, 'Invalid ID');
  if (method !== 'GET' && !hasSameRequestOrigin(request)) return fail(403, 'Invalid origin');

  let payload: { content: string; version?: number; imageUploadId?: string; removeImage?: boolean } | undefined;
  if (method === 'POST' || method === 'PUT') {
    let body: unknown;
    try { body = await readPayload(request); } catch { return fail(400, 'Invalid or oversized JSON'); }
    if (!body || typeof body !== 'object' || Array.isArray(body)) return fail(400, 'Invalid request');
    const { content, version, imageUploadId, removeImage } = body as Record<string, unknown>;
    if (typeof content !== 'string' || content.length > 2000) return fail(400, 'Invalid note content');
    if (imageUploadId !== undefined && (typeof imageUploadId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(imageUploadId))) return fail(400, 'Invalid image upload');
    if (removeImage !== undefined && typeof removeImage !== 'boolean') return fail(400, 'Invalid image removal');
    if (imageUploadId && removeImage) return fail(400, 'Cannot replace and remove image together');
    if (method === 'POST' && !content.trim() && !imageUploadId) return fail(400, 'A note needs text or an image');
    if (method === 'PUT' && (typeof version !== 'number' || !Number.isSafeInteger(version) || version < 0)) return fail(400, 'Invalid version');
    // Never forward authorId, tripId, permissions or other browser-supplied identity fields.
    payload = { content: content.trim(), ...(imageUploadId ? { imageUploadId: imageUploadId as string } : {}),
      ...(method === 'PUT' ? { version: version as number, removeImage: removeImage === true } : {}) };
  }
  const rawPage = request.nextUrl.searchParams.get('page') ?? '0';
  if (method === 'GET' && (!/^\d+$/.test(rawPage) || Number(rawPage) > 5000)) return fail(400, 'Invalid page');
  try {
    const response = await axios.request({
      method,
      url: `${CORE_SERVICE_URL}/api/trip/${encodeURIComponent(tripId)}/notes${noteId ? `/${encodeURIComponent(noteId)}` : ''}${history ? '/history' : ''}`,
      data: payload,
      params: method === 'GET' ? { page: Number(rawPage) } : undefined,
      timeout: 15000,
      validateStatus: () => true,
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json', 'Content-Type': 'application/json' },
    });
    return NextResponse.json(response.data, { status: response.status, headers });
  } catch {
    return fail(503, 'Trip notes are unavailable');
  }
}
