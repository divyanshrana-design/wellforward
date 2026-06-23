import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const cookie = req.cookies.get('wf_session')?.value;
    if (!cookie) {
      return NextResponse.json({ loggedIn: false }, { status: 200 });
    }

    let email: string;
    try {
      const payload = JSON.parse(Buffer.from(cookie, 'base64').toString('utf-8'));
      email = payload.email;
    } catch {
      return NextResponse.json({ loggedIn: false }, { status: 200 });
    }

    // Look up the user in DB
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, name, email, role, photo_url, intake_year, programme, school, hometown, bio, interests, looking_for, linkedin, instagram, contact_email')
      .eq('email', email)
      .eq('verified', true)
      .single();

    if (error || !user) {
      return NextResponse.json({ loggedIn: false }, { status: 200 });
    }

    return NextResponse.json({ loggedIn: true, user });
  } catch (err) {
    console.error('me error:', err);
    return NextResponse.json({ loggedIn: false }, { status: 200 });
  }
}

// Logout
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set('wf_session', '', { maxAge: 0, path: '/' });
  return response;
}
