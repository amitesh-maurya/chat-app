# Real-Time Chat Application# Turborepo starter



A WhatsApp-like real-time chat application built with a modern monorepo architecture using Turborepo.This Turborepo starter is maintained by the Turborepo core team.



## 🏗️ Architecture## Using this example



This project follows a monorepo structure with the following apps and packages:Run the following command:



### Apps```sh

- **`apps/frontend`** - Next.js frontend with real-time chat interfacenpx create-turbo@latest

- **`apps/backend`** - Express.js HTTP API server for authentication and data```

- **`apps/ws`** - WebSocket server for real-time messaging and notifications

## What's inside?

### Packages

- **`packages/db`** - Shared Prisma client and database schemaThis Turborepo includes the following packages/apps:

- **`packages/ui`** - Shared React UI components

- **`packages/eslint-config`** - Shared ESLint configurations### Apps and Packages

- **`packages/typescript-config`** - Shared TypeScript configurations

- `docs`: a [Next.js](https://nextjs.org/) app

## ✨ Features- `web`: another [Next.js](https://nextjs.org/) app

- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications

### Core Features- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)

- ✅ User authentication (signup/login) with JWT- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

- ✅ Friend request system (send, receive, accept, reject)

- ✅ Real-time messaging using WebSocket and Redis Pub/SubEach package/app is 100% [TypeScript](https://www.typescriptlang.org/).

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