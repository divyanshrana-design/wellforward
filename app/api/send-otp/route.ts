import { NextRequest, NextResponse } from 'next/server';
import { createAndSendOtp, isUcdEmail } from '@/lib/otp';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !isUcdEmail(email)) {
      return NextResponse.json(
        { error: 'A valid UCD email address is required (@ucdconnect.ie or @ucd.ie).' },
        { status: 400 }
      );
    }

    const result = await createAndSendOtp(email, 'signup');
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('send-otp error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
