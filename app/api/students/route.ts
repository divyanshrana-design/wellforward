import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Derive consistent avatar colour from name hash
const AVATAR_COLORS = [
  'from-violet-400 to-purple-600',
  'from-indigo-400 to-blue-600',
  'from-fuchsia-400 to-pink-600',
  'from-sky-400 to-cyan-600',
  'from-emerald-400 to-teal-600',
  'from-amber-400 to-orange-500',
];
function avatarColorFor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

// Always run on every request - never statically cache (see seniors route).
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id, name, programme, school, intake_year, hometown, bio, interests, looking_for, photo_url, linkedin, instagram, contact_email, created_at')
      .eq('role', 'student')
      .eq('verified', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('students fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch students.' }, { status: 500 });
    }

    const profiles = (data ?? []).map(u => ({
      id: u.id,
      name: u.name,
      course: u.programme,
      school: u.school,
      year: u.intake_year,
      country: u.hometown ?? '',
      countryFlag: '',
      bio: u.bio ?? '',
      tags: u.interests ? u.interests.split(',').filter(Boolean) : [],
      avatarColor: avatarColorFor(u.name),
      photoUrl: u.photo_url ?? null,
      linkedin: u.linkedin ?? null,
      instagram: u.instagram ?? null,
      contactEmail: u.contact_email ?? null,
      isNew: (Date.now() - new Date(u.created_at).getTime()) < 7 * 24 * 60 * 60 * 1000,
    }));

    return NextResponse.json({ profiles });
  } catch (err) {
    console.error('students error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
