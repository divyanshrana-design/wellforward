import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/admin';

export const dynamic = 'force-dynamic';

// Tells the frontend whether the current session is the master/moderator
// account. Used to gate the /admin page and show/hide the Admin nav link.
export async function GET(req: NextRequest) {
  return NextResponse.json({ isAdmin: isAdminRequest(req) });
}
