import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import nodemailer from 'nodemailer';

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function isUcdEmail(email: string): boolean {
  const lower = email.toLowerCase();
  return lower.endsWith('@ucdconnect.ie') || lower.endsWith('@ucd.ie');
}

// Gmail SMTP transporter — uses App Password (never your real Gmail password)
function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,   // e.g. wellforward.ucd@gmail.com
      pass: process.env.GMAIL_PASS,   // 16-char App Password from Google
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !isUcdEmail(email)) {
      return NextResponse.json(
        { error: 'A valid UCD email address is required (@ucdconnect.ie or @ucd.ie).' },
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

    // Send email via Gmail SMTP
    const transporter = createTransporter();
    const fromName = process.env.GMAIL_USER ?? 'noreply';

    try {
      await transporter.sendMail({
        from: `Wellforward <${fromName}>`,
        to: email,
        subject: 'Your Wellforward verification code',
        html: `
          <div style="font-family: 'Inter', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; background: #fdfcff;">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="display: inline-block; background: linear-gradient(135deg, #7c5cff, #c8b8ff); border-radius: 12px; padding: 12px 24px;">
                <span style="color: white; font-weight: 700; font-size: 1.1rem; letter-spacing: -0.02em;">Wellforward</span>
              </div>
            </div>
            <h2 style="font-size: 1.4rem; font-weight: 700; color: #1a0f2e; margin-bottom: 8px; text-align: center;">
              Verify your UCD email
            </h2>
            <p style="color: #38285c; text-align: center; margin-bottom: 32px; line-height: 1.6; font-size: 0.95rem;">
              Enter this code on the Wellforward sign-up page.<br/>It expires in 10 minutes.
            </p>
            <div style="background: white; border: 2px solid #ede8ff; border-radius: 16px; padding: 32px; text-align: center; margin-bottom: 24px;">
              <div style="font-size: 3rem; font-weight: 900; letter-spacing: 0.22em; color: #7c5cff; font-family: monospace;">
                ${code}
              </div>
            </div>
            <p style="font-size: 0.78rem; color: #9b8ec8; text-align: center; line-height: 1.7;">
              If you did not request this, you can safely ignore this email.<br/>
              This code expires in 10 minutes and can only be used once.
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Gmail send error:', emailError);
      // Non-fatal in dev — OTP is still in DB
      // In production this should alert
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('send-otp error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
