import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { isUcdEmail } from '@/lib/otp';
import { verifyPassword } from '@/lib/password';

export const dynamic = 'force-dynamic';

// Password-based sign in. No OTP - once an account is created, the user signs
// in with just their email + password. OTP is only used for sign-up and for
// the "forgot password" reset flow.
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !isUcdEmail(email)) {
      return NextResponse.json(
        { error: 'A valid UCD email address is required (@ucdconnect.ie or @ucd.ie).' },
        { status: 400 }
      );
    }
    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Password is required.' }, { status: 400 });
    }

    const normalEmail = email.toLowerCase();

    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id, password_hash, verified')
      .eq('email', normalEmail)
      .eq('verified', true)
      .maybeSingle();

    if (!user) {
      return NextResponse.json(
        { error: 'No account found for this email. Please join free first.', notFound: true },
        { status: 404 }
      );
    }

    // Account exists but has no password set (legacy account created before
    // passwords). Direct them to set one via "forgot password".
    if (!user.password_hash) {
      return NextResponse.json(
        {
          error: 'This account has no password yet. Use “Forgot password?” to set one.',
          needsPassword: true,
        },
        { status: 403 }
      );
    }

    const ok = await verifyPassword(password, user.password_hash);
    if (!ok) {
      return NextResponse.json(
        { error: 'Incorrect email or password.' },
        { status: 401 }
      );
    }

    // Create the same session token shape used by verify-otp.
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
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('login error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
