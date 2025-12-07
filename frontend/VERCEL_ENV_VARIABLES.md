# Complete Environment Variables for Vercel Deployment

Copy and paste these into Vercel's Environment Variables section:

## ============================================
## DATABASE (Neon PostgreSQL)
## ============================================
DATABASE_URL=your-postgresql-connection-string

## ============================================
## NEXTAUTH CONFIGURATION
## ============================================
NEXTAUTH_URL=https://your-frontend.vercel.app
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production
AUTH_SECRET=your-super-secret-key-change-this-in-production

# NOTE: Generate a secure secret! Run: openssl rand -base64 32
# Use the same value for both NEXTAUTH_SECRET and AUTH_SECRET

## ============================================
## GOOGLE OAUTH
## ============================================
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

## ============================================
## BACKEND API URL
## ============================================
NEXT_PUBLIC_API_URL=https://your-backend-name.onrender.com/api

## ============================================
## CLOUDINARY (Image Storage)
## ============================================
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

## ============================================
## NOTES:
## ============================================
# 1. Replace "your-frontend.vercel.app" with your actual Vercel URL
# 2. Replace "your-backend-name.onrender.com" with your actual Render backend URL
# 3. Generate a new NEXTAUTH_SECRET and AUTH_SECRET (use same value for both)
#    Run: openssl rand -base64 32
# 4. DATABASE_URL is your Neon PostgreSQL connection string
# 5. NEXT_PUBLIC_* variables are exposed to the browser
# 6. Variables without NEXT_PUBLIC_ are server-side only

## ============================================
## GENERATING SECRETS:
## ============================================
# To generate secure secrets, run:
# openssl rand -base64 32
#
# Use the same value for both NEXTAUTH_SECRET and AUTH_SECRET
