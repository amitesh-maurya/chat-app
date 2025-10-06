# 💬 ChatApp - Real-time Chat Application# Real-Time Chat Application# Turborepo starter



A modern, responsive real-time chat application built with **Next.js**, **Express.js**, **WebSocket**, and **Prisma**. Features include emoji support, voice messages, image attachments, typing indicators, online/offline status, and profile management.



## 🚀 OverviewA WhatsApp-like real-time chat application built with a modern monorepo architecture using Turborepo.This Turborepo starter is maintained by the Turborepo core team.



This is a full-stack chat application that demonstrates modern web development practices with a **Turborepo monorepo** structure. The application features a responsive design that works seamlessly across desktop, tablet, and mobile devices.



### ✨ Key Features## 🏗️ Architecture## Using this example



- 📱 **Responsive Design** - Mobile-first approach with sliding sidebar navigation

- 💬 **Real-time Messaging** - Instant message delivery with WebSocket

- 😀 **Emoji Support** - Rich emoji picker and reactionsThis project follows a monorepo structure with the following apps and packages:Run the following command:

- 🎤 **Voice Messages** - Record and send voice messages

- 🖼️ **Image Attachments** - Upload and share images

- ⌨️ **Typing Indicators** - See when friends are typing

- 🟢 **Online/Offline Status** - Real-time presence indicators### Apps```sh

- 👤 **Profile Management** - Update profile picture and status

- 🔐 **Authentication** - Secure user registration and login- **`apps/frontend`** - Next.js frontend with real-time chat interfacenpx create-turbo@latest

- 👥 **Friend System** - Send and manage friend requests

- **`apps/backend`** - Express.js HTTP API server for authentication and data```

## 📁 Folder Structure

- **`apps/ws`** - WebSocket server for real-time messaging and notifications

```

chat-app/## What's inside?

├── apps/

│   ├── frontend/          # Next.js frontend application### Packages

│   │   ├── app/           # App router pages

│   │   ├── components/    # React components- **`packages/db`** - Shared Prisma client and database schemaThis Turborepo includes the following packages/apps:

│   │   ├── lib/           # Utilities, stores, and hooks

│   │   └── public/        # Static assets- **`packages/ui`** - Shared React UI components

│   ├── backend/           # Express.js API server

│   │   ├── src/           # Source code- **`packages/eslint-config`** - Shared ESLint configurations### Apps and Packages

│   │   ├── routes/        # API routes

│   │   └── uploads/       # File uploads directory- **`packages/typescript-config`** - Shared TypeScript configurations

│   └── ws/                # WebSocket server

│       └── src/           # WebSocket server source- `docs`: a [Next.js](https://nextjs.org/) app

├── packages/

│   ├── db/                # Prisma database package## ✨ Features- `web`: another [Next.js](https://nextjs.org/) app

│   │   └── prisma/        # Database schema and migrations

│   ├── eslint-config/     # Shared ESLint configuration- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications

│   ├── typescript-config/ # Shared TypeScript configuration

│   └── ui/                # Shared UI components### Core Features- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)

├── .env.example           # Environment variables template

├── package.json           # Root package.json- ✅ User authentication (signup/login) with JWT- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

├── turbo.json             # Turborepo configuration

└── README.md              # This file- ✅ Friend request system (send, receive, accept, reject)

