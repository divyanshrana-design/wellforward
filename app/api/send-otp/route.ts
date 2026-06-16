import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function isUcdEmail(email: string): boolean {
  const lower = email.toLowerCase();
  return lower.endsWith('@ucdconnect.ie') || lower.endsWith('@ucd.ie');
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !isUcdEmail(email)) {
      return NextResponse.json(
        { error: 'A valid UCD email address is required.' },
        { status: 400 }
      );
    }

    const code = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Invalidate any existing unused OTPs for this email
    await supabaseAdmin
      .from('otps')
      .update({ used: true })
      .eq('email', email.toLowerCase())
      .eq('used', false);

    // Insert new OTP
    const { error: insertError } = await supabaseAdmin
      .from('otps')
      .insert({
        email: email.toLowerCase(),
        code,
        expires_at: expiresAt.toISOString(),
        used: false,
      });

    if (insertError) {
      console.error('OTP insert error:', insertError);
      return NextResponse.json({ error: 'Failed to generate code.' }, { status: 500 });
    }

    // Send email via Resend
    const { error: emailError } = await resend.emails.send({
      from: 'Wellforward <onboarding@resend.dev>',
      to: email,
      subject: 'Your Wellforward verification code',
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; background: #fdfcff;">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; background: linear-gradient(135deg, #7c5cff, #c8b8ff); border-radius: 12px; padding: 12px 20px;">
              <span style="color: white; font-weight: 700; font-size: 1.1rem; letter-spacing: -0.02em;">Wellforward</span>
            </div>
          </div>
          <h2 style="font-size: 1.5rem; font-weight: 700; color: #1a0f2e; margin-bottom: 8px; text-align: center;">
            Verify your UCD email
          </h2>
          <p style="color: #38285c; text-align: center; margin-bottom: 32px; line-height: 1.6;">
            Enter this code on the Wellforward sign-up page. It expires in 10 minutes.
          </p>
          <div style="background: white; border: 2px solid #ede8ff; border-radius: 16px; padding: 32px; text-align: center; margin-bottom: 24px;">
            <div style="font-size: 2.8rem; font-weight: 900; letter-spacing: 0.18em; color: #7c5cff;">
              ${code}
            </div>
          </div>
          <p style="font-size: 0.78rem; color: #9b8ec8; text-align: center; line-height: 1.6;">
            If you did not request this, you can safely ignore this email.<br/>
            This code expires in 10 minutes.
          </p>
        </div>
      `,
    });

    if (emailError) {
      console.error('Email send error:', emailError);
      // Still return success — OTP is in DB, email failure shouldn't block user
      // In production you'd want better handling here
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('send-otp error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
