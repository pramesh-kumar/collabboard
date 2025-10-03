# Deployment Guide

## Frontend Deployment (Vercel)

### 1. Connect Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select the `frontend` folder as root directory

### 2. Environment Variables
Set these in Vercel dashboard:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_BACKEND_URL=https://your-backend-url.com
```

### 3. Build Settings
- Framework Preset: Vite
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`

## Backend Deployment (Render)

### 1. Connect Repository
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure service:
   - Name: `collabboard-backend`
   - Root Directory: `backend`
   - Runtime: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

### 2. Environment Variables
Set these in Render dashboard:
```
PORT=10000
FRONTEND_URL=https://your-frontend-url.vercel.app
NODE_ENV=production
```

### 3. Free Tier Limitations
- Service spins down after 15 minutes of inactivity
- Cold start delay (~30 seconds)
- 750 hours/month free usage

## Firebase Setup for Production

### 1. Authentication
1. Go to Firebase Console
2. Enable Authentication
3. Add authorized domains:
   - `your-domain.vercel.app`
   - `localhost` (for development)

### 2. Security Rules
Update Firebase security rules if using Firestore:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Domain Configuration

### Custom Domain (Optional)
1. **Vercel**: Add custom domain in project settings
2. **Railway**: Configure custom domain in service settings
3. **DNS**: Point your domain to the deployment URLs

## SSL/HTTPS
Both Vercel and Railway provide automatic HTTPS certificates.

## Monitoring and Logs

### Vercel
- View deployment logs in Vercel dashboard
- Use Vercel Analytics for performance monitoring

### Render
- View application logs in Render dashboard
- Monitor service health and performance

## Environment-Specific Configurations

### Development
```bash
# Frontend
VITE_BACKEND_URL=http://localhost:3001

# Backend
FRONTEND_URL=http://localhost:5173
```

### Production
```bash
# Frontend
VITE_BACKEND_URL=https://your-backend.onrender.com

# Backend
FRONTEND_URL=https://your-frontend.vercel.app
```

## Troubleshooting

### Common Issues
1. **CORS Errors**: Ensure FRONTEND_URL is correctly set in backend
2. **WebSocket Connection**: Check if deployment platform supports WebSockets
3. **Firebase Auth**: Verify authorized domains in Firebase console
4. **Build Failures**: Check Node.js version compatibility

### WebRTC Considerations
- WebRTC requires HTTPS in production
- Some corporate firewalls may block WebRTC
- Consider TURN servers for better connectivity

## Performance Optimization

### Frontend
- Enable Vercel's Edge Network
- Use Vercel Analytics
- Optimize bundle size with tree-shaking

### Backend
- Render auto-scales on paid plans
- Implement connection pooling for database connections
- Consider upgrading to paid plan for always-on service

## Backup and Recovery
- Firebase handles authentication backup
- Consider backing up room data if implementing persistence
- Monitor deployment health with uptime services