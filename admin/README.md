# VoteHubPH Admin

The VoteHubPH admin application is a Next.js moderation dashboard for reviewing candidate submissions, verifying or flagging records, handling user reports, moderating comments, and managing party-list membership.

This component is maintained inside the canonical `https://github.com/NOTMORSE-PROG/VoteHubPH` repository at `admin/`. It communicates with the Laravel API in `../backend/`.

## Local Setup

Prerequisites:

- Node.js 18+
- pnpm 10+
- The VoteHubPH Laravel backend running locally or at an explicitly configured URL
- A valid administrator account provided by the backend

```bash
git clone https://github.com/NOTMORSE-PROG/VoteHubPH.git
cd VoteHubPH/admin
pnpm install
```

Create an ignored `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

Start the dashboard:

```bash
pnpm dev
```

Open `http://localhost:3001`. The login page sends credentials to the backend, and subsequent moderation requests use the token returned by that API. Do not hard-code or commit administrator credentials.

## Commands

| Command | Purpose |
|---|---|
| `pnpm dev` | Start the development server on port 3001 |
| `pnpm build` | Create a production build |
| `pnpm start` | Start the production build on port 3001 |
| `pnpm lint` | Run the configured Next.js lint command |

## Main Areas

| Path | Responsibility |
|---|---|
| `app/login/` | Administrator sign-in |
| `app/page.tsx` | Submission, report, comment, verification, and party-list moderation dashboard |
| `next.config.mjs` | Next.js configuration |

## Environment Variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the Laravel API, including `/api` |
| `NEXT_PUBLIC_FRONTEND_URL` | Base URL of the public VoteHubPH frontend |

## Deployment Status

No active production deployment was found for VoteHubPH during the consolidation audit. Publishing the admin application is a separate rollout task. A future deployment should use `admin/` as its root directory and must be tested against the intended backend before a public URL is documented.

Return to the [project README](../README.md), [frontend guide](../frontend/README.md), or [backend guide](../backend/README.md) for the rest of the system.
