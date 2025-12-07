# Google OAuth Production Configuration

## Production Domain
**Frontend:** `https://vote-hub-ph-frontend.vercel.app`

## Google Cloud Console Configuration

### Step 1: Go to Google Cloud Console
1. Visit: https://console.cloud.google.com
2. Select your project
3. Navigate to: **APIs & Services** → **Credentials**
4. Click on your OAuth 2.0 Client ID

### Step 2: Add Authorized Redirect URIs

**Add this URL:**
```
https://vote-hub-ph-frontend.vercel.app/api/auth/callback/google
```

**Keep localhost for development:**
```
http://localhost:3000/api/auth/callback/google
```

### Step 3: Add Authorized JavaScript Origins

**Add these URLs:**
```
http://localhost:3000
https://vote-hub-ph-frontend.vercel.app
```

### Step 4: Save Changes
Click **Save** and wait a few minutes for changes to propagate.

## Complete List for Google Cloud Console

### Authorized redirect URIs:
```
http://localhost:3000/api/auth/callback/google
https://vote-hub-ph-frontend.vercel.app/api/auth/callback/google
```

### Authorized JavaScript origins:
```
http://localhost:3000
https://vote-hub-ph-frontend.vercel.app
```

## Important Notes

1. ✅ Use **HTTPS** for production (not HTTP)
2. ✅ No trailing slashes (`/` at the end)
3. ✅ Exact match - must be exactly as shown
4. ✅ Save changes after adding
5. ✅ Wait 2-5 minutes for changes to take effect

## Testing

After updating:
1. Wait 2-5 minutes
2. Go to: https://vote-hub-ph-frontend.vercel.app/login
3. Click "Sign in with Google"
4. Should redirect properly

## If You Get Custom Domain Later

If you add a custom domain (e.g., `votehubph.com`), also add:
```
https://votehubph.com/api/auth/callback/google
https://votehubph.com
```

