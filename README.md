# Chat Application

A real-time chat application built with modern web technologies, featuring user authentication, friend management, and live messaging capabilities.

## 🚀 Overview

This is a full-stack chat application that enables users to:
- Register and authenticate securely
- Add and manage friends
- Send real-time messages
- Share images and voice recordings
- Receive live notifications

## 🏗️ Tech Stack

- **Frontend**: Next.js 15.5.4, React, TypeScript, Tailwind CSS
- **Backend**: Express.js, TypeScript, JWT Authentication
- **WebSocket**: ws library for real-time communication
- **Database**: SQLite with Prisma ORM
- **Monorepo**: Turbo for workspace management

## 📁 Folder Structure

```
chat-app/
├── apps/
│   ├── backend/          # Express.js API server
│   │   ├── src/
│   │   │   ├── index.ts        # Main server file
│   │   │   ├── middleware/     # Auth middleware
│   │   │   └── routes/         # API routes (auth, friends, messages)
│   │   └── uploads/      # File uploads storage
│   ├── frontend/         # Next.js React application
│   │   ├── app/                # App router pages
│   │   ├── components/         # Reusable UI components
│   │   ├── lib/               # Utilities and stores
│   │   │   ├── stores/        # Zustand state management
│   │   │   └── hooks/         # Custom React hooks
│   │   └── public/            # Static assets
│   └── ws/              # WebSocket server
│       └── src/
│           └── index.ts       # WebSocket server implementation
├── packages/
│   ├── db/              # Database package
│   │   ├── prisma/
│   │   │   ├── schema.prisma  # Database schema
│   │   │   └── dev.db         # SQLite database file
│   │   └── src/
│   ├── ui/              # Shared UI components
│   ├── eslint-config/   # Shared ESLint configuration
│   └── typescript-config/ # Shared TypeScript configuration
├── .env                 # Environment variables
├── .env.example         # Environment variables template
├── turbo.json          # Turbo workspace configuration
└── package.json        # Root package configuration
```

## 🛠️ Prerequisites

- **Node.js** 18+ 
- **npm** 8+
- **Git**

## ⚡ Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/amitesh-maurya/chat-app.git
   cd chat-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up the database**
   ```bash
   npx prisma generate --schema=packages/db/prisma/schema.prisma
   npx prisma db push --schema=packages/db/prisma/schema.prisma
   ```

5. **Start all services**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - WebSocket: ws://localhost:3002

## 🔧 Running Individual Services

### Backend API Server

```bash
cd apps/backend
npm run dev
```

The backend server will start on http://localhost:3001

**Available endpoints:**
- `POST /auth/signup` - User registration
- `POST /auth/login` - User authentication
- `GET /friends` - Get friends list
- `POST /friends/request` - Send friend request
- `GET /messages/:friendshipId` - Get chat messages
- `POST /messages` - Send message

### Frontend Application

```bash
cd apps/frontend
npm run dev
```

The frontend will start on http://localhost:3000

**Features:**
- User authentication (login/signup)
- Real-time chat interface
- Friend management
- Image and voice message support
- Responsive design

### WebSocket Server

```bash
cd apps/ws
npm run dev
```

The WebSocket server will start on port 3002

**Capabilities:**
- Real-time message broadcasting
- User presence tracking
- Typing indicators
- Connection management with JWT authentication

## 📊 Database Schema

The application uses Prisma ORM with SQLite. The complete schema is located at:

**`packages/db/prisma/schema.prisma`**

### Main Models:

- **User**: User accounts and profiles
  ```prisma
  model User {
    id        String   @id @default(cuid())
    email     String   @unique
    username  String   @unique
    password  String
    avatar    String?
    status    String?
    isOnline  Boolean  @default(false)
    lastSeen  DateTime @default(now())
    // ... relationships
  }
  ```

- **Friendship**: Friend relationships between users
  ```prisma
  model Friendship {
    id        String   @id @default(cuid())
    user1Id   String
    user2Id   String
    createdAt DateTime @default(now())
    // ... relationships and constraints
  }
  ```

- **FriendRequest**: Pending friend requests
  ```prisma
  model FriendRequest {
    id         String              @id @default(cuid())
    senderId   String
    receiverId String
    status     FriendRequestStatus @default(PENDING)
    createdAt  DateTime            @default(now())
    // ... relationships
  }
  ```

- **Message**: Chat messages with support for text, images, and audio
  ```prisma
  model Message {
    id           String      @id @default(cuid())
    content      String?
    type         MessageType @default(TEXT)
    friendshipId String
    senderId     String
    createdAt    DateTime    @default(now())
    // ... relationships
  }
  ```

