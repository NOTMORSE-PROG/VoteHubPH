# VoteHubPH

A comprehensive voting platform designed to empower Filipino citizens with transparent candidate information, community insights, and real-time engagement across all levels of Philippine government.

## Repository Structure

This repository contains three applications:

- **frontend/** - Next.js 14 application
- **backend/** - Laravel 11 API
- **admin/** - Admin panel (Next.js)

## Quick Start

### Frontend

```bash
cd frontend
pnpm install
cp .env.example .env.local
# Configure .env.local with your credentials
pnpm db:generate
pnpm db:push
pnpm dev
```

### Backend

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

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- NextAuth.js
- Prisma
- Cloudinary

### Backend
- Laravel 11
- PHP 8.2+
- PostgreSQL (Neon)
- Cloudinary
- SMTP (Gmail)

## License

MIT License
