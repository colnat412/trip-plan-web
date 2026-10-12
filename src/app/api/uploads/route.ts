import type { NextRequest } from 'next/server';
import { forwardIdentity, identityError } from '@/base/api/server/identity';
import { IMAGE_MIME_TYPES, MAX_IMAGE_BYTES } from '@/base/types';

export const runtime = 'nodejs';
const MAX_REQUEST_BYTES = MAX_IMAGE_BYTES + 64 * 1024;

export async function POST(request: NextRequest) {
  if (!request.cookies.get('access_token')?.value)
    return identityError(401, 'Unauthorized');
  if (Number(request.headers.get('content-length')) > MAX_REQUEST_BYTES) {
    return identityError(413, 'File too large');
  }
  let form: FormData;
  try {
    const reader = request.body?.getReader();
    if (!reader) return identityError(400, 'Missing body');
    const chunks: ArrayBuffer[] = [];
    let total = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        total += value.byteLength;
        if (total > MAX_REQUEST_BYTES) {
          await reader.cancel();
          return identityError(413, 'File too large');
        }
        chunks.push(new Uint8Array(value).buffer);
      }
    } finally {
      reader.releaseLock();
    }
    form = await new Response(new Blob(chunks), {
      headers: { 'Content-Type': request.headers.get('content-type') || '' },
    }).formData();
  } catch {
    return identityError(400, 'Invalid multipart body');
  }
  const file = form.get('file');
  const purpose = form.get('purpose');
  if (
    !(file instanceof File) ||
    !file.size ||
    !IMAGE_MIME_TYPES.includes(file.type)
  ) {
    return identityError(400, 'Invalid image');
  }
  if (file.size > MAX_IMAGE_BYTES) return identityError(413, 'File too large');
  if (purpose !== 'PROFILE_AVATAR' && purpose !== 'TRIP_COVER')
    return identityError(400, 'Invalid purpose');
  if ([...form.keys()].length !== 2)
    return identityError(400, 'Unexpected fields');
  const body = new FormData();
  body.append('file', file);
  body.append('purpose', purpose);
  return forwardIdentity(request, '/uploads', 'POST', body);
}
