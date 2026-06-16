import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Helper — read email from session cookie
function getEmailFromCookie(req: NextRequest): string | null {
  const cookie = req.cookies.get('wf_session')?.value;
  if (!cookie) return null;
  try {
    const payload = JSON.parse(Buffer.from(cookie, 'base64').toString('utf-8'));
    return payload.email ?? null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    // Must be verified (cookie set by verify-otp)
    const email = getEmailFromCookie(req);
    if (!email) {
      return NextResponse.json({ error: 'Not verified. Complete OTP step first.' }, { status: 401 });
    }

    const body = await req.json();
    const { name, programme, school, intakeYear, hometown, bio, interests, lookingFor, photo } = body;

    if (!name || !programme || !intakeYear) {
      return NextResponse.json({ error: 'Name, programme and intake year are required.' }, { status: 400 });
    }

    // Determine role from intake year
    const isMeetPeople = intakeYear === '2026/27';
    const role = isMeetPeople ? 'student' : 'senior';

    // Handle photo upload to Supabase Storage
    let photoUrl: string | null = null;
    if (photo && photo.startsWith('data:image/')) {
      // photo is a base64 data URL from the frontend FileReader
      const base64Data = photo.split(',')[1];
      const mimeMatch = photo.match(/data:(image\/\w+);base64/);
      const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
      const ext = mime.split('/')[1] ?? 'jpg';
      const buffer = Buffer.from(base64Data, 'base64');
      const fileName = `${Date.now()}-${email.split('@')[0]}.${ext}`;

      const { error: uploadError } = await supabaseAdmin.storage
        .from('avatars')
        .upload(fileName, buffer, {
          contentType: mime,
          upsert: true,
        });

      if (!uploadError) {
        const { data: urlData } = supabaseAdmin.storage
          .from('avatars')
          .getPublicUrl(fileName);
        photoUrl = urlData.publicUrl;
      } else {
        console.warn('Photo upload failed:', uploadError.message);
        // Non-fatal — profile saved without photo
      }
    }

    // Upsert profile (update if already exists for this email)
    const { data: user, error: upsertError } = await supabaseAdmin
      .from('users')
      .upsert(
        {
          email,
          name,
          programme,
          school: school ?? 'Smurfit Business School',
          intake_year: intakeYear,
          hometown: hometown ?? null,
          bio: bio ?? null,
          interests: interests ?? null,
          looking_for: lookingFor ?? null,
          photo_url: photoUrl,
          role,
          verified: true,
        },
        { onConflict: 'email' }
      )
      .select()
      .single();

    if (upsertError) {
      console.error('Profile upsert error:', upsertError);
      return NextResponse.json({ error: 'Failed to save profile.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, user: { id: user.id, role, email } });
  } catch (err) {
    console.error('register error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
