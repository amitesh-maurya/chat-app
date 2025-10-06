# 🔧 Backend API Server

Express.js backend application providing REST API endpoints for authentication, friend management, and messaging.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# From the backend directory
npm install
```

### Environment Variables

The backend uses environment variables from the root `.env` file:

```env
# Database
DATABASE_URL="file:./dev.db"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key"

# API Configuration
API_PORT=3001
FRONTEND_URL="http://localhost:3000"

# File Upload Configuration
UPLOAD_DIR="uploads"
MAX_FILE_SIZE=10485760
```

### Development

```bash
npm run dev
```

The API server will start on <http://localhost:3001>

### Building for Production

```bash
npm run build
npm start
```

## 🏗️ Architecture

### Folder Structure

```text
apps/backend/
├── src/
│   ├── index.ts          # Main server file
│   ├── middleware/       # Express middleware
│   │   └── auth.ts       # JWT authentication
│   └── routes/           # API route handlers
│       ├── auth.ts       # Authentication routes
│       ├── friends.ts    # Friend management routes
│       └── messages.ts   # Messaging routes
├── uploads/              # File upload directory
└── package.json
```

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)

### Friends

- `GET /api/friends` - Get user's friends (protected)
- `POST /api/friends/request` - Send friend request (protected)
- `GET /api/friends/requests` - Get pending friend requests (protected)
- `POST /api/friends/respond` - Accept/reject friend request (protected)

### Messages

- `GET /api/messages/:friendId` - Get messages with a friend (protected)
- `POST /api/messages/:friendId` - Send message to friend (protected)
- `POST /api/messages/:messageId/reaction` - Add emoji reaction (protected)
- `POST /api/upload/image` - Upload image file (protected)
- `POST /api/upload/voice` - Upload voice message (protected)

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. Users register/login with username and password
2. Server returns a JWT token
3. Client includes token in Authorization header: `Bearer <token>`
4. Protected routes verify the token before processing requests

### Middleware

- **auth.ts**: Verifies JWT tokens and attaches user info to requests
- **helmet**: Security headers
- **cors**: Cross-origin resource sharing configuration
- **multer**: File upload handling

## 📁 File Uploads

The server handles file uploads for:

- **Images**: JPEG, PNG, GIF, WebP (max 10MB)
- **Voice Messages**: WebM, WAV, MP3, OGG (max 10MB)

Files are stored in the `uploads/` directory and served statically.

## 🛡️ Security Features

- Password hashing with bcryptjs
- JWT token authentication
- File upload validation (type and size)
- CORS configuration
- Helmet security headers
- Input sanitization

## 🔧 Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript type checking

## 🗄️ Database Integration

The backend uses Prisma ORM to interact with the database:

```typescript
import { PrismaClient } from '@repo/db';

const prisma = new PrismaClient();

// Example: Get user by ID
const user = await prisma.user.findUnique({
  where: { id: userId }
});
```

## 🔄 Development Workflow

1. Make changes to TypeScript files in `src/`
2. Server automatically restarts with nodemon
3. Test API endpoints using tools like Postman or curl
4. Check logs in the terminal for debugging

## 🚀 Production Deployment

### Environment Setup

```env
NODE_ENV=production
DATABASE_URL="postgresql://user:password@host:port/database"
JWT_SECRET="secure-random-string"
API_PORT=3001
```

### Deployment Steps

1. Build the application: `npm run build`
2. Set up database (PostgreSQL recommended)
3. Configure environment variables
4. Start the server: `npm start`
5. Set up reverse proxy (nginx) for HTTPS

## 🐛 Common Issues

### Port Already in Use

```bash
# Kill process on port 3001
npx kill-port 3001
```

### Database Connection Issues

- Check DATABASE_URL in environment variables
- Ensure database is running and accessible
- Verify Prisma client is generated

### File Upload Issues

- Ensure `uploads/` directory exists
- Check file permissions
- Verify file size limits in environment variables

## 📊 API Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful"
}
```

Error responses:

```json
{
  "success": false,
  "error": "Error message",
  "details": { /* additional error info */ }
}
```