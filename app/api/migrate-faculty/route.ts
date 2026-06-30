import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// One-time migration endpoint to add faculty columns.
// Call: GET /api/migrate-faculty
// This endpoint is idempotent — safe to call multiple times.
export async function GET() {
  // Check if columns already exist
  const { error: checkError } = await supabaseAdmin
    .from('users')
    .select('faculty_title')
    .limit(1);

  if (!checkError) {
    return NextResponse.json({ status: 'already_done', message: 'Faculty columns already exist.' });
  }

  // Columns are missing - provide the SQL that needs to be run in Supabase Dashboard
  return NextResponse.json({
    status: 'migration_needed',
    message: 'Faculty columns are missing. Run the SQL below in Supabase Dashboard → SQL Editor.',
    sql: [
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS faculty_title   TEXT;',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS faculty_modules TEXT;',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS faculty_office  TEXT;',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS faculty_website TEXT;',
    ].join('\n'),
    supabase_dashboard_url: 'https://supabase.com/dashboard/project/lhvoqiipxpzdgwbfbfop/editor',
  });
}