```

- ✅ Real-time messaging using WebSocket and Redis Pub/SubEach package/app is 100% [TypeScript](https://www.typescriptlang.org/).

## 🛠️ Tech Stack

- ✅ Friend list management

### Frontend

- **Next.js 14** - React framework with App Router- ✅ Message read receipts### Utilities

- **TypeScript** - Type-safe JavaScript

- **Tailwind CSS** - Utility-first CSS framework- ✅ Online status indicators

- **Zustand** - Lightweight state management

- **React Hook Form** - Form handling- ✅ Typing indicatorsThis Turborepo has some additional tools already setup for you:

- **Zod** - Schema validation

- **React Hot Toast** - Toast notifications



### Backend### Creative Feature: Message Reactions 💡- [TypeScript](https://www.typescriptlang.org/) for static type checking

- **Express.js** - Node.js web framework

- **TypeScript** - Type-safe JavaScriptUsers can react to messages with emojis (👍, ❤️, 😂, 😮, 😢, 😡, 🔥, 👏). Reactions are:- [ESLint](https://eslint.org/) for code linting

- **Prisma** - Database ORM

- **SQLite** - Database (easily switchable to PostgreSQL/MySQL)- Stored in the database with user attribution- [Prettier](https://prettier.io) for code formatting

- **bcryptjs** - Password hashing

- **jsonwebtoken** - JWT authentication- Displayed in real-time to all conversation participants

- **multer** - File upload handling

- **helmet** - Security middleware- Shown as badges below messages with hover tooltips### Build



### WebSocket- Added via an emoji picker that appears on message hover

- **ws** - WebSocket library for real-time communication

- **TypeScript** - Type-safe JavaScriptTo build all apps and packages, run the following command:



### Development## 🛠️ Tech Stack

- **Turborepo** - Monorepo build system

- **ESLint** - Code linting```

- **Prettier** - Code formatting

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSScd my-turborepo

## 🚀 Getting Started

- **Backend**: Node.js, Express.js, TypeScript

### Prerequisites

- **WebSocket**: Node.js with `ws` library# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)

- **Node.js** (v18 or higher)

- **npm** or **yarn**- **Database**: PostgreSQL with Prisma ORMturbo build

- **Git**

- **Real-time**: Redis Pub/Sub

### 1. Clone the Repository

- **Authentication**: JWT tokens with secure cookies# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager

```bash

git clone <repository-url>- **Monorepo**: Turboreponpx turbo build

cd chat-app

```- **Form Handling**: React Hook Form with Zod validationyarn dlx turbo build



### 2. Install Dependenciespnpm exec turbo build



```bash## 🚀 Getting Started```

npm install

```



### 3. Environment Setup### PrerequisitesYou can build a specific package by using a [filter](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters):



Copy the environment variables template and configure:- Node.js 18+ 



```bash- PostgreSQL database```

cp .env.example .env

```- Redis server# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)



Edit the `.env` file with your configuration:- npm/yarnturbo build --filter=docs



```env

# Database

DATABASE_URL="file:./dev.db"### Installation# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager



# JWT Secretnpx turbo build --filter=docs

JWT_SECRET="your-super-secret-jwt-key-here"

1. **Clone and install dependencies**yarn exec turbo build --filter=docs

# API Configuration

API_PORT=3001   ```bashpnpm exec turbo build --filter=docs

FRONTEND_URL="http://localhost:3000"

   git clone <repository>```

# WebSocket Configuration

WS_PORT=3002   cd chat-app



# File Upload Configuration   npm install### Develop

UPLOAD_DIR="uploads"

MAX_FILE_SIZE=10485760   ```

```

To develop all apps and packages, run the following command:

### 4. Database Setup

2. **Set up environment variables**

Generate the Prisma client and setup the database:

   ```bash```

```bash

# Navigate to the database package   cp .env.example .envcd my-turborepo

cd packages/db

   ```

# Generate Prisma client

npx prisma generate   # With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)



# Create and migrate the database   Update the `.env` file with your database and Redis credentials:turbo dev

npx prisma db push

   ```env

# (Optional) Seed the database

npx prisma db seed   DATABASE_URL="postgresql://username:password@localhost:5432/chatapp"# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager



# Return to root directory   JWT_SECRET="your-jwt-secret-key-here"npx turbo dev

cd ../..

```   REDIS_URL="redis://localhost:6379"yarn exec turbo dev



### 5. Start All Services   ```pnpm exec turbo dev



Start all applications in development mode:```



```bash3. **Set up the database**

npm run dev

```   ```bashYou can develop a specific package by using a [filter](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters):



