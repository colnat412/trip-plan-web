import { CORE_SERVICE_URL } from '@/base/api/server/backend';
import { NextResponse, type NextRequest } from 'next/server';
import { requirePolicyAcceptance } from '@/base/api/server/policy-access';

export async function POST(request: NextRequest) {
  const denied = await requirePolicyAcceptance(request);
  if (denied) return denied;
  try {
    const accessToken = request.cookies.get('access_token')?.value;

    if (!accessToken) {
      return NextResponse.json(
        {
          status: 401,
          message: 'Unauthorized. Please login first.',
          data: null,
        },
        { status: 401 },
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        {
          status: 400,
          message: 'No receipt file provided or invalid file format.',
          data: null,
        },
        { status: 400 },
      );
    }

    const forwardFormData = new FormData();
    forwardFormData.append('file', file);

    const response = await fetch(`${CORE_SERVICE_URL}/api/ai/scan-receipt`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: forwardFormData,
    });

    const responseData = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage =
        (responseData && (responseData.detail || responseData.message)) ||
        'Failed to scan receipt with AI service';
      return NextResponse.json(
        {
          status: response.status,
          message: errorMessage,
          data: null,
        },
        { status: response.status },
      );
    }

    return NextResponse.json(
      {
        status: 200,
        message: 'Receipt scanned successfully',
        data: responseData,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      `Error in BFF POST /api/ai/scan-receipt (Target URL: ${CORE_SERVICE_URL}):`,
      error,
    );
    return NextResponse.json(
      {
        status: 500,
        message: 'Cannot connect to AI service. Please try again later.',
        data: null,
      },
      { status: 500 },
    );
  }
}
