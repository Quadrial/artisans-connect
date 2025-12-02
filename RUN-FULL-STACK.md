# 🚀 Running CraftConnect Full Stack Application

This guide will help you run both the frontend and backend together.

## Prerequisites

- Node.js installed
- MongoDB Atlas account (or local MongoDB)
- Two terminal windows

---

## Quick Start (2 Terminals)

### Terminal 1: Backend API

```powershell
# Navigate to backend
cd backend

# Install dependencies (first time only)
npm install

# Start the backend server
npm run dev
```

**Expected Output:**
```
╔═══════════════════════════════════════╗
║   CraftConnect API Server Running    ║
║   Port: 5000                          ║
║   Environment: development            ║
╚═══════════════════════════════════════╝

✅ MongoDB Connected: cluster0.mongodb.net
📊 Database: craftconnect
```

### Terminal 2: Frontend React App

```powershell
# Navigate to project root (if in backend, go back)
cd ..

# Install dependencies (first time only)
npm install

# Start the frontend
npm run dev
```

**Expected Output:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## Access the Application

1. **Frontend:** http://localhost:5173
2. **Backend API:** http://localhost:5000
3. **API Health Check:** http://localhost:5000/api/health

---

## Testing the Connection

### Method 1: Use the Application

1. Open http://localhost:5173
2. Click "Get Started" or "Sign In"
3. Try to register a new account:
   - Username: `test_user`
   - Email: `test@example.com`
   - Password: `password123`
   - Role: Choose Artisan or Customer
4. Click "Create account"
5. If successful, you'll be redirected to the dashboard!

### Method 2: Check Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Try to login/register
4. You should see API requests to `http://localhost:5000/api/auth/...`

### Method 3: Check Network Tab

1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to login/register
4. Look for requests to `/api/auth/register` or `/api/auth/login`
5. Check the response - should show `success: true`

---

## Configuration

### Backend Configuration (`backend/.env`)

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/craftconnect
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

### Frontend Configuration (`.env.local`)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Common Issues & Solutions

### ❌ Frontend can't connect to backend

**Symptoms:**
- Login/Register shows "Network error"
- Console shows CORS errors
- Console shows "Failed to fetch"

**Solutions:**
1. Make sure backend is running on port 5000
2. Check backend console for errors
3. Verify `VITE_API_URL` in `.env.local` is correct
4. Check CORS settings in `backend/server.js`

### ❌ CORS Error

**Error:** `Access to fetch at 'http://localhost:5000/api/auth/login' from origin 'http://localhost:5173' has been blocked by CORS policy`

**Solution:**
Backend already has CORS configured. Make sure:
1. Backend `CLIENT_URL` in `.env` is `http://localhost:5173`
2. Backend server is running
3. Restart backend server after changing `.env`

### ❌ "Invalid credentials" on first login

**Solution:**
- You need to register first!
- Click "create a new account" link
- Register with your details
- Then you can login

### ❌ Backend won't start

**Solution:**
1. Check MongoDB connection string in `backend/.env`
2. Verify MongoDB Atlas is accessible
3. Check if port 5000 is already in use
4. Run `npm install` in backend folder

### ❌ Frontend won't start

**Solution:**
1. Run `npm install` in project root
2. Check if port 5173 is already in use
3. Delete `node_modules` and run `npm install` again

---

## Development Workflow

### Starting Fresh Each Day

```powershell
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd ..
npm run dev
```

### Making Changes

**Backend Changes:**
- Server auto-restarts with nodemon
- Just save your files

**Frontend Changes:**
- Vite hot-reloads automatically
- Just save your files

### Stopping the Servers

- Press `Ctrl + C` in each terminal
- Or close the terminal windows

---

## API Endpoints Available

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)
- `POST /api/auth/logout` - Logout user (requires token)

### Health Check
- `GET /api/health` - Check if API is running

---

## Testing the Full Stack

### Test Registration Flow

1. Open http://localhost:5173
2. Click "Get Started"
3. Fill in registration form:
   ```
   Username: john_artisan
   Email: john@example.com
   Password: password123
   Role: Artisan
   ```
4. Click "Create account"
5. Should redirect to dashboard
6. Check backend terminal - should see registration log

### Test Login Flow

1. Open http://localhost:5173
2. Click "Sign In"
3. Enter credentials:
   ```
   Email: john@example.com
   Password: password123
   ```
4. Click "Sign in"
5. Should redirect to dashboard
6. Check backend terminal - should see login log

### Test Protected Routes

1. Login to the application
2. Click on your profile picture/name
3. Should navigate to profile page
4. Backend verifies your token automatically

### Test Logout

1. While logged in, click logout button
2. Should redirect to landing page
3. Try accessing `/dashboard` directly
4. Should redirect to login (protected route)

---

## Monitoring

### Backend Logs

Watch the backend terminal for:
- MongoDB connection status
- API requests
- Errors and warnings

### Frontend Console

Open browser DevTools to see:
- API requests
- Authentication state
- Any errors

---

## Production Deployment (Future)

When ready to deploy:

1. **Backend:**
   - Deploy to Heroku, Railway, or Render
   - Update `MONGODB_URI` to production database
   - Set `NODE_ENV=production`
   - Update `CLIENT_URL` to production frontend URL

2. **Frontend:**
   - Deploy to Vercel, Netlify, or similar
   - Update `VITE_API_URL` to production backend URL
   - Run `npm run build`

---

## Need Help?

### Check These Files:
- `backend/START-HERE.md` - Backend setup guide
- `backend/test-endpoints.md` - API documentation
- `backend/README.md` - Backend documentation

### Common Commands:
```powershell
# Backend
cd backend
npm install          # Install dependencies
npm run dev          # Start development server
npm start            # Start production server
.\test-api.ps1       # Test API endpoints

# Frontend
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

---

## Success Checklist

- ✅ Backend running on port 5000
- ✅ Frontend running on port 5173
- ✅ MongoDB connected
- ✅ Can register new users
- ✅ Can login with credentials
- ✅ Can access dashboard after login
- ✅ Can logout successfully
- ✅ Protected routes work correctly

**If all checked, you're ready to develop! 🎉**
