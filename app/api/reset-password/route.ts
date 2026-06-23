import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { isUcdEmail } from '@/lib/otp';
import { hashPassword, validatePassword } from '@/lib/password';

export const dynamic = 'force-dynamic';

// Step 2 of the "forgot password" flow: verify the reset OTP and set a new
// password. On success, also logs the user in by setting the session cookie.
export async function POST(req: NextRequest) {
  try {
    const { email, code, password } = await req.json();

    if (!email || !isUcdEmail(email)) {
      return NextResponse.json(
        { error: 'A valid UCD email address is required.' },
        { status: 400 }
      );
    }
    if (!code) {
      return NextResponse.json({ error: 'Verification code is required.' }, { status: 400 });
    }
    const pwErr = validatePassword(password);
    if (pwErr) {
      return NextResponse.json({ error: pwErr }, { status: 400 });
    }

    const normalEmail = email.toLowerCase();
    const normalCode = String(code).trim();

    // Find a valid, unused, unexpired OTP for this email.
    const { data: otpRow, error } = await supabaseAdmin
      .from('otps')
      .select('id')
      .eq('email', normalEmail)
      .eq('code', normalCode)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !otpRow) {
      return NextResponse.json(
        { error: 'Invalid or expired code. Please try again.' },
        { status: 400 }
      );
    }

    // Atomically claim the OTP.
    const { data: claimed } = await supabaseAdmin
      .from('otps')
      .update({ used: true })
      .eq('id', otpRow.id)
      .eq('used', false)
      .select('id')
      .maybeSingle();

    if (!claimed) {
      return NextResponse.json(
        { error: 'This code was already used. Please request a new one.' },
        { status: 400 }
      );
    }

    // Confirm the account still exists.
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', normalEmail)
      .eq('verified', true)
      .maybeSingle();

    if (!user) {
      return NextResponse.json(
        { error: 'No account found for this email.' },
        { status: 404 }
      );
    }

    // Update the password hash.
    const passwordHash = await hashPassword(password);
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({ password_hash: passwordHash })
      .eq('id', user.id);

    if (updateError) {
      console.error('reset-password update error:', updateError);
      return NextResponse.json({ error: 'Failed to update password.' }, { status: 500 });
    }

    // Log them straight in.
    const sessionPayload = Buffer.from(
      JSON.stringify({ email: normalEmail, verified: true, ts: Date.now() })
    ).toString('base64');

    const response = NextResponse.json({ success: true, email: normalEmail });

    const isHttps =
      req.headers.get('x-forwarded-proto') === 'https' ||
      new URL(req.url).protocol === 'https:';

    response.cookies.set('wf_session', sessionPayload, {
      httpOnly: true,
      secure: isHttps,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('reset-password error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
