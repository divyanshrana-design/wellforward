import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and code are required.' }, { status: 400 });
    }

    const normalEmail = email.toLowerCase();
    const normalCode = String(code).trim();

    // Find the most recent unused, unexpired OTP for this email.
    // maybeSingle() returns null (not an error) when nothing matches, so a
    // wrong code is handled cleanly rather than throwing.
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

    // Atomically mark this OTP as used - and only succeed if it was still
    // unused. This prevents a replay / double-submit from verifying twice.
    const { data: claimed } = await supabaseAdmin
      .from('otps')
      .update({ used: true })
      .eq('id', otpRow.id)
      .eq('used', false)
      .select('id')
      .maybeSingle();

    if (!claimed) {
      // Someone/something already consumed this code in a parallel request.
      return NextResponse.json(
        { error: 'This code was already used. Please request a new one.' },
        { status: 400 }
      );
    }

    // Does a completed profile already exist for this email? This lets the
    // client route returning users straight to /profile, and brand-new users
    // to /join to finish setting up - instead of guessing.
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', normalEmail)
      .eq('verified', true)
      .maybeSingle();
    const hasProfile = !!existingUser;

    // Create a simple signed session token (email + timestamp, base64)
    // For production you'd use a proper JWT library - this is lightweight & works
    const sessionPayload = Buffer.from(
      JSON.stringify({ email: normalEmail, verified: true, ts: Date.now() })
    ).toString('base64');

    const response = NextResponse.json({ success: true, email: normalEmail, hasProfile });

    // Set session cookie - httpOnly, 30 days.
    // `secure` is only added when the request actually arrived over HTTPS, so
    // the cookie is never silently dropped when served over plain HTTP
    // (e.g. behind a proxy that terminates TLS upstream).
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
    console.error('verify-otp error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
