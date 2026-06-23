import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { isAdminRequest, ADMIN_EMAIL } from '@/lib/admin';

export const dynamic = 'force-dynamic';

// Avatars live in the "Avatars" storage bucket. The stored photo_url is the
// public URL ending in the object's filename, e.g.
//   https://<proj>.supabase.co/storage/v1/object/public/Avatars/169...-divyansh.rana.jpg
// We extract the trailing filename so we can also delete the file on profile
// removal and not leave orphaned images behind.
function avatarFileNameFromUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const marker = '/Avatars/';
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  const name = url.slice(idx + marker.length).split('?')[0];
  return name || null;
}

// Fields the moderator is allowed to edit on someone else's profile.
const EDITABLE_FIELDS = [
  'name',
  'programme',
  'school',
  'intake_year',
  'hometown',
  'bio',
  'interests',
  'looking_for',
  'linkedin',
  'instagram',
  'contact_email',
  'role',
] as const;

// DELETE a profile entirely (the user row + their avatar file).
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: 'Not authorised.' }, { status: 403 });
  }

  const { id } = params;

  // Look up the row first so we know the email (to protect the master) and the
  // photo (to clean up storage).
  const { data: target, error: lookupErr } = await supabaseAdmin
    .from('users')
    .select('id, email, photo_url')
    .eq('id', id)
    .maybeSingle();

  if (lookupErr) {
    console.error('admin delete lookup error:', lookupErr);
    return NextResponse.json({ error: 'Could not find that profile.' }, { status: 500 });
  }
  if (!target) {
    return NextResponse.json({ error: 'Profile not found.' }, { status: 404 });
  }

  // Safety: the master account can never delete itself from the dashboard.
  if (target.email && target.email.toLowerCase() === ADMIN_EMAIL) {
    return NextResponse.json(
      { error: 'You cannot delete the master account.' },
      { status: 400 }
    );
  }

  // Remove the avatar file (best-effort; non-fatal).
  const fileName = avatarFileNameFromUrl(target.photo_url);
  if (fileName) {
    const { error: rmErr } = await supabaseAdmin.storage.from('Avatars').remove([fileName]);
    if (rmErr) console.warn('avatar delete failed (non-fatal):', rmErr.message);
  }

  const { error: delErr } = await supabaseAdmin.from('users').delete().eq('id', id);
  if (delErr) {
    console.error('admin delete error:', delErr);
    return NextResponse.json({ error: 'Failed to delete profile.' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// PATCH a profile: hide/unhide or edit allowed fields.
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: 'Not authorised.' }, { status: 403 });
  }

  const { id } = params;
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { data: target, error: lookupErr } = await supabaseAdmin
    .from('users')
    .select('id, email')
    .eq('id', id)
    .maybeSingle();

  if (lookupErr || !target) {
    return NextResponse.json({ error: 'Profile not found.' }, { status: 404 });
  }

  const isMaster = target.email && target.email.toLowerCase() === ADMIN_EMAIL;

  const update: Record<string, unknown> = {};

  // Hide / unhide (cannot hide the master account).
  if (typeof body.hidden === 'boolean') {
    if (isMaster && body.hidden === true) {
      return NextResponse.json(
        { error: 'You cannot hide the master account.' },
        { status: 400 }
      );
    }
    update.hidden = body.hidden;
  }

  // Editable text fields.
  for (const field of EDITABLE_FIELDS) {
    if (field in body) {
      const val = body[field];
      if (val === null || typeof val === 'string') {
        update[field] = val;
      }
    }
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'Nothing to update.' }, { status: 400 });
  }

  const selCols =
    'id, name, email, role, programme, school, intake_year, hometown, bio, interests, looking_for, photo_url, linkedin, instagram, contact_email, verified, created_at';

  const { data: updated, error: updErr } = await supabaseAdmin
    .from('users')
    .update(update)
    .eq('id', id)
    .select(`${selCols}, hidden`)
    .single();

  if (updErr) {
    // The moderation `hidden` column may not have been added to the DB yet.
    if (/hidden/i.test(updErr.message || '')) {
      // If the only thing being changed was visibility, we genuinely can't do
      // it without the column — surface a clear, actionable error.
      if ('hidden' in update) {
        return NextResponse.json(
          {
            error:
              'Hide/unhide needs a one-time database update. Run this in Supabase SQL Editor: ' +
              'ALTER TABLE users ADD COLUMN IF NOT EXISTS hidden BOOLEAN NOT NULL DEFAULT FALSE;',
            needsMigration: true,
          },
          { status: 409 }
        );
      }
      // Otherwise it was an edit — retry without selecting the hidden column.
      const retry = await supabaseAdmin
        .from('users')
        .update(update)
        .eq('id', id)
        .select(selCols)
        .single();
      if (!retry.error) {
        return NextResponse.json({ success: true, profile: { ...retry.data, hidden: false } });
      }
      console.error('admin patch error (retry):', retry.error);
      return NextResponse.json({ error: 'Failed to update profile.' }, { status: 500 });
    }
    console.error('admin patch error:', updErr);
    return NextResponse.json({ error: 'Failed to update profile.' }, { status: 500 });
  }

  return NextResponse.json({ success: true, profile: updated });
}
