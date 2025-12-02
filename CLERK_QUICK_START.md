# 🔐 Clerk Authentication - Quick Reference

## 🚀 Quick Start

### 1. Get Clerk API Keys
1. Sign up at [clerk.com](https://clerk.com)
2. Create a new application
3. Copy your **Publishable Key** (pk_test_...)
4. Copy your **Secret Key** (sk_test_...)

### 2. Configure Environment Variables

**Frontend** (`synceditor/.env`):
```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
```

**Backend** (`Server/.env`):
```bash
CLERK_SECRET_KEY=sk_test_your_secret_key_here
CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
```

### 3. Start the Application
```bash
# Terminal 1 - Backend
cd Server
npm run dev

# Terminal 2 - Frontend
cd synceditor
npm run dev
```

### 4. Test Authentication
- Visit `http://localhost:5173`
- You'll be redirected to `/sign-in`
- Create an account or sign in
- Access the editor and create/join rooms

---

## 📁 New Files Created

### Frontend
- `src/components/ClerkProviderWrapper.jsx` - Clerk provider
- `src/components/SignInPage.jsx` - Sign-in page
- `src/components/SignUpPage.jsx` - Sign-up page

### Backend
- `middleware/clerkAuth.js` - Authentication middleware

### Documentation
- `CLERK_SETUP.md` - Complete setup guide

---

## 🔑 Key Features

✅ **User Authentication** - Sign up, sign in, sign out
✅ **Protected Routes** - Only authenticated users can access editor
✅ **Authenticated WebSockets** - Secure Socket.IO connections
✅ **User Profiles** - Avatar and name from Clerk
✅ **Session Management** - Automatic token refresh

---

## 🛠️ Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/sign-in` | Public | Sign in page |
| `/sign-up` | Public | Sign up page |
| `/` | Protected | Home page (room creation) |
| `/room` | Protected | Collaborative editor |

---

## 🐛 Troubleshooting

### "Missing Clerk Publishable Key"
→ Add `VITE_CLERK_PUBLISHABLE_KEY` to `synceditor/.env`

### "Authentication required" (Socket.IO)
→ Add `CLERK_SECRET_KEY` to `Server/.env`

### "Invalid or expired token"
→ Sign out and sign in again

---

## 📚 Full Documentation

- **[Complete Setup Guide](CLERK_SETUP.md)** - Detailed instructions
- **[Walkthrough](../.gemini/antigravity/brain/54d171ad-b0fc-4adb-9b38-a2bab438ba30/walkthrough.md)** - All changes made
- **[Main README](README.md)** - Project overview

---

## 🔒 Security Notes

- ⚠️ Never commit `.env` files
- ⚠️ Use test keys for development
- ⚠️ Use live keys for production
- ⚠️ Rotate keys if compromised

---

**Need Help?** Check [CLERK_SETUP.md](CLERK_SETUP.md) for detailed troubleshooting
