# VoteHubPH 🇵🇭

**Your Voice Shapes the Future**

VoteHubPH is a comprehensive voting platform designed to empower Filipino citizens with transparent candidate information, community insights, and real-time engagement across all levels of Philippine government.

## 📦 Repository Structure

This repository contains both the frontend and backend applications:

- **Frontend**: Next.js 14 application ([`frontend/`](./frontend/))
- **Backend**: Laravel 11 API ([`backend/`](./backend/))

For production deployments, these are maintained as separate repositories:
- Frontend: https://github.com/NOTMORSE-PROG/VoteHubPH_Frontend
- Backend: https://github.com/NOTMORSE-PROG/VoteHubPH_Backend

## 🚀 Quick Start

### Frontend Setup

See [frontend/README.md](./frontend/README.md) and [frontend/SETUP.md](./frontend/SETUP.md) for detailed instructions.

```bash
cd frontend
pnpm install
cp .env.example .env.local
# Configure .env.local with your credentials
pnpm db:generate
pnpm db:push
pnpm dev
```

### Backend Setup

See [backend/README.md](./backend/README.md) and [backend/SETUP.md](./backend/SETUP.md) for detailed instructions.

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

## 🛠️ Tech Stack

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

## 📚 Documentation

- [Frontend README](./frontend/README.md)
- [Frontend Setup Guide](./frontend/SETUP.md)
- [Backend README](./backend/README.md)
- [Backend Setup Guide](./backend/SETUP.md)

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**VoteHubPH** - Empowering informed voting decisions across the Philippines 🇵🇭
