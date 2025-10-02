# Deployment Guide

## Frontend Deployment (Vercel)

1. **Push to GitHub** (already done)
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select the `frontend` folder as root directory
   - Set build command: `npm run build`
   - Set output directory: `dist`

3. **Environment Variables** (Add in Vercel dashboard):
   ```
   VITE_FIREBASE_API_KEY=your_actual_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_BACKEND_URL=https://your-backend-url.railway.app
   ```

## Backend Deployment (Railway)

1. **Connect to Railway**:
   - Go to [railway.app](https://railway.app)
   - Import your GitHub repository
   - Select the `backend` folder as root directory

2. **Environment Variables** (Add in Railway dashboard):
   ```
   PORT=3001
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

3. **Build Settings**:
   - Build Command: `cd backend && npm install && npm run build`
   - Start Command: `cd backend && npm start`

## Alternative: Render Deployment

### Frontend (Render Static Site)
- Build Command: `cd frontend && npm install && npm run build`
- Publish Directory: `frontend/dist`

### Backend (Render Web Service)
- Build Command: `cd backend && npm install && npm run build`
- Start Command: `cd backend && npm start`

## Post-Deployment Steps

1. Update CORS settings in backend with your frontend URL
2. Update Firebase authorized domains with your deployed URLs
3. Test all features including real-time functionality
4. Monitor logs for any deployment issues

## Quick Deploy Commands

```bash
# Update environment variables
git add .
git commit -m "Update deployment configuration"
git push origin main

# Deployments will trigger automatically
```