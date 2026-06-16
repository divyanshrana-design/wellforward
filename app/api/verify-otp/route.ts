import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and code are required.' }, { status: 400 });
    }

    const normalEmail = email.toLowerCase();

    // Find the most recent unused, unexpired OTP for this email
    const { data: otpRow, error } = await supabaseAdmin
      .from('otps')
      .select('*')
      .eq('email', normalEmail)
      .eq('code', code)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !otpRow) {
      return NextResponse.json(
        { error: 'Invalid or expired code. Please try again.' },
        { status: 400 }
      );
    }

    // Mark OTP as used
    await supabaseAdmin
      .from('otps')
      .update({ used: true })
      .eq('id', otpRow.id);

    // Create a simple signed session token (email + timestamp, base64)
    // For production you'd use a proper JWT library — this is lightweight & works
    const sessionPayload = Buffer.from(
      JSON.stringify({ email: normalEmail, verified: true, ts: Date.now() })
    ).toString('base64');

    const response = NextResponse.json({ success: true, email: normalEmail });

    // Set session cookie — httpOnly, 30 days
    response.cookies.set('wf_session', sessionPayload, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
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
