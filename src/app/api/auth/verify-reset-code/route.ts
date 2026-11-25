import type { NextRequest } from 'next/server';
import { forwardPasswordRecovery } from '@/base/api/server/password-recovery';

export function POST(request: NextRequest) { return forwardPasswordRecovery(request, 'verify'); }
