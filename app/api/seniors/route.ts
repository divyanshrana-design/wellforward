import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Always run on every request - never statically cache. Without this, Next.js
// pre-renders this route at build time and freezes the senior list to whoever
// existed then, so new sign-ups would never appear.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const cols = 'id, name, programme, school, intake_year, hometown, bio, interests, photo_url, linkedin, instagram, contact_email, created_at';
    let { data, error } = await supabaseAdmin
      .from('users')
      .select(cols)
      .eq('role', 'senior')
      .eq('verified', true)
      .or('hidden.is.null,hidden.eq.false')
      .order('created_at', { ascending: false });

    // Fallback if the moderation `hidden` column hasn't been added yet.
    if (error && /hidden/i.test(error.message || '')) {
      ({ data, error } = await supabaseAdmin
        .from('users')
        .select(cols)
        .eq('role', 'senior')
        .eq('verified', true)
        .order('created_at', { ascending: false }));
    }

    if (error) {
      console.error('seniors fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch seniors.' }, { status: 500 });
    }

    const profiles = (data ?? []).map(u => ({
      id: u.id,
      name: u.name,
      programme: u.programme,
      school: u.school,
      graduationYear: u.intake_year,
      country: u.hometown ?? '',
      countryFlag: '',
      askMeAbout: u.interests ?? '',
      bio: u.bio ?? '',
      photoUrl: u.photo_url ?? null,
      linkedin: u.linkedin ?? null,
      instagram: u.instagram ?? null,
      // For seniors: contact_email is their public reach-out email
      email: u.contact_email ? `mailto:${u.contact_email}` : null,
    }));

    return NextResponse.json({ profiles });
  } catch (err) {
    console.error('seniors error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
