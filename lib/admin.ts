import { NextRequest } from 'next/server';

/**
 * The single master/moderator account. Locked to one specific UCD email.
 *
 * Only this email can access the admin dashboard and moderation endpoints.
 * It is checked server-side on every admin request against the signed-in
 * session, so nobody else can moderate the site even if they discover the
 * /admin URL or the /api/admin/* endpoints.
 *
 * Can be overridden in production via the ADMIN_EMAIL env var, but defaults
 * to the owner's email so it works out of the box.
 */
export const ADMIN_EMAIL = (
  process.env.ADMIN_EMAIL || 'divyansh.rana@ucdconnect.ie'
).toLowerCase();

/**
 * Reads the wf_session cookie and returns the signed-in email (lowercased),
 * or null if there is no valid session. Mirrors the decoding done in
 * app/api/me/route.ts.
 */
export function getSessionEmail(req: NextRequest): string | null {
  const cookie = req.cookies.get('wf_session')?.value;
  if (!cookie) return null;
  try {
    const payload = JSON.parse(Buffer.from(cookie, 'base64').toString('utf-8'));
    if (payload && typeof payload.email === 'string') {
      return payload.email.toLowerCase();
    }
  } catch {
    // fall through
  }
  return null;
}

/**
 * Returns true only if the request is authenticated as the master account.
 */
export function isAdminRequest(req: NextRequest): boolean {
  const email = getSessionEmail(req);
  return email !== null && email === ADMIN_EMAIL;
}
