import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { createAndSendOtp, isUcdEmail } from '@/lib/otp';

// Sends a sign-in OTP, but ONLY if a verified account already exists for this
// email. New users are directed to the sign-up (/join) flow instead.
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

    // Confirm an account exists for this email
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

    const result = await createAndSendOtp(normalEmail, 'login');
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('login error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
