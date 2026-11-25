import 'server-only';
import axios from 'axios';
import { NextResponse, type NextRequest } from 'next/server';
import { CORE_SERVICE_URL } from './backend';
import { hasSameRequestOrigin } from './request-origin';

export const RESET_COOKIE = 'vivu_password_reset';
export async function forwardPasswordRecovery(request: NextRequest, stage: 'request' | 'verify' | 'reset') {
  const reply = (status: number, message: string) => NextResponse.json({ status, message, data: null }, { status, headers: { 'Cache-Control': 'no-store' } });
  if (!hasSameRequestOrigin(request)) return reply(403, 'Invalid origin');
  let body: unknown;
  try { body = await request.json(); } catch { return reply(400, 'Invalid JSON'); }
  if (!body || typeof body !== 'object') return reply(400, 'Invalid request');
  const { email, otp, newPassword } = body as Record<string, unknown>;
  const resetToken = stage === 'reset' ? request.cookies.get(RESET_COOKIE)?.value : undefined;
  if (stage !== 'reset' && (typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))) return reply(400, 'Invalid email');
  if (stage === 'verify' && (typeof otp !== 'string' || !/^\d{6}$/.test(otp))) return reply(400, 'Invalid code');
  if (stage === 'reset' && (!resetToken || !/^[A-Za-z0-9_-]{43}$/.test(resetToken) || typeof newPassword !== 'string'
    || !newPassword.trim() || newPassword.length < 8 || new TextEncoder().encode(newPassword).length > 72)) return reply(400, 'Invalid reset request');
  const payload = stage === 'reset' ? { resetToken, newPassword } : { email: (email as string).trim().toLowerCase(), ...(stage === 'verify' ? { otp } : {}) };
  const endpoint = stage === 'request' ? 'forgot-password' : stage === 'verify' ? 'verify-reset-code' : 'reset-password';
  try {
    const result = await axios.post(`${CORE_SERVICE_URL}/api/auth/${endpoint}`, payload,
      { timeout: 45000, validateStatus: () => true, headers: { 'Content-Type': 'application/json', Accept: 'application/json' } });
    const success = result.status >= 200 && result.status < 300;
    const token = stage === 'verify' && success ? result.data?.data?.resetToken : undefined;
    if (stage === 'verify' && success && (typeof token !== 'string' || !/^[A-Za-z0-9_-]{43}$/.test(token))) return reply(502, 'Invalid verification response');
    const response = stage === 'verify' && success ? reply(200, 'Code verified')
      : NextResponse.json(result.data, { status: result.status, headers: { 'Cache-Control': 'no-store' } });
    const cookie = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' as const, path: '/api/auth' };
    if (stage === 'verify' && success) response.cookies.set(RESET_COOKIE, token, { ...cookie, maxAge: 600 });
    if (stage === 'request' && success || stage === 'reset') response.cookies.set(RESET_COOKIE, '', { ...cookie, maxAge: 0 });
    return response;
  } catch { return reply(503, 'Password recovery is unavailable'); }
}
