# VoteHubPH Frontend

Next.js 14 frontend application for VoteHubPH.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Radix UI (shadcn/ui)
- NextAuth.js
- PostgreSQL (Neon) via Prisma
- Cloudinary

## Prerequisites

- Node.js 18+
- pnpm (recommended)
- PostgreSQL database (Neon)

## Quick Start

```bash
pnpm install
cp .env.example .env.local
# Configure .env.local
pnpm db:generate
pnpm db:push
pnpm dev
```

## Environment Variables

Required in `.env.local`:

- `DATABASE_URL` - Neon PostgreSQL connection string
- `NEXTAUTH_SECRET` - Random secret for NextAuth
- `NEXTAUTH_URL` - Your app URL (http://localhost:3000 for dev)
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:push` - Push schema to database
- `pnpm db:studio` - Open Prisma Studio

## Deployment

Deploy to Vercel and configure environment variables in the dashboard.

## License

MIT License
