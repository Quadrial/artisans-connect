# 🔗 Frontend-Backend Connection Guide

## Overview

Your CraftConnect application now has a fully integrated frontend and backend!

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│                  http://localhost:5173                   │
│                                                          │
│  ┌──────────────┐      ┌─────────────────────────┐    │
│  │   Pages      │──────│  Auth Service           │    │
│  │ - Login      │      │  - login()              │    │
│  │ - Register   │      │  - register()           │    │
│  │ - Dashboard  │      │  - logout()             │    │
│  │ - Profile    │      │  - verifyToken()        │    │
│  └──────────────┘      └─────────────────────────┘    │
│                                 │                        │
│                                 │ HTTP Requests          │
│                                 │ (fetch API)            │
└─────────────────────────────────┼────────────────────────┘
                                  │
                                  │ JSON
                                  │
┌─────────────────────────────────┼────────────────────────┐
│                                 ▼                        │
│                    BACKEND (Express.js)                  │
│                  http://localhost:5000                   │
│                                                          │
│  ┌──────────────┐      ┌─────────────────────────┐    │
│  │   Routes     │──────│  Controllers            │    │
│  │ /auth/login  │      │  - register()           │    │
│  │ /auth/register      │  - login()              │    │
│  │ /auth/me     │      │  - getMe()              │    │
│  │ /auth/logout │      │  - logout()             │    │
│  └──────────────┘      └─────────────────────────┘    │
│                                 │                        │
│                                 │                        │
│                                 ▼                        │
│                    ┌─────────────────────┐              │
│                    │   MongoDB Atlas     │              │
│                    │   (Database)        │              │
│                    └─────────────────────┘              │
└─────────────────────────────────────────────────────────┘
```

---

## How It Works

### 1. User Registration Flow

```
User fills form → Frontend validates → POST /api/auth/register
                                              ↓
                                    Backend validates data
                                              ↓
                                    Hash password (bcrypt)
                                              ↓
                                    Save to MongoDB
                                              ↓
                                    Generate JWT token
                                              ↓
Frontend receives ← JSON response ← Return token + user data
        ↓
Store token in localStorage
        ↓
Redirect to dashboard
```

### 2. User Login Flow

```
User enters credentials → Frontend validates → POST /api/auth/login
                                                      ↓
                                            Find user in MongoDB
                                                      ↓
                                            Compare passwords
                                                      ↓
                                            Generate JWT token
                                                      ↓
Frontend receives ← JSON response ← Return token + user data
        ↓
Store token in localStorage
        ↓
Redirect to dashboard
```

### 3. Protected Route Access

```
User visits /dashboard → Frontend checks token → GET /api/auth/me
                                                        ↓
                                              Verify JWT token
                                                        ↓
                                              Find user in MongoDB
                                                        ↓
Frontend receives ← JSON response ← Return user data
        ↓
Render dashboard with user info
```

---

## Files Modified/Created

### Frontend Files

```
src/
├── config/
│   └── api.ts                    # ✨ NEW - API endpoints configuration
├── services/
│   └── authService.ts            # ✅ UPDATED - Real API calls
├── pages/
│   ├── login.tsx                 # ✅ Uses authService
│   ├── register.tsx              # ✅ Uses authService
│   ├── dashboard.tsx             # ✅ Protected route
│   └── profile.tsx               # ✅ Protected route
├── hooks/
│   └── useAuth.ts                # ✅ Uses authService
└── components/
    └── ProtectedRoute.tsx        # ✅ Checks authentication

.env.local                        # ✨ NEW - Frontend environment variables
```

### Backend Files

```
backend/
├── config/
│   └── database.js               # MongoDB connection
├── controllers/
│   └── authController.js         # Authentication logic
├── models/
│   └── User.js                   # User schema
├── routes/
│   └── authRoutes.js             # API routes
├── middleware/
│   ├── auth.js                   # JWT verification
│   └── errorHandler.js           # Error handling
├── utils/
│   └── generateToken.js          # JWT token generation
├── .env                          # Backend environment variables
└── server.js                     # Express server

