import nodemailer from 'nodemailer';
import { supabaseAdmin } from '@/lib/supabase';

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function isUcdEmail(email: string): boolean {
  const lower = email.toLowerCase();
  return lower.endsWith('@ucdconnect.ie') || lower.endsWith('@ucd.ie');
}

// Gmail SMTP transporter — uses App Password (never your real Gmail password)
function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER, // e.g. wellforward.ucd@gmail.com
      pass: process.env.GMAIL_PASS, // 16-char App Password from Google
    },
  });
}

/**
 * Generates a fresh OTP for the email, stores it in the DB (invalidating any
 * previous unused ones), and emails it. Shared by both sign-up (send-otp) and
 * login flows so the behaviour is identical.
 */
export async function createAndSendOtp(
  email: string,
  purpose: 'signup' | 'login' = 'signup'
): Promise<{ ok: true } | { ok: false; error: string }> {
  const normalEmail = email.toLowerCase();
  const code = generateOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Invalidate any existing unused OTPs for this email
  await supabaseAdmin
    .from('otps')
    .update({ used: true })
    .eq('email', normalEmail)
    .eq('used', false);

  // Insert new OTP
  const { error: insertError } = await supabaseAdmin.from('otps').insert({
    email: normalEmail,
    code,
    expires_at: expiresAt.toISOString(),
    used: false,
  });

  if (insertError) {
    console.error('OTP insert error:', insertError);
    return { ok: false, error: 'Failed to generate code.' };
  }

  // Send email via Gmail SMTP
  const transporter = createTransporter();
  const fromName = process.env.GMAIL_USER ?? 'noreply';
  const heading = purpose === 'login' ? 'Sign in to Wellforward' : 'Verify your UCD email';
  const intro =
    purpose === 'login'
      ? 'Enter this code on the Wellforward sign-in page.'
      : 'Enter this code on the Wellforward sign-up page.';

  try {
    await transporter.sendMail({
      from: `Wellforward <${fromName}>`,
      to: email,
      subject:
        purpose === 'login'
          ? 'Your Wellforward sign-in code'
          : 'Your Wellforward verification code',
      headers: {
        'X-Mailer': 'Wellforward/1.0',
        'X-Priority': '3',
        Precedence: 'transactional',
        'Auto-Submitted': 'auto-generated',
      },
      text: `Your Wellforward code is: ${code}\n\nThis code expires in 10 minutes. If you did not request this, ignore this email.`,
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; background: #fdfcff;">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; background: linear-gradient(135deg, #7c5cff, #c8b8ff); border-radius: 12px; padding: 12px 24px;">
              <span style="color: white; font-weight: 700; font-size: 1.1rem; letter-spacing: -0.02em;">Wellforward</span>
            </div>
          </div>
          <h2 style="font-size: 1.4rem; font-weight: 700; color: #1a0f2e; margin-bottom: 8px; text-align: center;">
            ${heading}
          </h2>
          <p style="color: #38285c; text-align: center; margin-bottom: 32px; line-height: 1.6; font-size: 0.95rem;">
            ${intro}<br/>It expires in 10 minutes.
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
    // Non-fatal — OTP is still in DB
  }

  return { ok: true };
}
