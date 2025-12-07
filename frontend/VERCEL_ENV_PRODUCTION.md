# Production Environment Variables for Vercel

## Replace these values in Vercel:

### 1. NEXTAUTH_URL
```
NEXTAUTH_URL=https://your-app.vercel.app
```

### 2. NEXT_PUBLIC_API_URL
```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
```

### 3. NEXTAUTH_SECRET & AUTH_SECRET
```
NEXTAUTH_SECRET=your-generated-secret-here
AUTH_SECRET=your-generated-secret-here
```
(Use the same value for both - generate with: openssl rand -base64 32)

## Complete List for Vercel:

```
DATABASE_URL=your-postgresql-connection-string

NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-generated-secret-here
AUTH_SECRET=your-generated-secret-here

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```