# Helper files
├── START-HERE.md                 # Quick start guide
├── test-endpoints.md             # API documentation
└── test-api.ps1                  # Automated testing script
```

---

## API Integration Details

### Authentication Service (`src/services/authService.ts`)

**Key Methods:**

1. **`login(email, password)`**
   - Sends POST request to `/api/auth/login`
   - Stores token and user data in localStorage
   - Returns user object

2. **`register(username, email, password, role)`**
   - Sends POST request to `/api/auth/register`
   - Stores token and user data in localStorage
   - Returns user object

3. **`logout()`**
   - Sends POST request to `/api/auth/logout`
   - Clears localStorage
   - Removes authentication

4. **`verifyToken()`**
   - Sends GET request to `/api/auth/me`
   - Validates stored token
   - Returns current user or null

### API Configuration (`src/config/api.ts`)

```typescript
const API_BASE_URL = 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    ME: `${API_BASE_URL}/auth/me`,
  },
};
```

---

## Request/Response Examples

### Register Request

```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "john_carpenter",
  "email": "john@example.com",
  "password": "password123",
  "role": "artisan"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "674b1234567890abcdef1234",
    "username": "john_carpenter",
    "email": "john@example.com",
    "role": "artisan"
  }
}
```

### Login Request

```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "674b1234567890abcdef1234",
    "username": "john_carpenter",
    "email": "john@example.com",
    "role": "artisan"
  }
}
```

### Get Current User Request

```http
GET http://localhost:5000/api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "674b1234567890abcdef1234",
    "username": "john_carpenter",
    "email": "john@example.com",
    "role": "artisan",
    "profile": {},
    "isVerified": false,
    "isActive": true,
    "createdAt": "2024-11-30T...",
    "updatedAt": "2024-11-30T..."
  }
}
```

---

## Security Features

### Frontend Security

1. **Token Storage**
   - JWT token stored in localStorage
   - Automatically included in protected requests

2. **Protected Routes**
   - `ProtectedRoute` component checks authentication
   - Redirects to login if not authenticated

3. **Token Verification**
   - Validates token on app load
   - Clears invalid tokens automatically

### Backend Security

1. **Password Hashing**
   - bcryptjs with salt rounds
   - Passwords never stored in plain text

2. **JWT Authentication**
   - Secure token generation
   - Token expiration (7 days default)
   - Token verification middleware

3. **Input Validation**
   - express-validator for request validation
   - Sanitization of user inputs

4. **CORS Protection**
   - Configured for localhost:5173
   - Prevents unauthorized origins

---

## Testing the Connection

### Quick Test

1. **Start both servers:**
   ```powershell
   .\start-dev.ps1
   ```

2. **Open browser:**
   ```
   http://localhost:5173
   ```

3. **Register a new account:**
   - Click "Get Started"
   - Fill in the form
   - Submit

4. **Check backend terminal:**
   - Should see POST request to `/api/auth/register`
   - Should show successful registration

5. **Check browser:**
   - Should redirect to dashboard
   - Should show user info

### Detailed Test

1. **Open Browser DevTools (F12)**

2. **Go to Network tab**

3. **Try to register:**
   - Watch for POST request to `localhost:5000/api/auth/register`
   - Check response status (should be 201)
   - Check response body (should have token and user)

4. **Go to Application tab → Local Storage**
   - Should see `craft_connect_token`
   - Should see `craft_connect_user`

5. **Try to access dashboard:**
   - Should make GET request to `/api/auth/me`
   - Should verify token
   - Should load user data

---

## Troubleshooting

### Connection Issues

**Problem:** "Network error" when trying to login/register

**Solutions:**
1. Check backend is running: `http://localhost:5000/api/health`
2. Check frontend `.env.local` has correct API URL
3. Check backend `.env` has correct CLIENT_URL
4. Restart both servers

### CORS Errors

**Problem:** CORS policy blocking requests

**Solutions:**
1. Verify backend `CLIENT_URL=http://localhost:5173` in `.env`
2. Restart backend server
3. Clear browser cache
4. Check backend CORS configuration in `server.js`

### Authentication Not Working

**Problem:** Can't login or register

**Solutions:**
1. Check MongoDB connection in backend
2. Verify JWT_SECRET is set in backend `.env`
3. Check browser console for errors
4. Check backend terminal for errors
5. Clear localStorage and try again

---

## Next Steps

Now that frontend and backend are connected:

1. ✅ Test registration and login
2. ✅ Test protected routes
3. ✅ Test logout functionality
4. 🔄 Add profile update functionality
5. 🔄 Add artisan search functionality
6. 🔄 Add job posting functionality
7. 🔄 Add messaging functionality

---

## Success Indicators

Your connection is working if:

- ✅ Can register new users
- ✅ Can login with credentials
- ✅ Token is stored in localStorage
- ✅ Dashboard loads after login
- ✅ Profile page is accessible
- ✅ Logout works correctly
- ✅ Protected routes redirect when not authenticated
- ✅ Backend logs show API requests
- ✅ MongoDB shows new user documents

**If all checked, your full-stack app is working! 🎉**
