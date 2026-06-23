This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Moderator / Master account

There is a single master/moderator account, locked to one email at the code
level. Only that account can access the moderation dashboard.

- **Master email**: set via the `ADMIN_EMAIL` env var (defaults to
  `divyansh.rana@ucdconnect.ie`). Only this exact, signed-in email is allowed.
- **Dashboard**: `/admin` (an "Admin" button also appears in the navbar, but
  only for the master account). Lists every profile with search + role filter.
- **Moderation actions** per profile:
  - **Edit** any field (name, programme, bio, links, role, etc.)
  - **Hide / unhide** - hides a profile from the public Meet people / Ask a
    senior lists without deleting it.
  - **Delete** - permanently removes the user row and their avatar file.
- **Safety**: the master account cannot hide or delete itself.
- **Security**: every `/api/admin/*` endpoint re-checks the session email
  server-side, so the dashboard and endpoints are useless to anyone else even
  if they find the URLs.

### One-time DB setup for Hide/unhide

Hide/unhide needs a `hidden` column on the `users` table. Run this once in
**Supabase → SQL Editor** (it is also in `supabase/schema.sql`):

```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS hidden BOOLEAN NOT NULL DEFAULT FALSE;
```

Edit and Delete work without this; only Hide/unhide requires it. In production,
also set `ADMIN_EMAIL` in your Vercel environment variables.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
