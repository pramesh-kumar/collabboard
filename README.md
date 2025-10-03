# CollabBoard - Real-Time Collaborative Whiteboard

A modern, real-time collaborative whiteboard application built with React, TypeScript, and Socket.IO.

## Features

- 🔐 **Authentication**: Firebase Auth with Google and email/password
- 🎨 **Real-time Drawing**: Collaborative whiteboard with brush tools
- 👥 **Role-Based Access**: Admin, Editor, and Viewer roles
- 💬 **Live Chat**: Real-time messaging in rooms
- 📱 **Responsive Design**: Material UI with custom theming
- 🧪 **Testing**: Comprehensive E2E and unit tests

## Tech Stack

### Frontend
- React 18 + TypeScript
- Material UI (MUI)
- Zustand (State Management)
- React Query (Server State)
- Socket.IO Client
- Firebase Authentication
- Vite (Build Tool)

### Backend
- Node.js + Express
- Socket.IO (Real-time)
- TypeScript
- CORS enabled

### Testing
- Cypress (E2E Testing)
- Jest (Unit Testing)
- Testing Library

## Quick Start

### Prerequisites
- Node.js 18+
- Firebase project (free tier)
- Modern web browser with WebRTC support

### 1. Clone and Install

```bash
git clone <repository-url>
cd CollabBoard

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 2. Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication with Google and Email/Password providers
3. Copy your Firebase config

### 3. Environment Variables

**Frontend** (`frontend/.env`):
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_BACKEND_URL=http://localhost:3001
```

**Backend** (`backend/.env`):
```env
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### 4. Run the Application

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm run dev
```

Visit `http://localhost:5173` to use the application.

## Usage

1. **Sign In**: Use Google or email/password authentication
2. **Create Room**: Generate a new collaborative session
3. **Join Room**: Enter room ID to join existing session
4. **Draw**: Use brush tools to draw on the canvas
5. **Chat**: Communicate with other users in real-time
6. **Video Call**: Start peer-to-peer video calls with room participants
7. **Roles**: First user becomes admin, others are editors by default

### Drawing Tools
- **Brush**: Draw with customizable color and size
- **Eraser**: Remove drawings from canvas
- **Clear**: Admin/Editor can clear entire canvas
- **Color Palette**: 7 preset colors available
- **Size Slider**: Adjust brush/eraser size (1-20px)

### User Roles
- **Admin**: Full access (first user in room)
- **Editor**: Can draw, chat, and use video calls
- **Viewer**: Can only view and chat

## Testing

### Unit Tests
```bash
cd frontend
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### E2E Tests
```bash
cd frontend
npm run cypress:open  # Interactive mode
npm run cypress:run   # Headless mode
```

### Test Coverage
- Authentication flow
- Room creation and joining
- Real-time drawing synchronization
- Chat functionality
- Role-based access control
- Video calling features
- Canvas operations (draw, erase, clear)

## Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Backend (Render)
1. Connect repository to Render
2. Set environment variables
3. Deploy with automatic builds

## Architecture

### State Management
- **Zustand**: Client-side state (auth, whiteboard)
- **React Query**: Server state and caching
- **Socket.IO**: Real-time synchronization

### Real-time Features
- Canvas drawing synchronization
- User presence indicators
- Live chat messaging
- Role-based permissions

### Security
- Firebase Authentication
- CORS protection
- Role-based access control
- Input validation

## Performance Optimizations

- Lazy loading of components
- Canvas drawing optimization with requestAnimationFrame
- Efficient re-renders with Zustand state management
- Tree-shaking with Vite build tool
- Material UI component optimization
- WebRTC peer-to-peer connections (no server relay)
- Socket.IO event batching for drawing data
- Optimized canvas rendering with context reuse

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions, please create a GitHub issue or contact the development team.