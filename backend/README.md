# VoteHubPH - Laravel Backend

This is the Laravel 11 backend API for VoteHubPH. It connects to the same Neon PostgreSQL database as the Next.js frontend.

## Tech Stack

- **Framework**: Laravel 11
- **Language**: PHP 8.2+
- **Database**: PostgreSQL (Neon)
- **Authentication**: Laravel Sanctum (Token-based API auth)
- **ORM**: Eloquent

---

## Setup Instructions

### 1. Install PHP PostgreSQL Extension

**IMPORTANT**: Laravel requires the PostgreSQL PDO extension.

#### Windows (XAMPP/WAMP)
1. Open `php.ini` (usually `C:\xampp\php\php.ini`)
2. Uncomment (remove `;`):
   ```ini
   extension=pdo_pgsql
   extension=pgsql
   ```
3. Restart Apache

#### Verify Installation
```bash
php -m | findstr pgsql
```

### 2. Install Dependencies
```bash
composer install
```

### 3. Run Migrations
```bash
php artisan migrate:fresh
```

### 4. Start Server
```bash
php artisan serve  # http://localhost:8000
```

---

## Database Schema

All tables use string IDs (CUIDs) instead of auto-incrementing integers to match the Prisma schema.

### Key Tables
- **users** - User accounts with OAuth support and location data
- **accounts** - OAuth provider accounts
- **sessions** - User sessions
- **votes** - User votes for candidates
- **comments** - User comments on candidates

---

## API Endpoints (Planned)

- `POST /api/register` - Register new user
- `POST /api/login` - Login and get token
- `POST /api/logout` - Logout
- `GET /api/user/profile` - Get user profile
- `POST /api/user/complete-profile` - Complete profile

---

## Eloquent Models

All models configured with:
- Non-incrementing string IDs
- Proper relationships
- Laravel Sanctum integration (User model)

---

## Documentation

- [README-RESTRUCTURE.md](../README-RESTRUCTURE.md) - Architecture
- [PROJECT-STATUS.md](../PROJECT-STATUS.md) - Progress
- [WHERE-IS-MY-DATA.md](../WHERE-IS-MY-DATA.md) - Database access

---

**Status**: Backend structure complete, ready for controllers
