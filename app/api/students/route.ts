import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id, name, programme, school, intake_year, hometown, bio, interests, looking_for, photo_url, created_at')
      .eq('role', 'student')
      .eq('verified', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('students fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch students.' }, { status: 500 });
    }

    // Shape into the format the MakeFriendSection expects
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
      avatarColor: 'from-violet-400 to-purple-600',
      photoUrl: u.photo_url ?? null,
      isNew: (Date.now() - new Date(u.created_at).getTime()) < 7 * 24 * 60 * 60 * 1000,
    }));

    return NextResponse.json({ profiles });
  } catch (err) {
    console.error('students error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