This will start:   # Generate Prisma client

- **Frontend**: http://localhost:3000

- **Backend API**: http://localhost:3001   cd packages/db```

- **WebSocket Server**: http://localhost:3002

   npx prisma generate# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)

### 6. Access the Application

   turbo dev --filter=web

Open your browser and navigate to:

- **Main App**: http://localhost:3000   # Push database schema

- **API Documentation**: http://localhost:3001/api (if implemented)

   npx prisma db push# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager

## 🏃‍♂️ Running Individual Applications

   npx turbo dev --filter=web

### Frontend (Next.js)

   # (Optional) Open Prisma Studioyarn exec turbo dev --filter=web

```bash

cd apps/frontend   npx prisma studiopnpm exec turbo dev --filter=web

npm run dev

# Runs on http://localhost:3000   ``````

```



### Backend (Express.js)

4. **Start development servers**### Remote Caching

```bash

cd apps/backend   ```bash

npm run dev

# Runs on http://localhost:3001   # Start all apps in development mode> [!TIP]

```

   npm run dev> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

### WebSocket Server

   ```

```bash

cd apps/ws   Turborepo can use a technique known as [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

npm run dev

# Runs on http://localhost:3002   This will start:

```

   - Frontend: http://localhost:3000By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

### Database Management

   - Backend API: http://localhost:3001

```bash

cd packages/db   - WebSocket server: ws://localhost:3002```



# View database in Prisma Studiocd my-turborepo

npx prisma studio

### Production Build

# Reset database

npx prisma db push --force-reset# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)



# Generate client after schema changes```bashturbo login

npx prisma generate

```# Build all apps



## 📱 Mobile Developmentnpm run build# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager



The application is fully responsive and can be tested on mobile devices:npx turbo login



1. **Find your local IP address**:# Start production serversyarn exec turbo login

   ```bash

   ipconfig  # Windowsnpm run startpnpm exec turbo login

   ifconfig  # macOS/Linux

   `````````



2. **Update your .env file**:

   ```env

   FRONTEND_URL="http://YOUR_IP:3000"## 🧪 API EndpointsThis will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

   ```



3. **Access from mobile**:

   - Open `http://YOUR_IP:3000` on your mobile device### AuthenticationNext, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

   - Ensure your mobile device is on the same network

- `POST /auth/signup` - Create new user account

## 🔧 Development Scripts

- `POST /auth/login` - Login user```

```bash

# Install dependencies for all packages# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)

npm install

### Friendsturbo link

# Start all apps in development mode

npm run dev- `POST /friends/request` - Send friend request



# Build all packages- `POST /friends/respond` - Accept/reject friend request# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager

npm run build

- `GET /friends` - Get user's friendsnpx turbo link

# Lint all packages

npm run lint- `GET /friends/requests` - Get pending friend requestsyarn exec turbo link



# Type check all packagespnpm exec turbo link

npm run type-check

### Messages```

# Clean all build artifacts

npm run clean- `GET /messages/:friendId` - Get messages with a friend

```

- `POST /messages/send` - Send a message## Useful Links

## 📊 Database Schema

- `POST /messages/reaction` - Add/remove reaction to message

The application uses **Prisma** with **SQLite** for development. The main entities are:

Learn more about the power of Turborepo:

- **User** - User accounts with authentication

- **Friend** - Friend relationships between users## 🔄 Real-time Events (WebSocket)

- **FriendRequest** - Pending friend requests

- **Message** - Chat messages with support for text, images, and voice- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)

- **MessageReaction** - Emoji reactions to messages

- `NEW_MESSAGE` - Real-time message delivery- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)

See `packages/db/prisma/schema.prisma` for the complete schema.

- `NEW_FRIEND_REQUEST` - Friend request notifications- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)

## 🔐 Authentication

- `FRIEND_REQUEST_ACCEPTED` - Friend request acceptance- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)

The application uses **JWT-based authentication**:

- `TYPING_START/STOP` - Typing indicators- [Configuration Options](https://turborepo.com/docs/reference/configuration)

1. Users register/login with username and password

2. Server returns a JWT token- `MESSAGE_REACTION` - Real-time emoji reactions- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)

3. Token is stored in the frontend state

4. Token is sent with each API request

5. WebSocket connections are authenticated using the same token## 📱 Usage



## 📡 Real-time Features1. **Sign up** for a new account or **login** with existing credentials

2. **Send friend requests** using usernames

**WebSocket** server handles:3. **Accept/reject** incoming friend requests from the requests tab

- Real-time message delivery4. **Start chatting** by selecting a friend from the sidebar

- Typing indicators5. **React to messages** by hovering over them and clicking the emoji button

- Online/offline status6. **See real-time updates** for new messages, typing indicators, and reactions

- Friend request notifications

- Message reactions## 🏃‍♂️ Development



## 🎨 UI/UX Features### Project Structure

```

