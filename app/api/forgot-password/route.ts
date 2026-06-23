import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { createAndSendOtp, isUcdEmail } from '@/lib/otp';

export const dynamic = 'force-dynamic';

// Step 1 of the "forgot password" flow: send a reset OTP — but only if a
// verified account exists for this email.
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !isUcdEmail(email)) {
      return NextResponse.json(
        { error: 'A valid UCD email address is required (@ucdconnect.ie or @ucd.ie).' },
        { status: 400 }
      );
    }

    const normalEmail = email.toLowerCase();

    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', normalEmail)
      .eq('verified', true)
      .maybeSingle();

    if (!user) {
      return NextResponse.json(
        { error: 'No account found for this email. Please join free first.', notFound: true },
        { status: 404 }
      );
    }

    const result = await createAndSendOtp(normalEmail, 'reset');
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('forgot-password error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
