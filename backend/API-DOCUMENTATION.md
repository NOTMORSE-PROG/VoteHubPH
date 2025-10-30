# VoteHubPH API Documentation

Base URL: `http://localhost:8000/api`

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer {token}
```

---

## Public Endpoints

### 1. Register User

**POST** `/register`

Register a new user with email and password.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "language": "en"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "c1234567890abcdef",
    "name": "John Doe",
    "email": "john@example.com",
    "provider": "credentials",
    "language": "en",
    "profile_completed": false
  },
  "token": "1|abc123xyz..."
}
```

---

### 2. Login

**POST** `/login`

Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "c1234567890abcdef",
    "name": "John Doe",
    "email": "john@example.com",
    "provider": "credentials",
    "language": "en",
    "profile_completed": true,
    "region": "NCR",
    "city": "Manila",
    "barangay": "Ermita"
  },
  "token": "2|def456uvw..."
}
```

**Error (401):**
```json
{
  "message": "Invalid credentials"
}
```

---

### 3. Google OAuth Callback

**POST** `/auth/google`

Authenticate or register user via Google OAuth.

**Request Body:**
```json
{
  "email": "john@gmail.com",
  "name": "John Doe",
  "google_id": "1234567890",
  "image": "https://lh3.googleusercontent.com/..."
}
```

**Response (200):**
```json
{
  "message": "Google authentication successful",
  "user": {
    "id": "c9876543210fedcba",
    "name": "John Doe",
    "email": "john@gmail.com",
    "image": "https://lh3.googleusercontent.com/...",
    "provider": "google",
    "provider_id": "1234567890",
    "language": "en",
    "profile_completed": false
  },
  "token": "3|ghi789rst..."
}
```

---

## Protected Endpoints

All endpoints below require authentication via Bearer token.

### 4. Get User Profile

**GET** `/user/profile`

Get the authenticated user's profile.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": "c1234567890abcdef",
  "email": "john@example.com",
  "name": "John Doe",
  "image": null,
  "provider": "credentials",
  "language": "en",
  "profileCompleted": true,
  "location": {
    "region": "NCR",
    "city": "Manila",
    "barangay": "Ermita"
  },
  "createdAt": "2025-10-27T12:00:00.000000Z",
  "lastLoginAt": "2025-10-27T14:30:00.000000Z"
}
```

---

### 5. Complete Profile

**POST** `/user/complete-profile`

Complete user profile by adding location information.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "region": "NCR",
  "city": "Manila",
  "barangay": "Ermita"
}
```

**Response (200):**
```json
{
  "message": "Profile completed successfully",
  "user": {
    "id": "c1234567890abcdef",
    "email": "john@example.com",
    "name": "John Doe",
    "image": null,
    "provider": "credentials",
    "language": "en",
    "profileCompleted": true,
    "location": {
      "region": "NCR",
      "city": "Manila",
      "barangay": "Ermita"
    }
  }
}
```

**Error (422):**
```json
{
  "errors": {
    "region": ["The region field is required."],
    "city": ["The city field is required."],
    "barangay": ["The barangay field is required."]
  }
}
```

---

### 6. Update Profile

**PUT** `/user/update`

Update user information (name, language, location).

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "John Michael Doe",
  "language": "tl",
  "region": "Region III",
  "city": "Angeles City",
  "barangay": "Balibago"
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "c1234567890abcdef",
    "email": "john@example.com",
    "name": "John Michael Doe",
    "image": null,
    "provider": "credentials",
    "language": "tl",
    "profileCompleted": true,
    "location": {
      "region": "Region III",
      "city": "Angeles City",
      "barangay": "Balibago"
    }
  }
}
```

---

### 7. Logout

**POST** `/logout`

Logout and revoke the current access token.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "message": "Unauthenticated."
}
```

### 422 Validation Error
```json
{
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password must be at least 8 characters."]
  }
}
```

### 500 Server Error
```json
{
  "message": "Server Error",
  "error": "Detailed error message..."
}
```

---

## Testing the API

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123","password_confirmation":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

**Get Profile:**
```bash
curl -X GET http://localhost:8000/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman

1. Create a new collection for VoteHubPH API
2. Set base URL: `http://localhost:8000/api`
3. For protected routes:
   - Go to Authorization tab
   - Select "Bearer Token"
   - Paste your token

---

## Frontend Integration

### Example: Login with Fetch API

```javascript
const login = async (email, password) => {
  const response = await fetch('http://localhost:8000/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (response.ok) {
    // Store token in localStorage
    localStorage.setItem('auth_token', data.token);
    return data.user;
  } else {
    throw new Error(data.message);
  }
};
```

### Example: Get Profile with Token

```javascript
const getProfile = async () => {
  const token = localStorage.getItem('auth_token');

  const response = await fetch('http://localhost:8000/api/user/profile', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw new Error('Failed to fetch profile');
  }
};
```

---

## Database

All data is stored in the shared Neon PostgreSQL database:
- **Host:** ep-spring-violet-ad9ylfx2-pooler.c-2.us-east-1.aws.neon.tech
- **Database:** neondb

Tables:
- `users` - User accounts
- `accounts` - OAuth provider accounts
- `sessions` - User sessions
- `votes` - User votes
- `comments` - User comments
- `personal_access_tokens` - Sanctum API tokens

---

**Next Steps:**
1. Install PostgreSQL PHP extension
2. Run migrations: `php artisan migrate:fresh`
3. Start server: `php artisan serve`
4. Test endpoints with Postman or cURL
5. Update frontend to use Laravel API