- **Responsive Design**: Mobile-first approach with breakpointschat-app/

- **Modern UI**: Gradient backgrounds, rounded corners, shadows├── apps/

- **Dark Mode Ready**: Designed with theme support in mind│   ├── frontend/     # Next.js app

- **Accessibility**: ARIA labels, keyboard navigation│   ├── backend/      # Express API

- **Touch Friendly**: Optimized for mobile interactions│   └── ws/           # WebSocket server

├── packages/

## 🛡️ Security Features│   ├── db/           # Prisma schema & client

│   ├── ui/           # Shared components

- Password hashing with bcryptjs│   ├── eslint-config/

- JWT token authentication│   └── typescript-config/

- File upload validation└── turbo.json        # Turborepo config

- CORS configuration```

- Helmet security headers

- Input sanitization### Available Scripts

- `npm run dev` - Start development servers

## 🚀 Deployment- `npm run build` - Build all packages and apps

- `npm run lint` - Lint all packages

### Frontend (Vercel/Netlify)- `npm run check-types` - Type check all packages

1. Build the frontend: `cd apps/frontend && npm run build`

2. Deploy the `apps/frontend` directory## 🌟 Key Highlights

3. Set environment variables in your hosting platform

1. **Monorepo Architecture** - Clean separation of concerns with shared packages

### Backend (Railway/Render/Heroku)2. **Real-time Communication** - WebSocket + Redis for instant messaging

1. Build the backend: `cd apps/backend && npm run build`3. **Modern Stack** - Latest Next.js, React, and TypeScript

2. Deploy with your preferred platform4. **Scalable Database Design** - Proper relationships for users, friends, and messages

3. Set up environment variables5. **Creative Feature** - Interactive emoji reactions with real-time updates

4. Configure database (PostgreSQL for production)6. **Production Ready** - Error handling, validation, and security best practices



### Database (Production)## 📝 License

For production, switch to PostgreSQL:

```envThis project is built for educational and demonstration purposes.
DATABASE_URL="postgresql://username:password@localhost:5432/chatapp"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**:
   ```bash
   # Kill processes on specific ports
   npx kill-port 3000 3001 3002
   ```

2. **Database issues**:
   ```bash
   cd packages/db
   npx prisma db push --force-reset
   npx prisma generate
   ```

3. **WebSocket connection issues**:
   - Check if the WebSocket server is running on port 3002
   - Verify CORS settings in the backend
   - Check browser developer tools for WebSocket errors

4. **File upload issues**:
   - Ensure the `uploads` directory exists in `apps/backend`
   - Check file size limits in `.env`
   - Verify file permissions

### Development Tips

- Use **Prisma Studio** for database visualization: `npx prisma studio`
- Check **Network tab** in browser dev tools for API issues
- Use **React Developer Tools** for component debugging
- Monitor **WebSocket** connections in browser dev tools

## 📞 Support

If you encounter any issues or have questions, please:
1. Check the troubleshooting section above
2. Search existing issues in the repository
3. Create a new issue with detailed information

---

**Happy Coding!** 🚀✨