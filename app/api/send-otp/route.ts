import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { createAndSendOtp, isUcdEmail } from '@/lib/otp';

export const dynamic = 'force-dynamic';

// Sends a ONE-TIME sign-up verification OTP.
// This is only used during account creation. If a verified account already
// exists for this email, we refuse and tell the user to sign in with their
// password instead - so existing users never get an OTP just for logging in.
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

    // Block sign-up OTPs for emails that already have a verified account.
    const { data: existing } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', normalEmail)
      .eq('verified', true)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        {
          error: 'An account already exists for this email. Please sign in with your password.',
          accountExists: true,
        },
        { status: 409 }
      );
    }

    const result = await createAndSendOtp(normalEmail, 'signup');
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('send-otp error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
