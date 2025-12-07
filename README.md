# VoteHubPH

**Your Voice Shapes the Future**

VoteHubPH is a comprehensive voting platform designed to empower Filipino citizens with transparent candidate information, community insights, and real-time engagement across all levels of Philippine government.

## Features

- **Candidate Profiles** - Browse detailed candidate information across all government levels (National, Regional, Provincial, City/Municipal, Barangay)
- **Location-Based Filtering** - Find candidates by region, province, city, district, and barangay
- **Community Engagement** - Vote, comment, and discuss candidates with other users
- **User Authentication** - Secure login via Email OTP verification or Google OAuth
- **Post Creation** - Users can submit candidate information for community review
- **Admin Moderation** - Review and approve/reject user-submitted posts
- **Party List Directory** - Browse registered party lists and their members
- **Real-time Updates** - Stay informed with the latest candidate information

## Repository Structure

```
VoteHubPH/
├── frontend/          # Next.js 14 web application
│   ├── app/          # App Router pages and API routes
│   ├── components/   # React components (shadcn/ui)
│   ├── lib/          # Utilities and configurations
│   └── prisma/       # Database schema
│
├── backend/           # Laravel 11 REST API
│   ├── app/          # Controllers, Models, Services
│   ├── database/     # Migrations and seeders
│   ├── routes/       # API route definitions
│   └── config/       # Configuration files
│
└── admin/             # Admin panel (Next.js)
    └── app/          # Admin dashboard pages
```

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI (shadcn/ui)
- **Authentication**: NextAuth.js (Google OAuth, Email OTP)
- **Database ORM**: Prisma
- **Image Storage**: Cloudinary

### Backend
- **Framework**: Laravel 11
- **Language**: PHP 8.2+
- **Database**: PostgreSQL (Neon)
- **Image Storage**: Cloudinary
- **Email Service**: SMTP (Gmail)

## Quick Start

### Prerequisites
- Node.js 18+
- PHP 8.2+
- Composer
- pnpm (recommended)
- PostgreSQL database

### Frontend Setup

```bash
cd frontend
pnpm install
cp .env.example .env.local
# Configure .env.local with your credentials
pnpm db:generate
pnpm db:push
pnpm dev
```

Frontend runs at `http://localhost:3000`

### Backend Setup

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
# Configure .env with your credentials
php artisan migrate
php artisan db:seed --class=PhilippineLocationsSeeder
php artisan serve
```

Backend API runs at `http://localhost:8000`

## Environment Variables

### Frontend (.env.local)
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Random secret for sessions
- `NEXTAUTH_URL` - App URL
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - Google OAuth
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `CLOUDINARY_*` - Image upload credentials

### Backend (.env)
- `APP_KEY` - Laravel app key
- `DB_*` - Database credentials
- `CLOUDINARY_*` - Image upload credentials
- `MAIL_*` - SMTP email configuration

## Deployment

- **Frontend**: Vercel (recommended)
- **Backend**: Render / Railway
- **Database**: Neon PostgreSQL

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**VoteHubPH** - Empowering informed voting decisions across the Philippines
