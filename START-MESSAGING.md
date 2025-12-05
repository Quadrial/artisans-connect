# Quick Start Guide - Messaging System

## ✅ Dependencies Installed
- `socket.io` (backend) - Installed
- `socket.io-client` (frontend) - Installed

## 🚀 Start the Application

### 1. Start Backend Server
Open a terminal and run:
```bash
cd backend
npm start
```

You should see:
```
╔═══════════════════════════════════════╗
║   CraftConnect API Server Running     ║
║   Port: 5000                          ║
║   Environment: development            ║
║   Socket.IO: Enabled                  ║
╚═══════════════════════════════════════╝
```

### 2. Start Frontend (in a new terminal)
```bash
npm run dev
```

The app should now be running at `http://localhost:5173`

## 📱 How to Use Messaging

### For Testing:
1. **Create two user accounts** (one artisan, one customer)
2. **Post a job** as a customer
3. **Apply for the job** as an artisan
4. **Navigate to Messages page** (click Messages in sidebar)
5. **Start chatting!**

### Features Available:
- ✅ Real-time messaging
- ✅ Conversation list
- ✅ Unread message counts
- ✅ Search conversations
- ✅ Message timestamps
- ✅ Online/offline status
- ✅ User profiles with avatars

## 🔧 Troubleshooting

### If messages don't appear in real-time:
1. Check browser console for Socket.IO connection
2. Verify backend server is running
3. Check that both users are logged in
4. Refresh the page

### If you see "Socket disconnected":
- Backend server might not be running
- Check VITE_API_URL in .env file
- Ensure port 5000 is not blocked

### Common Issues:
- **Port already in use**: Change PORT in backend/.env
- **CORS errors**: Check CLIENT_URL in backend/.env
- **Socket not connecting**: Verify VITE_API_URL in frontend .env

## 📝 Environment Variables

### Backend (.env in backend folder)
```
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Frontend (.env in root folder)
```
VITE_API_URL=http://localhost:5000/api
```

## 🎯 Next Steps

The messaging system is fully functional! Users can now:
1. View all their conversations
2. Send and receive messages in real-time
3. See unread message counts
4. Search for specific conversations
5. View message history

Enjoy your new messaging feature! 🎉
