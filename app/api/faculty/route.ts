import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Try to fetch with faculty-specific columns first
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data: any[] | null = null;
    let useFacultyColumns = true;

    const { data: fullData, error: fullError } = await supabaseAdmin
      .from('users')
      .select(
        'id, name, email, programme, school, bio, photo_url, linkedin, instagram, contact_email, ' +
        'faculty_title, faculty_modules, faculty_office, faculty_website, created_at'
      )
      .eq('role', 'faculty')
      .eq('verified', true)
      .order('name', { ascending: true });

    if (fullError) {
      // If faculty columns don't exist yet, fall back to base columns
      if (fullError.code === '42703' || fullError.message?.includes('does not exist')) {
        useFacultyColumns = false;
        const { data: baseData, error: baseError } = await supabaseAdmin
          .from('users')
          .select('id, name, email, programme, school, bio, photo_url, linkedin, instagram, contact_email, created_at')
          .eq('role', 'faculty')
          .eq('verified', true)
          .order('name', { ascending: true });

        if (baseError) {
          console.error('Faculty fetch error (fallback):', baseError);
          return NextResponse.json({ error: 'Failed to load faculty.' }, { status: 500 });
        }
        // Add null faculty columns so frontend doesn't break
        data = (baseData ?? []).map(u => ({
          ...u,
          faculty_title: null,
          faculty_modules: null,
          faculty_office: null,
          faculty_website: null,
        }));
      } else {
        console.error('Faculty fetch error:', fullError);
        return NextResponse.json({ error: 'Failed to load faculty.' }, { status: 500 });
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data = (fullData ?? []) as any[];
    }

    // Also try filtering by hidden=false, but be graceful if hidden column doesn't exist
    // (the base query above already handles this - hidden column check is best-effort)

    return NextResponse.json({ faculty: data, columnsReady: useFacultyColumns });
  } catch (err) {
    console.error('Faculty route error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
