import 'server-only';
import axios from 'axios';
import { NextResponse, type NextRequest } from 'next/server';
import { identityError } from './identity';

export async function requirePolicyAcceptance(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  if (!token) return identityError(401, 'Unauthorized');
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_IDENTITY_SERVICE_URL || 'http://localhost:8888';
    const response = await axios.get(`${baseUrl}/api/auth/me`, {
      timeout: 10_000,
      headers: { Authorization: `Bearer ${token}` },
    });
    const user = response.data?.data ?? response.data;
    if (!user?.policiesAcceptedAt || !user?.policiesVersion) {
      return NextResponse.json(
        {
          status: 403,
          code: 'POLICY_ACCEPTANCE_REQUIRED',
          message: 'Accept the policies before using Trip Plan',
          data: null,
        },
        { status: 403 },
      );
    }
    return null;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(error.response.data, {
        status: error.response.status,
      });
    }
    return identityError(502, 'Identity service unavailable');
  }
}
