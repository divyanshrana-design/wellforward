import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { isAdminRequest } from '@/lib/admin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// List EVERY profile on the site (students + seniors, including hidden ones).
// Master/moderator only.
export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: 'Not authorised.' }, { status: 403 });
  }

  const baseCols =
    'id, name, email, role, programme, school, intake_year, hometown, bio, interests, looking_for, photo_url, linkedin, instagram, contact_email, verified, created_at';

  let { data, error } = await supabaseAdmin
    .from('users')
    .select(`${baseCols}, hidden`)
    .order('created_at', { ascending: false });

  // Fallback if the moderation `hidden` column hasn't been added yet — return
  // profiles with hidden defaulted to false so the dashboard still works.
  if (error && /hidden/i.test(error.message || '')) {
    const retry = await supabaseAdmin
      .from('users')
      .select(baseCols)
      .order('created_at', { ascending: false });
    error = retry.error;
    data = (retry.data ?? []).map((u) => ({ ...u, hidden: false }));
  }

  if (error) {
    console.error('admin profiles fetch error:', error);
    return NextResponse.json({ error: 'Failed to load profiles.' }, { status: 500 });
  }

  return NextResponse.json({ profiles: data ?? [] });
}