- **MessageReaction**: Message reactions/emojis
  ```prisma
  model MessageReaction {
    id        String   @id @default(cuid())
    messageId String
    userId    String
    emoji     String
    createdAt DateTime @default(now())
    // ... relationships
  }
  ```

### Key Relationships:

- Users can have multiple friendships
- Friendships contain multiple messages
- Messages can have reactions
- Friend requests track pending connections

### Database Commands:

```bash
# Generate Prisma client
npx prisma generate --schema=packages/db/prisma/schema.prisma

# Apply schema changes to database
npx prisma db push --schema=packages/db/prisma/schema.prisma

# Open Prisma Studio (database browser)
npx prisma studio --schema=packages/db/prisma/schema.prisma

# Reset database (caution: deletes all data)
npx prisma migrate reset --schema=packages/db/prisma/schema.prisma
```

## 🔒 Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Database
DATABASE_URL="file:d:/path/to/your/project/packages/db/prisma/dev.db"

# JWT Secret for authentication
JWT_SECRET="your-secure-jwt-secret-key"

# Redis (optional - for production scaling)
REDIS_URL="redis://localhost:6379"

# Server Ports
PORT=3001              # Backend API port
WS_PORT=3002          # WebSocket server port
FRONTEND_URL="http://localhost:3000"
```

## 🧪 Development Commands

```bash
# Install all dependencies
npm install

# Start all services in development mode
npm run dev

# Build all packages
npm run build

# Type checking
npm run type-check

# Lint code
npm run lint

# Database operations
npx prisma generate --schema=packages/db/prisma/schema.prisma
npx prisma db push --schema=packages/db/prisma/schema.prisma
npx prisma studio --schema=packages/db/prisma/schema.prisma
```

## 📝 API Documentation

### Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Message Types

The application supports multiple message types:
- `text`: Plain text messages
- `image`: Image files (PNG, JPG, GIF)
- `audio`: Voice recordings (WebM, MP3)

### WebSocket Events

- `message`: New message received
- `typing`: User typing indicator
- `user_status`: User online/offline status
- `friend_request`: New friend request received

## 🚀 Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set production environment variables**
   ```bash
   NODE_ENV=production
   DATABASE_URL="your-production-database-url"
   JWT_SECRET="your-production-jwt-secret"
   REDIS_URL="your-production-redis-url"
   ```

3. **Start production servers**
   ```bash
   # Backend
   cd apps/backend && npm start
   
   # WebSocket
   cd apps/ws && npm start
   
   # Frontend (if self-hosting)
   cd apps/frontend && npm start
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues:

1. **Port already in use**
   ```bash
   # Kill processes on ports 3000, 3001, 3002
   npx kill-port 3000 3001 3002
   ```

2. **Database connection issues**
   ```bash
   # Regenerate Prisma client
   npx prisma generate --schema=packages/db/prisma/schema.prisma
   ```

3. **WebSocket connection failed**
   - Check if WebSocket server is running on port 3002
   - Verify JWT token is valid
   - Check browser console for detailed error messages

4. **Build failures**
   ```bash
   # Clean install
   rm -rf node_modules package-lock.json
   npm install
   ```

## 📞 Support

If you encounter any issues or have questions:
- Create an issue on GitHub
- Check the troubleshooting section above
- Review the logs in your terminal for error details

---

**Happy coding! 🎉**

- ✅ Friend list management

- ✅ Message read receipts### Utilities

- ✅ Online status indicators

- ✅ Typing indicatorsThis Turborepo has some additional tools already setup for you:



### Creative Feature: Message Reactions 💡- [TypeScript](https://www.typescriptlang.org/) for static type checking

