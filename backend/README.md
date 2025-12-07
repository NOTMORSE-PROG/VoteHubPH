# VoteHubPH Backend API

Laravel 11 REST API backend for VoteHubPH.

## Tech Stack

- Laravel 11
- PHP 8.2+
- PostgreSQL (Neon)
- Cloudinary
- SMTP (Gmail)

## Prerequisites

- PHP 8.2+
- Composer
- PostgreSQL

## Quick Start

```bash
composer install
cp .env.example .env
php artisan key:generate
# Configure .env
php artisan migrate
php artisan db:seed --class=PhilippineLocationsSeeder
php artisan serve
```

## Environment Variables

Required in `.env`:

- `APP_KEY` - Laravel application key (generated)
- `APP_URL` - Your API URL
- `DB_CONNECTION=pgsql`
- `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `MAIL_MAILER`, `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`

## API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP
- `POST /api/auth/verify-otp` - Verify OTP

### Posts
- `GET /api/posts/approved` - Get approved posts
- `GET /api/posts/{id}` - Get post details
- `POST /api/posts` - Create post
- `PUT /api/posts/{id}` - Update post

### Interactions
- `POST /api/posts/{id}/vote` - Vote
- `POST /api/posts/{id}/comments` - Comment
- `POST /api/comments/{id}/like` - Like comment

### Locations
- `GET /api/locations/regions`
- `GET /api/locations/cities`
- `GET /api/locations/districts`
- `GET /api/locations/barangays`

## Deployment

Deploy to Render/Railway with environment variables configured.

## License

MIT License
