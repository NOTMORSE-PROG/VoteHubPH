# Admin Authentication Setup

## Backend Setup

### 1. Run Migration
After deploying to Render, the migration will run automatically. Or manually:
```bash
php artisan migrate
```

### 2. Create Admin User
Run this command to create the admin user:
```bash
php artisan admin:create --email=admin@votehubph --password=admin
```

Or use default values:
```bash
php artisan admin:create
```

This will create:
- **Email**: `admin@votehubph`
- **Password**: `admin`

## Frontend (Admin Dashboard) Setup

### Environment Variables for Vercel:
```
NEXT_PUBLIC_API_URL=https://votehubph-backend.onrender.com/api
NEXT_PUBLIC_FRONTEND_URL=https://vote-hub-ph-frontend.vercel.app
```

## How It Works

1. **Admin Login**: Admin logs in at `/login` with email and password
2. **Authentication**: Backend verifies credentials and checks `is_admin` flag
3. **Session**: Admin user ID is stored in localStorage
4. **Protected Routes**: All admin API routes require `X-User-Id` header
5. **Middleware**: `AdminAuth` middleware checks if user is admin

## Security Notes

- Change the default password after first login!
- The admin password is stored hashed in the database
- Only users with `is_admin = true` can access admin routes
- Admin routes are protected by middleware

## Backend Routes

- `POST /api/admin/login` - Admin login (public)
- `GET /api/admin/posts` - Get all posts (protected)
- `POST /api/admin/posts/{id}/approve` - Approve post (protected)
- `POST /api/admin/posts/{id}/reject` - Reject post (protected)
- All other `/api/admin/*` routes are protected

