import { CORE_SERVICE_URL } from '@/base/api/server/backend';
import { NextResponse, type NextRequest } from 'next/server';
import axios from 'axios';

interface ResendOtpRequestBody {
  email?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request
      .json()
      .catch(() => ({}))) as ResendOtpRequestBody;
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        {
          status: 400,
          message: 'Please provide your email.',
          data: null,
        },
        { status: 400 },
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    let identityResponse;
    try {
      identityResponse = await axios.post(
        `${CORE_SERVICE_URL}/api/auth/resend-otp`,
        {
          email: normalizedEmail,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data as {
          message?: string | string[];
        };
        const errorMessage = Array.isArray(errorData?.message)
          ? errorData.message.join(', ')
          : errorData?.message || 'Unable to resend OTP';

        return NextResponse.json(
          {
            status: error.response.status,
            message: errorMessage,
            data: null,
          },
          { status: error.response.status },
        );
      }
      throw error;
    }

    return NextResponse.json(
      {
        status: 200,
        message: identityResponse.data?.message || 'OTP resent successfully',
        data: identityResponse.data,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error during BFF resend-otp:', error);
    return NextResponse.json(
      {
        status: 500,
        message:
          'Unable to connect to authentication service. Please try again later.',
        data: null,
      },
      { status: 500 },
    );
  }
}