Users can react to messages with emojis (👍, ❤️, 😂, 😮, 😢, 😡, 🔥, 👏). Reactions are:- [ESLint](https://eslint.org/) for code linting

- Stored in the database with user attribution- [Prettier](https://prettier.io) for code formatting

- Displayed in real-time to all conversation participants

- Shown as badges below messages with hover tooltips### Build

- Added via an emoji picker that appears on message hover

To build all apps and packages, run the following command:

## 🛠️ Tech Stack

```

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSScd my-turborepo

- **Backend**: Node.js, Express.js, TypeScript

- **WebSocket**: Node.js with `ws` library# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)

- **Database**: PostgreSQL with Prisma ORMturbo build

- **Real-time**: Redis Pub/Sub

- **Authentication**: JWT tokens with secure cookies# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager

- **Monorepo**: Turboreponpx turbo build

- **Form Handling**: React Hook Form with Zod validationyarn dlx turbo build

pnpm exec turbo build

## 🚀 Getting Started```



### PrerequisitesYou can build a specific package by using a [filter](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters):

- Node.js 18+ 

- PostgreSQL database```

- Redis server# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)

- npm/yarnturbo build --filter=docs



### Installation# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager

npx turbo build --filter=docs

1. **Clone and install dependencies**yarn exec turbo build --filter=docs

   ```bashpnpm exec turbo build --filter=docs

   git clone <repository>```

   cd chat-app

   npm install### Develop

   ```

To develop all apps and packages, run the following command:

2. **Set up environment variables**

   ```bash```

   cp .env.example .envcd my-turborepo

   ```

   # With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)

   Update the `.env` file with your database and Redis credentials:turbo dev

   ```env

   DATABASE_URL="postgresql://username:password@localhost:5432/chatapp"# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager

   JWT_SECRET="your-jwt-secret-key-here"npx turbo dev

   REDIS_URL="redis://localhost:6379"yarn exec turbo dev

   ```pnpm exec turbo dev

```

3. **Set up the database**

   ```bashYou can develop a specific package by using a [filter](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters):

   # Generate Prisma client

   cd packages/db```

   npx prisma generate# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)

   turbo dev --filter=web

   # Push database schema

   npx prisma db push# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager

   npx turbo dev --filter=web

   # (Optional) Open Prisma Studioyarn exec turbo dev --filter=web

   npx prisma studiopnpm exec turbo dev --filter=web

   ``````



4. **Start development servers**### Remote Caching

   ```bash

   # Start all apps in development mode> [!TIP]

   npm run dev> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

   ```

   Turborepo can use a technique known as [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

   This will start:

   - Frontend: http://localhost:3000By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

   - Backend API: http://localhost:3001

   - WebSocket server: ws://localhost:3002```

cd my-turborepo

### Production Build

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)

```bashturbo login

# Build all apps

npm run build# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager

npx turbo login

# Start production serversyarn exec turbo login

npm run startpnpm exec turbo login

``````



## 🧪 API EndpointsThis will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).



### AuthenticationNext, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

- `POST /auth/signup` - Create new user account

- `POST /auth/login` - Login user```

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)

### Friendsturbo link

- `POST /friends/request` - Send friend request

- `POST /friends/respond` - Accept/reject friend request# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager

- `GET /friends` - Get user's friendsnpx turbo link

- `GET /friends/requests` - Get pending friend requestsyarn exec turbo link

pnpm exec turbo link

### Messages```

- `GET /messages/:friendId` - Get messages with a friend

- `POST /messages/send` - Send a message## Useful Links

- `POST /messages/reaction` - Add/remove reaction to message

Learn more about the power of Turborepo:

## 🔄 Real-time Events (WebSocket)

- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)

- `NEW_MESSAGE` - Real-time message delivery- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)

- `NEW_FRIEND_REQUEST` - Friend request notifications- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)

- `FRIEND_REQUEST_ACCEPTED` - Friend request acceptance- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)

- `TYPING_START/STOP` - Typing indicators- [Configuration Options](https://turborepo.com/docs/reference/configuration)

- `MESSAGE_REACTION` - Real-time emoji reactions- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)


## 📱 Usage

1. **Sign up** for a new account or **login** with existing credentials
2. **Send friend requests** using usernames
3. **Accept/reject** incoming friend requests from the requests tab
4. **Start chatting** by selecting a friend from the sidebar
5. **React to messages** by hovering over them and clicking the emoji button
6. **See real-time updates** for new messages, typing indicators, and reactions

## 🏃‍♂️ Development

### Project Structure
```
chat-app/
├── apps/
│   ├── frontend/     # Next.js app
│   ├── backend/      # Express API
│   └── ws/           # WebSocket server
├── packages/
│   ├── db/           # Prisma schema & client
│   ├── ui/           # Shared components
│   ├── eslint-config/
│   └── typescript-config/
└── turbo.json        # Turborepo config
```

### Available Scripts
- `npm run dev` - Start development servers
- `npm run build` - Build all packages and apps
- `npm run lint` - Lint all packages
- `npm run check-types` - Type check all packages

## 🌟 Key Highlights

1. **Monorepo Architecture** - Clean separation of concerns with shared packages
2. **Real-time Communication** - WebSocket + Redis for instant messaging
3. **Modern Stack** - Latest Next.js, React, and TypeScript
4. **Scalable Database Design** - Proper relationships for users, friends, and messages
5. **Creative Feature** - Interactive emoji reactions with real-time updates
6. **Production Ready** - Error handling, validation, and security best practices

## 📝 License

This project is built for educational and demonstration purposes.
